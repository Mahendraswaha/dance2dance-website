const fs = require('fs');

let html = fs.readFileSync('public/pitch-deck.html', 'utf-8');

// --- 0. Fix Title (For PDF filename) ---
html = html.replace('<title>Dance2Dance</title>', '<title>Dance2Dance_PitchDeck_2026</title>');

// --- 1. Font Fixes ---
html = html.replace('--font-heading: Georgia, \'Times New Roman\', serif;', '--font-heading: Georgia, \'Times New Roman\', serif;\n            --font-batang: Batang, \'Times New Roman\', serif;');

// --- 2. Print CSS (Replace entirely!) ---
const oldPrintCssRegex = /\/\* Print optimization \*\/[\s\S]*?<\/style>/;
const newPrintCss = `/* Print optimization */
        .no-print { display: inline-block; }
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            .no-print { display: none !important; }
            .lang-switcher { display: none !important; }
            @page {
                size: 297mm 210mm; /* A4 Landscape */
                margin: 0;
            }
            body {
                margin: 0;
            }
            section {
                page-break-after: always;
                page-break-inside: avoid;
                width: 297mm;
                height: 210mm;
                min-height: 210mm;
                padding: 15mm 20mm;
                margin: 0;
                overflow: hidden;
                box-sizing: border-box;
                position: relative;
            }
            /* Dark background fill for Chrome PDF */
            section::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #0A0A0E !important;
                z-index: -1;
            }
        }
    </style>`;
html = html.replace(oldPrintCssRegex, newPrintCss);

// --- 3. Slide 3 (About Us - Batang Font matching Print 2) ---
const slide3start = html.indexOf('<!-- SLIDE 03');
const slide3end = html.indexOf('<!-- SLIDE 04');
let slide3 = html.substring(slide3start, slide3end);
slide3 = slide3.replace(/<span class="lang-en">Dance2Dance<\/span>/, '<span class="lang-en" style="font-family: var(--font-batang);">Dance<span style="color: var(--accent-color);">2</span>Dance</span>');
slide3 = slide3.replace(/<span class="lang-pt">Dance2Dance<\/span>/, '<span class="lang-pt" style="font-family: var(--font-batang);">Dance<span style="color: var(--accent-color);">2</span>Dance</span>');
slide3 = slide3.replace(/<span class="lang-no">Dance2Dance<\/span>/, '<span class="lang-no" style="font-family: var(--font-batang);">Dance<span style="color: var(--accent-color);">2</span>Dance</span>');
slide3 = slide3.replace('cv-3.jpg', 'cv-5.jpg');
html = html.substring(0, slide3start) + slide3 + html.substring(slide3end);

// --- 4. Slide 4 (Biostretch Logo) ---
const slide4start = html.indexOf('<!-- SLIDE 04');
const slide4end = html.indexOf('<!-- SLIDE 05');
let slide4 = html.substring(slide4start, slide4end);
slide4 = slide4.replace('<img src="/logo-biostretch.png" alt="Biostretch" style="max-width: 100%; max-height: 100%; object-fit: contain;">', 
                       '<img src="/logo-biostretch.png" alt="Biostretch" style="max-height: 40px; max-width: 100%; object-fit: contain; object-position: left bottom;">');
slide4 = slide4.replace('<img src="/logo-bethedance.png" alt="Be The Dance" style="max-width: 100%; max-height: 100%; object-fit: contain;">',
                       '<img src="/logo-bethedance.png" alt="Be The Dance" style="max-height: 100%; max-width: 100%; object-fit: contain; object-position: left bottom;">');
slide4 = slide4.replace('<img src="/logo-kroppsskole.png" alt="Kroppsskole" style="max-width: 100%; max-height: 100%; object-fit: contain;">',
                       '<img src="/logo-kroppsskole.png" alt="Kroppsskole" style="max-height: 100%; max-width: 100%; object-fit: contain; object-position: left bottom;">');
html = html.substring(0, slide4start) + slide4 + html.substring(slide4end);

// --- 5. Slide 5 (Reduce Titles) ---
const slide5start = html.indexOf('<!-- SLIDE 05');
const slide5end = html.indexOf('<!-- SLIDE 06');
let slide5 = html.substring(slide5start, slide5end);
slide5 = slide5.replace(/font-size:2rem;/g, 'font-size:1.5rem;');
slide5 = slide5.replace(/margin-bottom: 40px;/g, 'margin-bottom: 24px;');
slide5 = slide5.replace(/<div class="card" style="text-align: center;">/g, '<div class="card" style="text-align: center; padding: 24px;">');
html = html.substring(0, slide5start) + slide5 + html.substring(slide5end);

// --- 6. Slide 6 (Adjust padding to fit page) ---
const slide6start = html.indexOf('<!-- SLIDE 06');
const slide6end = html.indexOf('<!-- SLIDE 07');
let slide6 = html.substring(slide6start, slide6end);
slide6 = slide6.replace(/padding: 40px 24px;/g, 'padding: 24px 16px;');
slide6 = slide6.replace(/margin-bottom: 24px;/g, 'margin-bottom: 16px;');
slide6 = slide6.replace(/margin: 24px 0;/g, 'margin: 12px 0;');
html = html.substring(0, slide6start) + slide6 + html.substring(slide6end);

// --- 7. Slide 10 (PDF Button) ---
const slide10start = html.indexOf('<!-- SLIDE 10');
const ctaButtonsIndex = html.indexOf('<div class="cta-buttons">', slide10start);
if (ctaButtonsIndex > -1) {
    const endCta = html.indexOf('</div>', ctaButtonsIndex);
    const newBtn = `
                <button onclick="window.print()" class="btn btn-secondary no-print" style="cursor: pointer; font-family: inherit; font-size: 1rem; border-color: var(--accent-color); color: var(--accent-color);">
                    <span class="lang-en">Save as PDF</span>
                    <span class="lang-pt">Salvar como PDF</span>
                    <span class="lang-no">Lagre som PDF</span>
                </button>`;
    html = html.substring(0, endCta) + newBtn + '\n            ' + html.substring(endCta);
}

fs.writeFileSync('public/pitch-deck.html', html, 'utf-8');
