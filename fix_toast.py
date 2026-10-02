import io

with io.open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the broken string (it might be mojibake)
import re
content = re.sub(r"toast\.error\('[^']*obrigat[^']*'\);", "toast.error(t('adminPage.locationRequired', 'A localização do evento é obrigatória.'));", content)

with io.open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
