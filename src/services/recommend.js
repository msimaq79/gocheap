const quotesService = require('./quotes');
const isochroneService = require('./isochrone');
const { normalize, calculateScore } = require('../utils/normalize');

class RecommendService {
    async getRecommendations(origin, date, budget, maxTravelTime) {
        // Get quotes for all major destinations within budget
        const destinations = await this._getMajorDestinations();
        const quotes = await Promise.all(
            destinations.map(dest => 
                quotesService.getQuotes(origin, dest.code, date)
                    .catch(() => []) // Skip failed quotes
            )
        );

        // Filter and combine quotes with destinations
        const validQuotes = destinations.map((dest, i) => ({
            destination: dest,
            quotes: quotes[i].filter(q => q.price <= budget)
        })).filter(d => d.quotes.length > 0);

        // Get travel times for each destination
        const travelTimes = await Promise.all(
            validQuotes.map(q => 
                isochroneService.getIsochrone(
                    q.destination.latitude,
                    q.destination.longitude,
                    maxTravelTime
                ).catch(() => null)
            )
        );

        // Calculate scores and sort recommendations
        const recommendations = validQuotes
            .map((quote, i) => {
                const travelTime = travelTimes[i];
                if (!travelTime) return null;

                const bestPrice = Math.min(...quote.quotes.map(q => q.price));
                const priceScore = normalize(bestPrice, 0, budget);
                const timeScore = normalize(travelTime.properties.total_time, 0, maxTravelTime * 60);
                
                return {
                    destination: quote.destination,
                    price: bestPrice,
                    travelTime: travelTime.properties.total_time / 60, // Convert to minutes
                    score: calculateScore(priceScore, timeScore),
                    quotes: quote.quotes,
                    isochrone: travelTime.geometry
                };
            })
            .filter(r => r !== null)
            .sort((a, b) => b.score - a.score);

        return recommendations;
    }

    async _getMajorDestinations() {
        // TODO: Replace with actual major destinations database
        return [
            { code: 'JFK', name: 'New York', latitude: 40.6413, longitude: -73.7781 },
            { code: 'LAX', name: 'Los Angeles', latitude: 33.9416, longitude: -118.4085 },
            { code: 'ORD', name: 'Chicago', latitude: 41.9786, longitude: -87.9048 },
            // Add more destinations as needed
        ];
    }
}

module.exports = new RecommendService();