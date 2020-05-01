# Contributing

Issues and Pull Requests are welcome. Please follow the issue templates that are already configured. Have in mind the "Why" section (simplicity, OO code with good practices) which explain the vision of this tool.

* Base branch: `develop`. Please open PRs against `develop`.
* Not mandatory, but nice to have, use [Gitmoji](https://gitmoji.carloscuesta.me) for tagging the type of commits you're adding.

If you add a new feature, please add:
* unit tests for it on the `tests/core` folder
* an entry in the README explaining how to use it

If you fix a bug, please add:
* unit tests for it on the `tests/core` folder

Github Actions runs the CI builds. There are three steps on every build:

* npm build and install in every supported Node version
* lint check via `eslint`
* unit tests
