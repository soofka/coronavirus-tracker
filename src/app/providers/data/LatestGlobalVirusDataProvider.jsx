import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { useFetch } from '../../commons/hooks';
import { VIRUS_DATA_API_BASE_URL } from '../../commons/constants';
import { isNumber, isObject, objectHasKey } from '../../commons/utils';

const LATEST_GLOBAL_VIRUS_DATA_API_URL = `${VIRUS_DATA_API_BASE_URL}latest`;
const LatestGlobalVirusDataContext = createContext();

export const LatestGlobalVirusDataProvider = ({ children }) => {
  const {
    data,
    error,
    loading,
    fetch,
  } = useFetch(
    LATEST_GLOBAL_VIRUS_DATA_API_URL,
    validateLatestGlobalVirusData,
    normalizeLatestGlobalVirusData,
  );

  useEffect(() => fetch(), []);

  return (
    <LatestGlobalVirusDataContext.Provider value={{
      data,
      error,
      loading,
      fetch,
    }}>
      {children}
    </LatestGlobalVirusDataContext.Provider>
  );
};

export const useLatestGlobalVirusData = () => useContext(LatestGlobalVirusDataContext);

const validateLatestGlobalVirusData = (data) =>
  isObject(data)
  && objectHasKey(data, 'latest')
  && isObject(data.latest)
  && objectHasKey(data.latest, 'confirmed')
  && isNumber(data.latest.confirmed)
  && objectHasKey(data.latest, 'deaths')
  && isNumber(data.latest.deaths);
  // && objectHasKey(data.latest, 'recovered')
  // && isNumber(data.latest.recovered);

const normalizeLatestGlobalVirusData = (data) => ({ 
  confirmed: data.latest.confirmed,
  deaths: data.latest.deaths,
  // recovered: data.latest.recovered,
});
