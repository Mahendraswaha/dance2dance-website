import codecs
import re

# Update age limits
for filepath in ['C:/Renas/Antigravity/Website-builder/src/pages/SignupPage.jsx', 'C:/Renas/Antigravity/Website-builder/src/pages/ProfilePage.jsx']:
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()

    # Replace 10 with 7
    content = content.replace('currentYear - birthYear < 10', 'currentYear - birthYear < 7')
    content = content.replace('A idade mínima para se registrar é de 10 anos', 'A idade mínima para se registrar é de 7 anos')

    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)

print("Age limit changed to 7.")
