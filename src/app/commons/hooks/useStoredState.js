import { useState } from 'preact/hooks';

export const useStoredState = (
  defaultValue,
  storageKey = '',
  validate = () => true,
  merged = false,
) => {
  const [stateValue, setStateValue] = useState(defaultValue);

  const hasStorageKey = typeof storageKey === 'string' && storageKey.length > 0;
  const queryStringKey = storageKey.toLowerCase();
  const localStorageKey = storageKey.toUpperCase();
  
  const setValue = (value) => {
    const newValue = merged ? Object.assign({}, stateValue, value) : value;

    if (validate(newValue)) {
      setStateValue(newValue);

      if (hasStorageKey) {
        setInQueryString(queryStringKey, newValue);
        setInLocalStorage(localStorageKey, newValue);
      }
    }
  };

  const setDefaultValue = () => {
    if (hasStorageKey) {
      let value;

      const valueFromLocalStorage = getFromLocalStorage(localStorageKey);
      if (validate(valueFromLocalStorage)) {
        value = valueFromLocalStorage;
      }

      const valueFromQueryString = getFromQueryString(queryStringKey);
      if (validate(valueFromQueryString)) {
        value = valueFromQueryString;
      }

      if (value) {
        setValue(value);
      }
    }
  };

  return [stateValue, setValue, setDefaultValue];
};

const getQueryString = () => new URLSearchParams(new URL(window.location.href).search);
const setQueryString = (queryString) => {
  const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString.toString()}`;
  window.history.pushState({ path: url }, '', url);
};

const getFromQueryString = (key) => {
  const value = getQueryString().get(key);
  try {
    return JSON.parse(value);
  } catch(error) {
    return value;
  }
};
const setInQueryString = (key, value) => {
  const queryString = getQueryString();
  queryString.set(key, JSON.stringify(value));
  setQueryString(queryString);
};
const resetInQueryString = (key) => {
  const queryString = getQueryString();
  queryString.delete(key);
  setQueryString(queryString);
};

const getFromLocalStorage = (key) => {
  const value = window.localStorage.getItem(key);

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};
const setInLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));
const resetInLocalStorage = (key) => window.localStorage.removeItem(key);
