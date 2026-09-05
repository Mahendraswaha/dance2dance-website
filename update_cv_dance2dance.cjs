const fs = require('fs');

// 1. Update locales
const formattedBrand = 'Dance<span class="text-accent text-[1.28em] font-normal">2</span>Dance';

['pt', 'en', 'no'].forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.cv && Array.isArray(data.cv.paragraphs)) {
    data.cv.paragraphs = data.cv.paragraphs.map(p => {
      // replace existing span if any
      let updated = p.replace(/Dance<span[^>]*>2<\/span>Dance/g, formattedBrand);
      // replace plain text Dance2Dance
      updated = updated.replace(/Dance2Dance/g, formattedBrand);
      return updated;
    });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated cv in ${lang}.json`);
});

// 2. Update CurriculumPage.jsx
let cvPageContent = fs.readFileSync('src/pages/CurriculumPage.jsx', 'utf8');

if (!cvPageContent.includes('function formatCvText')) {
  const helperCode = `
function formatCvText(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/text-\\[1\\.2em\\]/g, 'text-[1.28em]')
    .replace(/Dance2Dance/g, 'Dance<span class="text-accent text-[1.28em] font-normal">2</span>Dance');
}
`;

  cvPageContent = helperCode + cvPageContent;
  cvPageContent = cvPageContent.replace(
    'dangerouslySetInnerHTML={{ __html: p }}',
    'dangerouslySetInnerHTML={{ __html: formatCvText(p) }}'
  );

  fs.writeFileSync('src/pages/CurriculumPage.jsx', cvPageContent, 'utf8');
  console.log('Updated CurriculumPage.jsx with formatCvText helper');
} else {
  console.log('CurriculumPage.jsx already has formatCvText');
}
