import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix FECHAR / Fechar
# The button for close currently says: {t('adminPage.close', 'Fechar')}
# Wait, maybe it isn't hardcoded anymore? Let's check.
# The user's screenshot 3 shows "FECHAR" on the bottom button.
# If it says {t('adminPage.close', 'Fechar')}, then if 'adminPage.close' is missing from en.json, it will display "Fechar". But it displays "FECHAR" in caps! 
# Let's fix the capitalization in the fallback and ensure the key exists.
text = text.replace("{t('adminPage.close', 'Fechar')}", "{t('adminPage.usersManager.close', 'Fechar')}")

# Fix "+ Nova Anotação"
text = text.replace("'+ Nova Anotação'", "t('adminPage.usersManager.addNote', '+ Nova Anotação')")
# Handle broken encoding variants if any
text = text.replace("'+ Nova Anota\\u01dco'", "t('adminPage.usersManager.addNote', '+ Nova Anotação')")
text = text.replace("'+ Nova Anota\ufffdo'", "t('adminPage.usersManager.addNote', '+ Nova Anotação')")

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Translations hardcodes replaced.')
