# Testing Guide

Our app has been created using create-react-app so we have jest (testing-library) installed by default.

`yarn test` command is used to test all cases across the app

## Jest naming convention

Jest will consider a file as test case for

- Any file with .test.js suffix
- any .js file within **tests** folder throughout project

## Jest methods

- `describe(text, function)`: A test suite used to wrap group of tests

- `it(text, function)`: A unit test case. `test()` is also valid method for this functionality

- `expect()`: Used to make assertions in test case

## Disable watcher for CI Mode

Most CI environments disable test watching for you by setting `CI` envrionment variable. If facing any issue, please use below commands to run tests in non-interactive mode and disable watcher.

`CI=true yarn test` command indicates CI mode and runs tests only once instead of watching.

or

`yarn test --watchAll=false` is used to disable test watching.

[Disable watcher reference](https://create-react-app.dev/docs/running-tests/#on-your-own-environment)

### Test cases for table component

1. On packet reception:

   [Approach](https://github.com/hyphenOs/webshark-frontend/issues/25#issuecomment-669043395)

    Trying following solutions for detecting `useState` invoke:
    - [Solution 1](https://dev.to/theactualgivens/testing-react-hook-state-changes-2oga)
    - [Soultion 2](https://blog.logrocket.com/testing-state-changes-in-react-functional-components/)
    - [Solution 3](https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-my-tests)
