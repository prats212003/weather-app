let weatherform = document.querySelector(".weatherform");
let cityinput = document.querySelector(".cityinput")
let card = document.querySelector(".card")
let apikey = "705df37a320ecab15edf06f7149e86c5";

weatherform.addEventListener("submit",async event => {
    event.preventDefault();
    let city = cityinput.value;

    if(city){
        try{
            let weatherData = await getweatherData(city);
            displayweatherinfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city"); 
    }

});

async function getweatherData(city){

    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`

    let response = await fetch(apiUrl);

    console.log(response);

    return await response.json();
}

function displayweatherinfo(data){

    let {name : city, 
        main : {temp,humidity},
        weather : [{description,id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    let cityDisplay = document.createElement("h1");
    let tempDisplay = document.createElement("p");
    let humidityDisplay = document.createElement("p");
    let descDisplay = document.createElement("p");
    let weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°c`;
    humidityDisplay.textContent = `Humidity: ${humidity}`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getweatherEmoji(id);


    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    setCardBackground(id);

} 

function getweatherEmoji(weatherid) {
    switch (true) {
        case (weatherid >= 200 && weatherid < 300): // Thunderstorm
            return "⛈️";
        case (weatherid >= 300 && weatherid < 400): // Drizzle
            return "🌦️";
        case (weatherid >= 500 && weatherid < 600): // Rain
            return "☔️";
        case (weatherid >= 600 && weatherid < 700): // Snow
            return "❄️";
        case (weatherid >= 700 && weatherid < 800): // Atmosphere
            return "🌫️";
        case (weatherid === 800): // Clear sky
            return "☀️";
        case (weatherid > 800 && weatherid < 900): // Clouds
            return "☁️";
        default:
            return "❓";
    }
}

function setCardBackground(weatherid) {
    switch (true) {
        case (weatherid >= 200 && weatherid < 300): // Thunderstorm
            card.style.backgroundColor = "#4a4e69";
            break;
        case (weatherid >= 300 && weatherid < 400): // Drizzle
            card.style.backgroundColor = "#a2a8d3";
            break;
        case (weatherid >= 500 && weatherid < 600): // Rain
            card.style.backgroundColor = "#3c415c";
            break;
        case (weatherid >= 600 && weatherid < 700): // Snow
            card.style.backgroundColor = "#e0f7fa";
            break;
        case (weatherid === 800): // Clear
            card.style.backgroundColor = "#87ceeb";
            break;
        case (weatherid > 800 && weatherid <= 804): // Clouds
            card.style.backgroundColor = "#d3d3d3";
            break;
        default:
            card.style.backgroundColor = "#ffffff";
    }
}

function displayError(message){

    let errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;       
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

console.log("Weather ID:", weatherid);
