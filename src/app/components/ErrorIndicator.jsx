import { h } from 'preact';
import { Text } from './Text.jsx';

export const ErrorIndicator = ({ message }) => <div>
  <h3>🤖 <Text label="common.error.header"/>!</h3>
  <p>{message || <Text label="common.error.messages.default"/>}</p>
</div>;
