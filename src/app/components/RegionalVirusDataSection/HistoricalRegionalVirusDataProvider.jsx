import { h, createContext } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';

import { useLatestRegionalVirusData, isDefaultRegionId } from './LatestRegionalVirusDataProvider';

import { useFetch } from 'commons/hooks';
import { HISTORICAL_REGIONAL_VIRUS_DATA_API_BASE_URL, DEFAULT_DATE } from 'commons/constants';
import { isObject, objectHasKey } from 'commons/utils';

const HistoricalRegionalVirusDataContext = createContext();

export const HistoricalRegionalVirusDataProvider = ({ children }) => {
  const [date, setDate] = useState(DEFAULT_DATE);

  const {
    data,
    setData,
    error,
    loading,
    fetch,
  } = useFetch(
    HISTORICAL_REGIONAL_VIRUS_DATA_API_BASE_URL,
    validateHistoricalRegionalVirusData,
    normalizeHistoricalRegionalVirusData,
  );

  const { regionId } = useLatestRegionalVirusData();

  useEffect(() => !isDefaultRegionId(regionId) && fetch(regionId), [regionId]);
  
  return (
    <HistoricalRegionalVirusDataContext.Provider value={{
      data,
      setData,
      error,
      loading,
      fetch,
      date,
      setDate,
    }}>
      {children}
    </HistoricalRegionalVirusDataContext.Provider>
  );
};

export const useHistoricalRegionalVirusData = () => useContext(HistoricalRegionalVirusDataContext);

export const isDefaultDate = (date) => date === DEFAULT_DATE;
export const validateDate = (data, date) => isDefaultDate(date)
  || (isObject(data) && data.dates.includes(date));

const validateHistoricalRegionalVirusData = (data) => isObject(data)
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

const normalizeHistoricalRegionalVirusData = (data) => {
  const dataNormalized1 = {
    confirmed: {},
    deaths: {},
    // recovered: {},
  };

  const confirmed = data.location.timelines.confirmed.timeline;
  Object.keys(confirmed).forEach((date) => dataNormalized1.confirmed[date.substr(0, 10)] = confirmed[date]);

  const deaths = data.location.timelines.deaths.timeline;
  Object.keys(deaths).forEach((date) => dataNormalized1.deaths[date.substr(0, 10)] = deaths[date]);

  // const recovered = data.location.timelines.recovered.timeline;
  // Object.keys(recovered).forEach((date) => dataNormalized1.recovered[date.substr(0, 10)] = recovered[date]);
  
  const allDates = Object.keys(dataNormalized1.confirmed)
    .concat(Object.keys(dataNormalized1.deaths))
    // .concat(Object.keys(dataNormalized1.recovered))
    .filter((item, index, array) => array.indexOf(item) === index)
    .sort((a, b) => new Date(a) < new Date(b) ? 1 : -1);

  const dataNormalized2 = {
    dates: [],
    confirmed: {},
    deaths: {},
    // recovered: {},
  };

  allDates.forEach((date, index) => {
    if (
      (dataNormalized1.confirmed[date] && parseInt(dataNormalized1.confirmed[date], 10) > 0)
      || (dataNormalized1.deaths[date] && parseInt(dataNormalized1.deaths[date], 10) > 0)
      // || (dataNormalized1.recovered[date] && parseInt(dataNormalized1.recovered[date], 10) > 0)
    ) {
      const previousDate = index < allDates.length - 1 && allDates[index + 1];

      dataNormalized2.dates.push(date);
      dataNormalized2.confirmed[date] = getHistoricalValue(dataNormalized1.confirmed, date, previousDate);
      dataNormalized2.deaths[date] = getHistoricalValue(dataNormalized1.deaths, date, previousDate);
      // dataNormalized2.recovered[date] = getHistoricalValue(dataNormalized1.recovered, date, previousDate);
    }
  });
  
  return dataNormalized2;
};

const getHistoricalValue = (data, currentDate, previousDate) => data[currentDate]
  ? ({
    total: data[currentDate],
    change: previousDate
      ? data[currentDate] - data[previousDate]
      : 0
  })
  : ({
    total: 0,
    change: 0,
  });
