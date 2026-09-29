const fs = require('fs');

let authContext = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');

// Add sendEmailVerification to imports
authContext = authContext.replace(
  "updateProfile,",
  "updateProfile,\n  sendEmailVerification,"
);

// Add to signup function
const signupBlock = `    // Create the user document in Firestore with additional data
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date().toISOString(),
      ...userData
    });

    // Enviar email de verificação
    try {
      await sendEmailVerification(user);
    } catch (err) {
      console.error("Erro ao enviar email de verificação:", err);
    }
`;
authContext = authContext.replace(
  /    \/\/ Create the user document in Firestore with additional data[\s\S]*?\.\.\.userData\n    \}\);/,
  signupBlock
);

// Add resend function
const resendFunc = `  async function resendVerificationEmail() {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  }

  const value = {`;
authContext = authContext.replace("  const value = {", resendFunc);

authContext = authContext.replace(
  "resetPassword,",
  "resetPassword,\n    resendVerificationEmail,"
);

fs.writeFileSync('src/contexts/AuthContext.jsx', authContext, 'utf8');
console.log("AuthContext patched");
