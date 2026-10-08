import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# 1. Fix cityCountry
city_country_target = r'<div className="flex items-center justify-between py-1">\s*<span className="text-\[#888888\]">\{t\(\'adminPage\.usersManager\.cityCountry.*?</span>\s*<span className="text-\[#E0DDD5\]">\{\[city, country\].*?</span>\s*</div>'

city_country_replacement = r'''<div className="flex items-center justify-between py-1">
                    <span className="text-[#888888]">{t('adminPage.usersManager.cityCountry', 'Cidade / País')}:</span>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input type="text" name="city" value={editData.city} onChange={handleEditChange} placeholder="Cidade" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-24" />
                        <input type="text" name="country" value={editData.country} onChange={handleEditChange} placeholder="País" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-24" />
                      </div>
                    ) : (
                      <span className="text-[#E0DDD5]">{[city, country].filter(Boolean).join(' • ') || '-'}</span>
                    )}
                  </div>'''

content = re.sub(city_country_target, city_country_replacement, content, flags=re.DOTALL)

# 2. Fix Endereço Residencial
address_target = r'<div className="text-xs font-heading bg-\[#121216\] border border-\[#1E1E24\] p-4 rounded-\[2px\] space-y-2">\s*\{fullAddress \? \(.*?</p>\s*\)\s*\}\s*</div>'

address_replacement = r'''<div className="text-xs font-heading bg-[#121216] border border-[#1E1E24] p-4 rounded-[2px] space-y-2">
                  {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input type="text" name="address" value={editData.address} onChange={handleEditChange} placeholder="Endereço" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-full" />
                        <input type="text" name="zip" value={editData.zip} onChange={handleEditChange} placeholder="CEP" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />
                      </div>
                  ) : fullAddress ? (
                    <>
                      <p className="text-[#E0DDD5] leading-relaxed">
                        {address || '-'}
                      </p>
                      <p className="text-[#888888]">
                        {[neighborhood, city].filter(Boolean).join(', ')}
                      </p>
                      <p className="text-zinc-500 font-mono">
                        {[zip, country].filter(Boolean).join(' • ')}
                      </p>
                    </>
                  ) : (
                    <p className="text-zinc-500 italic py-3">
                      {t('adminPage.usersManager.noAddress', 'Nenhum endereço cadastrado.')}
                    </p>
                  )}
                </div>'''

content = re.sub(address_target, address_replacement, content, flags=re.DOTALL)

# 3. Fix Restrições Físicas
health_target = r'\{restrictions \? \(\s*<div className="p-4 rounded-\[2px\] bg-amber-950/20.*?</div>\s*\)\s*\}'

health_replacement = r'''{isEditing ? (
                  <textarea name="restricoes" value={editData.restricoes} onChange={handleEditChange} className="w-full bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] p-2 rounded h-20 resize-none"></textarea>
                ) : restrictions ? (
                  <div className="p-4 rounded-[2px] bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs font-heading leading-relaxed flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5 text-amber-300">
                        {t('adminPage.usersManager.attentionRequired', 'Atenção do Instrutor Requerida:')}
                      </span>
                      {restrictions}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-[2px] bg-[#121216] border border-[#1E1E24] text-zinc-500 text-xs font-heading italic">
                    {t('adminPage.usersManager.noRestrictions', 'Nenhuma restrição de saúde informada.')}
                  </div>
                )}'''

content = re.sub(health_target, health_replacement, content, flags=re.DOTALL)


# 4. Fix Experiência Prévia
exp_target = r'<div className="p-4 rounded-\[2px\] bg-\[#121216\] border border-\[#1E1E24\] text-xs font-heading leading-relaxed text-\[#D0CDC5\]">\s*\{experience \? experience : \(\s*<span className="text-zinc-500 italic">\s*\{t\(\'adminPage\.usersManager\.noExperience\'.*?</span>\s*\)\}\s*</div>'

exp_replacement = r'''<div className="p-4 rounded-[2px] bg-[#121216] border border-[#1E1E24] text-xs font-heading leading-relaxed text-[#D0CDC5]">
                  {isEditing ? (
                    <textarea name="experiencia" value={editData.experiencia} onChange={handleEditChange} className="w-full bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] p-2 rounded h-20 resize-none"></textarea>
                  ) : experience ? experience : (
                    <span className="text-zinc-500 italic">
                      {t('adminPage.usersManager.noExperience', 'Nenhuma experiência prévia detalhada.')}
                    </span>
                  )}
                </div>'''

content = re.sub(exp_target, exp_replacement, content, flags=re.DOTALL)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("UserDetailModal updated to support editing for all fields.")
