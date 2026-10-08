import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/WorkshopTemplate.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = 'border-[#222222] flex flex-col items-center">'
replacement = 'border-[#222222] flex flex-col items-center w-full">'

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Added w-full to WorkshopTemplate.jsx")
else:
    print("Target not found.")
