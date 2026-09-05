const fs = require('fs');

let content = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

// Remove instructor from top badge row
content = content.replace(
  /<div className="h-\[32px\] flex items-center justify-between">([\s\S]*?)<\/div>\s*\{\/\* Linha do Meio:/,
  `<div className="h-[32px] flex items-center justify-start">
                        <div className="inline-flex items-center justify-center bg-[#1E1E24] px-2 py-1 rounded-[2px] pr-[calc(0.5rem-2px)]">
                          <span className="font-heading text-[9px] uppercase tracking-[2px] text-[#9A9A9A] font-bold ml-[2px]">
                            {badgeText}
                          </span>
                        </div>
                      </div>

                      {/* Linha do Meio:`
);

// Add instructor above the button
content = content.replace(
  /<div className="shrink-0 w-full md:w-auto md:min-w-\[180px\]">/,
  `<div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center">
                          {event.instructor && (
                            <span className="font-heading text-[9px] text-[#7A7A7A] uppercase tracking-wider mb-2 text-center w-full block">
                              {t("agendaPage.instructor", "Instrutor")}: <span className="text-[#CFCFCF] font-semibold">{event.instructor}</span>
                            </span>
                          )}`
);

fs.writeFileSync('src/pages/AgendaPage.jsx', content, 'utf8');
console.log('Agenda instructor moved');
