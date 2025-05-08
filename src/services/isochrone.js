const axios = require('axios');
const cache = require('../utils/cache');

class IsochroneService {
    constructor() {
        this.apiKey = process.env.OPENROUTE_API_KEY;
        this.baseUrl = 'https://api.openrouteservice.org/v2/isochrones';
    }

    async getIsochrone(latitude, longitude, timeLimit) {
        const cacheKey = `isochrone:${latitude}:${longitude}:${timeLimit}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const response = await axios.post(this.baseUrl, {
            locations: [[longitude, latitude]],
            range: [timeLimit * 60],  // Convert minutes to seconds
            range_type: 'time',
            attributes: ['area', 'reachfactor', 'total_pop']
        }, {
            headers: {
                'Authorization': this.apiKey,
                'Content-Type': 'application/json'
            }
        });

        const result = {
            geometry: response.data.features[0].geometry,
            properties: response.data.features[0].properties
        };

        cache.set(cacheKey, result);
        return result;
    }
}

module.exports = new IsochroneService();