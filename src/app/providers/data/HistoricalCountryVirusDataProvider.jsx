import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useLatestCountryVirusData } from './LatestCountryVirusDataProvider.jsx';

import { useFetch } from '../../commons/hooks';
import { VIRUS_DATA_API_BASE_URL, DEFAULT_DATE, DEFAULT_COUNTRY } from '../../commons/constants';
import { isObject, objectHasKey } from '../../commons/utils';

const HISTORICAL_COUNTRY_VIRUS_DATA_API_BASE_URL = `${VIRUS_DATA_API_BASE_URL}locations/`;
const HistoricalCountryVirusDataContext = createContext();

export const HistoricalCountryVirusDataProvider = ({ children }) => {
  const [date, setDate] = useState(DEFAULT_DATE);

  const {
    data,
    error,
    loading,
    fetch,
  } = useFetch(
    HISTORICAL_COUNTRY_VIRUS_DATA_API_BASE_URL,
    validateHistoricalCountryVirusData,
    normalizeHistoricalCountryVirusData,
  );

  const { country } = useLatestCountryVirusData();

  useEffect(() => country && country !== DEFAULT_COUNTRY && fetch(country.id), [country]);

  return (
    <HistoricalCountryVirusDataContext.Provider value={{
      data,
      error,
      loading,
      fetch,
      date,
      setDate,
      country,
    }}>
      {children}
    </HistoricalCountryVirusDataContext.Provider>
  );
};

export const useHistoricalCountryVirusData = () => useContext(HistoricalCountryVirusDataContext);

const validateHistoricalCountryVirusData = (data) => isObject(data)
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
  && isObject(data.location.timelines.deaths.timeline)
  && objectHasKey(data.location.timelines, 'recovered')
  && isObject(data.location.timelines.recovered)
  && objectHasKey(data.location.timelines.recovered, 'timeline')
  && isObject(data.location.timelines.recovered.timeline);

const normalizeHistoricalCountryVirusData = (data) => ({ ...data.location.timelines });
