import { h, Fragment } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import { DATA_GRANULARITIES } from 'commons/constants';
import { useResize } from 'commons/hooks';

import { Text } from 'components/Text';

import './Chart.css';

const BAR_MIN_WIDTH = 6;
const BAR_MIN_HEIGHT = 1;
const BAR_MIN_MARGIN = 3;
const BAR_WIDTH_TO_MARGIN_RATIO = 0.7;

const CHART_CONTAINER_PADDING = 4;
const CHART_MARGIN_TOP = 20;

const DEFAULT_DISPLAY = {
  confirmed: true,
  deaths: true,
  // recovered: true,
};

const DISPLAY_MODES = {
  NEW_CASES: 'NEW_CASES',
  ALL_CASES: 'ALL_CASES',
};

const DEFAULT_DISPLAY_MODE = DISPLAY_MODES.ALL_CASES;

const DATE_RANGES = {
  LAST_14_DAYS: 14,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
  SINCE_FIRST_CASE: -1,
};

const DEFAULT_DATE_RANGE = DATE_RANGES.LAST_30_DAYS;

export const Chart = ({
  granularity,
  dates,
  currentDate,
  confirmed,
  deaths,
  // recovered,
}) => {
  const chartContainer = useRef(null);
  const {
    width: chartContainerWidth,
    height: chartContainerHeight,
  } = useResize(chartContainer);

  const [showOptions, setShowOptions] = useState(false);
  const [display, setDisplay] = useState(DEFAULT_DISPLAY);
  const [displayMode, setDisplayMode] = useState(DEFAULT_DISPLAY_MODE);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  
  useEffect(() => {
    if (granularity !== DATA_GRANULARITIES.DAILY) {
      setDateRange(DATE_RANGES.SINCE_FIRST_CASE);
    }
  }, [granularity]);

  const datesInDateRange = dateRange === DATE_RANGES.SINCE_FIRST_CASE
    ? [...dates].reverse()
    : [...dates].splice(0, dateRange).reverse();

  const valuesInRange = [];
  const confirmedParsed = parseData(confirmed, datesInDateRange, displayMode);
  const deathsParsed = parseData(deaths, datesInDateRange, displayMode);
  // const recoveredParsed = parseData(recovered, datesInDateRange, displayMode);

  if (display.confirmed) {
    valuesInRange.push(...Object.values(confirmedParsed));
  }
  if (display.deaths) {
    valuesInRange.push(...Object.values(deathsParsed));
  }
  // if (display.recovered) {
  //   valuesInRange.push(...Object.values(recoveredParsed));
  // }
  
  const maxValue = Math.max(...valuesInRange);
  const rectCount = datesInDateRange.length;
  const minChartWidth = (rectCount * (BAR_MIN_WIDTH + BAR_MIN_MARGIN)) - BAR_MIN_MARGIN;

  let chartWidth = minChartWidth;
  const chartHeight = chartContainerHeight - (2 * CHART_CONTAINER_PADDING) - CHART_MARGIN_TOP;

  let rectWidth = BAR_MIN_WIDTH + BAR_MIN_MARGIN;
  let rectFillWidth = BAR_MIN_WIDTH;

  if (chartContainerWidth >= minChartWidth) {
    chartWidth = chartContainerWidth - (2 * CHART_CONTAINER_PADDING);
    rectWidth = Math.floor(chartWidth / rectCount);
    rectFillWidth = BAR_WIDTH_TO_MARGIN_RATIO * rectWidth;
  }
  
  return (<>
    <div className="chart-wrapper">
      <small className="max-value">{maxValue}</small>
      <div ref={chartContainer} style={{ padding: CHART_CONTAINER_PADDING }} className="chart-container">
        <svg width={chartWidth} className="chart">
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
              {display.confirmed && <>
                <rect
                  className={`virus-accent ${isCurrentDate ? 'current' : ''}`}
                  x={index * rectWidth}
                  y={chartHeight - confirmedBarHeight + CHART_MARGIN_TOP}
                  width={rectFillWidth}
                  height={confirmedBarHeight}
                />
                <text
                  x={index * rectWidth}
                  y={chartHeight - confirmedBarHeight + CHART_MARGIN_TOP - 5}
                >{confirmedParsed[date]}</text>
              </>}
              {display.deaths && <>
                <rect
                  className={`virus ${isCurrentDate ? 'current' : ''}`}
                  x={index * rectWidth}
                  y={chartHeight - deathsBarHeight + CHART_MARGIN_TOP}
                  width={rectFillWidth}
                  height={deathsBarHeight}
                />
                <text
                  x={index * rectWidth}
                  y={chartHeight - deathsBarHeight + CHART_MARGIN_TOP - 5}
                >{deathsParsed[date]}</text>
              </>}
            </>);
          })}
          <rect
            className="max-value-line"
            x="0"
            y={CHART_MARGIN_TOP}
            width={chartWidth}
            height="1"
          />
        </svg>
      </div>
    </div>
    <div className="chart-controls">
      <p>
        <button
          className={showOptions ? 'active' : ''}
          onClick={() => setShowOptions(!showOptions)}
        >
          <Text label="sections.chart.controls.header"/>
        </button>
      </p>
      {showOptions && <>
        <p>
          <Text label="sections.chart.controls.display.label"/>:&nbsp;
          <button
            className={display.confirmed ? 'active' : ''}
            onClick={() => (display.confirmed && !display.deaths)
              ? setDisplay({ confirmed: true, deaths: true })
              : setDisplay({ ...display, confirmed: !display.confirmed })
            }
          >
            <svg height="16" width="16" style={{ marginRight: '8px' }}>
              <circle cx="8" cy="8" r="8" class="virus-accent" />
            </svg>
            <Text label="sections.data.confirmed"/>
          </button>
          <button
            className={display.deaths ? 'active' : ''}
            onClick={() => (!display.confirmed && display.deaths)
              ? setDisplay({ confirmed: true, deaths: true })
              : setDisplay({ ...display, deaths: !display.deaths })
            }
          >
            <svg height="16" width="16" style={{ marginRight: '8px' }}>
              <circle cx="8" cy="8" r="8" class="virus" />
            </svg>
            <Text label="sections.data.deaths"/>
          </button>
        </p>
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
        {granularity === DATA_GRANULARITIES.DAILY && <p>
          <Text label="sections.chart.controls.date_ranges.label"/>:&nbsp;
          <button
            className={dateRange === DATE_RANGES.LAST_14_DAYS ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.LAST_14_DAYS)}
          >
            <Text label="sections.chart.controls.date_ranges.last_14_days"/>
          </button>
          <button
            className={dateRange === DATE_RANGES.LAST_30_DAYS ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.LAST_30_DAYS)}
          >
            <Text label="sections.chart.controls.date_ranges.last_30_days"/>
          </button>
          <button
            className={dateRange === DATE_RANGES.LAST_90_DAYS ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.LAST_90_DAYS)}
          >
            <Text label="sections.chart.controls.date_ranges.last_90_days"/>
          </button>
          <button
            className={dateRange === DATE_RANGES.SINCE_FIRST_CASE ? 'active' : ''}
            onClick={() => setDateRange(DATE_RANGES.SINCE_FIRST_CASE)}
          >
            <Text label="sections.chart.controls.date_ranges.since_first_case"/>
          </button>
        </p>}
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
