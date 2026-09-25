import { doc, getDocs, collection, writeBatch, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export async function syncAllCounters() {
  try {
    console.log("Iniciando sincronização de contadores...");
    const eventsSnap = await getDocs(collection(db, 'events'));
    const batch = writeBatch(db);
    
    let updatedCount = 0;

    for (const eventDoc of eventsSnap.docs) {
      const eventId = eventDoc.id;
      
      const enrollQ = query(collection(db, 'enrollments'), where('eventId', '==', eventId));
      const enrollSnap = await getDocs(enrollQ);
      
      let trueEnrolled = 0;
      let trueWaitlist = 0;
      
      enrollSnap.forEach(eDoc => {
        if (eDoc.data().status === 'enrolled') trueEnrolled++;
        else if (eDoc.data().status === 'waitlist') trueWaitlist++;
      });
      
      const currentData = eventDoc.data();
      if (currentData.enrolledCount !== trueEnrolled || currentData.waitlistCount !== trueWaitlist) {
        batch.update(eventDoc.ref, {
          enrolledCount: trueEnrolled,
          waitlistCount: trueWaitlist
        });
        updatedCount++;
        console.log(`Evento ${eventId} corrigido: Inscritos(${currentData.enrolledCount} -> ${trueEnrolled}), Espera(${currentData.waitlistCount} -> ${trueWaitlist})`);
      }
    }
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`Sincronização concluída. ${updatedCount} eventos atualizados.`);
    } else {
      console.log("Todos os contadores já estão perfeitamente sincronizados!");
    }
    return true;
  } catch (error) {
    console.error("Erro na sincronização:", error);
    return false;
  }
}
