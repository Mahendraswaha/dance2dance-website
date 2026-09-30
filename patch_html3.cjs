const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');
code = code.replace(/\.replace\(\/class="divider"\/g, 'style="height: 1px; background-color: rgba\\(201, 168, 76, 0\.2\\); margin: 35px 0;"\)/, 
    `.replace(/class="divider"/g, 'style="height: 1px; background-color: rgba(201, 168, 76, 0.2); margin: 35px 0;"')\n      .replace(/<p>/g, '<p style="margin-top: 15px; margin-bottom: 15px;">')`);
fs.writeFileSync('api/agenda-notify.js', code);

code = fs.readFileSync('api/contact.js', 'utf8');
code = code.replace(/\.replace\(\/class="divider"\/g, 'style="height: 1px; background-color: rgba\\(201, 168, 76, 0\.2\\); margin: 35px 0;"\)/, 
    `.replace(/class="divider"/g, 'style="height: 1px; background-color: rgba(201, 168, 76, 0.2); margin: 35px 0;"')\n      .replace(/<p>/g, '<p style="margin-top: 15px; margin-bottom: 15px;">')`);
fs.writeFileSync('api/contact.js', code);
