const fs = require('fs');
let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// 1. Update auth imports
code = code.replace(
  "import { deleteUser } from 'firebase/auth';",
  "import { deleteUser, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth';"
);

// 2. Rewrite handleDeleteAccount
const oldHandleDelete = `  async function handleDeleteAccount() {
    if (!window.confirm(t('profile.confirmDelete', 'ZONA DE PERIGO:\\nTem certeza absoluta? Esta ação não pode ser desfeita e você perderá o acesso a todas as suas inscrições.'))) {
      return;
    }
    
    try {
      // 1. Apagar documento do Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid));
      
      // 2. Apagar usuário no Auth
      if (auth.currentUser) await deleteUser(auth.currentUser);
      
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
  }`;

const newHandleDelete = `  async function handleDeleteAccount() {
    if (!window.confirm(t('profile.confirmDelete', 'ZONA DE PERIGO:\\nTem certeza absoluta? Esta ação não pode ser desfeita e você perderá o acesso a todas as suas inscrições.'))) {
      return;
    }

    try {
      const providerId = auth.currentUser?.providerData[0]?.providerId;
      
      // Reautenticação
      if (providerId === 'password') {
        const password = window.prompt(t('profile.confirmPasswordPrompt', 'Por segurança, digite sua senha para confirmar a exclusão:'));
        if (!password) return; // Usuário cancelou
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
      } else if (providerId === 'google.com') {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(auth.currentUser, provider);
      }

      // 1. Apagar documento do Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid));
      
      // 2. Apagar usuário no Auth
      if (auth.currentUser) await deleteUser(auth.currentUser);
      
      alert(t('profile.accountDeleted', 'Sua conta foi excluída com sucesso.'));
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      if (error.code === 'auth/wrong-password') {
        alert(t('profile.wrongPassword', 'Senha incorreta. A exclusão foi cancelada.'));
      } else if (error.code === 'auth/requires-recent-login') {
        alert(t('profile.reauthNeeded', 'Por segurança, você precisa fazer logout e entrar novamente antes de excluir sua conta.'));
        logout();
      } else {
        alert(t('profile.deleteError', 'Ocorreu um erro ao excluir sua conta: ') + error.message);
      }
    }
  }`;

// Since the spacing might mismatch slightly, I'll use regex or simple string replacement on key parts
code = code.replace(/async function handleDeleteAccount\(\) \{[\s\S]*?\}\s*\}\s*\}/, newHandleDelete);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Updated ProfilePage.jsx with reauthentication logic');
