const fs = require('fs');
let code = fs.readFileSync('src/components/admin/CommunicationsTab.jsx', 'utf8');
code = code.replace(/const TEMPLATES_LIST = \[\s*\{[\s\S]*?\];/, `const TEMPLATES_LIST = [
  { id: 'enrollment_confirmed', name: 'Confirmação de Inscrição' },
  { id: 'waitlist_joined', name: 'Entrada na Fila de Espera' },
  { id: 'waitlist_promoted', name: 'Vaga Liberada da Fila (Promoted)' },
  { id: 'contact_received', name: 'Formulário de Contato Recebido' },
  { id: 'reminder_1_day', name: 'Lembrete (1 Dia Antes)' },
  { id: 'post_event_feedback', name: 'Feedback (Pós-Evento)' },
  { id: 'inactive_90_days', name: 'Inatividade (90 Dias)' }
];`);
fs.writeFileSync('src/components/admin/CommunicationsTab.jsx', code);
