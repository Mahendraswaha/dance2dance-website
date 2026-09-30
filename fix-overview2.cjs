const fs = require('fs');
let code = fs.readFileSync('src/components/admin/OverviewTab.jsx', 'utf8');

code = code.replace(
    /const fetchFailedEmails = async \(\) => \{\n    setIsLoading\(true\);\n    try \{\n      const usersSnap = await getDocs\(collection\(db, 'users'\)\);\n      setTotalUsers\(usersSnap\.size\);\n\n      const q = query\(collection\(db, 'enrollments'\), where\('emailSent', '==', false\)\);\n      const snapshot = await getDocs\(q\);\n      const failures = \[\];\n      snapshot\.forEach\(docSnap => failures\.push\(\{ id: docSnap\.id, ...docSnap\.data\(\) \}\)\);\n      setFailedEmails\(failures\);\n    \} catch \(err\) \{\n      console\.error\(err\);\n    \} finally \{\n      setIsLoading\(false\);\n    \}\n  \};\n\n  const fetchFailedEmails = /,
    `const fetchFailedEmailsAndUsers = async () => {\n    setIsLoading(true);\n    try {\n      const usersSnap = await getDocs(collection(db, 'users'));\n      setTotalUsers(usersSnap.size);\n\n      const q = query(collection(db, 'enrollments'), where('emailSent', '==', false));\n      const snapshot = await getDocs(q);\n      const failures = [];\n      snapshot.forEach(docSnap => failures.push({ id: docSnap.id, ...docSnap.data() }));\n      setFailedEmails(failures);\n    } catch (err) {\n      console.error(err);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  const fetchFailedEmails = async () => {\n    // Dummy so the rest of the code works\n  };`
);

fs.writeFileSync('src/components/admin/OverviewTab.jsx', code);
