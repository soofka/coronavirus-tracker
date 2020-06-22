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
    .sort((a, b) => new Date(a) < new Date(b) ? -1 : 1);

  const dataNormalized2 = {
    daily: {
      dates: [],
      confirmed: {},
      deaths: {},
      // recovered: {},
    },
    weekly: {
      dates: [],
      confirmed: {},
      deaths: {},
      // recovered: {},
    },
    monthly: {
      dates: [],
      confirmed: {},
      deaths: {},
      // recovered: {},
    },
  };

  let week;
  let yearMonth;

  allDates.forEach((date, index) => {
    if (
      (!isNaN(dataNormalized1.confirmed[date]) && dataNormalized1.confirmed[date] > 0)
      || (!isNaN(dataNormalized1.deaths[date]) && dataNormalized1.deaths[date] > 0)
      // || (!isNaN(dataNormalized1.recovered[date]) && dataNormalized1.recovered[date] > 0)
    ) {
      const confirmed = !isNaN(dataNormalized1.confirmed[date]) ? dataNormalized1.confirmed[date] : 0;
      const deaths = !isNaN(dataNormalized1.deaths[date]) ? dataNormalized1.deaths[date] : 0;
      // const recovered = !isNaN(dataNormalized1.recovered[date]) ? dataNormalized1.recovered[date] : 0;

      const previousDay = dataNormalized2.daily.dates.length > 0
        ? dataNormalized2.daily.dates[dataNormalized2.daily.dates.length - 1]
        : undefined;
      const previousWeek = dataNormalized2.weekly.dates.length > 0
        ? dataNormalized2.weekly.dates[dataNormalized2.weekly.dates.length - 1]
        : undefined;
      const previousMonth = dataNormalized2.monthly.dates.length > 0
        ? dataNormalized2.monthly.dates[dataNormalized2.monthly.dates.length - 1]
        : undefined;

      dataNormalized2.daily.dates.push(date);
      dataNormalized2.daily.confirmed[date] = getHistoricalValue(
        confirmed,
        previousDay ? dataNormalized2.daily.confirmed[previousDay].total : undefined,
      );
      dataNormalized2.daily.deaths[date] = getHistoricalValue(
        deaths,
        previousDay ? dataNormalized2.daily.deaths[previousDay].total : undefined,
      );
      // dataNormalized2.recovered[date] = getHistoricalValue(
      //   dataNormalized1.recovered[date],
      //   previousDay ? dataNormalized2.daily.recovered[previousDay].total : undefined,
      // );

      const dateObject = new Date(date);
      const dateTime = dateObject.getTime();
      const dateDayOfWeek = dateObject.getDay();

      if (!week) {
        const weekStartDate = new Date(dateTime - (1000 * 60 * 60 * 24 * dateDayOfWeek));
        const weekEndDate = new Date(dateTime + (1000 * 60 * 60 * 24 * (6 - dateDayOfWeek)));
        week = `${weekStartDate.toISOString().substr(0, 10)}--${weekEndDate.toISOString().substr(0, 10)}`;
      };

      if (dateDayOfWeek === 6 || index === allDates.length - 1) {
        dataNormalized2.weekly.dates.push(week);
        dataNormalized2.weekly.confirmed[week] = getHistoricalValue(
          confirmed,
          previousWeek ? dataNormalized2.weekly.confirmed[previousWeek].total : undefined,
        );
        dataNormalized2.weekly.deaths[week] = getHistoricalValue(
          deaths,
          previousWeek ? dataNormalized2.weekly.deaths[previousWeek].total : undefined,
        );
        // dataNormalized2.weekly[week].recovered = getHistoricalValue(
        //   recovered,
        //   previousWeek ? dataNormalized2.weekly.recovered[previousWeek].total : undefined,
        // );

        week = undefined;
      }

      if (!yearMonth) {
        yearMonth = dateObject.toISOString().substr(0, 7);
      }

      if (
        new Date(dateTime + (1000 * 60 * 60 * 24)).getMonth() !== dateObject.getMonth()
        || index === allDates.length - 1
      ) {
        dataNormalized2.monthly.dates.push(yearMonth);
        dataNormalized2.monthly.confirmed[yearMonth] = getHistoricalValue(
          confirmed,
          previousMonth ? dataNormalized2.monthly.confirmed[previousMonth].total : undefined,
        );
        dataNormalized2.monthly.deaths[yearMonth] = getHistoricalValue(
          deaths,
          previousMonth ? dataNormalized2.monthly.deaths[previousMonth].total : undefined,
        );
        // dataNormalized2.monthly.recovered[yearMonth] = getHistoricalValue(
        //   recovered,
        //   previousMonth ? dataNormalized2.monthly.recovered[previousMonth].total : undefined,
        // );

        yearMonth = undefined;
      }
    }
  });

  dataNormalized2.daily.dates.reverse();
  dataNormalized2.weekly.dates.reverse();
  dataNormalized2.monthly.dates.reverse();
  
  return dataNormalized2;
};

const getHistoricalValue = (currentValue, previousValue) =>
  currentValue !== undefined
    ? ({
      total: parseInt(currentValue, 10),
      change: previousValue !== undefined
        ? (parseInt(currentValue, 10) - parseInt(previousValue, 10))
        : 0,
    })
    : ({
      total: 0,
      change: 0,
    });
