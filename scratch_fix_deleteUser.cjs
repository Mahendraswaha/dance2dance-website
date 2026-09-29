const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

const oldDelete = `        // 2. Apagar usuário no Auth
        await deleteUser(currentUser);`;

const newDelete = `        // 2. Apagar usuário no Auth
        // currentUser do nosso AuthContext é um objeto espalhado {...user, profile}, não a instância real do Firebase.
        // Precisamos usar auth.currentUser que é o objeto original.
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
        }`;

code = code.replace(oldDelete, newDelete);
// Fallback for character encoding issues
code = code.replace(
  "await deleteUser(currentUser);",
  "if (auth.currentUser) await deleteUser(auth.currentUser);"
);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Fixed deleteUser payload');
