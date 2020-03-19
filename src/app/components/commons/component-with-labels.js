import * as utils from '../../utils';
import * as events from '../../events';

export const addLabelsToComponent = (renderLabels) => utils.subscribe(
  events.FETCH_LABELS_SUCCESS,
  (event) => renderLabels(event.payload),
);
