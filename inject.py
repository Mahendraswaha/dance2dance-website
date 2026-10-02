import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''              </div>
            )}
          </div>
        </div>

        {/* Footer do Modal */}'''

new_sections = '''              </div>
            )}
          </div>

          {/* Seção 4: Acompanhamento e Avaliações (Admin) */}
          <div className="pt-8 space-y-4 border-t border-[#1A1A24]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.crmNotesTitle', 'Acompanhamento & Avaliações (CRM)')}
              </h3>
              <button className="text-[10px] font-heading uppercase tracking-wider text-accent border border-accent/30 hover:bg-accent hover:text-primary transition-colors px-3 py-1 rounded-[2px]">
                + Nova Anotação
              </button>
            </div>
            
            {!user.adminNotes || user.adminNotes.length === 0 ? (
              <div className="p-6 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-500 font-heading text-xs italic">
                  {t('adminPage.usersManager.noCrmNotes', 'Nenhum histórico de acompanhamento registrado para este aluno.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.adminNotes.map((note, idx) => (
                  <div key={idx} className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-heading font-semibold text-[#E0DDD5]">{note.author || 'Admin'}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {note.date ? new Date(note.date).toLocaleDateString(currentLang) : ''}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 5: Feedback do Usuário */}
          <div className="pt-8 space-y-4 border-t border-[#1A1A24]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs uppercase tracking-[2px] text-accent font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                {t('adminPage.usersManager.userFeedbackTitle', 'Feedbacks do Usuário')}
              </h3>
            </div>
            
            {userEnrollments.filter(e => e.userFeedback).length === 0 ? (
              <div className="p-6 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-500 font-heading text-xs italic">
                  {t('adminPage.usersManager.noUserFeedback', 'Este aluno ainda não enviou nenhum feedback de curso.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userEnrollments.filter(e => e.userFeedback).map((enr, idx) => (
                  <div key={idx} className="p-4 bg-[#161620] border border-[#22222E] rounded-[2px]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-heading font-semibold text-accent uppercase tracking-wide">
                        {enr.event?.title || 'Workshop'}
                      </span>
                      {enr.userFeedback.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={\w-3 h-3 \\} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-sans italic text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      "{enr.userFeedback.text || enr.userFeedback.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer do Modal */}'''

if target in text:
    text = text.replace(target, new_sections)
    with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Sections injected successfully!')
else:
    print('Target string not found in the file!')
