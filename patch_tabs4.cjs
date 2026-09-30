const fs = require('fs');
let code = fs.readFileSync('src/components/admin/CommunicationsTab.jsx', 'utf8');

// Replace textarea with RichTextEditor
code = code.replace(
    /<textarea[\s\S]*?value=\{bodyHtml\}[\s\S]*?onChange=\{\(e\) => setBodyHtml\(e\.target\.value\)\}[\s\S]*?disabled=\{\!isEditing\}[\s\S]*?\/>/,
    "{isEditing ? <RichTextEditor value={bodyHtml} onChange={setBodyHtml} /> : <div className=\"prose prose-invert prose-sm max-w-none min-h-[300px] p-6 border border-[#222222] rounded bg-[#0A0A0E] text-zinc-300\" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}"
);

fs.writeFileSync('src/components/admin/CommunicationsTab.jsx', code);
