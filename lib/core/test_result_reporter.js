import { TestResult } from './test_result.js';

export class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }

  report(result) {
    this._runner.setResultForCurrentTest(result);
  }

  reportSuccess() {
    return this.report(TestResult.success());
  }

  reportFailure(message) {
    return this.report(TestResult.failure(message));
  }
}
