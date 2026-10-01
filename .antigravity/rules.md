# Dance2Dance Project Rules

## MANDATORY PROTOCOL — Read before ANY action

Before proposing any diagnosis, fix, command, or file change on this project, you MUST:

1. **Read `PROJECT_CONTEXT.md`** in the project root completely.
2. **Check the Lesson Log** (Section 9) — has this exact symptom appeared before?
3. **Check the relevant section** for the component you're about to touch (Vercel, Vite, Email, etc.).

## Diagnostic Rules

- A **black screen** (`#0A0A0E`, no content, site title visible in tab) is ALWAYS a JavaScript runtime error. Check the browser Console. NEVER blame `vercel.json` rewrites.
- A **Vercel 404 page** ("This page doesn't exist") on direct URL access means the SPA rewrite rule is missing from `vercel.json`. NEVER remove the rewrites block.
- **Email problems**: The provider is Pro ISP (`mail.proisp.no`), NOT Gmail. Do not suggest Gmail App Passwords or Gmail SMTP.
- **Vite build**: Do NOT add `manualChunks` to `vite.config.js`. It creates circular dependencies with Tiptap.
- **PowerShell file writes**: Always use `[System.IO.File]::WriteAllText()`. Never `Set-Content -Encoding utf8` (adds BOM that breaks JSON parsers).

## User Constraints

- User commits via **GitHub Desktop only**. No terminal instructions to the user.
- All admin inputs must be **visual/WYSIWYG**. No raw HTML editing for end users.
