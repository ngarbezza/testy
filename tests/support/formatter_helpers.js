import { TestSuite } from '../../lib/core/test_suite.js';
import { Configuration } from '../../lib/config/configuration.js';
import { withRunnerAndCallbacks, emptyRunnerCallbacks } from './runner_helpers.js';
import { emptySuiteCallbacks, fakePathLocation } from './suites_factory.js';

const configForRun = new Configuration({ failFast: false, randomOrder: false, timeoutMs: 50 });

/**
 * Runs the given test-factory functions inside one suite and returns the runner and the
 * suite after execution, so a formatter can be driven against real results.
 *
 * Each factory receives the asserter (factories that don't need it just ignore the argument).
 */
const runResultsWith = async(suiteName, ...testFactories) =>
  withRunnerAndCallbacks(emptyRunnerCallbacks, async(runner, asserter) => {
    const suite = new TestSuite(suiteName, () => {}, emptySuiteCallbacks, fakePathLocation);
    testFactories.forEach(makeTest => suite.addTest(makeTest(asserter)));
    runner.addSuite(suite);
    runner.configureWith(configForRun);
    await runner.run();
    return { runner, suite };
  });

/**
 * Replays a finished test into the formatter using the same dispatch logic as
 * ConsoleUI.testCallbacks().
 */
const dispatchResultTo = (formatter, test) => {
  if (test.isSuccess()) {
    formatter.displaySuccessResult(test);
  } else if (test.isFailure()) {
    formatter.displayFailureResult(test, 'fail');
  } else if (test.isError()) {
    formatter.displayFailureResult(test, 'error');
  } else if (test.isPending()) {
    formatter.displayPendingResult(test);
  } else {
    formatter.displaySkippedResult(test);
  }
};

/**
 * Drives the full event stream (suite start, every test result, runner end) into the
 * formatter, exactly as ConsoleUI would during a real run.
 */
const driveFormatter = (formatter, runner, suite) => {
  formatter.startTimer();
  formatter.displaySuiteStart(suite);
  suite.tests().forEach(test => dispatchResultTo(formatter, test));
  formatter.displaySuiteEnd(suite);
  formatter.displayRunnerEnd(runner);
};

export { runResultsWith, dispatchResultTo, driveFormatter };
