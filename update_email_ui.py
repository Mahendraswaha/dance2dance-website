import codecs
import re

file_modal = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'
with codecs.open(file_modal, 'r', 'utf-8') as f:
    content = f.read()

email_html = r'''                <span className="truncate">\{email\}</span>
                <span className="text-zinc-600">.*?</span>
                <span className="text-zinc-400">
                  \{t\('adminPage.usersManager.memberSince', 'Membro desde'\)\} \{createdAtFormatted\}
                </span>'''

new_email_html = r'''                <span className="truncate">{email}</span>
                {user.emailVerified ? (
                  <span className="ml-1 px-1.5 py-0.5 rounded-[2px] bg-green-950/40 text-green-400 text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1" title="E-mail Validado">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                ) : (
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'users', user.id || user.uid), { emailVerified: true });
                        if (onUserUpdated) onUserUpdated(user.id || user.uid, { emailVerified: true });
                        toast.success('E-mail marcado como validado.');
                      } catch (err) {
                        toast.error('Erro ao validar e-mail.');
                      }
                    }}
                    className="ml-1 px-1.5 py-0.5 rounded-[2px] bg-red-950/40 hover:bg-accent/20 border border-red-900/40 hover:border-accent/40 text-red-400 hover:text-accent text-[10px] uppercase font-semibold tracking-wider transition-all"
                    title="E-mail NÃO validado. Clique para forçar a validação."
                  >
                    Não Validado
                  </button>
                )}
                <span className="text-zinc-600 ml-1">•</span>
                <span className="text-zinc-400">
                  {t('adminPage.usersManager.memberSince', 'Membro desde')} {createdAtFormatted}
                </span>'''

content = re.sub(email_html, new_email_html, content, flags=re.DOTALL)

with codecs.open(file_modal, 'w', 'utf-8') as f:
    f.write(content)
