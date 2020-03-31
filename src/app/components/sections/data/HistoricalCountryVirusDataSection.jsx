import { h, Fragment } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';
import { SmartSelect } from '../../SmartSelect.jsx';

import { useHistoricalCountryVirusData } from '../../../providers/data/HistoricalCountryVirusDataProvider.jsx';

import { DEFAULT_DATE, DEFAULT_COUNTRY } from '../../../commons/constants';

const DEFAULT_DAYS_AGO_SELECTION = 1;

export const HistoricalCountryVirusDataSection = () => {
  const {
    data,
    error,
    loading,
    date,
    setDate,
    country,
  } = useHistoricalCountryVirusData();

  if (!country || country === DEFAULT_COUNTRY || !country.id) {
    return;
  }

  if (date === DEFAULT_DATE && data) {
    setDate(getDates(data)[DEFAULT_DAYS_AGO_SELECTION]);
  }

  return <SectionWithData
    header={<>
      <Text label="sections.country_historical.header"/>&nbsp;
      ({country.name})
    </>}
    content={<>
      {data && <p>
        <SmartSelect
          id="select-date"
          label={<Text label="sections.country_historical.select_date"/>}
          value={date}
          defaultValue={DEFAULT_DATE}
          onChange={(value) => setDate(value)}
        >
          {renderOptions(data)}
        </SmartSelect>
      </p>}
      {data && date && <VirusData
        total={country.population}
        confirmed={data.confirmed.timeline[date]}
        deaths={data.deaths.timeline[date]}
        // recovered={data.recovered.timeline[date]}
      />}
    </>}
    data={data}
    error={error}
    loading={loading}
  />;
};

const renderOptions = (data) =>
  getDates(data).map((date) => {
    const thatDay = new Date(date);
    const daysAgo = Math.floor((new Date(new Date().toISOString().substr(0, 10)) - thatDay) / (1000 * 60 * 60 * 24));
    const daysAgoText = daysAgo === 0
      ? <Text label="sections.country_historical.today"/>
      : (daysAgo === 1
        ? <Text label="sections.country_historical.yesterday"/>
        : <Text label="sections.country_historical.days_ago" values={{ days: daysAgo }}/>);

    return <option value={date}>{daysAgoText} ({thatDay.toLocaleDateString()})</option>;
  });

const getDates = (data) => 
  Object.keys(data.confirmed.timeline)
    .concat(Object.keys(data.deaths.timeline))
    // .concat(Object.keys(data.recovered.timeline))
    .filter((item, index, array) => array.indexOf(item) === index)
    .sort((a, b) => a < b ? 1 : -1);
