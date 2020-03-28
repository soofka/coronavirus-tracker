import { h, Fragment } from 'preact';

import { Section } from './Section.jsx';
import { LoadingIndicator } from '../LoadingIndicator.jsx';
import { RefreshSectionWithDataButton } from '../RefreshSectionWithDataButton.jsx'
import { ErrorIndicator } from '../ErrorIndicator.jsx';

export const SectionWithData = ({ header, content, data, error, loading }) =>
  <Section
    header={<h4 style={{textDecoration: 'underline'}}>{header}</h4>}
    content={<>
      {loading ? <LoadingIndicator/> : !data && <ErrorIndicator message={error}/>}
      {content}
    </>}
  />;
