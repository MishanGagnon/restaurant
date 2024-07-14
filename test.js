const yelp = require('yelp-fusion');
const fs = require('fs');
require('dotenv').config();

// Replace 'YOUR_API_KEY' with your actual Yelp API key
const apiKey = process.env.NEXT_YELP_API_KEY;
const client = yelp.client(apiKey);

client.search({
  term: 'restaurants',
  latitude: '42.279594', // Replace with your location, e.g., 'San Francisco, CA',
  longitude: '-83.732124',
  sort_by: 'best_match',
  limit: 20
})
  .then(response => {
    const jsonData = JSON.stringify(response.jsonBody.businesses, null, 2);
    fs.writeFile('yelp_results.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('An error occurred while writing JSON Object to File.');
        return console.error(err);
      }
      console.log('JSON file has been saved.');
    });
  })
  .catch(e => {
    console.error(e);
  });
