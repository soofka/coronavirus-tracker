import * as utils from '../../utils';
import * as events from '../../events';
import { fetchGlobalData, validateGlobalData } from '../../services/data';
import { addLabelsToComponent } from '../commons/component-with-labels';
import { addDataToComponent, states } from '../commons/component-with-data';

export const globalSection = () => {
  const elements = {
    header: utils.getElement('.global--header-label'),
    data: {
      container: utils.getElement('.global--data'),
      confirmed: {
        label: utils.getElement('.global--confirmed-label'),
        value: utils.getElement('.global--confirmed-value'),
      },
      deaths: {
        label: utils.getElement('.global--deaths-label'),
        value: utils.getElement('.global--deaths-value'),
      },
      recovered: {
        label: utils.getElement('.global--recovered-label'),
        value: utils.getElement('.global--recovered-value'),
      },
    },
    loading: utils.getElement('.global--loading'),
    error: {
      container: utils.getElement('.global--error'),
      header: utils.getElement('.global--error-header-label'),
      message: utils.getElement('.global--error-message-label'),
    },
  };

  addLabelsToComponent(
    ({ sections: { global: { header, confirmed, deaths, recovered, error }}}) => {
      utils.setElementText(elements.header, header || 'Current situation globally');
      utils.setElementText(elements.data.confirmed.label, confirmed || 'confirmed');
      utils.setElementText(elements.data.deaths.label, deaths || 'deaths');
      utils.setElementText(elements.data.recovered.label, recovered || 'recovered');
      utils.setElementText(elements.error.header, error || 'No data');
    },
  );

  addDataToComponent({
    FETCH: events.FETCH_GLOBAL_DATA,
    FETCH_SUCCESS: events.FETCH_GLOBAL_DATA_SUCCESS,
    FETCH_FAILURE: events.FETCH_GLOBAL_DATA_FAILURE,
    FETCH_FINISHED: events.FETCH_GLOBAL_DATA_FINISHED,
    FETCH_FROM_CACHE_SUCCESS: events.FETCH_GLOBAL_DATA_FROM_CACHE_SUCCESS,
    FETCH_FROM_CACHE_FAILURE: events.FETCH_GLOBAL_DATA_FROM_CACHE_FAILURE,
    FETCH_FROM_CACHE_FINISHED: events.FETCH_GLOBAL_DATA_FROM_CACHE_FINISHED,
    FETCH_FROM_INTERNET_SUCCESS: events.FETCH_GLOBAL_DATA_FROM_INTERNET_SUCCESS,
    FETCH_FROM_INTERNET_FAILURE: events.FETCH_GLOBAL_DATA_FROM_INTERNET_FAILURE,
    FETCH_FROM_INTERNET_FINISHED: events.FETCH_GLOBAL_DATA_FROM_INTERNET_FINISHED,
  }, (state, data) => {
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

        if (validateGlobalData(data)) {
          renderData(data);
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

        if (validateGlobalData(data)) {
          renderData(data);
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

  const renderData = ({ confirmed, deaths, recovered }) => {
    utils.setElementText(elements.data.confirmed.value, isNaN(confirmed) ? '?' : confirmed);
    utils.setElementText(elements.data.deaths.value, isNaN(deaths) ? '?' : deaths);
    utils.setElementText(elements.data.recovered.value, isNaN(recovered) ? '?' : recovered);
  };

  const renderError = ({ message }) => utils.setElementText(elements.error.message, message || 'Error');

  fetchGlobalData();
};
