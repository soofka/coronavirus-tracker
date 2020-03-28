import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';
import { useFetch } from '../../commons/hooks';

const LATEST_COUNTRY_VIRUS_TESTS_URL = 'assets/virus-tests.json';
const LatestCountryVirusTestsDataContext = createContext();

export const LatestCountryVirusTestsDataProvider = ({ children }) => {
  const { data, fetch } = useFetch(LATEST_COUNTRY_VIRUS_TESTS_URL);
  useEffect(() => fetch(), []);

  return (
    <LatestCountryVirusTestsDataContext.Provider value={data}>
      {children}
    </LatestCountryVirusTestsDataContext.Provider>
  );
};

export const useLatestCountryVirusTestsData = () => useContext(LatestCountryVirusTestsDataContext);
