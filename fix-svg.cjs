const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

const svgRegex = /<svg[\s\S]*?<\/svg>/g;
code = code.replace(svgRegex, '<span style="color: #C9A84C; margin-right: 4px;">&#9679;</span>');

fs.writeFileSync('api/agenda-notify.js', code);
console.log('Replaced SVG with bullet');
