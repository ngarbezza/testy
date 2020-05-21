'use strict';

const { Testy } = require('../testy');
const Configuration = require('./configuration');

const ScriptAction = {
  availableActions() {
    return [ ShowVersion, ShowHelp, RunTests ];
  },
  
  for(params) {
    return this.availableActions().find(action => action.appliesTo(params));
  },
  
  firstParamMatches(params, ...expressions) {
    return expressions.includes(params[0]);
  },
};

const ShowVersion = {
  __proto__: ScriptAction,
  
  appliesTo(params) {
    return this.firstParamMatches(params, '-v', '--version');
  },
  
  execute(_params) {
    const { version, description, homepage } = require('../package.json');
    console.log(`Testy version: ${version}\n${description}\n${homepage}`);
    process.exit(0);
  },
};

const ShowHelp = {
  __proto__: ScriptAction,
  
  appliesTo(params) {
    return this.firstParamMatches(params, '-h', '--help');
  },
  
  execute(_params) {
    const { description } = require('../package.json');
    console.log(`Testy: ${description}\n`);
    console.log('Usage: \n');
    console.log('   testy [-h --help] [-v --version] ...test files or folders...\n');
    console.log('Options: \n');
    console.log('   -h, --help      Displays this text');
    console.log('   -v, --version   Displays the current version');
    process.exit(0);
  },
};

const RunTests = {
  __proto__: ScriptAction,
  
  appliesTo(_params) {
    return true; // we want to run tests by default
  },
  
  execute(params) {
    const testyInstance = Testy.configuredWith(Configuration.current());
    testyInstance.run(params);
  },
};

module.exports = ScriptAction;
