import { classNameOf } from './types.js';

/**
 * Returns true if the given Array or String contains no elements, false otherwise.
 *
 * @private
 * @returns {boolean}
 */
const isEmpty = collection => collection.length === 0;

const shuffle = array => {
  let currentIndex = array.length;
  // eslint-disable-next-line init-declarations
  let temporaryValue, randomIndex;
  while (currentIndex !== 0) {
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
  const conversionFunction = conversionFunctions[classNameOf(object)];
  return conversionFunction(object);
};

export {
  isEmpty,
  shuffle,
  numberOfElements,
  convertToArray,
};
