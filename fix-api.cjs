const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

code = code.replace(
    /if \(type === 'enrollment_confirmed'\) templatePrefix = 'enrollment_confirmed';/,
    `if (type === 'enrollment_confirmed' || type === 'enrolled') templatePrefix = 'enrollment_confirmed';`
);

fs.writeFileSync('api/agenda-notify.js', code);
