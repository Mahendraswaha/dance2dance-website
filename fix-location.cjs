const fs = require('fs');

// 1. Fix AgendaPage.jsx
let agenda = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');
agenda = agenda.replace(/const locationMap = ev\?\.locationUrl \|\| 'https:\/\/maps\.google\.com';/g, 
  "const locationMap = ev?.address ? `https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(ev.address)}` : 'https://maps.google.com';");
fs.writeFileSync('src/pages/AgendaPage.jsx', agenda);
console.log('Fixed AgendaPage URL.');

// 2. Fix api/agenda-notify.js
let api = fs.readFileSync('api/agenda-notify.js', 'utf8');

const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

api = api.replace(/📍/g, mapPinSvg);
fs.writeFileSync('api/agenda-notify.js', api);
console.log('Fixed agenda-notify SVG.');
