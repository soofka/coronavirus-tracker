import { h } from 'preact';
import { Text } from './Text.jsx';

export const ErrorIndicator = ({ message }) => <div>
  <h3>🤖 <Text label="common.error.header"/>!</h3>
  <p><Text label="common.error.message"/></p>
  {message && <small>{`${message}`}</small>}
</div>;
