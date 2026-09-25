const fs = require('fs');
let code = fs.readFileSync('src/components/StudentsModal.jsx', 'utf8');

// 1. Add handleSyncCounters function
const syncFunction = `
  // Função para forçar sincronização de contadores
  async function handleSyncCounters() {
    if (!window.confirm("Deseja forçar a sincronização dos contadores deste evento? Use isso se o botão no site estiver mostrando 'Lista de Espera' mas os inscritos estiverem vazios.")) return;
    try {
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        enrolledCount: enrolledStudents.length,
        waitlistCount: waitlistStudents.length
      });
      alert("Contadores sincronizados com sucesso! Atualize a página do site (F5).");
      if (onEventUpdated) onEventUpdated();
    } catch(err) {
      alert("Erro ao sincronizar: " + err.message);
    }
  }

  // 1. Copiar e-mails (Apenas Administrador Geral)`;

code = code.replace(/\/\/ 1\. Copiar e-mails \(Apenas Administrador Geral\)/, syncFunction);

// 2. Add the button in the UI
const syncButton = `
            <div className="flex items-center gap-2">
              {!isInstructorUser && (
                <button
                  onClick={handleSyncCounters}
                  className="px-3 py-1.5 border border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-300 font-heading text-xs rounded-[2px] transition-colors flex items-center gap-1.5"
                  title="Forçar sincronização de contadores"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sincronizar Vagas</span>
                </button>
              )}
              {!isInstructorUser && (
                <button
                  onClick={handleCopyEmails}
`;

code = code.replace(/\{!isInstructorUser && \(\s*<button\s*onClick=\{handleCopyEmails\}/m, syncButton);

fs.writeFileSync('src/components/StudentsModal.jsx', code);
console.log("StudentsModal patched with Sync Counters button!");
