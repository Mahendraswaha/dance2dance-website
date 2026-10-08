import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = r'''            <div className="w-full h-\[1px\] bg-slate-800/60 mb-20" />

            \{\/\* AGENDA SECTION & REGISTRATION \*\/\}
            <div className="text-center mb-12">
              <h2 className="font-batang text-4xl md:text-5xl text-\[#F0EDE8\] mb-4">
                \{t\('actions\.ready_to_start', 'Pronto para começar\?'\)\}
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

            \{\/\* ACTION BUTTONS \(Print 2 style\) \*\/\}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-16">'''

# Let's search using a simpler regex
target_simple = r'</div>\s*</section>\s*<div className="w-full h-\[1px\].*?mb-16">'

replacement = r'''              </div>
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
              <p className="font-heading font-light text-[#9A9A9A] text-xs md:text-sm leading-relaxed whitespace-pre-line">
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

content = re.sub(target_simple, replacement, content, flags=re.DOTALL)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("Fixed JSX block in GoodMorningDancePage")
