import {
  submitCallback,
  tempDisplays,
} from './domHelpers';
import elements from './elements';

const addEventListeners = () => {
  // Event listener for weather data search form
  elements.weatherSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Show fetching weather data text
    elements.loadingDiv.classList.remove("d-none");
    // Parameters passed to callback packaged into an array
    const submitCallbackParams = [
      elements.mainDataRow,
      elements.cityNameDisplay,
      elements.cityNameInput,
      elements.locationSearchUrl,
      elements.weatherSearchUrl,
      "woeid",
      elements.corsProxyUrl,
      elements.errorDiv,
      elements.loadingDiv,
      "tempUnitC",
    ];
    // Call submit callback
    submitCallback(submitCallbackParams);
    // Reset form
    e.target.reset();
  });

  // Event listener for temperature unit radio buttons
  elements.tempRadioBtns.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      e.stopPropagation();
      elements.tempToggle();
      elements.fetchedWeatherSet().forEach((data, index) => tempDisplays(data, elements, index, elements.tempUnitC));
    });
  });
};

export default addEventListeners;