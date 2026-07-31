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

/**
 * Reimplementable-semantics seam (ADR 0018): structural deep equality. A port targeting
 * another language reimplements this comparison natively rather than depending on Node's
 * `util.isDeepStrictEqual`.
 */
const deepStrictEqual = (objectOne, objectTwo) =>
  util.isDeepStrictEqual(objectOne, objectTwo);

export {
  isCyclic,
  deepStrictEqual,
};
