const fs = require('fs');

let appCode = fs.readFileSync('src/App.jsx', 'utf8');

// Inject Import
if (!appCode.includes('import AnalyticsTracker')) {
  appCode = appCode.replace(
    "import ScrollToTop from './components/ScrollToTop';",
    "import ScrollToTop from './components/ScrollToTop';\nimport AnalyticsTracker from './components/AnalyticsTracker';"
  );
}

// Inject Component
if (!appCode.includes('<AnalyticsTracker />')) {
  appCode = appCode.replace(
    "<ScrollToTop />",
    "<ScrollToTop />\n        <AnalyticsTracker />"
  );
}

fs.writeFileSync('src/App.jsx', appCode, 'utf8');
console.log('Injected AnalyticsTracker into App.jsx');
