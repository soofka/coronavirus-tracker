import { h, Fragment } from 'preact';

import { SectionWithData } from 'components/SectionWithData';
import { VirusData } from 'components/VirusData';
import { Chart } from 'components/Chart';
import { SmartSelect } from 'components/SmartSelect';
import { Text } from 'components/Text';
import { DaysAgoText } from 'components/DaysAgoText';

import {
  DEFAULT_REGION,
  DEFAULT_DATE,
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

  let dateIndex = -1;

  if (historicalData) {
    console.log('render historyczny', historicalData);
    if (isDefaultDate(date) || !validateDate(historicalData, date)) {
      setDate(historicalData.dates[0]);
    } else {
      dateIndex = historicalData.dates.findIndex((tempDate) => tempDate === date);
    }
  }

  const hasHistoricalDataForPreviousDate = historicalData && dateIndex >= 0 && dateIndex < historicalData.dates.length - 1;
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
        <p style={{ display: 'flex', flexWrap: 'wrap' }}>
          <label for="select-date"><Text label="sections.regional.select_date.label"/>:</label>&nbsp;
          <div>
            <button
              onClick={(event) => {
                event.preventDefault();
                setDate(historicalData.dates[dateIndex + 1]);
              }}
              style={{ opacity: hasHistoricalDataForPreviousDate ? 1 : 0 }}
              disabled={!hasHistoricalDataForPreviousDate}
            >
              &laquo;
            </button>
            <SmartSelect
              id="select-date"
              // label={<Text label="sections.regional.select_date.label"/>}
              value={validateDate(historicalData, date) ? date : DEFAULT_DATE}
              defaultValue={DEFAULT_DATE}
              queryStringKey={DATE_QUERY_STRING_KEY}
              storageKey={DATE_STORAGE_KEY}
              validate={(value) => validateDate(historicalData, value)}
              onChange={(value) => setDate(value)}
              style={{ margin: '0px 8px' }}
            >
              {historicalData.dates.map((date) => <option value={date}>
                <DaysAgoText date={date}/>&nbsp;<span>({normalizeDate(date)})</span>
              </option>)}
            </SmartSelect>
            <button
              onClick={(event) => {
                event.preventDefault();
                setDate(historicalData.dates[dateIndex - 1]);
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
                confirmed={historicalData.confirmed[date].total}
                confirmedChange={historicalData.confirmed[date].change}
                deaths={historicalData.deaths[date].total}
                deathsChange={historicalData.deaths[date].change}
                // recovered={historicalData.recovered[date].total}
                // recoveredChange={historicalData.recovered[date].change}
              />
              <Chart
                dates={historicalData.dates}
                currentDate={date}
                confirmed={historicalData.confirmed}
                deaths={historicalData.deaths}
                // recovered={historicalData.recovered}
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
