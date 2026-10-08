import codecs

signup_file = 'C:/Renas/Antigravity/Website-builder/src/pages/SignupPage.jsx'

with codecs.open(signup_file, 'r', 'utf-8') as f:
    signup_content = f.read()

# Add hasRestrictions
signup_content = signup_content.replace(
    "restricoes: ''",
    "restricoes: '',\n      hasRestrictions: false"
)

# Add birthdate validation
validation_code = '''    if (formData.password !== formData.confirmPassword) {
      return setError(t('auth.passwordMismatch', 'As senhas não coincidem.'));
    }

    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 10) {
        return setError(t('auth.invalidAge', 'A idade mínima para se registrar é de 10 anos.'));
      }
    }'''

signup_content = signup_content.replace(
    '''    if (formData.password !== formData.confirmPassword) {
      return setError(t('auth.passwordMismatch', 'As senhas não coincidem.'));
    }''',
    validation_code
)

# Replace textarea with checkbox
textarea_code = '''                {/* Restrições */}
                <div className="md:col-span-2">
                  <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                    {t('auth.restrictionsLabel', 'Restrições físicas ou de saúde?')}
                  </label>
                  <textarea 
                    name="restricoes" 
                    value={formData.restricoes} 
                    onChange={handleChange} 
                    rows="2" 
                    placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')} 
                    className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                  />
                </div>'''

new_textarea_code = '''                {/* Restrições */}
                <div className="md:col-span-2 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer w-fit">
                    <input 
                      type="checkbox" 
                      name="hasRestrictions" 
                      checked={formData.hasRestrictions}
                      onChange={(e) => {
                         setFormData(p => ({ ...p, hasRestrictions: e.target.checked }));
                         if (!e.target.checked) setFormData(p => ({ ...p, restricoes: '' }));
                      }}
                      className="w-4 h-4 bg-[#141414] border border-[#333333] accent-accent cursor-pointer"
                    />
                    <span className="font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF]">
                      {t('auth.hasRestrictionsCheck', 'Tenho restrições físicas ou de saúde')}
                    </span>
                  </label>
                  
                  {formData.hasRestrictions && (
                    <textarea 
                      name="restricoes" 
                      value={formData.restricoes} 
                      onChange={handleChange} 
                      rows="2" 
                      placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')} 
                      className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                    />
                  )}
                </div>'''

signup_content = signup_content.replace(textarea_code, new_textarea_code)

with codecs.open(signup_file, 'w', 'utf-8') as f:
    f.write(signup_content)


profile_file = 'C:/Renas/Antigravity/Website-builder/src/pages/ProfilePage.jsx'

with codecs.open(profile_file, 'r', 'utf-8') as f:
    profile_content = f.read()

# Add hasRestrictions
profile_content = profile_content.replace(
    "restricoes: ''",
    "restricoes: '',\n    hasRestrictions: false"
)

profile_content = profile_content.replace(
    "restricoes: currentUser.restricoes || currentUser.restrictions || ''",
    "restricoes: currentUser.restricoes || currentUser.restrictions || '',\n        hasRestrictions: !!(currentUser.restricoes || currentUser.restrictions)"
)

# Add birthdate validation
profile_val = '''    // Validar idade
    if (formData.birthDate) {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear < 10) {
        toast.error(t('auth.invalidAge', 'A idade mínima para se registrar é de 10 anos.'));
        setSaving(false);
        return;
      }
    }

    try {'''

profile_content = profile_content.replace(
    '''    try {''',
    profile_val,
    1 # Only first occurence which is in handleSaveData
)

profile_textarea = '''                    {/* Restrições */}
                    <div className="md:col-span-2">
                      <label className="block font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF] mb-2">
                        {t('auth.restrictionsLabel', 'Restrições físicas ou de saúde?')}
                      </label>
                      <textarea
                        name="restricoes"
                        value={formData.restricoes}
                        onChange={handleChange}
                        rows="2"
                        placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')}
                        className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                      />
                    </div>'''

profile_new_textarea = '''                    {/* Restrições */}
                    <div className="md:col-span-2 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          name="hasRestrictions" 
                          checked={formData.hasRestrictions}
                          onChange={(e) => {
                             setFormData(p => ({ ...p, hasRestrictions: e.target.checked }));
                             if (!e.target.checked) setFormData(p => ({ ...p, restricoes: '' }));
                          }}
                          className="w-4 h-4 bg-[#141414] border border-[#333333] accent-accent cursor-pointer"
                        />
                        <span className="font-heading text-xs uppercase tracking-[2px] text-[#CFCFCF]">
                          {t('auth.hasRestrictionsCheck', 'Tenho restrições físicas ou de saúde')}
                        </span>
                      </label>
                      
                      {formData.hasRestrictions && (
                        <textarea
                          name="restricoes"
                          value={formData.restricoes}
                          onChange={handleChange}
                          rows="2"
                          placeholder={t('auth.restrictionsPlaceholder', 'Alguma lesão ou condição que o professor deva saber?')}
                          className="w-full bg-[#141414] border border-[#333333] text-[#F0EDE8] px-4 py-3 focus:outline-none focus:border-accent/50 transition-colors rounded-[2px] font-heading font-light resize-none placeholder:text-[#555555]"
                        />
                      )}
                    </div>'''

profile_content = profile_content.replace(profile_textarea, profile_new_textarea)

with codecs.open(profile_file, 'w', 'utf-8') as f:
    f.write(profile_content)

print("Forms updated.")
