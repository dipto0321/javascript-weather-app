import {
  format,
} from 'date-fns';
import fetchData from './fetchCityData'


// NECESSARY DOM ELEMENTS
const loadingDiv = document.getElementById("loading");

const mainDataRow = document.getElementsByClassName("row")[0];

const tempRadioBtns = [...document.getElementsByName("temp")];

const foreCastDates = [...document.getElementsByClassName("forecast-date")];

const weatherStateImgs = [...document.getElementsByClassName("weather-state")];

const theTemps = [...document.getElementsByClassName("the-temp")];

const minTemps = [...document.getElementsByClassName("min-temp")];

const maxTemps = [...document.getElementsByClassName("max-temp")];

const humidityDisplays = [...document.getElementsByClassName("humidity")];

const displayElements = {
  tempRadioBtns,
  foreCastDates,
  weatherStateImgs,
  theTemps,
  minTemps,
  maxTemps,
  humidityDisplays,
};

let tempUnitC = true;
let fetchedWeatherData;
const toggleTempUnit = () => {
  tempUnitC = !tempUnitC;
};

tempRadioBtns.forEach(radio => {
  radio.addEventListener("change", e => {
    e.stopPropagation();
    toggleTempUnit();
    fetchedWeatherData.forEach((data, index) =>
      tempDisplays(data, displayElements, index)
    );
  });
});

const showData = (dataArr) => {
  // Generate dynamic HTML for big card
  // Assign dataObj elements in DOM
  fetchedWeatherData = dataArr[1];
  document.getElementById("cityName").innerText = dataArr[0];
  const cardElements = displayElements;

  // Remove invisible and animate classes
  if ([...mainDataRow.classList.includes("invisible")]) {
    mainDataRow.classList.remove("invisible");
  }
  mainDataRow.classList.add("animate");
  dataArr[1].forEach((data, index) => {
    weatherCard(data, index, cardElements);
  });
};

// We need a function that generates the html structure for the data

// 1. For the big card
const weatherCard = (data, index, cardElements) => {
  // We need to extract elements from data that we need
  const {
    weather_state_abbr,
    the_temp,
    min_temp,
    max_temp,
    humidity,
    applicable_date,
  } = data;

  cardElements.foreCastDates[index].innerText = parseDate(applicable_date, index);
  cardElements.weatherStateImgs[index].setAttribute(
    "src",
    `https://www.metaweather.com/static/img/weather/png/${weather_state_abbr}.png`
  );

  // Temperature displays

  tempDisplays({
      the_temp,
      min_temp,
      max_temp
    },
    cardElements,
    index
  );

  cardElements.humidityDisplays[index].innerText = Math.round(humidity);
};

const tempDisplays = (tempObj, cardElements, index) => {
  const {
    the_temp,
    min_temp,
    max_temp
  } = tempObj;
  const suffix = tempUnitC ? "&#176;C" : "&#176;F";

  const tempElements = [cardElements.theTemps, cardElements.maxTemps, cardElements.minTemps];
  const tempData = [the_temp, max_temp, min_temp];
  tempElements.forEach((el, i) => {
    el[index].innerHTML = Math.round(tempToF(tempData[i], tempUnitC)) + suffix;
  });
};

const tempToF = (temp, tempUnitC) => {
  return !tempUnitC ? (9 / 5) * temp + 32 : temp;
};

const parseDate = (date, index) => {
  const weatherDate = index === 0 ? format(new Date(date), "dddd MMMM DD, YYYY") : format(new Date(date), "dddd");
  return weatherDate;
};

const loading = () => {
  if ([...loadingDiv.classList].includes("hidden")) {
    loadingDiv.classList.remove("hidden");
  } else {
    loadingDiv.classList.add("hidden");
  }
};

function fetchCityData(locationSearchUrl, weatherFetchUrl, city, property, proxyUrl) {
  // Fetch city
  fetchData(city, locationSearchUrl, weatherFetchUrl, property, proxyUrl).then(data => {
    // Remove fetch data... message
    loading();
    // Fill relevant dom elements with data
    showData([data.title, data.consolidated_weather.slice(0, 5)]);
  });
};

const displayErrorMsg = () => {
  document.getElementsByClassName('row')[0].classList.add('invisible');
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('error').classList.remove('d-none');
};

export {
  loading,
  tempDisplays,
  fetchCityData,
};