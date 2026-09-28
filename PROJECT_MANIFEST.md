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

## 5. Regras de Fluxo e Lógica
* **Login/Redirecionamento:** Páginas de Autenticação (`LoginPage`, `SignupPage`) devem sempre capturar o `location.state.from` para devolver o usuário à tela exata em que ele estava (ex: continuar uma inscrição na Agenda), sem jogá-lo forçadamente para a Home.
* **Workshops (Vagas):** O sistema opera com vagas baseadas em investimento (pagantes) que financiam as vagas de bolsa (gratuitas). A lógica de lista de espera deve respeitar as arrays do Firebase rigorosamente.
