'use strict';

const { suite, test, assert } = require('../../testy');
const { Asserter } = require('../../lib/asserter');
const I18n = require('../../lib/i18n');

const fakeRunner = {
  setResultForCurrentTest: function (result) { this._result = result; },
  result: function () { return this._result; },
  _i18n: new I18n(),
};

const asserter = new Asserter(fakeRunner);

function expectFailDueTo(failureMessage) {
  assert.isFalse(fakeRunner.result().isSuccess());
  assert.areEqual(fakeRunner.result().failureMessage(), failureMessage);
}

function expectSuccess() {
  assert.isTrue(fakeRunner.result().isSuccess());
}

suite('assertions behavior', () => {
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
});
