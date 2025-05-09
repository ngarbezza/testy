import util from 'node:util';
import { notNullOrUndefined } from './types.js';

const prettyPrint = object => {
  const excludedToStrings = [Object.prototype.toString, String.prototype.toString, Array.prototype.toString];
  const shouldUseToStringMethod = notNullOrUndefined(object) && !excludedToStrings.includes(object.toString);
  return shouldUseToStringMethod ? object.toString() : util.inspect(object, {
    depth: Infinity,
    compact: true,
  });
};

export {
  prettyPrint,
};
