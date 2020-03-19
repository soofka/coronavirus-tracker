import * as utils from '../utils';
import * as events from '../events';

const LABELS_URL = '/labels';

export const fetchLabels = (locale) => {
  utils.publish(events.FETCH_LABELS, { locale });
  const url = `${LABELS_URL}/${locale}.json`;

  utils.fetchFromCache(url)
    .then((labels) => {
      if (!validateLabels(labels)) {
        throw `Invalid labels (locale: ${locale}, url: ${url}, labels: ${labels})`;
      }
      utils.publish(events.FETCH_LABELS_SUCCESS, labels);
    })
    .catch(() => {
      utils.fetchFromInternet(url)
        .then((labels) => {
          if (!validateLabels(labels)) {
            throw `Invalid labels (locale: ${locale}, url: ${url}, labels: ${labels})`;
          }
          utils.publish(events.FETCH_LABELS_SUCCESS, labels);
        })
        .catch((error) => utils.publish(events.FETCH_LABELS_FAILURE, utils.getError(error)))
    })
    .finally(() => utils.publish(events.FETCH_LABELS_FINISHED));
};

const validateLabels = (labels) => utils.isNonEmptyObject(labels);
