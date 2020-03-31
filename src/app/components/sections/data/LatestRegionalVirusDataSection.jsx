import { h, Fragment } from 'preact';

import { Text } from '../../Text.jsx';
import { Section } from '../Section.jsx';
import { VirusData } from './VirusData.jsx';
import { SmartSelect } from '../../SmartSelect.jsx';

import { useLatestCountryVirusData } from '../../../providers/data/LatestCountryVirusDataProvider.jsx';

import { DEFAULT_COUNTRY, DEFAULT_REGION } from '../../../commons/constants';
import { objectHasKey } from '../../../commons/utils';

const REGION_QUERY_STRING_KEY = 'region';
const REGION_STORAGE_KEY = 'REGION';

export const LatestRegionalVirusDataSection = () => {
  const {
    data,
    country,
    region,
    setRegion,
  } = useLatestCountryVirusData();

  if (!data || !country || country === DEFAULT_COUNTRY || !objectHasKey(data[country.code], 'regions')) {
    return null;
  }

  const getRegion = (id) => data[country.code].regions.find((tempRegion) => parseInt(tempRegion.region.id, 10) === parseInt(id, 10));

  return <Section
    header={<Text label="sections.regional_latest.header"/>}
    content={<>
      <p><SmartSelect
        id="select-region"
        label={<Text label="sections.regional_latest.select_region.label"/>}
        value={(!region || region === DEFAULT_REGION) ? DEFAULT_REGION : region.id}
        defaultValue={DEFAULT_REGION}
        queryStringKey={REGION_QUERY_STRING_KEY}
        storageKey={REGION_STORAGE_KEY}
        validate={(value) => value === DEFAULT_REGION || getRegion(value)}
        onChange={(value) => setRegion(!value || value === DEFAULT_REGION ? DEFAULT_REGION : getRegion(value).region)}
      >
        <option value={DEFAULT_REGION}>{<Text label="sections.regional_latest.select_region.default_option"/>}</option>
        {data[country.code].regions
          .sort((a, b) => a.region.name > b.region.name ? 1 : -1)
          .map(({ region: { id, name }}) => <option value={id}>{name}</option>)}
      </SmartSelect></p>
      {region && region !== DEFAULT_REGION && <VirusData
        confirmed={getRegion(region.id).data.confirmed}
        deaths={getRegion(region.id).data.deaths}
        // recovered={getRegion(region.id).data.recovered}
      />}
    </>}
  />;
};
