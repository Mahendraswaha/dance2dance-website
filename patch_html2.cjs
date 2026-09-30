const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');
code = code.replace(/color: #F0EDE8; font-size: 15px;/, 'color: #9A9A9A; font-size: 15px;');
fs.writeFileSync('api/agenda-notify.js', code);

code = fs.readFileSync('api/contact.js', 'utf8');
code = code.replace(/color: #F0EDE8; font-size: 15px;/, 'color: #9A9A9A; font-size: 15px;');
fs.writeFileSync('api/contact.js', code);
