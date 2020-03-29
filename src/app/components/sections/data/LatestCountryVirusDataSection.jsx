import { h, Fragment } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';
import { SmartSelect } from '../../SmartSelect.jsx';

import { usePopulationsData } from '../../../providers/data/PopulationsDataProvider.jsx';
import { useLatestCountryVirusTestsData } from '../../../providers/data/LatestCountryVirusTestsDataProvider.jsx';
import { useLatestCountryVirusData } from '../../../providers/data/LatestCountryVirusDataProvider.jsx';

import { DEFAULT_COUNTRY } from '../../../commons/constants';
import { objectHasKey } from '../../../commons/utils';

const COUNTRY_QUERY_STRING_KEY = 'country';
const COUNTRY_STORAGE_KEY = 'COUNTRY';

export const LatestCountryVirusDataSection = () => {
  const populations = usePopulationsData();
  const virusTests = useLatestCountryVirusTestsData();
  const {
    data,
    error,
    loading,
    country,
    setCountry,
  } = useLatestCountryVirusData();

  return <SectionWithData
    header={<Text label="sections.country_latest.header"/>}
    content={<>
      {data && <p>
        <SmartSelect
          id="select-country"
          label={<Text label="sections.country_latest.select_country"/>}
          value={(!country || country === DEFAULT_COUNTRY) ? DEFAULT_COUNTRY : country.code}
          defaultValue={DEFAULT_COUNTRY}
          queryStringKey={COUNTRY_QUERY_STRING_KEY}
          storageKey={COUNTRY_STORAGE_KEY}
          validate={
            (value) => value === DEFAULT_COUNTRY
              || (data && objectHasKey(data, value))
          }
          onChange={
            (value) => (!value || value === DEFAULT_COUNTRY)
              ? setCountry(DEFAULT_COUNTRY)
              : data && setCountry(data[value].country)
          }
        >
          <option value={DEFAULT_COUNTRY}>{<Text label="sections.country_latest.select"/>}</option>
          {Object.keys(data)
            .sort((a, b) => data[a].country.name > data[b].country.name ? 1 : -1)
            .map((key) => <option value={key}>{data[key].country.name}</option>)}
        </SmartSelect>
      </p>}
      {data && country && country !== DEFAULT_COUNTRY && <VirusData
        total={populations && populations[country.code]}
        tested={virusTests && virusTests[country.code]}
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
