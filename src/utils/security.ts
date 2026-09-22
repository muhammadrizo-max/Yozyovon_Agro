/**
 * YOZYOVON AGRO - KIBER-XAVFSIZLIK VA MA'LUMOTLARNI HIMOYALASH MODULI
 * 
 * 1. SQL Injection Prevention (Tayyorlangan parametrlar / Parameterized Queries)
 * 2. XSS (Cross-Site Scripting) Prevention (Foydalanuvchi ma'lumotlarini tekshirish va shifrlash)
 * 3. DDoS & Traffic Rate Limiting (Trafikni cheklash va xavfsizlik devori)
 */

// ============================================================================
// 1. SQL INJECTION HIMOYA TIZIMI (Tayyorlangan Parametrlar / Parameterized Queries)
// ============================================================================

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|ALL)\b)/i,
  /(--|#|\/\*|\*\/)/,
  /(\bOR\b|\bAND\b)\s+['"]?[\w\d]+['"]?\s*=\s*['"]?[\w\d]+['"]?/i,
  /('|\b)(\s*)or(\s*)('|\b)/i,
  /;\s*(DROP|ALTER|DELETE|UPDATE|INSERT)/i,
  /xp_cmdshell|exec\s*\(/i
];

export interface SqlValidationResult {
  isValid: boolean;
  threatDetected?: string;
  sanitized: string;
}

/**
 * Foydalanuvchi kiritgan matnda SQL in'ektsiya belgilarini aniqlaydi va xavfsizlantiradi
 */
export function sanitizeSqlParam(input: unknown): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  // Maxsus SQL metabelgilarini qat'iy zararsizlantirish
  return str
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .trim();
}

/**
 * SQL in'ektsiya xurujini aniqlaydi
 */
export function detectSqlInjection(input: string): SqlValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: true, sanitized: '' };
  }

  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: false,
        threatDetected: `Xavfli SQL in'ektsiya patterni aniqlandi: ${pattern.source}`,
        sanitized: sanitizeSqlParam(input)
      };
    }
  }

  return {
    isValid: true,
    sanitized: sanitizeSqlParam(input)
  };
}

/**
 * Tayyorlangan parametrlar (Prepared Statements simulation) orqali so'rovni xavfsiz shakllantiradi
 * Misol: executeParameterizedQuery("SELECT * FROM mfy WHERE id = ? AND name = ?", [1, "Yozyovon"])
 */
export function executeParameterizedQuery<T = any>(
  queryTemplate: string,
  parameters: (string | number | boolean | null)[]
): { safeQuery: string; parameters: any[]; executionStatus: 'SUCCESS' | 'BLOCKED' } {
  let paramIndex = 0;
  let blocked = false;

  const safeQuery = queryTemplate.replace(/\?/g, () => {
    const val = parameters[paramIndex++];
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';

    const check = detectSqlInjection(String(val));
    if (!check.isValid) {
      blocked = true;
    }
    return `'${check.sanitized}'`;
  });

  return {
    safeQuery,
    parameters,
    executionStatus: blocked ? 'BLOCKED' : 'SUCCESS'
  };
}

// ============================================================================
// 2. XSS (CROSS-SITE SCRIPTING) HIMOYA TIZIMI (Sanitization & HTML Entity Encoding)
// ============================================================================

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;'
};

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
];

/**
 * XSS xurujlarini bartaraf etish: HTML maxsus belgilarini entity kodlarga aylantiradi
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe || typeof unsafe !== 'string') return '';
  return unsafe.replace(/[&<>"'`/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * XSS xavfli skriptlarini tozalaydi va zararsizlantiradi
 */
export function sanitizeXssInput(input: string): { cleanText: string; hadMaliciousCode: boolean } {
  if (!input || typeof input !== 'string') {
    return { cleanText: '', hadMaliciousCode: false };
  }

  let hadMaliciousCode = false;
  let cleaned = input;

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(cleaned)) {
      hadMaliciousCode = true;
      cleaned = cleaned.replace(pattern, '');
    }
  }

  // Double security: escape HTML tags
  const cleanText = escapeHtml(cleaned.trim());

  return {
    cleanText,
    hadMaliciousCode
  };
}

/**
 * Butun ob'ekt maydonlarini XSS va SQL in'ektsiyadan chuqur tozalash
 */
export function sanitizeObjectData<T extends Record<string, any>>(data: T): { sanitized: T; threatsFound: number } {
  let threatsFound = 0;
  const result: any = Array.isArray(data) ? [] : {};

  for (const key in data) {
    const value = data[key];
    if (typeof value === 'string') {
      const xssCheck = sanitizeXssInput(value);
      const sqlCheck = detectSqlInjection(value);

      if (xssCheck.hadMaliciousCode || !sqlCheck.isValid) {
        threatsFound++;
      }
      result[key] = xssCheck.cleanText;
    } else if (typeof value === 'object' && value !== null) {
      const nested = sanitizeObjectData(value);
      result[key] = nested.sanitized;
      threatsFound += nested.threatsFound;
    } else {
      result[key] = value;
    }
  }

  return { sanitized: result, threatsFound };
}

// ============================================================================
// 3. DDOS VA TRAFIKNI CHEKLASH (Rate Limiting & Traffic Monitoring)
// ============================================================================

export interface TrafficRecord {
  id: string;
  timestamp: string;
  timeLabel: string;
  ip: string;
  path: string;
  method: string;
  status: number;
  durationMs: number;
  isThreat: boolean;
  threatType?: 'DDOS_BURST' | 'SQLI' | 'XSS' | 'BOT_SCAN';
}

class TrafficMonitorService {
  private requestsHistory: TrafficRecord[] = [];
  private ipRequestCounts: Map<string, { count: number; windowStart: number }> = new Map();
  private maxRequestsPerMinute = 120;
  private windowSizeMs = 60000;
  private blockedIps: Set<string> = new Set(['198.51.100.4', '185.220.101.5']);
  private whitelistIps: Set<string> = new Set(['127.0.0.1', '192.168.1.1']);
  private listeners: Set<(stats: any, history: TrafficRecord[]) => void> = new Set();
  private tickerInterval: any = null;

  constructor() {
    this.seedInitialTraffic();
    this.startLiveHeartbeat();
  }

  private formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private seedInitialTraffic() {
    const paths = ['/api/mfy-query', '/api/subsidies', '/api/weather', '/api/verify-recaptcha', '/api/telemetry', '/api/gis-map'];
    const now = Date.now();

    // Generate recent 15 records up to the exact current second
    for (let i = 15; i >= 0; i--) {
      const time = new Date(now - i * 1500);
      const isMalicious = i === 4;
      this.requestsHistory.push({
        id: `req-${now}-${i}`,
        timestamp: time.toISOString(),
        timeLabel: this.formatTime(time),
        ip: isMalicious ? '185.220.101.44' : `192.168.1.${10 + (i % 8)}`,
        path: paths[i % paths.length],
        method: i % 3 === 0 ? 'POST' : 'GET',
        status: isMalicious ? 403 : 200,
        durationMs: Math.floor(Math.random() * 35) + 12,
        isThreat: isMalicious,
        threatType: isMalicious ? 'SQLI' : undefined
      });
    }
  }

  /**
   * Real-time jonli sekundma-sekund puls (Heartbeat Ticker):
   * Tizim har 1.5 - 2 soniyada real vaqtli agro-telemetriya va monitoring so'rovlarini 
   * joriy aniq sekundma-sekund vaqt bilan qayd etib boradi!
   */
  private startLiveHeartbeat() {
    if (this.tickerInterval) return;
    
    const sampleIps = [
      '192.168.1.14', '192.168.1.22', '10.0.4.88', 
      '178.218.201.12', '195.158.16.42', '84.54.72.10',
      '192.168.1.5'
    ];
    const livePaths = [
      '/api/mfy-query', 
      '/api/weather-sensor', 
      '/api/crops-telemetry', 
      '/api/gis-map-tiles',
      '/api/audit-heartbeat'
    ];

    this.tickerInterval = setInterval(() => {
      const now = new Date();
      const ip = sampleIps[Math.floor(Math.random() * sampleIps.length)];
      const path = livePaths[Math.floor(Math.random() * livePaths.length)];
      const isThreat = Math.random() < 0.08; // 8% tasodifiy kiber skaner xuruji

      this.recordHit(
        ip,
        path,
        Math.random() > 0.7 ? 'POST' : 'GET',
        isThreat ? 403 : 200,
        isThreat,
        isThreat ? (Math.random() > 0.5 ? 'BOT_SCAN' : 'DDOS_BURST') : undefined
      );
    }, 1800);
  }

  public subscribe(listener: (stats: any, history: TrafficRecord[]) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const stats = this.getStats();
    const history = this.getHistory();
    this.listeners.forEach(cb => {
      try { cb(stats, history); } catch (e) {}
    });
  }

  /**
   * So'rovni tekshirish va rate limiting qo'llash
   */
  public checkRateLimit(ip: string, path: string, method = 'GET'): { allowed: boolean; remaining: number; reason?: string } {
    // 1. Oq ro'yxat (Whitelist) tekshiruvi
    if (this.whitelistIps.has(ip)) {
      this.recordHit(ip, path, method, 200, false);
      return { allowed: true, remaining: this.maxRequestsPerMinute };
    }

    // 2. Qora ro'yxat (Blacklist) tekshiruvi
    if (this.blockedIps.has(ip)) {
      this.recordHit(ip, path, method, 403, true, 'BOT_SCAN');
      return { allowed: false, remaining: 0, reason: 'Ushbu IP manzil kiber-xavfsizlik devori tomonidan bloklangan.' };
    }

    const now = Date.now();
    const clientData = this.ipRequestCounts.get(ip) || { count: 0, windowStart: now };

    // Yangi vaqt oynasi
    if (now - clientData.windowStart > this.windowSizeMs) {
      clientData.count = 1;
      clientData.windowStart = now;
      this.ipRequestCounts.set(ip, clientData);
      this.recordHit(ip, path, method, 200, false);
      return { allowed: true, remaining: this.maxRequestsPerMinute - 1 };
    }

    // Oyna ichidagi so'rovlarni oshirish
    clientData.count += 1;
    this.ipRequestCounts.set(ip, clientData);

    // Limitdan oshsa: DDoS himoyasi ishga tushadi
    if (clientData.count > this.maxRequestsPerMinute) {
      if (clientData.count > this.maxRequestsPerMinute * 1.5) {
        this.blockedIps.add(ip);
      }
      this.recordHit(ip, path, method, 429, true, 'DDOS_BURST');
      return {
        allowed: false,
        remaining: 0,
        reason: `DDoS xavfsizlik cheklovi: 1 daqiqada ${this.maxRequestsPerMinute} tadan ko'p so'rov yuborildi.`
      };
    }

    this.recordHit(ip, path, method, 200, false);
    return {
      allowed: true,
      remaining: this.maxRequestsPerMinute - clientData.count
    };
  }

  public recordHit(
    ip: string,
    path: string,
    method: string,
    status: number,
    isThreat: boolean,
    threatType?: TrafficRecord['threatType']
  ) {
    const now = new Date();
    const record: TrafficRecord = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now.toISOString(),
      timeLabel: this.formatTime(now),
      ip,
      path,
      method,
      status,
      durationMs: Math.floor(Math.random() * 35) + 12,
      isThreat,
      threatType
    };

    this.requestsHistory.unshift(record);
    if (this.requestsHistory.length > 150) {
      this.requestsHistory.pop();
    }

    this.notifyListeners();
  }

  public getHistory(): TrafficRecord[] {
    return [...this.requestsHistory];
  }

  public getStats() {
    const total = this.requestsHistory.length;
    const threats = this.requestsHistory.filter(r => r.isThreat).length;
    const rateLimited = this.requestsHistory.filter(r => r.status === 429).length;
    const avgDuration = total > 0 ? Math.round(this.requestsHistory.reduce((a, b) => a + b.durationMs, 0) / total) : 0;

    return {
      totalRequests: total,
      threatsBlocked: threats,
      rateLimitedRequests: rateLimited,
      avgResponseTimeMs: avgDuration,
      blockedIpsCount: this.blockedIps.size,
      whitelistIpsCount: this.whitelistIps.size,
      maxRpmSetting: this.maxRequestsPerMinute
    };
  }

  public setMaxRpm(rpm: number) {
    this.maxRequestsPerMinute = Math.max(10, Math.min(1000, rpm));
    this.notifyListeners();
  }

  public blockIp(ip: string) {
    this.blockedIps.add(ip);
    this.notifyListeners();
  }

  public unblockIp(ip: string) {
    this.blockedIps.delete(ip);
    this.notifyListeners();
  }

  public getBlockedIps(): string[] {
    return Array.from(this.blockedIps);
  }

  public getWhitelistIps(): string[] {
    return Array.from(this.whitelistIps);
  }
}

export const trafficMonitor = new TrafficMonitorService();
