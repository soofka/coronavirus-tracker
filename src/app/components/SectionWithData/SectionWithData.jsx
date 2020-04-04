import { h, Fragment } from 'preact';

import { Section } from 'components/Section';
import { LoadingIndicator } from 'components/LoadingIndicator';
import { ErrorIndicator } from 'components/ErrorIndicator';

export const SectionWithData = ({ header, content, data, error, loading }) =>
  (data || error || loading) && <Section
      header={header}
      content={<>
        {loading ? <LoadingIndicator/> : !data && <ErrorIndicator message={error}/>}
        {content}
      </>}
    />;
