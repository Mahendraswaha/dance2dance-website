const fs = require('fs');

// 1. Update locales
const locales = {
  pt: {
    emailPlaceholder: "seuemail@exemplo.com",
    namePlaceholder: "Seu nome ou empresa",
    phonePlaceholder: "+55 ... / +47 ...",
    addressPlaceholder: "Nome da rua, número",
    cityPlaceholder: "Sua cidade",
    zipPlaceholder: "00000-000",
    countryPlaceholder: "Brasil, Noruega...",
    messagePlaceholder: "Como podemos te ajudar?"
  },
  en: {
    emailPlaceholder: "your.email@example.com",
    namePlaceholder: "Your name or company",
    phonePlaceholder: "+47 ... / +55 ...",
    addressPlaceholder: "Street name, number",
    cityPlaceholder: "Your city",
    zipPlaceholder: "Postal / ZIP code (e.g. 0190)",
    countryPlaceholder: "Norway, Brazil...",
    messagePlaceholder: "How can we help you?"
  },
  no: {
    emailPlaceholder: "din.epost@eksempel.no",
    namePlaceholder: "Ditt navn eller bedrift",
    phonePlaceholder: "+47 ... / +55 ...",
    addressPlaceholder: "Gatenavn, husnummer",
    cityPlaceholder: "Din by",
    zipPlaceholder: "Postnummer (f.eks. 0190)",
    countryPlaceholder: "Norge, Brasil...",
    messagePlaceholder: "Hvordan kan vi hjelpe deg?"
  }
};

['pt', 'en', 'no'].forEach(lang => {
  const filePath = `src/i18n/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.contactPage = {
    ...data.contactPage,
    ...locales[lang]
  };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
});
console.log('Locales updated successfully');

// 2. Update ContactPage.jsx
let contactContent = fs.readFileSync('src/pages/ContactPage.jsx', 'utf8');

// Replace email input placeholder
contactContent = contactContent.replace(
  /placeholder="seuemail@exemplo\.com"/,
  `placeholder={t('contactPage.emailPlaceholder', 'seuemail@exemplo.com')}`
);

// Replace phone input placeholder
contactContent = contactContent.replace(
  /placeholder="\+47 \.\.\. \/ \+55 \.\.\."/,
  `placeholder={t('contactPage.phonePlaceholder', '+47 ... / +55 ...')}`
);

// Replace the Address + City section with a combined 2-column grid
const oldAddressCityBlock = `                {/* Endereço */}
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
                  </div>
                </div>`;

const newAddressCityBlock = `                {/* Endereço e Cidade (Lado a Lado) */}
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
                </div>`;

if (contactContent.includes('placeholder={t(\'contactPage.addressPlaceholder\'')) {
  // Let's replace the whole grid chunk
  contactContent = contactContent.replace(oldAddressCityBlock, newAddressCityBlock);
  console.log('Address and City grid combined');
} else {
  console.log('Warning: address placeholder not found');
}

fs.writeFileSync('src/pages/ContactPage.jsx', contactContent, 'utf8');
console.log('ContactPage.jsx updated successfully');
