const fs = require('fs');
let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// The block to remove
const blockToRemoveRegex = /<div>[\s\n]*<label[^>]*>[\s\n]*\{t\('contactPage\.neighborhoodLabel', 'Bairro \(Opcional\)'\)\}[\s\n]*<\/label>[\s\n]*<input[\s\S]*?name="neighborhood"[\s\S]*?\/>[\s\n]*<\/div>/;

content = content.replace(blockToRemoveRegex, '');

fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');
console.log('Neighborhood field removed from ContactPage.jsx');
