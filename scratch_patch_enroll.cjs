const fs = require('fs');

const pages = [
  'src/components/WorkshopAgendaSection.jsx',
  'src/pages/AgendaPage.jsx'
];

for (const file of pages) {
  let code = fs.readFileSync(file, 'utf8');
  
  const blockToInsert = `
      if (!currentUser) {
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      // NOVO: Verificar se o email está confirmado
      await currentUser.reload(); // Recarrega para pegar o status mais recente
      if (!currentUser.emailVerified) {
        alert(t('auth.verifyEmailAlert', 'Falta só um passo! Confirme seu e-mail clicando no link que enviamos para garantir sua vaga.'));
        return;
      }
`;
  
  code = code.replace(
    /      if \(\!currentUser\) \{\s+navigate\('\/login', \{ state: \{ from: window\.location\.pathname \} \}\);\s+return;\s+\}/g,
    blockToInsert
  );
  
  fs.writeFileSync(file, code, 'utf8');
  console.log('Patched', file);
}
