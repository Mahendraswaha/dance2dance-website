const fs = require('fs');

let content = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');

// 1. Update formData initial state
content = content.replace(
  /const \[formData, setFormData\] = useState\(\{[\s\S]*?restricoes: ''\s+\}\);/,
  `const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    experiencia: '',
    restricoes: ''
  });`
);

// 2. Update userData mapping
content = content.replace(
  /const userData = \{[\s\S]*?role: 'student'\s+\};/,
  `const userData = {
        fullName: formData.nome,
        nome: formData.nome, // fallback for legacy
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
        telefone: formData.phone, // fallback
        endereco: formData.address, // fallback
        cep: formData.zip, // fallback
        experiencia: formData.experiencia,
        restricoes: formData.restricoes,
        role: 'student'
      };`
);

// 3. Update the form fields inside JSX
// Replace the block from <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> to the submit button
const newFormFields = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Nome Completo *</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">E-mail *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Senha *</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Confirmar Senha *</label>
                <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light" />
              </div>
              <div>
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
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Experiência prévia com dança?</label>
                <textarea name="experiencia" value={formData.experiencia} onChange={handleChange} rows="2" placeholder="Conte-nos brevemente sobre sua experiência..." className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">Restrições físicas ou de saúde?</label>
                <textarea name="restricoes" value={formData.restricoes} onChange={handleChange} rows="2" placeholder="Alguma lesão ou condição que o professor deva saber?" className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none" />
              </div>
            </div>`;

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?<\/div>\s*<button/g,
  newFormFields + '\n\n            <button'
);

fs.writeFileSync('src/pages/SignupPage.jsx', content, 'utf8');
console.log('SignupPage updated');
