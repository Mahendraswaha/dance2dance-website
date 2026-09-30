const fs = require('fs');
let code = fs.readFileSync('src/components/StudentsModal.jsx', 'utf8');

code = code.replace(
    /await fetch\('\/api\/agenda-notify', \{([\s\S]*?)\}\);\n\s*\}\n\s*\} catch \(emailErr\) \{/g,
    `const response = await fetch('/api/agenda-notify', {$1});\n            if (response.ok) {\n              await updateDoc(doc(db, 'enrollments', enrollmentId), { emailSent: true });\n            }\n          }\n        } catch (emailErr) {`
);

fs.writeFileSync('src/components/StudentsModal.jsx', code);
