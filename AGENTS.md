# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Lil Guy Cake Shop is a pure static HTML/CSS/JS browser mini-game with **zero dependencies** — no `package.json`, no build tools, no bundler, no backend, no database.

### Running the app

Serve the project root with any static HTTP server. The simplest option:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in Chrome. The entire app is `index.html`, `script.js`, and `style.css`.

### Lint / Test / Build

- **No linter, test runner, or build step is configured.** There are no automated tests to run.
- Since the project uses vanilla JS with no tooling, code review is the primary quality gate.

### Gotchas

- All images are currently inline base64 1x1 pixel placeholders. The `assets/` directories contain only `README.txt` placeholder files (except `cake/plate.png` referenced in `.gitignore` patterns). The game is fully functional despite placeholder art.
- The scoring alert uses `window.alert()`, which blocks the browser thread — dismiss it before interacting further.
