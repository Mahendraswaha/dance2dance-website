const fs = require('fs');

function patchFile(filename) {
    let code = fs.readFileSync(filename, 'utf8');

    // 1. Save userLang on enrollment
    code = code.replace(/eventId:\s*eventId,/g, "eventId: eventId,\n            userLang: currentLang,");

    // 2. Use promoted user's language for the waitlist promotion email
    // The previous code had: `userLang: currentLang, // Might send in the canceler's lang`
    code = code.replace(/userLang:\s*currentLang,\s*\/\/\s*Might send in the canceler's lang[\s\S]*?(workshopName:)/g, "userLang: promotedEnrollmentData.userLang || currentLang,\n                  $1");

    fs.writeFileSync(filename, code);
    console.log(`Patched ${filename}`);
}

patchFile('src/pages/AgendaPage.jsx');
patchFile('src/components/WorkshopAgendaSection.jsx');
