const express = require('express');
const router = express.Router();
const recommendService = require('../services/recommend');

router.post('/', async (req, res) => {
    try {
        const { origin, date, budget, maxTravelTime } = req.body;
        const recommendations = await recommendService.getRecommendations(origin, date, budget, maxTravelTime);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

module.exports = router;