import * as utils from '../utils';
import * as events from '../events';
import { fetchLabels } from '../services/labels';
import { addLabelsToComponent } from './commons/component-with-labels';
import { addMemoryToSelect } from './commons/select-with-memory';

const LOCALE_STORAGE_KEY = 'LOCALE';
const LOCALE_QUERY_STRING_KEY = 'locale';

const LOCALES = {
  en_EN: 'English',
  pl_PL: 'Polski',
};

const DEFAULT_LOCALE = 'en_EN';

export const header = () => {
  let deferredInstallPrompt = undefined;

  const elements = {
    container: utils.getElement('.menu'),
    languageSelect: utils.getElement('.menu--language-select'),
    install: {
      label: utils.getElement('.menu--install-button-label'),
      button: utils.getElement('.menu--install-button'),
    },
    refresh: {
      label: utils.getElement('.menu--refresh-button-label'),
      button: utils.getElement('.menu--refresh-button'),
    },
  };

  Object.keys(LOCALES).forEach(
    (locale) => utils.append(elements.languageSelect, utils.createOption(LOCALES[locale], locale))
  );

  addLabelsToComponent(
    ({ menu: { installButton, refreshButton} }) => {
      utils.setElementText(elements.install.label, installButton || 'Install');
      utils.setElementText(elements.refresh.label, refreshButton || 'Refresh');
    },
  );

  addMemoryToSelect(
    elements.languageSelect,
    DEFAULT_LOCALE,
    LOCALE_QUERY_STRING_KEY,
    LOCALE_STORAGE_KEY,
    (locale) => Object.keys(LOCALES).includes(locale),
    (locale) => fetchLabels(locale),
  );

  const install = () => {
    deferredInstallPrompt.prompt();
    utils.hide(elements.install.button);
  
    deferredInstallPrompt.userChoice
      .then((choice) => {
        utils.log(`User ${choice.outcome} the A2HS prompt`, choice);
        deferredInstallPrompt = null;
      });
  };

  const refresh = () => {
    utils.disable(elements.refresh.button);
    utils.publish([events.FETCH_GLOBAL_DATA, events.FETCH_PER_COUNTRY_DATA]);
  };

  utils.addEventListener('beforeinstallprompt', (event) => {
    deferredInstallPrompt = event;
    utils.show(elements.install.button);
  });
  utils.addEventListener('appinstalled', (event) => utils.log('COVID-19 Tracker was installed.', event));

  utils.addElementEventListener(elements.install.button, 'click', () => install());
  utils.addElementEventListener(elements.refresh.button, 'click', () => refresh());

  utils.subscribe(events.FETCH_LABELS, () => utils.disable(elements.languageSelect));
  utils.subscribe(events.FETCH_LABELS_FINISHED, () => utils.enable(elements.languageSelect));

  utils.subscribe([
    events.FETCH_GLOBAL_DATA_FINISHED,
    events.FETCH_PER_COUNTRY_DATA_FINISHED
  ], () => utils.enable(elements.refresh.button));
};
