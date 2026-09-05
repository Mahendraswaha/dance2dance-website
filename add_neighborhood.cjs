const fs = require('fs');

let content = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');

// 1. Update formData initial state
content = content.replace(
  /city: '',/,
  `city: '',
    neighborhood: '',`
);

// 2. Update userData mapping
content = content.replace(
  /city: formData\.city,/,
  `city: formData.city,
        neighborhood: formData.neighborhood,`
);

// 3. Update the form fields inside JSX
// Replace the current block to rearrange fields
const oldFields = `              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Telefone / WhatsApp *</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+47 ... / +55 ..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Endereço *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Nome da rua, número" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Cidade *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Sua cidade" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">País *</label>
                <input required type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Brasil, Noruega..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">CEP / Código Postal *</label>
                <input required type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Ex: 0190 (Tøyen)" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>`;

const newFields = `              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Telefone / WhatsApp *</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+47 ... / +55 ..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Endereço *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Nome da rua, número" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Bairro *</label>
                <input required type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Seu bairro" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Cidade *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Sua cidade" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">CEP / Código Postal *</label>
                <input required type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Ex: 0190 (Tøyen)" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">País *</label>
                <input required type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Brasil, Noruega..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>`;

// Use fallback logic for replacing since spacing might mismatch slightly
content = content.replace(oldFields, newFields);

// In case the exact string match failed because of formatting:
if (!content.includes('name="neighborhood"')) {
  console.log("Fallback replacement used");
  content = content.replace(
    /<div>[\s\n]*<label[^>]*>Cidade \*<\/label>[\s\n]*<input[^>]*name="city"[^>]*>[\s\n]*<\/div>/,
    `<div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Bairro *</label>
                <input required type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Seu bairro" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Cidade *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Sua cidade" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>`
  );
  // and swap country and zip to keep grid balanced
  content = content.replace(
    /<div>[\s\n]*<label[^>]*>País \*<\/label>[\s\n]*<input[^>]*name="country"[^>]*>[\s\n]*<\/div>([\s\S]*?)<div>[\s\n]*<label[^>]*>CEP \/ Código Postal \*<\/label>[\s\n]*<input[^>]*name="zip"[^>]*>[\s\n]*<\/div>/,
    `<div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">CEP / Código Postal *</label>
                <input required type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="Ex: 0190 (Tøyen)" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>$1<div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">País *</label>
                <input required type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Brasil, Noruega..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>`
  );
}

fs.writeFileSync('src/pages/SignupPage.jsx', content, 'utf8');
console.log('SignupPage neighborhood added');
