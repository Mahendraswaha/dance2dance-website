const fs = require('fs');
let manifest = fs.readFileSync('PROJECT_MANIFEST.md', 'utf8');

const singleTenantRule = `
* **Arquitetura Single Tenant (Isolamento de Instâncias):** 
  * O Micro CRM NÃO será Multi-tenant (um bancão de dados gigante misturando todos os clientes com \`tenant_id\`). 
  * O modelo será **Single Tenant**. Cada cliente futuro do SaaS terá seu próprio projeto Firebase / Banco de Dados isolado. 
  * Benefícios: Segurança máxima de dados, zero risco de vazamento entre clientes, performance garantida (sem "noisy neighbors") e posicionamento de produto Premium. Todo o código do backend deve ser escrito assumindo que o banco de dados pertence a **um único cliente**.
`;

manifest = manifest.replace(
  "* **Nada de CRMs externos definitivos:** Ferramentas de prateleira só devem ser cogitadas se formos utilizá-las estritamente como *API de disparo* (motores \"burros\"). O **cérebro** das regras de negócio (Lead Scoring, Funis, Tags, Inteligência) será totalmente construído por nós mesmos dentro do nosso ecossistema para compor o SaaS.",
  "* **Nada de CRMs externos definitivos:** Ferramentas de prateleira só devem ser cogitadas se formos utilizá-las estritamente como *API de disparo* (motores \"burros\"). O **cérebro** das regras de negócio (Lead Scoring, Funis, Tags, Inteligência) será totalmente construído por nós mesmos dentro do nosso ecossistema para compor o SaaS." + singleTenantRule
);

fs.writeFileSync('PROJECT_MANIFEST.md', manifest, 'utf8');
console.log('Manifest updated with Single Tenant rule.');
