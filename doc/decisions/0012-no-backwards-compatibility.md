# 12. No backwards compatibility

Date: 2023-06-28

## Status

Accepted

## Context

This tool is not widely used (Github lists only 12 dependents on this tool), the cost of maintaining multiple versions
is high for a single person.

## Decision

New major versions might not be backwards compatible, and we will always maintain only the latest major version. We
will keep documenting changes and migration notes, but not solving bugs of previous versions. 

## Consequences

* Once a new major version is released, we encourage users to upgrade as soon as possible.
* We will keep documenting breaking changes in the CHANGELOG file, and provide upgrade guides if that information is not enough.
* Maintaining a single major version (the latest) is not an ideal scenario, but it makes things much more simpler to the maintainer.
* This decision might change if the tool is adopted by more users, and/or we have more maintainers.
