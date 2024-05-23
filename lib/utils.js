'use strict';

import fs from 'fs';
import util from 'util';
import path from 'path';

const isCyclic = object => {
  if (object === null) {
    return false;
  }
  const seenObjects = [];

  function detect(obj) {
    if (typeof obj === 'object' && obj !== null) {
      if (seenObjects.includes(obj)) {
        return true;
      }
      seenObjects.push(obj);
      return !!Object.keys(obj).find(key => detect(obj[key]));
    }
    return false;
  }

  return detect(object);
};

const deepStrictEqual = (objectOne, objectTwo) =>
  util.isDeepStrictEqual(objectOne, objectTwo);

const resolvePathFor = relativePath =>
  path.resolve(process.cwd(), relativePath);

const allFilesMatching = (dir, regex, results = []) => {
  if (fs.lstatSync(dir).isFile()) {
    return dir.match(regex) ? [dir] : [];
  }
  fs.readdirSync(dir).forEach(entry =>
    results.push(...allFilesMatching(path.join(dir, entry), regex, results)),
  );
  return results;
};

/**
 * Returns true if the given Array or String contains no elements, false otherwise.
 *
 * @private
 * @returns {boolean}
 */
const isEmpty = collection => collection.length === 0;

const shuffle = array => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  while (currentIndex !== 0) { // While there remain elements to shuffle...
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

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

const prettyPrint = object => {
  const excludedToStrings = [Object.prototype.toString, String.prototype.toString, Array.prototype.toString];
  const shouldUseToStringMethod = notNullOrUndefined(object) && !excludedToStrings.includes(object.toString);
  return shouldUseToStringMethod ? object.toString() : util.inspect(object, { depth: Infinity, compact: true });
};

const numberOfElements = object =>
  Array.from(object).length;

const stringToArray = object => Array.from(object);
const arrayToArray = object => object;
const setToArray = object => Array.from(object);
const mapToArray = object => Array.from(object.values());

const convertToArray = object => {
  const conversionFunctions = {
    String: stringToArray,
    Array: arrayToArray,
    Set: setToArray,
    Map: mapToArray,
  };
  const conversionFunction = conversionFunctions[object.constructor.name];
  return conversionFunction(object);
};

const subclassResponsibility = () => {
  throw new Error('subclass responsibility');
};

const errorDetailOf = thrownObject => (thrownObject instanceof Error) ? thrownObject.stack : thrownObject.toString();

/**
 * Detects the closest place where the user is calling the library code. This is helpful to report location of test
 * errors.
 *
 * @private
 * @returns {string} a stack trace line including file, row and column number (e.g.
 * `'/code/projects/awesome-project/tests/my_test.js:11:22'`). If it's not possible to determine it, returns an empty
 * string.
 */
const detectUserCallingLocation = () => {
  // the splice is to remove the error header and get only the stack trace part
  const stackTraceLines = new Error().stack.split('\n').splice(1);
  // the strategy is to navigate back on the stack trace until it finds a code that is not from the testy library
  // itself. In other words, is the place where we called Testy
  return stackTraceLines.find(line => !line.includes('testy/lib')) || '';
};

export {
  // comparison on objects
  isCyclic,
  deepStrictEqual,
  // printing
  prettyPrint,
  // types
  isBoolean,
  isNumber,
  isString,
  isStringWithContent,
  isFunction,
  isUndefined,
  isRegex,
  notNullOrUndefined,
  respondsTo,
  // collections
  isEmpty,
  shuffle,
  numberOfElements,
  convertToArray,
  // files
  resolvePathFor,
  allFilesMatching,
  // object orientation
  subclassResponsibility,
  // errors
  errorDetailOf,
  // metaprogramming
  detectUserCallingLocation,
};
