const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// Insert a banner right inside the main tag
const bannerCode = `
        <main className="flex-grow pt-40 md:pt-48 pb-24 px-4 sm:px-6 relative">
          {currentUser && !currentUser.emailVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-8 bg-red-950/40 border border-red-500/30 p-4 rounded-[2px] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <p className="text-sm font-sans font-light">
                  {t('auth.verifyEmailMessage', 'Seu e-mail ainda não foi confirmado. Você não poderá se inscrever em workshops até confirmar seu e-mail.')}
                </p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    await resendVerificationEmail();
                    alert(t('auth.verifyEmailSent', 'E-mail de verificação reenviado. Verifique sua caixa de entrada.'));
                  } catch (e) {
                    alert('Erro: ' + e.message);
                  }
                }}
                className="text-xs font-heading tracking-[1px] uppercase bg-red-900/50 hover:bg-red-800 text-white px-4 py-2 rounded-[2px] transition-colors whitespace-nowrap"
              >
                {t('auth.resendEmailBtn', 'Reenviar E-mail')}
              </button>
            </motion.div>
          )}

          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #222 0%, transparent 60%)' }} />
`;

// Also need to import AlertCircle if not imported
if (!code.includes('AlertCircle')) {
  code = code.replace(
    "import { User, Mail, Calendar, Settings, ChevronRight, LogOut, Loader2, Sparkles, AlertCircle, Heart, Star, CalendarPlus, X } from 'lucide-react';",
    "import { User, Mail, Calendar, Settings, ChevronRight, LogOut, Loader2, Sparkles, Heart, Star, CalendarPlus, X, AlertCircle } from 'lucide-react';"
  );
  // Just in case it's imported differently
  code = code.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    (match, p1) => {
      if (!p1.includes('AlertCircle')) {
        return `import { ${p1}, AlertCircle } from 'lucide-react';`;
      }
      return match;
    }
  );
}

// And resendVerificationEmail from AuthContext
code = code.replace(
  "const { currentUser, logout, updateProfileData } = useAuth();",
  "const { currentUser, logout, updateProfileData, resendVerificationEmail } = useAuth();"
);
code = code.replace(
  "const { currentUser, logout } = useAuth();",
  "const { currentUser, logout, updateProfileData, resendVerificationEmail } = useAuth();"
);

code = code.replace(
  /<main className="flex-grow pt-40 md:pt-48 pb-24 px-4 sm:px-6 relative">\s*<div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient\(circle at 50% 50%, #222 0%, transparent 60%\)' }} \/>/g,
  bannerCode
);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('ProfilePage patched');
