const fs = require('fs');

const pages = [
  'src/components/WorkshopAgendaSection.jsx',
  'src/pages/AgendaPage.jsx'
];

for (const file of pages) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the reload call
  code = code.replace(
    /await reload\(currentUser\);/g,
    "if (auth.currentUser) await reload(auth.currentUser);"
  );
  
  // Replace the verification check (only the one associated with the check)
  code = code.replace(
    /if \(\!currentUser\.emailVerified\)/g,
    "if (!auth.currentUser?.emailVerified)"
  );
  
  fs.writeFileSync(file, code, 'utf8');
  console.log('Fixed auth.currentUser logic in', file);
}
