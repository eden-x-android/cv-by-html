# AGENTS.md — cv-builder

> Entry point for AI coding agents (Antigravity, Claude Code, Cursor, etc.).
> Detailed rules live in separate files under `.agents/rules/` and are
> referenced below using `@filename` so agents can pull them into context
> only when relevant.

---

## How to use this file

1. Read this file first in every session.
2. Treat anything under **Hard Rules** as non-negotiable, regardless of
   which topic file is loaded.
3. Before starting a task, check the **Rule File Index** below and load the
   file(s) whose trigger matches the task. Load more than one file if the
   task spans categories.
4. If a rule conflicts with a user instruction, follow the rule and explain
   why — unless the rule itself says to stop and ask first.

---

## Project Goals

- Keep Firebase usage on the free Spark plan / Hosting free tier — never
  trigger billing without explicit user confirmation.
- Keep the codebase a small, single-purpose CV builder (form → live preview
  → print/export), not a general app framework — avoid premature
  abstraction (routing, state libraries, backend) beyond current scope.
- Predictable, print-accurate rendering: form state maps 1:1 to the printed
  CV layout, with explicit control over page breaks.
- Consistent component/CSS conventions so form and preview stay easy to
  extend with new CV sections.

---

## Project Snapshot

- **Stack:** React 19 + Vite 7, plain CSS (no CSS-in-JS/Tailwind), ESLint 9.
- **Architecture:** Single-page app, prop-drilled state — `App.jsx` owns all
  CV data via `useState`, passes it down to `CVForm` (editor) and
  `CVPreview` (rendered/printable output). No router, no global store.
- **Data layer:** No backend/database — CV data lives in client-side React
  state only. Firebase is used solely for static Hosting (deploy target),
  see `@.agents/rules/firebase-cost-safety.md`.
- **Notes:** Print output relies on `@media print` CSS patterns
  (`.no-print`, `.page-break`) — see `@.agents/rules/css-conventions.md`.

---

## Hard Rules (always apply)

- Never enable/upgrade any billable Firebase or cloud service, or touch
  billing/payment settings, without explicit user confirmation first.
- `firebase deploy --only hosting` is pre-approved (safe, free-tier static
  deploy); anything beyond Hosting in `firebase.json` requires confirmation.
- When replying in Vietnamese, the agent refers to itself as "em" and
  addresses the user as "đại ca".

(Full detail: `@.agents/rules/firebase-cost-safety.md`, `@.agents/rules/PRONOUNS.md`)

---

## Rule File Index

| File | Load when... |
|---|---|
| `@.agents/rules/firebase-cost-safety.md` | Any task touching `firebase.json`, `.firebaserc`, `firebase deploy`, billing/plan changes, or adding a new cloud service. |
| `@.agents/rules/file-organization.md` | Adding/moving files or folders, creating a new component, deciding where a CSS/asset file belongs. |
| `@.agents/rules/react-conventions.md` | Writing or editing React components: component declaration style, state updates, event handler naming, JSX/list-rendering patterns. |
| `@.agents/rules/css-conventions.md` | Writing or editing CSS: class naming, color/spacing variables, units (`rem`/`px`/`mm`/`%`), inline style vs class decisions, print styles. |
| `@.agents/rules/PRONOUNS.md` | Any reply written in Vietnamese — governs self-reference ("em") and how the user is addressed ("đại ca"). |
