const fs = require('fs');

function updateFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find the button render part
  const targetBtn = `                    ) : (
                      <button 
                        onClick={() => handleEnroll(event.id, isFull)}`;
                        
  const replacementBtn = `                    ) : (
                      <div className="w-full flex flex-col items-center">
                        {isFull && <span className="text-[9px] text-red-400/80 font-heading tracking-widest uppercase mb-2 text-center">{t('agendaPage.fullSpots', 'Vagas esgotadas')}</span>}
                        <button 
                          onClick={() => handleEnroll(event.id, isFull)}`;
                          
  if (code.includes(targetBtn)) {
    code = code.replace(targetBtn, replacementBtn);
    code = code.replace(/<\/button>\n\s*\}\)/g, '</button>\n                      </div>\n                    )}');
  }

  // Fallback if the strict string didn't match (AgendaPage uses a slightly different button wrapper sometimes)
  const targetBtnAgenda = `              ) : (
                <button 
                  onClick={() => handleEnroll(event.id, isFull)}`;
                  
  const replacementBtnAgenda = `              ) : (
                <div className="w-full flex flex-col items-center">
                  {isFull && <span className="text-[9px] text-red-400/80 font-heading tracking-widest uppercase mb-2 text-center">{t('agendaPage.fullSpots', 'Vagas esgotadas')}</span>}
                  <button 
                    onClick={() => handleEnroll(event.id, isFull)}`;

  if (code.includes(targetBtnAgenda)) {
    code = code.replace(targetBtnAgenda, replacementBtnAgenda);
    code = code.replace(/<\/button>\n\s*\}\)/g, '</button>\n                </div>\n              )}');
  }

  // Need to fix the closing </div> appropriately
  fs.writeFileSync(file, code);
}

// I will do it with precise regexes to avoid closing tag mismatch
function updatePrecise(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // For WorkshopAgendaSection and AgendaPage
  const regex = /\) : \(\s*<button\s*onClick=\{\(\) => handleEnroll\(event\.id, isFull\)\}([\s\S]*?)<\/button>\s*\)/g;
  
  code = code.replace(regex, `) : (
                      <div className="w-full flex flex-col items-center">
                        {isFull && <span className="text-[9px] text-red-400/80 font-heading tracking-[1.5px] uppercase mb-2 text-center">{t('agendaPage.fullSpots', 'Vagas esgotadas')}</span>}
                        <button onClick={() => handleEnroll(event.id, isFull)}$1</button>
                      </div>
                    )`);

  fs.writeFileSync(file, code);
}

updatePrecise('src/components/WorkshopAgendaSection.jsx');
updatePrecise('src/pages/AgendaPage.jsx');
console.log('UI updated with Vagas Esgotadas badge!');
