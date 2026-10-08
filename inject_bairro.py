import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target1 = r'(address: user\.address \|\| user\.endereco \|\| \'\',\s*)(zip: user\.zip \|\| user\.cep \|\| \'\',)'
replacement1 = r'\1neighborhood: user.neighborhood || user.bairro || \'\',\n          \2'

content = re.sub(target1, replacement1, content)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("Injected neighborhood into editData")
