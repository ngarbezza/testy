import { assert, suite, test } from '../../lib/testy.js';
import { SuiteLocation } from '../../lib/location/suite_location.js';


suite('Suite Location', () => {
  test('a suite location cannot have an empty path', () => {
    assert
      .that(() => new SuiteLocation(''))
      .raises(new Error('Suite Location does not have a valid file path. Please enter a valid file path string for this suite location.'));
  });

  test('it is possible to retrieve the path name', () => {
    const path = 'I am a path';
    const suiteLocation = new SuiteLocation('I am a path');

    assert.that(suiteLocation.getPath()).isEqualTo(path);
  });
});
