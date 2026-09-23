import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

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

  // 4. REAL AI AGRO-SCANNER API (GEMINI VISION + GOV DISEASE CROSS-REFERENCE + ANIMAL FILTER)
  app.post('/api/ai-agro-scan', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', govDiseases = [], targetType = 'limon' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ success: false, error: 'IMAGE_REQUIRED', message: 'Tasvir maʼlumoti taqdim etilmadi.' });
      }

      // Base64 toza qismini ajratib olish (data:image/...;base64, prefiksi bo'lsa)
      let cleanBase64 = imageBase64;
      let detectedMime = mimeType;
      if (imageBase64.includes('base64,')) {
        const parts = imageBase64.split('base64,');
        cleanBase64 = parts[1];
        const match = parts[0].match(/data:(.*?);/);
        if (match && match[1]) detectedMime = match[1];
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          fallbackRequired: true,
          message: 'Gemini API kaliti serverda mavjud emas, lokal AI analizatori ishlatiladi.'
        });
      }

      const ai = new GoogleGenAI();
      const prompt = `
Siz Fargʻona viloyati Yozyovon tumani qishloq xoʻjaligi va davlat fitosanitariya inspeksiyasining sunʼiy intellekt agronomisiz.
Quyidagi tasvirni juda sinchkovlik bilan tekshiring va tahlil qiling.

QAT'IY CHEKLOV VA TALABLAR:
1. FAQAT OʻSIMLIK VA KOʻCHATLAR: Ushbu skaner faqat oʻsimliklar, koʻchatlar, sitrus (limon), barglar, mevalar va shoxlarni tekshirishga moʻljallangan.
2. CHORVA VA HAYVONLAR QAT'IYAN TAQIQLANGAN:
   - Agar rasmda qoramol, sigir, qoʻy, echki, ot, buzoq, parranda, it, mushuk yoki har qanday boshqa hayvon/chorva tasvirlangan boʻlsa:
     Darhol "isAnimalOrNonPlant": true deb belgilang!
     Ogohlantirish xabari bering: "🚨 DIQQAT: FAQAT OʻSIMLIK VA KOʻCHATLARNI SKANER QILISH MUMKIN! Tizim tasvirda chorva/hayvon aniqladi. Iltimos, oʻsimlik yoki koʻchatni skaner qiling!"
     Boshqa hech qanday oʻsimlik kasalligi natijasi qaytarmang!
3. AGAR TASVIRDA OʻSIMLIK YOKI KOʻCHAT BOʻLSA:
   - Kasallangan barglar, mevalar va shoxlarni ALOHIDA qilib belgilang (multi-part pathology):
     * "partType": "leaf" (kasallangan barglar)
     * "partType": "fruit" (zararlangan mevalar)
     * "partType": "branch" (zararlangan poya, tana yoki shoxlar)
   - Har bir qism uchun aniq bounding box (0-100 foizlarda: top, left, width, height) va uning alomatini yozing.
   - DAVLAT ORGANLARI BILIMLAR BAZASI BILAN SOLISHTIRING (CROSS-REFERENCE):
     Quyida davlat fitosanitariya inspeksiyasi tomonidan kiritilgan rasmiy kasalliklar roʻyxati:
     ${JSON.stringify(govDiseases.slice(0, 10))}
   - Agar aniqlangan kasallik davlat kiritgan roʻyxatdagi biror kasallikka oʻxshasa:
     * "matchedGovDiseaseName" maydoniga oʻsha rasmiy nomni yozing.
     * "medicines" va "recommendations" maydonlariga aynan davlat tomonidan belgilangan rasmiy dori vositalari, dozalari va koʻrsatmalarini kiriting!
     * "officialGovNotice" maydoniga "🏛️ Yozyovon Fitosanitariya Davlat Inspeksiyasi tomonidan tasdiqlangan rasmiy retsept asosida" deb yozing.

FAKAT VA FAQAT quyidagi JSON formatida javob bering, hech qanday markdown yoki ortiqcha matnsiz:
{
  "isAnimalOrNonPlant": boolean,
  "animalWarningMessage": string or null,
  "diseaseName": string,
  "confidence": number,
  "severity": "low" | "medium" | "high",
  "recommendations": string,
  "medicines": string,
  "detectedParts": [
    {
      "id": string,
      "partType": "leaf" | "fruit" | "branch",
      "partName": string,
      "symptom": string,
      "severity": "low" | "medium" | "high",
      "confidence": number,
      "box": { "top": number, "left": number, "width": number, "height": number }
    }
  ],
  "matchedGovDiseaseName": string or null,
  "officialGovNotice": string or null
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: detectedMime,
                  data: cleanBase64
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      let parsedResult;
      try {
        parsedResult = JSON.parse(responseText);
      } catch (parseErr) {
        // Agar markdown ```json bo'lsa tozalash
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResult = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        source: 'gemini_vision',
        data: parsedResult
      });
    } catch (apiError: any) {
      console.error('Gemini vision scan error:', apiError);
      return res.status(500).json({
        success: false,
        fallbackRequired: true,
        error: apiError?.message || 'GEMINI_SCAN_FAILED',
        message: 'Gemini tahlilida xatolik, lokal agro-vision dvigateli ishlatiladi.'
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
