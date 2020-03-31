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

  const addProvince = (location) => {
    if (!objectHasKey(dataParsed, location.country_code)) {
      dataParsed[location.country_code] = {};
    }

    if (!objectHasKey(dataParsed[location.country_code], 'provinces')) {
      dataParsed[location.country_code].provinces = [];
    }

    dataParsed[location.country_code].provinces.push({
      province: {
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
      : addProvince(location));

  const dataNormalized = {};
  Object.keys(dataParsed).forEach((countryCode) => {
    if (
      objectHasKey(dataParsed[countryCode], 'country')
      && objectHasKey(dataParsed[countryCode], 'data'))
    {
      dataNormalized[countryCode] = dataParsed[countryCode];
    } else if (
      objectHasKey(dataParsed[countryCode], 'provinces')
      && isNonEmptyArray(dataParsed[countryCode].provinces))
    {
      const provinces = dataParsed[countryCode].provinces;
      dataNormalized[countryCode] = { provinces };

      if (!objectHasKey(dataParsed[countryCode], 'country')) {
        dataNormalized[countryCode].country = provinces[0].country;
      }

      if (!objectHasKey(dataParsed[countryCode], 'data')) {
        dataNormalized[countryCode].data = {
          confirmed: 0,
          deaths: 0,
          // recovered: 0,
        };

        provinces.forEach((province) => {
          dataNormalized[countryCode].data.confirmed += province.data.confirmed;
          dataNormalized[countryCode].data.deaths += province.data.deaths;
          // dataParsed[countryCode].data.recovered += province.data.recovered;
        });
      }
    }
  });

  return dataNormalized;
};
