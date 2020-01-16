import { IForm } from '../';

export function flattenObject(obj: IForm, prefix: string = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (obj[k].constructor === Object || obj[k].constructor === Array)
      Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {} as IForm);
}

export function unflatten(target: IForm, opts: IForm = {}) {
  opts = opts || {};

  var delimiter = opts.delimiter || '.';
  var overwrite = opts.overwrite || false;
  var result: IForm = {};

  if (Object.prototype.toString.call(target) !== '[object Object]') {
    return target;
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key: string): string | number {
    var parsedKey = Number(key);

    return isNaN(parsedKey) || key.indexOf('.') !== -1 || opts.object
      ? key
      : parsedKey;
  }

  var sortedKeys = Object.keys(target).sort(function(keyA, keyB) {
    return keyA.length - keyB.length;
  });

  sortedKeys.forEach(function(key: string) {
    var split: string[] = key.split(delimiter);
    var key1 = getkey(split.shift() || '');
    var key2 = getkey(split[0]);
    var recipient = result;

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1]);
      var isobject = type === '[object Object]' || type === '[object Array]';

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return;
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === 'number' && !opts.object ? [] : {};
      }

      recipient = recipient[key1];

      // Ignore the string index that was passed and instead fill the array
      // in order
      if (Array.isArray(recipient) && opts.compress)
        split[0] = `${recipient.length}`;

      if (split.length > 0) {
        key1 = getkey(split.shift() || '');
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts);
  });

  return result;
}

export const range = (start: number, end: number) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
};
