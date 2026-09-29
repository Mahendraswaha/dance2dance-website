const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');

const actionSettings = `
      const actionCodeSettings = {
        url: window.location.origin + '/agenda',
        handleCodeInApp: false
      };`;

code = code.replace(
  "await sendEmailVerification(user);",
  actionSettings + "\n      await sendEmailVerification(user, actionCodeSettings);"
);

code = code.replace(
  "await sendEmailVerification(currentUser);",
  actionSettings + "\n      await sendEmailVerification(auth.currentUser, actionCodeSettings);" // Fixed from currentUser to auth.currentUser here too!
);

fs.writeFileSync('src/contexts/AuthContext.jsx', code, 'utf8');
console.log('ActionCodeSettings applied to sendEmailVerification');
