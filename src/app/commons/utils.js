export const isObject = (value) => typeof value === 'object' && value !== null;
export const isNonEmptyObject = (value) => isObject(value) && Object.keys(value).length > 0;
export const objectHasKey = (object, key) => object.hasOwnProperty(key);

export const isString = (value) => typeof value === 'string';
export const isNonEmptyString = (value) => isString(value) && value.length > 0;

export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) => isArray(value) && value.length > 0;

export const isNumber = (value) => !isNaN(value);

export const normalizeNumber = (number) => new Number(number).toLocaleString();
export const normalizeDate = (date) => new Date(date).toLocaleDateString();
export const normalizeDateTime = (date) => new Date(date).toLocaleString();