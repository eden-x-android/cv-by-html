---
name: agents-md-generator
description: Generate a master AGENTS.md rule-index file for a coding project, to be placed at the project root for use by Antigravity, Claude Code, Cursor, and similar coding agents. Use this skill whenever the user asks to "generate AGENTS.md", "create a master rule file", "build the rule index", "set up agent rules for this project", or wants a project-root rules file that indexes existing per-topic rule files (e.g. under .agent/rules/) and summarizes the project's actual tech stack and architecture. Trigger this even if the user just says "make me an AGENTS.md for this project" without further detail — this skill defines the structure and the discovery process. Do NOT use this skill for writing the individual topic rule files themselves (architecture, styling, etc.) — only for generating the top-level master/index file that points to them.
---

# AGENTS.md Generator

Generates a master `AGENTS.md` file at the project root. This file is intentionally short and has exactly three jobs:

1. Tell the agent **how to use this file** (load order, what's non-negotiable).
2. State the **Project Goals** (a handful of durable, high-level goals — not a feature list).
3. Provide a **Rule File Index** — an auto-discovered table pointing to the project's existing per-topic rule files, with a one-line "load when..." trigger for each.

This skill does NOT write the topic rule files (architecture, styling, tech-stack versions, etc.). It only discovers them and writes the index that points to them, plus a short tech-stack/architecture summary derived from reading the actual codebase.

If the per-topic rule files don't exist yet, see "No rule files found" below — do not invent rule content to fill the index.

---

## Step 1 — Locate the rules folder

Look for a rules folder in this order:

1. `.agent/rules/`
2. `.agents/rules/`
3. `agent/rules/` or `rules/` at project root

If one of these exists and contains `.md` files, use it and skip to Step 2.

**If none exist** (or the folder exists but is empty): STOP and ask the user where their per-topic rule files live, or whether they want this skill to only scaffold the rules folder path without an index yet (see "No rule files found" below). Do not guess a folder name and do not silently create one.

---

## Step 2 — Build the Rule File Index from what's actually there

For each `.md` file found in the rules folder (non-recursive is fine unless the user's structure is nested):

1. Read the file's first heading and first paragraph (or first ~30 lines if there's no clear summary) to understand its topic.
2. Write one row in the index table:
   - **File** — relative path using `@` syntax, e.g. `@.agent/rules/04-tech-stack-versions.md`
   - **Load when...** — a short, concrete trigger description of *when an agent should pull this file into context*, phrased as a list of task types/keywords, not a restatement of the filename. Base this on the file's actual content, not assumptions from the filename alone.

Sort the table in the same order as the filenames (numeric prefixes if present, otherwise alphabetical).

Do not summarize or duplicate the *content* of each rule file into AGENTS.md — only the index row. The whole point of indexing is to avoid loading everything at once.

If a file clearly contains "always apply, no exceptions" content (e.g. a hard-forbidden list, a permission-gate rule like "never modify the database without asking"), surface that single rule directly in AGENTS.md under a short "Hard Rules (always apply)" section in addition to its index row — but keep this section short (a bullet list, not a copy of the file). Use judgment: most projects will have at most one such file.

---

## Step 3 — Derive Project Goals and a project summary by reading the codebase

Do not ask the user to describe their project — read it yourself. This requires going past config files into actual source code, since config files only show *what's installed*, not *how it's actually used*.

Minimum discovery pass:

1. **Package manifest** (`package.json`, `pyproject.toml`, `composer.json`, etc.) — name, dependencies, scripts.
2. **Top-level source structure** (`src/`, `app/`, etc.) — view 2 levels deep to see the architectural pattern in use (FSD, MVC, feature folders, monorepo packages, etc.).
3. **Read actual implementation files, not just folder names** — open 3-6 representative files to confirm real patterns, for example:
   - A data-access file (e.g. a hook or repository) to see the actual query/ORM/API pattern in use, not just which library is installed.
   - A state-management file (store, context, reducer) to see how state is actually structured.
   - A component or route file to see the actual framework conventions in use (e.g. which router API, which form library, which UI primitives).
   - If there's a backend/functions directory, open one handler to see the actual validation/auth/error pattern.
4. **Any existing README** — useful for stated purpose/domain, but verify against the code rather than trusting it blindly (READMEs go stale).

From this, write:

- **Project Goals**: 3-6 bullets, durable and high-level (the kind of thing that stays true for months), e.g. "Keep Firebase Blaze usage near-free", "Maintain predictable ERP behavior". Derive these from what the codebase is actually protecting against or optimizing for (cost patterns, validation layers, architectural boundaries you observed) — don't invent generic goals like "write clean code." If the rules folder itself states goals (many do, in an overview section), prefer pulling them from there rather than re-deriving from scratch, but verify they still match what the code shows.
- **A short project snapshot** (3-6 bullets): language/framework, key libraries with versions where it matters for syntax (e.g. "React 19", "React Query v5" — version matters when APIs have breaking changes between majors), the architectural pattern observed, and the backend/data layer in use. This is a snapshot, not a tutorial — point to the relevant rule file (if one exists) for the details rather than re-explaining version-specific syntax here.

If the codebase is large, don't try to read everything — sample deliberately (one file per architectural layer is usually enough to confirm the pattern) rather than exhaustively.

---

## Step 4 — Check for an existing AGENTS.md at the root

If `AGENTS.md` already exists at the project root:

**Always ask the user before overwriting.** Show them a short diff-style summary (what the new version would change: new/removed index rows, updated goals, etc.) and confirm before writing. Never overwrite silently, even if the existing file looks auto-generated.

If the user confirms, proceed to Step 5. If they decline, stop and ask what they'd like instead (e.g. write to a different filename, or merge specific sections only).

---

## Step 5 — Write AGENTS.md

Use the structural skeleton below. Headings and section order stay fixed; bracketed text is what gets filled in per project. Omit the "Hard Rules" section entirely if Step 2 found nothing that qualifies — don't leave an empty heading.

````markdown
# AGENTS.md — [Project Name]

> Entry point for AI coding agents (Antigravity, Claude Code, Cursor, etc.).
> Detailed rules live in separate files under `[rules folder path]` and are
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

- [Goal 1 — durable, high-level, derived from the codebase]
- [Goal 2]
- [Goal 3]
- [...]

---

## Project Snapshot

- **Stack:** [language/framework + key libraries with versions where syntax
  is version-sensitive]
- **Architecture:** [observed pattern — e.g. Feature-Sliced Design, MVC,
  monorepo packages — based on actual folder/file inspection, not assumption]
- **Data layer:** [DB/ORM/API pattern actually observed in code]
- **Notes:** [anything else load-bearing for an agent working in this repo —
  keep to 1-2 lines, point to a rule file for detail instead of explaining
  it here]

---

## Hard Rules (always apply)

<!-- Only include this section if Step 2 found an always-apply file
     (hard-forbidden list, permission-gate rule, etc.). Keep it to a short
     bullet list — do not paste the full source file content here. -->

- [Rule 1, one line]
- [Rule 2, one line]

(Full detail: `@[path to the source rule file]`)

---

## Rule File Index

| File | Load when... |
|---|---|
| `@[rules folder path]/[file-1].md` | [concrete trigger description derived from that file's actual content] |
| `@[rules folder path]/[file-2].md` | [...] |
| `@[rules folder path]/[file-3].md` | [...] |

<!-- Add/remove rows to match what Step 2 actually discovered. -->
````

Filling-in notes:

- The index table is the core deliverable — keep each "Load when..." description concrete (task types, keywords, file types) rather than vague ("for styling stuff"). An agent should be able to scan the column and know immediately whether the current task matches.
- Don't restate a topic file's content in the Project Goals or Project Snapshot sections — point to the file instead. The snapshot exists so an agent has enough context to *pick* the right rule file, not to replace reading it.
- If the project has no clear "Hard Rules" candidate, delete that whole section rather than leaving it empty or filling it with filler text.

Keep the whole file well under the ~12,000 character rule-file limit used by tools like Antigravity — this file should typically land between 100-250 lines. It is an index, not a manual; if it's getting long, that's a sign content is leaking in from the topic files and should be cut back to a one-line trigger description.

Write the file to the project root as `AGENTS.md`.

---

## No rule files found

If Step 1 turns up no rules folder at all, do not fabricate one. Tell the user clearly:

> No rules folder found (checked `.agent/rules/`, `.agents/rules/`, `agent/rules/`, `rules/`). AGENTS.md indexes existing rule files — I'd need those to exist first. Want me to (a) point you to a separate rule-writing pass first, or (b) scaffold just the index structure now with placeholder rows you'll fill in once the rule files exist?

Only proceed with placeholders if the user explicitly chooses (b), and mark placeholder rows clearly (e.g. `<!-- TODO: add rule file -->`) so they're not mistaken for real entries later.