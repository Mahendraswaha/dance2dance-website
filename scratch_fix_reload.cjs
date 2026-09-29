const fs = require('fs');

const pages = [
  'src/components/WorkshopAgendaSection.jsx',
  'src/pages/AgendaPage.jsx'
];

for (const file of pages) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the buggy reload
  code = code.replace(
    /await currentUser\.reload\(\); \/\/ Recarrega para pegar o status mais recente/g,
    "import_reload(currentUser); // Recarregado com tratamento seguro"
  );
  
  // Wait, I can't just inject import_reload without importing it.
  // Actually, we can import { reload } from 'firebase/auth' at the top.
  if (!code.includes("import { reload }")) {
    code = code.replace(
      "import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';",
      "import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';\nimport { reload } from 'firebase/auth';"
    );
    // AgendaPage might have different imports
    code = code.replace(
      "import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore';",
      "import { collection, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, onSnapshot, orderBy } from 'firebase/firestore';\nimport { reload } from 'firebase/auth';"
    );
  }
  
  code = code.replace(
    /import_reload\(currentUser\); \/\/ Recarregado com tratamento seguro/g,
    "await reload(currentUser);"
  );
  
  fs.writeFileSync(file, code, 'utf8');
}
console.log('Fixed reload bug');
