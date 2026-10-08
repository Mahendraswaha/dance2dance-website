import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/WorkshopAgendaSection.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = """      // NOVO: Verificar se o email está confirmado
      if (auth.currentUser) await reload(auth.currentUser);
      if (!auth.currentUser?.emailVerified && !currentUser?.profile?.emailVerified) {
        toast.success(t('auth.verifyEmailAlert', 'Falta só um passo! Confirme seu e-mail clicando no link que enviamos para garantir sua vaga.'));
        return;
      }"""

replacement = """      // NOVO: Verificar se o email está confirmado
      if (auth.currentUser) await reload(auth.currentUser);
      
      // Sincronizar o Firestore se o Auth estiver validado mas o Firestore ainda não souber (evita bug visual no Admin)
      if (auth.currentUser?.emailVerified && !currentUser?.profile?.emailVerified) {
        try {
          const { doc, setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'users', currentUser.uid), { emailVerified: true }, { merge: true });
        } catch (e) {
          console.error("Erro ao sincronizar emailVerified:", e);
        }
      }

      if (!auth.currentUser?.emailVerified && !currentUser?.profile?.emailVerified && !currentUser?.profile?.emailVerifiedOverride) {
        toast.error(t('auth.verifyEmailAlert', 'Falta só um passo! Confirme seu e-mail clicando no link que enviamos para garantir sua vaga.'));
        return;
      }"""

# A target pode ter falhado por causa dos caracteres, vamos usar replace simples
if 'await reload(auth.currentUser);' in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Fixed WorkshopAgendaSection sync")
else:
    print("Target not found.")
