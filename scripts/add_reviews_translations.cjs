const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const files = ['pt.json', 'en.json', 'no.json'];

const translations = {
  pt: {
    reviewsManager: {
      loadError: "Erro ao carregar avaliações.",
      statusUpdated: "Status atualizado!",
      statusUpdateError: "Erro ao atualizar status.",
      deleteConfirm: "Tem certeza que deseja apagar este depoimento?",
      deleted: "Depoimento apagado.",
      deleteError: "Erro ao apagar.",
      averageRating: "Média Geral",
      pending: "Pendentes",
      approved: "Aprovados",
      approvedSite: "Aprovados (Site)",
      rejected: "Rejeitados",
      all: "Todos",
      loading: "Carregando avaliações...",
      empty: "Nenhuma avaliação encontrada.",
      actionApprove: "Aprovar",
      actionReject: "Rejeitar",
      actionQueue: "Para Fila",
      actionDelete: "Excluir"
    }
  },
  en: {
    reviewsManager: {
      loadError: "Error loading reviews.",
      statusUpdated: "Status updated!",
      statusUpdateError: "Error updating status.",
      deleteConfirm: "Are you sure you want to delete this testimonial?",
      deleted: "Testimonial deleted.",
      deleteError: "Error deleting.",
      averageRating: "Average Rating",
      pending: "Pending",
      approved: "Approved",
      approvedSite: "Approved (Live)",
      rejected: "Rejected",
      all: "All",
      loading: "Loading reviews...",
      empty: "No reviews found.",
      actionApprove: "Approve",
      actionReject: "Reject",
      actionQueue: "To Queue",
      actionDelete: "Delete"
    }
  },
  no: {
    reviewsManager: {
      loadError: "Feil ved lasting av anmeldelser.",
      statusUpdated: "Status oppdatert!",
      statusUpdateError: "Feil ved oppdatering av status.",
      deleteConfirm: "Er du sikker på at du vil slette denne uttalelsen?",
      deleted: "Uttalelse slettet.",
      deleteError: "Feil ved sletting.",
      averageRating: "Gjennomsnittlig Vurdering",
      pending: "Venter",
      approved: "Godkjent",
      approvedSite: "Godkjent (Nettside)",
      rejected: "Avvist",
      all: "Alle",
      loading: "Laster anmeldelser...",
      empty: "Ingen anmeldelser funnet.",
      actionApprove: "Godkjenn",
      actionReject: "Avvis",
      actionQueue: "Til Kø",
      actionDelete: "Slett"
    }
  }
};

files.forEach(file => {
  const lang = file.split('.')[0];
  const filePath = path.join(localesDir, file);
  
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Merge reviewsManager
    data.reviewsManager = translations[lang].reviewsManager;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
