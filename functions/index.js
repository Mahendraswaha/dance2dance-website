const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

// ============================================================================
// CONFIGURAÇÃO DO SERVIDOR DE E-MAIL (PRO ISP)
// ============================================================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'cpanel33.proisp.no',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'contato@dance2dance.no',
    // Em produção, isso virá do Secret Manager do Firebase
    pass: process.env.SMTP_PASS || 'sua_senha_aqui' 
  }
});

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Busca o template no banco de dados e substitui as variáveis.
 * Exemplo: replaceVariables("Olá {{nome}}", { nome: "Safia" }) -> "Olá Safia"
 */
async function buildEmailFromTemplate(templateId, lang, variables) {
  // Busca o template no formato: "inscricao_confirmada_pt"
  const docRef = db.collection('crm_email_templates').doc(`${templateId}_${lang}`);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error(`Template não encontrado: ${templateId}_${lang}`);
  }

  const templateData = docSnap.data();
  if (!templateData.isActive) {
    logger.info(`Template ${templateId}_${lang} está inativo. E-mail cancelado.`);
    return null;
  }

  let htmlBody = templateData.body_html;
  let subject = templateData.subject;

  // Substitui dinamicamente todas as variáveis no texto (ex: {{userName}})
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlBody = htmlBody.replace(regex, value || '');
    subject = subject.replace(regex, value || '');
  }

  return { subject, htmlBody };
}

// ============================================================================
// GATILHO 1: NOVA MENSAGEM DE CONTATO (Substitui api/contact.js)
// ============================================================================
exports.onNewContact = onDocumentCreated("contacts/{contactId}", async (event) => {
  const contactData = event.data.data();
  if (!contactData) return;

  try {
    const lang = contactData.language || 'en';
    const emailData = await buildEmailFromTemplate('contact_received', lang, {
      userName: contactData.name || 'Visitante',
      subject: contactData.subject || 'Contato'
    });

    if (emailData) {
      await transporter.sendMail({
        from: '"Dance2Dance" <contato@dance2dance.no>',
        to: contactData.email,
        subject: emailData.subject,
        html: emailData.htmlBody
      });
      logger.info(`E-mail de contato enviado para: ${contactData.email}`);
    }
  } catch (error) {
    logger.error("Erro ao enviar e-mail de contato:", error);
  }
});

// ============================================================================
// GATILHO 2: NOVA INSCRIÇÃO OU LISTA DE ESPERA (Substitui api/agenda-notify.js)
// ============================================================================
exports.onNewEnrollment = onDocumentCreated("enrollments/{enrollmentId}", async (event) => {
  const enrollmentData = event.data.data();
  if (!enrollmentData) return;

  try {
    const lang = enrollmentData.language || 'no'; // Padrão NO ou a língua do usuário
    const status = enrollmentData.status; // 'confirmed' ou 'waitlist'
    
    // O template ID será 'enrollment_confirmed' ou 'waitlist_joined'
    const templateId = status === 'confirmed' ? 'enrollment_confirmed' : 'waitlist_joined';

    // Para pegar nome e datas, o ideal é ler o documento do Evento referenciado
    let eventName = "Workshop";
    let eventDate = "";
    let eventLocation = "";
    
    if (enrollmentData.eventId) {
      const eventDoc = await db.collection('events').doc(enrollmentData.eventId).get();
      if (eventDoc.exists) {
        const evData = eventDoc.data();
        eventName = evData.title || eventName;
        eventDate = evData.date || "";
        eventLocation = evData.locationName || "";
      }
    }

    const emailData = await buildEmailFromTemplate(templateId, lang, {
      userName: enrollmentData.userName || 'Aluno',
      eventName: eventName,
      eventDate: eventDate,
      eventLocation: eventLocation
    });

    if (emailData) {
      await transporter.sendMail({
        from: '"Dance2Dance" <contato@dance2dance.no>',
        to: enrollmentData.userEmail,
        subject: emailData.subject,
        html: emailData.htmlBody
      });
      logger.info(`E-mail transacional (${templateId}) enviado para: ${enrollmentData.userEmail}`);
    }
  } catch (error) {
    logger.error("Erro ao enviar e-mail de inscrição:", error);
  }
});
