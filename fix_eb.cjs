const fs = require('fs');

let content = fs.readFileSync('src/components/ErrorBoundary.jsx', 'utf8');

content = content.replace(/500/g, '2500');

fs.writeFileSync('src/components/ErrorBoundary.jsx', content);
