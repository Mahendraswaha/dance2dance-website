import codecs
import re

# 1. Update WorkshopAgendaSection.jsx
file_agenda = 'C:/Renas/Antigravity/Website-builder/src/components/WorkshopAgendaSection.jsx'
with codecs.open(file_agenda, 'r', 'utf-8') as f:
    content_agenda = f.read()

content_agenda = re.sub(
    r'if \(!auth\.currentUser\?\.emailVerified\) \{',
    r'if (!auth.currentUser?.emailVerified && !currentUser?.profile?.emailVerified) {',
    content_agenda
)

with codecs.open(file_agenda, 'w', 'utf-8') as f:
    f.write(content_agenda)


# 2. Update AgendaPage.jsx
file_agendapage = 'C:/Renas/Antigravity/Website-builder/src/pages/AgendaPage.jsx'
with codecs.open(file_agendapage, 'r', 'utf-8') as f:
    content_agendapage = f.read()

content_agendapage = re.sub(
    r'if \(!auth\.currentUser\?\.emailVerified\) \{',
    r'if (!auth.currentUser?.emailVerified && !currentUser?.profile?.emailVerified) {',
    content_agendapage
)

with codecs.open(file_agendapage, 'w', 'utf-8') as f:
    f.write(content_agendapage)


# 3. Update UserDetailModal.jsx
file_modal = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'
with codecs.open(file_modal, 'r', 'utf-8') as f:
    content_modal = f.read()

# Inject the button near the email display
email_html = r'<div className="mt-1\.5 flex items-center gap-1\.5 text-\[#A3A3A3\] text-sm">\s*<Mail className="w-3\.5 h-3\.5 text-\[#555555\]" />\s*<a href=\{`mailto:\$\{user\.email\}`\} className="hover:text-accent transition-colors">\{user\.email\}</a>\s*</div>'

new_email_html = r'''<div className="mt-1.5 flex items-center gap-1.5 text-[#A3A3A3] text-sm">
                  <Mail className="w-3.5 h-3.5 text-[#555555]" />
                  <a href={`mailto:${user.email}`} className="hover:text-accent transition-colors">{user.email}</a>
                  {user.emailVerified ? (
                    <span className="ml-2 px-1.5 py-0.5 rounded-[2px] bg-green-950/40 text-green-400 text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> E-mail Validado
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={async () => {
                        try {
                          await updateDoc(doc(db, 'users', user.id || user.uid), { emailVerified: true });
                          if (onUserUpdated) onUserUpdated(user.id || user.uid, { emailVerified: true });
                          toast.success('E-mail marcado como validado com sucesso.');
                        } catch (err) {
                          toast.error('Erro ao validar e-mail.');
                        }
                      }}
                      className="ml-2 px-2 py-0.5 rounded-[2px] bg-[#1A1A24] hover:bg-accent/20 border border-[#2A2A38] hover:border-accent/40 text-[#A3A3A3] hover:text-accent text-[10px] uppercase font-semibold tracking-wider transition-all"
                      title="Marcar e-mail como validado manualmente"
                    >
                      Validar E-mail
                    </button>
                  )}
                </div>'''

content_modal = re.sub(email_html, new_email_html, content_modal, flags=re.DOTALL)

with codecs.open(file_modal, 'w', 'utf-8') as f:
    f.write(content_modal)

print("Email verification checks updated.")
