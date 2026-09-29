const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// Replace { db } with { db, auth } if auth is not there
code = code.replace(
  "import { db } from '../firebase';",
  "import { db, auth } from '../firebase';"
);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Fixed missing auth import in ProfilePage');
