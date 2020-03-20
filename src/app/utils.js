// console
export const log = function() { console.log(...arguments); };
export const warn = function() { console.warn(...arguments); };
export const error = function() { console.error(...arguments); };

// dom
export const show = (element) => element.classList && element.classList.remove('hidden');
export const hide = (element) => element.classList && element.classList.add('hidden');

export const enable = (element) => element.disabled = false;
export const disable = (element) => element.disabled = true;

export const getElement = (selector) => document.querySelector(selector);

export const addEventListener = (event, listener) => window.addEventListener(event, listener);
export const addElementEventListener = (element, event, listener) => element.addEventListener(event, listener);

export const removeElementEventListener = (element, event, listener) => element.removeEventListener(event, listener);

export const getElementValue = (element) => element.value;

export const setElementText = (element, text) => element.innerText = text;
export const setElementValue = (element, value) => element.value = value;

export const createOption = (optionText, optionValue = undefined) => {
  const option = document.createElement('option');
  option.appendChild(document.createTextNode(optionText));

  if (optionValue) {
    option.value = optionValue;
  }

  return option;
};

export const append = (parent, child) => parent.appendChild(child);
export const clearElement = (element) => element.innerHTML = '';

// application
export const parsePerCountryData = ({ locations }) => {
  const countryDataParsed = {};

  locations.forEach((location) => {
    if (!countryDataParsed[location.country_code]) {
      countryDataParsed[location.country_code] = {
        country: {
          id: location.id,
          code: location.country_code,
          name: location.country,
        },
        data: location.latest,
      };
    }
  });

  return countryDataParsed;
};

export const getError = (error) => ({
  message: typeof error === 'string'
    ? error
    : (isObject(error) && error.hasOwnProperty('toString')
      ? error.toString()
      : 'Error'),
});

export const validateError = (error) => isObject(error) && error.hasOwnProperty('message') && isNonEmptyString(error.message);

// pubsub
export const publish = (messages, payload = {}) => {
  const messagesArray = getMessagesArray(messages);
  log('Publish', messagesArray, payload);
  messagesArray.forEach((message) => window.dispatchEvent(new CustomEvent(message, { detail: payload })));
};

export const subscribe = (messages, callback) => {
  const messagesArray = getMessagesArray(messages);
  log('Subscribe', messagesArray, callback);
  messagesArray.forEach((message) => window.addEventListener(message, (event) => callback({ type: event.type, payload: event.detail }), false));
};

const getMessagesArray = (messages) => isArray(messages)
  ? messages
  : (typeof messages === 'string'
    ? [messages]
    : []);

// request
export const fetchFromCache = (url) => {
  if ('caches' in window) {
    return window.caches.match(url)
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
        return {};
      })
      .catch((error) => warn('Error while fetching from cache', error));
  }
  return Promise.reject('Caches not found');
};

export const fetchFromInternet = (url) => {
  if ('fetch' in window) {
    return fetch(url)
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
        return {};
      })
      .catch((error) => warn('Error while fetching from internet', error));
  }
  return Promise.reject('Fetch not found');
};

// query string
const getQueryString = () => new URLSearchParams(new URL(window.location.href).search);
const setQueryString = (queryString) => {
  const url =  `${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryString.toString()}`;
  window.history.pushState({ path: url }, '', url);
};

export const getFromQueryString = (key) => getQueryString().get(key);
export const setInQueryString = (key, value) => {
  const queryString = getQueryString();
  queryString.set(key, value);
  setQueryString(queryString);
};

// getFromQueryString: (key) => {
//   for (let [ tempKey, tempValue ] of utils.getQueryString()) {
//     if (tempKey === key) {
//       return tempValue;
//     }
//   }
//   return undefined;
// },

// setInQueryString: (key, value) => {
//   let queryStringObject = utils.getQueryString();

//   for (let index in queryStringObject) {
//     const [ tempKey ] = queryStringObject[index];
//     if (tempKey === key) {
//       queryStringObject[index] = value;
//       return utils.setQueryString(queryStringObject);
//     }
//   }

//   queryStringObject.push([ key, value ]);
//   return utils.setQueryString(queryStringObject);
// },

// getQueryString: () => document.location.search.substr(1).split('&').map((keyValue) => keyValue.split('=')),
// setQueryString: (queryStringObject) => document.location.search = `?${queryStringObject.map((keyValue) => keyValue.join('=')).join('&')}`,

// local storage
export const getFromStorage = (key) => window.localStorage.getItem(key);
export const setInStorage = (key, value) => window.localStorage.setItem(key, value);

// service worker
export const registerServiceWorker = (url) => {
  if ('serviceWorker' in navigator) {
    addEventListener('load', () => {
      navigator.serviceWorker.register(url)
        .then((reg) => log('Service worker registered.', reg))
    });
  }
};

// validators
export const isObject = (value) => typeof value === 'object' && value !== null;
export const isNonEmptyObject = (value) => isObject(value) && Object.keys(value).length > 0;
export const isString = (value) => typeof value === 'string';
export const isNonEmptyString = (value) => isString(value) && value.length > 0;
export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) => isArray(value) && value.length > 0;
