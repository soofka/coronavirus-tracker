import { h } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';

import { useLatestGlobalVirusData } from '../../../providers/data/LatestGlobalVirusDataProvider.jsx';

const TOTAL_WORLD_POPULATION = 7700000000;

export const LatestGlobalVirusDataSection = () => {
  const {
    data,
    error,
    loading,
  } = useLatestGlobalVirusData();

  return <SectionWithData
    header={<Text label="sections.global_latest.header"/>}
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
