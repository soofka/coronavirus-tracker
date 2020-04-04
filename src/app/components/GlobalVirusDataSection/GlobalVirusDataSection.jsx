import { h } from 'preact';

import { SectionWithData } from 'components/SectionWithData';
import { VirusData } from 'components/VirusData';
import { Text } from 'components/Text';

import {
  GlobalVirusDataProvider,
  useGlobalVirusData,
} from './GlobalVirusDataProvider';

export const GlobalVirusDataSection = () =>
  <GlobalVirusDataProvider>
    <GlobalVirusDataSectionComponent/>
  </GlobalVirusDataProvider>;

const TOTAL_WORLD_POPULATION = 7700000000;

const GlobalVirusDataSectionComponent = () => {
  const {
    data,
    error,
    loading,
  } = useGlobalVirusData();

  return <SectionWithData
    header={<Text label="sections.global.header"/>}
    content={data && <VirusData
      total={TOTAL_WORLD_POPULATION}
      confirmed={data.confirmed}
      deaths={data.deaths}
      // recovered={data.recovered}
    />}
    data={data}
    error={error}
    loading={loading}
  />;
};
