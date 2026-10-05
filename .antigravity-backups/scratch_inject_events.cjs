const fs = require('fs');

// 1. SignupPage.jsx
let signupCode = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');
if (!signupCode.includes('import { trackEvent } from')) {
  signupCode = signupCode.replace(
    "import { useLocation, useNavigate, Link } from 'react-router-dom';",
    "import { useLocation, useNavigate, Link } from 'react-router-dom';\nimport { trackEvent } from '../utils/analytics';"
  );
  
  signupCode = signupCode.replace(
    "await signup(formData.email, formData.password, userData);",
    "await signup(formData.email, formData.password, userData);\n        trackEvent('sign_up', { method: 'email' });"
  );
  fs.writeFileSync('src/pages/SignupPage.jsx', signupCode, 'utf8');
  console.log('Updated SignupPage');
}

// 2. WorkshopAgendaSection.jsx
let agendaCode = fs.readFileSync('src/components/WorkshopAgendaSection.jsx', 'utf8');
if (!agendaCode.includes('import { trackEvent }')) {
  agendaCode = agendaCode.replace(
    "import { collection, getDocs, doc, runTransaction, query, where, getDoc } from 'firebase/firestore';",
    "import { collection, getDocs, doc, runTransaction, query, where, getDoc } from 'firebase/firestore';\nimport { trackEvent } from '../utils/analytics';"
  );
  
  agendaCode = agendaCode.replace(
    "transaction.set(newEnrollmentRef, {",
    "trackEvent('enroll_workshop', { event_id: eventId, status: finalStatus });\n          transaction.set(newEnrollmentRef, {"
  );
  fs.writeFileSync('src/components/WorkshopAgendaSection.jsx', agendaCode, 'utf8');
  console.log('Updated WorkshopAgendaSection');
}

// 3. ContactPage.jsx
let contactCode = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');
if (!contactCode.includes('import { trackEvent }')) {
  contactCode = contactCode.replace(
    "import { useTranslation } from 'react-i18next';",
    "import { useTranslation } from 'react-i18next';\nimport { trackEvent } from '../utils/analytics';"
  );
  
  contactCode = contactCode.replace(
    "setSuccess(true);",
    "setSuccess(true);\n        trackEvent('generate_lead', { type: 'contact_form', subject: formData.subject });"
  );
  fs.writeFileSync('src/pages/ContactPage.jsx', contactCode, 'utf8');
  console.log('Updated ContactPage');
}

