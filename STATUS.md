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
7. **Otimização & Compactação Geral de Mídias (Imagens & Vídeos):**
   * Redução drástica de **28.39 MB (-42.2%)** no peso total de mídia da pasta `public/` (de 67.27 MB para 38.88 MB).
   * **Vídeos (MP4):** Redução de 64.9% (de 17.62 MB para 6.19 MB) com flag `+faststart` aplicada em todos os vídeos para streaming instantâneo em conexões 4G/mobile. Remoção segura do arquivo duplicado `hero-social-project.mp4` (~8 MB).
   * **Galeria de Workshops (JPG):** Redução de 86.7% (de 8.18 MB para 1.08 MB).
   * **Fotos de Currículo (JPG):** Redução de 81.0% (de 3.93 MB para 0.75 MB).
   * **Sequência Hero Canvas:** Compressão seletiva e inteligente nos 240 frames, economizando 6.55 MB nos frames pesados e preservando a leveza dos frames originais.
   * **Segurança Total:** Cópia 100% íntegra de todos os 300 arquivos originais preservada em `C:\Renas\Antigravity\Website-builder_Media_Backup_Original\`.
   * `npm run build` executado e aprovado com 0 erros.
8. **Correção de Responsividade & Scroll Horizontal no Painel Admin (`/admin`):**
   * Corrigido o vazamento de margem direita no mobile (Brave/Chrome): `html`, `body` e `#root` com `overflow-x-hidden` e `max-width: 100vw`.
   * Abas mestras ("Eventos & Agenda" e "Alunos & Usuários Cadastrados") adaptadas com `flex-wrap` e textos truncados para não forçar largura superior à tela.
   * Linha de ações dos cards de eventos (vagas, espera e botões de ação) reestruturada para quebrar fluidamente em telas estreitas sem usar `shrink-0`.
   * Calendário de sessões (`ScheduleCalendarPicker.jsx`) e filtros de alunos ajustados com layouts flexíveis para mobile.
9. **Privacidade e Proteção de Dados de Alunos no Portal do Instrutor (`StudentsModal.jsx`):**
   * Ocultação e blindagem total dos dados pessoais de contato dos participantes (e-mail, telefone/WhatsApp e endereço completo) para usuários com perfil de instrutor (`instructor`).
   * Higienização de estado em memória: dados de contato não são sequer injetados no estado do componente quando aberto por instrutores.
   * Ocultação do botão "Copiar E-mails" para instrutores (exclusivo para administração).
   * Exportação CSV adaptada: instrutores exportam apenas dados pedagógicos, idade, restrições corporais e notas de CRM (sem colunas de contato).
10. **Agenda Integrada & Wishlist com Meta de 10 Pessoas nas Páginas dos Workshops:**
   * **Cards da Agenda (`WorkshopAgendaSection.jsx`):** Em cada página de workshop (`WorkshopTemplate.jsx`), se houver turmas ou eventos futuros cadastrados para aquele workshop, exibe automaticamente os cards da agenda correspondentes com data, horários, local, instrutor, carga horária e botão direto de inscrição (`handleEnroll`) ou lista de espera integrado ao Firestore.
   * **Wishlist / Lista de Interesse sob Demanda (`WorkshopWishlist.jsx`):** Caso o workshop não possua nenhuma data agendada no momento, exibe um componente elegante e interativo:
     * Barra de progresso visual com contagem de interessados rumo à meta de 10 pessoas para abertura de nova turma.
     * Botão "Tenho Interesse neste Workshop" sincronizado em tempo real com a coleção `wishlists` no Firestore (`workshopKey_userId`).
     * Permite ao aluno registrar ou cancelar seu interesse a qualquer momento com atualização instantânea.
     * Ferramentas de convite social para amigos:
       * Botão de compartilhamento direto no WhatsApp com mensagem personalizada contendo o nome do workshop e link nos 3 idiomas (PT, EN, NO).
       * Botão de cópia rápida do link do workshop com feedback visual.
   * **Internacionalização Completa:** Suporte total nos 3 idiomas (Português, Inglês e Norueguês) nos arquivos de tradução `pt.json`, `en.json` e `no.json`.
   * `npm run build` testado e aprovado com 0 erros.

---

## 📂 Arquivos de Histórico de Conversas & Planilhas
Localizados em `C:\Renas\Antigravity\` e na Área de Trabalho:
* `toda conversa com Antigravity até o windows resetar.docx` (Parte 1: início até 04/09).
* `toda conversa com Antigravity - parte 2.docx` (Parte 2: de 04/09 até 07/09).
* `toda conversa com Antigravity - parte 2.md` (Versão Markdown da parte 2).
* `Fazer_Backup_Conversa.bat` e atalho na Área de Trabalho para gerar backup a qualquer momento com 1 duplo clique.
* **Planilha de Revisão de Traduções (935 chaves completas):**
  * `Dance2Dance_Traducoes_Revisao.xlsx` (Excel formatado, com filtros, cores e congelamento de painel).
  * `Dance2Dance_Traducoes_Revisao.csv` (CSV com UTF-8 BOM).
  * Disponível em `C:\Renas\Antigravity\`, dentro do repositório `Website-builder/` e na **Área de Trabalho**.

---

## 🎯 Próximos Passos Imediatos
* Subir as alterações pelo GitHub Desktop / git commit & push para publicação na Vercel.
* Testar carregamento real no navegador / mobile.

