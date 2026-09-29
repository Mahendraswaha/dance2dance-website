const fs = require('fs');
const path = require('path');

const locales = ['pt', 'en', 'no'];
const translations = {
  pt: {
    auth: {
      signupSuccessAlert: "Cadastro concluído! Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada antes de se inscrever nos workshops.",
      verifyEmailMessage: "Seu e-mail ainda não foi confirmado. Você não poderá se inscrever em workshops até confirmar seu e-mail.",
      resendEmailBtn: "Reenviar E-mail"
    },
    profile: {
      confirmDelete: "ZONA DE PERIGO:\nTem certeza absoluta? Esta ação não pode ser desfeita e você perderá o acesso a todas as suas inscrições.",
      accountDeleted: "Sua conta foi excluída com sucesso.",
      dangerZone: "Zona de Perigo",
      dangerZoneDesc: "Ao excluir sua conta, você perderá acesso permanente a todos os seus dados e inscrições. Esta ação é irreversível.",
      deleteAccountBtn: "Excluir Conta"
    }
  },
  en: {
    auth: {
      signupSuccessAlert: "Registration successful! We've sent a confirmation link to your email. Please check your inbox before enrolling in workshops.",
      verifyEmailMessage: "Your email has not been confirmed yet. You will not be able to enroll in workshops until you confirm your email.",
      resendEmailBtn: "Resend Email"
    },
    profile: {
      confirmDelete: "DANGER ZONE:\nAre you absolutely sure? This action cannot be undone and you will lose access to all your enrollments.",
      accountDeleted: "Your account has been successfully deleted.",
      dangerZone: "Danger Zone",
      dangerZoneDesc: "By deleting your account, you will permanently lose access to all your data and enrollments. This action is irreversible.",
      deleteAccountBtn: "Delete Account"
    }
  },
  no: {
    auth: {
      signupSuccessAlert: "Registreringen er fullført! Vi har sendt en bekreftelseslenke til e-posten din. Vennligst sjekk innboksen din før du melder deg på workshops.",
      verifyEmailMessage: "E-posten din er ikke bekreftet ennå. Du vil ikke kunne melde deg på workshops før du har bekreftet e-posten din.",
      resendEmailBtn: "Send e-post på nytt"
    },
    profile: {
      confirmDelete: "FARESØNE:\nEr du helt sikker? Denne handlingen kan ikke angres, og du vil miste tilgang til alle dine påmeldinger.",
      accountDeleted: "Kontoen din har blitt slettet.",
      dangerZone: "Faresone",
      dangerZoneDesc: "Ved å slette kontoen din, vil du permanent miste tilgang til alle dine data og påmeldinger. Denne handlingen er irreversibel.",
      deleteAccountBtn: "Slett Konto"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.auth) data.auth = {};
  if (!data.profile) data.profile = {};
  
  // Inject auth
  for (const [key, val] of Object.entries(translations[lang].auth)) {
    data.auth[key] = val;
  }
  
  // Inject profile
  for (const [key, val] of Object.entries(translations[lang].profile)) {
    data.profile[key] = val;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
}
