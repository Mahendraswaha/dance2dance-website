const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

// 1. Add the hover style to the <head>
const styleInsert = `.footer a { color: #C9A84C; text-decoration: none; }
        .loc-link:hover { color: #C9A84C !important; }`;
code = code.replace('.footer a { color: #C9A84C; text-decoration: none; }', styleInsert);

// 2. Fix the link HTML (replace color: #C9A84C with #9A9A9A and add class="loc-link")
const linkRegex = /<a href="\$\{locationMapLink\}" target="_blank" style="color: #C9A84C; text-decoration: underline;/g;
code = code.replace(linkRegex, '<a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline;');

// 3. ENROLLED text replacements (regex adapted for potential encoding issues)
// PT
code = code.replace(/<p>Sua presen[^\s]* no <strong>\$\{workshopName\}<\/strong> \(dia \$\{workshopDate\}, [^\s]* \$\{workshopTime\}\) est[^\s]* confirmada\.<\/p>/, 
  '<p>Confirmamos sua inscri&ccedil;&atilde;o no workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: ${workshopDate}</p><p style="margin-top: 0;">hora: ${workshopTime}</p>');

// EN
code = code.replace(/<p>Your spot for <strong>\$\{workshopName\}<\/strong> on \$\{workshopDate\} at \$\{workshopTime\} is confirmed\.<\/p>/,
  '<p>We confirm your enrollment in the workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">date: ${workshopDate}</p><p style="margin-top: 0;">time: ${workshopTime}</p>');

// NO
code = code.replace(/<p>Din plass for <strong>\$\{workshopName\}<\/strong> den \$\{workshopDate\} kl\. \$\{workshopTime\} er bekreftet\.<\/p>/,
  '<p>Vi bekrefter din p&aring;melding til workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dato: ${workshopDate}</p><p style="margin-top: 0;">tid: ${workshopTime}</p>');

// 4. WAITLIST PROMOTED text replacements
// PT
code = code.replace(/<p>A lista de espera andou e sua presen[^\s]* no <strong>\$\{workshopName\}<\/strong> \(dia \$\{workshopDate\}, [^\s]* \$\{workshopTime\}\) est[^\s]* confirmada\.<\/p>/,
  '<p>A lista de espera andou. Confirmamos sua inscri&ccedil;&atilde;o no workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: ${workshopDate}</p><p style="margin-top: 0;">hora: ${workshopTime}</p>');

// EN
code = code.replace(/<p>The waitlist has moved, and your spot for <strong>\$\{workshopName\}<\/strong> on \$\{workshopDate\} at \$\{workshopTime\} is now confirmed\.<\/p>/,
  '<p>The waitlist has moved. We confirm your enrollment in the workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">date: ${workshopDate}</p><p style="margin-top: 0;">time: ${workshopTime}</p>');

// NO
code = code.replace(/<p>Ventelisten har flyttet seg, og din plass for <strong>\$\{workshopName\}<\/strong> den \$\{workshopDate\} kl\. \$\{workshopTime\} er [^\s]* bekreftet\.<\/p>/,
  '<p>Ventelisten har flyttet seg. Vi bekrefter din p&aring;melding til workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dato: ${workshopDate}</p><p style="margin-top: 0;">tid: ${workshopTime}</p>');

fs.writeFileSync('api/agenda-notify.js', code);
console.log('Done!');
