const fs = require('fs');
let code = fs.readFileSync('src/components/WorkshopAgendaSection.jsx', 'utf8');

// Ensure getLocalizedEvent is imported if missing
if (!code.includes('getLocalizedEvent')) {
  code = code.replace("import { getEventCategory }", "import { getEventCategory, getLocalizedEvent }");
}

const enrollBlock = `          });

        if (finalStatus === 'enrolled') {
          try {
            const ev = events.find(e => e.id === eventId);
            const localizedEv = ev ? getLocalizedEvent(ev, currentLang) : {};
            const evTitle = localizedEv.title || '';
            const locationStr = localizedEv.location || ev?.location || 'Dance2Dance Studio';
            const locationMap = ev?.address ? \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(ev.address)}\` : (locationStr ? \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(locationStr)}\` : 'https://maps.google.com');
            
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
        }`;

code = code.replace(/\}\);\s*setUserEnrollments\(prev/g, enrollBlock + '\n\n        setUserEnrollments(prev');

const cancelBlock = `          });

        if (promotedEnrollmentData) {
          try {
            const ev = events.find(e => e.id === eventId);
            const localizedEv = ev ? getLocalizedEvent(ev, currentLang) : {};
            const evTitle = localizedEv.title || '';
            const locationStr = localizedEv.location || ev?.location || 'Dance2Dance Studio';
            const locationMap = ev?.address ? \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(ev.address)}\` : (locationStr ? \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(locationStr)}\` : 'https://maps.google.com');
            
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
                userLang: currentLang,
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
        }`;

code = code.replace(/\}\);\s*const newUserEnrollments/g, cancelBlock + '\n\n        const newUserEnrollments');

fs.writeFileSync('src/components/WorkshopAgendaSection.jsx', code);
console.log('Done!');
