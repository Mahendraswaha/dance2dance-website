const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const newLazyWithRetries = `function lazyWithRetries(componentImport) {
  return lazy(async () => {
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk_force_reloaded');
      return component;
    } catch (error) {
      console.warn('Network hiccup detected loading chunk. Retrying in 1.5s...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      try {
        const component = await componentImport();
        sessionStorage.removeItem('chunk_force_reloaded');
        return component;
      } catch (error2) {
        console.warn('Second attempt failed. Retrying in 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
          const component = await componentImport();
          sessionStorage.removeItem('chunk_force_reloaded');
          return component;
        } catch (error3) {
          if (!sessionStorage.getItem('chunk_force_reloaded')) {
            sessionStorage.setItem('chunk_force_reloaded', 'true');
            window.location.reload();
          }
          throw error3;
        }
      }
    }
  });
}`;

const oldLazyRegex = /function lazyWithRetries\(componentImport\) \{[\s\S]*?\}\s*\n\s*\}\);\s*\n\}/m;

content = content.replace(oldLazyRegex, newLazyWithRetries);

fs.writeFileSync('src/App.jsx', content);
