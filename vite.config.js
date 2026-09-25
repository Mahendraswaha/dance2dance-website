import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        // Middleware para /api/contact e /api/agenda-notify
        server.middlewares.use('/api', async (req, res, next) => {
          if (req.url === '/contact' || req.url === '/agenda-notify') {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  req.body = body ? JSON.parse(body) : {};
                } catch (e) {
                  req.body = body;
                }
                res.status = function(code) {
                  this.statusCode = code;
                  return this;
                };
                res.json = function(data) {
                  this.setHeader('Content-Type', 'application/json');
                  this.end(JSON.stringify(data));
                  return this;
                };
                try {
                  const moduleName = req.url === '/contact' ? './api/contact.js' : './api/agenda-notify.js';
                  const { default: handler } = await import(moduleName);
                  await handler(req, res);
                } catch (err) {
                  console.error(\`Erro em /api\${req.url}:\`, err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            }
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    watch: {
      ignored: ['**/*.tmp', '**/~*']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
