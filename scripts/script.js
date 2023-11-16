import { weatherIcons } from "../scripts/weatherIcons.js";

const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const uvIndex = document.querySelector(".uv-index-value");
const currentTemperature = document.querySelector(".current-temperature");
const day = document.querySelector(".day");
const night = document.querySelector(".night");
const flag = document.getElementById("flag");
const currentIcon = document.querySelector(".icon");
const futureTemperature = document.querySelectorAll(".future-temperature");
const futureIcon = document.querySelectorAll(".future-icon");
const futureDate = document.querySelectorAll(".future-date");
const hourlyWeather = document.querySelector(".hourly-weather");
const main = document.querySelector("main");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

let lat;
let long;

const randomNumber = () => {
  const number = Math.floor(Math.random() * 6);
  return number;
};

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  main.style.display = "flex";
  //api's
  const locationApi = `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput.value}&count=1&language=en&format=json`;

  const locationResponse = await fetch(locationApi);
  const locationData = await locationResponse.json();
  lat = locationData.results[0].latitude;
  long = locationData.results[0].longitude;
  console.log(locationData);

  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,weather_code,cloud_cover,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m&daily=weather_code,uv_index_max,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max`;
  const weatherResponse = await fetch(weatherApi);
  const weatherData = await weatherResponse.json();
  console.log(weatherData);

  //update DOM values
  city.textContent = `${locationData.results[0].name}`; //city name
  country.textContent = `${locationData.results[0].country}`; //country name
  currentTemperature.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
  flag.src = `https://flagsapi.com/${locationData.results[0].country_code}/flat/32.png`;
  flag.alt = `Flag of ${locationData.results[0].country}`;
  day.textContent = `↑${Math.round(weatherData.daily.temperature_2m_max[0])}°`;
  night.textContent = `↓${Math.round(weatherData.daily.temperature_2m_min[0])}°`;
  for (let i = 0; i < futureTemperature.length; i++) {
    futureTemperature[i].textContent = `${Math.round(weatherData.daily.temperature_2m_max[i + 1])}°`;
  }
  //UV index
  const currentUvIndex = weatherData.daily.uv_index_max[0];
  uvIndex.textContent = `${currentUvIndex}`;

  //weather icons
  const weatherCode = weatherIcons[weatherData.daily.weather_code[0]];
  if (weatherData.current.is_day) {
    currentIcon.src = weatherCode.day.image;
    currentIcon.alt = `Icon showing ${weatherCode.day.description}`;
  } else {
    currentIcon.src = weatherCode.night.image;
    currentIcon.alt = `Icon showing ${weatherCode.night.description}`;
  }
  //future icons
  for (let i = 0; i < futureIcon.length; i++) {
    const futureCode = weatherIcons[weatherData.daily.weather_code[i + 1]];
    futureIcon[i].src = futureCode.day.image;
    futureIcon[i].alt = `Icon showing ${futureCode.day.description}`;
  }
  //future dates
  for (let i = 0; i < 5; i++) {
    const dates = weatherData.daily.time[i + 1].split("-");
    futureDate[i].textContent = `${dates[2]}. ${months[dates[1] - 1]}`;
  }

  //background image
  const unsplashApi = `https://api.unsplash.com/search/photos?query=${locationData.results[0].name}&client_id=0T1MflLrIfd3obk298msTbyAhxUWI1u09oJNjB_sD14`;
  const unsplashResponse = await fetch(unsplashApi);
  const unsplashData = await unsplashResponse.json();
  const randomImage = unsplashData.results[randomNumber()].urls.raw;
  console.log(unsplashData);
  main.style.backgroundImage = `url(${randomImage}&w=1000&dpr=2)`;

  //hourly weather
  hourlyWeather.innerHTML = "";

  for (let i = 0; i < 24; i++) {
    let hourlyDiv = document.createElement("div");
    hourlyDiv.classList.add("hourly");
    hourlyWeather.append(hourlyDiv);

    let hour = document.createElement("p");
    let hourlyTime = weatherData.hourly.time[i].split("T");
    hour.textContent = `${hourlyTime[1]}`;
    hour.classList.add("hour");
    hourlyDiv.prepend(hour);

    let icon = document.createElement("img");
    icon.classList.add("hourly-icon");
    let justHour = hourlyTime[1].split(":");
    let hourlyCode = weatherIcons[weatherData.hourly.weather_code[i]];
    if (parseInt(justHour[0]) > 19 || justHour[0] < 7) {
      icon.src = `${hourlyCode.night.image}`;
      icon.alt = `Icon showing ${hourlyCode.night.description}`;
    } else {
      icon.src = `${hourlyCode.day.image}`;
      icon.alt = `Icon showing ${hourlyCode.day.description}`;
    }
    hourlyDiv.append(icon);

    let hourlyTemp = document.createElement("p");
    hourlyTemp.classList.add("hour-temp");
    hourlyDiv.append(hourlyTemp);
    hourlyTemp.textContent = `${Math.round(weatherData.hourly.temperature_2m[i])}°`;

  }
});

//TODO: description of imgs
