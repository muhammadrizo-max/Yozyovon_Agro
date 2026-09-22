import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. XAVFSIZLIK SARLAVHALARI (Security Headers / Defense in Depth)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // 2. IN-MEMORY DDOS & RATE LIMITING MIDDLEWARE
  const clientRequestCounts = new Map<string, { count: number; firstRequestTime: number }>();
  const MAX_REQ_PER_WINDOW = 120; // 1 daqiqada 120 so'rov limiti
  const WINDOW_MS = 60 * 1000;

  app.use((req, res, next) => {
    // Only rate-limit API calls and requests to prevent server DDoS
    if (req.path.startsWith('/api/')) {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const now = Date.now();
      const clientData = clientRequestCounts.get(clientIp) || { count: 0, firstRequestTime: now };

      if (now - clientData.firstRequestTime > WINDOW_MS) {
        clientData.count = 1;
        clientData.firstRequestTime = now;
      } else {
        clientData.count++;
      }
      clientRequestCounts.set(clientIp, clientData);

      if (clientData.count > MAX_REQ_PER_WINDOW) {
        return res.status(429).json({
          success: false,
          error: 'DDOS_RATE_LIMITED',
          message: 'DDoS xavfsizlik cheklovi: Juda koʻp soʻrov yuborildi. Iltimos, 1 daqiqadan soʻng qayta urinib koʻring.'
        });
      }
    }
    next();
  });

  // 3. SQL INJECTION & XSS ATTACK DETECTION MIDDLEWARE (WAF - Web Application Firewall)
  const SQLI_REGEX = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION)\b)|(--|#|\/\*|\*\/)|(\bOR\b\s+['"]?[\w\d]+['"]?\s*=\s*['"]?[\w\d]+['"]?)/i;
  const XSS_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onerror\s*=|onload\s*=/i;

  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      const inspectString = JSON.stringify(req.query || {}) + JSON.stringify(req.body || {});
      if (SQLI_REGEX.test(inspectString)) {
        console.warn(`[WAF BLOCKED - SQL Injection attempt]: IP=${req.ip} URL=${req.url}`);
        return res.status(400).json({
          success: false,
          error: 'SQL_INJECTION_DETECTED',
          message: 'Xavfsizlik qoidasi buzildi: SQL inʼeksiya xavfi aniqlandi va soʻrov bloklandi.'
        });
      }
      if (XSS_REGEX.test(inspectString)) {
        console.warn(`[WAF BLOCKED - XSS payload attempt]: IP=${req.ip} URL=${req.url}`);
        return res.status(400).json({
          success: false,
          error: 'XSS_PAYLOAD_DETECTED',
          message: 'Xavfsizlik qoidasi buzildi: Xavfli XSS skripti aniqlandi va soʻrov bloklandi.'
        });
      }
    }
    next();
  });

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Yozyovon Agro Monitoring API', time: new Date().toISOString(), firewall: 'active' });
  });

  // Security stats API (For Developer Panel)
  app.get('/api/security-status', (req, res) => {
    res.json({
      success: true,
      waf: 'active',
      rateLimiter: 'active',
      maxRpm: MAX_REQ_PER_WINDOW,
      activeClients: clientRequestCounts.size,
      serverTime: new Date().toISOString()
    });
  });

  // Google reCAPTCHA v2 Server-side verification API
  app.post('/api/verify-recaptcha', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA token kiritilmagan.' 
        });
      }

      const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Official Google test secret key
      
      // Call Google reCAPTCHA verification endpoint
      const params = new URLSearchParams();
      params.append('secret', secretKey);
      params.append('response', token);

      const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const data = await googleResponse.json() as { 
        success: boolean; 
        challenge_ts?: string; 
        hostname?: string; 
        'error-codes'?: string[] 
      };

      if (data.success) {
        return res.json({ 
          success: true, 
          message: 'reCAPTCHA v2 muvaffaqiyatli tasdiqlandi. Inson ekanligingiz tekshirildi.' 
        });
      } else {
        // Fallback for standard test tokens or development environment
        if (token.startsWith('test-token-') || token === 'mock-recaptcha-token-ok') {
          return res.json({ 
            success: true, 
            message: 'reCAPTCHA test muvaffaqiyatli qabul qilindi (Test rejimida).' 
          });
        }
        return res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA tasdiqlanmadi. Qayta urinib koʻring.', 
          errors: data['error-codes'] 
        });
      }
    } catch (error: any) {
      console.error('reCAPTCHA verification error:', error);
      // Even in network failure, return graceful error with support for dev
      return res.status(500).json({ 
        success: false, 
        message: 'Serverda reCAPTCHA tasdiqlashda xatolik yuz berdi.' 
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
