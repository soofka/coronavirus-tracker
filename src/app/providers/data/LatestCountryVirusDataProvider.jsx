import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useFetch } from '../../commons/hooks';
import { VIRUS_DATA_API_BASE_URL, DEFAULT_COUNTRY, DEFAULT_REGION } from '../../commons/constants';
import { isNonEmptyArray, isObject, objectHasKey } from '../../commons/utils';

const LATEST_COUNTRY_VIRUS_DATA_API_URL = `${VIRUS_DATA_API_BASE_URL}locations`;
const LatestCountryVirusDataContext = createContext();

export const LatestCountryVirusDataProvider = ({ children }) => {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [region, setRegion] = useState(DEFAULT_REGION);

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
      region,
      setRegion,
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
  const dataParsed = {};

  const addCountry = (location) => {
    if (!dataParsed[location.country_code]) {
      dataParsed[location.country_code] = {};
    }

    dataParsed[location.country_code].country = {
      id: location.id,
      code: location.country_code,
      name: location.country,
      population: location.country_population,
      geolocation: location.coordinates,
    };

    dataParsed[location.country_code].data = {
      lastUpdated: location.last_updated,
      confirmed: location.latest.confirmed,
      deaths: location.latest.deaths,
      // recovered: location.latest.recovered,
    };
  };

  const addRegion = (location) => {
    if (!objectHasKey(dataParsed, location.country_code)) {
      dataParsed[location.country_code] = {};
    }

    if (!objectHasKey(dataParsed[location.country_code], 'regions')) {
      dataParsed[location.country_code].regions = [];
    }

    dataParsed[location.country_code].regions.push({
      region: {
        id: location.id,
        name: location.province,
        geolocation: location.coordinates,
      },
      country: {
        code: location.country_code,
        name: location.country,
        population: location.country_population,
      },
      data: {
        lastUpdated: location.last_updated,
        confirmed: location.latest.confirmed,
        deaths: location.latest.deaths,
        // recovered: location.latest.recovered,
      },
    });
  };

  data.locations.forEach((location) =>
    location.province === ''
      ? addCountry(location)
      : addRegion(location));

  const dataNormalized = {};
  Object.keys(dataParsed).forEach((countryCode) => {
    if (
      objectHasKey(dataParsed[countryCode], 'country')
      && objectHasKey(dataParsed[countryCode], 'data'))
    {
      dataNormalized[countryCode] = dataParsed[countryCode];
    } else if (
      objectHasKey(dataParsed[countryCode], 'regions')
      && isNonEmptyArray(dataParsed[countryCode].regions))
    {
      const regions = dataParsed[countryCode].regions;
      dataNormalized[countryCode] = { regions };

      if (!objectHasKey(dataParsed[countryCode], 'country')) {
        dataNormalized[countryCode].country = regions[0].country;
      }

      if (!objectHasKey(dataParsed[countryCode], 'data')) {
        dataNormalized[countryCode].data = {
          confirmed: 0,
          deaths: 0,
          // recovered: 0,
        };

        regions.forEach((region) => {
          dataNormalized[countryCode].data.confirmed += region.data.confirmed;
          dataNormalized[countryCode].data.deaths += region.data.deaths;
          // dataParsed[countryCode].data.recovered += region.data.recovered;
        });
      }
    }
  });

  return dataNormalized;
};
