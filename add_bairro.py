import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# Add neighborhood to setEditData
target1 = '''          city: user.city || '',
          country: user.country || '',
          address: user.address || user.endereco || '',
          zip: user.zip || user.cep || '','''

replacement1 = '''          city: user.city || '',
          country: user.country || '',
          address: user.address || user.endereco || '',
          neighborhood: user.neighborhood || user.bairro || '',
          zip: user.zip || user.cep || '','''

content = content.replace(target1, replacement1)

# Add input for neighborhood
target2 = '''<input type="text" name="address" value={editData.address} onChange={handleEditChange} placeholder="Endereço" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-full" />
                        <input type="text" name="zip" value={editData.zip} onChange={handleEditChange} placeholder="CEP" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />'''

replacement2 = '''<input type="text" name="address" value={editData.address} onChange={handleEditChange} placeholder="Endereço" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-full" />
                        <div className="flex gap-2">
                          <input type="text" name="neighborhood" value={editData.neighborhood} onChange={handleEditChange} placeholder="Bairro" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-full" />
                          <input type="text" name="zip" value={editData.zip} onChange={handleEditChange} placeholder="CEP" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />
                        </div>'''

content = content.replace(target2, replacement2)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("Added Bairro field to editData and UI.")
