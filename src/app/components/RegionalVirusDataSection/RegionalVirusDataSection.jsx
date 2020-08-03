import { h, Fragment } from 'preact';

import { SectionWithData } from 'components/SectionWithData';
import { VirusData } from 'components/VirusData';
import { Chart } from 'components/Chart';
import { SmartSelect } from 'components/SmartSelect';
import { SmartButtons } from 'components/SmartButtons';
import { Text } from 'components/Text';
import { DaysAgoText } from 'components/DaysAgoText';

import { DATA_GRANULARITIES } from 'commons/constants';
import { normalizeDate, normalizeDateTime, normalizeNumber } from 'commons/utils';

import {
  LatestRegionalVirusDataProvider,
  useLatestRegionalVirusData,
  isDefaultRegionId,
} from './LatestRegionalVirusDataProvider';

import {
  HistoricalRegionalVirusDataProvider,
  useHistoricalRegionalVirusData,
  isDefaultDate,
} from './HistoricalRegionalVirusDataProvider';

export const RegionalVirusDataSection = () =>
  <LatestRegionalVirusDataProvider>
    <HistoricalRegionalVirusDataProvider>
      <RegionalVirusDataSectionComponent/>
    </HistoricalRegionalVirusDataProvider>
  </LatestRegionalVirusDataProvider>;

const RegionalVirusDataSectionComponent = () => {
  const {
    data: latestData,
    error: latestError,
    loading: latestLoading,
    latestOptions,
    setLatestOptions,
  } = useLatestRegionalVirusData();

  const {
    data: historicalData,
    setData: setHistoricalData,
    historicalOptions,
    setHistoricalOptions,
  } = useHistoricalRegionalVirusData();

  const { regionId } = latestOptions;
  const setRegionId = (newRegionId) => setLatestOptions({ regionId: newRegionId });

  const { date, granularity } = historicalOptions;
  const setDate = (newDate) => setHistoricalOptions({ date: newDate });
  const setGranularity = (newGranularity, newDate) => setHistoricalOptions({
    granularity: newGranularity,
    date: newDate,
  });

  const regionOptions = [
    { value: 'DEFAULT_REGION', text: <Text label="sections.regional.select_region.default_option"/> },
  ];

  if (latestData) {
    Object.keys(latestData)
      .sort((a, b) => latestData[a].region.name > latestData[b].region.name ? 1 : -1)
      .forEach((key) => regionOptions.push({ value: key, text: latestData[key].region.name }));
  }

  const dateOptions = [];

  if (historicalData) {
    historicalData[granularity].dates.forEach((date) => {
      let label;

      switch(granularity) {
        case DATA_GRANULARITIES.DAILY:
          label = <><DaysAgoText date={date}/>&nbsp;<span>({normalizeDate(date)})</span></>;
          break;

        case DATA_GRANULARITIES.WEEKLY:
          label = <span>{date.split('--').map((weekDate) => normalizeDate(weekDate)).join(' - ')}</span>;
          break;

        case DATA_GRANULARITIES.MONTHLY:
          label = <span><Text label={`common.months.${parseInt(date.split('-')[1], 10) - 1}`}/> {date.split('-')[0]}</span>;
          break;

        default:
          break;
      }

      dateOptions.push({ value: date, text: label });
    });

    if (!date || isDefaultDate(date)) {
      setDate(historicalData[granularity].dates[0]);
    }
  }

  return <SectionWithData
    header={<Text label="sections.regional.header"/>}
    content={<>
      {latestData && <>
        <p style={{ margin: '0px' }}>
          <SmartSelect
            id="select-region"
            label={<Text label="sections.regional.select_region.label"/>}
            options={regionOptions}
            value={regionId}
            setValue={(value) => {
              setRegionId(value);
              setHistoricalData(null);
            }}
          />
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
        <SmartButtons
          label={<Text label="sections.regional.select_granularity.label"/>}
          options={[
            { value: DATA_GRANULARITIES.DAILY, text: <Text label="sections.regional.select_granularity.options.daily"/> },
            { value: DATA_GRANULARITIES.WEEKLY, text: <Text label="sections.regional.select_granularity.options.weekly"/> },
            { value: DATA_GRANULARITIES.MONTHLY, text: <Text label="sections.regional.select_granularity.options.monthly"/> },
          ]}
          value={granularity}
          setValue={(value) => setGranularity(value, historicalData[value].dates[0])}
        />
        <SmartSelect
          id="select-date"
          label={<Text label="sections.regional.select_date.label"/>}
          options={dateOptions}
          value={date}
          setValue={(value) => setDate(value)}
          withButtons={true}
          reverseButtons={true}
        />
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
