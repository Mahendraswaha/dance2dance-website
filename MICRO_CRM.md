
## 6. Acesso Administrativo e Tratamento de Exceções Especiais
* **Bypass de Validação de E-mail (Overrides):** Por lidarmos com um público mais idoso que muitas vezes tem dificuldade técnica com confirmação de links, o painel ADMIN (UserDetailModal) possui um botão para "Validar E-mail Manualmente". Ele salva a flag emailVerifiedOverride: true no Firebase, permitindo que a pessoa compre workshops.
* **Edição de Perfil (Prioridade de Campos):** O campo Bairro (
eighborhood) é crucial para a segmentação social (projetos em Tøyen/Grønland) e deve estar obrigatoriamente presente na tela de edição do painel de Admin (UserDetailModal), junto com nome, data de nascimento e telefone.
* **Exclusão de Usuário:** Administradores têm permissão de deletar registros pelo front-end (usando deleteDoc em vez de inativar ou acionar cloud functions), pois a irestore.rules possui a condição isAdmin() configurada com liberação de escrita total (write).
* **Selos Visuais de Validação:** Na tela principal (RegisteredUsersManager.jsx), deve-se exibir um Check Verde para validados e um selo vermelho "NÃO VALIDADO" para facilitar o suporte rápido.
