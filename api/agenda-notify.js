import nodemailer from 'nodemailer';

// Helper: Substituir variveis dinmicas no formato {{variavel}}
function replaceVariables(templateString, variables) {
  let result = templateString;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, userEmail, userName, workshopName, workshopDate, workshopTime, workshopLink, locationName, locationMapLink, lang = 'en', userLang } = req.body;
  
  const finalLang = userLang || lang;

  if (!userEmail || !type || !workshopName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('Configuraǜes SMTP ausentes.');
    return res.status(500).json({ error: 'Erro de configuraǜo no servidor' });
  }

  // Mapear o tipo do frontend para o prefixo do ID no Firestore
  let templatePrefix = '';
  if (type === 'enrollment_confirmed' || type === 'enrolled') templatePrefix = 'enrollment_confirmed';
  else if (type === 'waitlist_joined') templatePrefix = 'waitlist_joined';
  else if (type === 'waitlist_promoted') templatePrefix = 'waitlist_promoted';
  else {
    return res.status(400).json({ error: 'Unknown notification type' });
  }

  // Montar o ID do documento baseado na linguagem
  // Ex: "enrollment_confirmed_en"
  const templateId = `${templatePrefix}_${finalLang}`;
  const projectId = 'dance2dance-734d1';
  
  let subject = '';
  let bodyHtml = '';

  try {
    // Buscar o template direto da API REST pblica do Firestore
    // Nota: Requer que a coleǜo crm_email_templates tenha permissǜo de leitura pblica no firestore.rules
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/crm_email_templates/${templateId}`;
    const response = await fetch(firestoreUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template from Firestore: ${response.statusText}`);
    }
    
    const docData = await response.json();
    
    if (!docData || !docData.fields) {
      throw new Error('Template document is empty or malformed');
    }

    // Extrair subject e body_html (A API REST retorna { stringValue: '...' })
    const rawSubject = docData.fields.subject?.stringValue || '';
    const rawBodyHtml = docData.fields.body_html?.stringValue || '';

    // Variveis que o template espera
    const variables = {
      userName,
      workshopName,
      workshopDate,
      workshopTime,
      workshopLink,
      locationName,
      locationMapLink
    };

    subject = replaceVariables(rawSubject, variables);
    bodyHtml = replaceVariables(rawBodyHtml, variables);

  } catch (error) {
    console.error("Erro ao buscar template no Firestore:", error);
    return res.status(500).json({ error: 'Erro ao processar template', details: error.message });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT == '465',
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  // Base do template HTML para envolver o contedo principal
  const formatHtml = (content) => {
    let inlinedContent = content
      .replace(/class="greeting"/g, 'style="color: #F0EDE8; font-family: Georgia, \'Times New Roman\', serif; font-size: 22px; margin-bottom: 25px;"')
      .replace(/class="divider"/g, 'style="height: 1px; background-color: rgba(201, 168, 76, 0.2); margin: 35px 0;"');
      
    return `
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
                <td style="padding-top: 40px; color: #9A9A9A; font-size: 15px; line-height: 1.6; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  ${inlinedContent}
                </td>
              </tr>
              <tr>
                <td style="text-align: left; font-size: 12px; color: #666; padding-top: 40px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  &copy; 2026 Dance2Dance. Todos os direitos reservados.<br><br>
                  <a href="mailto:contact@dance2dance.no" style="color: #666; text-decoration: none;">contact@dance2dance.no</a> | <a href="https://www.dance2dance.no" style="color: #666; text-decoration: none;">www.dance2dance.no</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  };



  try {
    const info = await transporter.sendMail({
      from: `"Dance2Dance" <${smtpUser}>`,
      to: userEmail,
      subject: subject,
      html: formatHtml(bodyHtml)
    });

    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Erro ao enviar e-mail de agenda:', error);
    return res.status(500).json({ error: 'Falha ao enviar e-mail', details: error.message });
  }
}
