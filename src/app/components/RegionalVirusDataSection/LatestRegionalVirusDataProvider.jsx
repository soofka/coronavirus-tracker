import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useFetch } from 'commons/hooks';
import { LATEST_REGIONAL_VIRUS_DATA_API_URL, DEFAULT_REGION } from 'commons/constants';
import { isNonEmptyString, isNonEmptyArray, isObject, objectHasKey } from 'commons/utils';

const LatestRegionalVirusDataContext = createContext();

export const LatestRegionalVirusDataProvider = ({ children }) => {
  const [regionId, setRegionId] = useState(DEFAULT_REGION);

  const {
    data,
    loading,
    error,
    fetch,
  } = useFetch(
    LATEST_REGIONAL_VIRUS_DATA_API_URL,
    validateLatestRegionalVirusData,
    normalizeLatestRegionalVirusData,
  );

  useEffect(() => fetch(), []);

  return (
    <LatestRegionalVirusDataContext.Provider value={{
      data,
      loading,
      error,
      fetch,
      regionId,
      setRegionId,
    }}>
      {children}
    </LatestRegionalVirusDataContext.Provider>
  );
};

export const useLatestRegionalVirusData = () => useContext(LatestRegionalVirusDataContext);

export const isDefaultRegionId = (regionId) => regionId === DEFAULT_REGION;
export const validateRegionId = (data, regionId) => isDefaultRegionId(regionId) ||
  (isObject(data) && objectHasKey(data, regionId));

const validateLatestRegionalVirusData = (data) =>
  isObject(data)
  && objectHasKey(data, 'locations')
  && isNonEmptyArray(data.locations);

const normalizeLatestRegionalVirusData = (data) => {
  const dataNormalized = {};

  data.locations.forEach((location) => {
    dataNormalized[location.id] = {
      country: {
        name: location.country,
        code: location.country_code,
        population: location.country_population,
      },
      region: {
        name: `${location.country}${isNonEmptyString(location.province) ? `, ${location.province}` : ''}`,
        geolocation: location.coordinates,
      },
      data: {
        lastUpdated: location.last_updated,
        confirmed: location.latest.confirmed,
        deaths: location.latest.deaths,
        // recovered: location.latest.recovered,
      },
    };
  });

  return dataNormalized;
};
