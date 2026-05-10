/**
 * Advanced Multi-Factor Risk Calculation Engine (Express Utility)
 */
const calculateRisk = (data) => {
    const { ph, turbidity, temp, dissolvedOxygen: dox, hospitalCases, prevWeekCases, complaints, rainfall } = data;

    // STEP 1: WATER QUALITY SCORING (0–100)
    let waterScore = 0;
    if (ph < 6.5) waterScore += Math.min(25, (6.5 - ph) * 20);
    else if (ph > 8.5) waterScore += Math.min(25, (ph - 8.5) * 20);
    if (turbidity > 5) waterScore += Math.min(30, (turbidity - 5) * 5);
    if (dox < 5) waterScore += Math.min(30, (5 - dox) * 10);
    if (temp > 30) waterScore += Math.min(15, (temp - 30) * 5);
    else if (temp < 20) waterScore += Math.min(15, (20 - temp) * 2);
    waterScore = Math.min(100, waterScore);

    // STEP 2: HOSPITAL TREND SCORE (0–100)
    const prev = prevWeekCases || Math.max(1, hospitalCases - 2);
    const growthRate = ((hospitalCases - prev) / prev) * 100;
    let hospitalScore = 0;
    if (growthRate > 100) hospitalScore = 100;
    else if (growthRate > 50) hospitalScore = 80;
    else if (growthRate > 20) hospitalScore = 50;
    else if (growthRate > 0) hospitalScore = 20;
    else hospitalScore = 5;

    // STEP 3: PUBLIC FEEDBACK SCORE (0–100)
    let feedbackScore = Math.min(100, (complaints || 0) * 5);
    if (rainfall > 20) feedbackScore = Math.min(100, feedbackScore * 1.5);

    // STEP 4: DYNAMIC WEIGHTED RISK FORMULA
    const rainfallImpact = Math.min(100, (rainfall || 0) * 2);
    const finalRiskScore = Math.round(
        (waterScore * 0.45) +
        (hospitalScore * 0.35) +
        (feedbackScore * 0.15) +
        (rainfallImpact * 0.05)
    );

    // STEP 5: RISK CLASSIFICATION
    let riskLevel = 'safe';
    if (finalRiskScore >= 75) riskLevel = 'high';
    else if (finalRiskScore >= 45) riskLevel = 'moderate';

    // STEP 6: ALERT LOGIC
    let alertMessage = 'Water quality is within normal limits.';
    let recommendedAction = 'No action required. Water is safe for consumption.';

    if (waterScore > 60 && hospitalScore > 50) {
        alertMessage = 'CRITICAL OUTBREAK WARNING: High contamination matched with rising hospital cases!';
        recommendedAction = 'IMMEDIATE ACTION: Health authorities notified. Stop water usage until further notice.';
    } else if (finalRiskScore >= 75) {
        alertMessage = 'RED ALERT: Significant disease risk detected.';
        recommendedAction = 'ADVISORY: Boil water before drinking. Use filtration systems if available.';
    } else if (finalRiskScore >= 45) {
        alertMessage = 'MODERATE ALERT: Slight increase in risk parameters.';
        recommendedAction = 'PRECAUTION: Use filtered water and monitor for symptoms.';
    }

    return {
        waterScore: Math.round(waterScore),
        hospitalScore: Math.round(hospitalScore),
        feedbackScore: Math.round(feedbackScore),
        hospitalGrowthRate: +growthRate.toFixed(1),
        rainfallImpact: Math.round(rainfallImpact),
        finalRiskScore,
        riskLevel,
        alertMessage,
        recommendedAction
    };
};

module.exports = { calculateRisk };
