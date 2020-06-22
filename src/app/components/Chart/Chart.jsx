import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { useResize } from 'commons/hooks';

import { Text } from 'components/Text';

import './Chart.css';

const BAR_MARGIN = 4;
const BAR_MIN_WIDTH = 4;
const BAR_MIN_HEIGHT = 1;

const DISPLAY_MODES = {
  NEW_CASES: 'NEW_CASES',
  ALL_CASES: 'ALL_CASES',
};

const DEFAULT_DISPLAY_MODE = DISPLAY_MODES.ALL_CASES;

const DATE_RANGES = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  SINCE_FIRST_CASE: -1,
};

const DEFAULT_DATE_RANGE = DATE_RANGES.LAST_30_DAYS;

export const Chart = ({
  dates,
  currentDate,
  confirmed,
  deaths,
  // recovered,
}) => {
  const chart = useRef(null);
  const {
    width: chartWidth,
    height: chartHeight,
  } = useResize(chart);

  const [controlsOn, setControlsOn] = useState(false);
  const [displayMode, setDisplayMode] = useState(DEFAULT_DISPLAY_MODE);

  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const datesInDateRange = dateRange === DATE_RANGES.SINCE_FIRST_CASE
    ? [...dates].reverse()
    : [...dates].splice(0, dateRange).reverse();    

  const confirmedParsed = parseData(confirmed, datesInDateRange, displayMode);
  const deathsParsed = parseData(deaths, datesInDateRange, displayMode);
  // const recoveredParsed = parseData(recovered, datesInDateRange, displayMode);

  const valuesInRange = Object.values(confirmedParsed)
    .concat(Object.values(deathsParsed));
    // .concat(Object.values(recoveredParsed));
  
  const maxValue = Math.max(...valuesInRange);
  const rectWidth = Math.floor(chartWidth / datesInDateRange.length);
  const rectFillWidth = rectWidth > BAR_MARGIN ? rectWidth - BAR_MARGIN : BAR_MIN_WIDTH;
  
  return (<>
    <svg ref={chart} className="chart">
      {datesInDateRange.map((date, index) => {
        const isCurrentDate = currentDate === date;

        let confirmedBarHeight = Math.ceil(confirmedParsed[date] * chartHeight) / maxValue;
        if (confirmedBarHeight < BAR_MIN_HEIGHT) {
          confirmedBarHeight = BAR_MIN_HEIGHT;
        }

        let deathsBarHeight = Math.ceil(deathsParsed[date] * chartHeight) / maxValue;
        if (deathsBarHeight < BAR_MIN_HEIGHT) {
          deathsBarHeight = BAR_MIN_HEIGHT;
        }

        // let recoveredBarHeight = Math.ceil(recoveredParsed[date] * chartHeight) / maxValue;
        // if (recoveredBarHeight < BAR_MIN_HEIGHT) {
        //   recoveredBarHeight = BAR_MIN_HEIGHT;
        // }

        return (<>
          <rect
            className={`virus-accent ${isCurrentDate ? 'current' : ''}`}
            x={index * rectWidth}
            y={chartHeight - confirmedBarHeight}
            width={rectFillWidth}
            height={confirmedBarHeight}
          />
          <rect
            className={`virus ${isCurrentDate ? 'current' : ''}`}
            x={index * rectWidth}
            y={chartHeight - deathsBarHeight}
            width={rectFillWidth}
            height={deathsBarHeight}
          />
        </>);
      })}
    </svg>
    <div className="chart-controls">
      <p>
        <button
          className={controlsOn ? 'active' : ''}
          onClick={() => setControlsOn(!controlsOn)}
        >
          <Text label="sections.chart.controls.header"/>
        </button>
      </p>
      {controlsOn && <>
        <p>
          <Text label="sections.chart.controls.display_modes.label"/>:&nbsp;
          <button
            className={displayMode === DISPLAY_MODES.ALL_CASES ? 'active' : ''}
            onClick={() => setDisplayMode(DISPLAY_MODES.ALL_CASES)}
          >
            <Text label="sections.chart.controls.display_modes.all_cases"/>
          </button>
          <button
            className={displayMode === DISPLAY_MODES.NEW_CASES ? 'active' : ''}
            onClick={() => setDisplayMode(DISPLAY_MODES.NEW_CASES)}
          >
            <Text label="sections.chart.controls.display_modes.new_cases"/>
          </button>
        </p>
        <p>
          <Text label="sections.chart.controls.date_ranges.label"/>:&nbsp;
          <button
            className={dateRange === DATE_RANGES.LAST_7_DAYS ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.LAST_7_DAYS)}
          >
            <Text label="sections.chart.controls.date_ranges.last_7_days"/>
          </button>
          <button
            className={dateRange === DATE_RANGES.LAST_30_DAYS ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.LAST_30_DAYS)}
          >
            <Text label="sections.chart.controls.date_ranges.last_30_days"/>
          </button>
          <button
            className={dateRange === DATE_RANGES.SINCE_FIRST_CASE ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.SINCE_FIRST_CASE)}
          >
            <Text label="sections.chart.controls.date_ranges.since_first_case"/>
          </button>
        </p>
      </>}
    </div>
  </>);
};

const parseData = (data, datesInDateRange, displayMode) => {
  const dataParsed = {};

  datesInDateRange.forEach((date) => {
    dataParsed[date] = displayMode === DISPLAY_MODES.ALL_CASES
      ? data[date].total
      : data[date].change;
  });

  return dataParsed;
};
