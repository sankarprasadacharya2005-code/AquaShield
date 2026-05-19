'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts'
import {
  Droplets, ShieldCheck, ShieldAlert, AlertTriangle, MapPin, Activity, Thermometer,
  Wind, Beaker, Waves, Bell, MessageSquareWarning, LayoutDashboard, Home, Lock,
  TrendingUp, Map as MapIcon, Filter, Send, Image as ImageIcon, RefreshCw, Trash2,
  CheckCircle2, AlertOctagon, Building2, Users, Database
} from 'lucide-react'

const RISK = {
  safe: { label: 'Safe', color: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-500/40', bg: 'bg-emerald-50', hex: '#10b981' },
  moderate: { label: 'Moderate Risk', color: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-500/40', bg: 'bg-amber-50', hex: '#f59e0b' },
  high: { label: 'High Risk', color: 'bg-rose-600', text: 'text-rose-700', ring: 'ring-rose-500/40', bg: 'bg-rose-50', hex: '#e11d48' },
}

const DISTRICT_TO_STATION_MAP = {
  'Khordha': 'st-od-bbsr',
  'Cuttack': 'st-od-ctc',
  'Sundargarh': 'st-od-rkl',
  'Puri': 'st-od-puri',
  'Sambalpur': 'st-od-sbp',
  'Angul': 'st-od-sbp',
  'Balangir': 'st-od-sbp',
  'Balasore': 'st-od-ctc',
  'Bargarh': 'st-od-sbp',
  'Bhadrak': 'st-od-ctc',
  'Boudh': 'st-od-sbp',
  'Deogarh': 'st-od-sbp',
  'Dhenkanal': 'st-od-ctc',
  'Gajapati': 'st-od-puri',
  'Ganjam': 'st-od-ganjam',
  'Jagatsinghpur': 'st-od-ctc',
  'Jajpur': 'st-od-ctc',
  'Jharsuguda': 'st-od-sbp',
  'Kalahandi': 'st-od-sbp',
  'Kandhamal': 'st-od-sbp',
  'Kendrapara': 'st-od-ctc',
  'Kendujhar': 'st-od-ctc',
  'Koraput': 'st-od-sbp',
  'Malkangiri': 'st-od-sbp',
  'Mayurbhanj': 'st-od-ctc',
  'Nabarangpur': 'st-od-sbp',
  'Nayagarh': 'st-od-bbsr',
  'Nuapada': 'st-od-sbp',
  'Rayagada': 'st-od-sbp',
  'Sonepur': 'st-od-sbp'
};

const ODISHA_DISTRICT_COORDINATES = {
  'Angul': { lat: 20.8500, lng: 85.1000 },
  'Balangir': { lat: 20.7200, lng: 83.4800 },
  'Balasore': { lat: 21.4900, lng: 86.9300 },
  'Bargarh': { lat: 21.3300, lng: 83.6200 },
  'Bhadrak': { lat: 21.0500, lng: 86.5000 },
  'Boudh': { lat: 20.8400, lng: 84.3200 },
  'Cuttack': { lat: 20.4625, lng: 85.8828 },
  'Deogarh': { lat: 21.5300, lng: 84.7300 },
  'Dhenkanal': { lat: 20.6600, lng: 85.6000 },
  'Gajapati': { lat: 18.8100, lng: 84.2000 },
  'Ganjam': { lat: 19.3500, lng: 84.7800 },
  'Jagatsinghpur': { lat: 20.2700, lng: 86.1700 },
  'Jajpur': { lat: 20.8500, lng: 86.3300 },
  'Jharsuguda': { lat: 21.8500, lng: 84.0300 },
  'Kalahandi': { lat: 19.9000, lng: 83.1600 },
  'Kandhamal': { lat: 20.4000, lng: 84.2300 },
  'Kendrapara': { lat: 20.5000, lng: 86.4200 },
  'Kendujhar': { lat: 21.6300, lng: 85.6000 },
  'Khordha': { lat: 20.1800, lng: 85.6200 },
  'Koraput': { lat: 18.8100, lng: 82.7100 },
  'Malkangiri': { lat: 18.3400, lng: 81.8800 },
  'Mayurbhanj': { lat: 21.9400, lng: 86.7200 },
  'Nabarangpur': { lat: 19.2300, lng: 82.5500 },
  'Nayagarh': { lat: 20.1300, lng: 85.1000 },
  'Nuapada': { lat: 20.5400, lng: 82.5300 },
  'Puri': { lat: 19.8135, lng: 85.8312 },
  'Rayagada': { lat: 19.1700, lng: 83.4200 },
  'Sambalpur': { lat: 21.4669, lng: 83.9812 },
  'Sonepur': { lat: 20.8300, lng: 83.8800 },
  'Sundargarh': { lat: 22.1200, lng: 84.0400 }
};

const ODISHA_DISTRICTS = [
  'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
  'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur',
  'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha',
  'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
  'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh'
];



const ODISHA_DISTRICTS_HOSPITALS = {
  'Khordha': [
    'AIIMS Bhubaneswar', 
    'Capital Hospital Bhubaneswar', 
    'Kalinga Institute of Medical Sciences (KIMS)', 
    'IMS and SUM Hospital', 
    'AMRI Hospital Bhubaneswar',
    'Khordha District Headquarters Hospital'
  ],
  'Cuttack': [
    'SCB Medical College and Hospital', 
    'Sardar Vallabhbhai Patel Institute of Paediatrics (Sishu Bhawan)', 
    'Ashwini Hospital Cuttack', 
    'Shanti Memorial Hospital',
    'Cuttack District Headquarters Hospital'
  ],
  'Ganjam': [
    'MKCG Medical College and Hospital', 
    'City Hospital Berhampur', 
    'Amit Hospital',
    'Bhanjanagar Sub-divisional Hospital'
  ],
  'Sundargarh': [
    'Ispat General Hospital (IGH) Rourkela', 
    'Rourkela Government Hospital (RGH)', 
    'JP Hospital Rourkela', 
    'Hi-Tech Medical College & Hospital',
    'Sundargarh District Headquarters Hospital'
  ],
  'Sambalpur': [
    'Veer Surendra Sai Institute of Medical Sciences and Research (VIMSAR) Burla', 
    'Sambalpur District Headquarters Hospital',
    'Kuchinda Sub-Divisional Hospital'
  ],
  'Puri': [
    'Puri District Headquarters Hospital', 
    'Gop Area Hospital',
    'Charichhak Community Health Centre',
    'Puri Government Hospital'
  ],
  'Angul': [
    'Angul District Headquarters Hospital', 
    'NTPC Hospital Kaniha',
    'Mahanadi Coalfields Hospital'
  ],
  'Balangir': [
    'Bhima Bhoi Medical College and Hospital', 
    'Titlagarh Sub-Divisional Hospital',
    'Patnagarh Sub-Divisional Hospital'
  ],
  'Balasore': [
    'Fakir Mohan Medical College and Hospital', 
    'Balasore District Headquarters Hospital',
    'Jyoti Hospital Balasore'
  ],
  'Bargarh': [
    'Bargarh District Headquarters Hospital', 
    'Vikas First State Hospital'
  ],
  'Bhadrak': [
    'Bhadrak District Headquarters Hospital', 
    'Basudevpur Sub-Divisional Hospital'
  ],
  'Boudh': [
    'Boudh District Headquarters Hospital', 
    'Harbhanga Block Hospital'
  ],
  'Deogarh': [
    'Deogarh District Headquarters Hospital'
  ],
  'Dhenkanal': [
    'Dhenkanal District Headquarters Hospital', 
    'Kamakhyanagar Sub-Divisional Hospital'
  ],
  'Gajapati': [
    'Paralakhemundi District Headquarters Hospital'
  ],
  'Jagatsinghpur': [
    'Jagatsinghpur District Headquarters Hospital', 
    'Paradip Port Trust Hospital'
  ],
  'Jajpur': [
    'Jajpur District Headquarters Hospital', 
    'Jajpur Road Area Hospital'
  ],
  'Jharsuguda': [
    'Jharsuguda District Headquarters Hospital', 
    'Brajarajnagar Hospital'
  ],
  'Kalahandi': [
    'Government Medical College & Hospital Bhawanipatna', 
    'Dharamgarh Sub-Divisional Hospital'
  ],
  'Kandhamal': [
    'Phulbani District Headquarters Hospital', 
    'Balliguda Sub-Divisional Hospital'
  ],
  'Kendrapara': [
    'Kendrapara District Headquarters Hospital', 
    'Pattamundai Sub-Divisional Hospital'
  ],
  'Kendujhar': [
    'Dharani Dhar Medical College and Hospital', 
    'Keonjhar District Headquarters Hospital',
    'Barbil Area Hospital'
  ],
  'Koraput': [
    'SLN Medical College and Hospital Koraput', 
    'Jeypore District Headquarters Hospital'
  ],
  'Malkangiri': [
    'Malkangiri District Headquarters Hospital'
  ],
  'Mayurbhanj': [
    'Pandit Raghunath Murmu Medical College & Hospital Baripada', 
    'Rairangpur Sub-Divisional Hospital'
  ],
  'Nabarangpur': [
    'Nabarangpur District Headquarters Hospital'
  ],
  'Nayagarh': [
    'Nayagarh District Headquarters Hospital'
  ],
  'Nuapada': [
    'Nuapada District Headquarters Hospital'
  ],
  'Rayagada': [
    'Rayagada District Headquarters Hospital', 
    'Gunupur Sub-Divisional Hospital'
  ],
  'Sonepur': [
    'Subarnapur District Headquarters Hospital'
  ]
};


function useStations(token, intervalMs = 5000) {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const fetcher = async () => {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
        const r = await fetch('/api/stations', { cache: 'no-store', headers })
        const j = await r.json()
        if (mounted) { setStations(j.stations || []); setLoading(false) }
      } catch (e) { console.error(e) }
    }
    fetcher()
    const id = setInterval(fetcher, intervalMs)
    return () => { mounted = false; clearInterval(id) }
  }, [intervalMs, token])
  return { stations, loading }
}

function GovHeader({ section, setSection, status, navbarLabel }) {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareWarning },
    { id: 'hospital', label: 'Hospital Portal', icon: Building2 },
  ]
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-800 text-white shadow-lg border-b border-blue-950">
      <div className="bg-blue-950/60 text-xs px-4 py-1 flex items-center justify-between">
        <span className="opacity-80">Government of India · Ministry of Jal Shakti · National Water Quality Mission</span>
        <span className="opacity-80 hidden md:inline">हिन्दी | English</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button onClick={() => setSection('home')} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-white/10 ring-2 ring-white/30 flex items-center justify-center group-hover:scale-105 transition">
            <Droplets className="w-6 h-6 text-cyan-200" />
          </div>
          <div className="text-left">
            <div className="font-bold text-lg leading-tight tracking-tight">AquaShield <span className="text-emerald-300">AI</span></div>
            <div className="text-[11px] opacity-80 leading-tight">Smart Waterborne Disease Monitoring</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {items.map(it => (
            <button key={it.id} onClick={() => setSection(it.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition ${section === it.id ? 'bg-white text-blue-900' : 'hover:bg-white/10'}`}>
              <it.icon className="w-4 h-4" />{it.label}
            </button>
          ))}
        </nav>

        {status && (
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full ring-2 ${RISK[status].ring} bg-white/10`}>
            <span className={`w-2.5 h-2.5 rounded-full ${RISK[status].color} animate-pulse`}></span>
            <span className="text-sm font-semibold">{navbarLabel ? `${navbarLabel}: ` : ''}{RISK[status].label}</span>
          </div>
        )}
      </div>

      <div className="md:hidden flex overflow-x-auto px-2 pb-2 gap-1">
        {items.map(it => (
          <button key={it.id} onClick={() => setSection(it.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${section === it.id ? 'bg-white text-blue-900' : 'bg-white/10'}`}>
            <it.icon className="w-3.5 h-3.5" />{it.label}
          </button>
        ))}
      </div>
    </header>
  )
}

function StatusBadge({ level, size = 'md' }) {
  const r = RISK[level] || RISK.safe
  const sz = size === 'lg' ? 'text-base px-4 py-2' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-semibold ${r.bg} ${r.text} ${sz} ring-1 ${r.ring}`}>
      <span className={`w-2 h-2 rounded-full ${r.color} ${size === 'lg' ? 'animate-pulse' : ''}`}></span>
      {r.label}
    </span>
  )
}

function HomePage({ stations, setSection, onGetLocation, userLoc, nearestStation, userArea }) {
const overall = useMemo(() => {
  if (nearestStation) return nearestStation.readings.riskLevel
  if (!stations.length) return 'safe'
  const high = stations.filter(s => s.readings.riskLevel === 'high').length
  if (high >= 2) return 'high'
  const mod = stations.filter(s => s.readings.riskLevel === 'moderate').length
  if (mod >= 3) return 'moderate'
  return 'safe'
}, [stations, nearestStation])

const r = RISK[overall]
const districtStations = useMemo(() => {
  if (!nearestStation) return [];
  return stations.filter(s => s.district === nearestStation.district);
}, [stations, nearestStation]);
return (
  <div className="space-y-6">
    {/* Hero */}
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700 text-white p-6 md:p-10 shadow-xl">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="relative grid md:grid-cols-2 gap-8 items-center">
        <div>
          <Badge className="bg-emerald-400/20 text-emerald-100 border-emerald-300/30 hover:bg-emerald-400/20">
            <Activity className="w-3 h-3 mr-1" /> Live · AI-powered
          </Badge>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Protecting communities from <span className="text-emerald-300">waterborne diseases</span> in real-time.
          </h1>
          <p className="mt-4 text-blue-100 text-lg max-w-xl">
            AquaShield AI continuously monitors water quality across {stations.length} stations and predicts disease outbreak probability using machine learning.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setSection('dashboard')} className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-lg">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Open Live Dashboard
            </Button>
            <Button onClick={onGetLocation} variant="outline" className="bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30">
              <MapPin className="w-4 h-4 mr-2" /> Detect My Location
            </Button>
            <Button onClick={() => setSection('feedback')} variant="outline" className="bg-white/10 border-white/40 text-white hover:bg-white/20">
              <MessageSquareWarning className="w-4 h-4 mr-2" /> Report a Water Issue
            </Button>
          </div>
        </div>

        {/* Live status card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-100">Current Water Safety Status</div>
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">LIVE</span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full ${r.color} flex items-center justify-center shadow-lg ring-4 ring-white/30`}>
              {overall === 'safe' && <ShieldCheck className="w-10 h-10 text-white" />}
              {overall === 'moderate' && <ShieldAlert className="w-10 h-10 text-white" />}
              {overall === 'high' && <AlertOctagon className="w-10 h-10 text-white" />}
            </div>
            <div>
              <div className="text-3xl font-bold">{r.label}</div>
              <div className="text-sm text-blue-100 mt-1 flex flex-col gap-1">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <b>District:</b> {nearestStation ? `${nearestStation.district} (${nearestStation.distanceKm} km away)` : 'Locating nearest district…'}</div>
                <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> <b>District Situation:</b> <span className="underline font-bold">{r.label}</span></div>
                {userArea && <div className="text-[11px] bg-white/20 px-2 py-0.5 rounded w-fit flex items-center gap-1 font-medium mt-1"><Home className="w-3 h-3" /> Area: {userArea}</div>}
              </div>
            </div>
          </div>
          {nearestStation && (
            <>
              {districtStations.some(s => s.readings.riskLevel === 'high') && (
                <div className="bg-rose-600/10 border border-rose-600 text-rose-800 p-3 rounded mt-4 text-sm">
                  ⚠️ High risk water bodies detected in this district!
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                {nearestStation.readings.ph !== undefined && <Mini label="pH" val={nearestStation.readings.ph} />}
                {nearestStation.readings.turbidity !== undefined && <Mini label="Turb." val={nearestStation.readings.turbidity} />}
                <Mini label="Temp" val={`${nearestStation.readings.temperature || nearestStation.readings.temp}°`} />
                {nearestStation.readings.dissolvedOxygen !== undefined && <Mini label="DO" val={nearestStation.readings.dissolvedOxygen} />}
              </div>
            </>
          )}
          {nearestStation?.readings?.recommendedAction && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20 text-xs">
              <span className="font-bold text-cyan-200">Recommendation: </span>
              {nearestStation.readings.recommendedAction}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Building2} label="Monitoring Stations" value={stations.length} color="from-blue-500 to-blue-700" />
      <StatCard icon={CheckCircle2} label="Safe Zones" value={stations.filter(s => s.readings.riskLevel === 'safe').length} color="from-emerald-500 to-emerald-700" />
      <StatCard icon={ShieldAlert} label="Moderate Risk" value={stations.filter(s => s.readings.riskLevel === 'moderate').length} color="from-amber-500 to-amber-600" />
      <StatCard icon={AlertOctagon} label="High Risk" value={stations.filter(s => s.readings.riskLevel === 'high').length} color="from-rose-500 to-rose-700" />
    </div>

    {/* Top risk list */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-700" />Highest Risk Stations Right Now</CardTitle>
        <CardDescription>Sorted by AI-predicted disease outbreak probability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...stations].sort((a, b) => (b.readings.finalRiskScore || b.readings.outbreakProbability) - (a.readings.finalRiskScore || a.readings.outbreakProbability)).slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-700" />
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.city} · {s.district}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <div className="text-xs text-muted-foreground">Risk Score</div>
                  <div className="font-bold text-lg">{s.readings.finalRiskScore || s.readings.outbreakProbability}%</div>
                </div>
                <StatusBadge level={s.readings.riskLevel} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
  )
}


function Mini({ label, val }) {
  return <div className="bg-white/10 rounded-lg py-2"><div className="text-[10px] text-blue-100">{label}</div><div className="font-bold">{val}</div></div>
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-br ${color} p-4 text-white`}>
          <Icon className="w-6 h-6 opacity-80" />
          <div className="text-3xl font-bold mt-2">{value}</div>
          <div className="text-sm opacity-90">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function ParamCard({ icon: Icon, label, value, unit, range, level }) {
  const r = RISK[level]
  return (
    <Card className={`border-l-4 ${level === 'safe' ? 'border-l-emerald-500' : level === 'moderate' ? 'border-l-amber-500' : 'border-l-rose-500'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="w-4 h-4" />{label}</div>
          <span className={`w-2 h-2 rounded-full ${r.color} animate-pulse`}></span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">Safe range: {range}</div>
      </CardContent>
    </Card>
  )
}

function paramLevel(name, v) {
  if (name === 'ph') return v < 6.5 || v > 8.5 ? 'high' : (v < 6.8 || v > 8.2) ? 'moderate' : 'safe'
  if (name === 'turbidity') return v > 8 ? 'high' : v > 5 ? 'moderate' : 'safe'
  if (name === 'temp') return v > 30 ? 'high' : v > 28 ? 'moderate' : 'safe'
  if (name === 'do') return v < 4 ? 'high' : v < 5.5 ? 'moderate' : 'safe'
  return 'safe'
}

function MapView({ stations, userLoc, selectedId, onSelect }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const layersRef = useRef([])
  const userMarkerRef = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    let cancelled = false
    const init = () => {
      if (cancelled) return
      const L = window.L
      if (!L) return setTimeout(init, 200)
      if (!mapRef.current) {
        // Odisha center approx 20.95, 85.09
        mapRef.current = L.map(ref.current, { zoomControl: true, scrollWheelZoom: false }).setView([20.95, 85.09], 7)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(mapRef.current)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const L = window.L
    if (!L || !mapRef.current) return
    layersRef.current.forEach(l => mapRef.current.removeLayer(l))
    layersRef.current = []
    stations.forEach(s => {
      const lvl = s.readings.riskLevel
      const color = s.mapColorOverride || RISK[lvl].hex
      const label = s.mapLabelOverride || RISK[lvl].label
      const prob = s.readings.finalRiskScore || s.readings.outbreakProbability
      const ring = L.circle([s.lat, s.lng], { radius: 35000 + prob * 600, color, fillColor: color, fillOpacity: 0.18, weight: 1 }).addTo(mapRef.current)
      const pulse = L.circleMarker([s.lat, s.lng], { radius: 9, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 }).addTo(mapRef.current)
      pulse.bindPopup(`<div style="font-family:Inter"><b>${s.district} District</b><br/>Risk Status: <b style="color:${color}">${label}</b><br/>Outbreak Score: ${prob}%<br/>Water: ${s.readings.waterScore || '-'} · Hosp: ${s.readings.hospitalScore || '-'}</div>`)
      pulse.on('click', () => onSelect && onSelect(s.id))
      layersRef.current.push(ring, pulse)
    })
  }, [stations, onSelect])

  useEffect(() => {
    const L = window.L
    if (!L || !mapRef.current || !userLoc) return
    if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current)
    const icon = L.divIcon({ html: '<div style="background:#2563eb;border:3px solid white;border-radius:50%;width:18px;height:18px;box-shadow:0 0 0 6px rgba(37,99,235,0.3)"></div>', className: '', iconSize: [18, 18], iconAnchor: [9, 9] })
    userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng], { icon }).addTo(mapRef.current).bindPopup('<b>Your Location</b>')
    mapRef.current.setView([userLoc.lat, userLoc.lng], 7)
  }, [userLoc])

  useEffect(() => {
    const L = window.L
    if (!L || !mapRef.current || !selectedId) return
    const s = stations.find(x => x.id === selectedId)
    if (s) mapRef.current.setView([s.lat, s.lng], 9)
  }, [selectedId, stations])

  return <div ref={ref} className="w-full h-[500px] rounded-xl border shadow-sm bg-slate-100 z-0" />
}

function DashboardPage({ stations, userLoc, nearestStation, userDistrict, district, setDistrict }) {
  const [selectedId, setSelectedId] = useState(null)
  const [history, setHistory] = useState([])
  const [hospitalRecords, setHospitalRecords] = useState([])

  // Automatically default to the user's active device district once detected
  useEffect(() => {
    const activeDist = userDistrict || nearestStation?.district
    if (activeDist && district === 'all') {
      setDistrict(activeDist)
    }
  }, [userDistrict, nearestStation?.district, district, setDistrict])

  // Fetch hospital data for live display in dashboard
  useEffect(() => {
    fetch('/api/hospital/data', {
      headers: { 'Authorization': `Bearer hosp-demo` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.records) setHospitalRecords(data.records)
      })
      .catch(err => console.error('Error loading dashboard hospital records:', err))
  }, [])

  // Filter stations based on selected district, with geographic fallback mapping
  const filtered = useMemo(() => {
    if (district === 'all') return stations
    const matched = stations.filter(s => s.district === district)
    if (matched.length > 0) return matched
    
    // Fall back to mapped adjacent monitoring station
    const fallbackId = DISTRICT_TO_STATION_MAP[district]
    const fallbackStation = stations.find(s => s.id === fallbackId)
    return fallbackStation ? [fallbackStation] : stations
  }, [stations, district])

  const focused = useMemo(() => {
    if (selectedId) {
      const match = stations.find(s => s.id === selectedId)
      if (match) return match
    }
    return filtered[0] || stations[0]
  }, [filtered, selectedId, stations])

  if (!focused) return <div className="p-8 text-center text-blue-900 font-semibold animate-pulse">Initializing surveillance systems…</div>

  const r = focused.readings

  // Check if selected district has no monitoring station (using fallback)
  const isFallbackActive = district !== 'all' && !stations.some(s => s.district === district)

  // ADVANCED EPIDEMIOLOGICAL RISK CALCULATION: Analyze last 2 reporting days of hospital data for districts without active water sensors
  const hospitalSurveillanceRisk = useMemo(() => {
    if (district === 'all') return null;
    
    const districtRecs = hospitalRecords.filter(rec => rec.district === district);
    if (districtRecs.length === 0) {
      return {
        score: 15,
        level: 'safe',
        casesDay1: 0,
        casesDay2: 0,
        latestDate: null,
        prevDate: null,
        daysAnalyzed: [],
        trendDescription: 'No active hospital reports received for this district.'
      };
    }

    // Group cases by date
    const dateMap = {};
    districtRecs.forEach(r => {
      const d = r.date;
      dateMap[d] = (dateMap[d] || 0) + r.cases;
    });

    // Sort unique dates descending
    const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(b) - new Date(a));
    const latestDate = sortedDates[0];
    const prevDate = sortedDates[1];

    const casesDay1 = dateMap[latestDate] || 0;
    const casesDay2 = prevDate ? (dateMap[prevDate] || 0) : 0;

    const c1 = casesDay1;
    const c2 = prevDate ? casesDay2 : null;

    let finalScore = 10;
    let growthRate = 0;
    let volume = 0;
    let trend = 0;

    if (c1 === 0 && (c2 === 0 || c2 === null)) {
      finalScore = 10;
    } else if (c2 === null) {
      volume = Math.min(50, c1 * 2.5);
      trend = 20;
      finalScore = Math.round((0.5 * volume) + (0.5 * trend));
    } else {
      const total = c1 + c2;
      volume = Math.min(50, total * 2.5);
      if (c2 > 0) {
        growthRate = ((c1 - c2) / c2) * 100;
        if (growthRate > 0) {
          trend = Math.min(50, growthRate * 0.5);
        } else {
          trend = 5;
        }
      } else {
        trend = 20;
      }
      finalScore = Math.round((0.5 * volume) + (0.5 * trend));
    }

    let level = 'safe';
    if (finalScore >= 35) level = 'high';
    else if (finalScore >= 20) level = 'moderate';

    return {
      score: finalScore,
      level,
      casesDay1,
      casesDay2,
      latestDate,
      prevDate,
      daysAnalyzed: sortedDates.slice(0, 2),
      trendDescription: prevDate 
        ? `Analyzed last 2 reporting days: ${new Date(latestDate).toLocaleDateString()} (${casesDay1} cases) vs ${new Date(prevDate).toLocaleDateString()} (${casesDay2} cases). Daily case growth: ${growthRate.toFixed(1)}%.`
        : `Analyzed 1 active reporting day: ${new Date(latestDate).toLocaleDateString()} (${casesDay1} cases).`
    };
  }, [hospitalRecords, district]);

  // Determine displayed risk score, risk level, and recommendations based on sensor availability
  const displayRiskScore = isFallbackActive && hospitalSurveillanceRisk 
    ? hospitalSurveillanceRisk.score 
    : (focused.readings.finalRiskScore || focused.readings.outbreakProbability);

  const displayRiskLevel = isFallbackActive && hospitalSurveillanceRisk
    ? hospitalSurveillanceRisk.level
    : focused.readings.riskLevel;

  const displayRecommendedAction = isFallbackActive && hospitalSurveillanceRisk
    ? (hospitalSurveillanceRisk.level === 'high' 
        ? `CRITICAL HOSPITAL SURVEILLANCE WARNING: Water quality monitoring station is not active in this district, but live hospital reports reveal a high concentration of waterborne disease cases (${hospitalSurveillanceRisk.casesDay1} cases reported). Local water supplies are high-risk. Boil all drinking water immediately.`
        : hospitalSurveillanceRisk.level === 'moderate'
        ? `REGIONAL PRECAUTIONARY ADVISORY: Water monitoring station is not active in this district. Live hospital surveillance indicates moderate waterborne disease cases (${hospitalSurveillanceRisk.casesDay1} cases reported). Use certified filtration systems and practice high hygiene.`
        : `Safe baseline. Local water monitoring station is not active in this district. Live hospital records show low case rates. Continue standard hygiene precautions.`)
    : r.recommendedAction;



  // Custom mapping for Map rendering to override fallback visual style to dynamic colors based on clinical risk levels, shifting the marker to the high-case population area instead of the water source
  const mapStations = useMemo(() => {
    return filtered.map(s => {
      if (isFallbackActive) {
        const coords = ODISHA_DISTRICT_COORDINATES[district] || { lat: s.lat, lng: s.lng };
        const color = displayRiskLevel === 'high' ? '#e11d48' : displayRiskLevel === 'moderate' ? '#f59e0b' : '#10b981';
        const label = displayRiskLevel === 'high' 
          ? `High Risk Surveillance Area (${hospitalSurveillanceRisk?.casesDay1 || 0} cases)`
          : displayRiskLevel === 'moderate'
          ? `Moderate Risk Surveillance Area (${hospitalSurveillanceRisk?.casesDay1 || 0} cases)`
          : `Safe Surveillance Area (${hospitalSurveillanceRisk?.casesDay1 || 0} cases)`;

        return {
          ...s,
          name: `${district} Surveillance Center`,
          city: district,
          district: district,
          lat: coords.lat,
          lng: coords.lng,
          mapColorOverride: color,
          mapLabelOverride: label,
          readings: {
            ...s.readings,
            riskLevel: displayRiskLevel,
            finalRiskScore: displayRiskScore,
            outbreakProbability: displayRiskScore
          }
        }
      }
      return s
    })
  }, [filtered, isFallbackActive, district, displayRiskScore, displayRiskLevel, hospitalSurveillanceRisk])

  useEffect(() => {
    if (!focused) return
    setHistory(h => {
      const next = [...h, { t: new Date().toLocaleTimeString().slice(0, 8), ph: focused.readings.ph, turbidity: focused.readings.turbidity, temp: focused.readings.temp, do: focused.readings.dissolvedOxygen, risk: displayRiskScore }]
      return next.slice(-20)
    })
  }, [focused?.readings.updatedAt, displayRiskScore])


  // Filter hospital records for the selected district or focused station's district
  const activeDistrictForHospitals = district === 'all' ? focused.district : district
  const focusedDistrictHospitals = hospitalRecords.filter(rec => rec.district === activeDistrictForHospitals)

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2"><LayoutDashboard className="w-6 h-6 animate-pulse text-cyan-600" />Live Water Quality Dashboard</h2>
          <p className="text-sm text-muted-foreground">Real-time readings update every 5 seconds · {stations.length} stations active</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          
          {/* District Selector (30 districts of Odisha) */}
          <Select value={district} onValueChange={v => { setDistrict(v); setSelectedId(null); }}>
            <SelectTrigger className="w-56 bg-white border-blue-100 shadow-sm"><SelectValue placeholder="Select District" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Odisha Districts</SelectItem>
              {ODISHA_DISTRICTS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Station Selector */}
          {isFallbackActive ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-xs font-bold shadow-sm">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Clinical Surveillance Model
            </div>
          ) : (
            <Select value={focused.id} onValueChange={setSelectedId}>
              <SelectTrigger className="w-64 bg-white border-blue-100 shadow-sm"><SelectValue placeholder="Select Station" /></SelectTrigger>
              <SelectContent>
                {filtered.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.district})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Fallback Warning Alert for districts with no active monitoring station */}
      {isFallbackActive && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-xs sm:text-sm font-medium">
              No direct water quality monitoring station active in <span className="font-bold underline">{district}</span>. Outbreak Risk is computed entirely via <span className="font-bold underline">Hospital Surveillance Reports</span>. Showing approximate regional temperature.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Param cards - conditionally hide fake sensor values when no IoT sensor is connected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {!isFallbackActive && r.ph !== undefined && (
          <ParamCard icon={Beaker} label="pH Level" value={r.ph} unit="" range="6.5 – 8.5" level={paramLevel('ph', r.ph)} />
        )}
        {!isFallbackActive && r.turbidity !== undefined && (
          <ParamCard icon={Waves} label="Turbidity" value={r.turbidity} unit="NTU" range="< 5" level={paramLevel('turbidity', r.turbidity)} />
        )}
        
        {isFallbackActive ? (
          <ParamCard 
            icon={Thermometer} 
            label="Approx. Temperature" 
            value={Math.round((r.temperature || r.temp || 27.5) + (Math.sin(district.charCodeAt(0)) * 2))} 
            unit="°C" 
            range="< 28°C" 
            level={paramLevel('temp', r.temperature || r.temp || 27.5)} 
          />
        ) : (
          <ParamCard 
            icon={Thermometer} 
            label="Temperature" 
            value={r.temperature || r.temp} 
            unit="°C" 
            range="< 28°C" 
            level={paramLevel('temp', r.temperature || r.temp)} 
          />
        )}

        {!isFallbackActive && r.dissolvedOxygen !== undefined && (
          <ParamCard icon={Wind} label="Dissolved Oxygen" value={r.dissolvedOxygen} unit="mg/L" range="> 5.5" level={paramLevel('do', r.dissolvedOxygen)} />
        )}

        {r.hospitalCases !== undefined && (
          <ParamCard icon={Activity} label="Hospital Cases" value={r.hospitalCases} unit="this week" range="N/A" level="safe" />
        )}

        {!isFallbackActive && r.waterScore !== undefined && (
          <ParamCard icon={ShieldCheck} label="Water Score" value={r.waterScore} unit="/100" range="< 40" level={r.waterScore > 60 ? 'high' : 'safe'} />
        )}

        {r.hospitalScore !== undefined && (
          <ParamCard icon={Users} label="Hospital Score" value={r.hospitalScore} unit="/100" range="Trend" level={r.hospitalScore > 50 ? 'high' : 'safe'} />
        )}

        {r.feedbackScore !== undefined && (
          <ParamCard icon={MessageSquareWarning} label="Feedback Score" value={r.feedbackScore} unit="/100" range="Social" level={r.feedbackScore > 50 ? 'high' : 'safe'} />
        )}
      </div>

      {displayRecommendedAction && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><ShieldAlert className="w-6 h-6 text-blue-700" /></div>
            <div>
              <h4 className="font-bold text-blue-900">Recommended Action ({isFallbackActive ? 'Hospital Surveillance-Based' : 'Sensor-Based'})</h4>
              <p className="text-blue-800 text-sm">{displayRecommendedAction}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Outbreak gauge */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Disease Outbreak Probability</CardTitle>
            <CardDescription>{focused.district} District ({isFallbackActive ? 'Hospital Model' : 'Dual Sensor Model'})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44">
                <svg viewBox="0 0 120 120" className="w-44 h-44 -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="14" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke={RISK[displayRiskLevel].hex} strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={`${(displayRiskScore / 100) * 314} 314`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{displayRiskScore}%</div>
                  <div className="text-xs text-muted-foreground">outbreak risk</div>
                </div>
              </div>
              <StatusBadge level={displayRiskLevel} size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><MapIcon className="w-4 h-4" />Risk Zone Map</CardTitle>
              <CardDescription>Circle size = outbreak probability · Click markers</CardDescription>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Safe</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span>High</span>
            </div>
          </CardHeader>
          <CardContent>
            <MapView stations={mapStations} userLoc={userLoc} selectedId={focused.id} onSelect={setSelectedId} />
          </CardContent>
        </Card>
      </div>

      {/* Charts & Hospital Surveillance Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* District Hospital Cases surveillance list */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Hospital Surveillance
            </CardTitle>
            <CardDescription>Active reports in <span className="font-semibold text-emerald-800">{activeDistrictForHospitals}</span> district</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[260px] space-y-2 pr-1">
            
            {/* Display exact two days of hospital details and analyzed results iffallback mode is active */}
            {isFallbackActive && hospitalSurveillanceRisk && hospitalSurveillanceRisk.latestDate && (
              <div className="mb-3.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100 space-y-2 text-xs text-emerald-800">
                <div className="font-bold flex items-center gap-1.5 border-b border-emerald-100 pb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  2-Day Epidemiological Analysis
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="opacity-75 font-semibold">Latest Reporting:</span>
                    <div className="font-bold text-slate-800 mt-0.5">{new Date(hospitalSurveillanceRisk.latestDate).toLocaleDateString()}</div>
                    <div className="font-bold text-emerald-700">{hospitalSurveillanceRisk.casesDay1} cases</div>
                  </div>
                  {hospitalSurveillanceRisk.prevDate ? (
                    <div>
                      <span className="opacity-75 font-semibold">Prior Reporting:</span>
                      <div className="font-bold text-slate-800 mt-0.5">{new Date(hospitalSurveillanceRisk.prevDate).toLocaleDateString()}</div>
                      <div className="font-bold text-emerald-700">{hospitalSurveillanceRisk.casesDay2} cases</div>
                    </div>
                  ) : (
                    <div>
                      <span className="opacity-75 font-semibold">Prior Reporting:</span>
                      <div className="italic text-slate-400 mt-0.5">No records</div>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-emerald-900 bg-emerald-600/10 px-2 py-1 rounded font-medium mt-1 leading-normal">
                  {hospitalSurveillanceRisk.trendDescription}
                </div>
              </div>
            )}

            {focusedDistrictHospitals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                No active disease cases reported from {activeDistrictForHospitals} hospitals.
              </div>
            ) : (
              <div className="space-y-2.5">
                {focusedDistrictHospitals.map(hr => (
                  <div key={hr.id} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{hr.hospitalName}</div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {hr.city} · {new Date(hr.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge className="bg-rose-500/10 text-rose-700 border-none font-bold text-[11px] px-2 py-0.5">
                        {hr.cases} {hr.diseaseType}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {!isFallbackActive ? (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Live Trend · pH & DO</CardTitle>
              <CardDescription>{focused.district} District</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid stroke="#f1f5f9" />
                  <XAxis dataKey="t" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ph" stroke="#2563eb" strokeWidth={2} dot={false} name="pH" />
                  <Line type="monotone" dataKey="do" stroke="#10b981" strokeWidth={2} dot={false} name="DO mg/L" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Hospital Case Incidence</CardTitle>
              <CardDescription>{district} District Clinical Trends</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              {focusedDistrictHospitals.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={[...focusedDistrictHospitals].sort((a, b) => new Date(a.date) - new Date(b.date))}>
                    <defs>
                      <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e11d48" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f1f5f9" />
                    <XAxis dataKey="date" fontSize={10} tickFormatter={d => new Date(d).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="cases" stroke="#e11d48" fill="url(#hc)" strokeWidth={2} name="Clinical Cases" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic bg-slate-50 rounded-lg border border-dashed p-4">
                  No active clinical trend data available for this district.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Outbreak Trend</CardTitle>
            <CardDescription>Last 20 readings</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={RISK[displayRiskLevel].hex} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={RISK[displayRiskLevel].hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="t" fontSize={11} />
                <YAxis fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="risk" stroke={RISK[displayRiskLevel].hex} fill="url(#rg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* District table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Area-wise Risk Score</CardTitle>
          <CardDescription>All active water quality monitoring stations in Odisha</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead>District</TableHead>
                <TableHead>pH</TableHead>
                <TableHead>Turb.</TableHead>
                <TableHead>Temp</TableHead>
                <TableHead>Water Score</TableHead>
                <TableHead>Hosp. Trend</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map(s => (
                <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setDistrict(s.district); setSelectedId(s.id); }}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.district}</TableCell>
                  <TableCell>{s.readings.ph ?? '-'}</TableCell>
                  <TableCell>{s.readings.turbidity ?? '-'}</TableCell>
                  <TableCell>{(s.readings.temperature || s.readings.temp)}°</TableCell>
                  <TableCell>{s.readings.waterScore ?? '-'}</TableCell>
                  <TableCell>{s.readings.hospitalGrowthRate ? `${s.readings.hospitalGrowthRate}%` : '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.readings.finalRiskScore || s.readings.outbreakProbability} className="w-20 h-2" />
                      <span className="text-xs font-semibold">{s.readings.finalRiskScore || s.readings.outbreakProbability}%</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge level={s.readings.riskLevel} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function AlertsPage({ stations, token, selectedDistrict, setSelectedDistrict }) {
  const [alerts, setAlerts] = useState([])
  const [hospitalRecords, setHospitalRecords] = useState([])

  const load = async () => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
      const r = await fetch(`/api/alerts`, { cache: 'no-store', headers })
      if (!r.ok) return
      const j = await r.json()
      setAlerts(j.alerts || [])
    } catch (e) { console.error('Alerts load error', e) }
  }

  // Fetch hospital data for dynamic risk alerts
  useEffect(() => {
    fetch('/api/hospital/data', {
      headers: { 'Authorization': `Bearer hosp-demo` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j && j.data) setHospitalRecords(j.data) })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => { load() }, [token])

  // Automatically generate Official Public Health Alert for any district in high risk zone
  const autoCollectorateAlerts = useMemo(() => {
    const list = []
    
    ODISHA_DISTRICTS.forEach(d => {
      const directStation = stations.find(s => s.district === d)
      
      let finalScore = 10
      let level = 'safe'
      let disease = 'Waterborne Contaminants'
      
      if (directStation) {
        finalScore = directStation.readings.finalRiskScore || directStation.readings.outbreakProbability || 10
        level = directStation.readings.riskLevel || 'safe'
        disease = 'Pathogenic Contamination & High Water Score'
      } else {
        // Run clinical model
        const districtRecs = hospitalRecords.filter(rec => rec.district === d);
        if (districtRecs.length > 0) {
          const dateMap = {};
          districtRecs.forEach(r => {
            const dt = r.date;
            dateMap[dt] = (dateMap[dt] || 0) + r.cases;
          });
          const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(b) - new Date(a));
          const latestDate = sortedDates[0];
          const prevDate = sortedDates[1];
          
          const c1 = dateMap[latestDate] || 0;
          const c2 = prevDate ? (dateMap[prevDate] || 0) : null;
          
          let volume = 0;
          let trend = 0;
          if (c1 === 0 && (c2 === 0 || c2 === null)) {
            finalScore = 10;
          } else if (c2 === null) {
            volume = Math.min(50, c1 * 2.5);
            trend = 20;
            finalScore = Math.round((0.5 * volume) + (0.5 * trend));
          } else {
            const total = c1 + c2;
            volume = Math.min(50, total * 2.5);
            if (c2 > 0) {
              const growth = ((c1 - c2) / c2) * 100;
              if (growth > 0) {
                trend = Math.min(50, growth * 0.5);
              } else {
                trend = 5;
              }
            } else {
              trend = 20;
            }
            finalScore = Math.round((0.5 * volume) + (0.5 * trend));
          }
          
          if (finalScore >= 35) level = 'high';
          else if (finalScore >= 20) level = 'moderate';
          disease = 'Gastroenteritis & Waterborne Epidemic Infection'
        }
      }
      
      if (level === 'high') {
        // Find corresponding city
        const cityMatch = stations.find(s => s.district === d)?.city || d
        list.push({
          id: `auto-alert-${d}`,
          title: `🏛️ DISTRICT COLLECTORATE – OFFICIAL PUBLIC HEALTH ALERT`,
          disease,
          district: d,
          city: cityMatch,
          severity: 'high',
          createdAt: new Date().toISOString(),
          isOfficialCollectorateAdvisory: true,
          referenceNo: `DM-OD/${d.toUpperCase().slice(0,3)}/2026/089`,
          prob: finalScore
        })
      }
    })
    
    return list
  }, [stations, hospitalRecords])

  const allAlerts = useMemo(() => {
    const filteredAuto = autoCollectorateAlerts.filter(a => {
      if (selectedDistrict === 'all') return true
      return a.district.toLowerCase() === selectedDistrict.toLowerCase()
    })
    
    const filteredDb = alerts.filter(a => {
      if (selectedDistrict === 'all') return true
      const st = stations.find(s => s.city.toLowerCase() === a.city.toLowerCase() || s.district.toLowerCase() === a.city.toLowerCase())
      if (st) {
        return st.district.toLowerCase() === selectedDistrict.toLowerCase()
      }
      return a.city.toLowerCase() === selectedDistrict.toLowerCase()
    })
    
    return [...filteredAuto, ...filteredDb]
  }, [alerts, autoCollectorateAlerts, selectedDistrict, stations])

  const highRiskStations = stations.filter(s => s.readings.riskLevel === 'high')

  return (
    <div className="space-y-6">
      {highRiskStations.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl p-5 shadow-lg flex items-start gap-4 animate-pulse-slow">
          <AlertTriangle className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="font-bold text-lg">⚠️ Contamination Detected</div>
            <div className="text-sm text-rose-50 mt-1">High contamination risk at {highRiskStations.length} station(s): {highRiskStations.map(s => s.district).join(', ')}. Boil water before consumption.</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2"><Bell className="w-6 h-6" />Active Public Alerts</h2>
          <p className="text-sm text-muted-foreground">Issued by water authorities for your region</p>
        </div>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-56 bg-white border-blue-100 shadow-sm"><SelectValue placeholder="All Districts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {ODISHA_DISTRICTS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {allAlerts.length === 0 && <Card className="md:col-span-2"><CardContent className="p-8 text-center text-muted-foreground">No active alerts in this region.</CardContent></Card>}
        {allAlerts.map(a => {
          if (a.isOfficialCollectorateAdvisory) {
            return (
              <Card key={a.id} className="border-l-4 border-l-rose-600 bg-rose-50/10 shadow-md md:col-span-2 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start border-b border-rose-100 pb-4 mb-4 gap-4 flex-wrap">
                    <div className="flex gap-3 items-center">
                      <span className="text-3xl">🏛️</span>
                      <div>
                        <h3 className="font-extrabold text-blue-900 tracking-tight text-sm md:text-base">DISTRICT COLLECTORATE · OFFICIAL HEALTH ADVISORY</h3>
                        <p className="text-xs text-muted-foreground font-semibold">Office of the District Collector & District Magistrate, {a.district}</p>
                      </div>
                    </div>
                    {/* Right corner section showing district condition */}
                    <div className="bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold px-3 py-1.5 rounded-md shadow-sm">
                      🔴 HIGH RISK ZONE (Outbreak Prob: {a.prob}%)
                    </div>
                  </div>

                  <div className="space-y-4 text-xs md:text-sm text-slate-800 leading-relaxed font-sans max-w-3xl mx-auto">
                    <div className="grid grid-cols-2 gap-2 text-xs border-b border-dashed border-slate-200 pb-2">
                      <div><b>Date:</b> {new Date(a.createdAt).toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</div>
                      <div className="text-right"><b>Ref No:</b> {a.referenceNo}</div>
                    </div>

                    <div className="text-center font-black text-rose-800 text-sm md:text-base my-2 tracking-wide uppercase">
                      🚨 PUBLIC HEALTH ADVISORY – HIGH WATERBORNE DISEASE RISK ({a.disease})
                    </div>

                    <p className="bg-white p-3 rounded border border-rose-100 text-xs italic text-slate-700 leading-normal">
                      Based on real-time epidemiological surveillance conducted under the <b>AquaShield AI Early Warning System</b>, the district of <b>{a.district}</b> has been classified under a high outbreak warning alert zone. Recent hospital reports indicate a significant rise in waterborne disease cases.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-black text-rose-800 mb-2 flex items-center gap-1.5 text-xs uppercase"><AlertTriangle className="w-4 h-4 text-rose-600" /> ⚠ Advisory to Residents:</h4>
                        <ul className="list-disc list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-700 pl-1">
                          <li>Boil all drinking water for at least 10 minutes before use.</li>
                          <li>Avoid consumption of untreated tap or well water.</li>
                          <li>Use chlorinated or filtered water only.</li>
                          <li>Avoid eating raw street food and uncovered food items.</li>
                          <li>Maintain strict hand hygiene and sanitation.</li>
                          <li>Report symptoms such as diarrhea, vomiting, fever, or stomach cramps immediately to the nearest health center.</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h4 className="font-black text-blue-900 mb-2 flex items-center gap-1.5 text-xs uppercase"><Building2 className="w-4 h-4 text-blue-600" /> 🏥 Government Action Being Taken:</h4>
                        <ul className="list-disc list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-700 pl-1">
                          <li>Rapid medical response teams deployed.</li>
                          <li>Water quality inspection teams dispatched.</li>
                          <li>Emergency chlorination of affected water sources initiated.</li>
                          <li>Continuous monitoring through hospital surveillance.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border text-xs flex justify-between gap-4 flex-wrap items-center mt-3 font-medium">
                      <div>📞 <b>Emergency Helpline:</b> District Control Room: <span className="underline font-bold">+91 680-222-0001</span></div>
                      <div>🏥 <b>Health Helpline:</b> <span className="underline font-bold">104 / 108</span></div>
                    </div>

                    <div className="flex justify-between items-end border-t border-dashed border-slate-200 pt-4 mt-4 text-[11px] font-semibold">
                      <div className="opacity-80 italic">Issued in public interest by order of the District Collector.</div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-xs">District Magistrate & Collector</div>
                        <div className="text-slate-500 font-medium">District Administration of {a.district}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }

          const sev = a.severity === 'high' ? RISK.high : a.severity === 'moderate' ? RISK.moderate : RISK.safe
          return (
            <Card key={a.id} className={`border-l-4 ${a.severity === 'high' ? 'border-l-rose-600' : a.severity === 'moderate' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 mt-1 ${sev.text}`} />
                    <div>
                      <div className="font-bold">{a.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{a.message}</div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{a.city || 'All regions'} · {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <StatusBadge level={a.severity === 'high' ? 'high' : a.severity === 'moderate' ? 'moderate' : 'safe'} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FeedbackPage({ userDistrict }) {
  const [form, setForm] = useState({ district: 'Khordha', area: '', description: '', email: '', image: null })
  const [submitting, setSubmitting] = useState(false)

  // Auto-default form district selection to active device location once detected
  useEffect(() => {
    if (userDistrict) {
      setForm(prev => ({ ...prev, district: userDistrict }))
    }
  }, [userDistrict])

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 4 * 1024 * 1024) return toast.error('Image too large (max 4MB)')
    const reader = new FileReader()
    reader.onload = () => setForm(s => ({ ...s, image: reader.result }))
    reader.readAsDataURL(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.district || !form.area || !form.description) return toast.error('Please fill district, area & description')
    setSubmitting(true)
    try {
      const r = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!r.ok) throw new Error('Failed')
      toast.success('Feedback submitted! Authorities will review shortly.')
      setForm({ district: 'Khordha', area: '', description: '', email: '', image: null })
    } catch (e) { toast.error(e.message) } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-blue-900"><MessageSquareWarning className="w-6 h-6" />Report a Water Issue</CardTitle>
          <CardDescription>Help us protect your community. Reports are reviewed by water quality officers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Odisha District *</Label>
                <Select value={form.district} onValueChange={v => setForm({ ...form, district: v })}>
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {ODISHA_DISTRICTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Area / Locality *</Label>
                <Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. Sector 15, Bhubaneswar" />
              </div>
            </div>
            <div>
              <Label>Issue Description *</Label>
              <Textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the water issue: color, smell, illness reports, etc." />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Upload Image (optional)</Label>
              <Input type="file" accept="image/*" onChange={onFile} />
              {form.image && <img src={form.image} alt="preview" className="mt-2 max-h-48 rounded-lg border" />}
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-blue-700 hover:bg-blue-800">
              <Send className="w-4 h-4 mr-2" />{submitting ? 'Submitting…' : 'Submit Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



function HospitalPage({ token, onLogin, stations }) {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [useCustomHospital, setUseCustomHospital] = useState(false)
  const effectiveToken = token || 'hosp-demo'

  const ODISHA_DISTRICTS = [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
    'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur',
    'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha',
    'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
    'Puri', 'Rayagada', 'Sambalpur', 'Sonepur', 'Sundargarh'
  ]

  const [formData, setFormData] = useState({
    hospitalName: '',
    district: 'Khordha',
    city: 'Bhubaneswar',
    village: '',
    date: new Date().toISOString().split('T')[0],
    cases: '',
    diseaseType: 'Typhoid'
  })

  // Get predefined list of hospitals for selected district
  const currentDistrictHospitals = useMemo(() => {
    if (!formData.district) return []
    return ODISHA_DISTRICTS_HOSPITALS[formData.district] || [
      `${formData.district} District Headquarters Hospital`,
      `${formData.district} Sub-Divisional Hospital`,
      `${formData.district} Community Health Centre`
    ]
  }, [formData.district])

  // Automatically update hospital list and city defaults when district changes
  useEffect(() => {
    if (formData.district) {
      const defaultHospitals = ODISHA_DISTRICTS_HOSPITALS[formData.district] || [
        `${formData.district} District Headquarters Hospital`,
        `${formData.district} Sub-Divisional Hospital`,
        `${formData.district} Community Health Centre`
      ];
      setFormData(prev => ({
        ...prev,
        hospitalName: defaultHospitals[0],
        city: prev.district === formData.district && prev.city ? prev.city : (formData.district === 'Khordha' ? 'Bhubaneswar' : formData.district)
      }));
      setUseCustomHospital(false);
    }
  }, [formData.district])

  const [dbStatus, setDbStatus] = useState('Checking...')

  const loadData = async () => {
    try {
      const r = await fetch('/api/hospital/data', {
        headers: { 'Authorization': `Bearer ${effectiveToken}` }
      })
      const res = await r.json()
      if (res.records) setRecords(res.records)
      setDbStatus(res.dbConnected ? 'Live' : 'Mock (Auth Failed)')
    } catch (e) {
      console.error(e)
      setDbStatus('Error')
    }
  }

  useEffect(() => { loadData() }, [])

  const submitData = async () => {
    if (!formData.hospitalName || !formData.district || !formData.city || !formData.cases) {
      return toast.error('Please fill all required fields')
    }
    setLoading(true)
    try {
      const payload = {
        ...formData,
        area: `${formData.village ? formData.village + ', ' : ''}${formData.city}`
      }
      const r = await fetch('/api/hospital/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveToken}`
        },
        body: JSON.stringify(payload)
      })
      if (r.ok) {
        toast.success('Hospital record submitted successfully')
        setFormData({ ...formData, cases: '', village: '' })
        loadData()
      } else {
        toast.error('Submission failed')
      }
    } catch (e) {
      toast.error('Network error')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-emerald-500 text-white border-none shadow-lg animate-pulse-slow">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg"><Activity className="w-6 h-6" /></div>
            <div className="flex-1">
              <p className="text-xs opacity-80 uppercase font-bold">Total Reports</p>
              <h3 className="text-2xl font-bold">{records.length}</h3>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-white/20 text-white border-none text-[10px]">
                {dbStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-600 text-white border-none shadow-lg">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-xs opacity-80 uppercase font-bold">Latest Cases</p>
              <h3 className="text-2xl font-bold">{records[0]?.cases || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 text-white border-none shadow-lg col-span-2">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg"><MapPin className="w-6 h-6" /></div>
            <div>
              <p className="text-xs opacity-80 uppercase font-bold">Most Recent Location</p>
              <h3 className="text-xl font-bold truncate">{records[0]?.area || 'N/A'}, {records[0]?.district || ''}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md sticky top-24">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" /> Hospital Reporting Form
              </CardTitle>
              <CardDescription className="text-slate-400">Enter daily case records for Odisha districts</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="space-y-2">
                <Label>District (Odisha)</Label>
                <Select value={formData.district} onValueChange={v => setFormData({ ...formData, district: v })}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select District" /></SelectTrigger>
                  <SelectContent>
                    {ODISHA_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hospital Name</Label>
                {!useCustomHospital ? (
                  <div className="space-y-2">
                    <Select 
                      value={formData.hospitalName} 
                      onValueChange={v => {
                        if (v === 'custom') {
                          setUseCustomHospital(true)
                          setFormData(prev => ({ ...prev, hospitalName: '' }))
                        } else {
                          setFormData(prev => ({ ...prev, hospitalName: v }))
                        }
                      }}
                    >
                      <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select Hospital" /></SelectTrigger>
                      <SelectContent>
                        {currentDistrictHospitals.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-blue-600 font-semibold hover:bg-blue-50">+ Add Custom Hospital Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Input 
                      value={formData.hospitalName} 
                      onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} 
                      placeholder="Type custom hospital name" 
                      className="border-blue-200 focus-visible:ring-blue-400"
                    />
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setUseCustomHospital(false)
                        if (currentDistrictHospitals.length > 0) {
                          setFormData(prev => ({ ...prev, hospitalName: currentDistrictHospitals[0] }))
                        }
                      }}
                      className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to Predefined Hospital List
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City / Town</Label>
                  <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Type city" />
                </div>
                <div className="space-y-2">
                  <Label>Village Name (optional)</Label>
                  <Input value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} placeholder="Type village" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Disease Type</Label>
                  <Select value={formData.diseaseType} onValueChange={v => setFormData({ ...formData, diseaseType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Typhoid">Typhoid</SelectItem>
                      <SelectItem value="Cholera">Cholera</SelectItem>
                      <SelectItem value="Diarrhea">Diarrhea</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cases</Label>
                  <Input type="number" value={formData.cases} onChange={e => setFormData({ ...formData, cases: e.target.value })} placeholder="0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reporting Date</Label>
                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>

              <Button onClick={submitData} disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 py-6 text-lg font-bold shadow-lg shadow-emerald-900/20 transition duration-300">
                <Send className="w-5 h-5 mr-2" /> Submit Record
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600 animate-pulse" /> Area Disease Trends
          </h2>

          <Card className="border-none shadow-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead className="text-right">Cases</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">No records found.</TableCell>
                  </TableRow>
                )}
                {records.map(r => (
                  <TableRow key={r.id} className="hover:bg-slate-50 transition">
                    <TableCell className="font-medium text-slate-500">{new Date(r.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-bold text-slate-900">{r.hospitalName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-emerald-700">{r.area}</span>
                        <span className="text-xs text-slate-400">{r.district}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="font-semibold">{r.diseaseType}</Badge></TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">{r.cases}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}

function calculateDistrictClinicalRisk(district, hospitalRecords) {
  const districtRecs = hospitalRecords.filter(rec => rec.district === district);
  if (districtRecs.length === 0) return { score: 10, level: 'safe', casesDay1: 0 };
  
  const dateMap = {};
  districtRecs.forEach(r => {
    const dt = r.date;
    dateMap[dt] = (dateMap[dt] || 0) + r.cases;
  });
  const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(b) - new Date(a));
  const latestDate = sortedDates[0];
  const prevDate = sortedDates[1];
  
  const c1 = dateMap[latestDate] || 0;
  const c2 = prevDate ? (dateMap[prevDate] || 0) : null;
  
  let finalScore = 10;
  let volume = 0;
  let trend = 0;
  
  if (c1 === 0 && (c2 === 0 || c2 === null)) {
    finalScore = 10;
  } else if (c2 === null) {
    volume = Math.min(50, c1 * 2.5);
    trend = 20;
    finalScore = Math.round((0.5 * volume) + (0.5 * trend));
  } else {
    const total = c1 + c2;
    volume = Math.min(50, total * 2.5);
    
    if (c2 > 0) {
      const growth = ((c1 - c2) / c2) * 100;
      if (growth > 0) {
        trend = Math.min(50, growth * 0.5);
      } else {
        trend = 5;
      }
    } else {
      trend = 20;
    }
    finalScore = Math.round((0.5 * volume) + (0.5 * trend));
  }
  
  let level = 'safe';
  if (finalScore >= 35) level = 'high';
  else if (finalScore >= 20) level = 'moderate';
  
  return { score: finalScore, level, casesDay1: c1 };
}

function App() {
  const [section, setSection] = useState('home')
  const [userLoc, setUserLoc] = useState(null)
  const [nearestStation, setNearestStation] = useState(null)
  const [token, setToken] = useState(null)
  const [userArea, setUserArea] = useState('')
  const [userDistrict, setUserDistrict] = useState('')
  const [globalDistrict, setGlobalDistrict] = useState('all')
  const [hospitalRecords, setHospitalRecords] = useState([])
  const { stations } = useStations(token, 5000)

  // Centralized safety and outbreak risk calculation for the active district
  const activeRiskStatus = useMemo(() => {
    const active = globalDistrict === 'all' 
      ? (userDistrict || nearestStation?.district || 'Khordha') 
      : globalDistrict;
      
    const directStation = stations.find(s => s.district === active)
    if (directStation) {
      return directStation.readings.riskLevel || 'safe'
    }
    const clinical = calculateDistrictClinicalRisk(active, hospitalRecords)
    return clinical.level
  }, [globalDistrict, userDistrict, nearestStation, stations, hospitalRecords])

  const activeRiskLabel = useMemo(() => {
    const active = globalDistrict === 'all' 
      ? (userDistrict || nearestStation?.district || 'Khordha') 
      : globalDistrict;
      
    const directStation = stations.find(s => s.district === active)
    if (directStation) {
      return `${active} District (IoT Monitored)`
    }
    return `${active} District (Clinical Model)`
  }, [globalDistrict, userDistrict, nearestStation, stations])

  const reverseGeocode = async (lat, lng) => {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`)
      const j = await r.json()
      const addr = j.address || {}
      const area = addr.village || addr.suburb || addr.city || 'Detected Area'
      setUserArea(area)

      // Dynamically detect and clean Odisha district to match predefined districts
      const rawDist = addr.county || addr.district || addr.state_district || ''
      if (rawDist) {
        const cleanDist = rawDist.replace(/\s+District/gi, '').trim()
        const match = ODISHA_DISTRICTS.find(d => d.toLowerCase() === cleanDist.toLowerCase())
        if (match) {
          setUserDistrict(match)
          toast.info(`Active district detected: ${match}`)
        }
      }
    } catch (e) { console.error('Geocode error', e) }
  }

  const sendLocationToBackend = async (lat, lng) => {
    try {
      const r = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      })
      const data = await r.json()
      console.log('Location synced with server:', data)
      if (data.station) {
        setNearestStation(data.station)
        if (!userDistrict && data.station.district) {
          setUserDistrict(data.station.district)
        }
      }
    } catch (e) { console.error('Sync error', e) }
  }

  const getLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported')
    toast.info('Detecting location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLoc({ lat, lng })
        toast.success(`Location detected!`)
        reverseGeocode(lat, lng)
        sendLocationToBackend(lat, lng)
      },
      (err) => toast.error('Location access denied'),
      { timeout: 8000 }
    )
  }

  useEffect(() => {
    getLocation() // Initial auto-detect
    
    // Fetch hospital records globally for dynamic outbreak calculations
    fetch('/api/hospital/data', {
      headers: { 'Authorization': `Bearer hosp-demo` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j && j.data) setHospitalRecords(j.data) })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (!userLoc) return
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    fetch(`/api/stations/nearest?lat=${userLoc.lat}&lng=${userLoc.lng}`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(j => { 
        if (j && j.station) {
          setNearestStation(j.station)
          if (!userDistrict && j.station.district) {
            setUserDistrict(j.station.district)
          }
        } 
      })
      .catch(e => console.error(e))
  }, [userLoc, stations.length, token])

  // Refresh nearest periodically
  useEffect(() => {
    if (!userLoc) return
    const id = setInterval(() => {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
      fetch(`/api/stations/nearest?lat=${userLoc.lat}&lng=${userLoc.lng}`, { headers })
        .then(r => r.ok ? r.json() : null)
        .then(j => {
          if (j && j.station) {
            setNearestStation(j.station)
            if (!userDistrict && j.station.district) {
              setUserDistrict(j.station.district)
            }
          }
        })
        .catch(e => console.error(e))
    }, 5000)
    return () => clearInterval(id)
  }, [userLoc, token])

  return (
    <div className="min-h-screen bg-slate-50">
      <GovHeader 
        section={section} 
        setSection={setSection} 
        status={activeRiskStatus} 
        navbarLabel={activeRiskLabel}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {section === 'home' && <HomePage stations={stations} userLoc={userLoc} nearestStation={nearestStation} setSection={setSection} userArea={userArea} onGetLocation={getLocation} />}
        {section === 'dashboard' && (
          <DashboardPage 
            stations={stations} 
            userLoc={userLoc} 
            nearestStation={nearestStation} 
            userDistrict={userDistrict} 
            district={globalDistrict}
            setDistrict={setGlobalDistrict}
          />
        )}
        {section === 'alerts' && (
          <AlertsPage 
            stations={stations} 
            token={token} 
            selectedDistrict={globalDistrict} 
            setSelectedDistrict={setGlobalDistrict} 
          />
        )}
        {section === 'feedback' && <FeedbackPage userDistrict={globalDistrict === 'all' ? (userDistrict || 'Khordha') : globalDistrict} />}
        {section === 'hospital' && <HospitalPage token={token} onLogin={setToken} stations={stations} />}
      </main>
      <footer className="bg-blue-950 text-blue-100 text-sm py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Droplets className="w-5 h-5 text-cyan-300" /><span>AquaShield AI · Government of India</span></div>
          <div className="opacity-70 text-xs">© 2025 · Powered by AI · For demo & evaluation purposes</div>
        </div>
      </footer>
    </div>
  )
}

export default App
