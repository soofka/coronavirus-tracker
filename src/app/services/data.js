import * as utils from '../utils';
import * as events from '../events';

const API_BASE_URL = 'https://coronavirus-tracker-api.herokuapp.com/v2/';
const GLOBAL_DATA_API_URL = `${API_BASE_URL}latest`;
const PER_COUNTRY_DATA_API_URL = `${API_BASE_URL}locations`;
const PER_COUNTRY_PER_DATE_DATA_API_URL = `${API_BASE_URL}locations/`;

export const fetchGlobalData = () => {
  utils.publish(events.FETCH_GLOBAL_DATA);
  let result = false;

  Promise.all([
    utils.fetchFromCache(GLOBAL_DATA_API_URL)
      .then((data) => {
        if (!validateRawGlobalData(data)) {
          throw `Invalid global data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_GLOBAL_DATA_FROM_CACHE_SUCCESS, { ...data.latest });
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_GLOBAL_DATA_FROM_CACHE_FAILURE, utils.getError(error));
      })
      .finally(() => utils.publish(events.FETCH_GLOBAL_DATA_FROM_CACHE_FINISHED)),

    utils.fetchFromInternet(GLOBAL_DATA_API_URL)
      .then((data) => {
        if (!validateRawGlobalData(data)) {
          throw `Invalid global data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_GLOBAL_DATA_FROM_INTERNET_SUCCESS, { ...data.latest });
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_GLOBAL_DATA_FROM_INTERNET_FAILURE, utils.getError(error))
      })
      .finally(() => utils.publish(events.FETCH_GLOBAL_DATA_FROM_INTERNET_FINISHED)),

  ]).finally(() => {
    utils.publish(result ? events.FETCH_GLOBAL_DATA_SUCCESS : events.FETCH_GLOBAL_DATA_FAILURE);
    utils.publish(events.FETCH_GLOBAL_DATA_FINISHED);
  });
};

const validateRawGlobalData = (data) => utils.isObject(data) && data.latest && data.latest.confirmed && data.latest.deaths && data.latest.recovered;
export const validateGlobalData = (data) => utils.isObject(data) && data.confirmed && data.deaths && data.recovered;

export const fetchPerCountryData = () => {
  utils.publish(events.FETCH_PER_COUNTRY_DATA);
  let result = false;

  Promise.all([
    utils.fetchFromCache(PER_COUNTRY_DATA_API_URL)
      .then((data) => {
        if (!validateRawPerCountryData(data)) {
          throw `Invalid per country data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_SUCCESS, utils.parsePerCountryData(data));
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_FAILURE, utils.getError(error));
      })
      .finally(() => utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_CACHE_FINISHED)),

    utils.fetchFromInternet(PER_COUNTRY_DATA_API_URL)
      .then((data) => {
        if (!validateRawPerCountryData(data)) {
          throw `Invalid per country data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_SUCCESS, utils.parsePerCountryData(data));
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_FAILURE, utils.getError(error))
      })
      .finally(() => utils.publish(events.FETCH_PER_COUNTRY_DATA_FROM_INTERNET_FINISHED)),

  ]).finally(() => {
    utils.publish(result ? events.FETCH_PER_COUNTRY_DATA_SUCCESS : events.FETCH_PER_COUNTRY_DATA_FAILURE);
    utils.publish(events.FETCH_PER_COUNTRY_DATA_FINISHED);
  });
};

const validateRawPerCountryData = (data) => utils.isObject(data) && data.locations && utils.isNonEmptyArray(data.locations);
export const validatePerCountryData = (data) => utils.isNonEmptyObject(data);

export const fetchPerCountryPerDateData = (id) => {
  utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA);

  const url = `${PER_COUNTRY_PER_DATE_DATA_API_URL}${id}`;
  let result = false;
  console.log('gonne fetch', url);

  Promise.all([
    utils.fetchFromCache(url)
      .then((data) => {
        if (!validateRawPerCountryPerDateData(data)) {
          throw `Invalid per country per date data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_SUCCESS, { ...data.location.timelines });
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_FAILURE, utils.getError(error));
      })
      .finally(() => utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_CACHE_FINISHED)),

    utils.fetchFromInternet(url)
      .then((data) => {
        if (!validateRawPerCountryPerDateData(data)) {
          throw `Invalid per country per date data (${JSON.stringify(data)})`;
        }
        
        result = true;
        utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_SUCCESS, { ...data.location.timelines });
      })
      .catch((error) => {
        result = false;
        utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_FAILURE, utils.getError(error))
      })
      .finally(() => utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FROM_INTERNET_FINISHED)),

  ]).finally(() => {
    utils.publish(result ? events.FETCH_PER_COUNTRY_PER_DATE_DATA_SUCCESS : events.FETCH_PER_COUNTRY_PER_DATE_DATA_FAILURE);
    utils.publish(events.FETCH_PER_COUNTRY_PER_DATE_DATA_FINISHED);
  });
};

const validateRawPerCountryPerDateData = (data) => utils.isObject(data)
  && data.location && utils.isNonEmptyObject(data.location)
  && data.location.timelines && utils.isNonEmptyObject(data.location.timelines)
  && data.location.timelines.confirmed && utils.isNonEmptyObject(data.location.timelines.confirmed)
  && data.location.timelines.confirmed.timeline && utils.isNonEmptyObject(data.location.timelines.confirmed.timeline)
  && data.location.timelines.deaths && utils.isNonEmptyObject(data.location.timelines.deaths)
  && data.location.timelines.deaths.timeline && utils.isNonEmptyObject(data.location.timelines.deaths.timeline)
  && data.location.timelines.recovered && utils.isNonEmptyObject(data.location.timelines.recovered)
  && data.location.timelines.recovered.timeline && utils.isNonEmptyObject(data.location.timelines.recovered.timeline);

export const validatePerCountryPerDateData = (data) => utils.isObject(data)
  && data.confirmed && utils.isNonEmptyObject(data.confirmed)
  && data.deaths && utils.isNonEmptyObject(data.deaths)
  && data.recovered && utils.isNonEmptyObject(data.recovered);
