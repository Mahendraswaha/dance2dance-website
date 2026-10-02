import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'E-mails com Falha de Envio (Outbox)',
    "{t('adminPage.overview.outboxTitle', 'E-mails com Falha de Envio (Outbox)')}"
)

# Fix potential double replacement
text = text.replace(
    "{t('adminPage.overview.outboxTitle', '{t('adminPage.overview.outboxTitle', 'E-mails com Falha de Envio (Outbox)')}')}",
    "{t('adminPage.overview.outboxTitle', 'E-mails com Falha de Envio (Outbox)')}"
)

with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Outbox translation fixed.')
