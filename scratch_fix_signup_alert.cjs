const fs = require('fs');

let code = fs.readFileSync('src/pages/SignupPage.jsx', 'utf8');

const oldBlock = `      await signup(formData.email, formData.password, userData);
      navigate(from, { replace: true });`;

const newBlock = `      await signup(formData.email, formData.password, userData);
      alert(t('auth.signupSuccessAlert', 'Cadastro concluído! Enviamos um link de confirmação para o seu e-mail. Por favor, verifique sua caixa de entrada antes de se inscrever nos workshops.'));
      navigate(from, { replace: true });`;

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('src/pages/SignupPage.jsx', code, 'utf8');
console.log("SignupPage alert added");
