const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const todayDate = document.querySelector(".date");
const city = document.querySelector(".city");
const date = document.querySelector(".date");
const currentTemperature = document.querySelector(".current-temperature");

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
  console.log(locationData.results[0].name);
  console.log(lat);
  console.log(long);

  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min`;
  const weatherResponse = await fetch(weatherApi);
  const weatherData = await weatherResponse.json();
  console.log(weatherData);
  console.log(weatherData.current.temperature_2m);

  //update DOM values
  city.textContent = `${locationData.results[0].name}`;
  currentTemperature.textContent = `${Math.floor(weatherData.current.temperature_2m)}°C`;
  date.textContent = `${weatherData.current.time}`;
  //to be continued



});

