import codecs

files = [
    'C:/Renas/Antigravity/Website-builder/src/components/WorkshopTemplate.jsx',
    'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'
]

for filepath in files:
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    if 'max-w-6xl' in content:
        content = content.replace('max-w-6xl', 'max-w-[900px]')
        with codecs.open(filepath, 'w', 'utf-8') as f:
            f.write(content)
        print(f"Reverted all max-w-6xl to max-w-[900px] in {filepath}")
    else:
        print(f"Not found in {filepath}")
