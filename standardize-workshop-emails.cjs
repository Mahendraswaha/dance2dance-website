const fs = require('fs');

let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

const replacements = [
  // PT - Enrolled
  {
    from: '<p>Confirmamos sua inscri&ccedil;&atilde;o para o workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>Confirmamos sua inscri&ccedil;&atilde;o:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // EN - Enrolled
  {
    from: '<p>We have confirmed your registration for the workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>We have confirmed your registration:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // NO - Enrolled
  {
    from: '<p>Vi har bekreftet din registrering for workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>Vi har bekreftet din registrering:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  
  // PT - Waitlist Promoted
  {
    from: '<p>A lista de espera girou e sua vaga para o workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>A lista de espera girou e sua vaga foi confirmada:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // EN - Waitlist Promoted
  {
    from: '<p>The waitlist has moved and your spot for the workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>The waitlist has moved and your spot has been confirmed:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // NO - Waitlist Promoted
  {
    from: '<p>Ventelisten har flyttet seg, og din plass for workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>Ventelisten har flyttet seg, og din plass er bekreftet:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },

  // PT - Waitlist Joined
  {
    from: '<p>Voc&ecirc; entrou na lista de espera para o workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>Voc&ecirc; entrou na lista de espera:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // EN - Waitlist Joined
  {
    from: '<p>You have successfully joined the waitlist for the workshop:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>You have successfully joined the waitlist:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  },
  // NO - Waitlist Joined
  {
    from: '<p>Du st&aring;r n&aring; p&aring; ventelisten for workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p>',
    to: '<p>Du st&aring;r n&aring; p&aring; ventelisten:</p><p style="margin-bottom: 5px;">workshop: <strong>${workshopName}</strong></p>'
  }
];

let changedCount = 0;
for (const r of replacements) {
  if (code.includes(r.from)) {
    code = code.replace(r.from, r.to);
    changedCount++;
  } else {
    console.warn("Could not find:", r.from);
  }
}

fs.writeFileSync('api/agenda-notify.js', code);
console.log(`Replaced ${changedCount} out of ${replacements.length} instances.`);
