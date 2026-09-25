const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'pages', 'ImpactPage.jsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<div className="flex flex-col md:w-2\/3 lg:w-1\/2 items-start">/,
  '<div className="flex flex-col md:w-3/4 lg:w-[65%] items-start">'
);

fs.writeFileSync(file, content, 'utf8');
