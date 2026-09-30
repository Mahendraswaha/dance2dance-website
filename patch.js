const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

const regex = /<button[\s\S]*?onClick=\{\(\) => setMasterTab\('overview'\)\}[\s\S]*?className=\{[\s\S]*?\}[\s\S]*?>[\s\S]*?<span className="truncate">Vis.*?Geral<\/span>[\s\S]*?<\/button>/;

const newOverview = '<button type="button" onClick={() => setMasterTab(\'overview\')} className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }> <span className="truncate">Visão Geral</span> </button>';

content = content.replace(regex, newOverview);

const commsRegex = /<button[\s\S]*?onClick=\{\(\) => setMasterTab\('communications'\)\}[\s\S]*?className=\{[\s\S]*?\}[\s\S]*?>[\s\S]*?<span className="truncate">Comunica.*?<\/span>[\s\S]*?<\/button>/;

const newComms = '<button type="button" onClick={() => setMasterTab(\'communications\')} className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }> <span className="truncate">Comunicações</span> </button>';

content = content.replace(commsRegex, newComms);

fs.writeFileSync('src/pages/AdminDashboard.jsx', content, 'utf8');
