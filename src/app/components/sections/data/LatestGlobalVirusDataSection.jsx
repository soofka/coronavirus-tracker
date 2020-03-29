import { h } from 'preact';

import { Text } from '../../Text.jsx';
import { SectionWithData } from '../SectionWithData.jsx';
import { VirusData } from './VirusData.jsx';

import { usePopulationsData } from '../../../providers/data/PopulationsDataProvider.jsx';
import { useLatestGlobalVirusData } from '../../../providers/data/LatestGlobalVirusDataProvider.jsx';

export const LatestGlobalVirusDataSection = () => {
  const populations = usePopulationsData();
  const {
    data,
    error,
    loading,
  } = useLatestGlobalVirusData();

  return <SectionWithData
    header={<Text label="sections.global_latest.header"/>}
    content={data && <VirusData
      total={populations && populations.total}
      confirmed={data.confirmed}
      deaths={data.deaths}
      // recovered={data.recovered}
    />}
    data={data}
    error={error}
    loading={loading}
  />;
};
