const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const mdPath = 'C:\\Users\\rmm99\\.gemini\\antigravity\\brain\\5a33816a-31e4-4322-b474-a139436be4f9\\dance2dance-growth-strategy.md';
const mdContent = fs.readFileSync(mdPath, 'utf8');

const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estratégia de Crescimento Dance2Dance</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {
            --bg-color: #0A0A0E;
            --text-color: #FAF8F5;
            --accent-color: #C9A84C;
            --secondary-bg: #111116;
            --border-color: rgba(201, 168, 76, 0.2);
            --table-border: #222222;
            --table-bg: #0D0D12;
            --table-header-bg: #15151A;
        }
        @media print {
            :root {
                --bg-color: #FFFFFF;
                --text-color: #111111;
                --accent-color: #9C7C2F;
                --secondary-bg: #F5F5F5;
                --border-color: #DDDDDD;
                --table-border: #CCCCCC;
                --table-bg: #FFFFFF;
                --table-header-bg: #EEEEEE;
            }
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .page-break {
                page-break-before: always;
            }
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
            padding: 40px 60px;
            font-size: 14px;
        }
        h1, h2, h3, h4 {
            font-family: Georgia, 'Times New Roman', serif;
            color: var(--accent-color);
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 {
            font-size: 2.2em;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 10px;
            text-align: center;
        }
        h2 {
            font-size: 1.6em;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 5px;
        }
        p {
            margin-bottom: 1.2em;
        }
        strong {
            color: var(--accent-color);
        }
        blockquote {
            border-left: 4px solid var(--accent-color);
            background: var(--secondary-bg);
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
        }
        th, td {
            border: 1px solid var(--table-border);
            padding: 10px 12px;
            text-align: left;
        }
        th {
            background-color: var(--table-header-bg);
            color: var(--accent-color);
            font-weight: bold;
        }
        td {
            background-color: var(--table-bg);
        }
        .mermaid {
            background: var(--secondary-bg);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="content"></div>

    <script>
        const rawMd = \`${mdContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
        
        // Custom renderer to wrap mermaid code blocks
        const renderer = new marked.Renderer();
        const originalCode = renderer.code.bind(renderer);
        renderer.code = function(code, language, isEscaped) {
            if (language === 'mermaid') {
                return '<div class="mermaid">' + code + '</div>';
            }
            return originalCode(code, language, isEscaped);
        };
        
        // Custom blockquote to catch GitHub alerts like [!IMPORTANT]
        const originalBlockquote = renderer.blockquote.bind(renderer);
        renderer.blockquote = function(quote) {
            let processed = quote;
            processed = processed.replace(/\\[!IMPORTANT\\]/g, '<strong>IMPORTANTE:</strong><br>');
            processed = processed.replace(/\\[!TIP\\]/g, '<strong>DICA:</strong><br>');
            processed = processed.replace(/\\[!NOTE\\]/g, '<strong>NOTA:</strong><br>');
            return originalBlockquote(processed);
        };

        marked.setOptions({ renderer });
        document.getElementById('content').innerHTML = marked.parse(rawMd);
        
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>
`;

fs.writeFileSync('temp.html', htmlContent);

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Load local HTML file
    const fileUrl = 'file://' + path.resolve('temp.html');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    
    // Just wait fixed time for mermaid to initialize and render
    await new Promise(r => setTimeout(r, 4000));
    
    // Generate PDF
    const pdfPath = 'C:\\Users\\rmm99\\.gemini\\antigravity\\brain\\5a33816a-31e4-4322-b474-a139436be4f9\\Estrategia_Dance2Dance.pdf';
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    });
    
    await browser.close();
    console.log('PDF generated at ' + pdfPath);
})();
