const fs = require('fs');

const pages = [
  'src/components/WorkshopAgendaSection.jsx',
  'src/pages/AgendaPage.jsx'
];

for (const file of pages) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes("import { reload } from 'firebase/auth';")) {
     code = code.replace(
       "import { db, auth } from '../firebase';",
       "import { db, auth } from '../firebase';\nimport { reload } from 'firebase/auth';"
     );
  }
  
  fs.writeFileSync(file, code, 'utf8');
  console.log('Fixed reload import in', file);
}
