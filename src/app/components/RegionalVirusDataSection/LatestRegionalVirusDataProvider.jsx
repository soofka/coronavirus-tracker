import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { useFetch, useStoredState } from 'commons/hooks';
import { LATEST_REGIONAL_VIRUS_DATA_API_URL, DEFAULT_REGION } from 'commons/constants';
import { isNonEmptyString, isNonEmptyArray, isObject, objectHasKey } from 'commons/utils';

const LatestRegionalVirusDataContext = createContext();

export const LatestRegionalVirusDataProvider = ({ children }) => {
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

  const [latestOptions, setLatestOptions, setDefaultLatestOptions] = useStoredState(
    { regionId: DEFAULT_REGION },
    'latest_options',
    (value) => isObject(value)
      && objectHasKey(value, 'regionId')
      && validateRegionId(data, value.regionId),
    true,
  );
  useEffect(() => setDefaultLatestOptions(), [data]);

  return (
    <LatestRegionalVirusDataContext.Provider value={{
      data,
      loading,
      error,
      fetch,
      latestOptions,
      setLatestOptions,
    }}>
      {children}
    </LatestRegionalVirusDataContext.Provider>
  );
};

export const useLatestRegionalVirusData = () => useContext(LatestRegionalVirusDataContext);
export const isDefaultRegionId = (regionId) => regionId === DEFAULT_REGION;

const validateRegionId = (data, regionId) => isDefaultRegionId(regionId) ||
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
