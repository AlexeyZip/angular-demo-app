import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'node:http';
import { performance } from 'node:perf_hooks';
import { WebSocketServer } from 'ws';
import { overview } from './controllers/analytics-controller.mjs';
import { getInsights, getSummary } from './controllers/dashboard-controller.mjs';
import { scenario } from './controllers/planning-controller.mjs';
import {
  details,
  getDraft,
  getTemplate,
  list,
  publish,
  saveDraft,
  validateCode,
} from './controllers/project-controller.mjs';
import { getPollingSnapshot, streamEvents } from './controllers/realtime-controller.mjs';
import { getCsrfToken } from './controllers/security-controller.mjs';
import { getUsers } from './controllers/users-controller.mjs';
import { csrfProtection } from './security/csrf.mjs';
import { sanitizeDeep } from './security/sanitize.mjs';

const app = express();
const port = process.env.PORT ?? 3000;
const allowedOrigins = new Set(['http://localhost:9876', 'http://localhost:4200']);

function withTracing(name, handler) {
  return (req, res, next) => {
    const started = performance.now();
    const tracedRes = new Proxy(res, {
      get(target, prop, receiver) {
        if (prop === 'json') {
          return (payload) => {
            const elapsed = Math.round(performance.now() - started);
            console.info(`[trace] ${name} ${req.method} ${req.path} ${elapsed}ms`);
            return target.json(payload);
          };
        }
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      },
    });
    return handler(req, tracedRes, next);
  };
}

app.disable('x-powered-by');
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'ws://localhost:3000', 'http://localhost:3000'],
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS blocked'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Request-Id'],
    credentials: true,
    maxAge: 600,
  }),
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeDeep(req.body);
  }
  next();
});
app.use(csrfProtection);

app.get('/api/security/csrf-token', withTracing('security.csrf', getCsrfToken));
app.get('/api/dashboard/summary', withTracing('dashboard.summary', getSummary));
app.get('/api/dashboard/insights', withTracing('dashboard.insights', getInsights));
app.get('/api/users', withTracing('users.list', getUsers));
app.get('/api/analytics/overview', withTracing('analytics.overview', overview));
app.get('/api/projects/template', withTracing('projects.template', getTemplate));
app.get('/api/projects/draft', withTracing('projects.draft', getDraft));
app.get('/api/projects', withTracing('projects.list', list));
app.get('/api/projects/:id', withTracing('projects.details', details));
app.get('/api/planning/scenario', withTracing('planning.scenario', scenario));
app.post('/api/projects/validate-code', withTracing('projects.validateCode', validateCode));
app.post('/api/projects/save-draft', withTracing('projects.saveDraft', saveDraft));
app.post('/api/projects/publish', withTracing('projects.publish', publish));
app.get('/api/realtime/poll', withTracing('realtime.poll', getPollingSnapshot));
app.get('/api/realtime/events', withTracing('realtime.sse', streamEvents));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({ noServer: true });
let wsCounter = 0;

wsServer.on('connection', (socket) => {
  const timer = setInterval(() => {
    wsCounter += 1;
    socket.send(
      JSON.stringify({
        source: 'websocket',
        sequence: wsCounter,
        throughput: 120 + (wsCounter % 6) * 14,
        at: new Date().toISOString(),
      }),
    );
  }, 2500);

  socket.on('close', () => {
    clearInterval(timer);
  });
});

httpServer.on('upgrade', (request, socket, head) => {
  if (request.url === '/ws/metrics') {
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    });
    return;
  }
  socket.destroy();
});

httpServer.listen(port, () => {
  console.log(`API (MVC) listening on http://localhost:${port}`);
});

function shutdown() {
  wsServer.clients.forEach((client) => client.close());
  wsServer.close();
  httpServer.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
