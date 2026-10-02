import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import { isEventPast } from '../../utils/eventHelpers';", 
    "import { isEventPast, isEventOngoing } from '../../utils/eventHelpers';\nimport { useTranslation } from 'react-i18next';"
)

text = text.replace(
    "export default function OverviewTab({ events, usersCount }) {",
    "export default function OverviewTab({ events, usersCount }) {\n  const { t, i18n } = useTranslation();"
)

text = text.replace(
    "const upcomingEvents = events.filter(e => !isEventPast(e));",
    "const upcomingEvents = events.filter(e => !isEventPast(e) && !isEventOngoing(e));\n  const ongoingEvents = events.filter(e => isEventOngoing(e));"
)

# Translations for KPIs
text = text.replace(">Alunos na Base</h3>", ">{t('adminPage.overview.totalUsers', 'Alunos na Base')}</h3>")
text = text.replace(">Receita Projetada (Prox)</h3>", ">{t('adminPage.overview.projectedRevenue', 'Receita Projetada (Prox)')}</h3>")
text = text.replace(">Eventos Ativos</h3>", ">{t('adminPage.overview.activeEvents', 'Eventos Ativos')}</h3>")
text = text.replace(">Fila de Espera Global</h3>", ">{t('adminPage.overview.globalWaitlist', 'Fila de Espera Global')}</h3>")

# Outbox translations
text = text.replace(">E-mails com Falha de Envio (Outbox)<", ">{t('adminPage.overview.outboxTitle', 'E-mails com Falha de Envio (Outbox)')}<")
text = text.replace(">E-mails com Falha de Envio (Outbox)\n              </h3>", ">{t('adminPage.overview.outboxTitle', 'E-mails com Falha de Envio (Outbox)')}\n              </h3>")

outbox_empty = "Nenhuma falha detectada. Todos os sistemas operando normalmente. Se a internet de algum aluno cair durante o cadastro e o servidor nǜo conseguir enviar o e-mail, ele aparecerǭ aqui para vocǦ reenviar manualmente."
outbox_empty_fix = "{t('adminPage.overview.outboxEmpty', 'Nenhuma falha detectada. Todos os sistemas operando normalmente. Se a internet de algum aluno cair durante o cadastro e o servidor não conseguir enviar o e-mail, ele aparecerá aqui para você reenviar manualmente.')}"
# I need to match the weird encoding string. I will use regex to replace the <p> content of outbox
import re
text = re.sub(
    r'<p className="text-sm text-green-200/70">.*?</p>',
    f'<p className="text-sm text-green-200/70">{outbox_empty_fix}</p>',
    text,
    flags=re.DOTALL,
    count=1
)

text = re.sub(
    r'<h3 className="font-heading uppercase tracking-\[1px\] text-xs text-zinc-400 font-semibold">.*?</h3>',
    r'<h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-400 font-semibold">{t(\'adminPage.overview.upcomingClasses\', \'Próximas Turmas (Visão Rápida)\')}</h3>',
    text
)


with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('OverviewTab modified.')
