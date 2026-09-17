import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/authRoutes';
import { orgRouter } from './server/routes/orgRoutes';
import { cyberDataRouter } from './server/routes/cyberDataRoutes';
import { quantificationRouter } from './server/routes/quantificationRoutes';
import { aiRouter } from './server/routes/aiRoutes';
import { testRouter } from './server/routes/testRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CYBERRISKIQ Backend Security Engine',
      timestamp: new Date().toISOString(),
      architecture: 'Multi-Tenant RBAC & FAIR Actuarial Modeling',
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/organization', orgRouter);
  app.use('/api/data', cyberDataRouter);
  app.use('/api/quantification', quantificationRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/test', testRouter);

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CYBERRISKIQ Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
