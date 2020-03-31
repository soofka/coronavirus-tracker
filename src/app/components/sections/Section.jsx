import { h } from 'preact';
import './Section.css';

export const Section = ({ header, content }) =>
  <section>
    {header && <h4 style={{textDecoration: 'underline'}}>{header}</h4>}
    {content && content}
  </section>;
