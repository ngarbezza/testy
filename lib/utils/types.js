const isNumber = object =>
  typeof object === 'number';

const isBoolean = object =>
  typeof object === 'boolean';

const isString = object =>
  typeof object === 'string';

const isFunction = object =>
  typeof object === 'function';

const isUndefined = object =>
  typeof object === 'undefined';

const notNullOrUndefined = object =>
  !isUndefined(object) && object !== null;

const isStringWithContent = string =>
  isString(string) && string.replace(/\s/g, '').length > 0;

const respondsTo = (object, methodName) =>
  notNullOrUndefined(object) && isFunction(object[methodName]);

const isRegex = object =>
  respondsTo(object, 'test');

const classNameOf = object => object.constructor.name;

export {
  isNumber,
  isBoolean,
  isString,
  isFunction,
  isUndefined,
  notNullOrUndefined,
  isStringWithContent,
  respondsTo,
  isRegex,
  classNameOf,
};
