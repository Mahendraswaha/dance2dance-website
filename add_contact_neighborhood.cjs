const fs = require('fs');

let content = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// 1. Update formData initial state
content = content.replace(
  /city: currentUser\?\.profile\?\.city \|\| '',/,
  `city: currentUser?.profile?.city || '',
    neighborhood: currentUser?.profile?.neighborhood || '',`
);

// 2. Update useEffect
content = content.replace(
  /city: prev\.city \|\| currentUser\.profile\?\.city \|\| '',/,
  `city: prev.city || currentUser.profile?.city || '',
        neighborhood: prev.neighborhood || currentUser.profile?.neighborhood || '',`
);

// 3. Update form fields
const oldFields = `                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.cityLabel', 'Cidade (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('contactPage.cityPlaceholder', 'Sua cidade')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>`;

const newFields = `                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.neighborhoodLabel', 'Bairro (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder={t('contactPage.neighborhoodPlaceholder', 'Seu bairro')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.cityLabel', 'Cidade (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('contactPage.cityPlaceholder', 'Sua cidade')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>`;

// use fallback regex 
content = content.replace(
  /<div>[\s\n]*<label[^>]*>[\s\n]*\{t\('contactPage\.cityLabel', 'Cidade \(Opcional\)'\)\}[\s\n]*<\/label>[\s\n]*<input[^>]*name="city"[^>]*>[\s\n]*<\/div>/,
  `<div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.neighborhoodLabel', 'Bairro (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      placeholder={t('contactPage.neighborhoodPlaceholder', 'Seu bairro')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.cityLabel', 'Cidade (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t('contactPage.cityPlaceholder', 'Sua cidade')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>`
);


fs.writeFileSync('src/pages/ContactPage.jsx', content, 'utf8');

// Update locales
const locales = ['pt', 'en', 'no'];
locales.forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (lang === 'pt') {
    data.contactPage.neighborhoodLabel = "Bairro (Opcional)";
    data.contactPage.neighborhoodPlaceholder = "Seu bairro";
  } else if (lang === 'en') {
    data.contactPage.neighborhoodLabel = "Neighborhood (Optional)";
    data.contactPage.neighborhoodPlaceholder = "Your neighborhood";
  } else if (lang === 'no') {
    data.contactPage.neighborhoodLabel = "Nabolag (Valgfritt)";
    data.contactPage.neighborhoodPlaceholder = "Ditt nabolag";
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});

console.log('ContactPage neighborhood added');
