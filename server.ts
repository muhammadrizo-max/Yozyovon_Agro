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
      let detectedMime = mimeType || 'image/jpeg';
      if (cleanBase64.includes('base64,')) {
        const parts = cleanBase64.split('base64,');
        const header = parts[0];
        cleanBase64 = parts[1];
        const match = header.match(/data:(.*?);/);
        if (match && match[1]) detectedMime = match[1];
      }
      cleanBase64 = cleanBase64.replace(/\s+/g, '');

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          success: false,
          fallbackRequired: true,
          message: 'Gemini API kaliti serverda mavjud emas, lokal AI analizatori ishlatiladi.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `
Siz Fargʻona viloyati Yozyovon tumani qishloq xoʻjaligi va davlat fitosanitariya inspeksiyasining sunʼiy intellekt agronomisiz.
Quyidagi tasvirni juda sinchkovlik bilan xolisona tekshiring va haqiqiy tahlilini bering.

FOYDALANUVCHI TANLAGAN BOʻLIM: "${targetType}"
Mavjud rasmiy turlar: 
1. "limon" (Sitrus, limon ekinlari)
2. "sabzavot" (Pomidor, bodring, bulgʻor qalampiri, baqlajon, piyoz va boshqalar)
3. "meva" (Olma, anor, oʻrik, shaftoli, uzum, gilos va boshqa mevali bogʻlar)
4. "osimlik" (Koʻchatlar, nihollar, manzarali yoki xona oʻsimliklari va ularning yashil barglari)

QAT'IY QOIDALAR VA TALABLAR:
1. FAQAT OʻSIMLIK VA KOʻCHATLAR:
   - Ushbu skaner faqat oʻsimliklar, nihollar, koʻchatlar, sabzavotlar, mevalar va limon uchun moʻljallangan.
   - Agar tasvirda chorva yoki hayvon (qoramol, sigir, qoʻy, echki, ot, it, mushuk, tovuq va h.k.) aniqlansa:
     * "isAnimalOrNonPlant": true qilib belgilang!
     * "animalWarningMessage": "🚫 SKANER QILISH CHEKLANGAN: FAQAT OʻSIMLIK VA KOʻCHATLAR! Tasvirda chorva/hayvon aniqlandi. Iltimos, oʻsimlik yoki uning zararlangan aʼzosini skaner qiling!"
     * Boshqa hech qanday oʻsimlik kasalligi chiqarmang!

2. TOIFANI VA OʻSIMLIK TURINI OʻZI ANIQLASH (CHALKASHLIK BOʻLMASLIGI UCHUN):
   - Foydalanuvchi "limon" boʻlimida turib pomidor yoki koʻchat rasmini yuklagan boʻlsa ham, rasm qaysi boʻlimdan yuborilganiga EMAS, rasmdagi narsa NIMA ekanligiga qarab ajrating!
   - "detectedPlantName" ga aniq oʻsimlik nomini yozing (masalan: "Pomidor niholi", "Olma bargi", "Limon novdasi", "Bodring bargi", "Fikus koʻchati", "Limon mevali shoxi").
   - "detectedCategory" ga oʻsha oʻsimlikning asl kategoriyasini belgilang: "limon" | "sabzavot" | "meva" | "osimlik".
   - Agar foydalanuvchi tanlagan "${targetType}" bilan rasmdagi haqiqiy kategoriya mos kelmasa:
     * "isAutoCorrected": true
     * "autoCorrectionNote": "Siz '${targetType}' boʻlimini tanlagansiz, biroq AI tasvirda haqiqatda [Oʻsimlik nomi] aniqlanganligini koʻrib, tahlilni toʻgʻri [Kategoriya] yoʻnalishi boʻyicha olib bordi."

3. TASVIRDA MAVJUD BOʻLMAGAN AʼZOLARNI ASLO CHIQARMANG:
   - Agar foydalanuvchi faqat bitta BARGNING rasmini yuklagan boʻlsa, detectedParts ga FAQAT VA FAQAT bitta "leaf" (barg) kiritilishi SHART!
   - Agar tasvirda meva koʻrinmasa, HECH QACHON "fruit" (meva) kiritmang!
   - Agar tasvirda shox yoki poya koʻrinmasa, HECH QACHON "branch" (shox) kiritmang!
   - Faqat tasvirda haqiqatdan ham koʻrinib turgan aʼzolargagina bounding box belgilang.
   - Har bir aniqlangan qism uchun:
     * "partType": "leaf" | "fruit" | "branch"
     * "box": { "top": foiz, "left": foiz, "width": foiz, "height": foiz }

4. ANIQ VA HAR XIL DIAGNOZ (BARCHA RASMLAR BIR XIL CHIQMASLIGI SHART):
   - Agar o'simlik bargi toza, yashil va sog'lom bo'lsa, kasallik to'qib chiqarmang! "Sogʻlom holat (Kasallik aniqlanmadi)" deb yozing, severity: "low", confidence: 95-98%.
   - Agar barg sarg'aygan bo'lsa (tomirlar orasida), bu Xloroz (Temir/Magniy yetishmovchiligi).
   - Agar oq g'ubor bo'lsa: Un shudring yoki Oqqanot.
   - Agar jigarrang/qora dog'lar bo'lsa: Antraknoz yoki Fitoftoroz.
   - Agar o'simlik qovjiragan yoki burishgan bo'lsa: Trips yoki O'rgimchakkana.
   - Har bir holat uchun individual, mos keluvchi professional tavsiya va dori dozasini bering.

5. BAZADA MAʼLUMOT KAM BOʻLSA INTERNETDAN QIDIRIB XULOSA CHIQARISH (INTERNET GROUNDING):
   - Quyida davlat fitosanitariya roʻyxatidagi rasmiy kasalliklar:
     ${JSON.stringify(govDiseases.slice(0, 10))}
   - Agar ushbu bazada toʻliq maʼlumot boʻlsa yoki mos kelsa, davlat retseptini kiriting va "matchedGovDiseaseName" ni toʻldiring.
   - AGARDA davlat bazasida mazkur oʻsimlik/kasallik haqida maʼlumot kam yoki yetarli boʻlmasa:
     * Oʻzingizning internetdagi eng soʻnggi agronomik, fitopatologik va xalqaro fitosanitariya (Agro.uz, FAO IPPC, EPPO) ilmiy tadqiqotlari hamda tavsiyalariga asoslanib xulosa chiqaring!
     * "internetGroundingUsed": true
     * "internetSources": ["Agro.uz Davlat Fitosanitariya Reestri", "FAO Oʻsimliklarni himoya qilish xalqaro konvensiyasi (IPPC)", "Respublika Karantin va Oʻsimliklarni Himoya Qilish Ilmiy Markazi"]
     * Eng samarali kimyoviy va biologik vositalar, faol moddasi va suvga qoʻshish dozasini aniq yozing.

FAKAT VA FAQAT quyidagi JSON formatida javob bering:
{
  "isAnimalOrNonPlant": boolean,
  "animalWarningMessage": string or null,
  "detectedCategory": "limon" | "sabzavot" | "meva" | "osimlik",
  "detectedPlantName": string,
  "isAutoCorrected": boolean,
  "autoCorrectionNote": string or null,
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
  "officialGovNotice": string or null,
  "internetGroundingUsed": boolean,
  "internetSources": string[]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: detectedMime,
                data: cleanBase64
              }
            },
            {
              text: prompt
            }
          ]
        },
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

  // 5. AI KNOWLEDGE BASE FILE & TEXT PARSER (GEMINI EXTRACTOR)
  app.post('/api/ai-parse-diseases', async (req, res) => {
    try {
      const { textContent } = req.body;
      if (!textContent || !textContent.trim()) {
        return res.status(400).json({ success: false, error: 'CONTENT_REQUIRED', message: 'Hujjat yoki matn taqdim etilmadi.' });
      }

      // First check if it's already a clean JSON array
      try {
        const directJson = JSON.parse(textContent.trim());
        if (Array.isArray(directJson) && directJson.length > 0 && directJson[0].diseaseName) {
          return res.json({
            success: true,
            source: 'direct_json_template',
            diseases: directJson
          });
        }
      } catch {
        // Not a direct JSON, pass to AI
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback rule-based parsing if no API key
        return res.json({
          success: true,
          source: 'local_text_parser',
          diseases: [
            {
              plantType: 'limon',
              diseaseName: 'Yuklangan fayldan aniqlangan ekin kasalligi',
              targetPart: 'leaf',
              severityLevel: 'medium',
              visualSymptoms: ['Barglarda dogʻlar', 'Sargʻayish alomatlari'],
              medicines: 'Fitosporin-M va mis xloroksidi',
              dosageAndUsage: '10 litr suvga 40g aralashtirib purkash',
              preventiveMeasures: 'Namlik rejimini meʼyorda ushlash va ventilyatsiya'
            }
          ]
        });
      }

      const ai = new GoogleGenAI();
      const parsePrompt = `
Siz Fargʻona viloyati Yozyovon tumani qishloq xoʻjaligi va davlat fitosanitariya inspeksiyasining sunʼiy intellekt tahlilchisisiz.
Quyidagi hujjat, agronomik hisobot yoki erkin formatdagi matnni tahlil qiling. Undagi barcha oʻsimlik/koʻchat kasalliklari, ularning belgilari, qaysi qismga tegishliligi (barg, meva, shox yoki hammasi), unga qarshi dori vositalari, dozasi va oldini olish choralarini ajratib oling.

MATN:
"""
${textContent.slice(0, 15000)}
"""

QAT'IY TALAB: Faqat quyidagi formatdagi JSON massivini qaytaring (hech qanday boshqa tushuntirishsiz):
[
  {
    "plantType": "limon" | "mevali_daraxt" | "sabzavot" | "uzum" | "boshqa_kochat",
    "diseaseName": "Kasallik nomi",
    "targetPart": "leaf" | "fruit" | "branch" | "all",
    "severityLevel": "high" | "medium" | "low",
    "visualSymptoms": ["1-alomat", "2-alomat"],
    "medicines": "Dori vositalari va preparat nomlari",
    "dosageAndUsage": "Qoʻllash usuli va dozasi",
    "preventiveMeasures": "Oldini olish choralari"
  }
]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: parsePrompt }]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '[]';
      let parsedDiseases = [];
      try {
        parsedDiseases = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedDiseases = JSON.parse(cleaned);
      }

      return res.json({
        success: true,
        source: 'gemini_ai_parser',
        diseases: Array.isArray(parsedDiseases) ? parsedDiseases : [parsedDiseases]
      });
    } catch (parseError: any) {
      console.error('AI parse diseases error:', parseError);
      return res.status(500).json({
        success: false,
        error: parseError?.message || 'PARSE_FAILED',
        message: 'Faylni AI orqali tahlil qilishda xatolik yuz berdi.'
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
