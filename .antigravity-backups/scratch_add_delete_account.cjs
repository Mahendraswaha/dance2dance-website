const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// 1. Add imports for deleteDoc, doc, deleteUser
// deleteDoc and doc are usually already there from 'firebase/firestore'
// We need deleteUser from 'firebase/auth'
if (!code.includes("deleteUser")) {
  code = code.replace(
    "import { auth, db } from '../firebase';",
    "import { auth, db } from '../firebase';\nimport { deleteUser } from 'firebase/auth';"
  );
}

// Ensure Trash2 icon is imported
if (!code.includes("Trash2")) {
  code = code.replace(
    "AlertCircle",
    "AlertCircle, Trash2, TriangleAlert"
  );
}

// 2. Add the handleDeleteAccount function right before the return statement
const deleteFunc = `
  async function handleDeleteAccount() {
    if (!window.confirm(t('profile.confirmDelete', 'ZONA DE PERIGO:\\nTem certeza absoluta? Esta ação não pode ser desfeita e você perderá o acesso a todas as suas inscrições.'))) {
      return;
    }
    
    try {
      // 1. Apagar documento do Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid));
      
      // 2. Apagar usuário no Auth
      await deleteUser(currentUser);
      
      alert(t('profile.accountDeleted', 'Sua conta foi excluída com sucesso.'));
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert(t('profile.reauthNeeded', 'Por segurança, você precisa fazer logout e entrar novamente antes de excluir sua conta.'));
        logout();
      } else {
        alert(t('profile.deleteError', 'Ocorreu um erro ao excluir sua conta: ') + error.message);
      }
    }
  }

  return (
`;

code = code.replace(/  return \(\s*<div className="bg-primary/g, deleteFunc + "  <div className=\"bg-primary");


// 3. Add the Danger Zone UI after the form
const dangerZoneUI = `
                </form>

                {/* DANGER ZONE */}
                <div className="mt-16 pt-8 border-t border-red-900/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[2px] bg-red-950/20 border border-red-900/40">
                    <div>
                      <h3 className="text-red-400 font-heading text-sm font-bold tracking-wider uppercase mb-1 flex items-center gap-2">
                        <TriangleAlert className="w-4 h-4" />
                        {t('profile.dangerZone', 'Zona de Perigo')}
                      </h3>
                      <p className="text-zinc-500 font-sans text-xs">
                        {t('profile.dangerZoneDesc', 'Ao excluir sua conta, você perderá acesso permanente a todos os seus dados e inscrições. Esta ação é irreversível.')}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={handleDeleteAccount}
                      className="whitespace-nowrap px-6 py-3 bg-red-950 hover:bg-red-900 text-red-300 hover:text-white border border-red-900 hover:border-red-500 transition-colors rounded-[2px] font-heading text-[10px] uppercase tracking-[2px] font-bold shrink-0 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('profile.deleteAccountBtn', 'Excluir Conta')}
                    </button>
                  </div>
                </div>
`;

code = code.replace(/                <\/form>/, dangerZoneUI);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('ProfilePage updated with Delete Account feature');
