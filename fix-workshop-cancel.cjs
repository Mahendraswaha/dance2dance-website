const fs = require('fs');

let code = fs.readFileSync('src/components/WorkshopAgendaSection.jsx', 'utf8');

const regex = /async function handleCancelEnrollment\(eventId\) {([\s\S]*?)await runTransaction\(db, async \(transaction\) => {([\s\S]*?)transaction\.delete\(enrollmentRef\);\s*}\);\s*if \(promotedEnrollmentData\) {/m;

const replacement = `async function handleCancelEnrollment(eventId) {
    if (!window.confirm(t("agendaPage.confirmCancel", "Tem certeza que deseja cancelar sua inscrição/espera para este evento?"))) return;
    
    setActionLoading(eventId);
    try {
      const enrollmentData = userEnrollments[eventId];
      if (!enrollmentData) return;

      const eventRef = doc(db, 'events', eventId);
      const enrollmentRef = doc(db, 'enrollments', enrollmentData.id);

      let promotedEnrollmentRef = null;
      let promotedEnrollmentData = null;

      if (enrollmentData.status === 'enrolled') {
        // Query for the oldest waitlist entry
        const waitlistQ = query(collection(db, 'enrollments'), where('eventId', '==', eventId), where('status', '==', 'waitlist'));
        const waitlistSnap = await getDocs(waitlistQ);
        if (!waitlistSnap.empty) {
          // Sort manually if createdAt is missing in some old records
          const sortedDocs = waitlistSnap.docs.sort((a, b) => {
            const aTime = a.data().createdAt || '9999';
            const bTime = b.data().createdAt || '9999';
            return aTime.localeCompare(bTime);
          });
          promotedEnrollmentRef = sortedDocs[0].ref;
          promotedEnrollmentData = sortedDocs[0].data();
        }
      }

      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) throw new Error(t('agendaPage.eventNotFound', "Evento não encontrado."));
        
        const eventData = eventDoc.data();
        
        if (enrollmentData.status === 'waitlist') {
          transaction.update(eventRef, { waitlistCount: Math.max(0, eventData.waitlistCount - 1) });
        } else {
          if (promotedEnrollmentRef) {
            const promotedDoc = await transaction.get(promotedEnrollmentRef);
            if (promotedDoc.exists() && promotedDoc.data().status === 'waitlist') {
              transaction.update(promotedEnrollmentRef, { status: 'enrolled' });
              transaction.update(eventRef, { waitlistCount: Math.max(0, eventData.waitlistCount - 1) });
              // enrolledCount stays the same
            } else {
              transaction.update(eventRef, { enrolledCount: Math.max(0, eventData.enrolledCount - 1) });
              promotedEnrollmentData = null; // invalid promotion
            }
          } else {
            transaction.update(eventRef, { enrolledCount: Math.max(0, eventData.enrolledCount - 1) });
          }
        }

        transaction.delete(enrollmentRef);
      });

      if (promotedEnrollmentData) {`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/WorkshopAgendaSection.jsx', code);
console.log("WorkshopAgendaSection logic fixed!");
