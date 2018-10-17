class TestSuite {
  constructor(name, body) {
    this._name = name;
    this._body = body;
    this._tests = [];
    this._before = () => { return {} };
  }
  
  addTest(test) { this._tests.push(test) }
  
  before(initialization) { this._before = initialization }
  
  run() {
    this._body();
    this._tests.forEach(test => {
      let context = this._before();
      test.run(context);
    })
  }
  
  totalCount() { return this._tests.length; }
  
  successCount() {
    return this._tests.filter(test => test.isSuccess()).length
  }
  
  pendingCount() {
    return this._tests.filter(test => test.isPending()).length
  }
  
  failuresCount() {
    return this.totalCount() - this.successCount() - this.pendingCount()
  }
  
  name() { return this._name }
}

module.exports.TestSuite = TestSuite;