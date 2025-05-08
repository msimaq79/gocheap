const express = require('express');
const router = express.Router();
const quotesService = require('../services/quotes');

router.post('/', async (req, res) => {
    try {
        const { origin, destination, date } = req.body;
        const quotes = await quotesService.getQuotes(origin, destination, date);
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch flight quotes' });
    }
});

module.exports = router;