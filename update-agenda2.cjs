const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AgendaPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace handleEnroll to add the email sending logic
const enrollRegex = /createdAt: new Date\(\)\.toISOString\(\)\s*\}\);\s*\}\);/g;
const newEnrollLogic = `createdAt: new Date().toISOString()
          });
        });

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
        }`;

content = content.replace(enrollRegex, newEnrollLogic);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated handleEnroll");
