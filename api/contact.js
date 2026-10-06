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

  const { name, email, phone, subject, message, lang = 'en' } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('Configuraes SMTP ausentes.');
    return res.status(500).json({ error: 'Erro de configurao no servidor' });
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

  const templateId = `contact_received_${lang}`;
  const projectId = 'dance2dance-734d1';
  
  let autoSubject = '';
  let autoBodyHtml = '';

  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/crm_email_templates/${templateId}`;
    const response = await fetch(firestoreUrl);
    
    if (response.ok) {
      const docData = await response.json();
      if (docData && docData.fields) {
        const rawSubject = docData.fields.subject?.stringValue || '';
        const rawBodyHtml = docData.fields.body_html?.stringValue || '';

        const variables = {
          userName: name,
          subject: subject || (lang === 'pt' ? 'Contato Geral' : lang === 'no' ? 'Generell kontakt' : 'General Inquiry')
        };

        autoSubject = replaceVariables(rawSubject, variables);
        autoBodyHtml = replaceVariables(rawBodyHtml, variables);
      }
    }
  } catch (error) {
    console.error("Erro ao buscar template de contato no Firestore:", error);
    // Vai falhar silenciosamente e pular o e-mail de resposta se der erro, 
    // ou podemos colocar um fallback.
  }

  const formatHtml = (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0A0A0E; color: #F0EDE8; margin: 0; padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #0A0A0E; padding: 0; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 1px solid rgba(201, 168, 76, 0.2); }
        .logo { height: 64px; margin: 0 auto; display: block; }
        .content { color: #9A9A9A; font-size: 15px; }
        .greeting { color: #F0EDE8; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; margin-bottom: 25px; }
        .divider { height: 1px; background-color: rgba(201, 168, 76, 0.2); margin: 35px 0; }
        .footer { text-align: left; font-size: 12px; color: #666; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.dance2dance.no/logo-dance2dance.png" alt="Dance2Dance" class="logo">
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          &copy; 2026 Dance2Dance. Todos os direitos reservados.<br><br>
                  <a href="mailto:contact@dance2dance.no" style="color: #666; text-decoration: none;">contact@dance2dance.no</a> | <a href="https://www.dance2dance.no" style="color: #666; text-decoration: none;">www.dance2dance.no</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // 1. Enviar alerta para o admin
    await transporter.sendMail({
      from: `"Site Dance2Dance" <${smtpUser}>`,
      to: 'contato@dance2dance.no',
      replyTo: email,
      subject: `[Novo Contato] ${subject || 'Sem Assunto'} - ${name}`,
      html: `
        <h2>Nova Mensagem do Site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Assunto:</strong> ${subject || 'N/A'}</p>
        <hr>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    // 2. Enviar resposta automtica para o cliente se achou o template
    if (autoSubject && autoBodyHtml) {
      await transporter.sendMail({
        from: `"Dance2Dance" <${smtpUser}>`,
        to: email,
        subject: autoSubject,
        html: formatHtml(autoBodyHtml)
      });
    }

    return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de contato:', error);
    return res.status(500).json({ error: 'Falha ao enviar mensagem.' });
  }
}
