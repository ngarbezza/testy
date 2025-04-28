// comparison on objects
export function isCyclic(object: Object): boolean
export function deepStrictEqual(objectOne: Object, objectTwo: Object): boolean;

// printing
export function prettyPrint(object: Object): string

// types
export function isBoolean(object: Object): boolean
export function isNumber(object: Object): boolean
export function isString(object: Object): boolean
export function isStringWithContent(object: Object): boolean
export function isUndefined(object: Object): boolean
export function isRegex(object: Object): boolean
export function notNullOrUndefined(object: Object): boolean
export function respondsTo(object: Object, methodName: string): boolean

// collections

export function isEmpty(collection: Array<any>): boolean
export function shuffle<T>(collection: Array<T>): Array<T>;
export function numberOfElements<T>(arrayLike: ArrayLike<T>): number;
// export function convertToArray<T, U>(object: Array<T> | Set<T> | string | Map<K, V>): Array<T> | Array<U> | Array<string>

// numbers
export function asFloat(number: number | string): number;

// files
export function resolvePathFor(relativePath: string): string;

type FileMatchDir = string | URL
export function allFilesMatching(dir: FileMatchDir, regex: string | RegExp, results: string[]): string[];

// object orientation
export function subclassResponsibility(): Error;

// errors
export function errorDetailOf(thrownError: Object): string;

// metaprogramming
export function detectUserCallingLocation(): string;

