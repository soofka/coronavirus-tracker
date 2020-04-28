import {
  isString,
  isNonEmptyString,
  isNumber,
  isArray,
  isNonEmptyArray,
  isObject,
  isNonEmptyObject,
  objectHasKey,
  normalizeNumber,
  normalizeDate,
  normalizeDateTime,
} from '../utils';

describe('utils.js', () => {

  describe('isString', () => {

    it('returns true for string', () => {
      ['', ' ', 'test', 'test string'].forEach((string) => {
        expect(isString(string)).toEqual(true);
      });
    });

    it('returns false for non-string', () => {
      [false, null, undefined, 1, [], {}].forEach((nonString) => {
        expect(isString(nonString)).toEqual(false);
      });
    });

  });

  describe('isNonEmptyString', () => {

    it('returns true for non-empty string', () => {
      [' ', 'test', 'test string'].forEach((string) => {
        expect(isNonEmptyString(string)).toEqual(true);
      });
    });

    it('returns false for non-string', () => {
      [false, null, undefined, 1, [], {}].forEach((nonString) => {
        expect(isNonEmptyString(nonString)).toEqual(false);
      });
    });

    it('returns false for empty string', () => {
      expect(isNonEmptyString('')).toEqual(false);
    });

  });

  describe('isNumber', () => {

    it('returns true for number', () => {
      [-1, 0, 1, 2, new Number(), Number.MAX_SAFE_INTEGER].forEach((number) => {
        expect(isNumber(number)).toEqual(true);
      });
    });

    it('returns false for non-number', () => {
      [false, null, undefined, 'a', [], {}].forEach((nonNumber) => {
        expect(isNumber(nonNumber)).toEqual(false);
      });
    });

  });

  describe('isArray', () => {

    it('returns true for array', () => {
      [[], [null], ['a'], ['a', 'b', 'c']].forEach((array) => {
        expect(isArray(array)).toEqual(true);
      });
    });

    it('returns false for non-array', () => {
      [false, null, undefined, 1, 'a', {}].forEach((nonArray) => {
        expect(isArray(nonArray)).toEqual(false);
      });
    });

  });

  describe('isNonEmptyArray', () => {

    it('returns true for non-empty array', () => {
      [[null], ['a'], ['a', 'b', 'c']].forEach((array) => {
        expect(isNonEmptyArray(array)).toEqual(true);
      });
    });

    it('returns false for non-array', () => {
      [false, null, undefined, 1, 'a', {}].forEach((nonArray) => {
        expect(isNonEmptyArray(nonArray)).toEqual(false);
      });
    });

    it('returns false for empty array', () => {
      expect(isNonEmptyArray([])).toEqual(false);
    });

  });

  describe('isObject', () => {

    it('returns true for object', () => {
      [{}, { a: 1 }, { a: 1, b: 2, c: 3 }].forEach((object) => {
        expect(isObject(object)).toEqual(true);
      });
    });

    it('returns false for non-object', () => {
      [false, null, undefined, 1, 'a', []].forEach((nonObject) => {
        expect(isObject(nonObject)).toEqual(false);
      });
    });

  });

  describe('isNonEmptyObject', () => {

    it('returns true for non-empty object', () => {
      [{ a: 1 }, { a: 1, b: 2, c: 3 }].forEach((array) => {
        expect(isNonEmptyObject(array)).toEqual(true);
      });
    });

    it('returns false for non-object', () => {
      [false, null, undefined, 1, 'a', []].forEach((nonObject) => {
        expect(isNonEmptyObject(nonObject)).toEqual(false);
      });
    });

    it('returns false for empty object', () => {
      expect(isNonEmptyObject({})).toEqual(false);
    });

  });

  describe('objectHasKey', () => {

    it('returns true if object has key', () => {
      [[{ a: 1 }, 'a'], [{ a: 1, b: 2, c: 3 }, 'b']].forEach(([object, key]) => {
        expect(objectHasKey(object, key)).toEqual(true);
      })
    });

    it('returns false if object does not have key', () => {
      [[{ a: 1 }, 'b'], [{ a: 1, b: 2, c: 3 }, 'd']].forEach(([object, key]) => {
        expect(objectHasKey(object, key)).toEqual(false);
      });
    });

    it('returns false for non-object', () => {
      [false, null, undefined, 1, 'a', []].forEach((nonObject) => {
        expect(objectHasKey(nonObject, 'a')).toEqual(false);
      });
    });

  });

  describe('normalizeNumber', () => {

    it('returns normalized value in case of number', () => {
      [-1, 0, 1, 2, new Number(), Number.MAX_SAFE_INTEGER].forEach((number) => {
        expect(normalizeNumber(number)).toEqual(new Number(number).toLocaleString());
      });
    });

    it('returns value in case of non-number', () => {
      [false, null, undefined, 'a', [], {}].forEach((nonNumber) => {
        expect(normalizeNumber(nonNumber)).toEqual(nonNumber);
      });
    });

  });

  describe('normalizeDate', () => {

    it('returns normalized value in case of date', () => {
      [0, '2020-01-01', '1 Jan 2020', new Date()].forEach((date) => {
        expect(normalizeDate(date)).toEqual(new Date(date).toLocaleDateString());
      });
    });

    it('returns normalized value in case of non-date', () => {
      [false, null, undefined, 'a', [], {}].forEach((nonDate) => {
        expect(normalizeDate(nonDate)).toEqual(new Date(nonDate).toLocaleDateString());
      });
    });

  });

  describe('normalizeDateTime', () => {

    it('returns normalized value in case of datetime', () => {
      [0, '2020-01-01 01:00', '1 Jan 2020, 1:00', new Date()].forEach((dateTime) => {
        expect(normalizeDateTime(dateTime)).toEqual(new Date(dateTime).toLocaleString());
      });
    });

    it('returns normalized value in case of non-datetime', () => {
      [false, null, undefined, 'a', [], {}].forEach((nonDateTime) => {
        expect(normalizeDateTime(nonDateTime)).toEqual(new Date(nonDateTime).toLocaleString());
      });
    });

  });
  
});
