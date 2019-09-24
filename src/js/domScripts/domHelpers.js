import {
  format,
} from 'date-fns';
import fetchData from '../fetchData';
import elements from './elements';

const showData = (dataArr, row, cityName, tempStatusProperty) => {
  // Display City Name
  [cityName.innerText] = [dataArr[0]];
  // Capture weatherData from promise for use in tempDisplay radio buttons callback
  elements.fetchedWeatherSet(dataArr[1]);
  const cardElements = elements;
  // Remove invisible classes
  row.classList.remove("invisible");
  // Add animate class for fade-in effect
  row.classList.add("animate");
  // Weather data for the day and the next 4 days are placed in their own individual cards
  dataArr[1].forEach((data, index) => {
    weatherCard(data, index, cardElements, tempStatusProperty);
  });
};

// Function to place a day's weather data into a card display
const weatherCard = (data, index, cardElements, tempStatusProperty) => {
  // Extracting only the data needed from the fetched JSON data
  const {
    weather_state_abbr,
    the_temp,
    min_temp,
    max_temp,
    humidity,
    applicable_date,
  } = data;
  // Format the date using the custom parseDate function
  cardElements.foreCastDates[index].innerText = parseDate(applicable_date, index);
  // Show image for weather status based on weather_state_abbr in data
  cardElements.weatherStateImgs[index].setAttribute(
    "src",
    `https://www.metaweather.com/static/img/weather/png/${weather_state_abbr}.png`
  );
  // Display temperatures based on whether Celsius or Fahrenheit is used as unit
  tempDisplays({
      the_temp,
      min_temp,
      max_temp,
    },
    cardElements,
    index,
    cardElements[tempStatusProperty]);
  // Humidity display 
  cardElements.humidityDisplays[index].innerText = `${Math.round(humidity)}%`;
};

// Function to display temperature depending on unit selected
const tempDisplays = (tempObj, cardElements, index, isCelsius) => {
  // Relevant data
  const {
    the_temp,
    min_temp,
    max_temp,
  } = tempObj;
  const suffix = isCelsius ? "&#176;C" : "&#176;F";
  // Individual DOM elements relevant to the temperature display:
  const tempElements = [cardElements.theTemps, cardElements.maxTemps, cardElements.minTemps];
  const tempData = [the_temp, max_temp, min_temp];
  // Iterate through each to set their respective innerHTML's based on their index and the index of the data
  tempElements.forEach((el, i) => {
    el[index].innerHTML = Math.round(tempToF(tempData[i], elements.tempUnitC)) + suffix;
  });
};

// Function to convert into Fahrenheit if tempUnit being used is Fahrenheit
const tempToF = (temp, isCelsius) => {
  return !isCelsius ? (9 / 5) * temp + 32 : temp;
};

// Function to format date using date-fns package
const parseDate = (date, index) => {
  const weatherDate = index === 0 ? format(new Date(date), "dddd MMMM DD, YYYY") : format(new Date(date), "dddd");
  return weatherDate;
};

// Function that uses fetchData for furnishing data that it will then show
// using the showData function.
// This function is written in ES5 format in order to use the args/arguments keyword
function fetchAndShowData(...args) {
  fetchData(...args).then((data) => {
      const [row, cityName, loadDiv, tempStatusProperty] = [
        [...args][5],
        [...args][6],
        [...args][8],
        [...args][9],
      ];
      // Remove fetch data... message
      loadDiv.classList.add("d-none");
      // Fill relevant dom elements with data
      showData([data.title, data.consolidated_weather.slice(0, 5)], row, cityName, tempStatusProperty);
    })
    .catch(() => {
      // If fetching the data didn't go well we need to show an error message
      const [row, erDiv, loadDiv] = [
        [...args][5],
        [...args][7],
        [...args][8],
      ];
      displayErrorMsg(row, erDiv, loadDiv);
    });
}
// Function for displaying error message
const displayErrorMsg = (row, erDiv, loadDiv) => {
  // Hide the data row if present -> it contains previous
  // valid city's data
  row.classList.add('invisible');
  // Hide loading div
  loadDiv.classList.add('d-none');
  erDiv.classList.remove('d-none');
};

const submitCallback = (argsArr) => {
  const [
    row,
    cityDisplay,
    input,
    locUrl,
    weatherUrl,
    locProp,
    proxyUrl,
    errDiv,
    loadDiv,
    tempStatusProperty,
  ] = argsArr;
  // Make row invisible again
  row.classList.add("invisible");
  // Remove animate class animate if any
  row.classList.remove("animate");
  // If there are any error messages visible just add class d-none to it
  errDiv.setAttribute("class", 'd-none');
  // Run fetch and show data function
  fetchAndShowData(
    locUrl,
    weatherUrl,
    input.value,
    locProp,
    proxyUrl,
    row,
    cityDisplay,
    errDiv,
    loadDiv,
    tempStatusProperty,
  );
};

export {
  submitCallback,
  tempDisplays,
};