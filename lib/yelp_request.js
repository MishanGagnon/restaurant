'use strict';

const dotenv = require('dotenv');
const yelp = require('yelp-fusion');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const make_request = async (request_obj) => {
    console.log(process.env.NEXT_YELP_API_KEY)
    try {
        const client = yelp.client(process.env.NEXT_YELP_API_KEY);

        const request = await client.search(request_obj);
        // console.log(request.jsonBody);

        // Return the data if needed
        return request.jsonBody;
    } catch (error) {
        console.error('An error occurred:', error);

        // Return a custom error object or message
        return { error: 'An error occurred while fetching data from Yelp.' };
    }
}

// make_request({ location: "NYC", sort_by: 'best_match', limit: '10' })
//     .then(data => {
//         // Handle the result if needed
//         if (data.error) {
//             console.error('Error:', data.error);
//         } else {
//             console.log('Yelp Data:', data);
//         }
//     });

// Export the function for use in other modules
module.exports = { make_request };
