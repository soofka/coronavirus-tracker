import { h } from 'preact';
import { Text } from 'components/Text';

import './Footer.css';

export const Footer = () =>
  <footer>
    <div class="wrapper">
      <p><small><Text label="footer" html={true}/></small></p>
    </div>
  </footer>;
