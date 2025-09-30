# KindInOut

## Overview

KindInOut is an app for managing child check-in/out in courses and clubs. Built with:

- Next.js + TypeScript
- Tailwind CSS + shadcn/ui
- ESLint + Prettier
- Husky + lint-staged + commitlint
- PNPM + Volta
- GitHub Actions (coming next step)

---

## Getting Started

### Requirements

- Node.js 22.x (pinned with Volta)
- pnpm 9.x

### Install

```bash
pnpm install
Scripts
pnpm dev — run dev server

pnpm build — build

pnpm start — run production

pnpm lint — lint with ESLint

pnpm lint:fix — fix issues

pnpm format — format code

pnpm format:check — check format

pnpm typecheck — run TypeScript type checks

Pre-commit Hooks
Husky runs checks before commit:

pre-commit: lint-staged → ESLint + Prettier on staged files.

commit-msg: commitlint → validates commit message format.

Commit Rules
Format:

bash
Копировать код
<type>: <subject> [#issue]
Allowed types: feat, fix, docs, refactor, test, ci, chore.

Examples:

vbnet
Копировать код
feat: add child profile card
fix: handle 401 on refresh #42
docs: update onboarding guide
Branching
feat/<name>

fix/<name>

docs/<name>

chore/<name>
```
