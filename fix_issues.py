import codecs

# 1. Revert widths back to max-w-6xl
files = [
    'C:/Renas/Antigravity/Website-builder/src/components/WorkshopTemplate.jsx',
    'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'
]

for filepath in files:
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    if 'max-w-[900px]' in content:
        content = content.replace('max-w-[900px]', 'max-w-6xl')
        with codecs.open(filepath, 'w', 'utf-8') as f:
            f.write(content)
        print(f"Reverted width in {filepath}")

# 2. Add trackEvent import to WorkshopAgendaSection.jsx
agenda_path = 'C:/Renas/Antigravity/Website-builder/src/components/WorkshopAgendaSection.jsx'
with codecs.open(agenda_path, 'r', 'utf-8') as f:
    agenda_content = f.read()

import_statement = "import { trackEvent } from '../utils/analytics';\n"
if "import { trackEvent }" not in agenda_content:
    agenda_content = agenda_content.replace(
        "import { toast } from 'sonner';",
        "import { toast } from 'sonner';\n" + import_statement
    )
    with codecs.open(agenda_path, 'w', 'utf-8') as f:
        f.write(agenda_content)
    print("Added trackEvent import to WorkshopAgendaSection.jsx")
