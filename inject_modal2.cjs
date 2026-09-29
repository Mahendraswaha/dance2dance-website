const fs = require('fs');
let c = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

if (!c.includes('import ConfirmModal')) {
  c = c.replace(
    "import { isScholarshipEligibleNeighborhood, checkUserScholarshipEligibility } from '../utils/neighborhoodHelpers';",
    "import { isScholarshipEligibleNeighborhood, checkUserScholarshipEligibility } from '../utils/neighborhoodHelpers';\nimport ConfirmModal from '../components/ConfirmModal';"
  );
  
  c = c.replace(
    "const [userEnrollments, setUserEnrollments] = useState({});",
    "const [userEnrollments, setUserEnrollments] = useState({});\n  const [cancelModal, setCancelModal] = useState({ isOpen: false, eventId: null });"
  );
  
  c = c.replace(
    /async function handleCancelEnrollment\(eventId\) {[\s\S]*?setActionLoading\(eventId\);/m,
    `function requestCancel(eventId) {
    setCancelModal({ isOpen: true, eventId });
  }

  async function confirmCancelEnrollment() {
    const eventId = cancelModal.eventId;
    setCancelModal({ isOpen: false, eventId: null });
    if (!eventId) return;
    
    setActionLoading(eventId);`
  );
  
  c = c.replace(
    /onClick=\{\(\) => handleCancelEnrollment\(event\.id\)\}/g,
    "onClick={() => requestCancel(event.id)}"
  );
  
  c = c.replace(
    "</main>",
    `  <ConfirmModal 
        isOpen={cancelModal.isOpen}
        title={t('agendaPage.cancelTitle', 'Cancelar Inscrição')}
        message={t('agendaPage.confirmCancel', 'Tem certeza que deseja cancelar sua inscrição/espera para este evento?')}
        onConfirm={confirmCancelEnrollment}
        onCancel={() => setCancelModal({ isOpen: false, eventId: null })}
      />
    </main>`
  );

  fs.writeFileSync('src/pages/AgendaPage.jsx', c, 'utf8');
}
