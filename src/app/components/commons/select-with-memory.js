import * as utils from '../../utils';

export const addMemoryToSelect = (
  select,
  defaultValue,
  queryStringKey,
  storageKey,
  validate,
  onChange,
) => {
  let currentValue = (() => {
    if (queryStringKey) {
      const valueFromQueryString = utils.getFromQueryString(queryStringKey)
  
      if (validate(valueFromQueryString)) {
        return valueFromQueryString;
      }
    }
  
    if (storageKey) {
      const valueFromStorage = utils.getFromStorage(storageKey);
  
      if (validate(valueFromStorage)) {
        return valueFromStorage;
      }
    }
  
    return defaultValue;
  })();
  
  const handleOnChange = (event) => {
    const targetValue = event.target.value;
    validate(targetValue) ? set(targetValue) : utils.setElementValue(select, currentValue);
  };

  const set = (value) => {
    currentValue = value;
    queryStringKey && utils.setInQueryString(queryStringKey, currentValue);
    storageKey && utils.setInStorage(storageKey, currentValue);
    onChange(currentValue);
  }

  const reset = () => {
    utils.setElementValue(select, currentValue);
    set(currentValue);
  };

  const event = 'change';
  utils.removeElementEventListener(select, event, handleOnChange);
  utils.addElementEventListener(select, event, handleOnChange);

  reset();
  
  return {
    set,
    reset,
  };
};
