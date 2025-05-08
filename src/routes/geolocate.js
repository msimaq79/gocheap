const express = require('express');
const router = express.Router();
const geolocateService = require('../services/geolocate');

router.post('/', async (req, res) => {
    try {
        const location = await geolocateService.getLocation(req.ip);
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Failed to geolocate' });
    }
});

module.exports = router;