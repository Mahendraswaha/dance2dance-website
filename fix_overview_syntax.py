import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(r"t(\'adminPage.overview.upcomingClasses\', \'Próximas Turmas (Visão Rápida)\')", "t('adminPage.overview.upcomingClasses', 'Próximas Turmas (Visão Rápida)')")
text = text.replace(r"t(\'adminPage.overview.noUpcoming\', \'Nenhuma turma futura programada.\')", "t('adminPage.overview.noUpcoming', 'Nenhuma turma futura programada.')")
text = text.replace(r"\{t", "{t")

with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('OverviewTab syntax fixed.')
