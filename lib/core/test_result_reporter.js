import { TestResult } from './test_result.js';

export class TestResultReporter {
  constructor(runner) {
    this._runner = runner;
  }

  report(result) {
    this._runner.setResultForCurrentTest(result);
  }

  reportSuccess() {
    this.report(TestResult.success());
  }

  reportFailure(message) {
    this.report(TestResult.failure(message));
  }
}
