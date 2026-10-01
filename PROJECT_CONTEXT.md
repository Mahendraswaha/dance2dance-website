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

---

## 10. Business Context & Architectural Decisions

**Current Phase: PHASE 1 (Bootstrapping)**
The user is building this business from scratch with zero external funding. The primary directive for Phase 1 is **minimizing operational costs** and validating the model. We build in-house MVPs and leverage existing paid infrastructure (like Pro ISP). 

**Future Phase: PHASE 2 (Scaling)**
When the business gains traction and volume increases, the user *wants* to adopt specialized, scalable tools (geometric scaling). The agent must be intelligent enough to recognize when the project is outgrowing Phase 1 and proactively suggest Phase 2 upgrades.

### CRM: Built in-house (Core SaaS Product Feature)
**Decision**: Continuously evolve the custom micro-CRM inside the admin dashboard.
**Business Context**: The user has identified an underserved niche that lacks the budget for market solutions (HubSpot, ActiveCampaign, or even self-hosted Mautic). The micro-CRM is NOT a throwaway MVP; it is being shaped into a low-cost, high-value SaaS offering for this exact niche.
**Strategy**: Do NOT suggest migrating to third-party CRMs as the business scales. Instead, act as a lead engineer to help architect advanced CRM features (like drip campaigns, contact history, and analytics) *within* the current Serverless/Firebase stack to increase the product's competitive value.

### Email: Nodemailer with Pro ISP SMTP (Phase 1)
**Decision**: Use `nodemailer` pointing at Pro ISP's SMTP server.
**Why**: Zero extra cost (included in current hosting). Handles current volume perfectly.
**When to suggest Phase 2 (SendGrid, Resend, Postmark)**:
- If the user reports that CRM emails are landing in Spam/Junk folders (deliverability issues).
- If Pro ISP rate limits are hit (e.g., sending hundreds of emails per hour).
- If detailed analytics (open rates, click rates, bounce tracking) become critical for the business.

### Deployment: Vercel (Phase 1 & 2)
**Decision**: Vercel handles build, CDN, and serverless functions. Fits both current needs and scales well.

### Database & Backend Logic: Firebase Spark Plan + Vercel
**Decision**: Firestore for all persistent data. Firebase is on the Spark (Free) plan.
**Constraint**: Because we are on the Free plan, we CANNOT use Firebase Cloud Functions (database triggers). 
**The Orchestrator Pattern**: The user's browser (React frontend) acts as the "Maestro". It must write to Firestore and then immediately call Vercel Serverless APIs to execute backend logic (like sending emails).
**Vulnerability & Fix (The Outbox)**: Because the client orchestrates, if the user loses internet or closes the tab between the Firestore write and the Vercel API call, data becomes orphaned.
*Actual Implementation (Already exists)*: When a user enrolls, the frontend saves the enrollment with `emailSent: false`. If the Vercel API succeeds, it updates to `emailSent: true`. Failed ones show up in `OverviewTab.jsx` as "Outbox" for manual retry.
**Cron Job Automation (The Robot User)**: The Vercel Cron job (`api/crm-cron.js`) acts as a sweeper for these `emailSent: false` records. To allow the unauthenticated Vercel Cron to update Firestore without exposing a Service Account, we use a **"Robot User"** strategy. The cron job logs into Firebase Auth via REST API using a dedicated email/password stored securely in Vercel Environment Variables.
**NEVER suggest**: "Use a Firebase Cloud Function for this trigger", a database migration, or using Google Cloud Service Account JSONs.

---

## 11. Current State of the Project (update each session)

### Working in production (www.dance2dance.no)
- Full website with EN/PT/NO i18n
- Event agenda + workshop registration + waitlist system
- Firebase Auth (admin login)
- Admin dashboard: events, users, wishlists, overview
- Contact form (Pro ISP SMTP)
- Agenda notification emails
- CRM Communications tab with WYSIWYG email editor (Tiptap)
- CRM email templates in Firestore (7 templates, 3 languages = 21 documents)
- Vercel Cron at 08:00 UTC hitting `/api/crm-cron`
- SPA routing via `vercel.json` rewrites
- Pitch deck at `/pitch-deck.html`

### Partially implemented / in progress
- `api/crm-cron.js` — skeleton exists, logic for sending automated emails needs completion
- Cron triggers needed: "1 day before event" reminder, "90 days inactive" re-engagement, "post event feedback"

### Planned (not started)
- CRM contact history per user (log of emails sent)
- Student profile page improvements
- Analytics dashboard for admin

---

## 12. Agent Self-Update Protocol

After every session where a significant decision is made, the agent MUST update this file:

- New library installed → update Section 1 (Stack)
- New route added → update Section 8 (Known Working Routes)
- Something tried and failed → add to Section 9 (Lesson Log)
- Architectural decision made → add to Section 10
- Feature completed → move to Section 11 (Working)
- Feature started → add to Section 11 (In progress)

This file is the single source of truth. The agent's memory resets between sessions. This file does not.

---

## 13. Deployment Flow (agent reference)

The user NEVER runs commands locally. The full deployment flow is:

```
Agent edits files on disk
  → User opens GitHub Desktop
  → User commits the changed files
  → User clicks "Push to origin"
  → Vercel detects the push automatically
  → Vercel runs npm run build (~30 seconds)
  → New version is live at www.dance2dance.no
  → User refreshes browser (Ctrl+F5 to bypass cache)
```

**Do NOT tell the user to refresh immediately after a commit.** The Vercel build takes ~30 seconds. Say: "After Vercel finishes building (about 30 seconds after your push), then refresh."

**Do NOT tell the user to run npm install or any terminal command.** Vercel installs dependencies automatically during its build.

---

*Last updated: 2026-10-01. Update this file every time a non-obvious decision is made or a mistake is corrected.*
