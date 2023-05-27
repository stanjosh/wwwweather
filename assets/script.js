const apiKey = "5d57c1a075cc44b480c4eedf9be3116d"
var currentWeather = {};
var forecastWeather = {};
var long;
var lat;



function toF(t) {return (t * 9) / 5 + 32}

function degToCompass(num) {
    var deg = Math.floor((num / 22.5) + 0.5) % 16;
    var dir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dir[deg];
}

function getBrowserLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        console.log(lat, long)
        return true
        })
    }
    else {
        return false
    }
}








async function getCityCoords(city, state=null, country=null) {
    if (city) {(city += ',')}
    if (state) {(state += ',')}
    url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}${state}${country}&limit=3&appid=${apiKey}`, {"method": "GET"}
    fetch(url).then((resp) => {
        return resp.json()
    })
    .then((data) => {
        long = data.longitude
        lat = data.latitude
        return data
    })
}


async function getForecast(){
    if ([lat, long].every(Boolean)){
    const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
    const getForecastWeather = fetch(api)
    return getForecastWeather}
}




async function getWeather(){
    if ([lat, long].every(Boolean)){
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
    const getCurrentWeather = fetch(api)
    return getCurrentWeather}
}


async function drawCurrentWeather(){
    getWeather().then((resp) => {
        return resp.json()
    })
    .then((data) => {        
    $('#currentPlaceName').text(data.name + dayjs(data.dt_txt).format('M/D h:m'))
    $('#currentPlaceHumidity').text(data.main.humidity)
    $('#currentPlaceTemp').text(toF(data.main.temp).toFixed(2))
    $('#currentPlaceWind').text(data.wind.speed + ' mph ' + degToCompass(data.wind.deg))
    $('#currentPlaceConditions').text(data.weather.main)
    $('currentPlaceConditionsDescription').text(data.weather.description)
    })
}



async function drawForecast(){
    getForecast().then((resp) => {
        return resp.json()
    })
    .then((data) => {  
    for (var i = 0; i < data.list.length; i += 8) {
        const forecastTemplate = 
        `<div class="col">
        <div class="card forecast w-100">
            <div class="card-header">${dayjs(data.list[i].dt_txt).format('dddd, M/D')}</div>
            <div class="card-body">
                <h5 class="card-title">${data.list[i].weather[0].main}</h5>
                <p class="card-text">${data.list[i].weather[0].description}</p>
                <p class="card-text">${toF(data.list[i].main.temp).toFixed(2)}</p>
                <p class="card-text">${data.list[i].main.humidity}</p>
                <p class="card-text">${data.list[i].wind.speed + ' mph ' + degToCompass(data.list[i].wind.deg)}</p>
            </div></div></div>`
        $("#forecastContainer").append(forecastTemplate);
    }})
}


getBrowserLocation()
$(document).ready(async function() {
    await drawCurrentWeather()
    await drawForecast()
});