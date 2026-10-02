import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

ongoing_block = """{/* Eventos em Andamento */}
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

      """

# We just insert it before the upcoming events block.
import re

# Find the start of the Upcoming Events block.
# We look for `<div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">`
# Actually, the upcoming block is the LAST such div in the file (or the only one left after the KPI cards which also have `bg-[#0A0A0E]...` but not `overflow-hidden`).
idx = text.find('<div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">')

if idx != -1:
    # Let's verify it's the right block by checking if it contains upcomingClasses nearby
    text = text[:idx] + ongoing_block + text[idx:]
    with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Injected successfully!")
else:
    print("Could not find insertion point!")
