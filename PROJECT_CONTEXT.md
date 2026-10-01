# Dance2Dance — Project Context & Decision Log

> **MANDATORY READ**: Any agent or assistant working on this project MUST read this file completely before proposing any diagnosis, fix, or change. Failure to do so will result in repeating known mistakes that cost hours of work.

---

## 1. Stack & Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 5 + TailwindCSS 3 |
| Routing | React Router v7 (SPA — client-side routing) |
| Backend/Serverless | Vercel Serverless Functions (`/api/*.js`) |
| Database | Firebase Firestore |
| Auth | Firebase Auth |
| Email | **Pro ISP SMTP** (see section 4) |
| Deployment | Vercel (GitHub auto-deploy on push to `main`) |
| i18n | i18next + react-i18next (EN, PT, NO) |
| Rich Text | Tiptap v3 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`) |
| UI | Framer Motion, Lucide React, Sonner (toasts) |

**Single-tenant SaaS** — one organization, one deployment, not multi-tenant.

---

## 2. User Constraints (NON-NEGOTIABLE)

- **GitHub Desktop only**: The user NEVER runs `npm install`, `npm run dev`, or any terminal commands locally. All changes are committed via GitHub Desktop and built by Vercel. Do NOT give terminal instructions to the user.
- **Non-technical end users**: Any CRM or admin input must be visual/WYSIWYG. Users cannot write HTML tags.
- **Dark premium aesthetic**: Background `#0A0A0E`, accent gold `#C9A84C`, text `#FAF8F5`.
- **No native modals**: Use Sonner for toasts/notifications, Framer Motion for animations.

---

## 3. Vercel + SPA Routing (CRITICAL — read before touching vercel.json)

This project is a **Single Page Application (SPA)**. This means:

- There is ONE physical file served: `dist/index.html`
- ALL routes (`/be-the-dance/empresas`, `/pricing`, `/admin`, etc.) are handled by React Router **client-side**
- When a user opens a link in a **new tab** or types a URL directly, the browser requests that path from the Vercel server — which returns 404 because the file doesn't physically exist

**The fix**: `vercel.json` MUST contain a rewrite rule that sends all unknown paths to `/index.html`:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/|sitemap\\.xml|robots\\.txt|\\..*\\..*).*)",
      "destination": "/index.html"
    }
  ],
  "crons": [
    {
      "path": "/api/crm-cron",
      "schedule": "0 8 * * *"
    }
  ]
}
```

**NEVER remove the rewrites block** to "fix" a black screen. A black screen is NEVER caused by the rewrite rule — it is always a JavaScript error.

### How to distinguish the two failure modes:

| Symptom | Cause | Fix |
|---|---|---|
| Vercel error page ("This page doesn't exist", 404 NOT_FOUND) | Missing `rewrites` in `vercel.json` | Add/restore the rewrite rule |
| Black `#0A0A0E` screen, site title appears in tab, no content | JavaScript crash at runtime | Check browser Console (F12) for the real error |
| Raw JSX source code served to browser | Vercel lost framework preset OR `rewrites` pointing to wrong file | Verify the rewrite destination is `/index.html` (the built one) |

---

## 4. Email — Pro ISP SMTP (CRITICAL)

**The user's email provider is Pro ISP (Norwegian hosting provider), NOT Gmail.**

The outgoing emails from `contact@dance2dance.no` MUST be sent using Pro ISP's SMTP server.

### Confirmed working configuration (`api/contact.js`):
```js
const transporter = nodemailer.createTransport({
  host: 'mail.proisp.no',       // Pro ISP SMTP host
  port: 587,
  secure: false,                 // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,  // contact@dance2dance.no
    pass: process.env.EMAIL_PASS,  // Pro ISP account password
  },
});
```

### Environment variables in Vercel:
- `EMAIL_USER` = `contact@dance2dance.no`
- `EMAIL_PASS` = Pro ISP account password for that mailbox

### What was tried and FAILED:
- ❌ **Google App Password / Gmail SMTP**: This routes emails THROUGH the user's personal Gmail account, meaning `dance2dance.no` emails would appear to come from a personal address. This is wrong and took ~2 hours of circular debugging (Sep 30, 2026).
- ❌ **SendGrid / third-party relay**: Not needed. Pro ISP supports direct SMTP.

---

## 5. Vite Build Configuration (CRITICAL — read before touching vite.config.js)

### The circular dependency trap (Sep 30, 2026):

Adding Tiptap (`@tiptap/react`) created a circular chunk dependency when `manualChunks` was configured in `vite.config.js`. The rule `id.includes('react-i18next') → vendor-i18n` and `id.includes('react') → vendor-react` would match `@tiptap/react` in both buckets, creating:

```
vendor-i18n → vendor-react → vendor-i18n (CIRCULAR)
```

**Result**: The site built successfully but crashed on load with:
```
TypeError: Cannot read properties of undefined (reading 'createContext')
at vendor-i18n-xxx.js:1:46347
```

**The fix**: Remove `manualChunks` from `vite.config.js` entirely. Let Vite handle chunking automatically.

### Current safe `vite.config.js` build section:
```js
build: {
  chunkSizeWarningLimit: 2000
}
```

### PowerShell BOM danger:
`Set-Content -Encoding utf8` in PowerShell writes a **UTF-8 BOM** (Byte Order Mark) that breaks Vercel's JSON parser. Always use:
```powershell
[System.IO.File]::WriteAllText("$(pwd)\vercel.json", $jsonString)
```

---

## 6. CRM Email System

### Architecture:
- Email templates stored in Firestore collection: `crm_email_templates`
- Document ID format: `{templateId}_{languageCode}` (e.g., `enrollment_confirmed_pt`)
- Fields: `subject`, `bodyHtml`, `updatedAt`
- Admin UI: `/admin` → "Comunicações" tab → uses `CommunicationsTab.jsx` + `RichTextEditor.jsx`

### Automation (cron jobs):
- Daily cron at 08:00 UTC hits `/api/crm-cron`
- Triggered by Vercel Cron (configured in `vercel.json`)
- External fallback option: `cron-job.org` pointing to `/api/crm-cron`

### Template IDs confirmed in Firestore:
- `enrollment_confirmed` — inscription confirmation
- `waitlist_joined` — waitlist entry
- `waitlist_promoted` — spot opened from waitlist
- `contact_received` — contact form received
- `reminder_1_day` — reminder (1 day before event)
- `post_event_feedback` — post-event feedback
- `inactive_90_days` — re-engagement after 90 days of inactivity

---

## 7. Deployment Checklist

Before committing any change that touches these files, verify:

| File | Risk | Pre-commit check |
|---|---|---|
| `vercel.json` | Breaks routing OR build | Validate JSON is BOM-free. Confirm `rewrites` block is present. |
| `vite.config.js` | Breaks build or creates circular deps | Do NOT add `manualChunks` with library name matching. |
| `package.json` | New deps with `react` in name can break chunks | Check for circular dep risk with existing chunk config. |
| `api/contact.js` | Breaks email sending | Confirm SMTP host is `mail.proisp.no`, NOT Gmail. |
| `src/firebase.js` | Breaks all auth and DB | Do not modify without explicit user request. |

---

## 8. Known Working Routes

| URL Pattern | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/be-the-dance` | Be The Dance program | |
| `/be-the-dance/empresas` | BtdCorporatePage | Opens in new tab from PricingPage — requires SPA rewrite |
| `/biostretch` | Biostretch program | |
| `/biostretch/empresas` | BiostrechCorporatePage | Opens in new tab from PricingPage — requires SPA rewrite |
| `/admin` | AdminDashboard | Auth-gated |
| `/pricing` | PricingPage | |
| `/agenda` | AgendaPage | |
| `/contato` | ContactPage | |
| `/impacto` | ImpactPage | |

---

## 9. Lesson Log (Post-Mortems)

### Sep 30, 2026 — "2-hour Gmail spiral"
- **Symptom**: Contact form emails not working in production.
- **Wrong path taken**: Configured Gmail App Password + Gmail SMTP. This worked technically but routed `dance2dance.no` mail through user's personal Gmail.
- **Root cause of confusion**: Forgot the email provider is Pro ISP, not Gmail.
- **Correct solution**: `nodemailer` with `host: 'mail.proisp.no'`, port 587, credentials for `contact@dance2dance.no`.
- **Cost**: ~2 hours, user slept at 6am with site broken.

### Sep 30, 2026 — "Black screen / vercel.json removal"
- **Symptom**: Site shows black `#0A0A0E` screen after commit.
- **Wrong diagnosis**: "The rewrite rule in `vercel.json` is causing the black screen."
- **Wrong action taken**: Deleted `vercel.json` rewrites. This broke direct URL access (new tab links → 404).
- **Actual cause**: Circular chunk dependency in `vite.config.js` caused `vendor-i18n` to crash on load.
- **Correct fix**: Remove `manualChunks` from `vite.config.js`. Restore `rewrites` in `vercel.json`.
- **Cost**: Multiple rounds of commits, user saw 404 on corporate pages.

---

*Last updated: 2026-10-01. Update this file every time a non-obvious decision is made or a mistake is corrected.*
