# -*- coding: utf-8 -*-
with open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_content = '''        {/* Abas Mestras do Painel: Apenas para Admin Geral */}
        {!isInstructor && (
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 mb-8 border-b border-[#222222] pb-4">
            <button
              type="button"
              onClick={() => setMasterTab('overview')}
              className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }
            >
              <span className="truncate">Visão Geral</span>
            </button>

            <button
              type="button"
              onClick={() => setMasterTab('events')}
              className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('adminPage.masterTabEvents', 'Eventos & Agenda')}</span>
              <span className={	ext-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 }>
                {events.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMasterTab('users')}
              className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('adminPage.masterTabUsers', 'Alunos & Usuários')}</span>
            </button>

            <button
              type="button"
              onClick={() => setMasterTab('wishlists')}
              className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer relative }
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('adminPage.masterTabWishlist', 'Wishlists')}</span>
              {wishlistStats.totalWorkshops > 0 && (
                <span className={	ext-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 }>
                  {wishlistStats.totalWorkshops}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMasterTab('communications')}
              className={lex-1 sm:flex-initial flex items-center justify-center sm:justify-start gap-2.5 px-3.5 sm:px-5 py-2.5 rounded-[2px] font-heading text-[11px] sm:text-xs uppercase tracking-[1.5px] font-semibold transition-all cursor-pointer }
            >
              <span className="truncate">Comunicações</span>
            </button>
          </div>
        )}
'''

import re
# find the line with '{/* Abas Mestras do Painel: Apenas para Admin Geral */}'
start_idx = -1
for i, line in enumerate(lines):
    if '{/* Abas Mestras do Painel: Apenas para Admin Geral */}' in line:
        start_idx = i
        break

end_idx = start_idx
for i in range(start_idx, len(lines)):
    if '{(masterTab === \'events\'' in lines[i] or '{(masterTab === "events"' in lines[i] or '{masterTab === \'overview\'' in lines[i]:
        end_idx = i
        break

del lines[start_idx:end_idx]
lines.insert(start_idx, new_content + '\n')

with open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
