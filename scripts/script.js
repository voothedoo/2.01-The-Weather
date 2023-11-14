import { weatherIcons } from "../scripts/weatherIcons.js";

const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const currentTemperature = document.querySelector(".current-temperature");
const day = document.querySelector(".day");
const night = document.querySelector(".night");
const flag = document.getElementById("flag");
const currentIcon = document.querySelector(".icon");
const futureTemperature = document.querySelectorAll(".future-temperature");
const futureIcon = document.querySelectorAll(".future-icon");
const futureDate = document.querySelectorAll(".future-date");



const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

let lat;
let long;

//API's

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  //api's
  const locationApi = `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput.value}&count=1&language=en&format=json`;


  const locationResponse = await fetch(locationApi);
  const locationData = await locationResponse.json();
  lat = locationData.results[0].latitude;
  long = locationData.results[0].longitude;
  console.log(locationData);


  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,weather_code,cloud_cover,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max`;
  const weatherResponse = await fetch(weatherApi);
  const weatherData = await weatherResponse.json();
  console.log(weatherData);


  //update DOM values
  city.textContent = `${locationData.results[0].name}`; //city name
  country.textContent = `${locationData.results[0].country}`; //country name
  currentTemperature.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
  flag.src = `https://flagsapi.com/${locationData.results[0].country_code}/flat/32.png`;
  day.textContent = `${Math.round(weatherData.daily.temperature_2m_max[0])}°`;
  night.textContent = `${Math.round(weatherData.daily.temperature_2m_min[0])}°`;
  for (let i = 0; i < futureTemperature.length; i++) {
    futureTemperature[i].textContent = `${Math.round(weatherData.daily.temperature_2m_max[i + 1])}°`;
  }

  //weather icons
  const weatherCode = weatherIcons[weatherData.daily.weather_code[0]];
  if (weatherData.current.is_day) {
    currentIcon.src = weatherCode.day.image;
  } else {
    currentIcon.src = weatherCode.night.image;
  }
  //future icons
  for (let i = 0; i < futureIcon.length; i++) {
    const futureCode = weatherIcons[weatherData.daily.weather_code[i + 1]];
    futureIcon[i].src = futureCode.day.image;
  }
  //future dates
  for (let i = 0; i < 5; i++) {
    const dates = weatherData.daily.time[i + 1].split("-");
    console.log(dates);
    futureDate[i].textContent = `${dates[2]}. ${months[dates[1] - 1]}`;
  }

});

