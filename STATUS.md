# 📋 STATUS & DIÁRIO DE BORDO — Dance2Dance Website

> **Instrução para a IA ao iniciar qualquer nova sessão:**  
> Se o sistema foi reiniciado ou uma nova conversa foi aberta, leia este arquivo antes de qualquer ação. Ele contém o estado atualizado do projeto, evitando perda de contexto.

---

## 📍 Localização & Links do Projeto
* **Diretório Local:** `C:\Renas\Antigravity\Website-builder`
* **Site Oficial em Produção:** [https://www.dance2dance.no](https://www.dance2dance.no)
* **Repositório Git:** Conectado e versionado via GitHub Desktop (`main`)
* **Hospedagem & Deploy:** Vercel (`dance2dance-website`)
* **Banco & Auth:** Firebase (`dance2dance`)

---

## 🛠️ Stack Tecnológica
* **Frontend:** React + Vite + Tailwind CSS + Framer Motion + Lucide React
* **Internacionalização:** i18next com suporte a 3 idiomas:
  * Português (`pt.json`)
  * Inglês (`en.json`)
  * Norueguês (`no.json`)
* **Backend Serverless:** Vercel Functions (`/api/contact.js`)
* **Servidor de E-mails:** ProISP SMTP (`smtp.proisp.no`, porta 465) com Nodemailer

---

## ✅ Funcionalidades 100% Concluídas

1. **Currículo da Safia (`CurriculumPage.jsx`):**
   * Transição automática e suave das 6 fotos (`cv-1.jpg` a `cv-6.jpg`) conforme o scroll da página.
   * Textos integrados aos arquivos de tradução.
   * Ajustes visuais e responsividade mobile finalizados.

2. **Formulário de Contato & Disparo de E-mails (`/contact` e `api/contact.js`):**
   * Envio direto via Pro ISP SMTP.
   * Credenciais protegidas: senha configurada de forma segura na Vercel via variável de ambiente `SMTP_PASS` (sem senhas expostas no código).
   * Notificação dupla para a equipe (`contact@dance2dance.no` e `portoalegreciadedanca@gmail.com`).
   * E-mail automático de confirmação enviado ao visitante no idioma selecionado.
   * **Status:** Testado e aprovado em produção!

3. **Deploy & Otimização na Vercel:**
   * Domínio personalizado com certificado SSL ativo (`dance2dance.no` e `www.dance2dance.no`).
   * Política de retenção de deploys antigos configurada para 1 semana (evitando exceder o limite de 10 GB).

4. **Painel Administrativo & Agenda:**
   * Rotas de autenticação (Login / Cadastro) e rotas administrativas configuradas com Firebase.
   * Calendário de instrutores e gerenciamento de agenda.

5. **Sistema de Perfis de Usuário (`admin`, `instructor`, `student`):**
   * Configuração de permissões e controle de acesso baseado em roles no Firestore (`users/{uid}.role`).
   * Seletor de perfil no modal de detalhes do usuário (`UserDetailModal.jsx`) com atualização em tempo real.
   * Filtros de usuários por tipo (Todos, Alunos, Instrutores, Administradores) em `RegisteredUsersManager.jsx`.
   * Badges visuais diferenciados em toda a interface administrativa e no cabeçalho/navegação (`Navbar.jsx`).

6. **Portal do Instrutor & CRM Pedagógico Interno:**
   * Isolamento completo: instrutores acessam o painel administrativo (`/admin`), mas visualizam exclusivamente os cursos e workshops sob sua responsabilidade (`instructorEmail` / `instructor`).
   * Interface adaptada para instrutor: formulário de criação de eventos, botões de exclusão/edição de cursos e aba global de usuários permanecem ocultos para este perfil.
   * Botão destacado "Alunos & CRM" na listagem de cursos.
   * **Avaliação Pedagógica & CRM por Aluno (`StudentsModal.jsx`):**
     * Classificação interna de 1 a 5 estrelas.
     * Textarea para anotações pedagógicas, histórico de evolução, postura corporal e observações confidenciais.
     * Gravação individual por inscrição em `enrollments/{enrollmentId}` sob o campo `evaluation`.
     * **Privacidade Absoluta:** As anotações do instrutor são de uso estritamente interno (CRM) e não são visíveis para o aluno em sua área de perfil (`/perfil`).
     * Exibição do histórico de CRM na ficha do aluno (`UserDetailModal.jsx`) para supervisão e acompanhamento.
     * Exportação CSV com as colunas de CRM incluídas.
     * Internacionalização completa em 3 idiomas (Português, Inglês e Norueguês).

---

## 📂 Arquivos de Histórico de Conversas (Backups Salvos)
Localizados em `C:\Renas\Antigravity\`:
* `toda conversa com Antigravity até o windows resetar.docx` (Parte 1: início até 04/09).
* `toda conversa com Antigravity - parte 2.docx` (Parte 2: de 04/09 até 07/09).
* `toda conversa com Antigravity - parte 2.md` (Versão Markdown da parte 2).
* `Fazer_Backup_Conversa.bat` e atalho na Área de Trabalho para gerar backup a qualquer momento com 1 duplo clique.

---

## 🎯 Próximos Passos Imediatos
* Testar fluxos na prática pelo navegador com uma conta de instrutor e uma conta de aluno.
* Ajustes finos adicionais que o usuário desejar para o fluxo pedagógico.
