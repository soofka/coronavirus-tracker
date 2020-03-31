import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useLatestCountryVirusData } from './LatestCountryVirusDataProvider.jsx';

import { useFetch } from '../../commons/hooks';
import { VIRUS_DATA_API_BASE_URL, DEFAULT_DATE } from '../../commons/constants';
import { isObject, objectHasKey } from '../../commons/utils';

const HISTORICAL_VIRUS_DATA_API_BASE_URL = `${VIRUS_DATA_API_BASE_URL}locations/`;
const HistoricalVirusDataContext = createContext();

export const HistoricalVirusDataProvider = ({ children }) => {
  const [date, setDate] = useState(DEFAULT_DATE);

  const {
    data,
    error,
    loading,
    fetch,
  } = useFetch(
    HISTORICAL_VIRUS_DATA_API_BASE_URL,
    validateHistoricalVirusData,
    normalizeHistoricalVirusData,
  );

  const {
    country,
    region,
  } = useLatestCountryVirusData();

  useEffect(() => {
    let id = undefined;
    
    if (canFetchCountryHistoricalData(country)) {
      id = country.id;
    }

    if (canFetchRegionalHistoricalData(region)) {
      id = region.id;
    }

    if (id === undefined) {
      return;
    }

    return fetch(id);
  }, [country, region]);

  return (
    <HistoricalVirusDataContext.Provider value={{
      data,
      error,
      loading,
      fetch,
      date,
      setDate,
      country,
      region,
    }}>
      {children}
    </HistoricalVirusDataContext.Provider>
  );
};

export const useHistoricalVirusData = () => useContext(HistoricalVirusDataContext);

export const canFetchCountryHistoricalData = (country) => isObject(country) && objectHasKey(country, 'id') && country.id !== undefined;
export const canFetchRegionalHistoricalData = (region) => isObject(region) && objectHasKey(region, 'id') && region.id !== undefined;

const validateHistoricalVirusData = (data) => isObject(data)
  && objectHasKey(data, 'location')
  && isObject(data.location)
  && objectHasKey(data.location, 'timelines')
  && isObject(data.location.timelines)
  && objectHasKey(data.location.timelines, 'confirmed')
  && isObject(data.location.timelines.confirmed)
  && objectHasKey(data.location.timelines.confirmed, 'timeline')
  && isObject(data.location.timelines.confirmed.timeline)
  && objectHasKey(data.location.timelines, 'deaths')
  && isObject(data.location.timelines.deaths)
  && objectHasKey(data.location.timelines.deaths, 'timeline')
  && isObject(data.location.timelines.deaths.timeline);
  // && objectHasKey(data.location.timelines, 'recovered')
  // && isObject(data.location.timelines.recovered)
  // && objectHasKey(data.location.timelines.recovered, 'timeline')
  // && isObject(data.location.timelines.recovered.timeline)

const normalizeHistoricalVirusData = (data) => ({
  confirmed: data.location.timelines.confirmed,
  deaths: data.location.timelines.deaths,
  // recovered: data.location.timelines.recovered,
});
