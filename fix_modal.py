import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add states for editing evaluations
hooks_old = "  const [isAddingNote, setIsAddingNote] = useState(false);"
hooks_new = """  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingEnrId, setEditingEnrId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editNotes, setEditNotes] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);
  const [localEnrollments, setLocalEnrollments] = useState(userEnrollments || []);

  useEffect(() => {
    setLocalEnrollments(userEnrollments || []);
  }, [userEnrollments]);

  async function handleSaveEvaluation(enrId) {
    setIsSavingEval(true);
    try {
      const updatedEval = {
        rating: editRating,
        notes: editNotes,
        instructorName: currentUser?.displayName || currentUser?.email || 'Admin',
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'enrollments', enrId), {
        evaluation: updatedEval
      });
      
      setLocalEnrollments(prev => prev.map(e => e.id === enrId ? { ...e, evaluation: updatedEval } : e));
      setEditingEnrId(null);
      toast.success(t('adminPage.usersManager.evalSavedSuccess', 'Avaliação do workshop salva com sucesso!'));
    } catch (err) {
      console.error('Erro ao salvar avaliação do workshop:', err);
      toast.error(t('adminPage.usersManager.evalSavedError', 'Erro ao salvar avaliação.'));
    } finally {
      setIsSavingEval(false);
    }
  }"""

if hooks_old in text:
    text = text.replace(hooks_old, hooks_new)
else:
    print('Hooks old string not found!')

# Now we need to replace the mapping of `userEnrollments` to `localEnrollments`.
text = text.replace('userEnrollments.map((enr, index)', 'localEnrollments.map((enr, index)')

# Now we need to update the UI block for evaluations.
eval_old = """                          {/* Anotação Interna de CRM / Avaliação do Instrutor */}
                          {enr.evaluation && (
                            <div className="mt-3 pt-2.5 border-t border-white/[0.06] w-full">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-heading uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-accent text-accent" />
                                  {t('adminPage.usersManager.crmNoteTitle', 'CRM • Avaliação do Instrutor')}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {enr.evaluation.rating > 0 && (
                                    <div className="flex items-center gap-0.5">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                          key={s} 
                                          className={`w-3 h-3 ${s <= enr.evaluation.rating ? 'fill-accent text-accent' : 'text-zinc-700'}`} 
                                        />
                                      ))}
                                    </div>
                                  )}
                                  {enr.evaluation.instructorName && (
                                    <span className="text-[10px] font-heading text-zinc-400">
                                      ({enr.evaluation.instructorName})
                                    </span>
                                  )}
                                </div>
                              </div>
                              {enr.evaluation.notes && (
                                <p className="text-xs font-heading italic text-zinc-300 bg-[#161620] p-2.5 rounded-[2px] border border-[#22222E] whitespace-pre-wrap leading-relaxed">
                                  "{enr.evaluation.notes}"
                                </p>
                              )}
                            </div>
                          )}"""

eval_new = """                          {/* Anotação Interna de CRM / Avaliação do Instrutor */}
                          <div className="mt-3 pt-2.5 border-t border-white/[0.06] w-full">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-heading uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-accent text-accent" />
                                {t('adminPage.usersManager.crmNoteTitle', 'CRM • Avaliação do Instrutor')}
                              </span>
                              
                              {editingEnrId !== enr.id && (
                                <button 
                                  onClick={() => {
                                    setEditingEnrId(enr.id);
                                    setEditRating(enr.evaluation?.rating || 0);
                                    setEditNotes(enr.evaluation?.notes || '');
                                  }}
                                  className="text-[10px] text-zinc-400 hover:text-accent underline font-heading uppercase tracking-wider"
                                >
                                  {enr.evaluation ? t('adminPage.usersManager.editEvaluation', 'Editar') : t('adminPage.usersManager.addEvaluation', 'Adicionar Avaliação')}
                                </button>
                              )}
                            </div>

                            {editingEnrId === enr.id ? (
                              <div className="space-y-3 bg-[#121216] border border-[#1E1E24] p-3 rounded-[2px]">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-heading text-zinc-500 uppercase tracking-wider">Rating:</span>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star 
                                        key={s} 
                                        onClick={() => setEditRating(s)}
                                        className={`w-4 h-4 ${s <= editRating ? 'fill-accent text-accent' : 'text-zinc-700 hover:text-zinc-500'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <textarea 
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  placeholder={t('adminPage.usersManager.notePlaceholder', 'Escreva uma anotação sobre o desempenho...')}
                                  className="w-full h-20 bg-[#0A0A0E] border border-[#1E1E28] rounded-[2px] p-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-accent/50 resize-none font-sans"
                                />
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => setEditingEnrId(null)}
                                    className="px-3 py-1.5 rounded-[2px] text-zinc-400 hover:text-white font-heading text-[10px] uppercase tracking-wider transition-colors"
                                  >
                                    {t('adminPage.usersManager.cancel', 'Cancelar')}
                                  </button>
                                  <button 
                                    onClick={() => handleSaveEvaluation(enr.id)}
                                    disabled={isSavingEval}
                                    className="px-3 py-1.5 rounded-[2px] bg-accent hover:bg-accent-hover text-primary font-heading text-[10px] uppercase tracking-wider font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {isSavingEval ? t('adminPage.usersManager.saving', 'Salvando...') : t('adminPage.usersManager.saveEvaluation', 'Salvar Avaliação')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              enr.evaluation && (
                                <div>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    {enr.evaluation.rating > 0 && (
                                      <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                          <Star 
                                            key={s} 
                                            className={`w-3 h-3 ${s <= enr.evaluation.rating ? 'fill-accent text-accent' : 'text-zinc-700'}`} 
                                          />
                                        ))}
                                      </div>
                                    )}
                                    {enr.evaluation.instructorName && (
                                      <span className="text-[10px] font-heading text-zinc-400">
                                        ({enr.evaluation.instructorName})
                                      </span>
                                    )}
                                  </div>
                                  {enr.evaluation.notes && (
                                    <p className="text-xs font-heading italic text-zinc-300 bg-[#161620] p-2.5 rounded-[2px] border border-[#22222E] whitespace-pre-wrap leading-relaxed">
                                      "{enr.evaluation.notes}"
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>"""

if eval_old in text:
    text = text.replace(eval_old, eval_new)
else:
    print('Eval old string not found!')

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('File updated successfully.')
