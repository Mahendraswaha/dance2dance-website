const fs = require('fs');

let content = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

content = content.replace(
  /className="bg-\[#121214\] border border-transparent hover:bg-\[#161618\] transition-colors rounded-\[2px\] p-6 md:p-8 flex flex-col md:flex-row items-start gap-8"/,
  `className="bg-[#121214] border border-transparent hover:bg-[#161618] transition-colors rounded-[2px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"`
);

content = content.replace(
  /className="w-full md:w-1\/4 shrink-0 border-b md:border-b-0 md:border-r border-\[#1A1A24\] pb-6 md:pb-0 pr-6 md:pt-\[32px\]"/,
  `className="w-full md:w-1/4 shrink-0 border-b md:border-b-0 md:border-r border-[#1A1A24] pb-6 md:pb-0 pr-6"`
);

fs.writeFileSync('src/pages/AgendaPage.jsx', content, 'utf8');
console.log('Agenda layout updated to items-center');
