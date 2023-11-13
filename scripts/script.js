const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const todayDate = document.querySelector(".date");
let lat;
let long;

//Today's Date
const today = new Date();
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
const formattedDate = today.toLocaleDateString("en-GB", options);
todayDate.textContent = formattedDate;
console.log(formattedDate);

//API's
const locationApi = `https://geocoding-api.open-meteo.com/v1/search?name=${searchInput.value}&count=1&language=en&format=json`;



searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  fetch(locationApi)
    .then(response => {
      return response.json();
    })
    .then(data => {
      lat = data.results[0].latitude;
      long = data.results[0].longitude;
      console.log(data);
      console.log(data.results[0].name);
      console.log(lat);
      console.log(long);
    });
});
