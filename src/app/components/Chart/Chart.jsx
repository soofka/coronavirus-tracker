import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { useResize } from 'commons/hooks';

import { Text } from 'components/Text';

import './Chart.css';

const RECT_MARGIN = 4;
const RECT_MIN_WIDTH = 4;

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

  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const datesInDateRange = dateRange === DATE_RANGES.SINCE_FIRST_CASE
    ? [...dates]
    : [...dates].splice(0, dateRange);

  const rectWidth = Math.floor(chartWidth / datesInDateRange.length);
  const rectFillWidth = rectWidth > RECT_MARGIN ? rectWidth - RECT_MARGIN : RECT_MIN_WIDTH;

  const maxValue = Math.max(
    ...Object.values(confirmed)
      .concat(Object.values(deaths))
      // .concat(Object.values(recovered))
  );
  
  return (<>
    {/* <h4><Text label="sections.chart.header"/></h4> */}
    <svg ref={chart} className="chart">
      {datesInDateRange.reverse().map((date, index) => {
        const isCurrentDate = currentDate === date;
        const confirmedBarHeight = Math.ceil((confirmed[date] * chartHeight) / maxValue);
        const deathsBarHeight = Math.ceil((deaths[date] * chartHeight) / maxValue);

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
    <p className="chart-controls">
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
  </>);
};
