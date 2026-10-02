import io

with io.open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(r"t(\'adminPage.tabs.overview\', \'Visão Geral\')", "t('adminPage.tabs.overview', 'Visão Geral')")
text = text.replace(r"t(\'adminPage.tabs.communications\', \'Comunicações\')", "t('adminPage.tabs.communications', 'Comunicações')")

with io.open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Syntax error fixed.')
