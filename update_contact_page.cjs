const fs = require('fs');

// 1. Update ContactPage.jsx
let contactPage = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// Update formData state
contactPage = contactPage.replace(
  /const \[formData, setFormData\] = useState\(\{\s+name: '',\s+email: '',\s+phone: '',/,
  `const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',`
);

// Add form fields before the "Assunto" block
const addressFields = `
                {/* Endereço */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.addressLabel', 'Endereço (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t('contactPage.addressPlaceholder', 'Nome da rua, número')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                  
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
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.zipLabel', 'CEP / Código Postal (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder={t('contactPage.zipPlaceholder', '00000-000')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-heading text-[10px] uppercase tracking-[1.5px] text-[#CFCFCF] mb-2">
                      {t('contactPage.countryLabel', 'País (Opcional)')}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={t('contactPage.countryPlaceholder', 'Brasil, Noruega...')}
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3.5 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light text-sm placeholder:text-[#555555]"
                    />
                  </div>
                </div>

                {/* Assunto */}`;

contactPage = contactPage.replace(/\s*\{\/\* Assunto \*\/\}/, addressFields);

// Remove "Rommen Skole & Estúdios Parceiros"
contactPage = contactPage.replace(
  /<span className="text-\[#7A7A7A\]">Rommen Skole & Estúdios Parceiros<\/span>/,
  ''
);

// Fallback in case encoding issue in regex for replacing "Estúdios"
contactPage = contactPage.replace(
  /<span className="text-\[#7A7A7A\]">Rommen Skole &.*?<\/span>/,
  ''
);

// Remove "Porto Alegre" block
const portoAlegreBlockRegex = /\s*<div className="flex items-start gap-3">[\s\n]*<MapPin className="w-4 h-4 text-accent shrink-0 mt-0\.5" \/>[\s\n]*<div>[\s\n]*<strong className="block text-\[#F0EDE8\]">Porto Alegre, Brasil<\/strong>[\s\n]*<span className="text-\[#7A7A7A\]">Poa Cia de Dança<\/span>[\s\n]*<\/div>[\s\n]*<\/div>/;

contactPage = contactPage.replace(portoAlegreBlockRegex, '');
// Fallback for Poa Cia de Danca due to accents
const portoAlegreBlockRegexFallback = /\s*<div className="flex items-start gap-3">[\s\n]*<MapPin className="w-4 h-4 text-accent shrink-0 mt-0\.5" \/>[\s\n]*<div>[\s\n]*<strong className="block text-\[#F0EDE8\]">Porto Alegre, Brasil<\/strong>[\s\n]*<span className="text-\[#7A7A7A\]">Poa Cia de Dan.*?<\/span>[\s\n]*<\/div>[\s\n]*<\/div>/;
contactPage = contactPage.replace(portoAlegreBlockRegexFallback, '');

fs.writeFileSync('src/pages/ContactPage.jsx', contactPage, 'utf8');

// 2. Update Translations
const locales = ['pt', 'en', 'no'];
locales.forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (lang === 'pt') {
    data.contactPage.addressLabel = "Endereço (Opcional)";
    data.contactPage.addressPlaceholder = "Nome da rua, número";
    data.contactPage.cityLabel = "Cidade (Opcional)";
    data.contactPage.cityPlaceholder = "Sua cidade";
    data.contactPage.zipLabel = "CEP / Código Postal (Opcional)";
    data.contactPage.zipPlaceholder = "00000-000";
    data.contactPage.countryLabel = "País (Opcional)";
    data.contactPage.countryPlaceholder = "Brasil, Noruega...";
  } else if (lang === 'en') {
    data.contactPage.addressLabel = "Address (Optional)";
    data.contactPage.addressPlaceholder = "Street name, number";
    data.contactPage.cityLabel = "City (Optional)";
    data.contactPage.cityPlaceholder = "Your city";
    data.contactPage.zipLabel = "ZIP / Postal Code (Optional)";
    data.contactPage.zipPlaceholder = "00000";
    data.contactPage.countryLabel = "Country (Optional)";
    data.contactPage.countryPlaceholder = "Brazil, Norway...";
  } else if (lang === 'no') {
    data.contactPage.addressLabel = "Adresse (Valgfritt)";
    data.contactPage.addressPlaceholder = "Gatenavn, nummer";
    data.contactPage.cityLabel = "By (Valgfritt)";
    data.contactPage.cityPlaceholder = "Din by";
    data.contactPage.zipLabel = "Postnummer (Valgfritt)";
    data.contactPage.zipPlaceholder = "0000";
    data.contactPage.countryLabel = "Land (Valgfritt)";
    data.contactPage.countryPlaceholder = "Brasil, Norge...";
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});

console.log('Update complete.');
