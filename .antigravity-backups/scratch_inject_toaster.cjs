const fs = require('fs');

let appCode = fs.readFileSync('src/App.jsx', 'utf8');

// Inject Import
if (!appCode.includes('import { Toaster } from')) {
  appCode = appCode.replace(
    "import AnalyticsTracker from './components/AnalyticsTracker';",
    "import AnalyticsTracker from './components/AnalyticsTracker';\nimport { Toaster } from 'sonner';"
  );
}

// Inject Component with Dark Premium Styling
if (!appCode.includes('<Toaster')) {
  const toasterConfig = `
        <Toaster 
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid #333',
              color: '#F0EDE8',
              fontFamily: 'Inter, sans-serif'
            },
            className: 'font-heading text-sm font-light uppercase tracking-wider',
          }}
        />`;

  appCode = appCode.replace(
    "<AnalyticsTracker />",
    "<AnalyticsTracker />" + toasterConfig
  );
}

fs.writeFileSync('src/App.jsx', appCode, 'utf8');
console.log('Injected Toaster into App.jsx');
