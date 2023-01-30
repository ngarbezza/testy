'use strict';

import { after, assert, before, suite, test } from '../../lib/testy.js';

suite('testing testy - basic features', () => {
  const circular = {}; circular.yourself = circular;
  let myVar = 8;

  before(() => myVar = 7);
  after(() => myVar = undefined);

  test('tests with body', () => {
    const pepe = { nombre: 'pepe' };
    assert.that(pepe.nombre).isEqualTo('pepe');
  });

  test('before hook can be used', () => assert.areEqual(myVar, 7));

  test('many assertions', () => {
    assert.areEqual(2, 1 + 1);
    assert.isTrue(true || false);
  });

  // commented so CI can pass - uncomment to see the failure
  // test("unexpected errors don't break the suite", () => assert.isTrue(notAFunction()));

  test('successful test after the failure', () => assert.isTrue(true));

  test('custom equality check', () => {
    const criteria = (o1, o2) => o1.a === o2.a;
    /* eslint-disable id-length */
    assert.areEqual({ a: 'a', b: 'b1' }, { a: 'a', b: 'b2' }, criteria);
    assert.that({ a: 'a', b: 'b1' }).isEqualTo({ a: 'a', b: 'b2' }, criteria);
    assert.that({ a: 'a', b: 'b1' }).isNotEqualTo({ a: 'a2', b: 'b1' }, criteria);
    /* eslint-enable id-length */
  });

  test('equality check when objects understand equals()', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b1', equals(another) {
      return this.a === another.a;
    } };
    const objectTwo = { a: 'a', b: 'b2', equals(another) {
      return this.b === another.b;
    } };
    /* eslint-enable id-length */
    assert.that(objectOne).isEqualTo(objectTwo);
    assert.that(objectTwo).isNotEqualTo(objectOne);
  });

  test('equality check using custom message name', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: 'b1', sameAs(another) {
      return this.a === another.a;
    } };
    const objectTwo = { a: 'a', b: 'b2', sameAs(another) {
      return this.b === another.b;
    } };
    /* eslint-enable id-length */
    assert.that(objectOne).isEqualTo(objectTwo, 'sameAs');
    assert.that(objectTwo).isNotEqualTo(objectOne, 'sameAs');
  });

  // commented so CI can pass - uncomment to see the failure
  // test('fails in the first error', () => {
  //   assert.isTrue(false);
  //   assert.isTrue(true);
  // });

  // commented so CI can pass - uncomment to see the failure
  // test("failing on purpose", () => fail.with("I just want to fail"));

  // commented so CI can pass - uncomment to see the failure
  // test("failing if there are no assertions in the test body", () => 'no assert');

  // commented so CI can pass - uncomment to see the failure
  // test('equality check with objects having circular references fails', () => assert.areEqual(circular, circular));
});
