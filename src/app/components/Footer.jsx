import { h } from 'preact';
import { Text } from './Text.jsx';

import './Footer.css';

export const Footer = () =>
  <footer>
    <div class="wrapper">
      <p><Text label="footer" html={true}/></p>
    </div>
  </footer>;
