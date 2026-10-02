import io
import re

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add useAuth and arrayUnion imports
if 'from \'../../contexts/AuthContext\'' not in text:
    text = text.replace("import { doc, updateDoc } from 'firebase/firestore';", "import { doc, updateDoc, arrayUnion } from 'firebase/firestore';\nimport { useAuth } from '../../contexts/AuthContext';")

# 2. Add Hooks and Logic
hooks_injection = """  const { currentUser } = useAuth();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [localNotes, setLocalNotes] = useState(user?.adminNotes || []);

  async function handleAddNote() {
    if (!newNoteText.trim()) return;
    setIsSubmittingNote(true);
    try {
      const newNote = {
        text: newNoteText.trim(),
        author: currentUser?.displayName || currentUser?.email || 'Admin',
        date: new Date().toISOString()
      };
      await updateDoc(doc(db, 'users', user.id || user.uid), {
        adminNotes: arrayUnion(newNote)
      });
      setLocalNotes(prev => [...prev, newNote]);
      setNewNoteText('');
      setIsAddingNote(false);
      toast.success(t('adminPage.usersManager.noteAddedSuccess', 'Anotação adicionada com sucesso!'));
    } catch (err) {
      console.error("Erro ao adicionar anotação:", err);
      toast.error(t('adminPage.usersManager.noteAddedError', 'Erro ao adicionar anotação.'));
    } finally {
      setIsSubmittingNote(false);
    }
  }

  // Fecha no ESC"""

text = text.replace("  // Fecha no ESC", hooks_injection)

# 3. Replace the UI Block
old_ui = """              <button className="text-[10px] font-heading uppercase tracking-wider text-accent border border-accent/30 hover:bg-accent hover:text-primary transition-colors px-3 py-1 rounded-[2px]">
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
          </div>"""

new_ui = """              <button 
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="text-[10px] font-heading uppercase tracking-wider text-accent border border-accent/30 hover:bg-accent hover:text-primary transition-colors px-3 py-1 rounded-[2px] cursor-pointer"
              >
                {isAddingNote ? t('adminPage.usersManager.cancel', 'Cancelar') : '+ Nova Anotação'}
              </button>
            </div>
            
            <AnimatePresence>
              {isAddingNote && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px] space-y-3 mb-4">
                    <textarea 
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder={t('adminPage.usersManager.notePlaceholder', 'Escreva uma anotação sobre o desempenho, restrições ou acompanhamento do aluno...')}
                      className="w-full h-24 bg-[#0A0A0E] border border-[#1E1E28] rounded-[2px] p-3 text-xs text-[#FAF8F5] focus:outline-none focus:border-accent/50 resize-none font-sans"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleAddNote}
                        disabled={isSubmittingNote || !newNoteText.trim()}
                        className="px-4 py-2 rounded-[2px] bg-accent hover:bg-accent-hover text-primary font-heading text-[10px] uppercase tracking-wider font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmittingNote ? t('adminPage.usersManager.saving', 'Salvando...') : t('adminPage.usersManager.saveNote', 'Salvar Anotação')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!localNotes || localNotes.length === 0 ? (
              <div className="p-6 text-center bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                <p className="text-zinc-500 font-heading text-xs italic">
                  {t('adminPage.usersManager.noCrmNotes', 'Nenhum histórico de acompanhamento registrado para este aluno.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localNotes.map((note, idx) => (
                  <div key={idx} className="p-4 bg-[#121216] border border-[#1E1E24] rounded-[2px]">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-heading font-semibold text-[#E0DDD5]">{note.author || 'Admin'}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {note.date ? new Date(note.date).toLocaleDateString(currentLang, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>"""

text = text.replace(old_ui, new_ui)

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('UI and Logic replaced!')
