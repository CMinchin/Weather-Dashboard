async function reqLocation(query) {
    res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=9d8df2fdb37d81bc3ff5b3c45ce56a02`);
    data = await res.json();
    
    // console.log("Location request: ", data);
    return data;
}

async function reqWeather(lat, lon) {
    res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9d8df2fdb37d81bc3ff5b3c45ce56a02`);
    data = await res.json();

    // console.log("Weather request: ", data);
    return data;
}

function currentWeather(weather) {
    document.getElementById("title").innerText = weather.name;
    document.getElementById("temp").innerText = Math.round((weather.main.temp-273.15)*100)/100 + "°";
    document.getElementById("wind").innerText = weather.wind.speed + " m/s";
    document.getElementById("humidity").innerText = weather.main.humidity+"%";
}

async function fiveDayForcast(lat, lon) {
    res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=9d8df2fdb37d81bc3ff5b3c45ce56a02`);
    data = await res.json();

    console.log(data);

    document.getElementById("fiveDay").innerHTML = "";

    for (let x = 7; x < 40; x += 8) {
        createDayForcast(data.list[x]);
    }
}

function createDayForcast(weather) {
    day = document.createElement("div")
    day.classList.add("fiveDay");
    day.innerHTML = `
    <h3>
        ${weather.dt_txt.split(" ")[0]}
    </h3>
    <h3>
        ${weather.weather[0].description}
    </h3>
    <h3>
        Temp: ${Math.round((weather.main.temp-273.15)*100)/100 + "°"}
    </h3>
    <h3>
        Wind: ${weather.wind.speed + " m/s"}
    </h3>
    <h3>
        Humidity: ${weather.main.humidity+"%"}
    </h3>
    `
    document.getElementById("fiveDay").appendChild(day);
}

document.getElementById("searchButton").addEventListener("click", async(...e) => {
    // console.log(e);
    let locations = await reqLocation(document.getElementById("searchInput").value);
    renderFromCoords(locations[0].lat, locations[0].lon);
});

async function renderFromCoords(lat, lon) {
    // console.log(lat, lon);
    let weather = await reqWeather(lat, lon);
    // console.log(weather);
    currentWeather(weather);
    fiveDayForcast(lat, lon);
}

function showPosition(position) {
    // console.log(position.coords);
    renderFromCoords(position.coords.latitude, position.coords.longitude);
}

navigator.geolocation.getCurrentPosition(showPosition);