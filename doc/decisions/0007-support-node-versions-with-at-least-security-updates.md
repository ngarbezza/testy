# 7. Support Node versions with at least security updates

Date: 2021-10-08

## Status

Accepted

## Context

Making clear which versions are supported and how this will be updated as time passes.

## Decision

Only support Node versions with active and security support. Do not support newer, unstable versions.
We can use [endoflife.date](https://endoflife.date/nodejs) as a reference. Example: at the moment
of this decision, only Node 12, 14 and 16 should be supported.

## Consequences

- Everytime we drop support of a major Node version, we need to make a major release.
