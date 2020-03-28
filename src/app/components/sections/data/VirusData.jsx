import { h, Fragment } from 'preact';
import { Text } from '../../Text.jsx';
import { roundToDecimalPlaces } from '../../../commons/utils';

import './VirusData.css';

const DECIMAL_PLACES = 4;

export const VirusData = ({ total, confirmed, deaths, recovered }) =>
  <div class="virus-data">
    {(!!confirmed || confirmed === 0) && <>
      <h2>
        <span class="virus">{confirmed}</span>
        &nbsp;
        <Text label="sections.data.confirmed"/>
      </h2>
      {(!!total || total === 0) && <p>
        <span class="virus">{roundToDecimalPlaces(confirmed * 100 / total, DECIMAL_PLACES)}%</span>
        &nbsp;
        <Text label="sections.data.infection_rate"/>
      </p>}
    </>}
    {(!!deaths || deaths === 0) && <>
      <h2>
        <span class="virus">{deaths}</span>
        &nbsp;
        <Text label="sections.data.deaths"/>
      </h2>
      {(!!confirmed || confirmed === 0) && <p>
        <span class="virus">{roundToDecimalPlaces(deaths * 100 / confirmed, DECIMAL_PLACES)}%</span>
        &nbsp;
        <Text label="sections.data.mortality_rate"/>
      </p>}
    </>}
    {(!!recovered || recovered === 0) && <>
      <h2>
        <span class="virus">{recovered}</span>
        &nbsp;
        <Text label="sections.data.recovered"/>
      </h2>
      {(!!confirmed || confirmed === 0) && <p>
        <span class="virus">{roundToDecimalPlaces(recovered * 100 / confirmed, DECIMAL_PLACES)}%</span>
        &nbsp;
        <Text label="sections.data.recovery_rate"/>
      </p>}
    </>}
  </div>;
