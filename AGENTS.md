# AGENTS.md

This file explains how AI coding agents should work in this repository.

## Project at a glance

- **Project**: Ollama Lab (unofficial Ollama GUI)
- **Goal**: Make local AI chat and model management easy for everyone
- **Core features**:
  - Chat with LLMs
  - Save/manage local chat history
  - Manage local Ollama models
- **Architecture**: Tauri desktop app with a SolidJS + Vite frontend and a Rust backend (`src-tauri/`)

## Tech stack and tools

- Frontend: TypeScript, SolidJS, Vite, Tailwind CSS
- Desktop/backend: Tauri v2, Rust (workspace edition 2024)
- Package/runtime: Bun (required `>=1.2`)
- Formatting/linting: Prettier, ESLint, rustfmt

## Setup and common commands

Run from the repository root:

```bash
bun install
```

Development:

```bash
bun run tauri dev
# or
cargo tauri dev
```

Build:

```bash
bun run tauri build
# or
cargo tauri build
```

Quality checks:

```bash
bun run lint
bun run fmt
```

Optional cleanup (recommended after heavy debug/build cycles):

```bash
cargo clean
```

## How AI agents should operate here

- Keep changes focused and minimal; avoid broad refactors unless asked.
- Follow existing patterns in nearby files before introducing new abstractions.
- Preserve current UX behavior unless a change request explicitly targets behavior.
- Prefer safe, deterministic changes over speculative optimization.
- Validate affected areas with relevant checks (at least lint/build where practical).
- Do not commit generated artifacts or unrelated file changes.

## Contribution and git expectations

- Respect branch conventions documented in `CONTRIBUTING.md`:
  - `main`: trunk
  - `stable/*`: release branches
  - `test/*`: preview branches
  - `legacy`: old code line
- If AI tools are used for code generation, disclose AI usage in pull requests.
- Never include secrets, credentials, or local machine-specific sensitive data.

## Practical editing guidance for agents

- Frontend work typically lives under `src/`; Tauri/Rust work under `src-tauri/`.
- Keep TypeScript and Rust code style aligned with existing project conventions.
- Run formatting tools only when needed for touched files and avoid unrelated churn.
- Prefer incremental PR-ready changes with clear intent and testability.

## Source references

This guidance is derived from:

- `README.md`
- `CONTRIBUTING.md`
- `package.json`
- `Cargo.toml`

## Miscellaneous

### Version bump

To change the version, you need to update three files:

- package.json
- Cargo.toml
- Tauri.toml

Also, beware that the version in Tauri.toml doesn't support suffix (e.g. `1.3.5-beta`).
Make sure the version in Cargo.lock is also changed.
