const fs = require('fs');

let manifest = fs.readFileSync('PROJECT_MANIFEST.md', 'utf8');

const newSection = `
## 5. A Visão do Produto (Micro CRM SaaS)
**MANDATO CRÍTICO:** O Dance2Dance NÃO é apenas um site. Ele é o "Cliente Zero" e o Case de Sucesso (laboratório) para a construção do nosso próprio produto: um **Micro CRM SaaS**.
Toda a arquitetura de backend, captação de leads, e-mails, listas de espera e inteligência de marketing que estamos construindo aqui deve ser pensada para ser **desacoplada e vendida como um serviço independente no futuro**.

* **A Separação:**
  * **Frontend (Dance2Dance):** O site React atual que atende os alunos.
  * **Backend (O Micro CRM SaaS):** O motor de gestão de clientes, automações e disparo de e-mails (usando o servidor Pro ISP) que estamos construindo no Firebase. 
* **Regra de Desenvolvimento:** Sempre que criarmos uma funcionalidade de gestão de alunos, automação ou marketing, a IA deve perguntar e refletir: *"Como construo isso de forma modular para que amanhã possamos extrair esse código, colocar outra marca e vender como um software para outras escolas/organizações?"*
* **Nada de CRMs externos definitivos:** Ferramentas de prateleira só devem ser cogitadas se formos utilizá-las estritamente como *API de disparo* (motores "burros"). O **cérebro** das regras de negócio (Lead Scoring, Funis, Tags, Inteligência) será totalmente construído por nós mesmos dentro do nosso ecossistema para compor o SaaS.
`;

manifest = manifest.replace("## 5. Regras de Fluxo e Lógica", newSection + "\n## 6. Regras de Fluxo e Lógica");

fs.writeFileSync('PROJECT_MANIFEST.md', manifest, 'utf8');
console.log('Manifest updated with Micro CRM SaaS vision.');
