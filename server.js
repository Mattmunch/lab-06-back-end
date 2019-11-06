require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3001;
app.use(cors());
let latlngs;

const formatLocationResponse = locationItem => {
    const {
        geometry: {
            location: {
                lat,
                lng,
            },
        },
        formatted_address,
    } = locationItem;
    console.log(locationItem);
    return {
        formatted_query: formatted_address,
        latitude:lat,
        longitude:lng,
    };
};

const getWeatherResponse = async(lat, lng) => {
    const weatherData = await superagent.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`);
    const actualWeatherData = JSON.parse(weatherData.text);
    const dailyArray = actualWeatherData.daily.data;
    const mundgedArray = dailyArray.map(weatherItem => {
        console.log(weatherItem);
        return {
            forecast: weatherItem.summary,
            time: new Date(weatherItem.time * 1000).toDateString(),
        };
    });
    
    return mundgedArray;
};
const getYelpResponse = async(lat, lng) => {
    cosnt yelpData = await superagent.get()
}

// const getEventResponse = async(lat, lng) => {
//     const eventData = await superagent.get('https://www.eventbriteapi.com/v3/users/me/?token=HK2JOUEQYIUWCLIXJMXE');
//     const actualEventData = JSON.parse(eventData.text);
//     const eventArray;
//     const mundgedArray = eventArray.map()


// }


app.get('/location', async(req, res) => {
    const searchQuery = req.query.search;
    console.log('ToDo:using this search with api', searchQuery);

    const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

    const locationItem = await superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${GEOCODE_API_KEY}`);
    console.log(locationItem.text);

    const actualItem = JSON.parse(locationItem.text).results[0];
    const response = formatLocationResponse(actualItem);
    latlngs = response;

    res.json(response);
});

app.get('/weather', async(req, res) => {
    const weatherObject = await getWeatherResponse(latlngs.latitude, latlngs.longitude);
    console.log('ToDo: Using this search with api', weatherObject);

    res.json(weatherObject);
});
app.get('/yelp', async(req, res) => {
    const yelpObject = await getYelpResponse(latlngs.latitude, latlngs.longitude);
    console.log('ToDo: Using this search with api', yelpObject);
});

// app.get('/events', async(req, res) => {
//     const eventObject = await getEventResponse(latlngs.latitude, latlngs.longitude);
//     console.log('ToDo: Using this search with api', eventObject);

//     res.json(eventObject);
// })







app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});