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
<type>: <subject> [#issue]
Allowed types: feat, fix, docs, refactor, test, ci, chore.

Examples:

vbnet
feat: add child profile card
fix: handle 401 on refresh #42
docs: update onboarding guide
Branching
feat/<name>

fix/<name>

docs/<name>

chore/<name>
```

We use GitHub Actions (CI) for code validation.
Each push/PR runs checks:

TypeScript typecheck

ESLint linting

Prettier format check

Project build

If any step fails, CI blocks the merge until it’s fixed.
VS Code Setup

We include a .vscode/ folder in the repo for a consistent development environment:

Auto-format on save with Prettier.

ESLint fixes on save and import organization.

Tailwind CSS IntelliSense, Prisma formatter, i18n-ally.

ErrorLens + GitLens for better visibility and history.

Optional AI helper (Cloud/Codeium) for code suggestions.

👉 How to enable:

Open the repo in VS Code using:

code .

A prompt will appear: “This workspace has recommended extensions”.

Click Install All.

If formatting doesn’t run on save → select Prettier as the default formatter in the status bar.
