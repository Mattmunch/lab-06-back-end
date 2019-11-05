require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/location', (request, response) => {
    console.log('hello');
    try {
        console.log(request.query);
        const location = request.query.location;
        console.log(location);
        const result = getLatLng(location);
        console.log(result);
        response.status(200).json(result);
    }
    catch (err) {
        response.status(500).send('Sorry EVERYTHING went wrong, please try again.');
    }
});

const geoData = require('./data/geo.json');

function getLatLng(location) {
    if (location === 'bad location') throw new Error();

    return toLocation(geoData);
}

function toLocation() {
    const firstResult = geoData.result[0];
    const geometry = firstResult.geometry;

    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});