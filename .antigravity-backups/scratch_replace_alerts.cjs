const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (content.includes('alert(')) {
    // Inject import if needed
    if (!content.includes('import { toast } from')) {
      // Find the last import statement
      const importRegex = /import .*?;?\n/g;
      let lastIndex = 0;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastIndex = match.index + match[0].length;
      }
      content = content.slice(0, lastIndex) + "import { toast } from 'sonner';\n" + content.slice(lastIndex);
    }

    // Replace alert(x) with toast(x) or toast.error(x)
    content = content.replace(/alert\((.*?)\);/g, (match, p1) => {
      const lower = p1.toLowerCase();
      if (lower.includes('erro') || lower.includes('error')) {
        return `toast.error(${p1});`;
      } else {
        return `toast.success(${p1});`;
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Processed:', filePath);
    }
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.jsx')) {
      processFile(filePath);
    }
  }
}

walk('src');
