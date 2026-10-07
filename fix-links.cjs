const fs = require('fs');

const files = [
  'src/pages/BeTheDanceUngPage.jsx',
  'src/pages/Dance2DanceKvinnePage.jsx',
  'src/components/CreatorOrigin.jsx'
];

let replacedFiles = [];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('to="/curriculum"')) {
      content = content.replaceAll('to="/curriculum"', 'to="/safia"');
      fs.writeFileSync(file, content, 'utf8');
      replacedFiles.push(file);
    }
  }
});

console.log('Fixed links in: ' + replacedFiles.join(', '));
