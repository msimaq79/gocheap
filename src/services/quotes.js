const axios = require('axios');
const cache = require('../utils/cache');

class QuotesService {
    constructor() {
        this.apiKey = process.env.RAPIDAPI_KEY;
        this.baseUrl = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices';
    }

    async getQuotes(origin, destination, date) {
        const cacheKey = `quotes:${origin}:${destination}:${date}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const response = await axios.get(`${this.baseUrl}/browsequotes/v1.0/US/USD/en-US/${origin}/${destination}/${date}`, {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': this.apiKey
            }
        });

        const quotes = response.data.Quotes.map(quote => ({
            price: quote.MinPrice,
            direct: quote.Direct,
            outboundLeg: {
                departureDate: quote.OutboundLeg.DepartureDate,
                carrierId: quote.OutboundLeg.CarrierId
            }
        }));

        cache.set(cacheKey, quotes, 1000 * 60 * 15); // 15 minutes cache for prices
        return quotes;
    }
}

module.exports = new QuotesService();