import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json());
  
  // Webhook for LipaNa
  app.post('/api/webhook/lipana', (req, res) => {
    console.log('LipaNa webhook payload:', req.body);
    // Ideally update Firebase here with firebase-admin
    res.status(200).send('OK');
  });

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Fallback for non-GET requests failing in dev mode SPA
    app.use((req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      if (req.method !== 'GET') {
          return res.redirect(303, req.originalUrl);
      }
      next();
    });
  } else {
    // In production, server.cjs is in dist/, so __dirname is dist/
    const distPath = __dirname;
    app.use(express.static(distPath));
    
    // Convert POST navigations from payment gateways to GET
    app.post('*', (req, res) => {
      res.redirect(303, req.originalUrl);
    });

    // SPA Fallback for all other GET methods
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
