import { h, createContext } from 'preact';
import { useEffect, useState, useContext } from 'preact/hooks';

import { useFetch } from '../commons/hooks';
import { DEFAULT_LOCALE } from '../commons/constants';

const LABELS_BASE_URL = 'labels/';
const LabelsContext = createContext();

export const LabelsProvider = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  const { data, fetch } = useFetch(LABELS_BASE_URL);
  useEffect(() => fetch(`${locale}.json`), [locale]);

  return (
    <LabelsContext.Provider value={{ labels: data, locale, setLocale }}>
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabels = () => useContext(LabelsContext);
