import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/RegisteredUsersManager.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = '{u.emailVerified ? ('
replacement = '{(u.emailVerified || u.emailVerifiedOverride) ? ('

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Fixed badge logic in RegisteredUsersManager.jsx")
else:
    print("Target not found.")
