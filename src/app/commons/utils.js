export const isString = (value) => typeof value === 'string';
export const isNonEmptyString = (value) => isString(value) && value.length > 0;

export const isNumber = (value) => (!!value || value === 0) && !isArray(value) && !isNaN(value);

export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) => isArray(value) && value.length > 0;

export const isObject = (value) => typeof value === 'object' && !isArray(value) && value !== null
export const isNonEmptyObject = (value) => isObject(value) && Object.keys(value).length > 0;
export const objectHasKey = (object, key) => isObject(object) && object.hasOwnProperty(key);

export const normalizeNumber = (number) => isNumber(number) ? new Number(number).toLocaleString() : number;
export const normalizeDate = (date) => new Date(date).toLocaleDateString();
export const normalizeDateTime = (date) => new Date(date).toLocaleString();