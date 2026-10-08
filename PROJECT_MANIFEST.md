# Dance2Dance - Project Manifest & Architecture

Este documento serve como a "Bíblia" do projeto Dance2Dance. Toda Inteligência Artificial ou desenvolvedor trabalhando neste repositório DEVE ler este arquivo antes de iniciar qualquer alteração para garantir consistência arquitetônica, visual e de tom de voz.

## 1. Visão Geral
* **Organização:** Dance2Dance (Organização Social sem fins lucrativos)
* **Localização:** Oslo, Noruega (com suporte da Porto Alegre Cia de Dança - Brasil)
* **Objetivo:** Oferecer excelência em dança, práticas somáticas e consciência corporal, financiando bolsas 100% integrais para a comunidade (Tøyen e Grønland) através de pagantes do mercado.

## 2. Pilha Tecnológica (Tech Stack)
* **Frontend:** React.js (com Vite)
* **Estilização:** Tailwind CSS (com animações Framer Motion)
* **Roteamento:** React Router DOM (Single Page Application)
* **Internacionalização:** `i18next` (Suporte obrigatório para PT, EN e NO-Bokmål)
* **Backend as a Service (BaaS):** Firebase (Authentication e Firestore para banco de dados)
* **E-mails Transacionais:** Servidor SMTP via **Pro ISP** (provedor norueguês). E-mails engatilhados por ações do usuário.
* **Segurança:** Cloudflare Turnstile (proteção anti-spam em formulários).

## 3. Design System & UI (Regras de Interface)
* **Paleta de Cores:**
  * Fundo (Primary): `#0A0A0E` ou `#0C0C0C` (Estética "Dark Premium")
  * Texto Principal: `#FAF8F5` ou `#F0EDE8`
  * Destaque (Accent/Gold): `#C9A84C`
* **Layout "Zero Gravity" (Hero Sections):** 
  * O menu (Navbar) é fixo/absoluto no topo. Para evitar colisões de texto, as seções principais (Heroes) DEVEM usar um `padding-top` seguro rígido, geralmente `pt-40 md:pt-48` e `pb-24`.
  * Nunca usar `15vh` para espaçamento de topo, pois quebra em monitores wide/laptops pequenos.
* **Colisão de Âncoras:** Seções acessadas via link âncora (ex: `/#workshops`) DEVEM receber padding interno para compensar o menu, ao invés de usar `scroll-margin-top` caso haja transições de cor de fundo.
* **Tipografia:** Uso de fontes serifadas premium (Georgia/Batang) para cabeçalhos e sem serifa (System UI) para leitura.

## 4. Regras de Escrita & Tom de Voz (O Padrão "Você pode muito mais")
*Essas regras nasceram de um alinhamento rigoroso sobre a maturidade e sofisticação da marca. A comunicação deve ser direta, inteligente e sem ruídos.*

* **Tom e Estilo:** 
  * Direto, premium e sofisticado. 
  * ZERO clichês. ZERO frases negativas. 
  * Sem enrolação ou "preâmbulos burocráticos/políticos" nos e-mails. Vá direto ao ponto.
* **Sinais Gráficos e Emojis:**
  * **PROIBIDO** o uso de Emojis em qualquer comunicação de e-mail ou UI oficial.
  * **PROIBIDO** o uso de travessão longo (m-dash / `—`). Use apenas dois-pontos (`:`) ou hífen curto (`-`).
  * O ícone de ponto dourado (`&#9679;`) **NUNCA** pode estar sublinhado em links.
* **Terminologia Intocável:**
  * Use **Sempre "Workshop"**. NUNCA use "retiro" (nem em PT, EN ou NO).
  * **Kroppsskole** é um substantivo próprio, marca registrada. **NUNCA DEVE SER TRADUZIDO** em nenhum idioma.
* **Templates de E-mail (Regras Rígidas):**
  * Bloco de informações deve ser limpo: `workshop: [Nome] \n dia: [Date] \n hora: [Time]`.
  * Para e-mails de Lista de Espera, use **"Location:" / "Local:"**. NUNCA use "See you at:" (pois a vaga ainda não está garantida).
  * Frases de status obrigatórias:
    * `"Confirmamos sua inscrição para o workshop:"`
    * `"A lista de espera girou e sua vaga foi confirmada:"`
    * `"Você entrou na lista de espera:"`
* **Tradução Norueguesa (NO):**
  * Deve usar sempre **Bokmål** (nunca Nynorsk ou Sueco).
  * Em textos institucionais e projetos sociais, garantir a presença de "Grant-application keywords" (palavras-chave para editais do governo): *personlig velvære, kunstnerisk uttrykk, selvinnsikt, selvtillit*.


## 5. A Visão do Produto (Micro CRM SaaS)
**MANDATO CRÍTICO:** O Dance2Dance NÃO é apenas um site. Ele é o "Cliente Zero" e o Case de Sucesso (laboratório) para a construção do nosso próprio produto: um **Micro CRM SaaS**.
Toda a arquitetura de backend, captação de leads, e-mails, listas de espera e inteligência de marketing que estamos construindo aqui deve ser pensada para ser **desacoplada e vendida como um serviço independente no futuro**.

* **Documentação Oficial do CRM:** Todas as lógicas técnicas de agendamento de e-mails, crons e gestão de avaliações DEVEM seguir estritamente o arquivo `docs/MICRO_CRM.md`. Sempre leia aquele arquivo ao lidar com envios em massa ou automações.
* **A Separação:**
  * **Frontend (Dance2Dance):** O site React atual que atende os alunos.
  * **Backend (O Micro CRM SaaS):** O motor de gestão de clientes, automações e disparo de e-mails (usando o servidor Pro ISP) que estamos construindo no Firebase. 
* **Regra de Desenvolvimento:** Sempre que criarmos uma funcionalidade de gestão de alunos, automação ou marketing, a IA deve perguntar e refletir: *"Como construo isso de forma modular para que amanhã possamos extrair esse código, colocar outra marca e vender como um software para outras escolas/organizações?"*
* **Nada de CRMs externos definitivos:** Ferramentas de prateleira só devem ser cogitadas se formos utilizá-las estritamente como *API de disparo* (motores "burros"). O **cérebro** das regras de negócio (Lead Scoring, Funis, Tags, Inteligência) será totalmente construído por nós mesmos dentro do nosso ecossistema para compor o SaaS.
* **Arquitetura Single Tenant (Isolamento de Instâncias):** 
  * O Micro CRM NÃO será Multi-tenant (um bancão de dados gigante misturando todos os clientes com `tenant_id`). 
  * O modelo será **Single Tenant**. Cada cliente futuro do SaaS terá seu próprio projeto Firebase / Banco de Dados isolado. 
  * Benefícios: Segurança máxima de dados, zero risco de vazamento entre clientes, performance garantida (sem "noisy neighbors") e posicionamento de produto Premium. Todo o código do backend deve ser escrito assumindo que o banco de dados pertence a **um único cliente**.


## 6. Regras de Fluxo e Lógica
* **Login/Redirecionamento:** Páginas de Autenticação (`LoginPage`, `SignupPage`) devem sempre capturar o `location.state.from` para devolver o usuário à tela exata em que ele estava (ex: continuar uma inscrição na Agenda), sem jogá-lo forçadamente para a Home.
* **Workshops (Vagas):** O sistema opera com vagas baseadas em investimento (pagantes) que financiam as vagas de bolsa (gratuitas). A lógica de lista de espera deve respeitar as arrays do Firebase rigorosamente.


# Dance2Dance — Contexto e Regras do Projeto (Micro CRM e Site)

Este documento centraliza as regras de negócio, padrões de arquitetura e decisões técnicas extraídas do histórico de desenvolvimento do site e do Micro CRM. Serve como mapa de referência rápida para mantermos a consistência nos próximos passos.

## 1. Arquitetura e Padrões de Código

### 1.1 Stack Tecnológico
- **Frontend:** React (usado com Vite), Tailwind CSS.
- **Backend/BaaS:** Firebase (Auth, Firestore, Hosting).
- **Internacionalização:** `i18next` (Três idiomas: `pt`, `en`, `no`).

### 1.2 Padrões de Interface (UI/UX)
- **Tema:** Escuro (Dark Mode nativo). Fundo predominante `bg-[#0a0a0a]`, texto claro `text-[#F0EDE8]`.
- **Acento (Gold):** Usado em links, botões primários e detalhes através da classe `text-accent`.
- **Tipografia:** Fonte estilizada `font-drama` para títulos (ex: "Dance2Dance").
- **Apresentação da Marca:** O nome da marca sempre possui formatação especial para o "2": 
  `Dance<span className="text-accent text-[1.28em] inline-block align-baseline">2</span>Dance`.
- **Alertas (Toaster):** Proibido o uso de `window.alert()`. O sistema foi migrado para um sistema de Toast/Notificações nativas e não-intrusivas na interface.
- **Espaçamento Global:** Páginas principais (`main`) precisam de padding superior (`pt-44 md:pt-52`) para não serem sobrepostas pela barra de navegação (Navbar).

### 1.3 Performance e Animações Cinematográficas (GSAP)
- **Backgrounds e Parallax no Mobile:** É estritamente proibido usar `background-attachment: fixed`. Essa propriedade destrói a inércia nativa do iOS/Android e causa bugs de renderização severos (efeito "stepper motor"). Use sempre uma `div` com altura extra (ex: `-inset-y-[15%]`) e aplique parallax via GSAP (`yPercent`).
- **ScrollTrigger e Mobile:** Sempre que usar `pin: true` ou scrub no mobile com elementos pesados (Sequências de Imagens/Vídeos), trate a lógica condicionalmente para dispositivos móveis (`window.matchMedia("(pointer: coarse)")`). Em casos de desincronização entre o motor de rolagem e a thread principal, utilize `ScrollTrigger.normalizeScroll(true)` restrito ao Mobile.
- **Vídeos Autoplay:** Evite tentar forçar a execução usando `.play()` via JavaScript (como em eventos `onUpdate` do GSAP ou `onLoadedData`) em desktops. Navegadores costumam punir essa técnica bloqueando a reprodução e cancelando o autoplay nativo. Deixe a tag `<video autoPlay loop muted>` fazer seu trabalho naturalmente e utilize `<link rel="preload" as="video">` no cabeçalho `index.html` para anular atrasos de rede.
- **FOUT e Fontes:** Use `display=block` nas chamadas do Google Fonts para que o navegador não exiba momentaneamente fontes genéricas do sistema. Se as fontes Serifadas parecerem desproporcionalmente menores que as Sans-Serif por causa da altura-x óptica, faça a compensação usando unidades relativas (ex: `text-[1.15em]`) para manter a proporção intacta no responsivo.

---

## 2. Autenticação e Firebase (Auth)

### 2.1 Single-Tenant e Segurança
- O sistema suporta/configurou lógicas de _Single-Tenant_ no Firebase para isolar usuários da organização.
- **Danger Zone:** Ações destrutivas, como exclusão de conta (Delete Account), exigem **reautenticação imediata** do usuário por motivos de segurança.

### 2.2 E-mails Transacionais
- E-mails de Firebase (Redefinição de Senha, Verificação) estão vinculados ao idioma atual do usuário (`auth.languageCode = i18n.language`).
- Há manipuladores customizados de ação de e-mail (Email Action Routes) para capturar o clique do usuário nos links enviados pelo Firebase.

### 2.3 Perfil e Cadastro (Signup)
- O fluxo de cadastro (`SignupPage.jsx`) vai além de e-mail e senha. Ele captura o perfil completo no Firestore: `nome`, `telefone`, `endereço`, `cidade`, `CEP`, `país`, `data de nascimento`, `profissão`, `experiência com dança` e `restrições médicas`.
- Após a criação do Auth (Authentication), os metadados são injetados no documento do usuário no Firestore (`patch_profile`).

---

## 3. Internacionalização (i18n)

### 3.1 Idiomas Suportados
- **PT:** Português (Brasil) - Idioma base de desenvolvimento e da criadora.
- **EN:** Inglês - Idioma corporativo/internacional.
- **NO:** Norueguês (Bokmål) - Idioma local obrigatório para captar fundos públicos e grants em Oslo.

### 3.2 Regras de Localização
- Os _placeholders_ (textos de dica) de formulários se adaptam ao idioma. Exemplo no campo de telefone:
  - PT: `+55 ...`
  - EN / NO: `+47 ...` e `Norway...` / `Norge...`
- Traduções isoladas e complexas (ex: parágrafos da biografia da Safia) são mapeadas cuidadosamente para manter a formatação do HTML intacta (ex: o `span` da marca Dance2Dance no meio do texto).

---

## 4. Formulários e Captura de Leads (Micro CRM)

### 4.1 Formulário de Contato (`ContactPage`)
- A estrutura do formulário de contato foi expandida para incluir endereço completo (rua, cidade, CEP, país), fundamental para qualificar leads institucionais.
- O campo de assunto (`subject`) é dinâmico. Se o usuário vier de um link corporativo, o valor padrão é `reuniao-executiva`. Caso contrário, cai na vala comum de `Dúvidas Gerais / Informações`.

### 4.2 Lógica do Micro CRM (Próximos Passos Baseados no Histórico)
O sistema (Firestore) já está preparado para:
- Cadastro e login de usuários.
- Inscrições em workshops da agenda.
- Disparo de eventos e-mails transacionais (Outbox/Retry patterns).
- Dashboard administrativo.
- Multilíngue embutido.

### 4.3 Arquitetura Macro
- **Site (Frontend Público):** Focado em conversão e SEO (Apresentar os programas: Be The Dance, Biostretch, Projetos Sociais).
- **Notion:** Focado na gestão *interna* da equipe (conteúdo, ideias de grants, tarefas manuais).
- **Micro CRM (Firebase):** Focado em *Pessoas e Relacionamentos* (inscrições, formulários de leads como e-books, automações de e-mail de boas-vindas e feedback).


## Instruções para o Agente (Meta-Regras)
- Sempre que o usuário disser que uma funcionalidade foi "concluída", "aprovada" ou que "funcionou", você DEVE alertá-lo com a seguinte mensagem: 
  "Notifiquei que terminamos esta etapa! Deseja que eu atualize este arquivo projeto.md com o resumo desta nova implementação antes de fecharmos o chat?"



## 5. Diretrizes de Tradução e i18n
*Baseado na auditoria e no contexto cultural do projeto.*

**A REGRA DE OURO (Tríade e Planilha):**
Toda e qualquer alteração textual no site, banco de dados ou e-mails DEVE sempre ser pensada para os 3 idiomas simultaneamente (Português, Inglês e Norueguês). Após aplicar as alterações no código, a IA ou o Desenvolvedor DEVE OBRIGATORIAMENTE atualizar a planilha local `C:\Renas\Antigravity\Dance2Dance_Traducoes_Revisao.xlsx`, adicionando ou alterando as chaves correspondentes.

**⚠️ REGRA CRÍTICA DE FORMATAÇÃO DA PLANILHA:**
A planilha possui uma formatação avançada (cabeçalhos coloridos, painéis congelados, auto-filtros, larguras dinâmicas, wrap text, e zebra striping). É **ESTRITAMENTE PROIBIDO** utilizar bibliotecas como `pandas.to_excel` para sobrescrever a planilha, pois isso destrói a formatação. Todas as sincronizações automatizadas DEVEM ser feitas utilizando a biblioteca `openpyxl`, atualizando **APENAS OS VALORES DAS CÉLULAS** (`cell.value`) e iterando pelas linhas para preservar a estética e funcionalidade visual da planilha intactas.

* **Evite Calques (Tradução Literal):** Não traduza expressões figurativas palavra por palavra. Exemplo: "A mudança começa na pele" vira "Change begins from within" (EN) e "Endringen starter innenfra" (NO).
* **Falsos Amigos em Norueguês (Bokmål):**
  * "Autoria de si": Use `Eierskap` (senso de domínio), nunca `Forfatterskap` (autoria de livros).
  * "Reconexão com o corpo": Use `Fornyet kontakt` ou `Gjenopprette kontakten`, nunca `Gjenforening` (reunião familiar).
  * "Disponibilidade corporal": Use `Smidighet`, nunca `Tilgjengelighet` (agenda livre).
  * "Investigação": Use `Utforskning` (explorar), nunca `Undersøkelse` (exame médico/policial).
* **Tom Corporativo (B2B):** Evite jargões informais ou de incerteza ("Bet on" -> "Believe in"). "Ganho social" traduz-se melhor como "Social capital" (e não "Social equity").
* **Impacto Social (Acolhimento):** Evite termos violentos. Em vez de "Destroy cultural barriers", use "Break down barriers".
* **Capitalização (Maiúsculas e Minúsculas):** Inglês aceita Title Case em títulos ("Health and Physical Restrictions"). Norueguês exige minúsculas após a primeira palavra ("Helse- og fysiske begrensninger").
* **Proteção de Marcas e Editais:**
  * **Kroppsskole** nunca é traduzido em nenhum idioma.
  * O norueguês deve sempre garantir o uso de palavras-chave de editais locais: *personlig velvære*, *kunstnerisk uttrykk*, *selvinnsikt*, e *selvtillit*.


## 7. Documentação Técnica Avançada
Para não poluir este manifesto com regras de infraestrutura complexa, os manuais técnicos do projeto estão isolados na pasta docs/. Sempre que precisar alterar ou construir uma dessas áreas, oriente a IA a ler o documento correspondente:
* **Micro CRM (E-mails, Funis, Dashboards, Cron Jobs):** Leia docs/MICRO_CRM.md
* **Ecossistema do Notion (Projetos vs Tarefas):** Leia docs/NOTION_ARCHITECTURE.md
