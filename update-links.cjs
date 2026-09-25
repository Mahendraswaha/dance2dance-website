const fs = require('fs');

function updatePage(filename) {
  let c = fs.readFileSync(filename, 'utf8');
  
  // Find the div wrapper of the image
  const regex = /<div className="aspect-\[3\/4\] overflow-hidden rounded-\[2px\]">[\s\S]*?<img src="\/images\/creator-[^"]+\.jpg"[\s\S]*?<\/div>/;
  
  if (regex.test(c)) {
    c = c.replace(regex, `<Link to="/safia" className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group cursor-pointer">
                    <img src="/images/creator-be-the-dance.jpg" alt="Safia" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white font-heading text-xs tracking-widest uppercase border border-white/40 px-6 py-2 rounded-[2px] backdrop-blur-sm">Safia CV</span>
                    </div>
                  </Link>`);
    
    // Make sure Link is imported
    if (!c.includes("import { Link } from 'react-router-dom';")) {
      // Find the last import and add it after
      c = c.replace(/(import .*?;)/g, (match, p1, offset, string) => {
        const nextMatch = string.indexOf('import ', offset + p1.length);
        if (nextMatch === -1) {
            return match + "\nimport { Link } from 'react-router-dom';";
        }
        return match;
      });
    }
    
    fs.writeFileSync(filename, c);
    console.log('Updated ' + filename);
  } else {
    console.log('Target not found in ' + filename);
  }
}

updatePage('src/pages/Dance2DanceKvinnePage.jsx');
updatePage('src/pages/BeTheDanceUngPage.jsx');
