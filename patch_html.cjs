const fs = require('fs');

function patchHtmlWrapper(filename) {
    let code = fs.readFileSync(filename, 'utf8');
    
    const newFormatHtml = `
  const formatHtml = (content) => {
    let inlinedContent = content
      .replace(/class="greeting"/g, 'style="color: #F0EDE8; font-family: Georgia, \\'Times New Roman\\', serif; font-size: 22px; margin-bottom: 25px;"')
      .replace(/class="divider"/g, 'style="height: 1px; background-color: rgba(201, 168, 76, 0.2); margin: 35px 0;"');
      
    return \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="background-color: #0A0A0E; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0A0E; width: 100%;">
        <tr>
          <td align="center" style="padding: 40px 20px; background-color: #0A0A0E;">
            <table border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; margin: 0 auto; background: #0A0A0E;">
              <tr>
                <td style="text-align: left; padding-bottom: 20px; border-bottom: 1px solid rgba(201, 168, 76, 0.2);">
                  <img src="https://www.dance2dance.no/logo-dance2dance.png" alt="Dance2Dance" style="height: 40px; display: block; border: none; font-size: 0; color: transparent;">
                </td>
              </tr>
              <tr>
                <td style="padding-top: 40px; color: #F0EDE8; font-size: 15px; line-height: 1.6; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  \${inlinedContent}
                </td>
              </tr>
              <tr>
                <td style="text-align: left; font-size: 12px; color: #666; padding-top: 40px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  &copy; \${new Date().getFullYear()} Dance2Dance. Todos os direitos reservados.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    \`;
  };
`;

    // Replace everything from `const formatHtml = (content) => ` to `  try {`
    const regex = /const formatHtml = \(content\) => [\s\S]*?(?=\s*try\s*\{\s*const info = await transporter)/;
    code = code.replace(regex, newFormatHtml.trim() + '\n\n');
    
    fs.writeFileSync(filename, code);
}

patchHtmlWrapper('api/agenda-notify.js');
patchHtmlWrapper('api/contact.js');
