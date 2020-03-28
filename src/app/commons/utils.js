export const roundToDecimalPlaces = (number, decimalPlaces) => {
  let parsedNumber = parseFloat(number, 10);
  if (!isNumber(parsedNumber)) {
    parsedNumber = 0;
  }

  let roundedNumber = `${Math.round(parsedNumber * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)}`;

  if (roundedNumber.indexOf('.') === -1) {
    roundedNumber += '.';
  }

  while (roundedNumber.split('.')[1].length < decimalPlaces) {
    roundedNumber += '0';
  }

  return roundedNumber;
}

export const isObject = (value) => typeof value === 'object' && value !== null;
export const isNonEmptyObject = (value) => isObject(value) && Object.keys(value).length > 0;
export const objectHasKey = (object, key) => object.hasOwnProperty(key);

export const isString = (value) => typeof value === 'string';
export const isNonEmptyString = (value) => isString(value) && value.length > 0;

export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) => isArray(value) && value.length > 0;

export const isNumber = (value) => !isNaN(value);
