import { h } from 'preact';
import { Text } from 'components/Text';

import './ErrorIndicator.css';

export const ErrorIndicator = ({ message }) => <error>
  <h3>🤖 <Text label="common.error.header"/>!</h3>
  <p><Text label="common.error.message"/></p>
  {message && <small>{`${message}`}</small>}
</error>;
