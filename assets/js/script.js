var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var searchButton = document.querySelector("#search");
var searchHistoryEl = document.querySelector("#search-history");
var displayCityEl = document.querySelector("#city-display");
var displayForecastEl = document.querySelector("#forecast");


// search area form submission
var searchHandler = function(event) {
    event.preventDefault();
    // get value from form input
    var city = cityInputEl.value.trim();
// need to add data validation for format of search "city, state, country"
    if (city) {
        getLatLon(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city, state, country.")
    }
};


// convert city, state, country to lat/lon
var getLatLon = function(city) {
    // remove all spaces
    var cityStripped = city.replace(/\s*/g, "").toLowerCase();

    // geocoding API conversion
    var getCityDetails = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityStripped + "&limit=1&appid=b1880cbaa2479f040cc0422d1ba0e19f";

    fetch(getCityDetails)
    .then(function(response) {
        // 
        if (response.ok) {
            response.json().then(function(getCityDetails) {
                getWeatherData(getCityDetails);
            });
        } else {
            alert("Error: City not found. Please make sure to format your search as 'city, state, country'. Example 'denver, co, usa'.");
        }
    }).catch(function(error) {
        alert("Unable to connect to Open Weather Map")
    });
};

//get data from weather API
var getWeatherData = function(cityDetails) {
    var lat = cityDetails[0].lat;
    var lon = cityDetails[0].lon;

    // format api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=b1880cbaa2479f040cc0422d1ba0e19f";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // if response successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        // if response fail
        } else {
            alert("Error");
        }
        // if network fail
    }).catch(function(error) {
        alert("Unable to connect")
    });
};


searchFormEl.addEventListener("submit", searchHandler);