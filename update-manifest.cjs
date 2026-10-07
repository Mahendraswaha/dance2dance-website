const fs = require('fs');

let content = fs.readFileSync('PROJECT_MANIFEST.md', 'utf8');

const targetStr = "**A REGRA DE OURO (Tríade e Planilha):**\r\nToda e qualquer alteração textual no site, banco de dados ou e-mails DEVE sempre ser pensada para os 3 idiomas simultaneamente (Português, Inglês e Norueguês). Após aplicar as alterações no código, a IA ou o Desenvolvedor DEVE OBRIGATORIAMENTE atualizar a planilha local `C:\\Renas\\Antigravity\\Dance2Dance_Traducoes_Revisao.xlsx`, adicionando ou alterando as chaves correspondentes, respeitando rigorosamente o formato de colunas existente.";

// Let's do a more permissive search if newlines differ
const index = content.indexOf("A REGRA DE OURO");
if (index !== -1) {
  const endIndex = content.indexOf("* **Evite Calques (Tradu", index);
  if (endIndex !== -1) {
    const oldBlock = content.substring(index - 2, endIndex);
    
    const newRule = `**A REGRA DE OURO (Tríade e Planilha):**
Toda e qualquer alteração textual no site, banco de dados ou e-mails DEVE sempre ser pensada para os 3 idiomas simultaneamente (Português, Inglês e Norueguês). Após aplicar as alterações no código, a IA ou o Desenvolvedor DEVE OBRIGATORIAMENTE atualizar a planilha local \`C:\\Renas\\Antigravity\\Dance2Dance_Traducoes_Revisao.xlsx\`, adicionando ou alterando as chaves correspondentes.

**⚠️ REGRA CRÍTICA DE FORMATAÇÃO DA PLANILHA:**
A planilha possui uma formatação avançada (cabeçalhos coloridos, painéis congelados, auto-filtros, larguras dinâmicas, wrap text, e zebra striping). É **ESTRITAMENTE PROIBIDO** utilizar bibliotecas como \`pandas.to_excel\` para sobrescrever a planilha, pois isso destrói a formatação. Todas as sincronizações automatizadas DEVEM ser feitas utilizando a biblioteca \`openpyxl\`, atualizando **APENAS OS VALORES DAS CÉLULAS** (\`cell.value\`) e iterando pelas linhas para preservar a estética e funcionalidade visual da planilha intactas.

`;
    content = content.replace(oldBlock, newRule);
    fs.writeFileSync('PROJECT_MANIFEST.md', content, 'utf8');
    console.log('Manifest updated successfully.');
  } else {
    console.log('Could not find endIndex.');
  }
} else {
  console.log('Could not find A REGRA DE OURO.');
}
