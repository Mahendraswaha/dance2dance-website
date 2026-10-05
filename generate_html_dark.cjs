const fs = require('fs');
const marked = require('marked');

const mdPath = 'C:\\Users\\rmm99\\.gemini\\antigravity\\brain\\5a33816a-31e4-4322-b474-a139436be4f9\\dance2dance-growth-strategy.md';
const mdContent = fs.readFileSync(mdPath, 'utf8');

const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estratégia Integrada Dance2Dance</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0A0A0E;
            color: #FAF8F5;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }
        h1, h2, h3, h4 {
            font-family: Georgia, 'Times New Roman', serif;
            color: #C9A84C;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 {
            font-size: 2.5em;
            border-bottom: 2px solid rgba(201, 168, 76, 0.2);
            padding-bottom: 10px;
            text-align: center;
        }
        h2 {
            font-size: 1.8em;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 5px;
        }
        h3 {
            font-size: 1.4em;
        }
        p, li {
            font-size: 15px;
        }
        blockquote {
            border-left: 4px solid #C9A84C;
            background: #111116;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        th, td {
            border: 1px solid #222222;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #15151A;
            color: #C9A84C;
            font-weight: bold;
        }
        td {
            background-color: #0D0D12;
        }
        .mermaid {
            background: #111116;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        /* Para o PDF sair com fundo preto, a regra print deve manter as cores */
        @media print {
            body {
                padding: 0;
                max-width: 100%;
                background-color: #0A0A0E !important;
                color: #FAF8F5 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div id="content">${marked.parse(mdContent.replace(/\[!IMPORTANT\]/g, '**IMPORTANTE:**<br>').replace(/\[!TIP\]/g, '**DICA:**<br>').replace(/\[!NOTE\]/g, '**NOTA:**<br>'))}</div>

    <script>
        document.querySelectorAll('code.language-mermaid').forEach(el => {
            const pre = el.parentElement;
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = el.textContent;
            pre.replaceWith(div);
        });
        // Configurando o Mermaid para usar o tema 'dark'
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    </script>
</body>
</html>
`;

fs.writeFileSync('C:\\Renas\\Dance2Dance\\Estrategia\\Estrategia_Dance2Dance_Dark.html', htmlContent);
console.log('HTML Dark saved.');
