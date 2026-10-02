import io
import re

with io.open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(
    r'<span className="truncate">Vis.*?Geral</span>',
    r'<span className="truncate">{t(\'adminPage.tabs.overview\', \'Visão Geral\')}</span>',
    text
)

text = re.sub(
    r'<span className="truncate">Comunica.*?es</span>',
    r'<span className="truncate">{t(\'adminPage.tabs.communications\', \'Comunicações\')}</span>',
    text
)

with io.open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('AdminDashboard tabs translated.')
