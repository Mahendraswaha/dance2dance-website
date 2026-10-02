import codecs

with codecs.open('src/pages/AdminDashboard.jsx', 'r', 'utf-8') as f:
    content = f.read()

target = "const primaryLocation = (formData[`location_${activeLangTab}`] || formData.location_no || formData.location_en || formData.location_pt || '').trim();"
replacement = target + "\n\n      if (!primaryLocation) {\n        toast.error('A localização do evento é obrigatória.');\n        return;\n      }"

content = content.replace(target, replacement)

with codecs.open('src/pages/AdminDashboard.jsx', 'w', 'utf-8') as f:
    f.write(content)
print("Done")
