import { h, Fragment } from 'preact';

import { Section } from 'components/Section';
import { Text } from 'components/Text';

export const AboutSection = () => <Section
  content={<>
    <h3><Text label="sections.about.data_source.header"/></h3>
    <p><Text label="sections.about.data_source.content" html={true}/></p>
    <h3><Text label="sections.about.contribution.header"/></h3>
    <p><Text label="sections.about.contribution.content" html={true}/></p>
  </>}
/>;
