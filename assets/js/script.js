var searchFormEl = document.querySelector("#search-form");
var searchHistoryEl = document.querySelector("#search-history");
var displayCityEl = document.querySelector("#city-display");
var displayForecastEl = document.querySelector("#forecast");

var getWeatherData = function() {
    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=40.7608&lon=111.8910&exclude=minutely,hourly&appid=b1880cbaa2479f040cc0422d1ba0e19f";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // if successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            alert("Error");
        }
    }).catch(function(error) {
        alert("Unable to connect")
    });
};

getWeatherData();