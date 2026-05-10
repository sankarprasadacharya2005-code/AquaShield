/**
 * Logic to calculate water safety risk level and outbreak probability
 */
const calculateRisk = (ph, turbidity, temperature, dissolvedOxygen) => {
    let score = 0;

    // pH Score (Ideal: 6.5 - 8.5)
    if (ph < 6.5 || ph > 8.5) score += 20;
    if (ph < 5.5 || ph > 9.5) score += 15;

    // Turbidity Score (Ideal: < 5 NTU)
    if (turbidity > 5) score += 15;
    if (turbidity > 15) score += 20;

    // Dissolved Oxygen Score (Ideal: > 5 mg/L)
    if (dissolvedOxygen < 5) score += 15;
    if (dissolvedOxygen < 3) score += 20;

    // Temperature Impact (Simple logic)
    if (temperature > 30) score += 10;

    // Calculate Outbreak Probability (%)
    const outbreakProbability = Math.min(score, 100);

    // Determine Risk Level
    let riskLevel = 'Low';
    if (outbreakProbability > 30) riskLevel = 'Moderate';
    if (outbreakProbability > 60) riskLevel = 'High';

    return { outbreakProbability, riskLevel };
};

module.exports = { calculateRisk };
