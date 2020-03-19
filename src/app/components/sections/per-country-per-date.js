import * as utils from '../../utils';
import * as events from '../../events';
import { fetchPerCountryPerDateData, validatePerCountryPerDateData } from '../../services/data';
import { addLabelsToComponent } from '../commons/component-with-labels';
import { addDataToComponent, states } from '../commons/component-with-data';
import { addMemoryToSelect } from '../commons/select-with-memory';

export const perCountryPerDateSection = () => {
  let data = undefined;
  let dateString = undefined;

  const elements = {
    container: utils.getElement('.per_country_per_date'),
    header: utils.getElement('.per_country_per_date--header-label'),
    dateSelect: utils.getElement('.per_country_per_date--date-select'),
    country: utils.getElement('.per_country_per_date--country-label'),
    data: {
      container: utils.getElement('.per_country_per_date--data'),
      confirmed: {
        label: utils.getElement('.per_country_per_date--confirmed-label'),
        value: utils.getElement('.per_country_per_date--confirmed-value'),
      },
      deaths: {
        label: utils.getElement('.per_country_per_date--deaths-label'),
        value: utils.getElement('.per_country_per_date--deaths-value'),
      },
      recovered: {
        label: utils.getElement('.per_country_per_date--recovered-label'),
        value: utils.getElement('.per_country_per_date--recovered-value'),
      },
    },
    loading: utils.getElement('.per_country_per_date--loading'),
    error: {
      container: utils.getElement('.per_country_per_date--error'),
      header: utils.getElement('.per_country_per_date--error-header-label'),
      message: utils.getElement('.per_country_per_date--error-message-label'),
    },
  };

  addLabelsToComponent(
    ({ sections: { perCountryPerDay: { header, confirmed, deaths, recovered, error }}}) => {
      utils.setElementText(elements.header, header || 'Situation on');

      utils.setElementText(elements.data.confirmed.label, confirmed || 'confirmed');
      utils.setElementText(elements.data.deaths.label, deaths || 'deaths');
      utils.setElementText(elements.data.recovered.label, recovered || 'recovered');

      utils.setElementText(elements.error.header, error || 'Error');
    },
  );

  addDataToComponent({
    FETCH: events.FETCH_PER_COUNTRY_PER_DATE_DATA,
    FETCH_SUCCESS: events.FETCH_PER_COUNTRY_PER_DATE_DATA_SUCCESS,
    FETCH_FAILURE: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FAILURE,
    FETCH_FINISHED: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FINISHED,
    FETCH_FROM_CACHE_SUCCESS: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_SUCCESS,
    FETCH_FROM_CACHE_FAILURE: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_FAILURE,
    FETCH_FROM_CACHE_FINISHED: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_FINISHED,
    FETCH_FROM_INTERNET_SUCCESS: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_SUCCESS,
    FETCH_FROM_INTERNET_FAILURE: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_FAILURE,
    FETCH_FROM_INTERNET_FINISHED: events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_FINISHED,
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

        if (validatePerCountryPerDateData(tempData)) {
          data = tempData;
          render();
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

        if (validatePerCountryPerDateData(tempData)) {
          data = tempData;
          render();
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

  const showContainer = () => utils.show(elements.container);

  utils.subscribe(events.SET_COUNTRY, (countryData) => {
    dateString = new Date().toISOString();
    console.log('received event', countryData.payload, dateString);

    if (
      countryData.payload && utils.isNonEmptyObject(countryData.payload)
      && countryData.payload.id && !isNaN(countryData.payload.id)
      && countryData.payload.name && utils.isNonEmptyString(countryData.payload.name)
      && countryData.payload.code && utils.isNonEmptyString(countryData.payload.code)
    ) {
      fetchPerCountryPerDateData(countryData.payload.id);
      renderCountry(countryData.payload.name);
      showContainer();
    }
  });

  const render = () => {
    renderSelect();
    renderData();
  };

  const renderCountry = (countryName) => utils.setElementText(elements.country, countryName);

  const renderSelect = () => {
    utils.clearElement(elements.dateSelect);

    const dates = [];
    const { confirmed, deaths, recovered } = data;

    const pushDate = (tempDateString) => !dates.includes(tempDateString) && dates.push(tempDateString);
    Object.keys(confirmed.timeline).forEach(pushDate);
    Object.keys(deaths.timeline).forEach(pushDate);
    Object.keys(recovered.timeline).forEach(pushDate);

    dates.sort().forEach((tempDateString) => utils.append(
      elements.dateSelect,
      utils.createOption(new Date(tempDateString).toLocaleDateString(), tempDateString),
    ));

    select.reset();
  };

  const renderData = () => {
    console.log('gonna render', dateString, data);
    if (!hasPerCountryPerDateData(dateString)) {
      return;
    }

    const { confirmed, deaths, recovered } = {
      confirmed: data.confirmed.timeline[dateString],
      deaths: data.deaths.timeline[dateString],
      recovered: data.recovered.timeline[dateString],
    };

    utils.setElementText(elements.data.confirmed.value, isNaN(confirmed) ? '?' : confirmed);
    utils.setElementText(elements.data.deaths.value, isNaN(deaths) ? '?' : deaths);
    utils.setElementText(elements.data.recovered.value, isNaN(recovered) ? '?' : recovered);
  };

  const renderError = (error) => utils.setElementText(elements.error.message, error || 'Error');
  const validateDateString = (tempDateString) => {
    console.log('validation', tempDateString);
    return utils.isNonEmptyString(tempDateString);
    // if (utils.isNonEmptyString(tempDateString)) {
    //   try {
    //     return new Date(tempDateString).toISOString() === tempDateString;
    //   } catch (error) {
    //     return false;
    //   }
    // }
    // return false;
  };
  const hasPerCountryPerDateData = () => validatePerCountryPerDateData(data) && validateDateString(dateString) &&
    !(isNaN(data.confirmed.timeline[dateString]) && isNaN(data.deaths.timeline[dateString]) && isNaN(data.recovered.timeline[dateString]))

  const select = addMemoryToSelect(
    elements.dateSelect,
    new Date().toISOString(),
    undefined,
    undefined,
    validateDateString,
    (tempDateString) => {
      console.log('clicked', tempDateString);
      dateString = tempDateString;
      renderData();
    },
  );
};
