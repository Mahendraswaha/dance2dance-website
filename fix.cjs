const fs = require('fs');
let lines = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('adminPage.tabUpcoming')) {
        lines[i+1] = '                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${';
        lines[i+2] = '                    adminTab === \'upcoming\' ? \'bg-primary/20 text-primary font-bold\' : \'bg-[#222222] text-[#CFCFCF]\'\n                  }`}>';
        lines[i+3] = '';
    }
    if (lines[i].includes('adminPage.tabPast')) {
        lines[i+1] = '                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${';
        lines[i+2] = '                    adminTab === \'past\' ? \'bg-primary/20 text-primary font-bold\' : \'bg-[#222222] text-[#CFCFCF]\'\n                  }`}>';
        lines[i+3] = '';
    }
}
fs.writeFileSync('src/pages/AdminDashboard.jsx', lines.join('\n'));
