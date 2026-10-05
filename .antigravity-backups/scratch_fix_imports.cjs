const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

// The line currently ends with:
//   GraduationCap, Download, Trash2
// } from 'lucide-react';

code = code.replace(
  "GraduationCap, Download, Trash2",
  "GraduationCap, Download, Trash2, TriangleAlert"
);

// Fallback if Trash2 isn't exactly there like that
if (!code.includes('TriangleAlert')) {
  code = code.replace(
    "Trash2\n} from 'lucide-react';",
    "Trash2, TriangleAlert\n} from 'lucide-react';"
  );
}

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Fixed missing Lucide import');
