import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurar CORS caso necessário
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // use raw body
      }
    }

    const {
      name = '',
      email = '',
      phone = '',
      address = '',
      city = '',
      neighborhood = '',
      zip = '',
      country = '',
      subject = 'geral',
      message = ''
    } = body || {};

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'E-mail é obrigatório' });
    }

    const SUBJECT_MAP = {
      'geral': 'Dúvidas Gerais / General Inquiry',
      'reuniao-executiva': 'Agendar Reunião Executiva / Executive Meeting',
      'btd-in-company': 'Be The Dance - In Company',
      'biostretch-in-company': 'BioStretch - In Company',
      'sessao-individual': 'Sessão Individual / Mentoria',
      'parcerias': 'Parcerias / Imprensa / Partnerships'
    };

    const subjectLabel = SUBJECT_MAP[subject] || subject || 'Contato pelo Site';
    const cleanName = name ? name.trim() : 'Visitante do Site';
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : '';
    const cleanMessage = message ? message.trim() : '(Sem mensagem adicional)';

    const locationParts = [address, neighborhood, city, zip, country]
      .map(p => (p || '').trim())
      .filter(Boolean);
    const locationString = locationParts.length > 0 ? locationParts.join(', ') : 'Não informado';

    // Configuração do transporter SMTP da Pro ISP
    const smtpHost = process.env.SMTP_HOST || 'smtp.proisp.no';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'contact@dance2dance.no';
    const smtpPass = process.env.SMTP_PASS || 'r_dQ&Dj4cyTZ';
    const notificationRecipient = process.env.NOTIFICATION_EMAIL || 'contact@dance2dance.no';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const now = new Date();
    const formattedDate = now.toLocaleString('pt-BR', {
      timeZone: 'Europe/Oslo',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // 1. E-MAIL DE NOTIFICAÇÃO PARA A EQUIPE (contact@dance2dance.no)
    const adminMailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7; }
        .header { background: #18181b; padding: 28px 32px; text-align: left; }
        .header h1 { margin: 0; font-size: 22px; color: #f4f4f5; letter-spacing: 0.5px; font-weight: 600; }
        .header p { margin: 6px 0 0 0; font-size: 13px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 32px; }
        .badge { display: inline-block; background: #fef08a; color: #854d0e; font-weight: 600; font-size: 12px; padding: 4px 10px; border-radius: 9999px; margin-bottom: 20px; }
        .field { margin-bottom: 18px; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #71717a; font-weight: 600; margin-bottom: 4px; }
        .value { font-size: 15px; color: #09090b; font-weight: 500; }
        .value a { color: #2563eb; text-decoration: none; }
        .message-box { background: #f8fafc; border-left: 4px solid #18181b; border-radius: 8px; padding: 18px; margin-top: 24px; font-size: 15px; line-height: 1.6; color: #27272a; white-space: pre-wrap; word-break: break-word; }
        .reply-banner { margin-top: 28px; padding: 16px; background: #eff6ff; border-radius: 10px; font-size: 13px; color: #1e40af; line-height: 1.5; border: 1px solid #bfdbfe; }
        .footer { padding: 20px 32px; background: #fafafa; border-top: 1px solid #f4f4f5; font-size: 12px; color: #a1a1aa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>Dance 2 Dance — Website</p>
          <h1>Novo Contato Recebido</h1>
        </div>
        <div class="content">
          <div class="badge">${subjectLabel}</div>

          <div class="field">
            <div class="label">Nome</div>
            <div class="value">${cleanName}</div>
          </div>

          <div class="field">
            <div class="label">E-mail</div>
            <div class="value"><a href="mailto:${cleanEmail}">${cleanEmail}</a></div>
          </div>

          <div class="field">
            <div class="label">Telefone / WhatsApp</div>
            <div class="value">${cleanPhone ? `<a href="https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}">${cleanPhone}</a>` : 'Não informado'}</div>
          </div>

          <div class="field">
            <div class="label">Endereço / Localização</div>
            <div class="value">${locationString}</div>
          </div>

          <div class="field">
            <div class="label">Assunto Selecionado</div>
            <div class="value">${subjectLabel}</div>
          </div>

          <div class="label" style="margin-top: 24px;">Mensagem Enviada:</div>
          <div class="message-box">${cleanMessage}</div>

          <div class="reply-banner">
            💡 <strong>Dica:</strong> Para responder a este contato, basta clicar em <strong>"Responder"</strong> no seu Gmail. A resposta irá diretamente para <strong>${cleanEmail}</strong>.
          </div>
        </div>
        <div class="footer">
          Enviado através do formulário de contato de dance2dance.no em ${formattedDate}
        </div>
      </div>
    </body>
    </html>
    `;

    // 2. E-MAIL DE CONFIRMAÇÃO AUTOMÁTICA PARA O VISITANTE
    const visitorMailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7; }
        .header { background: #18181b; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; color: #ffffff; letter-spacing: 0.5px; font-weight: 600; }
        .header p { margin: 8px 0 0 0; font-size: 13px; color: #d4d4d8; text-transform: uppercase; letter-spacing: 1.5px; }
        .content { padding: 36px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #18181b; margin-bottom: 16px; }
        .text { font-size: 15px; line-height: 1.6; color: #3f3f46; margin-bottom: 20px; }
        .divider { border-top: 1px solid #e4e4e7; margin: 28px 0; }
        .summary-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #71717a; font-weight: 600; margin-bottom: 10px; }
        .summary-box { background: #f8fafc; border-left: 3px solid #71717a; border-radius: 6px; padding: 14px 18px; font-size: 14px; color: #4b5563; font-style: italic; white-space: pre-wrap; word-break: break-word; }
        .button-wrapper { text-align: center; margin: 32px 0 16px 0; }
        .btn { display: inline-block; background: #18181b; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; }
        .footer { padding: 24px 32px; background: #fafafa; border-top: 1px solid #f4f4f5; font-size: 12px; color: #a1a1aa; text-align: center; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Dance 2 Dance</h1>
          <p>Be The Dance • BioStretch • Dança de Salão</p>
        </div>
        <div class="content">
          <div class="greeting">Olá, ${cleanName}!</div>
          
          <p class="text">
            Recebemos sua mensagem com sucesso! Agradecemos pelo seu contato com a <strong>Dance 2 Dance</strong>.
          </p>
          <p class="text">
            Nossa equipe já está com a sua solicitação e entraremos em contato o mais breve possível.
          </p>

          <div class="divider"></div>

          <div class="summary-title">Resumo da mensagem enviada:</div>
          <p style="font-size: 13px; color: #71717a; margin: 0 0 6px 0;"><strong>Assunto:</strong> ${subjectLabel}</p>
          <div class="summary-box">${cleanMessage}</div>

          <div class="divider"></div>

          <p class="text" style="font-size: 14px; color: #71717a;">
            <em>(English / Norsk)</em><br>
            Thank you for reaching out to Dance 2 Dance! We have safely received your inquiry regarding <strong>${subjectLabel}</strong> and our team will get back to you shortly.
          </p>

          <div class="button-wrapper">
            <a href="https://www.dance2dance.no" class="btn" target="_blank">Visitar dance2dance.no</a>
          </div>
        </div>
        <div class="footer">
          Dance 2 Dance Studio • Oslo, Norway<br>
          <a href="mailto:contact@dance2dance.no" style="color: #71717a; text-decoration: underline;">contact@dance2dance.no</a> • <a href="https://www.dance2dance.no" style="color: #71717a; text-decoration: underline;">www.dance2dance.no</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // Disparar os dois e-mails
    const [adminInfo, visitorInfo] = await Promise.all([
      // 1. Notificação para a equipe
      transporter.sendMail({
        from: `"Dance 2 Dance" <${smtpUser}>`,
        to: notificationRecipient,
        replyTo: cleanEmail,
        subject: `[Dance2Dance] Novo Contato: ${cleanName} - ${subjectLabel}`,
        text: `Novo contato recebido pelo site!\n\nNome: ${cleanName}\nE-mail: ${cleanEmail}\nTelefone: ${cleanPhone}\nLocalização: ${locationString}\nAssunto: ${subjectLabel}\n\nMensagem:\n${cleanMessage}`,
        html: adminMailHtml
      }),

      // 2. Confirmação automática para o visitante
      transporter.sendMail({
        from: `"Dance 2 Dance" <${smtpUser}>`,
        to: cleanEmail,
        replyTo: smtpUser,
        subject: `Dance 2 Dance - Recebemos sua mensagem! / We received your message`,
        text: `Olá ${cleanName},\n\nRecebemos sua mensagem com sucesso! Nossa equipe entrará em contato em breve.\n\nAssunto: ${subjectLabel}\nMensagem enviada:\n${cleanMessage}\n\nAtenciosamente,\nEquipe Dance 2 Dance\nhttps://www.dance2dance.no`,
        html: visitorMailHtml
      })
    ]);

    return res.status(200).json({
      success: true,
      adminMessageId: adminInfo?.messageId,
      visitorMessageId: visitorInfo?.messageId
    });

  } catch (error) {
    console.error('Erro ao processar envio de e-mails de contato:', error);
    return res.status(500).json({
      error: 'Falha interna ao enviar e-mails',
      details: error.message
    });
  }
}
