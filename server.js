require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.get('/location', (request, response) => {
    try {
        const location = request.query.location;
        const result = getLatLng(location);
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
    const firstResult = geoData.results[0];
    const geometry = firstResult.geometry;
    
    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}




app.get('/weather', (request, response) => {
    try {
        const location = request.query.location;
        const result = getWeather(location);
        response.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        response.status(500).send('Sorry WEATHER went wrong, please try again.');
    }
});

const darkSkyData = require('./data/darksky.json');

function getWeather(location) {
    if (location === 'bad location') throw new Error();
    
    return toWeather(darkSkyData);
}

function toWeather() {
    const firstResult = darkSkyData;
    
    return {
        forecast: firstResult.hourly.summary,
        time: firstResult.hourly.data[0].time
    };
}






app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});