import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Configurar CORS
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
        // use raw
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
      message = '',
      language = 'en'
    } = body || {};

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'E-mail é obrigatório' });
    }

    const cleanLang = (language || 'en').slice(0, 2).toLowerCase();

    // Mapeamento multilíngue dos assuntos
    const SUBJECT_MAP = {
      'geral': {
        pt: 'Dúvidas Gerais / Informações',
        no: 'Generelle henvendelser / Informasjon',
        en: 'General Inquiry / Information'
      },
      'btd-in-company': {
        pt: 'Be the Dance in Company',
        no: 'Be the Dance in Company',
        en: 'Be the Dance in Company'
      },
      'biostretch-in-company': {
        pt: 'Biostretch in Company',
        no: 'Biostretch in Company',
        en: 'Biostretch in Company'
      },
      'reuniao-executiva': {
        pt: 'Reunião Executiva / Projeto Social',
        no: 'Møte for bedrift / Sosialt prosjekt',
        en: 'Executive Meeting / Social Project'
      },
      'sessao-individual': {
        pt: 'Sessão Individual / Personal',
        no: 'Individuell time / Personlig',
        en: 'Individual Session / Personal'
      },
      'parcerias': {
        pt: 'Parcerias & Patrocínios',
        no: 'Samarbeid og sponsing',
        en: 'Partnerships & Sponsorships'
      }
    };

    const subjectObj = SUBJECT_MAP[subject] || {
      pt: subject || 'Contato pelo Site',
      no: subject || 'Kontakt via nettsiden',
      en: subject || 'Website Contact'
    };

    const subjectForVisitor = subjectObj[cleanLang] || subjectObj.en;
    const subjectBilingual = `${subjectObj.pt} / ${subjectObj.en}`;

    const cleanName = name ? name.trim() : (cleanLang === 'pt' ? 'Visitante' : cleanLang === 'no' ? 'Besøkende' : 'Friend');
    const cleanEmail = email.trim();
    const cleanPhone = phone ? phone.trim() : '';
    const cleanMessage = message ? message.trim() : '(Sem mensagem adicional)';

    const locationParts = [address, neighborhood, city, zip, country]
      .map(p => (p || '').trim())
      .filter(Boolean);
    const locationString = locationParts.length > 0 ? locationParts.join(', ') : 'Não informado';

    // Configurações SMTP Pro ISP
    const smtpHost = process.env.SMTP_HOST || 'smtp.proisp.no';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || 'contact@dance2dance.no';
    const smtpPass = process.env.SMTP_PASS;

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

    // 1. TEXTOS DO E-MAIL DE CONFIRMAÇÃO PARA O VISITANTE (DINÂMICO CONFORME O IDIOMA)
    let visitorSubject = '';
    let greeting = '';
    let thankYouText = '';
    let receivedText = '';
    let summaryTitle = '';
    let subjectLabel = '';
    let visitBtnText = '';

    if (cleanLang === 'pt') {
      visitorSubject = 'Dance2Dance - Recebemos sua mensagem!';
      greeting = `Olá, ${cleanName}!`;
      thankYouText = 'Thank you for reaching out to Dance2Dance!';
      receivedText = `We have safely received your inquiry regarding <strong>${subjectForVisitor}</strong> and our team will get back to you shortly.`;
      summaryTitle = 'Resumo da mensagem enviada:';
      subjectLabel = 'Assunto:';
      visitBtnText = 'Visit dance2dance.no';
    } else if (cleanLang === 'no') {
      visitorSubject = 'Dance2Dance - Vi har mottatt din henvendelse!';
      greeting = `Hei, ${cleanName}!`;
      thankYouText = 'Takk for at du kontakter Dance2Dance!';
      receivedText = `Vi har trygt mottatt din henvendelse angående <strong>${subjectForVisitor}</strong>, og vårt team vil svare deg så snart som mulig.`;
      summaryTitle = 'Sammendrag av sendt melding:';
      subjectLabel = 'Emne:';
      visitBtnText = 'Besøk dance2dance.no';
    } else {
      // Default: English
      visitorSubject = 'Dance2Dance - We have received your inquiry!';
      greeting = `Hello, ${cleanName}!`;
      thankYouText = 'Thank you for reaching out to Dance2Dance!';
      receivedText = `We have safely received your inquiry regarding <strong>${subjectForVisitor}</strong> and our team will get back to you shortly.`;
      summaryTitle = 'Summary of sent message:';
      subjectLabel = 'Subject:';
      visitBtnText = 'Visit dance2dance.no';
    }

    // HTML DO E-MAIL PARA O VISITANTE (Formatado fielmente ao card lateral de contato)
    const visitorMailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 24px 12px; background-color: #060608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F0EDE8; }
        .wrapper { max-width: 580px; margin: 0 auto; background: #0D0D12; border: 1px solid #22222A; border-radius: 6px; overflow: hidden; }
        .header { padding: 36px 28px 24px; text-align: center; border-bottom: 1px solid #1A1A24; background: #0A0A0E; }
        .logo { margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 400; color: #FAF8F5; letter-spacing: 0.5px; }
        .logo-accent { color: #C9A84C; font-size: 1.28em; line-height: 0; vertical-align: baseline; }
        .tagline { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #C9A84C; font-weight: 600; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 19px; font-weight: 600; color: #FAF8F5; margin: 0 0 16px 0; }
        .p-lead { font-size: 15px; line-height: 1.6; color: #FAF8F5; margin: 0 0 12px 0; font-weight: 500; }
        .p-sub { font-size: 14px; line-height: 1.6; color: #A1A1AA; margin: 0 0 24px 0; }
        .divider { border-top: 1px solid #1A1A24; margin: 24px 0; }
        .summary-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #C9A84C; font-weight: 600; margin-bottom: 8px; }
        .subject-line { font-size: 13px; color: #FAF8F5; margin: 0 0 10px 0; }
        .message-card { background: #14141A; border-left: 3px solid #C9A84C; border-radius: 4px; padding: 14px 18px; font-size: 14px; line-height: 1.6; color: #D4D4D8; font-style: italic; white-space: pre-wrap; word-break: break-word; }
        .btn-wrapper { text-align: center; margin: 32px 0 16px 0; }
        .btn { display: inline-block; background: #C9A84C; color: #0D0D12 !important; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
        .footer { padding: 24px 28px; background: #0A0A0E; border-top: 1px solid #1A1A24; font-size: 12px; color: #71717A; text-align: center; line-height: 1.7; }
        .footer a { color: #C9A84C; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1 class="logo">Dance<span class="logo-accent">2</span>Dance</h1>
          <p class="tagline">Be The Dance • BioStretch • Kroppsskole</p>
        </div>
        <div class="content">
          <div class="greeting">${greeting}</div>
          <p class="p-lead">${thankYouText}</p>
          <p class="p-sub">${receivedText}</p>

          <div class="divider"></div>

          <div class="summary-label">${summaryTitle}</div>
          <p class="subject-line"><strong>${subjectLabel}</strong> ${subjectForVisitor}</p>
          <div class="message-card">${cleanMessage}</div>

          <div class="btn-wrapper">
            <a href="https://www.dance2dance.no" class="btn" target="_blank">${visitBtnText}</a>
          </div>
        </div>
        <div class="footer">
          <strong>Dance2Dance</strong> • Oslo, Norway<br>
          <a href="mailto:contact@dance2dance.no">contact@dance2dance.no</a> • <a href="https://www.dance2dance.no" target="_blank">www.dance2dance.no</a>
        </div>
      </div>
    </body>
    </html>
    `;

    // HTML DO E-MAIL DE NOTIFICAÇÃO PARA A EQUIPE (contact@dance2dance.no)
    const adminMailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #18181b; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e4e4e7; }
        .header { background: #0D0D12; padding: 28px 32px; text-align: left; }
        .header h1 { margin: 0; font-size: 22px; color: #FAF8F5; letter-spacing: 0.5px; font-weight: 600; }
        .header p { margin: 6px 0 0 0; font-size: 12px; color: #C9A84C; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
        .content { padding: 32px; }
        .badge { display: inline-block; background: #fef08a; color: #854d0e; font-weight: 600; font-size: 12px; padding: 4px 10px; border-radius: 9999px; margin-bottom: 20px; }
        .field { margin-bottom: 18px; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #71717a; font-weight: 600; margin-bottom: 4px; }
        .value { font-size: 15px; color: #09090b; font-weight: 500; }
        .value a { color: #2563eb; text-decoration: none; }
        .message-box { background: #f8fafc; border-left: 4px solid #0D0D12; border-radius: 8px; padding: 18px; margin-top: 24px; font-size: 15px; line-height: 1.6; color: #27272a; white-space: pre-wrap; word-break: break-word; }
        .reply-banner { margin-top: 28px; padding: 16px; background: #eff6ff; border-radius: 10px; font-size: 13px; color: #1e40af; line-height: 1.5; border: 1px solid #bfdbfe; }
        .footer { padding: 20px 32px; background: #fafafa; border-top: 1px solid #f4f4f5; font-size: 12px; color: #a1a1aa; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>Dance2Dance • Be The Dance • BioStretch • Kroppsskole</p>
          <h1>Novo Contato Recebido pelo Site</h1>
        </div>
        <div class="content">
          <div class="badge">${subjectBilingual}</div>

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
            <div class="value">${subjectBilingual}</div>
          </div>

          <div class="field">
            <div class="label">Idioma do Navegador</div>
            <div class="value">${cleanLang.toUpperCase()}</div>
          </div>

          <div class="label" style="margin-top: 24px;">Mensagem Enviada:</div>
          <div class="message-box">${cleanMessage}</div>

          <div class="reply-banner">
            💡 <strong>Dica:</strong> Para responder a este visitante, basta clicar em <strong>"Responder"</strong> no seu Gmail. A resposta irá diretamente para <strong>${cleanEmail}</strong>.
          </div>
        </div>
        <div class="footer">
          Enviado através do formulário de contato de dance2dance.no em ${formattedDate}
        </div>
      </div>
    </body>
    </html>
    `;

    // DESTINATÁRIOS DA NOTIFICAÇÃO:
    // Enviamos para contact@dance2dance.no E também diretamente para portoalegreciadedanca@gmail.com
    // Isso resolve 100% o problema do Pro ISP reter no junk: o Gmail recebe a notificação instantaneamente!
    const adminRecipients = [
      'contact@dance2dance.no',
      'portoalegreciadedanca@gmail.com'
    ];

    const [adminInfo, visitorInfo] = await Promise.all([
      // 1. Notificação para a equipe
      transporter.sendMail({
        from: `"Dance2Dance Website" <${smtpUser}>`,
        to: adminRecipients.join(', '),
        replyTo: cleanEmail,
        subject: `[Dance2Dance] Novo Contato: ${cleanName} - ${subjectForVisitor}`,
        text: `Novo contato recebido pelo site!\n\nNome: ${cleanName}\nE-mail: ${cleanEmail}\nTelefone: ${cleanPhone}\nLocalização: ${locationString}\nAssunto: ${subjectBilingual}\nIdioma: ${cleanLang}\n\nMensagem:\n${cleanMessage}`,
        html: adminMailHtml
      }),

      // 2. Confirmação automática personalizada para o visitante
      transporter.sendMail({
        from: `"Dance2Dance" <${smtpUser}>`,
        to: cleanEmail,
        replyTo: smtpUser,
        subject: visitorSubject,
        text: `${greeting}\n\n${thankYouText}\n${receivedText.replace(/<[^>]*>?/gm, '')}\n\n${summaryTitle}\n${subjectLabel} ${subjectForVisitor}\n${cleanMessage}\n\nDance2Dance • Oslo, Norway\ncontact@dance2dance.no • https://www.dance2dance.no`,
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
