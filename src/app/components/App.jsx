import { h, Fragment } from 'preact';

import { Background } from './Background.jsx';
import { Main } from './Main.jsx';

import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

import { LatestGlobalVirusDataSection } from './sections/data/LatestGlobalVirusDataSection.jsx';
import { LatestCountryVirusDataSection } from './sections/data/LatestCountryVirusDataSection.jsx';
import { HistoricalCountryVirusDataSection } from './sections/data/HistoricalCountryVirusDataSection.jsx';
import { AboutSection } from './sections/AboutSection.jsx';

import { LabelsProvider } from '../providers/LabelsProvider.jsx';
import { LatestGlobalVirusDataProvider } from '../providers/data/LatestGlobalVirusDataProvider.jsx';
import { LatestCountryVirusDataProvider } from '../providers/data/LatestCountryVirusDataProvider.jsx';
import { HistoricalCountryVirusDataProvider } from '../providers/data/HistoricalCountryVirusDataProvider.jsx';

import './App.css';

export const App = () =>
  <>
    <Background/>
    <LabelsProvider>
      <Header/>
      <Main>
        <LatestGlobalVirusDataProvider>
          <LatestGlobalVirusDataSection/>
        </LatestGlobalVirusDataProvider>
        <LatestCountryVirusDataProvider>
          <LatestCountryVirusDataSection/>
          <HistoricalCountryVirusDataProvider>
            <HistoricalCountryVirusDataSection/>
          </HistoricalCountryVirusDataProvider>
        </LatestCountryVirusDataProvider>
        <AboutSection/>
      </Main>
      <Footer/>
    </LabelsProvider>
  </>;

// const renderDetailedCountryVirusData = (labels, population, country) =>
//   import('./sections/virusData/DetailedCountryVirusData.jsx')
//     .then(({ default: DetailedCountryVirusData }) =>
//       <DetailedCountryVirusData labels={labels} population={population} country={country}/>);
