import { h, createContext } from 'preact';
import { useEffect, useContext } from 'preact/hooks';

import { useFetch, useStoredState } from 'commons/hooks';
import { DEFAULT_LOCALE, LOCALES, ASSETS_BASE_URL } from 'commons/constants';

const LabelsContext = createContext();

export const LabelsProvider = ({ children }) => {
  const [locale, setLocale, setDefaultLocale] = useStoredState(
    DEFAULT_LOCALE,
    'locale',
    (value) => Object.values(LOCALES).includes(value),
  );
  useEffect(() => setDefaultLocale(), []);

  const { data, fetch } = useFetch(ASSETS_BASE_URL);
  useEffect(() => fetch(`${locale}.json`), [locale]);

  return (
    <LabelsContext.Provider value={{ labels: data, locale, setLocale }}>
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabels = () => useContext(LabelsContext);
