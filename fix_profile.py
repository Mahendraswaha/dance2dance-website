import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/ProfilePage.jsx'
with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

target = """  // Carrega dados do perfil atual
  useEffect(() => {"""

replacement = """  // Sincroniza o Firebase Auth com o Firestore para o Admin saber que está validado
  useEffect(() => {
    async function syncVerification() {
      if (auth.currentUser && !currentUser?.profile?.emailVerified) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          try {
            await setDoc(doc(db, 'users', currentUser.uid), { emailVerified: true }, { merge: true });
          } catch (e) {
            console.error("Erro ao sincronizar Firestore na ProfilePage:", e);
          }
        }
      }
    }
    syncVerification();
  }, [currentUser]);

  // Carrega dados do perfil atual
  useEffect(() => {"""

if target in content:
    content = content.replace(target, replacement)
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(content)
    print("Fixed ProfilePage sync")
else:
    print("Target not found.")
