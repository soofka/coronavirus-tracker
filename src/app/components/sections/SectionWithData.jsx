import { h, Fragment } from 'preact';

import { Section } from './Section.jsx';
import { LoadingIndicator } from '../LoadingIndicator.jsx';
import { ErrorIndicator } from '../ErrorIndicator.jsx';

export const SectionWithData = ({ header, content, data, error, loading }) =>
  (data || error || loading) && <Section
      header={header}
      content={<>
        {loading ? <LoadingIndicator/> : !data && <ErrorIndicator message={error}/>}
        {content}
      </>}
    />;
