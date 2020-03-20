import * as utils from '../../utils';
import * as events from '../../events';
import { fetchPerCountryData, validatePerCountryData } from '../../services/data';
import { addLabelsToComponent } from '../commons/component-with-labels';
import { addDataToComponent, states } from '../commons/component-with-data';
import { addMemoryToSelect } from '../commons/select-with-memory';

const COUNTRY_STORAGE_KEY = 'COUNTRY';
const COUNTRY_QUERY_STRING_KEY = 'country';

export const perCountrySection = () => {
  let data = undefined;
  let country = undefined;
  
  const elements = {
    header: utils.getElement('.per_country--header-label'),
    countrySelect: {
      container: utils.getElement('.per_country--country-select'),
      label: utils.getElement('.per_country--country-select option[value="0"]'),
    },
    data: {
      container: utils.getElement('.per_country--data'),
      confirmed: {
        label: utils.getElement('.per_country--confirmed-label'),
        value: utils.getElement('.per_country--confirmed-value'),
      },
      deaths: {
        label: utils.getElement('.per_country--deaths-label'),
        value: utils.getElement('.per_country--deaths-value'),
      },
      recovered: {
        label: utils.getElement('.per_country--recovered-label'),
        value: utils.getElement('.per_country--recovered-value'),
      },
    },
    loading: utils.getElement('.per_country--loading'),
    error: {
      container: utils.getElement('.per_country--error'),
      header: utils.getElement('.per_country--error-header-label'),
      message: utils.getElement('.per_country--error-message-label'),
    },
  };

  addLabelsToComponent(
    ({ sections: { perCountry: { header, selectCountry, confirmed, deaths, recovered, error }}}) => {
      utils.setElementText(elements.header, header || 'Current situation in');
      utils.setElementText(elements.countrySelect.label, selectCountry || 'Select country');

      utils.setElementText(elements.data.confirmed.label, confirmed || 'confirmed');
      utils.setElementText(elements.data.deaths.label, deaths || 'deaths');
      utils.setElementText(elements.data.recovered.label, recovered || 'recovered');

      utils.setElementText(elements.error.header, error || 'Error');
    },
  );

  addDataToComponent({
    FETCH: events.FETCH_PER_COUNTRY_DATA,
    FETCH_SUCCESS: events.FETCH_PER_COUNTRY_DATA_SUCCESS,
    FETCH_FAILURE: events.FETCH_PER_COUNTRY_DATA_FAILURE,
    FETCH_FINISHED: events.FETCH_PER_COUNTRY_DATA_FINISHED,
    FETCH_FROM_CACHE_SUCCESS: events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_SUCCESS,
    FETCH_FROM_CACHE_FAILURE: events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_FAILURE,
    FETCH_FROM_CACHE_FINISHED: events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_FINISHED,
    FETCH_FROM_INTERNET_SUCCESS: events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_SUCCESS,
    FETCH_FROM_INTERNET_FAILURE: events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_FAILURE,
    FETCH_FROM_INTERNET_FINISHED: events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_FINISHED,
  }, (state, tempData) => {
    switch(state) {
      case states.IDLE:
      default:
        hideData();
        hideError();
        hideLoading();
        break;

      case states.FETCHING:
        hideData()
        hideError();
        showLoading();
        break;

      case states.DATA:
        hideError();
        hideLoading();

        if (validatePerCountryData(tempData)) {
          data = tempData;
          renderSelect();
        }

        showData();
        break;

      case states.ERROR:
        hideData();
        hideLoading();

        if (utils.validateError(data)) {
          renderError(data);
        }

        showError();
        break;

      case states.FETCHING_DATA:
        hideError();
        showLoading();

        if (validatePerCountryData(tempData)) {
          data = tempData;
          renderSelect();
        }
        
        showData();
        break;

      case states.FETCHING_ERROR:
        hideError();
        showLoading();
        showData();
        break;
    }
  });

  const showData = () => utils.show(elements.data.container);
  const hideData = () => utils.hide(elements.data.container);

  const showError = () => utils.show(elements.error.container);
  const hideError = () => utils.hide(elements.error.container);

  const showLoading = () => utils.show(elements.loading);
  const hideLoading = () => utils.hide(elements.loading);

  const renderSelect = () => {
    utils.clearElement(elements.countrySelect.container);
    utils.append(elements.countrySelect.container, elements.countrySelect.label);

    Object.keys(data).sort(
      (a, b) => data[a].country.name > data[b].country.name ? 1 : -1,
    ).forEach((key) => utils.append(
      elements.countrySelect.container,
      utils.createOption(data[key].country.name, data[key].country.code),
    ));

    select.reset();
  };

  const renderData = () => {
    if (!hasPerCountryData(country)) {
      return;
    }

    const { data: { confirmed, deaths, recovered }} = data[country];

    utils.setElementText(elements.data.confirmed.value, isNaN(confirmed) ? '?' : confirmed);
    utils.setElementText(elements.data.deaths.value, isNaN(deaths) ? '?' : deaths);
    utils.setElementText(elements.data.recovered.value, isNaN(recovered) ? '?' : recovered);
  };

  const renderError = (error) => utils.setElementText(elements.error.message, error || 'Error');
  const validateCountry = (tempCountry) => utils.isNonEmptyString(tempCountry);
  const hasPerCountryData = (tempCountry) => validatePerCountryData(data) && validateCountry(country) && utils.isNonEmptyObject(data[tempCountry]);

  const select = addMemoryToSelect(
    elements.countrySelect.container,
    0,
    COUNTRY_QUERY_STRING_KEY,
    COUNTRY_STORAGE_KEY,
    validateCountry,
    (tempCountry) => {
      country = tempCountry;
      renderData();
      hasPerCountryData(country) && utils.publish(
        events.SET_COUNTRY,
        data[country].country,
      );
    },
  );

  fetchPerCountryData();
};

// country select value = 0
// if undefined dont save
// sort countries