import { h, Fragment } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';
import { SmartSelect } from '../../SmartSelect.jsx';

import { useLatestCountryVirusData } from '../../../providers/data/LatestCountryVirusDataProvider.jsx';

import { DEFAULT_COUNTRY, DEFAULT_REGION } from '../../../commons/constants';
import { objectHasKey } from '../../../commons/utils';

const COUNTRY_QUERY_STRING_KEY = 'country';
const COUNTRY_STORAGE_KEY = 'COUNTRY';

export const LatestCountryVirusDataSection = () => {
  const {
    data,
    error,
    loading,
    country,
    setCountry,
    setRegion,
  } = useLatestCountryVirusData();

  return <SectionWithData
    header={<Text label="sections.country_latest.header"/>}
    content={<>
      {data && <p>
        <SmartSelect
          id="select-country"
          label={<Text label="sections.country_latest.select_country.label"/>}
          value={(!country || country === DEFAULT_COUNTRY) ? DEFAULT_COUNTRY : country.code}
          defaultValue={DEFAULT_COUNTRY}
          queryStringKey={COUNTRY_QUERY_STRING_KEY}
          storageKey={COUNTRY_STORAGE_KEY}
          validate={(value) => value === DEFAULT_COUNTRY || objectHasKey(data, value)}
          onChange={(value) => {
            setCountry(!value || value === DEFAULT_COUNTRY ? DEFAULT_COUNTRY : data[value].country);
            setRegion(DEFAULT_REGION);
          }}
        >
          <option value={DEFAULT_COUNTRY}>{<Text label="sections.country_latest.select_country.default_option"/>}</option>
          {Object.keys(data)
            .sort((a, b) => data[a].country.name > data[b].country.name ? 1 : -1)
            .map((key) => <option value={key}>{data[key].country.name}</option>)}
        </SmartSelect>
      </p>}
      {data && country && country !== DEFAULT_COUNTRY && <VirusData
        total={country.population}
        confirmed={data[country.code].data.confirmed}
        deaths={data[country.code].data.deaths}
        // recovered={data[country.code].data.recovered}
      />}
    </>}
    data={data}
    error={error}
    loading={loading}
  />;
};
