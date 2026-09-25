const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

const regex = /<div class="location-box">[\s\S]*?<\/div>/g;
const newLocationHTML = `<div style="margin-top: 15px;">
            <a href="\${locationMapLink}" target="_blank" style="color: #9A9A9A; text-decoration: none; border-bottom: 1px dotted #9A9A9A; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              📍 \${locationName}
            </a>
          </div>`;

code = code.replace(regex, newLocationHTML);
code = code.replace('.location-box { background: #0A0A0E; border-left: 3px solid #C9A84C; padding: 16px; border-radius: 4px; margin: 24px 0; }', '');

fs.writeFileSync('api/agenda-notify.js', code);
console.log('Fixed agenda-notify.js location formatting.');
