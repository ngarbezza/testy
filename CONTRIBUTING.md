# Contributing

Issues and Pull Requests are welcome. Please follow the issue templates that are already configured. Have in mind the "Why" section (simplicity, OO code with good practices) which explain the vision of this tool.

## Submitting issues

There are different issue types according to the thing you want to report. Please adjust to that format
unless you have a strong reason not to. If submitting bugs, it would be awesome if you include a minimal example
demonstrating the problem, like a small test or suite.

## Sending changes

* Base branch: `develop`. Please open PRs against `develop`.
* Not mandatory, but nice to have, use [Gitmoji](https://gitmoji.carloscuesta.me) for tagging the type of commits you're adding.

If you add a new feature, please add:
* unit tests for it on the `tests/core` folder
* an entry in the README explaining how to use it

If you fix a bug, please add:
* unit tests for it on the `tests/core` folder

If you add an utilitary function, please put it in the `Utils` module. That way we control the complexity
of utils in just one module, and we maximize reuse across different parts of the tool.

Github Actions runs the CI builds. There are four steps on every build:

* npm build and install in every supported Node version
* lint check via `eslint`
* unit tests
* analyzing test coverage and send reports
