'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');
const assert = require('assert');

function isCyclic(obj) {
  if (obj === null) { return false; }
  const seenObjects = [];
  
  function detect(obj) {
    if (typeof obj === 'object') {
      if (seenObjects.includes(obj)) return true;
      seenObjects.push(obj);
      return !!Object.keys(obj).find(key => detect(obj[key]));
    }
    return false;
  }
  
  return detect(obj);
}

function notNullOrUndefined(object) {
  return object !== undefined && object !== null;
}

function hasMethodDefined(object, method) {
  return notNullOrUndefined(object) && typeof object[method] === 'function';
}

function deepStrictEqual(objectOne, objectTwo) {
  try {
    assert.deepStrictEqual(objectOne, objectTwo);
    return true;
  } catch (_assertionError) {
    return false;
  }
}

function resolvePathFor(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function allFilesMatching(dir, regex, results = []) {
  if (fs.lstatSync(dir).isFile()) {
    return dir.match(regex) ? [dir] : [];
  }
  
  fs.readdirSync(dir).forEach(entry =>
    results.push(...allFilesMatching(path.join(dir, entry), regex, results))
  );
  return results;
}

function prettyPrint(object) {
  return util.inspect(object);
}

function haveSameElements(collectionOne, collectionTwo) {
  const collectionOneArray = Array.from(collectionOne);
  const collectionTwoArray = Array.from(collectionTwo);
  if (collectionOneArray.length !== collectionTwoArray.length) return false;
  for (let i = 0; i < collectionOne.length; i++) {
    const includedInOne = collectionOneArray.includes(collectionTwoArray[i]);
    const includedInTwo = collectionTwoArray.includes(collectionOneArray[i]);
    if (!includedInOne || !includedInTwo) return false;
  }
  return true;
}

module.exports = {
  isCyclic,
  hasMethodDefined,
  deepStrictEqual,
  resolvePathFor,
  allFilesMatching,
  prettyPrint,
  haveSameElements,
};
