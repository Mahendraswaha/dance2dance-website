const fs = require('fs');

let code = fs.readFileSync('src/components/StudentsModal.jsx', 'utf8');

const regex = /async function handlePromote\(enrollmentId\) {([\s\S]*?)await runTransaction\(db, async \(transaction\) => {([\s\S]*?)}\);\s*setEnrollments\(prev => prev\.map\(e => e\.id === enrollmentId \? { \.\.\.e, status: 'enrolled' } : e\)\);\s*if \(onEventUpdated\) onEventUpdated\(\);/m;

const replacement = `async function handlePromote(enrollmentId) {
    if (!window.confirm(t("adminPage.studentsModal.confirmPromote", "Mover este aluno da lista de espera para os inscritos?"))) return;

    setActionLoading(enrollmentId);
    try {
      const eventRef = doc(db, 'events', event.id);
      const enrollRef = doc(db, 'enrollments', enrollmentId);

      await runTransaction(db, async (transaction) => {
        const evDoc = await transaction.get(eventRef);
        if (!evDoc.exists()) throw new Error("Evento n\u00e3o encontrado");
        const evData = evDoc.data();

        transaction.update(enrollRef, { status: 'enrolled' });
        transaction.update(eventRef, {
          enrolledCount: (evData.enrolledCount || 0) + 1,
          waitlistCount: Math.max(0, (evData.waitlistCount || 0) - 1)
        });
      });

      setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: 'enrolled' } : e));
      if (onEventUpdated) onEventUpdated();

      // Send the promotion email!
      try {
        const promotedStudent = enrollments.find(e => e.id === enrollmentId);
        if (promotedStudent) {
          const cat = getEventCategory(event);
          const niceCat = cat === 'bethedance' ? 'Be the Dance' : (cat === 'biostretch' ? 'Biostretch' : (cat === 'kroppsskole' ? 'Kroppsskole' : ''));
          const fullTitle = niceCat ? \`\${localizedTitle} - \${niceCat}\` : localizedTitle;
          const link = \`https://www.dance2dance.no\${getEventRoute(event)}\`;
          
          let dateStr = '';
          if (event?.startDate) dateStr = new Date(event.startDate + 'T12:00:00').toLocaleDateString(currentLang === 'no' ? 'no-NO' : currentLang === 'en' ? 'en-US' : 'pt-BR');

          await fetch('/api/agenda-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'waitlist_promoted',
              userEmail: promotedStudent.userEmail,
              userName: promotedStudent.userName,
              userLang: promotedStudent.userLang || currentLang,
              workshopName: fullTitle,
              workshopLink: link,
              workshopDate: dateStr,
              workshopTime: event.startTime || '',
              locationName: localizedLocation || 'Dance2Dance Studio',
              locationMapLink: event?.address ? \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(event.address)}\` : 'https://maps.google.com'
            })
          });
        }
      } catch (emailErr) {
        console.error("Failed to send manual promotion email", emailErr);
      }

`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/StudentsModal.jsx', code);
console.log("StudentsModal patched to send emails on promote!");
