const fs = require('fs');
let content = fs.readFileSync('src/pages/Dance2DanceKvinnePage.jsx', 'utf8');

const regex = /<span className="font-heading text-\[10px\] tracking-\[5px\] uppercase text-accent mb-6 block">\s*\{t\('btd_kvinne\.mentorKicker'\)\}\s*<\/span>\s*<p className="font-heading font-light text-\[#CFCFCF\] text-base md:text-lg leading-\[1\.85\]">\s*\{t\('btd_kvinne\.mentorText'\)\}\s*<\/p>/;

const newSection = `<span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                  {t('btd_kvinne.mentorKicker')}
                </span>
                <blockquote className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-4">
                  "{t('btd_kvinne.mentorText')}"
                </blockquote>
                <p className="font-drama text-xl text-accent italic mb-10">— Safia</p>

                <Link 
                  to="/curriculum" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="group flex flex-col items-center gap-4 w-fit"
                >
                  <span className="font-heading text-[10px] tracking-[3px] uppercase text-accent/80 group-hover:text-accent transition-colors">
                    {t('curriculum.link', 'CURRÍCULO DA DIRETORA')}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </Link>`;

if (regex.test(content)) {
  content = content.replace(regex, newSection);
  fs.writeFileSync('src/pages/Dance2DanceKvinnePage.jsx', content, 'utf8');
  console.log('Replaced successfully.');
} else {
  console.log('Regex did not match!');
}
