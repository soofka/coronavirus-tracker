const commons = require('./utils');
const constants = require('./constants');

const sw = require('./sw');
// const labels = 
const menu = require('./components/header');

const app = {

  state: {},
  labels: {},
  elements: {},
  deferredInstallPrompt: null,

  init() {
    ui.init();
    sw.init();
    this.initElements();
    this.initLabels();
    this.initContrySelect();
    this.initEventListeners();

    this.initSw();

    this.refresh();
  },

  initSw() {
    this.initSwCore();
    this.initSwInstall();
  },

  initSwCore() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then((reg) => {
            console.log('Service worker registered.', reg);
          });
      });
    }
  },

  initSwInstall() {
    window.addEventListener('beforeinstallprompt', (evt) => {
      this.deferredInstallPrompt = evt;
      commons.show(this.elements.controls.installButton);
    });
    
    window.addEventListener('appinstalled', (evt) =>
      console.log('COVID-19 Tracker was installed.', evt),
    );
  },

  initElements() {
    this.elements = {
      controls: {
        container: document.querySelector('.controls'),
        languageSelect: document.querySelector('.controls--language'),
        install: {
          label: document.querySelector('.controls--install-label'),
          button: document.querySelector('.controls--install-button'),
        },
        refresh: {
          label: document.querySelector('.controls--refresh-label'),
          button: document.querySelector('.controls--refresh-button'),
        },
      },
      global: {
        container: document.querySelector('.global'),
        header: document.querySelector('.global--header'),
        confirmed: {
          label: document.querySelector('.global--confirmed-label'),
          value: document.querySelector('.global--confirmed'),
        },
        deaths: {
          label: document.querySelector('.global--deaths-label'),
          value: document.querySelector('.global--deaths'),
        },
        recovered: {
          label: document.querySelector('.global--recovered-label'),
          value: document.querySelector('.global--recovered'),
        },
      },
      perCountry: {
        container: document.querySelector('.per-country'),
        dataContainer: document.querySelector('.per-country--data'),
        header: document.querySelector('.per-country--header'),
        countrySelect: document.querySelector('.per-country--country'),
        confirmed: {
          label: document.querySelector('.per-country--confirmed-label'),
          value: document.querySelector('.per-country--confirmed'),
        },
        deaths: {
          label: document.querySelector('.per-country--deaths-label'),
          value: document.querySelector('.per-country--deaths'),
        },
        recovered: {
          label: document.querySelector('.per-country--recovered-label'),
          value: document.querySelector('.per-country--recovered'),
        },
        graph: {
          label: document.querySelector('.per-country--graph-description'),
          value: document.querySelector('.per-country--graph'),
        },
        info: {
          label: document.querySelector('.per-country--info'),
          values: document.querySelector('.per-country--info-sources'),
        },
      },
      description: {
        container: document.querySelector('description'),
        label: document.querySelector('.description-label'),
      },
      loading: document.querySelector('.loading'),
      error: {
        container: document.querySelector('.error'),
        message: document.querySelector('.error--message'),
      },
    };
  },

  initLabels() {
    let locale;
    
    const queryStringLocale = getLocaleFromQueryString();
    if (queryStringLocale && this.validateLocale(queryStringLocale)) {
      locale = queryStringLocale;
    } else {
      const localStorageLocale = this.getLocale();
      if (localStorageLocale && this.validateLocale(localStorageLocale)) {
        locale = localStorageLocale;
      } else {
        locale = constants.DEFAULT_LOCALE;
      }
    }

    this.setLocale(locale);
    this.setLabels(locale);
  },

  getLocaleFromQueryString() {
    return document.location.search.substr(1).split('&').map(el => el.split('=')).filter(el => el[0] === 'language')[0][1];
  },

  validateLocale(locale) {
    return Object.keys(constants.LOCALES).indexOf(locale) !== -1;
  },

  getLocale() {
    return window.localStorage.getItem('locale');
  },

  setLocale(locale) {
    window.localStorage.setItem('locale', locale);
  },

  setLabels(locale) {
    commons.fetchFromInternet(`/labels/${locale}.json`)
      .then((data) => {
        if (data.latest && data.confirmed && data.deaths && data.recovered) {
          this.state.data = {
            global: data.latest,
            perCountry: commons.parsePerCountryData(data.confirmed, data.deaths, data.recovered),
          };
        } else {
          const error = 'Fetched corrupted data from internet';
          console.warn(error);
          this.state.error.fromCache = error;
        }
      })
      .catch((error) => this.state.error.fromInternet = error)
      .finally(() => {
        this.state.loading.fromInternet = false;
        this.render();
      });
  },

  initCountrySelect() {
  },

  initEventListeners() {
    this.elements.perCountry.countrySelect.addEventListener('change', () => {
      this.renderPerCountrySection(this.elements.perCountry.select.value);
    });

    this.elements.controls.languageSelect.addEventListener('change', () => {
      this.setLabels(this.elements.perCountry.select.value);
    });

    this.elements.controls.installButton.addEventListener('click', () => {
      this.install();
    });

    this.elements.controls.refreshButton.addEventListener('click', () => {
      this.refresh();
    });
  },

  install() {
    this.deferredInstallPrompt.prompt();
    commons.hide(this.elements.controls.installButton);
  
    this.deferredInstallPrompt.userChoice
      .then((choice) => {
        console.log(`User ${choice.outcome} the A2HS prompt`, choice);
        this.deferredInstallPrompt = null;
      });
  },

  refresh() {
    this.state = JSON.parse(JSON.stringify(constants.INITIAL_STATE));

    this.state.loading.fromCache = true;
    commons.fetchFromCache(constants.API_URL)
      .then((data) => {
        if (data.latest && data.confirmed && data.deaths && data.recovered) {
          this.state.data = {
            global: data.latest,
            perCountry: commons.parsePerCountryData(data.confirmed, data.deaths, data.recovered),
          };
        } else {
          const error = 'Fetched corrupted data from cache';
          console.warn(error);
          this.state.error.fromCache = error;
        }
      })
      .catch((error) => this.state.error.fromCache = error)
      .finally(() => {
        this.state.loading.fromCache = false;
        this.render();
      });
      
    this.state.loading.fromInternet = true;
    commons.fetchFromInternet(constants.API_URL)
      .then((data) => {
        if (data.latest && data.confirmed && data.deaths && data.recovered) {
          this.state.data = {
            global: data.latest,
            perCountry: commons.parsePerCountryData(data.confirmed, data.deaths, data.recovered),
          };
        } else {
          const error = 'Fetched corrupted data from internet';
          console.warn(error);
          this.state.error.fromCache = error;
        }
      })
      .catch((error) => this.state.error.fromInternet = error)
      .finally(() => {
        this.state.loading.fromInternet = false;
        this.render();
      });
  },

  render() {
    this.fillGlobalValues();

    const hasGlobalData = Object.keys(this.state.data.global).length > 1;
    const hasPerCountryData = Object.keys(this.state.data.perCountry).length > 1;
    const isLoading = this.state.loading.fromCache || this.state.loading.fromInternet;

    commons.hide(this.elements.loading.container);
    commons.hide(this.elements.error.container);
    commons.hide(this.elements.global.container);
    commons.hide(this.elements.perCountry.container);

    if (hasGlobalData || hasPerCountryData) {
      if (hasGlobalData) {
        commons.show(this.elements.global.container);
      }
      
      if (hasPerCountryData) {
        commons.show(this.elements.perCountry.container);
      }
    } else if (isLoading) {
      commons.show(this.elements.loading.container);
    } else {
      commons.show(this.elements.error.container);
    }

    isLoading ? commons.hide(this.elements.controls.refreshButton) : commons.show(this.elements.controls.refreshButton);
  },

  renderPerCountry(countryCode) {
    if (countryCode && this.state.data.perCountry[countryCode]) {
      this.state.currentCountryCode = countryCode;

      this.fillPerCountryValues();
      this.drawPerCountryGraph();

      commons.show(this.elements.perCountry.dataContainer);
    } else {
      commons.hide(this.elements.perCountry.dataContainer);
    }
  },
  
  fillGlobalValues() {
    if (this.state.data.global.confirmed) {
      this.elements.global.confirmed.innerText = this.state.data.global.confirmed;
    }

    if (this.state.data.global.deaths) {
      this.elements.global.deaths.innerText = this.state.data.global.deaths;
    }

    if (this.state.data.global.recovered) {
      this.elements.global.recovered.innerText = this.state.data.global.recovered;
    }

    if (this.state.data.perCountry) {
      this.elements.perCountry.select.innerHTML = '';
      commons.appendOption(this.elements.perCountry.select, 'Select country');

      Object.keys(this.state.data.perCountry).forEach((countryCode) => {
        commons.appendOption(this.elements.perCountry.select, this.state.data.perCountry[countryCode].country, countryCode);
      });
    }
  },

  fillPerCountryValues() {
    const countryData = this.state.data.perCountry[this.state.currentCountryCode];

    if (countryData.confirmed.current) {
      this.elements.perCountry.confirmed.innerText = countryData.confirmed.current;
    }

    if (countryData.deaths.current) {
      this.elements.perCountry.deaths.innerText = countryData.deaths.current;
    }

    if (countryData.recovered.current) {
      this.elements.perCountry.recovered.innerText = countryData.recovered.current;
    }

    if (constants.INFO_SOURCES[this.state.currentCountryCode]) {
      const url = constants.INFO_SOURCES[this.state.currentCountryCode];
      this.elements.perCountry.info.innerText = url;
      this.elements.perCountry.info.href = url;
    } else {
      this.elements.perCountry.info.innerText = 'unknown';
      this.elements.perCountry.info.href = '#';
    }
  },

  drawPerCountryGraph() {
    this.elements.perCountry.graph.innerText = 'DRAWN';
  }
};

module.exports = app;
