import { h, Fragment } from 'preact';

import { Background } from 'components/Background';
import { Main } from 'components/Main';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

import { GlobalVirusDataSection } from 'components/GlobalVirusDataSection';
import { RegionalVirusDataSection } from 'components/RegionalVirusDataSection';
import { AboutSection } from 'components/AboutSection';

import { SWPostMessageProvider } from './SWPostMessageProvider';
import { LabelsProvider } from './LabelsProvider';

import './App.css';

export const App = () =>
  <>
    <Background/>
    <LabelsProvider>
      <Header/>
      <Main>
        <SWPostMessageProvider>
          <GlobalVirusDataSection/>
          <RegionalVirusDataSection/>
        </SWPostMessageProvider>
        <AboutSection/>
      </Main>
      <Footer/>
    </LabelsProvider>
  </>;
