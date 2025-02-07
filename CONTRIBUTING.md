# Develop Ollama Lab

## Prerequisites

Install:

- [Rust](https://rust-lang.org) and [Cargo](https://crates.io/)
- [Bun](https://bun.sh) 1.2+
- libSQLite
- cargo-tauri (optional)

If you use Linux, you should also install:

- GTK 3
- WebKit2GTK 4.1

## Prepare

Run in the project directory:

```bash
bun install
```

## Debug

Run in the project directory:

```bash
bun run tauri dev
```

If you use cargo-tauri, you can also run:

```bash
cargo tauri dev
```

## Build

```bash
bun run tauri build
# OR
cargo tauri build
```

## Clean up

It is recommended to clean up the compiled target at the end of the day of debugging, since it can easily grow up to 9+ GiB.

```bash
cargo clean
```
