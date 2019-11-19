'use strict';

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

module.exports = {
  isCyclic,
  hasMethodDefined,
  deepStrictEqual,
};
