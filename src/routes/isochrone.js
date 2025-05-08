const express = require('express');
const router = express.Router();
const isochroneService = require('../services/isochrone');

router.post('/', async (req, res) => {
    try {
        const { latitude, longitude, timeLimit } = req.body;
        const isochrone = await isochroneService.getIsochrone(latitude, longitude, timeLimit);
        res.json(isochrone);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate isochrone' });
    }
});

module.exports = router;