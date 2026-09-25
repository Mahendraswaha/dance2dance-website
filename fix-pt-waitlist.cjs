const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

const regex = /<p>A lista de espera girou e sua vaga para o <strong>\$\{workshopName\}<\/strong> \(dia \$\{workshopDate\}, [^\s]+ \$\{workshopTime\}\) est[^\s]+ confirmada\.<\/p>/;
const replacement = `<p>A lista de espera girou e sua vaga para o retiro:</p><p style="margin-bottom: 5px;"><strong>\${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: \${workshopDate}</p><p style="margin-top: 0;">hora: \${workshopTime}</p>`;

code = code.replace(regex, replacement);
fs.writeFileSync('api/agenda-notify.js', code);
console.log('Fixed PT waitlist_promoted text');
