'use strict';

const { suite, test, assert } = require('../../testy');
const { Asserter } = require('../../lib/asserter');
const { TestSucceeded } = require('../../lib/test_result');
const I18n = require('../../lib/i18n');

const fakeRunner = {
  setResultForCurrentTest: function (result) { this._result = result; },
  result: function () { return this._result; },
  _i18n: new I18n(),
};

const asserter = new Asserter(fakeRunner);

function expectFailDueTo(failureMessage) {
  assert.isTrue(fakeRunner.result().isFailure());
  assert.areEqual(fakeRunner.result().failureMessage(), failureMessage);
}

function expectSuccess() {
  assert.areEqual(fakeRunner.result(), new TestSucceeded());
}

suite('assertions behavior', () => {
  // Boolean assertions - isTrue()
  
  test('isTrue passes with true', () => {
    asserter.that(true).isTrue();
    
    expectSuccess();
  });
  
  test('isTrue does not pass with false', () => {
    asserter.that(false).isTrue();

    expectFailDueTo('Expected false to be true');
  });
  
  test('isTrue does not pass with another value', () => {
    asserter.that(null).isTrue();
    
    expectFailDueTo('Expected null to be true');
  });
  
  // Boolean assertions - isFalse()
  
  test('isFalse passes with false', () => {
    asserter.that(false).isFalse();
    
    expectSuccess();
  });
  
  test('isFalse does not pass with true', () => {
    asserter.that(true).isFalse();
    
    expectFailDueTo('Expected true to be false');
  });
  
  test('isFalse does not pass with another value', () => {
    asserter.that(null).isFalse();
    
    expectFailDueTo('Expected null to be false');
  });
  
  // Boolean assertions - isEqualTo()
  
  test('isEqualTo pass with equal primitive objects', () => {
    asserter.that(42).isEqualTo(42);
  
    expectSuccess();
  });
  
  test('isEqualTo fails with different primitive objects', () => {
    asserter.that(42).isEqualTo(21);
    
    expectFailDueTo('Expected 42 to be equal to 21');
  });
  
  test('isEqualTo passes with boxed and unboxed numbers', () => {
    asserter.that(42).isEqualTo((42));
  
    expectSuccess();
  });
  
  test('isEqualTo passes with arrays in the same order', () => {
    asserter.that([1, 2, 3]).isEqualTo([1, 2, 3]);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with arrays in different order', () => {
    asserter.that([1, 2, 3]).isEqualTo([1, 3, 2]);
  
    expectFailDueTo('Expected [ 1, 2, 3 ] to be equal to [ 1, 3, 2 ]');
  });
  
  test('isEqualTo passes with objects having the same property values', () => {
    let objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    let objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectSuccess();
  });
  
  test('isEqualTo fails with objects having different property values', () => {
    let objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    let objectTwo = { a: 'a', b: { b1: 'b1', b2: '' } };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: { b1: 'b1', b2: 'b2' } } to be equal to { a: 'a', b: { b1: 'b1', b2: '' } }");
  });
  
  test('isEqualTo fails if one object has less properties than the other', () => {
    let objectOne = { a: 'a', b: 'b' };
    let objectTwo = { a: 'a', b: 'b', c: 'c' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: 'b' } to be equal to { a: 'a', b: 'b', c: 'c' }");
  });
  
  test('isEqualTo fails if one object has more properties than the other', () => {
    let objectOne = { a: 'a', b: 'b', c: 'c' };
    let objectTwo = { a: 'a', b: 'b' };
    asserter.that(objectOne).isEqualTo(objectTwo);
    
    expectFailDueTo("Expected { a: 'a', b: 'b', c: 'c' } to be equal to { a: 'a', b: 'b' }");
  });
  
  test('isEqualTo with custom criteria fails if objects do not have that property', () => {
    let objectOne = { a: 'a', b: 'b' };
    let objectTwo = { a: 'a', b: 'b' };
    asserter.areEqual(objectOne, objectTwo, 'notFound');
    
    expectFailDueTo('Expected { a: \'a\', b: \'b\' } to be equal to { a: \'a\', b: \'b\' } Equality check failed. Objects do not have \'notFound\' property');
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true', () => {
    let objectOne = { a: 'a', b: 'b1', myEqualMessage: () => true };
    let objectTwo = { a: 'a', b: 'b2', myEqualMessage: () => true };
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with custom criteria passes if the criteria evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) { this.a = a }
      myEqualMessage() { return true }
    }
    let objectOne = new AClass();
    let objectTwo = new AClass();
    asserter.areEqual(objectOne, objectTwo, 'myEqualMessage');
    
    expectSuccess();
  });
  
  test('isEqualTo with equals() default criteria passes if it evaluates to true, and we are comparing instances of the same class', () => {
    class AClass {
      constructor(a) { this.a = a }
      equals() { return true }
    }
    let objectOne = new AClass(1);
    let objectTwo = new AClass(2);
    asserter.areEqual(objectOne, objectTwo);
    
    expectSuccess();
  });
  
  // Collection assertions - includes()
  
  test('includes passes if the object is in the array', () => {
    asserter.that(['hey']).includes('hey');
  
    expectSuccess();
  });
  
  test('includes does not pass if the actual object is not an array', () => {
    asserter.that([]).includes('hey');
    
    expectFailDueTo("Expected [] to include hey");
  });
  
  // Collection assertions - doesNotInclude()
  
  test('doesNotInclude fails if the object is in the array', () => {
    asserter.that(['hey']).doesNotInclude('hey');
  
    expectFailDueTo("Expected [ 'hey' ] to not include hey");
  });
  
  test('doesNotInclude passes if the object is not an array', () => {
    asserter.that([]).doesNotInclude('hey');
  
    expectSuccess();
  });
  
  // Collection assertions - includesExactly()
  
  test('includesExactly passes with a single object included', () => {
    asserter.that(['hey']).includesExactly('hey');
    
    expectSuccess();
  });
  
  test('includesExactly fails if the collection has more objects than expected', () => {
    asserter.that(['hey', 'ho']).includesExactly('hey');
    
    expectFailDueTo("Expected [ 'hey', 'ho' ] to include exactly [ 'hey' ]");
  });
  
  test('includesExactly fails if the collection has less objects than expected', () => {
    asserter.that(['hey']).includesExactly('hey', 'ho');
    
    expectFailDueTo("Expected [ 'hey' ] to include exactly [ 'hey', 'ho' ]");
  });
  
  test('includesExactly fails if none of the objects are included at all', () => {
    asserter.that(['hey']).includesExactly('ho');
    
    expectFailDueTo("Expected [ 'hey' ] to include exactly [ 'ho' ]");
  });
  
  test('includesExactly passes with many items no matter the order', () => {
    asserter.that(['hey', 'ho']).includesExactly('ho', 'hey');
    
    expectSuccess();
  });
  
  // Collection assertions - isEmpty()
  
  test('isEmpty passes on an empty array', () => {
    asserter.that([]).isEmpty();
    
    expectSuccess();
  });
  
  test('isEmpty does not pass if the array has elements', () =>{
    asserter.that(['hey']).isEmpty();
  
    expectFailDueTo("Expected [ 'hey' ] to be empty");
  });
  
  test('isEmpty passes with an empty string', () => {
    asserter.that('').isEmpty();
  
    expectSuccess();
  });
  
  test('isEmpty shorthand works', () => {
    asserter.isEmpty([]);
    
    expectSuccess();
  });
  
  // Collection assertions - isEmpty()
  
  test('isNotEmpty passes on an array with element', () => {
    asserter.that(['hey']).isNotEmpty();
    
    expectSuccess();
  });
  
  test('isNotEmpty does not pass if the array is empty', () =>{
    asserter.that([]).isNotEmpty();
    
    expectFailDueTo("Expected [] to be not empty");
  });
  
  test('isNotEmpty passes with a string with content', () => {
    asserter.that('hey').isNotEmpty();
    
    expectSuccess();
  });
  
  test('isNotEmpty shorthand works', () => {
    asserter.isNotEmpty(['hey']);
    
    expectSuccess();
  });
  
  // Exception assertions
  
  test('raises() can receive a string and it passes when the exact string is expected', () => {
    asserter.that(() => { throw 'an error happened' }).raises('an error happened');
    
    expectSuccess();
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown string', () => {
    asserter.that(() => { throw 'an error happened' }).raises(/error/);
    
    expectSuccess();
  });
  
  test('raises() can receive a regex and it passes when it matches the thrown error with message', () => {
    asserter.that(() => { throw new TypeError('things happened') }).raises(/happened/);
    
    expectSuccess();
  });
  
  test('raises() can receive a regex and it fails if there is not a match in the error message', () => {
    asserter.that(() => { throw 'a terrible error' }).raises(/happiness/);
    
    expectFailDueTo('Expected error /happiness/ to happen, but got \'a terrible error\' instead');
  });
});
