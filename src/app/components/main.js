import * as utils from '../utils';
import * as events from '../events';

import { globalSection } from './sections/global';
import { perCountrySection } from './sections/per-country';
import { perCountryPerDateSection } from './sections/per-country-per-date';

const TOAST_TIMEOUT = 5000;

export const main = () => {
  const elements = {
    toast: {
      container: utils.getElement('.toasts'),
      element: utils.getElement('.toast'),
      message: utils.getElement('.toast--message'),
    },
  };

  const showToast = () => utils.show(elements.toast.container);
  const hideToast = () => utils.hide(elements.toast.container);

  const renderToast = (message) => utils.setElementText(elements.toast.message, message);

  utils.subscribe(events.SHOW_TOAST, ({ message }) => {
    if (message) {
      renderToast(message);
      showToast();
      setTimeout(TOAST_TIMEOUT, () => hideToast());
    }
  });

  globalSection();
  perCountrySection();
  perCountryPerDateSection();
};
