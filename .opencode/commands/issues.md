---
description: "find issue(s) on github"
agent: build
model: openai/gpt-5.1-codex-mini
---

Search through existing issues in ollama-lab/ollama-lab using the gh cli to find issues matching this query:

$ARGUMENTS

Consider:

1. Similar titles or descriptions
2. Same error messages or symptoms
3. Related functionality or components
4. Similar feature requests

Please list any matching issues with:

- Issue number and title
- Brief explanation of why it matches the query
- Link to the issue

If no clear matches are found, say so.
