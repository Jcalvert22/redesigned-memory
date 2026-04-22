```
import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();

// Serve Supabase public config to the browser.
// The anon key is designed to be public — RLS is the security layer.
// Route must be registered before express.static so it is not shadowed.
app.get('/api/config', (req, res) => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res.status(503).json({ error: 'SUPABASE_URL / SUPABASE_ANON_KEY not set on server.' });
  }
  res.json({ SUPABASE_URL: url, SUPABASE_ANON_KEY: key });
});

app.use(express.static(join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

# Code Review — `app.mjs` Written by Claude AI

> Express server · Reviewed 2026-04-22

## Summary

| Severity | Count |
|----------|-------|
| 🔴 High | 2 |
| 🟡 Medium | 2 |
| 🟢 Low / Info | 3 |
| **Overall** | **C+** |

---

## Findings

### 🔴 HIGH — Static serving exposes server source files
**Category:** Security

**Problem:** `express.static(join(__dirname))` serves the entire project root — including `server.js`, `.env` files, and `node_modules`. An attacker can simply `GET /server.js` to read your source code and secrets.

**Fix:**
```js
// ❌ Dangerous — serves everything including server.js
app.use(express.static(join(__dirname)));

// ✅ Safe — serve only a dedicated public/ folder
app.use(express.static(join(__dirname, 'public')));
```

**Recommendation:** Create a `public/` subdirectory for browser assets and point `express.static` at that path only.

---

### 🔴 HIGH — No CORS policy on `/api/config`
**Category:** Security

**Problem:** Any website can call `/api/config` with a cross-origin fetch and receive your Supabase URL and anon key. While the anon key is designed to be public, the endpoint is still an unnecessary fingerprinting target and should be restricted to your own origin(s).

**Fix:**
```js
import cors from 'cors';

app.use('/api/config', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? []
}));
```

**Recommendation:** Use the `cors` package with an explicit allowlist. Set `ALLOWED_ORIGINS` to your production domain(s) in the environment.

---

### 🟡 MEDIUM — No rate limiting on the config endpoint
**Category:** Reliability

**Problem:** Without rate limiting, `/api/config` can be hammered in a tight loop by bots or malicious scripts. Even though the response is cheap, it contributes to server load and makes scraping trivial.

**Fix:**
```js
import rateLimit from 'express-rate-limit';

const configLimiter = rateLimit({ windowMs: 60_000, max: 30 });
app.get('/api/config', configLimiter, (req, res) => { ... });
```

**Recommendation:** `express-rate-limit` is a zero-config drop-in. 30 requests/minute per IP is a reasonable starting point.

---

### 🟡 MEDIUM — Missing security headers
**Category:** Security

**Problem:** The server sends no `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Strict-Transport-Security` headers. Browsers are left with permissive defaults, leaving users exposed to clickjacking and MIME sniffing attacks.

**Fix:**
```js
import helmet from 'helmet';

app.use(helmet()); // sets 14 security headers in one line
```

**Recommendation:** `helmet` is the de facto standard for Express apps and is a single line to add.

---

### 🟢 LOW — No graceful shutdown handling
**Category:** Reliability

**Problem:** The server exits abruptly on `SIGTERM` (e.g. container stop, PM2 restart). In-flight requests are dropped and open connections are not drained, causing errors for users during deployments.

**Fix:**
```js
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
```

**Recommendation:** Capture the return value of `listen()` and close it on `SIGTERM`/`SIGINT` before exiting.

---

### 🟢 LOW — `PORT` env var not validated
**Category:** Best Practice

**Problem:** `process.env.PORT` is used as-is without checking it's a valid integer. An invalid value (e.g. `PORT=abc`) causes a silent failure or a cryptic Node error rather than an actionable startup message.

**Fix:**
```js
const PORT = parseInt(process.env.PORT ?? '3000', 10);
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('Invalid PORT env var');
  process.exit(1);
}
```

**Recommendation:** Parse and validate the port before passing it to `listen()`.

---

### 🔵 INFO — Consider structured logging
**Category:** Observability

**Problem:** `console.log` is fine for local dev, but in production you want structured JSON logs with timestamps and log levels so that log aggregators (Datadog, Grafana, CloudWatch) can filter and alert on them.

**Fix:**
```js
import pino from 'pino';
const logger = pino();

app.listen(PORT, () =>
  logger.info({ port: PORT }, 'Server started')
);
```

**Recommendation:** `pino` is a low-overhead structured logger. `pino-http` adds per-request logging with minimal config.
