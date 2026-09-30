const fs = require('fs');
let code = fs.readFileSync('src/components/admin/OverviewTab.jsx', 'utf8');

const oldPayload = `      const payload = {
        eventId: enrollment.eventId,
        userId: enrollment.userId,
        userEmail: enrollment.userEmail,
        userName: enrollment.userName,
        eventTitleEn: ev.title_en || 'Dance2Dance Event',
        eventTitlePt: ev.title_pt || 'Dance2Dance Event',
        eventTitleNo: ev.title_no || 'Dance2Dance Event',
        eventDate: ev.startDate || '',
        eventTime: ev.startTime || '',
        language: enrollment.language || 'en'
      };`;

const newPayload = `      let dateStr = '';
      if (ev?.startDate) dateStr = new Date(ev.startDate + 'T12:00:00').toLocaleDateString(enrollment.language === 'no' ? 'no-NO' : enrollment.language === 'en' ? 'en-US' : 'pt-BR');
      
      const payload = {
        type: enrollment.status === 'waitlist' ? 'waitlist_joined' : 'enrollment_confirmed',
        userEmail: enrollment.userEmail,
        userName: enrollment.userName,
        lang: enrollment.language || 'en',
        workshopName: enrollment.language === 'no' ? (ev.title_no || ev.title_en) : enrollment.language === 'en' ? (ev.title_en || ev.title_pt) : (ev.title_pt || ev.title_en),
        workshopDate: dateStr,
        workshopTime: ev.startTime || '',
        workshopLink: 'https://www.dance2dance.no/agenda',
        locationName: 'Dance2Dance Studio',
        locationMapLink: 'https://maps.google.com'
      };`;

code = code.replace(oldPayload, newPayload);

fs.writeFileSync('src/components/admin/OverviewTab.jsx', code);
