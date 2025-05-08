const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/geolocate', require('./routes/geolocate'));
app.use('/api/isochrone', require('./routes/isochrone'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/recommend', require('./routes/recommend'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});