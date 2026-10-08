import codecs
import re

files = [
    'C:/Renas/Antigravity/Website-builder/src/components/WorkshopTemplate.jsx',
    'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'
]

for filepath in files:
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    # We want to replace ONLY the agenda container
    # The comment contains: (SAME WIDTH AS AGENDA PAGE: max-w-[900px])
    target_comment = r'\(SAME WIDTH AS AGENDA PAGE: max-w-\[900px\]\)'
    content = re.sub(target_comment, '(SAME WIDTH AS AGENDA PAGE: max-w-6xl)', content)
    
    # And the div just below it:
    # <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 mt-24 pt-16 border-t border-[#222222] flex flex-col items-center
    target_div = r'<div className="max-w-\[900px\] mx-auto px-4 sm:px-6 md:px-8 relative z-10 mt-24 pt-16 border-t border-\[#222222\] flex flex-col items-center'
    replacement_div = '<div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 mt-24 pt-16 border-t border-[#222222] flex flex-col items-center'
    
    content = re.sub(target_div, replacement_div, content)
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    
    print(f"Corrected agenda width in {filepath}")
