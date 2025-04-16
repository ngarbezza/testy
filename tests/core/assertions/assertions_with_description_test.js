import { suite, test } from '../../../lib/testy.js';
import { resultOfATestWith } from '../../support/runner_helpers.js';
import { expectFailureOn, expectSuccess } from '../../support/assertion_helpers.js';

suite('assertions with custom descriptions', () => {
  test('isTrue fails with a custom message', async() => {
    const result = await resultOfATestWith(assert =>
      assert
        .withDescription('Esperaba el valor booleano verdadero')
        .that(false).isTrue(),
    );

    expectFailureOn(result, 'Esperaba el valor booleano verdadero');
  });

  test('other assertions fail with a custom message too', async() => {
    const result = await resultOfATestWith(assert =>
      assert
        .withDescription('Esperaba una colección vacía')
        .that([1]).isEmpty(),
    );

    expectFailureOn(result, 'Esperaba una colección vacía');
  });

  test('shorthand assertions can fail with a custom message too', async() => {
    const result = await resultOfATestWith(assert =>
      assert
        .withDescription('Acaso 2 no es igual a 3?')
        .areEqual(2, 3),
    );

    expectFailureOn(result, 'Acaso 2 no es igual a 3?');
  });

  test('custom description does not have effect if the assertion is successful', async() => {
    const result = await resultOfATestWith(assert =>
      assert
        .withDescription('No visible')
        .areEqual(3, 3),
    );

    expectSuccess(result);
  });
});
