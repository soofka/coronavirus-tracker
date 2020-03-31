import { h, Fragment } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';
import { SmartSelect } from '../../SmartSelect.jsx';

import {
  useHistoricalVirusData,
  canFetchCountryHistoricalData,
  canFetchRegionalHistoricalData,
} from '../../../providers/data/HistoricalVirusDataProvider.jsx';

import { DEFAULT_DATE, DEFAULT_REGION } from '../../../commons/constants';

const DEFAULT_DAYS_AGO_SELECTION = 1;

export const HistoricalVirusDataSection = () => {
  const {
    data,
    error,
    loading,
    date,
    setDate,
    country,
    region,
  } = useHistoricalVirusData();

  if (!canFetchCountryHistoricalData(country) && !canFetchRegionalHistoricalData(region)) {
    return null;
  }

  if (data && date === DEFAULT_DATE) {
    setDate(getDates(data)[DEFAULT_DAYS_AGO_SELECTION]);
  }

  return <SectionWithData
    header={<>
      <Text label="sections.historical.header"/><br/>
      ({country.name}{region && region !== DEFAULT_REGION && ` - ${region.name}`})
    </>}
    content={<>
      {data && <p>
        <SmartSelect
          id="select-date"
          label={<Text label="sections.historical.select_date_label"/>}
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
      ? <Text label="sections.historical.today"/>
      : (daysAgo === 1
        ? <Text label="sections.historical.yesterday"/>
        : <Text label="sections.historical.days_ago" values={{ days: daysAgo }}/>);

    return <option value={date}>{daysAgoText} ({thatDay.toLocaleDateString()})</option>;
  });

const getDates = (data) => 
  Object.keys(data.confirmed.timeline)
    .concat(Object.keys(data.deaths.timeline))
    // .concat(Object.keys(data.recovered.timeline))
    .filter((item, index, array) => array.indexOf(item) === index)
    .sort((a, b) => a < b ? 1 : -1);
