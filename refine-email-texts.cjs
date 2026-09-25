const fs = require('fs');
let code = fs.readFileSync('api/agenda-notify.js', 'utf8');

// 1. Move the golden dot OUTSIDE the <a> tag
const linkRegex = /<a href="\$\{locationMapLink\}"([^>]*)>\s*<span style="color: #C9A84C; margin-right: 4px;">&#9679;<\/span>\s*\$\{locationName\}\s*<\/a>/g;
const newLink = '<span style="color: #C9A84C; margin-right: 4px;">&#9679;</span>\n              <a href="${locationMapLink}"$1>\n                ${locationName}\n              </a>';
code = code.replace(linkRegex, newLink);

// 2. Fix the "retiro" -> "workshop" wording

// ENROLLED
code = code.replace(/<p>Confirmamos sua inscri&ccedil;&atilde;o no retiro:<\/p>/g, '<p>Confirmamos sua inscri&ccedil;&atilde;o para o workshop:</p>');
code = code.replace(/<p>We confirm your enrollment in the retreat:<\/p>/g, '<p>We have confirmed your registration for the workshop:</p>');
code = code.replace(/<p>Vi bekrefter din p&aring;melding til retretten:<\/p>/g, '<p>Vi har bekreftet din registrering for workshopen:</p>');

// WAITLIST PROMOTED
code = code.replace(/<p>A lista de espera girou e sua vaga para o retiro:<\/p>/g, '<p>A lista de espera girou e sua vaga para o workshop:</p>');
code = code.replace(/<p>The waitlist has moved and your spot for the retreat:<\/p>/g, '<p>The waitlist has moved and your spot for the workshop:</p>');
code = code.replace(/<p>Ventelisten har flyttet seg, og din plass for retretten:<\/p>/g, '<p>Ventelisten har flyttet seg, og din plass for workshopen:</p>');

// WAITLIST JOINED
code = code.replace(/<p>Voc&ecirc; entrou na lista de espera para o retiro:<\/p>/g, '<p>Voc&ecirc; entrou na lista de espera para o workshop:</p>');
code = code.replace(/<p>You have successfully joined the waitlist for the retreat:<\/p>/g, '<p>You have successfully joined the waitlist for the workshop:</p>');
code = code.replace(/<p>Du st&aring;r n&aring; p&aring; ventelisten for retretten:<\/p>/g, '<p>Du st&aring;r n&aring; p&aring; ventelisten for workshopen:</p>');


// 3. Fix the "See you at:" inside the WAITLIST JOINED block ONLY.
// Because the waitlist joined block is exactly matched in the else if (type === 'waitlist_joined') block,
// we can capture the entire block and replace the lines inside it.

let startIndex = code.indexOf("else if (type === 'waitlist_joined') {");
if (startIndex !== -1) {
    let before = code.substring(0, startIndex);
    let after = code.substring(startIndex);

    after = after.replace('<p>See you at:</p>', '<p>Location:</p>');
    after = after.replace('<p>Nos vemos em:</p>', '<p>Local:</p>');
    after = after.replace('<p>Vi ses p&aring;:</p>', '<p>Sted:</p>');
    
    // Some lines might have the literal "å" instead of "&aring;" or vice versa, but based on my previous script I used &aring;.
    // Let's replace just in case:
    after = after.replace('<p>Vi ses på:</p>', '<p>Sted:</p>');
    
    code = before + after;
}

fs.writeFileSync('api/agenda-notify.js', code);
console.log("Email refinements complete!");
