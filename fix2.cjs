const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

// Replace any occurrence of the weird character
content = content.replace(/\x0Clex-1/g, '\lex-1');
content = content.replace(/cursor-pointer \}/g, 'cursor-pointer \}');

fs.writeFileSync('src/pages/AdminDashboard.jsx', content);
