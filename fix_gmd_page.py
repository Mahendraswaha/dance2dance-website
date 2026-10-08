import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# 1. Replace state definition and handleEventsLoaded
target1 = r'''  // Track if there are events to change the section subtitle
  const \[hasEvents, setHasEvents\] = useState\(false\);
  const handleEventsLoaded = useCallback\(\(state\) => \{
    setHasEvents\(state\.hasDates\);
  \}, \[\]\);'''

replacement1 = r'''  // Estado contextual da agenda do workshop
  const [agendaState, setAgendaState] = useState({ loaded: false, hasDates: false, hasSpots: false });
  const handleEventsLoaded = useCallback((matchingEvents) => {
    if (!matchingEvents || matchingEvents.length === 0) {
      setAgendaState({ loaded: true, hasDates: false, hasSpots: false });
    } else {
      const anySpotAvailable = matchingEvents.some(ev => (ev.enrolledCount || 0) < (ev.totalSpots || 0));
      setAgendaState({ loaded: true, hasDates: true, hasSpots: anySpotAvailable });
    }
  }, []);

  const contextualSubtitle = !agendaState.loaded
    ? t('actions.ready_to_start_sub', 'Inscreva-se em uma das datas abaixo ou entre na lista de interesse para novas turmas.')
    : agendaState.hasDates
      ? (agendaState.hasSpots 
          ? t('actions.ready_to_start_has_spots', 'Inscreva-se agora e garanta sua vaga.')
          : t('actions.ready_to_start_waitlist', 'Inscreva-se na lista de espera.'))
      : t('actions.ready_to_start_wishlist', 'Inscreva-se na lista de interesse para novas turmas.');'''

content = re.sub(target1, replacement1, content)


# 2. Replace the bottom section rendering (close the container and apply the max-w-6xl)
target2 = r'''          </div>
        </section>
        
        <div className="w-full h-\[1px\] bg-slate-800/60 mb-20" />

        \{/\* AGENDA SECTION & REGISTRATION \*/\}
        <div className="text-center mb-12">
          <h2 className="font-batang text-4xl md:text-5xl text-\[#F0EDE8\] mb-4">
            \{t\('actions\.ready_to_start', 'Pronto para comear\?'\)\}
          </h2>
          <p className="font-heading text-\[#CFCFCF\] text-lg font-light">
            \{hasEvents 
              \? t\('actions\.ready_to_start_has_spots', 'Inscreva-se agora e garanta sua vaga\.'\)
              : t\('actions\.ready_to_start_wishlist', 'Inscreva-se na lista de interesse para novas turmas\.'\)\}
          </p>
        </div>

        <WorkshopAgendaSection 
          program=\{program\} 
          workshop=\{workshop\} 
          onEventsLoaded=\{handleEventsLoaded\}
        />

        \{/\* ACTION BUTTONS \(Print 2 style\) \*/\}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-16">'''

# Let's write the target2 using a smarter approach
target2_smart = r'''              </div>\s*</section>\s*<div className="w-full h-\[1px\] bg-slate-800/60 mb-20" />\s*\{\/\* AGENDA SECTION & REGISTRATION \*\/.*?<WorkshopAgendaSection .*?/>\s*\{\/\* ACTION BUTTONS \(Print 2 style\) \*\/\}\s*<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-16">'''

replacement2 = r'''              </div>
            </section>
          </div>

          {/* 🌟 CALL TO ACTION & WORKSHOP AGENDA (SAME WIDTH AS AGENDA PAGE: max-w-6xl) 🌟 */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 mt-24 pt-16 border-t border-[#222222] flex flex-col items-center w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-6 max-w-2xl mx-auto"
            >
              <h3 className="font-batang text-3xl md:text-5xl text-[#F0EDE8] mb-3">
                {t('actions.ready_to_start', 'Pronto para começar?')}
              </h3>
              <p className="font-heading font-light text-[#9A9A9A] text-xs md:text-sm leading-relaxed">
                {contextualSubtitle}
              </p>
            </motion.div>

            <WorkshopAgendaSection 
              program={program} 
              workshop={workshop} 
              onEventsLoaded={handleEventsLoaded}
            />

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 mb-12">'''

content = re.sub(target2_smart, replacement2, content, flags=re.DOTALL)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("GoodMorningDancePage updated.")
