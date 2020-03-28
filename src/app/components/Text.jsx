import { h } from 'preact';
import { LabelsProvider, useLabels } from '../providers/LabelsProvider.jsx';
import { isObject } from '../commons/utils';

const DEFAULT_LABEL = 'derp';

export const Text = ({ label, values, html }) => {
  let content = DEFAULT_LABEL;

  if (label) {
    content = label;
    const { labels } = useLabels();

    if (labels) {
      const contentTransformed = findInObject(labels, label.split('.'));

      if (contentTransformed) {
        content = values ? replaceInText(contentTransformed, values) : contentTransformed;
      }
    }
  }

  return html ? <span dangerouslySetInnerHTML={{ __html: content }}/> : <span>{content}</span>;
};

const findInObject = (object, keyArray) => {
  const [currentKey, ...restOfKeyArray] = keyArray;
  const value = object[currentKey];
  return restOfKeyArray.length > 0 && isObject(value)
    ? findInObject(value, restOfKeyArray)
    : value;
};

const replaceInText = (text, values) => {
  let textTransformed = text;

  Object.keys(values).forEach((key) => {
    textTransformed = textTransformed.replace(`{${key}}`, values[key]);
  });

  return textTransformed;
}
