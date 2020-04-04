import { h, createContext } from 'preact';
import { useEffect, useState, useContext } from 'preact/hooks';

import { useFetch } from 'commons/hooks';
import { DEFAULT_LOCALE, ASSETS_BASE_URL } from 'commons/constants';

const LabelsContext = createContext();

export const LabelsProvider = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  const { data, fetch } = useFetch(ASSETS_BASE_URL);
  useEffect(() => fetch(`${locale}.json`), [locale]);

  return (
    <LabelsContext.Provider value={{ labels: data, locale, setLocale }}>
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabels = () => useContext(LabelsContext);
