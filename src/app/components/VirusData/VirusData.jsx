import { h, Fragment } from 'preact';

import { Text } from 'components/Text';
import { isNumber, normalizeNumber } from 'commons/utils';

import './VirusData.css';

const DECIMAL_PLACES = 4;

export const VirusData = ({
  total,
  confirmed,
  confirmedChange,
  deaths,
  deathsChange,
  // recovered,
  // recoveredChange,
}) =>
  <div class="virus-data">
    {(!!confirmed || confirmed === 0) && <div>
      <h2>
        <span class="virus">{normalizeNumber(confirmed)}</span>&nbsp;
        <Text label="sections.data.confirmed"/>&nbsp;
        {(!!confirmedChange || confirmedChange === 0) && <small className="change">{getChangeText(confirmed, confirmedChange)}</small>}
      </h2>
      {(!!total || total === 0) && <>
        <p>
          <span class="virus">{roundToDecimalPlaces(confirmed * 100 / total)}%</span>&nbsp;
          <Text label="sections.data.infection_rate"/>
        </p>
        <p className="info"><small><Text label="sections.data.infection_rate_explained" html={true}/></small></p>
      </>}
    </div>}
    {(!!deaths || deaths === 0) && <div>
      <h2>
        <span class="virus">{normalizeNumber(deaths)}</span>&nbsp;
        <Text label="sections.data.deaths"/>&nbsp;
        {(!!deathsChange || deathsChange === 0) && <small className="change">{getChangeText(deaths, deathsChange)}</small>}
      </h2>
      {(!!confirmed || confirmed === 0) && <>
        <p>
          <span class="virus">{roundToDecimalPlaces(deaths * 100 / confirmed)}%</span>&nbsp;
          <Text label="sections.data.mortality_rate"/>
        </p>
        <p className="info"><small><Text label="sections.data.mortality_rate_explained" html={true}/></small></p>
      </>}
    </div>}
    {/* {(!!recovered || recovered === 0) && <div>
      <h2>
        <span class="virus">{normalizeNumber(recovered)}</span>&nbsp;
        <Text label="sections.data.recovered"/>&nbsp;
        {(!!recoveredChange || recoveredChange === 0) && <small className="change">{getChangeText(recovered, recoveredChange)}</small>}
      </h2>
      {(!!confirmed || confirmed === 0) && <>
        <p>
          <span class="virus">{roundToDecimalPlaces(recovered * 100 / confirmed)}%</span>&nbsp;
          <Text label="sections.data.recovery_rate"/>
        </p>
        <p className="info"><small><Text label="sections.data.recovery_rate_explained" html={true}/></small></p>
      </>}
    </div>} */}
  </div>;

const getChangeText = (value, valueChange) => {
  const changeIncreasing = valueChange > 0;
  const changeDecreasing = valueChange < 0;
  const relativeValueChange = roundToDecimalPlaces((valueChange * 100) / value, 2);

  const changeSign = changeIncreasing ? '+' : (changeDecreasing ? '-' : '');
  const changeArrow = changeIncreasing ? '&uarr;' : (changeDecreasing ? '&darr;' : '');
  const changeText = `${changeSign}${valueChange} (${changeSign}${relativeValueChange}%) ${changeArrow}`;

  return <span className="virus-accent" dangerouslySetInnerHTML={{ __html: changeText }}/>;
};

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
