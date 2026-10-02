import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix translations and add ongoingEvents block
upcoming_old = """{/* Visão de Ocupação */}
      <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-400 font-semibold">{t('adminPage.overview.upcomingClasses', 'Próximas Turmas (Visão Rápida)')}</h3>
        </div>"""

upcoming_new = """{/* Eventos em Andamento */}
      <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h3 className="font-heading uppercase tracking-[1px] text-xs text-accent font-semibold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {t('adminPage.overview.ongoingEvents', 'Eventos em Andamento')}
          </h3>
        </div>
        <div className="divide-y divide-[#222222]">
          {ongoingEvents.map(ev => {
            const enrolled = ev.enrolledCount || 0;
            const total = ev.totalSpots || 0;
            const percentage = total > 0 ? Math.min(100, Math.round((enrolled / total) * 100)) : 0;
            
            return (
              <div key={ev.id} className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1">{ev.title_pt || ev.title_en}</h4>
                  <p className="text-xs text-zinc-500">{new Date(ev.startDate).toLocaleDateString(i18n.language || 'pt-BR')} — {ev.startTime}</p>
                </div>
                <div className="w-1/3 flex items-center gap-4">
                  <div className="flex-1 bg-[#121214] h-2 rounded-full overflow-hidden border border-[#333333]">
                    <div 
                      className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 w-12 text-right">{enrolled}/{total}</span>
                </div>
              </div>
            );
          })}
          
          {ongoingEvents.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm font-heading">
              {t('adminPage.overview.noOngoing', 'Nenhum evento em andamento no momento.')}
            </div>
          )}
        </div>
      </div>

      {/* Visão de Ocupação (Futuras) */}
      <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-400 font-semibold">{t('adminPage.overview.upcomingClasses', 'Próximas Turmas (Visão Rápida)')}</h3>
        </div>"""

text = text.replace(
    'Nenhuma turma futura programada.', 
    '{t(\'adminPage.overview.noUpcoming\', \'Nenhuma turma futura programada.\')}'
)

text = text.replace(
    "new Date(ev.startDate).toLocaleDateString('pt-BR')",
    "new Date(ev.startDate).toLocaleDateString(i18n.language || 'pt-BR')"
)

import re

# Safely replace the old upcoming header with the new dual section
# Because there might be encoding characters in {/* Visão de Ocupação */}, let's use regex
text = re.sub(
    r'\{\/\*\s*Vis.*?Ocupa.*?\}\s*<div className="bg-\[#0A0A0E\] border border-\[#222222\] rounded-md overflow-hidden">\s*<div className="p-5 border-b border-\[#222222\]">\s*<h3 className="font-heading uppercase tracking-\[1px\] text-xs text-zinc-400 font-semibold">\{t\(\'adminPage\.overview\.upcomingClasses\'.*?</h3>\s*</div>',
    upcoming_new,
    text,
    flags=re.DOTALL
)

with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('OverviewTab lists updated.')
