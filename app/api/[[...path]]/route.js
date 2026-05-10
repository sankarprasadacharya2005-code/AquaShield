import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sqlite from '@/lib/sqlite'

const SEED_STATIONS = [
  { id: 'st-od-bbsr', name: 'Kanjia Lake Monitor', city: 'Bhubaneswar', district: 'Khordha', lat: 20.2961, lng: 85.8245, base: { ph: 7.2, turbidity: 2.5, temp: 32.5, do: 6.8, hospitalCases: 12, prevWeekCases: 10, complaints: 2, rainfall: 0 } },
  { id: 'st-od-ctc', name: 'Mahanadi River Station', city: 'Cuttack', district: 'Cuttack', lat: 20.4625, lng: 85.8828, base: { ph: 7.0, turbidity: 5.2, temp: 31.0, do: 5.4, hospitalCases: 25, prevWeekCases: 22, complaints: 8, rainfall: 15 } },
  { id: 'st-od-rkl', name: 'Brahmani River Monitor', city: 'Rourkela', district: 'Sundargarh', lat: 22.2604, lng: 84.8536, base: { ph: 7.4, turbidity: 4.8, temp: 33.2, do: 6.1, hospitalCases: 18, prevWeekCases: 20, complaints: 5, rainfall: 5 } },
  { id: 'st-od-puri', name: 'Narendra Tank Station', city: 'Puri', district: 'Puri', lat: 19.8135, lng: 85.8312, base: { ph: 7.8, turbidity: 3.1, temp: 29.5, do: 7.4, hospitalCases: 8, prevWeekCases: 12, complaints: 1, rainfall: 0 } },
  { id: 'st-od-sbp', name: 'Hirakud Reservoir Station', city: 'Sambalpur', district: 'Sambalpur', lat: 21.4669, lng: 83.9812, base: { ph: 7.1, turbidity: 1.8, temp: 34.0, do: 7.0, hospitalCases: 15, prevWeekCases: 15, complaints: 3, rainfall: 2 } },
]

function computeReadings(station, override, hospitalStats = null) {
  const b = override?.base || station.base
  const jitter = (val, range = 0.05) => +(val + (Math.random() - 0.5) * range * 2).toFixed(2)
  const ph = jitter(b.ph, 0.2)
  const turbidity = Math.max(0.1, jitter(b.turbidity, 1.0))
  const temp = jitter(b.temp, 0.5)
  const dox = Math.max(0.1, jitter(b.do, 0.3))
  const currCases = b.hospitalCases
  const prevCases = b.prevWeekCases || Math.max(1, currCases - 5)
  const complaints = b.complaints || 0
  const rainfall = b.rainfall || 0

  let waterScore = 0
  if (ph < 6.5) waterScore += Math.min(25, (6.5 - ph) * 20)
  else if (ph > 8.5) waterScore += Math.min(25, (ph - 8.5) * 20)
  if (turbidity > 5) waterScore += Math.min(30, (turbidity - 5) * 5)
  if (dox < 5) waterScore += Math.min(30, (5 - dox) * 10)
  if (temp > 30) waterScore += Math.min(15, (temp - 30) * 5)
  else if (temp < 20) waterScore += Math.min(15, (20 - temp) * 2)
  waterScore = Math.min(100, waterScore)

  let hospitalScore = 0
  let growthRate = 0
  if (hospitalStats) {
    growthRate = hospitalStats.growthRate
    hospitalScore = Math.min(100, Math.max(0, growthRate * 1.2))
  } else {
    growthRate = ((currCases - prevCases) / prevCases) * 100
    if (growthRate > 100) hospitalScore = 100
    else if (growthRate > 50) hospitalScore = 80
    else if (growthRate > 20) hospitalScore = 50
    else if (growthRate > 0) hospitalScore = 20
    else hospitalScore = 5
  }

  let feedbackScore = Math.min(100, complaints * 5)
  if (rainfall > 20) feedbackScore = Math.min(100, feedbackScore * 1.5)

  const finalRiskScore = Math.round((waterScore * 0.50) + (hospitalScore * 0.30) + (feedbackScore * 0.20))

  let riskLevel = 'safe'
  if (finalRiskScore >= 75) riskLevel = 'high'
  else if (finalRiskScore >= 45) riskLevel = 'moderate'

  return {
    ph, turbidity, temp, dissolvedOxygen: dox, 
    hospitalCases: currCases,
    complaints, rainfall,
    waterScore: Math.round(waterScore),
    hospitalScore: Math.round(hospitalScore),
    feedbackScore: Math.round(feedbackScore),
    hospitalGrowthRate: +growthRate.toFixed(1),
    finalRiskScore,
    riskLevel,
    updatedAt: new Date().toISOString() 
  }
}

async function getHospitalStats(area) {
  try {
    const records = await sqlite.all(
      `SELECT * FROM hospital_data WHERE city = ? OR village = ? OR village LIKE ? ORDER BY date DESC LIMIT 8`,
      [area, area, `%${area}%`]
    )
    if (records.length < 2) return null
    const latest = records[0].cases
    const prevRecords = records.slice(1)
    const prevAvg = prevRecords.reduce((acc, r) => acc + r.cases, 0) / prevRecords.length
    const growthRate = prevAvg === 0 ? 0 : ((latest - prevAvg) / prevAvg) * 100
    return { latest, prevAvg, growthRate }
  } catch (e) {
    console.error('SQLite stats error:', e.message)
    return null
  }
}

async function handle(request, params) {
  const path = params?.path || []
  const route = path.join('/')
  const method = request.method
  const url = new URL(request.url)
  const authHeader = request.headers.get('authorization')
  const isHospital = authHeader?.startsWith('Bearer hosp-') || authHeader?.startsWith('hosp-')

  try {
    if (route === '' || route === 'health') {
      return NextResponse.json({ ok: true, service: 'AquaShield AI (SQLite)', time: new Date().toISOString() })
    }

    if (route === 'stations' && method === 'GET') {
      const enriched = await Promise.all(SEED_STATIONS.map(async s => {
        const hStats = await getHospitalStats(s.city)
        const r = computeReadings(s, null, hStats)
        return { ...s, readings: { ...r, temperature: r.temp } }
      }))
      return NextResponse.json({ stations: enriched })
    }

    if (route === 'stations/nearest' && method === 'GET') {
      const lat = parseFloat(url.searchParams.get('lat'))
      const lng = parseFloat(url.searchParams.get('lng'))
      if (isNaN(lat) || isNaN(lng)) return NextResponse.json({ error: 'Invalid coords' }, { status: 400 })
      
      let nearest = null
      let minD = Infinity
      for (const s of SEED_STATIONS) {
        const d = Math.sqrt(Math.pow(s.lat - lat, 2) + Math.pow(s.lng - lng, 2))
        if (d < minD) { minD = d; nearest = s }
      }
      
      if (nearest) {
        const hStats = await getHospitalStats(nearest.city)
        const r = computeReadings(nearest, null, hStats)
        nearest = { ...nearest, readings: { ...r, temperature: r.temp }, distanceKm: Math.round(minD * 111) }
      }
      return NextResponse.json({ station: nearest })
    }

    if (route === 'hospital/data' && method === 'POST') {
      if (!isHospital) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const body = await request.json()
      const doc = {
        id: uuidv4(),
        ...body,
        cases: parseInt(body.cases) || 0,
        createdAt: new Date().toISOString()
      }
      await sqlite.run(
        `INSERT INTO hospital_data (id, hospitalName, district, city, village, diseaseType, cases, date, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [doc.id, doc.hospitalName, doc.district, doc.city, doc.village, doc.diseaseType, doc.cases, doc.date, doc.createdAt]
      )
      return NextResponse.json({ ok: true, data: doc })
    }

    if (route === 'hospital/data' && method === 'GET') {
      if (!isHospital) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const records = await sqlite.all(`SELECT * FROM hospital_data ORDER BY date DESC`)
      const enrichedRecords = records.map(r => ({ ...r, area: `${r.village ? r.village + ', ' : ''}${r.city}` }))
      return NextResponse.json({ records: enrichedRecords, dbConnected: true, type: 'SQLite' })
    }

    if (route === 'feedback' && method === 'POST') {
      const body = await request.json()
      const id = uuidv4()
      const now = new Date().toISOString()
      await sqlite.run(
        `INSERT INTO feedback (id, area, description, email, image, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, body.area, body.description, body.email, body.image || null, 'open', now]
      )
      return NextResponse.json({ ok: true })
    }

    if (route === 'feedback' && method === 'GET') {
      const records = await sqlite.all(`SELECT * FROM feedback ORDER BY createdAt DESC`)
      return NextResponse.json({ feedback: records })
    }

    if (route === 'alerts' && method === 'GET') {
      const records = await sqlite.all(`SELECT * FROM alerts ORDER BY createdAt DESC`)
      return NextResponse.json({ alerts: records })
    }

    if (route === 'alerts' && method === 'POST') {
      const body = await request.json()
      const id = uuidv4()
      const now = new Date().toISOString()
      await sqlite.run(
        `INSERT INTO alerts (id, title, message, severity, city, district, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, body.title, body.message, body.severity, body.city, body.district, now]
      )
      return NextResponse.json({ ok: true })
    }

    if (route === 'reverse-geocode' && method === 'POST') {
      const { lat, lon } = await request.json()
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      const data = await r.json()
      const area = data.address.village || data.address.suburb || data.address.city || 'Unknown Area'
      return NextResponse.json({ area })
    }

    return NextResponse.json({ error: 'not found', route }, { status: 404 })
  } catch (e) {
    console.error('API error', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(request, ctx) { return handle(request, await ctx.params) }
export async function POST(request, ctx) { return handle(request, await ctx.params) }
export async function PUT(request, ctx) { return handle(request, await ctx.params) }
export async function DELETE(request, ctx) { return handle(request, await ctx.params) }
