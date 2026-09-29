const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// Inject the import
if (!code.includes("import { deleteUser } from 'firebase/auth';")) {
  code = code.replace(
    "import { db } from '../firebase';",
    "import { db } from '../firebase';\nimport { deleteUser } from 'firebase/auth';"
  );
}

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Fixed missing deleteUser import');
