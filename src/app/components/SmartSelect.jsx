import { h } from 'preact';

export const SmartSelect = ({
  children,
  value,
  defaultValue,
  queryStringKey,
  storageKey,
  validate,
  onChange,
  ...rest
}) => {
  const getDefaultValue = () => {
    if (queryStringKey) {
      const valueFromQueryString = getFromQueryString(queryStringKey);
      if (validate(valueFromQueryString)) {
        return valueFromQueryString;
      }
    }

    if (storageKey) {
      const valueFromStorage = getFromStorage(storageKey);
      if (validate(valueFromStorage)) {
        return valueFromStorage;
      }
    }

    return defaultValue;
  };

  const setValue = (tempValue) => {
    if (tempValue !== value) {
      value = tempValue;
      queryStringKey && setInQueryString(queryStringKey, tempValue);
      storageKey && setInStorage(storageKey, tempValue);
      onChange && onChange(tempValue);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    const tempValue = event.target.value;
    setValue && validate(tempValue) && setValue(tempValue);
  };

  if (!value || value === defaultValue) {
    const newValue = getDefaultValue();
    if (validate(newValue)) {
      setValue(newValue);
    }
  }

  return <select value={value} onChange={handleChange} {...rest}>{children}</select>;
};

const getQueryString = () => new URLSearchParams(new URL(window.location.href).search);
const setQueryString = (queryString) => {
  const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString.toString()}`;
  window.history.pushState({ path: url }, '', url);
};

const getFromQueryString = (key) => getQueryString().get(key);
const setInQueryString = (key, value) => {
  const queryString = getQueryString();
  queryString.set(key, value);
  setQueryString(queryString);
};

const getFromStorage = (key) => window.localStorage.getItem(key);
const setInStorage = (key, value) => window.localStorage.setItem(key, value);
