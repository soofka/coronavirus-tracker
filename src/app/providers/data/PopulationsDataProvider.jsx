import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';
import { useFetch } from '../../commons/hooks';

const POPULATIONS_URL = 'data/populations.json';
const PopulationsDataContext = createContext();

export const PopulationsDataProvider = ({ children }) => {
  const { data, fetch } = useFetch(POPULATIONS_URL);
  useEffect(() => fetch(), []);

  return (
    <PopulationsDataContext.Provider value={data}>
      {children}
    </PopulationsDataContext.Provider>
  );
};

export const usePopulationsData = () => useContext(PopulationsDataContext);
