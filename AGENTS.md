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

- Keep Netlify (Hosting, Functions, Edge Functions, Blobs) and Resend on
  their free tiers — never trigger billing without explicit user
  confirmation.
- Keep the codebase a small, single-purpose CV builder (form → live preview
  → print/export), not a general app framework — avoid premature
  abstraction (routing, state libraries, backend) beyond current scope.
  The only server-side code is the login gate under `netlify/`.
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
  state only.
- **Hosting & auth:** Netlify, auto-deployed from `master` (`netlify.toml`).
  Every request passes `netlify/edge-functions/auth-gate.js`, which requires
  a signed `cv_session` cookie. Login is `public/login/` (plain HTML/JS,
  loads without the gated app bundle): fixed username → OTP emailed via
  Resend to a fixed address → `/api/verify-otp` sets the cookie. OTP state
  lives in Netlify Blobs. Config via env vars listed in `.env.example`.
  See `@.agents/rules/netlify-cost-safety.md`.
- **Notes:** Print output relies on `@media print` CSS patterns
  (`.no-print`, `.page-break`) — see `@.agents/rules/css-conventions.md`.

---

## Hard Rules (always apply)

- Never enable/upgrade any billable Netlify, Resend or other cloud service,
  or touch billing/payment settings, without explicit user confirmation first.
- Deploys happen by pushing to `master` — only push/merge there when the
  user asks. New features in `netlify.toml` require confirmation.
- Never weaken the auth gate (excluded paths, cookie checks, OTP limits)
  without explicit user confirmation.
- When replying in Vietnamese, the agent refers to itself as "em" and
  addresses the user as "đại ca".

(Full detail: `@.agents/rules/netlify-cost-safety.md`, `@.agents/rules/PRONOUNS.md`)

---

## Rule File Index

| File | Load when... |
|---|---|
| `@.agents/rules/netlify-cost-safety.md` | Any task touching `netlify.toml`, `netlify/`, `public/login/`, deploys, billing/plan changes, email sending, or adding a new cloud service. |
| `@.agents/rules/file-organization.md` | Adding/moving files or folders, creating a new component, deciding where a CSS/asset file belongs. |
| `@.agents/rules/react-conventions.md` | Writing or editing React components: component declaration style, state updates, event handler naming, JSX/list-rendering patterns. |
| `@.agents/rules/css-conventions.md` | Writing or editing CSS: class naming, color/spacing variables, units (`rem`/`px`/`mm`/`%`), inline style vs class decisions, print styles. |
| `@.agents/rules/PRONOUNS.md` | Any reply written in Vietnamese — governs self-reference ("em") and how the user is addressed ("đại ca"). |
