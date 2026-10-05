const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AgendaPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. In handleEnroll, add createdAt and the fetch call to /api/agenda-notify
content = content.replace(
  /scholarshipRequested: isScholarship,\s*\}\);\s*\}\);/g,
  `scholarshipRequested: isScholarship,
            createdAt: new Date().toISOString(),
          });
        });

        // 1.5 Send email if enrolled
        if (finalStatus === 'enrolled') {
          try {
            const ev = events.find(e => e.id === eventId);
            const { title: evTitle } = ev ? getLocalizedEvent(ev, currentLang) : { title: '' };
            const locationStr = ev?.location || 'Dance2Dance Studio';
            const locationMap = ev?.mapLink || 'https://maps.google.com';
            
            let dateStr = '';
            let timeStr = '';
            if (ev?.startDate) dateStr = new Date(ev.startDate + 'T12:00:00').toLocaleDateString(currentLang === 'no' ? 'no-NO' : currentLang === 'en' ? 'en-US' : 'pt-BR');
            if (ev?.startTime) timeStr = ev.startTime;

            await fetch('/api/agenda-notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'enrolled',
                userEmail: currentUser.email,
                userName: profileData.fullName || profileData.nome || currentUser.email,
                userLang: currentLang,
                workshopName: evTitle,
                workshopDate: dateStr,
                workshopTime: timeStr,
                locationName: locationStr,
                locationMapLink: locationMap
              })
            });
          } catch(emailErr) {
            console.error("Failed to send enrollment email", emailErr);
          }
        }`
);

// 2. In handleCancelEnrollment, add waitlist promotion logic
const cancelRegex = /await runTransaction\(db, async \(transaction\) => \{[\s\S]*?transaction\.delete\(enrollmentRef\);\s*\}\);/g;
const newCancelLogic = `
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
          if (!eventDoc.exists()) throw new Error("Evento n\\u00e3o encontrado.");
          
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

        if (promotedEnrollmentData) {
          try {
            const ev = events.find(e => e.id === eventId);
            const { title: evTitle } = ev ? getLocalizedEvent(ev, currentLang) : { title: '' };
            const locationStr = ev?.location || 'Dance2Dance Studio';
            const locationMap = ev?.mapLink || 'https://maps.google.com';
            
            let dateStr = '';
            let timeStr = '';
            if (ev?.startDate) dateStr = new Date(ev.startDate + 'T12:00:00').toLocaleDateString(currentLang === 'no' ? 'no-NO' : currentLang === 'en' ? 'en-US' : 'pt-BR');
            if (ev?.startTime) timeStr = ev.startTime;

            await fetch('/api/agenda-notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'waitlist_promoted',
                userEmail: promotedEnrollmentData.userEmail,
                userName: promotedEnrollmentData.userName,
                userLang: currentLang, // Might send in the canceler's lang, but it's fine for now
                workshopName: evTitle,
                workshopDate: dateStr,
                workshopTime: timeStr,
                locationName: locationStr,
                locationMapLink: locationMap
              })
            });
          } catch(emailErr) {
            console.error("Failed to send waitlist promotion email", emailErr);
          }
        }
`;

content = content.replace(cancelRegex, newCancelLogic.trim());

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated AgendaPage.jsx");
