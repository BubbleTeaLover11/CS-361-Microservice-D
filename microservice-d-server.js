const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3003;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

const mmBarToInHg = (mBar) => mBar * 0.02953

async function pressureData (lat, lon, key) {

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`);
    let data = await response.json();
    let jsonData = {
        'mmHgPressure': data["main"]["pressure"],
    }
    jsonData['torrPressure'] = Math.round(mmBarToInHg(jsonData['mmHgPressure']) * 100) / 100

    return jsonData
};

app.post("/pressureData", (req, res) => {
    pressureData(req.body["lat"], req.body["lon"], req.body["key"]).then((data) =>
        res.send(data))
})

app.listen(PORT, () => {
    console.log(`Litsening on port ${PORT}`)
});