import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/ProfilePage.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = '{currentUser && !currentUser.emailVerified && ('
replacement = '{currentUser && !currentUser.emailVerified && !currentUser.profile?.emailVerifiedOverride && ('

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Fixed ProfilePage banner.")
else:
    print("Not found.")
