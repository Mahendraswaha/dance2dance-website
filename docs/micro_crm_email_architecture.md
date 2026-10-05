# Arquitetura de E-mails do Micro CRM

A arquitetura de disparo de e-mails para o nosso Micro CRM SaaS deve ser modularizada, dividindo-se entre **Triggers Transacionais** (ações instantâneas do usuário) e **Triggers Temporais** (cron jobs baseados no tempo).

Todas as verificações devem checar o status de `isActive` do template antes do envio.

## Diagrama da Arquitetura

```mermaid
flowchart TD
    subgraph Frontend [Dance2Dance UI]
        A[Usuário se inscreve na Agenda]
        B[Painel Admin - Ativar/Pausar Template]
    end

    subgraph Firebase [Firestore Database]
        DB_T[(crm_email_templates)]
        DB_E[(enrollments)]
        DB_U[(users)]
    end

    subgraph Vercel Functions [Backend API]
        API_A[/api/agenda-notify]
        CRON_E[Cron Diário: crm-cron.js]
    end
    
    subgraph Servidor de E-mail
        SMTP[Nodemailer / Pro ISP]
    end

    %% Fluxo de Inscrição (Transacional/Outbox)
    A -- Cria Inscrição (emailSent: false) --> DB_E
    
    %% Configuração de Templates
    B -- "Atualiza isActive: true/false" --> DB_T
    
    %% Fluxo Temporal (Cron)
    CRON_E -- "Busca Outbox pendente" --> DB_E
    CRON_E -- "Busca Alunos inativos > 90 dias" --> DB_U
    CRON_E -- "Busca Eventos que ocorrem amanhã" --> DB_E
    CRON_E -- "Chama API de Notificação" --> API_A
    
    %% Validação de Template e Disparo
    API_A -- "1. Consulta Template" --> DB_T
    DB_T -- "Se isActive == true" --> API_A
    DB_T -. "Se isActive == false" .-x API_A
    API_A -- "2. Dispara e-mail" --> SMTP

```

## 1. Ativar / Pausar E-mails (O Botão de Controle)
Atualmente, no banco de dados (`crm_email_templates`), já criamos a chave `isActive: true`.
**O que precisa ser feito:**
1. **No Frontend:** Adicionar um botão *Toggle* (Liga/Desliga) na tela do `CommunicationsTab.jsx`. Quando o admin desativar, ele atualiza `isActive: false` no Firestore.
2. **Na API (`/api/agenda-notify.js`):** Logo após buscar o template no banco, o código deve verificar:
   ```javascript
   if (docData.fields.isActive?.booleanValue === false) {
       // O e-mail está pausado pelo administrador. Cancela o envio.
       return res.status(200).json({ success: true, message: 'Template is paused.' });
   }
   ```

## 2. Programação dos Gatilhos (Como executar?)

### A. E-mails Transacionais (Ação imediata)
*Exemplos:* `enrollment_confirmed`, `waitlist_joined`, `contact_received`.
* **Como funciona:** O usuário faz uma ação na UI. O frontend salva a ação no Firestore.
* **O Gatilho:** Já está estruturado! O seu arquivo `api/crm-cron.js` varre a "Outbox" (inscrições onde `emailSent: false`) e dispara o e-mail em background via `/api/agenda-notify`. Se falhar, ele tenta novamente na próxima vez.

### B. E-mails Temporais ou Crons (Tempo passando)
*Exemplos:* `reminder_1_day`, `post_event_feedback`, `inactive_90_days`.
* **Como funciona:** O usuário não clica em nada. O gatilho é a **passagem do tempo**.
* **O Gatilho:** Devemos expandir o `api/crm-cron.js` (que roda todo dia via Vercel Cron) para fazer as seguintes consultas (*Queries*):
  1. **Lembrete (1 Dia Antes):** Buscar em `enrollments` onde a data do evento (`startDate`) seja exatamente `Data de Hoje + 1 dia`.
  2. **Feedback Pós-Evento:** Buscar em `enrollments` onde a data do evento seja exatamente `Data de Hoje - 1 dia`.
  3. **Inatividade (90 Dias):** Adicionar um campo `lastActivityDate` na coleção `users`. Toda vez que o aluno fizer login ou se inscrever, atualizamos essa data. O Cron buscará usuários onde `lastActivityDate == Data de Hoje - 90 dias`.

Ao encontrar registros nas consultas acima, o Cron Job simplesmente chama a mesma API (`/api/agenda-notify`), que montará o e-mail correto.


## 3. Visão de Futuro: Funis & Automações (Sequências)
Para transformar o sistema em um CRM SaaS maduro (como ActiveCampaign ou Mailchimp), o administrador não dependerá de código fixo para novas campanhas (ex: lançamento de E-book).

A arquitetura futura contará com:
1. **Frontend (Painel Admin):** Uma nova aba *Funis & Automações* onde o usuário desenhará regras visuais.
2. **Banco de Dados (crm_sequences):** Salvará o fluxo. Ex:
   - Gatilho: Download E-book
   - Passo 1: Esperar 3 dias -> Enviar Template Dicas 1
   - Passo 2: Esperar 7 dias -> Enviar Template Convite Workshop
3. **Máquina de Estados:** O CRM (via Cron) lerá essas regras e atualizará um contador (sequenceStep) em cada usuário (leads), calculando matematicamente quando disparar a próxima fase do funil sem intervenção manual.
