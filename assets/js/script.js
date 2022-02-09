var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var searchHistoryEl = document.querySelector("#search-history");
var displayCurrentEl = document.querySelector("#current-display");
var currentHeaderEl = document.querySelector("#current-header");
var currentInfoEl = document.querySelector("#current-info");
var displayForecastEl = document.querySelector("#forecast");
var forecastHeaderEl = document.querySelector("#forecast-header");
var forecastCardsEl = document.querySelector("#forecast-cards");
var recentSearches = [];

// search form submission
var searchHandler = function(event) {
    event.preventDefault();

    if (!currentHeaderEl) {
        return;
    } else {
        currentHeaderEl.innerHTML = "";
        displayCurrentEl.innerHTML = "";
    }

    // clear old forecast content
    if (!forecastHeaderEl || !forecastCardsEl) {
        return;
    } else {
        forecastHeaderEl.textContent = "";
        forecastCardsEl.textContent = "";
    }
    
    // call function to display city name from search input
    if (cityInputEl.value === "" || null) {
        return;
    } else {
        displayCityDate();
    }

    getInput();
};

var getInput = function() {
    // get value from form input
    var city = cityInputEl.value.trim();

    saveSearch(city);

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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=b1880cbaa2479f040cc0422d1ba0e19f";

    // make a request to the url
    fetch(apiUrl)
    .then(function(response) {
        // if response successful
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrentInfo(data);
                displayForecast(data);
            });
        // if response fail
        } else {
            alert("Error: Weather data not found.");
        }
        // if network fail
    }).catch(function(error) {
        alert("Unable to connect")
    });
};

// display city name
var displayCityDate = function() {
    // display city name as h2 within
    var displayCity = document.createElement("h2");
    displayCity.textContent = cityInputEl.value.toUpperCase() + " ";
    displayCity.setAttribute("class", "title");
    displayCity.setAttribute("id", "current-title")
    // append city name h2 to currentHeaderEl div
    currentHeaderEl.appendChild(displayCity);

    // append div to displayCurrentEl DOM element
    displayCurrentEl.appendChild(currentHeaderEl);
    
    // get today's date and define format using moment.js
    var dateToday = moment().format("MM/DD/YYYY");

    // create span element for date
    var displayDate = document.createElement("span");
    displayDate.textContent = "(" + dateToday + ")";

    // append date to currentHeaderEl div
    displayCity.appendChild(displayDate);
};

// display current info from weather API
var displayCurrentInfo = function(data) {
    // add weather icon to header 
    var icon = document.createElement("span");
    icon.innerHTML = "<image src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png' />";
    $("#current-title").append(icon);

    // style displayCurrentEl
    displayCurrentEl.setAttribute("class", "box mt-3");

    // add current temp to displayCurrentEl
    var temp = document.createElement("p");
    temp.textContent = "Temp: " + data.current.temp + "  \u00B0 F";
    temp.setAttribute("class", "mb-2");
    displayCurrentEl.appendChild(temp);
    
    // add wind to displayCurrentEl
    var wind = document.createElement("p");
    wind.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
    wind.setAttribute("class", "mb-2");
    displayCurrentEl.appendChild(wind);

    // add humidity to displayCurrentEl
    var humidity = document.createElement("p");
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    humidity.setAttribute("class", "mb-2");
    displayCurrentEl.appendChild(humidity);

    // add UV index to displayCurrentEl
    var uvIndex = document.createElement("p");
    uvIndex.textContent = "UV Index: " + data.current.uvi;
    uvIndex.setAttribute("id", "uv");

    // set background based on UV conditions
    if (data.current.uvi < 2) {
        uvIndex.setAttribute("class", "has-background-success");
    } else if ((3 >= data.current.uvi) && (5 >= data.current.uvi)) {
        uvIndex.setAttribute("class", "has-background-warning");
    } 
    else if ((6 >= data.current.uvi) && (7 >= data.current.uvi)) {
        uvIndex.setAttribute("class", "has-background-danger");
    } else if ((8 >= data.current.uvi) && (10 >= data.current.uvi)) {
        uvIndex.setAttribute("class", "has-background-hot-pink");
    } else if (data.current.uvi > 11) {
        uvIndex.setAttribute("class", "has-background-info");
    } else {
        return;
    }

    displayCurrentEl.appendChild(uvIndex);
};

// display 5-day forecast
// for each day: date, icon for weather conditions, temp, wind, humidity stacked in boxes
var displayForecast = function(data) {
    // style displayForecastEl
    displayForecastEl.setAttribute("class", "box mt-3");

    // display header
    var colHeader = document.createElement("h2");
    colHeader.textContent = "5-DAY FORECAST";
    colHeader.setAttribute("class", "title");
    forecastHeaderEl.appendChild(colHeader);

    for (i = 1; i < data.daily.length-2; i++) {
        // create container(box)
        var box = document.createElement("div");
        box.setAttribute("class", "daily box m-2");
        forecastCardsEl.appendChild(box);

        // add date to each displayCurrentEl
        var date = document.createElement("p");
        var today = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
        date.textContent = today;
        box.appendChild(date);

        // add weather icon to header 
        var icon = document.createElement("span");
        icon.innerHTML = "<image src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' />";
        box.appendChild(icon);

        // add temp to daily forcast boxes
        var temp = document.createElement("p");
        temp.textContent = "Temp: " + data.daily[i].temp.day + "  \u00B0 F";
        temp.setAttribute("class", "mb-2");
        box.appendChild(temp);

        // add wind to displayCurrentEl
        var wind = document.createElement("p");
        wind.textContent = "Wind Speed: " + data.daily[i].wind_speed + " MPH";
        wind.setAttribute("class", "mb-2");
        box.appendChild(wind);

        // add humidity to displayCurrentEl
        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        humidity.setAttribute("class", "mb-2");
        box.appendChild(humidity);

        // add UV index to displayCurrentEl
        var uvIndex = document.createElement("p");
        uvIndex.textContent = "UV Index: " + data.daily[i].uvi;
        uvIndex.setAttribute("id", "uv");
        box.appendChild(uvIndex);

        // set background based on UV conditions
        if (data.daily[i].uvi < 2) {
            uvIndex.setAttribute("class", "has-background-success");
        } else if ((3 >= data.daily[i].uvi) && (5 >= data.daily[i].uvi)) {
            uvIndex.setAttribute("class", "has-background-warning");
        } 
        else if ((6 >= data.daily[i].uvi) && (7 >= data.daily[i].uvi)) {
            uvIndex.setAttribute("class", "has-background-danger");
        } else if ((8 >= data.daily[i].uvi) && (10 >= data.daily[i].uvi)) {
            uvIndex.setAttribute("class", "has-background-hot-pink");
        } else if (data.daily[i].uvi > 11) {
            uvIndex.setAttribute("class", "has-background-info");
        } else {
            return;
        }
    }
};

// Save recent searches to local storage
var saveSearch = function(input) {
    var cityStripped = input.replace(/\s*/g, "").toLowerCase();

    if (recentSearches.indexOf(cityStripped)=== -1) {
        recentSearches.push(cityStripped);

        if (recentSearches.length > 10) {
            recentSearches.shift();
        }
  
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }

    displaySearches();
};

// display array from local storage
var displaySearches = function() {
    // if there are no searches, set tasks to an empty array and return out of the function
    if (!recentSearches) {
        return false;
    } else {
        // add container
        var recentSearchesListEl = document.createElement("div");
        recentSearchesListEl.setAttribute("id", "item");
    }

    // loop through savedSearches array
    for (var i = 0; i < recentSearches.length; i++) {    
      //pass each task object into the div
      var search = document.createElement("button");
      search.setAttribute("value", recentSearches[i]);
      search.textContent = recentSearches[i];
      search.classList = "button is-fullwidth block has-background-grey-lighter";
  
      recentSearchesListEl.appendChild(search);
      searchHistoryEl.appendChild(recentSearchesListEl);  
    }
};

// make recent searches clickable and display results on page
$("#item").on("click", "button", function () {
    var buttonText = $(this).attr("value");
    console.log(buttonText);
    getLatLon(buttonText);
});

searchFormEl.addEventListener("submit", searchHandler);

// display recent searches on page load
displaySearches();