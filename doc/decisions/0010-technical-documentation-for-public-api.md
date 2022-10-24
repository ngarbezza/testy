# 10. Write technical documentation for the public API

Date: 2022-07-29

## Status

Accepted

## Context

Documentation is very important for learning to use any tool effectively, and to understand all the features and options
you have to do something.

The only documentation piece we had so far was the README, which is a good starting point but it might not be detailed
enough. Code was "self-documented" so far, but that is not enough from the eyes of a new user.

We also know that documentation is better when it is as close to the code as possible, and it reduces the need of
searching for help in online forums, sites like StackOverflow, and so on.

## Decision

Document all public API parts of the tool, so that users can understand with detail every feature, and understand the
contract of each class/method (parameters expected, return types, etc). Use a standard format (JSDoc) that can be
used to generate an HTML version with all the documentation in a self-contained way. Try to add examples to better
illustrate usages and ultimately soften the learning curve.

## Consequences

README will still be there, and it will serve as a high-level overview, quick start examples, and summarizing all the
aspects of the tool. Nothing will change on that document.

Writing JSDoc will be a required step for every feature that involves a public export/class/method/function. This will
be added to our contributing guidelines.

We'll do a back-fill of all the undocumented pieces, and from now on we expect code and docs to evolve together.

Users will hava a detailed reference and can use it with the IDE, or a documentation website, navigate the different
parts and use the examples to copy, paste and run them.

Feature development costs will increase, but we expect this new cost of documentation to be small compared with pure
development work. Plus, we'll be forced to think about the contract by the time of writing the code.

As we will document only public API methods, we expect the documentation to not change often, because a change in the
public API means that we are breaking compatibility.
