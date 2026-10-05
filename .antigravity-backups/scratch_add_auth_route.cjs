const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Add import
code = code.replace(
  "const SignupPage = lazyWithRetries(() => import('./pages/SignupPage'));",
  "const SignupPage = lazyWithRetries(() => import('./pages/SignupPage'));\nconst AuthActionPage = lazyWithRetries(() => import('./pages/AuthActionPage'));"
);

// Add route
code = code.replace(
  '<Route path="/cadastro" element={<SignupPage />} />',
  '<Route path="/cadastro" element={<SignupPage />} />\n            <Route path="/auth-action" element={<AuthActionPage />} />'
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('App.jsx updated with AuthActionPage route');
