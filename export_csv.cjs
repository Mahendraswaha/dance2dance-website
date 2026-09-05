const fs = require('fs');

function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function escapeCSV(str) {
  if (str === null || str === undefined) return '';
  if (Array.isArray(str)) {
    str = JSON.stringify(str);
  }
  let s = String(str);
  s = s.replace(/"/g, '""');
  return '"' + s + '"';
}

const pt = flattenObject(JSON.parse(fs.readFileSync('src/i18n/locales/pt.json', 'utf8')));
const en = flattenObject(JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8')));
const no = flattenObject(JSON.parse(fs.readFileSync('src/i18n/locales/no.json', 'utf8')));

const allKeys = new Set([...Object.keys(pt), ...Object.keys(en), ...Object.keys(no)]);

let csvContent = 'CHAVE_INTERNA,PORTUGUES,INGLES,NORUEGUES\n';

for (let key of Array.from(allKeys).sort()) {
  const vPt = escapeCSV(pt[key]);
  const vEn = escapeCSV(en[key]);
  const vNo = escapeCSV(no[key]);
  csvContent += `${key},${vPt},${vEn},${vNo}\n`;
}

fs.writeFileSync('traducoes_revisao.csv', '\ufeff' + csvContent, 'utf8');
console.log('CSV Exportado com sucesso!');
