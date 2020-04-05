import { h } from 'preact';
import { Text } from 'components/Text';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const DaysAgoText = ({ date }) => {
  const daysAgo = Math.round((new Date(new Date().toDateString()) - new Date(new Date(date).toDateString())) / DAY_IN_MS);
  return daysAgo <= 0
    ? <Text label="sections.regional.today"/>
    : (daysAgo === 1
      ? <Text label="sections.regional.yesterday"/>
      : <Text label="sections.regional.days_ago" values={{ days: daysAgo }}/>);
};
