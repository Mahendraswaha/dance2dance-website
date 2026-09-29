const fs = require('fs');
let c = fs.readFileSync('src/components/WorkshopWishlist.jsx', 'utf8');
c = c.replace("import { \nimport { toast } from 'sonner';", "import { toast } from 'sonner';\nimport { ");
c = c.replace("import { \r\nimport { toast } from 'sonner';", "import { toast } from 'sonner';\nimport { ");
fs.writeFileSync('src/components/WorkshopWishlist.jsx', c, 'utf8');
