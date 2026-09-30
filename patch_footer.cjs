const fs = require('fs');
function updateFooter(filename) {
    let code = fs.readFileSync(filename, 'utf8');
    code = code.replace(
        /&copy; \$\{new Date\(\)\.getFullYear\(\)\} Dance2Dance\. Todos os direitos reservados\./,
        `&copy; ${new Date().getFullYear()} Dance2Dance. Todos os direitos reservados.<br><br>\n                  <a href="mailto:contact@dance2dance.no" style="color: #666; text-decoration: none;">contact@dance2dance.no</a> | <a href="https://www.dance2dance.no" style="color: #666; text-decoration: none;">www.dance2dance.no</a>`
    );
    fs.writeFileSync(filename, code);
}
updateFooter('api/agenda-notify.js');
updateFooter('api/contact.js');
