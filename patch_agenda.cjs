const fs = require('fs');
let code = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

// Add emailSent: false
code = code.replace(
    /status: finalStatus,\n\s*createdAt: new Date\(\)\.toISOString\(\)/g,
    `status: finalStatus,\n            emailSent: false,\n            createdAt: new Date().toISOString()`
);

// Add emailSent: true after successful fetch
code = code.replace(
    /const response = await fetch\('\/api\/agenda-notify', \{([\s\S]*?)\}\);\n\s*\} catch\(emailErr\)/g,
    `const response = await fetch('/api/agenda-notify', {$1});\n              if (response.ok) {\n                await updateDoc(newEnrollmentRef, { emailSent: true });\n              }\n            } catch(emailErr)`
);

fs.writeFileSync('src/pages/AgendaPage.jsx', code);
