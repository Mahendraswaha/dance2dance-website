# Dance2Dance - Arquitetura do Sistema Operacional (Notion)

Este documento descreve a arquitetura exata de gestão da Dance2Dance no Notion. O Notion funciona como o "Cérebro Operacional", enquanto o Micro CRM (nosso código) funciona como o "Cérebro de Relacionamento". **Um não substitui o outro.**

## Os 7 Bancos de Dados Principais

A estrutura do Notion da Dance2Dance não é um único projeto gigante, mas sim um ecossistema de 7 bancos relacionais interligados:

### 1. PROJECTS
O topo da hierarquia.
- **Exemplos:** Website, Micro CRM, Blog, E-book Biostretch, YouTube, Social Project, Grant 2027.
- **Campos principais:** Objetivo, Responsável, Prazo, Status, Prioridade, Tarefas (Relacionamento), Documentos, Métricas.

### 2. TASKS
A base mais utilizada do sistema. Centraliza a execução de todos os projetos.
- **Campos principais:** Projeto (Relacionamento), Responsável, Status, Prioridade, Deadline, Tipo, Dependência, Link/Documento.
- **Visualizações (Views):** Kanban (Backlog → This Week → Doing → Review → Done) e Calendar.

### 3. CONTENT
A "Máquina de Conteúdo". Segue a regra de ouro: "Um conteúdo-mãe gera múltiplos formatos" (ex: 1 vídeo gera Reel, TikTok, Short, Blog e Newsletter).
- **Campos principais:** Status (Ideia → Roteiro → Produção → Edição → Revisão → Agendamento → Publicado → Métricas).
- **Propriedades:** Plataforma, Formato, Idioma, Campanha, CTA, Público, **Conteúdo-mãe** (para agrupar ramificações), Data, Responsável.

### 4. PARTNERS / ORGANIZATIONS
Focado em instituições, sponsors e fundos (complementa o Micro CRM, não o duplica).
- **Exemplos:** Interkulturelt Museum, Kulturrådet, Empresas B2B.
- **Campos principais (Funil):** Prospect → Contato → Conversa → Reunião → Proposta → Piloto → Parceria → Ativo.

### 5. WORKSHOPS / EVENTS
Gerencia a **produção e operação** do evento (enquanto o Micro CRM cuida das inscrições e dos participantes).
- **Campos principais:** Local, Parceiro, Professor, Datas, Capacidade, Preço, Materiais, Divulgação, Link da página, Tarefas relacionadas, Métricas.

### 6. GRANTS / FUNDING
Gestão específica para editais noruegueses (que funcionam quase como um projeto à parte).
- **Campos principais:** Entidade, Deadline, Valor, Objetivo, Requisitos, Documentos, Responsável, Link, Histórico.
- **Status:** Identificado → Qualificação → Pesquisa → Documentação → Draft → Revisão → Enviado → Resultado → Relatório.

### 7. KNOWLEDGE / DOCUMENTS
A Base de Conhecimento da Dance2Dance para evitar documentos espalhados pelo Google Drive.
- **Exemplos:** Brand, Manifesto, Pitch Deck, Textos (Copy), SEO, Templates, Documentação da IA/Avatar.

---

## Integração Futura (A Mágica)
A longo prazo, o Micro CRM poderá conversar via API com o Notion. 
- *Exemplo:* Criar um workshop no Notion muda o status para "Publicado" → A API lê isso e gera automaticamente o evento no site/CRM.
- *Fluxo de Dados:*
  - **Notion:** Gestão da organização (Tarefas, Projetos, Roteiros).
  - **Micro CRM:** Pessoas e relacionamento (Inscrições, E-mails, Transações).
  - **Website:** Porta de entrada (Aquisição/Conversão).


## A Filosofia e Fronteiras do Sistema
- **Separação de Responsabilidades:** O Notion cuida da Operação (o que fazer, quando, como produzir). O Micro CRM cuida das Pessoas (quem comprou, quem baixou o e-book, dor, envio de e-mail, histórico).
- **Bancos Relacionais:** Ter um banco unificado de `TASKS` que se relaciona com `PROJECTS`, `CONTENT` e `GRANTS` evita tarefas espalhadas em 5 lugares. O "This Week" centraliza o foco.
- **Conteúdo-Mãe:** A sacada genial de cadastrar um vídeo base e desdobrar as subtarefas para Reels, Blog, Newsletter tangibiliza a regra de "um ativo, múltiplos formatos".

## Hack do Plano Gratuito do Notion (Acesso Ilimitado)
**CUIDADO COM A PEGADINHA:** Se criar um "Team Workspace" e adicionar membros, o Notion limita a 1.000 blocos, esgotando o espaço em semanas.
- **Como usar ilimitado de graça:** Crie a conta para **Uso Pessoal**.
- Crie a página "Dance2Dance HQ".
- Em "Share", adicione a Safia (ou o desenvolvedor) como **Convidado (Guest)** com "Full Access". O plano pessoal permite até 10 convidados de graça, com blocos e páginas infinitas.
- **Arquivos Pesados:** O upload nativo do plano grátis é de 5MB. Solução: suba vídeos pesados do CapCut no Google Drive e cole o link do Drive no card do Notion (o Notion gera um preview visual do link).

## Ordem de Criação Recomendada
Para facilitar os relacionamentos cruzados, crie os bancos nesta ordem:
1. **PROJECTS** (O topo da hierarquia)
2. **KNOWLEDGE / DOCUMENTS** (Base solta para arquivos e referências)
3. **PARTNERS / ORGANIZATIONS** (As Entidades)
4. **TASKS** (O coração operacional — vai se relacionar fortemente com os Projetos)
5. **CONTENT** (Vai se relacionar com Tasks e Projects)
6. **WORKSHOPS / EVENTS** (Vai se relacionar com Partners)
7. **GRANTS / FUNDING** (Vai se relacionar com Partners e Tasks)
