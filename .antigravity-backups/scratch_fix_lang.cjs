const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');

// Ensure i18n is available
if (!code.includes("import i18n from 'i18next';") && !code.includes("import i18n from '../i18n';")) {
  code = code.replace(
    "import { auth, db } from '../firebase';",
    "import { auth, db } from '../firebase';\nimport i18n from '../i18n';"
  );
}

// Modify signup block
const oldSignupBlock = `    // Enviar email de verificação
    try {
      await sendEmailVerification(user);
    } catch (err) {
      console.error("Erro ao enviar email de verificação:", err);
    }`;

const newSignupBlock = `    // Enviar email de verificação
    try {
      auth.languageCode = i18n.language || 'pt';
      await sendEmailVerification(user);
    } catch (err) {
      console.error("Erro ao enviar email de verificação:", err);
    }`;

code = code.replace(oldSignupBlock, newSignupBlock);

// Modify resend block
const oldResendBlock = `  async function resendVerificationEmail() {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  }`;

const newResendBlock = `  async function resendVerificationEmail() {
    if (currentUser) {
      auth.languageCode = i18n.language || 'pt';
      await sendEmailVerification(currentUser);
    }
  }`;

code = code.replace(oldResendBlock, newResendBlock);

fs.writeFileSync('src/contexts/AuthContext.jsx', code, 'utf8');
console.log('AuthContext language code patched');
