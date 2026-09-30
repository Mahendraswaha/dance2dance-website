const fs = require('fs');
let code = fs.readFileSync('src/components/admin/CommunicationsTab.jsx', 'utf8');

// Add import
if (!code.includes("import RichTextEditor")) {
    code = code.replace(
        "import { toast } from 'sonner';", 
        "import { toast } from 'sonner';\nimport RichTextEditor from './RichTextEditor';"
    );
}

// Replace textarea with RichTextEditor
code = code.replace(
    /<textarea\s*value=\{bodyHtml\}\s*onChange=\{\(e\) => setBodyHtml\(e\.target\.value\)\}\s*rows=\{12\}\s*className="[^"]*"\s*\/>/,
    "<RichTextEditor value={bodyHtml} onChange={setBodyHtml} />"
);

fs.writeFileSync('src/components/admin/CommunicationsTab.jsx', code);
