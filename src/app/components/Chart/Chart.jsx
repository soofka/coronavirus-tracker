import { h, Fragment } from 'preact';
import { useRef } from 'preact/hooks';

import { useResize } from 'commons/hooks';

import './Chart.css';

const CHART_HEIGHT = 300;
const RECT_MARGIN = 4;
const RECT_MIN_WIDTH = 4;

export const Chart = ({
  dates,
  currentDate,
  confirmed,
  deaths,
  // recovered,
}) => {
  const chart = useRef(null);
  const { width: chartWidth } = useResize(chart);

  const rectWidth = Math.floor(chartWidth / dates.length);
  const rectFillWidth = rectWidth > RECT_MARGIN ? rectWidth - RECT_MARGIN : RECT_MIN_WIDTH;

  const maxValue = Math.max(
    ...Object.values(confirmed)
      .concat(Object.values(deaths))
      // .concat(Object.values(recovered))
  );

  return (
    <svg ref={chart} className="chart" width="100%" height={CHART_HEIGHT}>
      {[...dates].reverse().map((date, index) => {
        const isCurrentDate = currentDate === date;
        const confirmedBarHeight = Math.ceil((confirmed[date] * CHART_HEIGHT) / maxValue);
        const deathsBarHeight = Math.ceil((deaths[date] * CHART_HEIGHT) / maxValue);

        return (<>
          <rect
            className={`virus-accent ${isCurrentDate ? 'current' : ''}`}
            x={index * rectWidth}
            y={CHART_HEIGHT - confirmedBarHeight}
            width={rectFillWidth}
            height={confirmedBarHeight}
          />
          <rect
            className={`virus ${isCurrentDate ? 'current' : ''}`}
            x={index * rectWidth}
            y={CHART_HEIGHT - deathsBarHeight}
            width={rectFillWidth}
            height={deathsBarHeight}
          />
        </>);
      })}
    </svg>
  );
};
