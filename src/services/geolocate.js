const cache = require('../utils/cache');

class GeolocateService {
    async getLocation(ip) {
        const cached = cache.get(ip);
        if (cached) return cached;

        // TODO: Implement actual IP geolocation using a service
        const mockLocation = {
            latitude: 51.5074,
            longitude: -0.1278,
            city: 'London',
            country: 'GB'
        };

        cache.set(ip, mockLocation);
        return mockLocation;
    }
}

module.exports = new GeolocateService();