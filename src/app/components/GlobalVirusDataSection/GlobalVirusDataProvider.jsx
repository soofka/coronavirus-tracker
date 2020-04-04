import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { useFetch } from 'commons/hooks';
import { GLOBAL_VIRUS_DATA_API_URL } from 'commons/constants';
import { isNumber, isObject, objectHasKey } from 'commons/utils';

const GlobalVirusDataContext = createContext();

export const GlobalVirusDataProvider = ({ children }) => {
  const {
    data,
    error,
    loading,
    fetch,
  } = useFetch(
    GLOBAL_VIRUS_DATA_API_URL,
    validateGlobalVirusData,
    normalizeGlobalVirusData,
  );

  useEffect(() => fetch(), []);

  return (
    <GlobalVirusDataContext.Provider value={{
      data,
      error,
      loading,
      fetch,
    }}>
      {children}
    </GlobalVirusDataContext.Provider>
  );
};

export const useGlobalVirusData = () => useContext(GlobalVirusDataContext);

const validateGlobalVirusData = (data) =>
  isObject(data)
  && objectHasKey(data, 'latest')
  && isObject(data.latest)
  && objectHasKey(data.latest, 'confirmed')
  && isNumber(data.latest.confirmed)
  && objectHasKey(data.latest, 'deaths')
  && isNumber(data.latest.deaths);
  // && objectHasKey(data.latest, 'recovered')
  // && isNumber(data.latest.recovered);

const normalizeGlobalVirusData = (data) => ({ 
  confirmed: data.latest.confirmed,
  deaths: data.latest.deaths,
  // recovered: data.latest.recovered,
});
