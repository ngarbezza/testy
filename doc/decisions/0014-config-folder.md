# 14. Config Folder

Date: 2023-07-03

## Status

Accepted

## Context

The root folder is becoming larger due to many configuration files placed on it.

## Decision

Create a `config` folder to include all the "dotfiles" to configure different tools.

## Consequences

We will start adding new configuration files, whenever possible, on that folder, and progressively move all existing
files to that folder.

Some tools/CI scripts might not work with the defaults, so we need to be careful and be explicit about where to look
for config files.
