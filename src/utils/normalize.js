/**
 * Normalizes a value between 0 and 1 based on min/max range
 */
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

/**
 * Calculates a score based on price and travel time
 * @param {number} priceScore - Normalized price score (0-1)
 * @param {number} timeScore - Normalized time score (0-1)
 * @returns {number} Combined score (higher is better)
 */
function calculateScore(priceScore, timeScore) {
    // Weight price slightly more than time (0.6 vs 0.4)
    return (priceScore * 0.6) + (timeScore * 0.4);
}

module.exports = {
    normalize,
    calculateScore
};