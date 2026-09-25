const ExcelJS = require('exceljs');
const path = require('path');

async function fixExcel() {
  const filePath = path.join(__dirname, 'translations Dance2Dance Ultima versao.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.worksheets[0]; // Assuming first sheet
  
  let changes = 0;

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.type === ExcelJS.ValueType.String || cell.type === ExcelJS.ValueType.RichText) {
        let val = cell.value;
        let originalText = typeof val === 'string' ? val : (val.richText ? val.richText.map(rt => rt.text).join('') : '');
        
        let newText = originalText
          // Portuguese/English replacements
          .replace(" (Lavterskeltilbud)", "")
          .replace(" (Mestring)", "")
          .replace(" (Tilhørighet)", "")
          .replace(" (lavterskeltilbud)", "")
          .replace(" (inkludering)", "")
          .replace(" (mestring)", "")
          .replace(" (tilhørighet)", "")
          // Special specific replacements
          .replace("*lavterskeltilbud* (acesso facilitado)", "espaço de acesso facilitado")
          .replace("*tilhørighet* (pertencimento)", "pertencimento")
          .replace("*mestring* (superação técnica)", "superação técnica")
          .replace("*lavterskeltilbud* (low-threshold access)", "low-threshold access space")
          .replace("*tilhørighet* (belonging)", "belonging")
          .replace("*mestring* (technical mastery)", "technical mastery")
          .replace("Lavterskel dans, mestring og inkludering", "Dança de fácil acesso, superação e inclusão");

        if (originalText !== newText) {
          // It's a bit tricky if it was rich text, but we can just set it as string since these aren't styled uniquely per letter usually
          if (typeof val === 'object' && val.richText) {
             // Let's just do a simple replacement if it's a string, or avoid destroying rich text if we don't have to.
             // Usually it's just a string. 
             cell.value = newText;
          } else {
             cell.value = newText;
          }
          changes++;
        }
      }
    });
  });

  if (changes > 0) {
    await workbook.xlsx.writeFile(filePath);
    console.log(`Successfully made ${changes} replacements in the Excel file.`);
  } else {
    console.log("No replacements made.");
  }
}

fixExcel().catch(console.error);
