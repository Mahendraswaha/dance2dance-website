const fs = require('fs');

let content = fs.readFileSync('src/pages/Dance2DanceKvinnePage.jsx', 'utf8');

const regex = /<Link to="\/safia" onClick=\{[\s\S]*?\} className="block aspect-\[3\/4\] overflow-hidden rounded-\[2px\] relative group">([\s\S]*?)<div className="absolute inset-0 bg-black\/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">[\s\S]*?<\/div>\s*<\/Link>/;

if (regex.test(content)) {
  content = content.replace(regex, `<div className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group">$1</div>`);
  fs.writeFileSync('src/pages/Dance2DanceKvinnePage.jsx', content, 'utf8');
  console.log('Replaced link with simple div.');
} else {
  // Let's try to match differently if it's not exactly that.
  const regex2 = /<Link[\s\S]*?to="\/safia"[\s\S]*?aspect-\[3\/4\][\s\S]*?>([\s\S]*?<img[\s\S]*?\/>)[\s\S]*?<\/Link>/;
  if (regex2.test(content)) {
    content = content.replace(regex2, `<div className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group">\n$1\n</div>`);
    fs.writeFileSync('src/pages/Dance2DanceKvinnePage.jsx', content, 'utf8');
    console.log('Replaced link with simple div using fallback regex.');
  } else {
    console.log('Could not find the link wrapper.');
  }
}
