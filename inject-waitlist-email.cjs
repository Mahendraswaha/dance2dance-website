const fs = require('fs');

function injectWaitlistJoined(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Find where enrolled is processed
  // if (finalStatus === 'enrolled') {
  
  const waitlistBlock = `
        if (finalStatus === 'waitlist') {
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
                type: 'waitlist_joined',
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
            console.error("Failed to send waitlist joined email", emailErr);
          }
        }
        
        if (finalStatus === 'enrolled') {`;

  // Only inject if it doesn't exist
  if (!code.includes("type: 'waitlist_joined'")) {
    code = code.replace(/if\s*\(\s*finalStatus\s*===\s*'enrolled'\s*\)\s*\{/g, waitlistBlock.trim());
    fs.writeFileSync(file, code);
  }
}

injectWaitlistJoined('src/pages/AgendaPage.jsx');
injectWaitlistJoined('src/components/WorkshopAgendaSection.jsx');
console.log('Injected waitlist_joined emails');
