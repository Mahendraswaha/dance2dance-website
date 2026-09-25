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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // ignora
      }
    }

    const { 
      type, // 'enrolled' or 'waitlist_promoted'
      userEmail, 
      userName, 
      userLang, // 'pt', 'en', 'no'
      workshopName,
      workshopDate,
      workshopTime,
      locationName,
      locationMapLink
    } = body;

    // Conexao com o servidor de e-mail
    const smtpHost = process.env.SMTP_HOST || 'smtp.proisp.no';
    const smtpPort = process.env.SMTP_PORT || '465';
    const smtpUser = process.env.SMTP_USER || 'contact@dance2dance.no';
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      throw new Error('Senha SMTP (SMTP_PASS) nao encontrada no ambiente.');
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      }
    });

    const lang = userLang || 'pt';
    let subject = '';
    let htmlContent = '';

    const formatHtml = (content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0A0E; margin: 0; padding: 24px; color: #FAF8F5; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #14141A; border-radius: 12px; overflow: hidden; border: 1px solid #1E1E24; }
        .header { background: #0D0D12; padding: 32px; text-align: center; border-bottom: 1px solid #1E1E24; }
        .logo { margin: 0; font-size: 24px; font-weight: 700; color: #FAF8F5; letter-spacing: 1px; }
        .logo-accent { color: #C9A84C; }
        .content { padding: 40px 32px; font-size: 15px; line-height: 1.7; color: #D4D4D8; }
        .content strong { color: #FAF8F5; }
        .greeting { font-size: 18px; color: #FAF8F5; margin-bottom: 24px; font-weight: 600; }
        .divider { height: 1px; background: #1E1E24; margin: 32px 0; }
        
        .footer { padding: 24px 32px; background: #0D0D12; border-top: 1px solid #1E1E24; font-size: 12px; color: #71717A; text-align: center; line-height: 1.7; }
        .footer a { color: #C9A84C; text-decoration: none; }
        .loc-link:hover { color: #C9A84C !important; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1 class="logo">Dance<span class="logo-accent">2</span>Dance</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <strong>Dance2Dance</strong><br>
          <a href="mailto:contact@dance2dance.no">contact@dance2dance.no</a> | <a href="https://www.dance2dance.no" target="_blank">www.dance2dance.no</a>
        </div>
      </div>
    </body>
    </html>
    `;

    if (type === 'enrolled') {
      if (lang === 'en') {
        subject = `Registration confirmed: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Hello ${userName}.</div>
          <p>We confirm your enrollment in the retreat:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">date: ${workshopDate}</p><p style="margin-top: 0;">time: ${workshopTime}</p>
          <p>Dance2Dance operates on a solidarity model. We offer full scholarships to local residents and keep classes small to ensure excellence. As a result, our spots are strictly limited and waitlists are common.</p>
          <p>An absence without cancellation takes the opportunity to participate away from someone else.</p>
          <p>If you are unable to attend, please cancel your registration directly on our scheduling page as early as possible. This moves the waitlist automatically and opens the space for the next participant.</p>
          <p>Please arrive 10 to 15 minutes early to settle in.</p>
          <p>See you at:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>The Dance2Dance Team</strong></p>
        `;
      } else if (lang === 'no') {
        subject = `Påmelding bekreftet: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Hei ${userName}.</div>
          <p>Din plass på <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er bekreftet.</p>
          <p>Dance2Dance driver etter en solidaritetsmodell. Vi tilbyr fulle stipender til lokale innbyggere og holder klassene små for å sikre høy kvalitet. Derfor er plassene våre strengt begrensede og ventelister er vanlige.</p>
          <p>Å ikke møte opp uten å avbestille tar fra noen andre muligheten til å delta.</p>
          <p>Hvis du ikke kan delta, ber vi deg avbestille påmeldingen direkte i kalenderen vår så tidlig som mulig. Dette flytter ventelisten automatisk og frigjør plassen for neste deltaker.</p>
          <p>Vennligst møt opp 10-15 minutter før for å finne deg til rette.</p>
          <p>Vi ses på:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>Dance2Dance-teamet</strong></p>
        `;
      } else {
        // Default PT
        subject = `Inscrição confirmada: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Olá, ${userName}.</div>
          <p>Confirmamos sua inscri&ccedil;&atilde;o no retiro:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: ${workshopDate}</p><p style="margin-top: 0;">hora: ${workshopTime}</p>
          <p>O Dance2Dance opera sob um modelo de solidariedade. Oferecemos bolsas integrais para moradores locais e mantemos turmas reduzidas para garantir a excelência do encontro. Por isso, nossas vagas são estritamente limitadas e a lista de espera é constante.</p>
          <p>A ausência sem cancelamento tira de outra pessoa a oportunidade de participar.</p>
          <p>Caso não possa comparecer, cancele sua inscrição diretamente na agenda do nosso site com a maior antecedência possível. Isso faz a lista girar automaticamente e libera o espaço para o próximo participante.</p>
          <p>Por favor, chegue com 10 a 15 minutos de antecedência para se acomodar com calma.</p>
          <p>Nos vemos em:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>Equipe Dance2Dance</strong></p>
        `;
      }
    } else if (type === 'waitlist_joined') {
        if (lang === 'en') {
          subject = `Waitlist Confirmation: ${workshopName}`;
          htmlContent = `
            <div class="greeting">Hello ${userName}.</div>
            <p>You have successfully joined the waitlist for the retreat:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">date: ${workshopDate}</p><p style="margin-top: 0;">time: ${workshopTime}</p>
            <p>Since our spots are limited and based on a solidarity model, the waitlist is constantly moving.</p>
            <p>As soon as a spot opens up for you, we will notify you immediately by email!</p>
            <p>See you at:</p>
            <div style="margin-top: 15px;">
              <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
                <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
              </a>
            </div>
            <div class="divider"></div>
            <p><strong>Dance2Dance Team</strong></p>
          `;
        } else if (lang === 'no') {
          subject = `Ventelistebekreftelse: ${workshopName}`;
          htmlContent = `
            <div class="greeting">Hei ${userName}.</div>
            <p>Du st&aring;r n&aring; p&aring; ventelisten for retretten:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dato: ${workshopDate}</p><p style="margin-top: 0;">tid: ${workshopTime}</p>
            <p>Siden plassene v&aring;re er begrensede og basert p&aring; en solidaritetsmodell, er ventelisten i stadig bevegelse.</p>
            <p>S&aring; snart en plass &aring;pner seg for deg, vil vi gi deg beskjed umiddelbart via e-post!</p>
            <p>Vi ses p&aring;:</p>
            <div style="margin-top: 15px;">
              <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
                <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
              </a>
            </div>
            <div class="divider"></div>
            <p><strong>Team Dance2Dance</strong></p>
          `;
        } else {
          subject = `Confirmação de Lista de Espera: ${workshopName}`;
          htmlContent = `
            <div class="greeting">Ol&aacute;, ${userName}.</div>
            <p>Voc&ecirc; entrou na lista de espera para o retiro:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: ${workshopDate}</p><p style="margin-top: 0;">hora: ${workshopTime}</p>
            <p>Como nossas vagas s&atilde;o limitadas e baseadas em um modelo de solidariedade, a lista de espera &eacute; constante.</p>
            <p>Assim que houver uma desist&ecirc;ncia e uma vaga for liberada para voc&ecirc;, n&oacute;s te avisaremos imediatamente por este e-mail!</p>
            <p>Nos vemos em:</p>
            <div style="margin-top: 15px;">
              <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
                <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
              </a>
            </div>
            <div class="divider"></div>
            <p><strong>Equipe Dance2Dance</strong></p>
          `;
        }
    } else if (type === 'waitlist_promoted') {
      if (lang === 'en') {
        subject = `A spot has opened up for you: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Hello ${userName}.</div>
          <p>The waitlist has moved and your spot for the retreat:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">date: ${workshopDate}</p><p style="margin-top: 0;">time: ${workshopTime}</p>
          <p>Since our spots are limited and based on a solidarity model, we rely on everyone's support to keep access open.</p>
          <p>If your plans have changed and you can no longer attend, please cancel your registration directly on the scheduling page as soon as possible. This ensures the next participant in line gets a chance to join.</p>
          <p>Please arrive 10 to 15 minutes early.</p>
          <p>See you at:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>The Dance2Dance Team</strong></p>
        `;
      } else if (lang === 'no') {
        subject = `En plass har blitt ledig for deg: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Hei ${userName}.</div>
          <p>Ventelisten har flyttet seg, og din plass på <strong>${workshopName}</strong> den ${workshopDate} kl. ${workshopTime} er nå bekreftet.</p>
          <p>Ettersom plassene våre er begrensede og bygger på en solidaritetsmodell, er vi avhengige av alles støtte for å holde tilgangen åpen.</p>
          <p>Hvis planene dine har endret seg og du ikke lenger kan delta, ber vi deg avbestille påmeldingen direkte i kalenderen så snart som mulig. Slik får neste deltaker på listen muligheten til å bli med.</p>
          <p>Vennligst møt opp 10-15 minutter før start.</p>
          <p>Vi ses på:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>Dance2Dance-teamet</strong></p>
        `;
      } else {
        // Default PT
        subject = `Uma vaga foi liberada para você: ${workshopName}`;
        htmlContent = `
          <div class="greeting">Olá, ${userName}.</div>
          <p>A lista de espera girou e sua vaga para o retiro:</p><p style="margin-bottom: 5px;"><strong>${workshopName}</strong></p><p style="margin-top: 0; margin-bottom: 5px;">dia: ${workshopDate}</p><p style="margin-top: 0;">hora: ${workshopTime}</p>
          <p>Como nossas vagas são limitadas e baseadas em um modelo de solidariedade, contamos com o apoio de todos para manter o acesso aberto.</p>
          <p>Se os seus planos mudaram e você não puder mais participar, pedimos que cancele sua inscrição diretamente na nossa agenda o quanto antes. Assim, o próximo participante da lista também terá a chance de ser chamado.</p>
          <p>Por favor, chegue com 10 a 15 minutos de antecedência.</p>
          <p>Nos vemos em:</p>
          <div style="margin-top: 15px;">
            <a href="${locationMapLink}" target="_blank" class="loc-link" style="color: #9A9A9A; text-decoration: underline; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; transition: color 0.3s;">
              <span style="color: #C9A84C; margin-right: 4px;">&#9679;</span> ${locationName}
            </a>
          </div>
          <p><strong>Equipe Dance2Dance</strong></p>
        `;
      }
    }

    const info = await transporter.sendMail({
      from: `"Dance2Dance" <${smtpUser}>`,
      to: userEmail,
      subject: subject,
      html: formatHtml(htmlContent)
    });

    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Erro ao enviar e-mail de agenda:', error);
    return res.status(500).json({ error: 'Falha ao enviar e-mail', details: error.message });
  }
}
