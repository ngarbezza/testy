'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const assert = require('assert');

const isCyclic = object => {
  if (object === null) { return false; }
  const seenObjects = [];
  
  function detect(obj) {
    if (typeof obj === 'object') {
      if (seenObjects.includes(obj)) return true;
      seenObjects.push(obj);
      return !!Object.keys(obj).find(key => detect(obj[key]));
    }
    return false;
  }
  
  return detect(object);
};

const notNullOrUndefined = object =>
  object !== undefined && object !== null;

const hasMethodDefined = (object, method) =>
  notNullOrUndefined(object) && isFunction(object[method]);

const deepStrictEqual = (objectOne, objectTwo) => {
  try {
    assert.deepStrictEqual(objectOne, objectTwo);
    return true;
  } catch (_assertionError) {
    return false;
  }
};

const resolvePathFor = relativePath =>
  path.resolve(process.cwd(), relativePath);

const allFilesMatching = (dir, regex, results = []) => {
  if (fs.lstatSync(dir).isFile()) {
    return dir.match(regex) ? [dir] : [];
  }
  
  fs.readdirSync(dir).forEach(entry =>
    results.push(...allFilesMatching(path.join(dir, entry), regex, results))
  );
  return results;
};

const prettyPrint = object =>
  util.inspect(object);

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

const isString = object =>
  typeof object === 'string';

const isFunction = object =>
  typeof object === 'function';

const numberOfElements = object =>
  Array.from(object).length;

module.exports = {
  isCyclic,
  hasMethodDefined,
  deepStrictEqual,
  resolvePathFor,
  allFilesMatching,
  prettyPrint,
  shuffle,
  isString,
  isFunction,
  numberOfElements,
};
