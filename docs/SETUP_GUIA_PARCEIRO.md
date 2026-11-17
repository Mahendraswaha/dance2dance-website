# Guia de Implantação do Micro CRM para Novos Parceiros

Este manual foi elaborado para orientar qualquer pessoa, mesmo sem conhecimento prévio de programação, a configurar e colocar no ar a sua própria versão independente do **Micro CRM**.

Ao final deste guia, você terá o seu próprio sistema funcionando na internet, com banco de dados privativo e conectado ao seu e-mail corporativo da Microsoft.

---

## Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Instalação de Programas no Computador](#2-instalação-de-programas-no-computador)
3. [Criação de Conta e Repositório no GitHub](#3-criação-de-conta-e-repositório-no-github)
4. [Criação e Configuração do Banco de Dados no Google Firebase](#4-criação-e-configuração-do-banco-de-dados-no-google-firebase)
5. [Configuração de E-mails da Microsoft (Office 365 / Outlook)](#5-configuração-de-e-mails-da-microsoft-office-365--outlook)
6. [Configurando o Projeto no seu Computador](#6-configurando-o-projeto-no-seu-computador)
7. [Publicação na Nuvem com a Vercel (Colocando o Sistema no Ar)](#7-publicação-na-nuvem-com-a-vercel-colocando-o-sistema-no-ar)
8. [Primeiro Acesso Administrativo e Testes](#8-primeiro-acesso-administrativo-e-testes)

---

## 1. Visão Geral da Arquitetura

O sistema que você está recebendo é um **Micro CRM Single-Tenant**. Isso significa que todo o banco de dados e as contas pertencem exclusivamente a você, sem compartilhamento de dados com outros clientes.

O sistema é composto por 4 pilares:
* **Código Fonte (GitHub):** Armazena os arquivos do sistema com total privacidade.
* **Banco de Dados e Usuários (Google Firebase):** Onde ficam guardados os contatos, cadastros e inscrições.
* **Servidor de Disparo (Microsoft 365):** Envia os e-mails automáticos com o nome e domínio da sua organização.
* **Hospedagem em Nuvem (Vercel):** Mantém o sistema acessível 24 horas por dia pela internet, sem necessidade de deixar o computador ligado.

---

## 2. Instalação de Programas no Computador

Você precisará de dois programas gratuitos instalados no seu computador.

### Passo 2.1: Instalar o Node.js
O Node.js é o motor que executa as bibliotecas do sistema no computador.
1. Acesse o site oficial: [nodejs.org](https://nodejs.org).
2. Baixe a versão recomendada com a sigla **LTS** (botão verde).
3. Abra o instalador baixado (`.msi` no Windows ou `.pkg` no Mac).
4. Avance pelas telas clicando em **Next**, aceite os termos e finalize clicando em **Install**. Não precisa alterar nenhuma opção pré-marcada.

### Passo 2.2: Instalar o Visual Studio Code (VS Code)
O VS Code é o editor onde você poderá ver os arquivos e executar comandos simples.
1. Acesse o site oficial: [code.visualstudio.com](https://code.visualstudio.com).
2. Baixe a versão correspondente ao seu sistema operacional (Windows ou Mac).
3. Instale o programa avançando pelas telas do instalador.

---

## 3. Criação de Conta e Repositório no GitHub

O GitHub funcionará como o cofre seguro onde o código do seu sistema ficará guardado.

### Passo 3.1: Criar a Conta
1. Acesse [github.com](https://github.com).
2. Clique no botão **Sign up** no canto superior direito.
3. Insira seu e-mail corporativo ou pessoal, crie uma senha forte e escolha um nome de usuário.
4. Conclua o desafio de verificação e digite o código de 6 dígitos enviado para o seu e-mail.

### Passo 3.2: Criar um Repositório Privado
1. Após fazer login no GitHub, clique no ícone de mais (`+`) no canto superior direito e selecione **New repository**.
2. Preencha os campos:
   * **Repository name:** digite um nome como `meu-micro-crm`.
   * **Visibilidade:** selecione obrigatoriamente a opção **Private** (Privado) para que ninguém de fora tenha acesso ao seu código.
3. Clique no botão verde **Create repository**.
4. Mantenha essa página aberta no navegador, pois usaremos o endereço dela adiante.

---

## 4. Criação e Configuração do Banco de Dados no Google Firebase

O Firebase é o serviço de nuvem do Google onde ficarão os seus alunos, formulários e workshops. O plano gratuito inicial é generoso e cobre as necessidades iniciais com sobra.

### Passo 4.1: Acessar e Criar o Projeto
1. Acesse o [Firebase Console](https://console.firebase.google.com) usando qualquer conta Google.
2. Clique no card grande **Adicionar projeto** (ou *Create a project*).
3. Dê um nome ao seu projeto (exemplo: `crm-minha-empresa`) e clique em **Continuar**.
4. Desative a opção do Google Analytics (não é necessária neste momento) e clique em **Criar projeto**.
5. Aguarde alguns segundos até a conclusão e clique em **Continuar**.

### Passo 4.2: Ativar o Sistema de Login (Authentication)
1. No menu lateral esquerdo, clique em **Criação** (Build) e depois em **Authentication**.
2. Clique no botão **Primeiros passos** (Get started).
3. Na lista de provedores de login, clique na opção **E-mail/senha**.
4. Ative a primeira chave: **Permitir que os usuários se inscrevam usando e-mail e senha**.
5. Clique em **Salvar**.

### Passo 4.3: Criar os Primeiros Usuários
Ainda na tela do Authentication, clique na aba **Users** (Usuários) no topo:
1. Clique no botão **Adicionar usuário** (Add user).
2. Crie o seu **Usuário Administrador** (o seu próprio e-mail pessoal/profissional e uma senha à sua escolha). Anote essas credenciais, pois elas serão usadas para entrar no painel.
3. Clique novamente em **Adicionar usuário** e crie o **Usuário Robô de Automação**:
   * E-mail: escolha algo como `robo@seudominio.com` ou `sistema@seudominio.com`.
   * Senha: crie uma senha forte e anote-a. O robô usará essa conta para processar os envios de e-mails em segundo plano.

### Passo 4.4: Criar o Banco de Dados (Firestore Database)
1. No menu lateral esquerdo, clique em **Firestore Database**.
2. Clique no botão **Criar banco de dados** (Create database).
3. Selecione a opção **Iniciar no modo de produção** (Start in production mode) e clique em **Avançar**.
4. No local do Cloud Firestore, escolha uma região próxima (ex: `southamerica-east1` em São Paulo ou `europe-west1` na Europa) e clique em **Ativar**.

### Passo 4.5: Obter as Chaves de Conexão Web
1. Clique no ícone de engrenagem no topo do menu lateral esquerdo e selecione **Configurações do projeto** (Project settings).
2. Na aba **Geral**, desça até o final da página na seção *Seus aplicativos*.
3. Clique no ícone de código web (`</>`).
4. Dê um apelido ao app (ex: `CRM Web`) e clique em **Registrar app**.
5. O Firebase exibirá um bloco de código contendo o objeto `firebaseConfig`. Copie os seguintes valores que aparecem entre aspas:
   * `apiKey`
   * `authDomain`
   * `projectId`
   * `storageBucket`
   * `messagingSenderId`
   * `appId`
6. Guarde esses valores em um bloco de notas. Eles alimentarão o arquivo de configuração do sistema.

---

## 5. Configuração de E-mails da Microsoft (Office 365 / Outlook)

Para que o CRM envie e-mails de confirmação, lembretes de workshop e listas de espera através do seu endereço da Microsoft, precisamos das permissões de disparo seguro.

### Parâmetros Padrão da Microsoft
* **Servidor (Host):** `smtp.office365.com`
* **Porta:** `587`
* **Criptografia:** STARTTLS (padrão)
* **Usuário:** o seu endereço de e-mail completo (ex: `contato@suaempresa.com`).

### Configuração de Segurança Obrigatória

#### Se você usa Microsoft 365 Corporativo (com domínio próprio):
1. O administrador de TI da empresa precisa acessar o **Centro de Administração do Microsoft 365**.
2. Ir em **Usuários** > **Usuários Ativos** > clicar sobre o usuário que fará os envios.
3. Na aba **E-mail**, clicar em **Gerenciar aplicativos de email**.
4. Marcar a caixa **SMTP autenticado** (Authenticated SMTP) e salvar. Isso autoriza o envio por sistemas externos.

#### Se a sua conta possui Verificação em Duas Etapas (MFA) ou for conta pessoal (@outlook/@hotmail):
Você não deve usar a sua senha comum de login do dia a dia, pois a Microsoft bloqueia acessos automáticos. É necessário gerar uma **Senha de Aplicativo**:
1. Acesse [account.microsoft.com/security](https://account.microsoft.com/security) com a sua conta.
2. Clique em **Opções de segurança avançadas**.
3. Na seção *Senhas de aplicativo*, clique em **Criar uma nova senha de aplicativo**.
4. Copie a senha gerada de 16 caracteres. É essa senha que usaremos na configuração.

---

## 6. Configurando o Projeto no seu Computador

Agora vamos juntar o código com as suas credenciais.

### Passo 6.1: Abrir o Projeto no VS Code
1. Abra o programa **VS Code**.
2. Vá no menu **File** (Arquivo) > **Open Folder** (Abrir Pasta) e selecione a pasta onde os arquivos do sistema estão guardados.

### Passo 6.2: Criar o Arquivo `.env`
1. Na lista de arquivos à esquerda no VS Code, localize o arquivo `.env.example`.
2. Clique com o botão direito sobre ele e selecione **Copy** (Copiar), depois clique com o botão direito e selecione **Paste** (Colar).
3. Renomeie esse novo arquivo exatamente para `.env` (com o ponto na frente e sem nada depois).
4. Abra o arquivo `.env` e preencha os campos com as informações que você guardou:
   * Cole as chaves do Firebase nos campos `VITE_FIREBASE_...`.
   * Preencha seu e-mail e a senha de aplicativo nos campos `SMTP_USER` e `SMTP_PASS`.
   * No campo `ROBOT_EMAIL` e `ROBOT_PASS`, coloque as credenciais da conta do robô criada no Passo 4.3.
   * No campo `CRON_SECRET`, digite qualquer sequência longa de letras e números aleatórios (ex: `crm_segredo_seguro_987654321`).
5. Salve o arquivo pressionando `Ctrl + S` (Windows) ou `Cmd + S` (Mac).

### Passo 6.3: Instalar as Bibliotecas
1. No menu superior do VS Code, clique em **Terminal** > **New Terminal**.
2. Uma barra preta de comando se abrirá na parte inferior da tela.
3. Digite o seguinte comando e aperte Enter:
   ```bash
   npm install
   ```
4. Aguarde de 1 a 2 minutos enquanto o computador baixa as bibliotecas necessárias. Quando terminar, uma mensagem de conclusão aparecerá.

### Passo 6.4: Testar Localmente
1. No mesmo terminal, digite o comando:
   ```bash
   npm run dev
   ```
2. O terminal exibirá um endereço como: `http://localhost:5173`.
3. Segure `Ctrl` (ou `Cmd`) e clique no link, ou abra seu navegador e digite esse endereço.
4. O site do seu sistema estará visível e funcionando no seu computador.

---

## 7. Publicação na Nuvem com a Vercel (Colocando o Sistema no Ar)

Para que você não precise deixar o computador ligado para o sistema funcionar, colocaremos ele na Vercel (que oferece hospedagem gratuita com certificado de segurança SSL e suporte a tarefas agendadas).

### Passo 7.1: Criar Conta na Vercel
1. Acesse [vercel.com](https://vercel.com).
2. Clique no botão **Sign Up** no canto superior direito.
3. Escolha a opção **Continue with GitHub**.
4. Autorize a conexão entre a Vercel e a conta GitHub que você criou no Passo 3.

### Passo 7.2: Importar o Projeto
1. Na página inicial da Vercel, clique no botão azul **Add New...** e selecione **Project**.
2. A lista com os seus repositórios do GitHub aparecerá. Localize o repositório do seu CRM e clique no botão **Import**.

### Passo 7.3: Cadastrar as Variáveis de Ambiente
Antes de clicar em publicar, você precisa fornecer à Vercel as mesmas variáveis do arquivo `.env`:
1. Na tela de configuração, clique para expandir a seção **Environment Variables**.
2. Adicione cada uma das variáveis do seu arquivo `.env`:
   * Digite o nome da variável (ex: `VITE_FIREBASE_API_KEY`) e cole o valor correspondente.
   * Clique em **Add**.
   * Repita o processo para todas as variáveis do `.env` (Firebase, SMTP e Robô).

### Passo 7.4: Concluir o Deploy
1. Clique no botão azul **Deploy**.
2. Aguarde cerca de 1 a 2 minutos enquanto a Vercel compila o sistema na nuvem.
3. Ao terminar, uma tela de comemoração aparecerá exibindo uma miniatura do seu site e o link oficial de acesso (terminado em `.vercel.app`).
4. Pronto. Seu sistema agora está oficialmente no ar na internet.

---

## 8. Primeiro Acesso Administrativo e Testes

Agora que o sistema está publicado, você precisa liberar o seu acesso de Administrador completo.

### Passo 8.1: Promover o seu Usuário a Administrador no Banco de Dados
Por padrão de segurança, qualquer usuário criado entra como aluno comum. Para se tornar Administrador geral:
1. Abra o [Firebase Console](https://console.firebase.google.com) e acesse o seu projeto.
2. No menu lateral, clique em **Firestore Database**.
3. Acesse a coleção chamada **`users`**.
4. Você verá o documento correspondente ao e-mail que você cadastrou no Passo 4.3.
5. Clique no documento, procure o campo chamado **`role`** (se não existir, clique em *Adicionar campo*):
   * Nome do campo: `role`
   * Tipo: `string`
   * Valor: `admin`
6. Salve a alteração.

### Passo 8.2: Acessar o Painel Administrativo
1. Acesse o link oficial do seu sistema no navegador (o link da Vercel ou `localhost:5173/admin`).
2. Faça o login com o seu e-mail e senha de administrador.
3. O painel completo do Micro CRM se abrirá.

### Passo 8.3: Testes de Validação Recomendados
1. **Criar um Workshop:**
   * Na aba de Workshops/Eventos, cadastre seu primeiro evento com data, local e total de vagas.
2. **Testar a Importação de Alunos:**
   * Vá até a aba de Alunos cadastrados.
   * Clique no botão **Importar Alunos**.
   * Clique no botão **Baixar Modelo .xlsx** para obter a planilha padrão com cabeçalhos formatados.
   * Preencha uma ou duas linhas com nomes e e-mails de teste.
   * Faça o upload da planilha, vincule ao workshop criado e clique em **Confirmar Importação**.
   * Os contatos aparecerão instantaneamente na sua lista e no banco de dados.

---

### Suporte e Dúvidas

Se você encontrar qualquer dificuldade em alguma das etapas (especialmente nas permissões de e-mail corporativo da Microsoft), consulte o administrador de rede da sua instituição com este manual em mãos ou entre em contato com nossa equipe técnica.
