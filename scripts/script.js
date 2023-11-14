const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const todayDate = document.querySelector(".date");
const city = document.querySelector(".city");
const country = document.querySelector(".country");
const currentTemperature = document.querySelector(".current-temperature");
const flag = document.getElementById("flag");


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


  const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min`;
  const weatherResponse = await fetch(weatherApi);
  const weatherData = await weatherResponse.json();


  //update DOM values
  city.textContent = `${locationData.results[0].name}`; //city name
  country.textContent = `${locationData.results[0].country}`; //country name
  currentTemperature.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
  flag.src = `https://flagsapi.com/${locationData.results[0].country_code}/flat/32.png`;
  console.log(flag);

});

