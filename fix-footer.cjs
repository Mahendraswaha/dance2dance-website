const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

// Fix the footer question mark (handling possible encoding artifacts)
code = code.replace(/<\/a>\s*(\?|)\s*<a/g, '</a> | <a');
code = code.replace(/<\/a> \? <a/g, '</a> | <a');

// Fix the link style to be clearly an underlined link in gold
code = code.replace(/style="color: #9A9A9A; text-decoration: none; border-bottom: 1px dotted #9A9A9A;/g, 'style="color: #C9A84C; text-decoration: underline;');

fs.writeFileSync('api/agenda-notify.js', code);
console.log('Fixed footer and link style.');
