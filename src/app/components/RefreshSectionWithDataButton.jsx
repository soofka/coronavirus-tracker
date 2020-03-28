import { h } from 'preact';
import { Text } from './Text.jsx';

export const RefreshSectionWithDataButton = ({ onClick }) =>
  <button class="refresh" onClick={onClick}>🔮 <Text label="sections.data.refresh"/></button>;
