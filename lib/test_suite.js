class TestSuite {
  constructor(name, body) {
    this._name = name;
    this._body = body;
    this._tests = [];
    this._before = () => { return {}; };
  }
  
  addTest(test) { this._tests.push(test); }
  
  before(initialization) { this._before = initialization; }
  
  run(callbacks) {
    this._body();
    this._tests.forEach(test => {
      this._currentTest = test;
      let context = this._before();
      test.run(context);
    });
    callbacks.onFinish(this);
  }
  
  totalCount() { return this._tests.length; }
  
  successCount() {
    return this._tests.filter(test => test.isSuccess()).length;
  }
  
  pendingCount() {
    return this._tests.filter(test => test.isPending()).length;
  }
  
  errorsCount() {
    return this._tests.filter(test => test.isError()).length;
  }
  
  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount() - this.errorsCount();
  }
  
  name() { return this._name; }
  currentTest() { return this._currentTest; }
}

module.exports.TestSuite = TestSuite;