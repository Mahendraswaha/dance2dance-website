import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/RegisteredUsersManager.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = '''<Mail className="w-3 h-3 text-accent/60 shrink-0" />
                        <span>{email}</span>
                      </span>'''

replacement = '''<Mail className="w-3 h-3 text-accent/60 shrink-0" />
                        <span>{email}</span>
                        {user.emailVerified ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500/80 shrink-0 ml-0.5" title="E-mail Validado" />
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-red-950/40 text-red-400 text-[9px] uppercase font-semibold tracking-wider flex items-center gap-1 ml-1" title="E-mail NÃO validado">Não Validado</span>
                        )}
                      </span>'''

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Injected emailVerified badge into RegisteredUsersManager.jsx")
else:
    print("Target not found.")
