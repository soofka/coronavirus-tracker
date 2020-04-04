import { h, Fragment } from 'preact';

import { Text } from 'components/Text';
import { DaysAgoText } from 'components/DaysAgoText';
import { isNumber, normalizeNumber, normalizeDateTime } from 'commons/utils';

import './VirusData.css';

const DECIMAL_PLACES = 4;

export const VirusData = ({ lastUpdated, total, confirmed, deaths/*, recovered*/ }) =>
  <>
    <div class="virus-data">
      {(!!confirmed || confirmed === 0) && <div>
        <h2>
          <span class="virus">{normalizeNumber(confirmed)}</span>
          &nbsp;
          <Text label="sections.data.confirmed"/>
        </h2>
        {(!!total || total === 0) && <p>
          <span class="virus">{roundToDecimalPlaces(confirmed * 100 / total)}%</span>
          &nbsp;
          <Text label="sections.data.infection_rate"/>
        </p>}
      </div>}
      {(!!deaths || deaths === 0) && <div>
        <h2>
          <span class="virus">{normalizeNumber(deaths)}</span>
          &nbsp;
          <Text label="sections.data.deaths"/>
        </h2>
        {(!!confirmed || confirmed === 0) && <p>
          <span class="virus">{roundToDecimalPlaces(deaths * 100 / confirmed)}%</span>
          &nbsp;
          <Text label="sections.data.mortality_rate"/>
        </p>}
      </div>}
      {/* {(!!recovered || recovered === 0) && <div>
        <h2>
          <span class="virus">{normalizeNumber(recovered)}</span>
          &nbsp;
          <Text label="sections.data.recovered"/>
        </h2>
        {(!!confirmed || confirmed === 0) && <p>
          <span class="virus">{roundToDecimalPlaces(recovered * 100 / confirmed)}%</span>
          &nbsp;
          <Text label="sections.data.recovery_rate"/>
        </p>}
      </div>} */}
    </div>
    {lastUpdated && <p><small>
      <Text label="sections.data.last_updated"/>:&nbsp;
      <DaysAgoText date={lastUpdated}/>&nbsp;
      ({normalizeDateTime(lastUpdated)})
    </small></p>}
  </>;

const roundToDecimalPlaces = (number, decimalPlaces = DECIMAL_PLACES) => {
  let parsedNumber = parseFloat(number, 10);
  if (!isNumber(parsedNumber)) {
    parsedNumber = 0;
  }

  let roundedNumber = `${Math.round(parsedNumber * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)}`;

  if (roundedNumber.indexOf('.') === -1) {
    roundedNumber += '.';
  }

  while (roundedNumber.split('.')[1].length < decimalPlaces) {
    roundedNumber += '0';
  }

  return roundedNumber;
};
