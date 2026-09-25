const fs = require('fs');

let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

const noEnrolledOriginal = '<p>Din plass pǾ <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er bekreftet.</p>';
const noEnrolledOriginal2 = '<p>Din plass p&aring; <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er bekreftet.</p>';
const noEnrolledOriginal3 = '<p>Din plass p\\u01FC <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er bekreftet.</p>';

const noEnrolledNew = '<p>Vi har bekreftet din registrering for workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dato: ${workshopDate}</p><p style="margin-top: 0;">tid: ${workshopTime}</p>';

code = code.replace(noEnrolledOriginal, noEnrolledNew);
code = code.replace(noEnrolledOriginal2, noEnrolledNew);
code = code.replace(noEnrolledOriginal3, noEnrolledNew);
code = code.replace(/<p>Din plass p. <strong>\$\{workshopName\}<\/strong> den \$\{workshopDate\} kl\. \$\{workshopTime\} er bekreftet\.<\/p>/, noEnrolledNew);

const noPromotedOriginal = '<p>Ventelisten har flyttet seg, og din plass pǾ <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er nǾ bekreftet.</p>';
const noPromotedOriginal2 = '<p>Ventelisten har flyttet seg, og din plass p&aring; <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er n&aring; bekreftet.</p>';
const noPromotedOriginal3 = '<p>Ventelisten har flyttet seg, og din plass p\\u01FC <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er n\\u01FC bekreftet.</p>';

const noPromotedNew = '<p>Ventelisten har flyttet seg, og din plass for workshopen:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dato: ${workshopDate}</p><p style="margin-top: 0;">tid: ${workshopTime}</p>';

code = code.replace(noPromotedOriginal, noPromotedNew);
code = code.replace(noPromotedOriginal2, noPromotedNew);
code = code.replace(noPromotedOriginal3, noPromotedNew);
code = code.replace(/<p>Ventelisten har flyttet seg, og din plass p. <strong>\$\{workshopName\}<\/strong> den \$\{workshopDate\} kl\. \$\{workshopTime\} er n. bekreftet\.<\/p>/, noPromotedNew);

fs.writeFileSync('api/agenda-notify.js', code);
console.log("NO fixed!");
