import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { SectionWithData } from 'components/SectionWithData';
import { VirusData } from 'components/VirusData';
import { Chart } from 'components/Chart';
import { SmartSelect } from 'components/SmartSelect';
import { Text } from 'components/Text';
import { DaysAgoText } from 'components/DaysAgoText';

import {
  DATA_GRANULARITIES,
  DEFAULT_REGION,
  DEFAULT_DATE,
  DEFAULT_DATA_GRANULARITY,
} from 'commons/constants';

import { normalizeDate, normalizeDateTime } from 'commons/utils';

import {
  LatestRegionalVirusDataProvider,
  useLatestRegionalVirusData,
  isDefaultRegionId,
  validateRegionId,
} from './LatestRegionalVirusDataProvider';

import {
  HistoricalRegionalVirusDataProvider,
  useHistoricalRegionalVirusData,
  isDefaultDate,
  validateDate,
} from './HistoricalRegionalVirusDataProvider';
import { normalizeNumber } from '../../commons/utils';

export const RegionalVirusDataSection = () =>
  <LatestRegionalVirusDataProvider>
    <HistoricalRegionalVirusDataProvider>
      <RegionalVirusDataSectionComponent/>
    </HistoricalRegionalVirusDataProvider>
  </LatestRegionalVirusDataProvider>;

const REGION_QUERY_STRING_KEY = 'region';
const REGION_STORAGE_KEY = 'REGION';

const GRANULARITY_QUERY_STRING_KEY = 'granularity';
const GRANULARITY_STORAGE_KEY = 'GRANULARITY';

const DATE_QUERY_STRING_KEY = 'date';
const DATE_STORAGE_KEY = 'DATE';

const RegionalVirusDataSectionComponent = () => {
  const {
    data: latestData,
    error: latestError,
    loading: latestLoading,
    regionId,
    setRegionId,
  } = useLatestRegionalVirusData();

  const {
    data: historicalData,
    setData: setHistoricalData,
    date,
    setDate,
  } = useHistoricalRegionalVirusData();

  const [granularity, setGranularity] = useState(DEFAULT_DATA_GRANULARITY);

  let dateIndex = -1;

  if (historicalData) {
    if (isDefaultDate(date) || !validateDate(historicalData[granularity], date)) {
      setDate(historicalData[granularity].dates[0]);
    } else {
      dateIndex = historicalData[granularity].dates.findIndex((tempDate) => tempDate === date);
    }
  }

  const hasHistoricalDataForPreviousDate = historicalData && dateIndex >= 0 && dateIndex < historicalData[granularity].dates.length - 1;
  const hasHistoricalDataForNextDate = historicalData && dateIndex > 0;

  return <SectionWithData
    header={<Text label="sections.regional.header"/>}
    content={<>
      {latestData && <>
        <p style={{ margin: '0px' }}>
          <SmartSelect
            id="select-region"
            label={<Text label="sections.regional.select_region.label"/>}
            value={validateRegionId(latestData, regionId) ? regionId : DEFAULT_REGION}
            defaultValue={DEFAULT_REGION}
            queryStringKey={REGION_QUERY_STRING_KEY}
            storageKey={REGION_STORAGE_KEY}
            validate={(value) => validateRegionId(latestData, value)}
            onChange={(value) => {
              setRegionId(value);
              setHistoricalData(null);
            }}
          >
            <option value={DEFAULT_REGION}>
              {<Text label="sections.regional.select_region.default_option"/>}
            </option>
            {Object.keys(latestData)
              .sort((a, b) => latestData[a].region.name > latestData[b].region.name ? 1 : -1)
              .map((key) => <option value={key}>{latestData[key].region.name}</option>)}
          </SmartSelect>
        </p>
        <p>
          {!isDefaultRegionId(regionId) && <small>
            <Text label="sections.regional.country_population"/>:&nbsp;
            ~{normalizeNumber(latestData[regionId].country.population)}&nbsp;|&nbsp;
            <a
              href={`https://www.google.com/maps/@${latestData[regionId].region.geolocation.latitude},${latestData[regionId].region.geolocation.longitude},6z`}
              target="_blank">
              <Text label="sections.regional.see_on_map"/>&rarr;
            </a>
          </small>}
        </p>
      </>}
      {latestData && historicalData && <>
        <p>
          <Text label="sections.regional.select_granularity.label"/>:&nbsp;
          <button
            className={granularity === DATA_GRANULARITIES.DAILY ? 'active' : ''}
            onClick={() => {
              setGranularity(DATA_GRANULARITIES.DAILY);
              setDate(historicalData[DATA_GRANULARITIES.DAILY].dates[0]);
            }}
          >
            <Text label="sections.regional.select_granularity.options.daily"/>
          </button>
          <button
            className={granularity === DATA_GRANULARITIES.WEEKLY ? 'active' : ''}
            style={{ margin: '0px 8px' }}
            onClick={() => {
              setGranularity(DATA_GRANULARITIES.WEEKLY);
              setDate(historicalData[DATA_GRANULARITIES.WEEKLY].dates[0]);
            }}
          >
            <Text label="sections.regional.select_granularity.options.weekly"/>
          </button>
          <button
            className={granularity === DATA_GRANULARITIES.MONTHLY ? 'active' : ''}
            onClick={() => {
              setGranularity(DATA_GRANULARITIES.MONTHLY);
              setDate(historicalData[DATA_GRANULARITIES.MONTHLY].dates[0]);
            }}
          >
            <Text label="sections.regional.select_granularity.options.monthly"/>
          </button>
        </p>
        <p style={{ display: 'flex', flexWrap: 'wrap' }}>
          <label for="select-date" style={{ display: 'flex', alignItems: 'center' }}>
            <Text label="sections.regional.select_date.label"/>:
          </label>&nbsp;
          <div>
            <button
              onClick={(event) => {
                event.preventDefault();
                setDate(historicalData[granularity].dates[dateIndex + 1]);
              }}
              style={{ opacity: hasHistoricalDataForPreviousDate ? 1 : 0 }}
              disabled={!hasHistoricalDataForPreviousDate}
            >
              &laquo;
            </button>
            <SmartSelect
              id="select-date"
              // label={<Text label="sections.regional.select_date.label"/>}
              value={validateDate(historicalData[granularity], date) ? date : DEFAULT_DATE}
              defaultValue={DEFAULT_DATE}
              queryStringKey={DATE_QUERY_STRING_KEY}
              storageKey={DATE_STORAGE_KEY}
              validate={(value) => validateDate(historicalData[granularity], value)}
              onChange={(value) => setDate(value)}
              style={{ margin: '0px 8px' }}
            >
              {historicalData[granularity].dates.map((date) => <option value={date}>
                {granularity === DATA_GRANULARITIES.DAILY && <><DaysAgoText date={date}/>&nbsp;<span>({normalizeDate(date)})</span></>}
                {granularity === DATA_GRANULARITIES.WEEKLY && <span>{date.split('--').map((weekDate) => normalizeDate(weekDate)).join(' - ')}</span>}
                {granularity === DATA_GRANULARITIES.MONTHLY && <span><Text label={`common.months.${parseInt(date.split('-')[1], 10) - 1}`}/> {date.split('-')[0]}</span>}
              </option>)}
            </SmartSelect>
            <button
              onClick={(event) => {
                event.preventDefault();
                setDate(historicalData[granularity].dates[dateIndex - 1]);
              }}
              style={{ opacity: hasHistoricalDataForNextDate ? 1 : 0 }}
              disabled={!hasHistoricalDataForNextDate}
            >
              &raquo;
            </button>
          </div>
        </p>
      </>}
      {latestData && !isDefaultRegionId(regionId) && <>
        {historicalData && !isDefaultDate(date)
          ? <>
              <VirusData
                total={latestData[regionId].country.population}
                confirmed={historicalData[granularity].confirmed[date].total}
                confirmedChange={historicalData[granularity].confirmed[date].change}
                deaths={historicalData[granularity].deaths[date].total}
                deathsChange={historicalData[granularity].deaths[date].change}
                // recovered={historicalData[granularity].recovered[date].total}
                // recoveredChange={historicalData[granularity].recovered[date].change}
              />
              <Chart
                granularity={granularity}
                dates={historicalData[granularity].dates}
                currentDate={date}
                confirmed={historicalData[granularity].confirmed}
                deaths={historicalData[granularity].deaths}
                // recovered={historicalData[granularity].recovered}
              />
            </>
          : <VirusData
              total={latestData[regionId].country.population}
              confirmed={latestData[regionId].data.confirmed}
              deaths={latestData[regionId].data.deaths}
              // recovered={latestData[regionId].data.recovered}
            />
        }    
        <small>
          <Text label="sections.data.last_updated"/>:&nbsp;
          <DaysAgoText date={latestData[regionId].data.lastUpdated}/>&nbsp;
          ({normalizeDateTime(latestData[regionId].data.lastUpdated)})
        </small>
      </>}
    </>}
    data={latestData}
    error={latestError}
    loading={latestLoading}
  />;
};
