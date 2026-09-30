const fs = require('fs');

function fixSmtp(filename) {
    let code = fs.readFileSync(filename, 'utf8');
    code = code.replace(/host: 'smtp\.gmail\.com',\s*port: 465,\s*secure: true,/m, "host: process.env.SMTP_HOST || 'smtp.gmail.com',\n    port: parseInt(process.env.SMTP_PORT || '465', 10),\n    secure: process.env.SMTP_PORT == '465',");
    fs.writeFileSync(filename, code);
}

fixSmtp('api/agenda-notify.js');
fixSmtp('api/contact.js');
