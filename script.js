let cityName = document.querySelector(".location");
let locSearch = document.querySelector(".loc_search");
let temp_card = document.querySelector(".temp");
let apikey = "705df37a320ecab15edf06f7149e86c5";
let temperature = document.querySelector(".temperature");
let desc = document.querySelector(".desc");
let main_aqi = document.querySelector(".main_aqi");
let aqi_desc = document.querySelector(".aqi_desc");
let pm25 = document.querySelector(".pm25_count");
let pm10 = document.querySelector(".pm10_count");
let co = document.querySelector(".co_count");
let so2 = document.querySelector(".SO₂_count");
let no2 = document.querySelector(".NO₂_count");
let o3 = document.querySelector(".O₃_count");
let humidity_val = document.querySelector(".humidity");
let pressure_val = document.querySelector(".pressure");
let wind_val = document.querySelector(".wind");


// https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=39.099724&lon=-94.578331&date=2020-03-04&appid={API key}

// let temp_day = document.querySelector(".temp_day");

// 🌍 WAQI TOKEN (replace demo with your own later)
let aqiToken = "f4b35813f5798775bf927443141a762abf878e8c";

// function to fetch weather
async function getWeather(city) {

    // WEATHER API
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    let res = await fetch(apiUrl);
    let data = await res.json();

    console.log(data);

    cityName.textContent = data.name;

    let temp = data.main.temp;
    let desc_val = data.weather[0].description;
    let emoji_id = data.weather[0].id;
    let time = data.dt;
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let humidity = data.main.humidity;
    let pressure = data.main.pressure;
    let wind = data.wind.speed;


    // 🌫️ WAQI API (REAL AQI)
    let aqiUrl = `https://api.waqi.info/feed/${city}/?token=${aqiToken}`;
    let aqiRes = await fetch(aqiUrl);
    let aqiData = await aqiRes.json();

    console.log(aqiData);

    let aqi_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}`;
    let aqi_res = await fetch(aqi_url);
    let aqi_data = await aqi_res.json();

    console.log(aqi_data);
    console.log(aqi_data.list[0].components.pm2_5)

    // extract AQI
    let actualAQI = aqiData.data.aqi;
    let dominantPollutant = aqiData.data.dominentpol;
    let pm25_count = aqi_data.list[0].components.pm2_5;
    let pm10_count = aqi_data.list[0].components.pm10;
    let co_count = aqi_data.list[0].components.co;
    let so2_count = aqi_data.list[0].components.so2;
    let no2_count = aqi_data.list[0].components.no2;
    let o3_count = aqi_data.list[0].components.o3;


    // update UI
    main_aqi.textContent = actualAQI;
    aqi_desc.textContent = `${getAQIDescFromNumber(actualAQI)}`;
    humidity_val.textContent = `${humidity}%`;
    pressure_val.textContent = pressure;
    wind_val.textContent = `${wind} m/s`;

    temperature.textContent = `${getweatherEmoji(emoji_id)} ${(temp - 273.15).toFixed(1)}°C`;
    desc.textContent = desc_val;

    pm25.textContent = pm25_count.toFixed(1);
    pm10.textContent = pm10_count.toFixed(1);
    co.textContent = co_count.toFixed(1);
    so2.textContent = so2_count.toFixed(1);
    no2.textContent = no2_count.toFixed(1);
    o3.textContent = o3_count.toFixed(1);

    // remove old temp_day if it exists
    let existingDay = temp_card.querySelector(".temp_day");
    if (existingDay) {
        existingDay.remove();
    }

    // create new one
    const p = document.createElement("p");
    p.classList.add("temp_day");
    p.textContent = getDay(time);

    // append once
    temp_card.appendChild(p);

    setCardBackground(actualAQI);

}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    const daily = {};

    data.list.forEach(item => {

        const date = item.dt_txt.split(" ")[0];
        const temp = item.main.temp;
        const e_id = item.weather[0].id;

        if (!daily[date]) {
            daily[date] = {
                min: temp,
                max: temp,
                icon: e_id
            };
        } else {
            daily[date].min = Math.min(daily[date].min, temp);
            daily[date].max = Math.max(daily[date].max, temp);
        }
    });

    displayForecast(daily);
}

// initial load
getWeather(cityName.textContent);
getForecast(cityName.textContent);

// search
locSearch.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let search_val = locSearch.value.trim();

        if (search_val !== "") {
            getWeather(search_val);
            getForecast(search_val);
            locSearch.value = "";
        }
    }
});

function displayForecast(daily) {
    console.log(daily);

    const container = document.querySelector(".temp_details_row2");

    // clear old cards (IMPORTANT)
    container.innerHTML = "";

    let count = 0;
    
    const sortedDates = Object.keys(daily).sort();

    for (let date of sortedDates) {

        if (count >= 7) break; // limit to 7 days

        const dayName = new Date(date).toLocaleDateString("en-US", {
            weekday: "short"
        });

        const max = Math.round(daily[date].max);
        const min = Math.round(daily[date].min);

        console.log(min,max)

        // create card
        const card = document.createElement("div");
        card.classList.add("row2_cards");

        card.innerHTML = `
            <p class="card_title">${dayName}</p>
            <div class="card_desc">
                <p class="card_emoji">${getweatherEmoji(daily[date].icon)}</p>
                <div class="max_min">
                    <span class="max">${max}°</span>
                    <span class="min">${min}°</span>
                </div>
            </div>
        `;

        container.appendChild(card);
        count++;
    }
}


// emoji
function getweatherEmoji(weatherid) {
    switch (true) {
        case (weatherid >= 200 && weatherid < 300): return "⛈️";
        case (weatherid >= 300 && weatherid < 400): return "🌦️";
        case (weatherid >= 500 && weatherid < 600): return "☔️";
        case (weatherid >= 600 && weatherid < 700): return "❄️";
        case (weatherid >= 700 && weatherid < 800): return "🌁";
        case (weatherid === 800): return "☀️";
        case (weatherid > 800 && weatherid < 900): return "☁️";
        default: return "❓";
    }
}

// 🎨 AQI COLORS (same)
function setCardBackground(aqi) {
    switch (true) {
        case (aqi <= 50): main_aqi.style.backgroundColor = "#00e400"; break;
        case (aqi <= 100): main_aqi.style.backgroundColor = "#ffff00"; break;
        case (aqi <= 200): main_aqi.style.backgroundColor = "#ffaa55"; break;
        case (aqi <= 300): main_aqi.style.backgroundColor = "#ff0000"; break;
        case (aqi <= 400): main_aqi.style.backgroundColor = "#8f3f97"; break;
        default: main_aqi.style.backgroundColor = "#7e0023";
    }
}

// AQI description
function getAQIDescFromNumber(aqi) {
    if (aqi <= 50) return "Good 🟢";
    if (aqi <= 100) return "Satisfactory 🟡";
    if (aqi <= 200) return "Moderate 🟠";
    if (aqi <= 300) return "Poor 🔴";
    if (aqi <= 400) return "Very Poor 🟣";
    return "Severe ⚫";
}

function getDay(timestamp) {
    const date = new Date(timestamp * 1000);

    const day_string = date.toLocaleDateString("en-US", {
        weekday: "long"
    });

    const month = date.toLocaleDateString("en-US", {
        month: "long"
    });

    const day = date.getDate();

    return `${day_string}, ${month} ${day}`;
}
