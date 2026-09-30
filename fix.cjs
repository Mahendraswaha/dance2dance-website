const fs = require('fs');
let code = fs.readFileSync('src/components/admin/CommunicationsTab.jsx', 'utf8');

// Replace the TEMPLATES_LIST
code = code.replace(/const TEMPLATES_LIST = \[\s*\{ id: 'agenda_enrolled'.*?\n\s*\{ id: 'agenda_waitlist'.*?\n\];/s, `const TEMPLATES_LIST = [
  { id: 'enrollment_confirmed', name: 'Confirmação de Inscrição' },
  { id: 'waitlist_joined', name: 'Entrada na Fila de Espera' },
  { id: 'waitlist_promoted', name: 'Vaga Liberada da Fila (Promoted)' },
  { id: 'contact_received', name: 'Formulário de Contato Recebido' }
];`);

// Also fix the selectedTemplate default state
code = code.replace(/const \[selectedTemplate, setSelectedTemplate\] = useState\('agenda_enrolled'\);/, `const [selectedTemplate, setSelectedTemplate] = useState('enrollment_confirmed');`);

fs.writeFileSync('src/components/admin/CommunicationsTab.jsx', code);
