const fs = require('fs');

// 1. Update api/agenda-notify.js
let apiCode = fs.readFileSync('api/agenda-notify.js', 'utf8');

// Add workshopLink to destructuring
apiCode = apiCode.replace(/locationMapLink\s*\}\s*=\s*body;/, 'locationMapLink,\n      workshopLink\n    } = body;');

// Replace the format: workshop: <strong>${workshopName}</strong>
// with workshop: <a href="${workshopLink}" style="color: #C9A84C; text-decoration: none;"><strong>${workshopName}</strong></a>
apiCode = apiCode.replace(/workshop: <strong>\$\{workshopName\}<\/strong>/g, 'workshop: <a href="${workshopLink}" style="color: #C9A84C; text-decoration: none;"><strong>${workshopName}</strong></a>');

fs.writeFileSync('api/agenda-notify.js', apiCode);


// 2. Update AgendaPage.jsx
let agendaCode = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

const fetchBlockRegex = /const locationMap = ev\?\.address \?[\s\S]*?`https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=\$\{encodeURIComponent\(ev\.address\)\}` : \(locationStr \?[\s\S]*?`https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=\$\{encodeURIComponent\(locationStr\)\}` : 'https:\/\/maps\.google\.com'\);/g;

// We will inject the category formatting logic right after locationMap.
const logicToInject = `
              const cat = getEventCategory(ev);
              const niceCat = cat === 'bethedance' ? 'Be the Dance' : (cat === 'biostretch' ? 'Biostretch' : (cat === 'kroppsskole' ? 'Kroppsskole' : ''));
              const fullTitle = niceCat ? \`\${evTitle} - \${niceCat}\` : evTitle;
              const link = \`https://www.dance2dance.no\${getEventRoute(ev)}\`;`;

agendaCode = agendaCode.replace(fetchBlockRegex, (match) => {
    return match + logicToInject;
});

// Now replace workshopName: evTitle with workshopName: fullTitle, workshopLink: link
agendaCode = agendaCode.replace(/workshopName:\s*evTitle,/g, 'workshopName: fullTitle,\n                  workshopLink: link,');

fs.writeFileSync('src/pages/AgendaPage.jsx', agendaCode);


// 3. Update WorkshopAgendaSection.jsx
let workshopCode = fs.readFileSync('src/components/WorkshopAgendaSection.jsx', 'utf8');

workshopCode = workshopCode.replace(fetchBlockRegex, (match) => {
    return match + logicToInject;
});

workshopCode = workshopCode.replace(/workshopName:\s*evTitle,/g, 'workshopName: fullTitle,\n                  workshopLink: link,');

fs.writeFileSync('src/components/WorkshopAgendaSection.jsx', workshopCode);

console.log("Updated emails with workshop links and full titles!");
