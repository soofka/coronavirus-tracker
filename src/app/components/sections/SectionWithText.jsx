import { h } from 'preact';
import { Section } from './Section.jsx';

export const SectionWithText = ({ header, text }) =>
  <Section header={<h3>{header}</h3>} content={text}/>;
