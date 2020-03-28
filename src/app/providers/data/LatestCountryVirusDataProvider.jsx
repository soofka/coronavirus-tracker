import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useFetch } from '../../commons/hooks';
import { VIRUS_DATA_API_BASE_URL, DEFAULT_COUNTRY } from '../../commons/constants';
import { isNonEmptyArray, isObject, objectHasKey } from '../../commons/utils';

const LATEST_COUNTRY_VIRUS_DATA_API_URL = `${VIRUS_DATA_API_BASE_URL}locations`;
const LatestCountryVirusDataContext = createContext();

export const LatestCountryVirusDataProvider = ({ children }) => {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);

  const {
    data,
    loading,
    error,
    fetch,
  } = useFetch(
    LATEST_COUNTRY_VIRUS_DATA_API_URL,
    validateLatestCountryVirusData,
    normalizeLatestCountryVirusData,
  );

  useEffect(() => fetch(), []);

  return (
    <LatestCountryVirusDataContext.Provider value={{
      data,
      loading,
      error,
      fetch,
      country,
      setCountry,
    }}>
      {children}
    </LatestCountryVirusDataContext.Provider>
  );
};

export const useLatestCountryVirusData = () => useContext(LatestCountryVirusDataContext);

const validateLatestCountryVirusData = (data) =>
  isObject(data)
  && objectHasKey(data, 'locations')
  && isNonEmptyArray(data.locations);

const normalizeLatestCountryVirusData = (data) => {
  const dataNormalized = {};

  data.locations.forEach((location) => {
    if (!dataNormalized[location.country_code]) {
      dataNormalized[location.country_code] = {
        country: {
          id: location.id,
          code: location.country_code,
          name: location.country,
        },
        data: location.latest,
      };
    }
  });

  return dataNormalized;
};
