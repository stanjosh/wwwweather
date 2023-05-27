const apiKey = "5d57c1a075cc44b480c4eedf9be3116d"
var currentWeather = {};
var forecastWeather = {};
var long;
var lat;

var sideCities = [
    'Atlanta',
    'Denver',
    'Seattle',
    'San Francisco',
    'Orlando',
    'New York',
    'Chicago',
    'Austin'
]

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


async function searchWeather(search){
    await getCityCoords(search).then((resp) => {
        return resp.json()
    })
    .then((data) => {
        lat = data[0].lat
        long = data[0].lon
        drawCurrentWeather()
        drawForecast()
        console.log(data)
    })
    
}


async function getCityCoords(search) {
    const api = `https://api.openweathermap.org/geo/1.0/direct?q=${search},US&limit=3&appid=${apiKey}`;
    const getCoords = fetch(api)
    return getCoords}


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
    await getWeather().then((resp) => {
        return resp.json()
    })
    .then((data) => {        
    $('#currentPlaceName').text(`${data.name}, ${dayjs(data.dt_txt).format("M/D h:mm")}`)
    $('#currentPlaceHumidity').text(data.main.humidity)
    $('#currentPlaceTemp').text(toF(data.main.temp).toFixed(2))
    $('#currentPlaceWind').text(data.wind.speed + ' mph ' + degToCompass(data.wind.deg))
    $('currentPlaceConditionsDescription').text(data.weather[0].description)
    })
}



async function drawForecast(){
    await getForecast().then((resp) => {
        return resp.json()
    })
    .then((data) => {  
    $('#forecastContainer').empty()
    console.log(data)
    tempArr = data
    for (var i = 0; i < data.list.length; i += 8) {
        let minTemp = 300;
        let maxTemp = 0;
        let dayTemp = (toF(data.list[i].main.temp).toFixed(0))
        for (var t = i; t < i + 7; t++) {
            dayTemp = (toF(data.list[t].main.temp).toFixed(0))
            if  (dayTemp > maxTemp) {
                maxTemp = dayTemp

            }
            if (dayTemp < minTemp) {
                minTemp = dayTemp
                
            }
        }
        const forecastTemplate = 
        `<div class="col-12 col-lg-2">
        <div class="card forecast w-100 mx-0">
            <div class="card-header">${dayjs(data.list[i].dt_txt).format('dddd, M/D')}</div>
            <div class="card-body bg-secondary text-light">
                <h5 class="card-title">${data.list[i].weather[0].description}</h5>
                <img class="img-fluid mx-auto d-block" src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">
                <p class="card-text">${maxTemp}&#176;F/ ${minTemp}&#176;F</p>
                <p class="card-text">Humidity: ${data.list[i].main.humidity}</p>
                <p class="card-text">Wind: ${data.list[i].wind.speed + ' mph ' + degToCompass(data.list[i].wind.deg)}</p>
            </div></div></div>`
        $("#forecastContainer").append(forecastTemplate);
    }})
}

for (var i in sideCities) {
    $('#citiesContainer').append(`<button id="button${i}" data-city="${sideCities[i]}">`)
    $(`#button${i}`).addClass('btn btn-primary w-100 mb-3 cityButton')
    $(`#button${i}`).text(sideCities[i])
}



$('#searchBox').on('submit' , function(event) {
    event.preventDefault();
    search = $(this).children('input').val()
    searchWeather(search)
    console.log(search)
})

$('.cityButton').on('click', function() {
    console.log($(this).attr('data-city'))
    searchWeather($(this).attr('data-city'))
})

getBrowserLocation()
$(document).ready(function() {
    //drawCurrentWeather()
    //drawForecast()
});
