let weatherApi = 'http://api.weatherapi.com/v1/current.json?key=7bdd9b1cfe2440dcb04172233220210&aqi=no&q=';
let name = document.querySelector('h1.name');
let temp = document.querySelector('h1.temp');
let time = document.querySelector('span.time');
let date = document.querySelector('.date');
let condition = document.querySelector('.condition');
let icon = document.querySelector('.icon');
let cloud = document.querySelector('.cloud');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind');
let button = document.querySelector('button[type=submit]');
let search = document.querySelector('.search');
let btn = document.querySelector('.submit');
let app = document.querySelector('.weather-app');
let panel = document.querySelector('.panel');
let cityInput = 'London';

document.addEventListener('click', (e)=>{
    if(!e.target.classList.contains("city")) return;
    cityInput = e.target.innerHTML;
    GetRequest(weatherApi + cityInput, requestCallback);
});

button.addEventListener('click', (e) =>{
    if(search.value.length == 0) {
        alert("Please type in a city name")
    }else {
        cityInput = search.value;
        GetRequest(weatherApi + cityInput, requestCallback);
        search.value = "";
    }

});

function GetRequest(url, callback=()=>{}){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4) callback(xmlHttp.responseText, xmlHttp.status);
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function requestCallback(data, status){
    if(status != 200){
        console.error(data, status);
        return;
    }
    data = JSON.parse(data);
    updatePanelPlace(data);
    let d = updatePanelDate(data);
    updatePanelIcon(data);
    updateBackground(data.current.condition.code, (d.getHours() >= 5 && d.getHours() < 19));
    updateSubPanel(data);
}

function dayOfTheWeek(day) {
  let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[day];
}

function updatePanelPlace(data){
    name.innerHTML = data.location.name;
    temp.innerHTML = Math.round(data.current.temp_c) + "°";
}

function updatePanelDate(data){
    let d = new Date(data.location.localtime);
    time.innerHTML = ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2);
    date.innerHTML = dayOfTheWeek(d.getDay()) + " " + d.toLocaleString('en-US', { month: 'short' }) + " " + ('0'+d.getDate()).slice(-2);
    return d;
}

function updatePanelIcon(data){
    icon.src = "https:" + data.current.condition.icon;
    condition.innerHTML = data.current.condition.text;
}

function updateSubPanel(data){
    cloud.innerHTML = data.current.cloud + "%";
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
}

function updateBackground(code, day){
    let rain = [1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252];
    let cloudy = [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282];
    let imgName = "clear";

    if(rain.indexOf(code) >= 0) imgName = "rain";
    else if(cloudy.indexOf(code) >= 0) imgName = "cloud";

    app.style.backgroundImage = (day) ? imgName = 'clear' : imgName = 'night';
    app.style.backgroundImage = `url(./img/${imgName}.jpg)`;
}
