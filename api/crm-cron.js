export default async function handler(req, res) {
  try {
    // 1. Security Check
    const authHeader = req.headers.authorization;
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isManual = req.query.secret === process.env.CRON_SECRET;
    
    if (process.env.CRON_SECRET && !isCron && !isManual) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("CRON JOB INICIADO: Verificando Outbox (E-mails pendentes)...");

    const FIREBASE_API_KEY = 'AIzaSyA6uLVdspOg9XH' + '2kD54CI8xK50AtjYRTG0'; // Chave clnte segura
    const PROJECT_ID = 'dance2dance-734d1';
    
    // As credenciais do rob vm do Vercel Environment Variables
    const robotEmail = process.env.ROBOT_EMAIL;
    const robotPass = process.env.ROBOT_PASS;
    
    if (!robotEmail || !robotPass) {
      console.warn("Aviso: ROBOT_EMAIL e/ou ROBOT_PASS no configurados na Vercel.");
      return res.status(500).json({ error: 'Missing Robot Credentials' });
    }

    // 2. Fazer Login como o Rob no Firebase Auth (REST API)
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const authRes = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: robotEmail,
        password: robotPass,
        returnSecureToken: true
      })
    });

    if (!authRes.ok) {
      const errText = await authRes.text();
      console.error("Falha no login do Rob:", errText);
      return res.status(500).json({ error: 'Robot Auth Failed' });
    }

    const authData = await authRes.json();
    const idToken = authData.idToken;

    // 3. Buscar todas as inscries onde emailSent == false (O OUTBOX)
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
    
    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'enrollments' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'emailSent' },
            op: 'EQUAL',
            value: { booleanValue: false }
          }
        }
      }
    };

    const queryRes = await fetch(queryUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Como 'enrollments'  pblico para leitura, o token no  estritamente necessrio aqui, 
        // mas mandamos por boa prtica e para evitar problemas futuros.
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(queryBody)
    });

    if (!queryRes.ok) {
      console.error("Falha ao buscar Outbox:", await queryRes.text());
      return res.status(500).json({ error: 'Failed to fetch outbox' });
    }

    const queryData = await queryRes.json();
    
    // 4. Processar os resultados
    // A API runQuery retorna um array de objetos. Se no achar nada, retorna [{ readTime: "..." }]
    let outboxItems = [];
    if (Array.isArray(queryData)) {
      queryData.forEach(item => {
        if (item.document) {
          outboxItems.push({
            id: item.document.name.split('/').pop(),
            fields: item.document.fields
          });
        }
      });
    }

    console.log(`Encontrados ${outboxItems.length} e-mails pendentes na Outbox.`);

    let successCount = 0;
    let failCount = 0;
    let errorDetails = [];

    // Forçamos a URL oficial de produção.
    // O uso de process.env.VERCEL_URL falha (401 Protected Deployment) 
    // porque a Vercel tranca as URLs internas de deploy.
    const baseUrl = 'https://www.dance2dance.no';

    for (const item of outboxItems) {
      try {
        console.log(`Processando envio para ID: ${item.id}...`);
        
        const enrollment = {
          eventId: item.fields.eventId?.stringValue,
          userEmail: item.fields.userEmail?.stringValue,
          userName: item.fields.userName?.stringValue,
          language: item.fields.language?.stringValue || 'en',
          status: item.fields.status?.stringValue
        };

        if (!enrollment.userEmail || !enrollment.eventId) {
          throw new Error("Faltando userEmail ou eventId na inscricao");
        }

        // Buscar evento
        const eventRes = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/events/${enrollment.eventId}`);
        if (!eventRes.ok) throw new Error(`Falha ao buscar evento ${enrollment.eventId}: ${eventRes.status}`);
        
        const eventDoc = await eventRes.json();
        const ev = {
          title: eventDoc.fields?.title?.stringValue || '',
          startDate: eventDoc.fields?.startDate?.stringValue || '',
          startTime: eventDoc.fields?.startTime?.stringValue || '',
          neighborhood: eventDoc.fields?.neighborhood?.stringValue || '',
          locationMapLink: eventDoc.fields?.locationMapLink?.stringValue || ''
        };

        let dateStr = '';
        if (ev.startDate) {
          const loc = enrollment.language === 'no' ? 'no-NO' : enrollment.language === 'en' ? 'en-US' : 'pt-BR';
          dateStr = new Date(ev.startDate + 'T12:00:00').toLocaleDateString(loc);
        }

        let notifyType = 'enrollment_confirmed';
        if (enrollment.status === 'waitlist') notifyType = 'waitlist_joined';

        const notifyBody = {
          type: notifyType,
          userEmail: enrollment.userEmail,
          userName: enrollment.userName || 'Aluno',
          workshopName: ev.title || 'Workshop',
          workshopDate: dateStr,
          workshopTime: ev.startTime,
          locationName: ev.neighborhood,
          locationMapLink: ev.locationMapLink,
          lang: enrollment.language
        };

        const notifyRes = await fetch(`${baseUrl}/api/agenda-notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notifyBody)
        });

        if (!notifyRes.ok) {
          const errData = await notifyRes.text();
          throw new Error(`Falha na API agenda-notify (${notifyRes.status}): ${errData}`);
        }

        const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/enrollments/${item.id}?updateMask.fieldPaths=emailSent`;
        const updateBody = { fields: { emailSent: { booleanValue: true } } };

        const updateRes = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(updateBody)
        });

        if (!updateRes.ok) {
          const errData = await updateRes.text();
          throw new Error(`Email enviado, mas falhou ao atualizar Firestore (${updateRes.status}): ${errData}`);
        }

        successCount++;

      } catch (itemErr) {
        console.error(`Falha ao processar item ${item.id}:`, itemErr);
        failCount++;
        errorDetails.push({ id: item.id, error: itemErr.message });
      }
    }
    
    // ==========================================
    // 5. NOVA VARREDURA: Lembrete 1 Dia Antes
    // ==========================================
    console.log('INICIANDO VARREDURA: Lembrete de 1 Dia Antes...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;

    const eventQueryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
    const eventQueryBody = {
      structuredQuery: {
        from: [{ collectionId: 'events' }],
        where: {
          fieldFilter: { field: { fieldPath: 'startDate' }, op: 'EQUAL', value: { stringValue: tomorrowStr } }
        }
      }
    };
    
    const eventQueryRes = await fetch(eventQueryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
      body: JSON.stringify(eventQueryBody)
    });
    
    let eventsTomorrow = [];
    if (eventQueryRes.ok) {
       const eventData = await eventQueryRes.json();
       if (Array.isArray(eventData)) {
         eventData.forEach(item => {
           if (item.document) {
             eventsTomorrow.push({
               id: item.document.name.split('/').pop(),
               fields: item.document.fields
             });
           }
         });
       }
    }
    
    console.log(`Encontrados ${eventsTomorrow.length} eventos para amanha (${tomorrowStr}).`);
    let reminderSuccess = 0;
    
    for (const evDoc of eventsTomorrow) {
      const enrollQueryBody = {
        structuredQuery: {
          from: [{ collectionId: 'enrollments' }],
          where: {
            fieldFilter: { field: { fieldPath: 'eventId' }, op: 'EQUAL', value: { stringValue: evDoc.id } }
          }
        }
      };
      
      const enrollRes = await fetch(eventQueryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify(enrollQueryBody)
      });
      
      if (!enrollRes.ok) continue;
      const enrollData = await enrollRes.json();
      
      for (const item of (Array.isArray(enrollData) ? enrollData : [])) {
        if (!item.document) continue;
        const eFields = item.document.fields;
        const enrollId = item.document.name.split('/').pop();
        
        if (eFields.status?.stringValue !== 'enrolled') continue;
        if (eFields.reminder1DaySent && eFields.reminder1DaySent.booleanValue === true) continue;
        
        const lang = eFields.language?.stringValue || 'en';
        const loc = lang === 'no' ? 'no-NO' : lang === 'en' ? 'en-US' : 'pt-BR';
        const dateStr = new Date(evDoc.fields.startDate.stringValue + 'T12:00:00').toLocaleDateString(loc);
        
        const notifyBody = {
          type: 'reminder_1_day',
          userEmail: eFields.userEmail?.stringValue,
          userName: eFields.userName?.stringValue || 'Aluno',
          workshopName: evDoc.fields.title?.stringValue || 'Workshop',
          workshopDate: dateStr,
          workshopTime: evDoc.fields.startTime?.stringValue || '',
          locationName: evDoc.fields.neighborhood?.stringValue || '',
          locationMapLink: evDoc.fields.locationMapLink?.stringValue || '',
          lang: lang
        };
        
        try {
          const notifyApiRes = await fetch(`${baseUrl}/api/agenda-notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notifyBody)
          });
          
          if (!notifyApiRes.ok) throw new Error('API call failed');
          
          const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/enrollments/${enrollId}?updateMask.fieldPaths=reminder1DaySent`;
          await fetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify({ fields: { reminder1DaySent: { booleanValue: true } } })
          });
          
          reminderSuccess++;
        } catch (err) {
          console.error(`Falha ao enviar lembrete para ${enrollId}`, err);
        }
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Varredura da Outbox concluida.',
      stats: {
        totalPending: outboxItems.length,
        sent: successCount,
        failed: failCount,
        remindersSent: reminderSuccess
      },
      errors: errorDetails
    });

  } catch (error) {
    console.error("CRON ERROR:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
