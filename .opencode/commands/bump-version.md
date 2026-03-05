---
description: "bump version"
agent: build
model: openai/gpt-5.1-codex-mini
---

Bump the version to the following:

$ARGUMENTS

To change the version, you need to update three files:

- package.json
- Cargo.toml
- Tauri.toml

Also, beware that the version in Tauri.toml doesn't support suffix (e.g. `1.3.5-beta`).
Make sure the version in Cargo.lock is also changed.

After changing the version, please check the commit log and summarize what has been changed since the last version bump. This summary includes:

- New features
- Breaking changes
- Bugfixes

While commits including config and repo documentation change, and AGENTS.md files shouldn't be included.
