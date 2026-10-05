const fs = require('fs');

const pages = [
  'src/components/WorkshopAgendaSection.jsx',
  'src/pages/AgendaPage.jsx'
];

for (const file of pages) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("import { auth } from '../firebase'")) {
     code = code.replace(
       "import { db } from '../firebase';",
       "import { db, auth } from '../firebase';"
     );
  }
  
  code = code.replace(
    "await reload(currentUser);\n        if (!currentUser.emailVerified)",
    "if (auth.currentUser) await reload(auth.currentUser);\n        if (!auth.currentUser?.emailVerified)"
  );
  
  // Also handle carriage returns
  code = code.replace(
    "await reload(currentUser);\r\n        if (!currentUser.emailVerified)",
    "if (auth.currentUser) await reload(auth.currentUser);\r\n        if (!auth.currentUser?.emailVerified)"
  );

  fs.writeFileSync(file, code, 'utf8');
}

console.log('Fixed auth.currentUser reload issue');
