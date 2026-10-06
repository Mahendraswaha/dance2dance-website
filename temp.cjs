const fs = require('fs');
let content = fs.readFileSync('src/pages/BeTheDanceUngPage.jsx', 'utf8');
const lines = content.split('\n');

const startImage = lines.findIndex(l => l.includes('<Link to="/safia" className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group cursor-pointer">'));
if (startImage !== -1) {
  lines[startImage] = '                <div className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group">';
  lines[startImage+3] = '                </div>';
  lines.splice(startImage+2, 1);
}

const startText = lines.findIndex(l => l.includes("{t('btd_ung.mentorText')}"));
if (startText !== -1) {
  lines[startText-1] = '                <blockquote className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-8">';
  lines[startText] = '                  "{t(\'btd_ung.mentorText\')}"';
  lines[startText+1] = '                </blockquote>';
  lines.splice(startText+2, 0, 
    '                <Link to="/curriculum" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-4 text-xs font-heading uppercase tracking-[3px] text-background hover:text-accent transition-colors w-fit group/btn">',
    "                  {t('curriculum.link', 'O currículo de Safia')}",
    '                  <div className="w-8 h-[1px] bg-white/30 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all duration-300 relative">',
    '                    <ArrowRight className="absolute -right-1 -top-[7px] w-4 h-4 text-white/30 group-hover/btn:text-accent transition-colors" />',
    '                  </div>',
    '                </Link>'
  );
}

fs.writeFileSync('src/pages/BeTheDanceUngPage.jsx', lines.join('\n'));
console.log('Replaced by slice');
