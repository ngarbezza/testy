import util from 'node:util';

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
      return Boolean(Object.keys(obj).find(key => detect(obj[key])));
    }
    return false;
  }

  return detect(object);
};

const deepStrictEqual = (objectOne, objectTwo) =>
  util.isDeepStrictEqual(objectOne, objectTwo);

export {
  isCyclic,
  deepStrictEqual,
};
