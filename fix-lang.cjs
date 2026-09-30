const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

code = code.replace(
    /const \{ type, userEmail, userName, workshopName, workshopDate, workshopTime, workshopLink, locationName, locationMapLink, lang = 'en' \} = req.body;/,
    `const { type, userEmail, userName, workshopName, workshopDate, workshopTime, workshopLink, locationName, locationMapLink, lang = 'en', userLang } = req.body;
  
  const finalLang = userLang || lang;`
);

code = code.replace(
    /const templateId = \`\$\{templatePrefix\}_\$\{lang\}\`;/,
    `const templateId = \`\$\{templatePrefix\}_\$\{finalLang\}\`;`
);

fs.writeFileSync('api/agenda-notify.js', code);
