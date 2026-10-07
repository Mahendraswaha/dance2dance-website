const fs = require('fs');

const files = ['src/pages/Dance2DanceKvinnePage.jsx', 'src/pages/BeTheDanceUngPage.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll(
    'className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] max-w-[700px]"',
    'className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] max-w-[900px]"'
  );
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed max-w limit.');
