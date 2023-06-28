# 13. Support for ES Modules Only

Date: 2023-06-28

## Status

Accepted

## Context

ES Modules are no longer experimental and are starting to become a standard for new projects, in contrast with CommonJS
that is only supported in Node, and not in other environments like Deno or the browser.

This article contains a detailed comparison of CommonJS and ES Modules: https://www.knowledgehut.com/blog/web-development/commonjs-vs-es-modules

This tool uses modules a lot, as it dynamically requires files written by the users of Testy, and the asyncronous
features of ES makes things easier and brings more reliability than synchronous CommonJS modules.  

## Decision

Support only ES Modules, dropping support for CommonJS that was the original module system adopted by the tool.
It is possible, as a package, to offer both ES anc CommonJS interfaces, but it increases the complexity of the code,
which is against the spirit of this project. 

## Consequences

* This is a disruptive change for users. Projects that uses CommonJS will need to migrate to ES, at least to load the
tests.
* This will represent a breaking change, to be released in a new major version.
