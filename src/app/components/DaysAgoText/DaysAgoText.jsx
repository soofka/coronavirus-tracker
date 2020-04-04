import { h } from 'preact';
import { Text } from 'components/Text';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const DaysAgoText = ({ date }) => {
  const thatDay = new Date(date);
  const daysAgo = (new Date(new Date().toDateString()) - thatDay) / DAY_IN_MS;
  const daysAgoRounded = daysAgo > 0 ? Math.floor(daysAgo) : Math.ceil(daysAgo);
  return daysAgoRounded === 0
    ? <Text label="sections.regional.today"/>
    : (daysAgoRounded === 1
      ? <Text label="sections.regional.yesterday"/>
      : <Text label="sections.regional.days_ago" values={{ days: daysAgoRounded }}/>);
};
