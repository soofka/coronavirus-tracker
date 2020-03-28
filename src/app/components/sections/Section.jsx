import { h } from 'preact';
import './Section.css';

export const Section = ({ header, content }) =>
  <section>
    {header}
    {content}
  </section>;
