const fs = require('fs');

let content = fs.readFileSync('src/pages/BeTheDanceUngPage.jsx', 'utf8');

const old_block = `                <blockquote className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-8">
                  "{t('btd_ung.mentorText')}"
                </blockquote>
                <Link to="/curriculum" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-4 text-xs font-heading uppercase tracking-[3px] text-background hover:text-accent transition-colors w-fit group/btn">
                  {t('curriculum.link', 'O currículo de Safia')}
                  <div className="w-8 h-[1px] bg-white/30 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all duration-300 relative">
                    <ArrowRight className="absolute -right-1 -top-[7px] w-4 h-4 text-white/30 group-hover/btn:text-accent transition-colors" />
                  </div>
                </Link>`;

const new_block = `                <blockquote className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-4">
                  "{t('btd_ung.mentorText')}"
                </blockquote>
                <p className="font-drama text-xl text-accent italic mb-10">— Safia</p>

                <Link 
                  to="/curriculum" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="group flex flex-col items-center gap-4 w-fit"
                >
                  <span className="font-heading text-[10px] tracking-[3px] uppercase text-accent/80 group-hover:text-accent transition-colors">
                    CURRÍCULO DA DIRETORA
                  </span>
                  <div className="w-10 h-10 rounded-full border border-accent/40 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </Link>`;

if (content.includes(old_block)) {
    content = content.replace(old_block, new_block);
    fs.writeFileSync('src/pages/BeTheDanceUngPage.jsx', content, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Could not find the block.');
}
