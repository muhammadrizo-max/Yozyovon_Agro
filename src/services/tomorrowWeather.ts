// Tomorrow.io Weather API Integration for Yozyovon Agro Monitoring
export interface TomorrowWeatherValues {
  temperature: number;
  temperatureApparent: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  precipitationProbability: number;
  weatherCode: number;
  dewPoint: number;
  pressureSurfaceLevel: number;
  conditionText: string;
  source: 'tomorrow.io' | 'cached' | 'fallback';
  lastUpdated: string;
}

const TOMORROW_WEATHER_CODES: Record<number, string> = {
  0: 'Nomaʼlum',
  1000: 'Musaffo, quyoshli',
  1100: 'Asosan quyoshli',
  1101: 'Qisman bulutli',
  1102: 'Oʻrtacha bulutli',
  1001: 'Qalin bulutli',
  2000: 'Tumanli havo',
  2100: 'Yengil tuman',
  4000: 'Mayda yomgʻir',
  4001: 'Yomgʻir yogʻmoqda',
  4200: 'Kuchli yomgʻir',
  5000: 'Qor yogʻmoqda',
  5001: 'Yengil qor',
  6000: 'Muzli yomgʻir',
  7000: 'Doʻl yogʻish ehtimoli',
  8000: 'Momaqaldiroqli chaqmoq'
};

const STORAGE_KEY = 'yozyovon_tomorrow_weather_cache';
const CUSTOM_API_KEY_STORAGE = 'yozyovon_tomorrow_custom_api_key';

export function getStoredTomorrowApiKey(): string {
  if (typeof window === 'undefined') return '';
  const custom = localStorage.getItem(CUSTOM_API_KEY_STORAGE);
  if (custom && custom.trim()) return custom.trim();
  return (import.meta as any).env?.VITE_TOMORROW_API_KEY || '';
}

export function saveCustomTomorrowApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(CUSTOM_API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(CUSTOM_API_KEY_STORAGE);
    }
  }
}

export async function fetchTomorrowWeather(
  lat: number = 40.665, 
  lng: number = 71.650
): Promise<TomorrowWeatherValues> {
  const cacheKey = `${STORAGE_KEY}_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  
  // Check local cache (valid for 15 minutes)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = Date.now() - new Date(parsed.lastUpdated).getTime();
        if (age < 15 * 60 * 1000) {
          return {
            ...parsed,
            source: 'cached'
          };
        }
      } catch (e) {
        // Continue to fresh fetch
      }
    }
  }

  const apiKey = getStoredTomorrowApiKey();

  if (apiKey) {
    try {
      const url = `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lng}&apikey=${encodeURIComponent(apiKey)}&units=metric`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const json = await res.json();
        const v = json.data?.values;
        if (v) {
          const result: TomorrowWeatherValues = {
            temperature: Math.round((v.temperature ?? 30) * 10) / 10,
            temperatureApparent: Math.round((v.temperatureApparent ?? (v.temperature + 2)) * 10) / 10,
            humidity: Math.round(v.humidity ?? 40),
            windSpeed: Math.round((v.windSpeed ?? 3.4) * 10) / 10,
            windDirection: Math.round(v.windDirection ?? 120),
            uvIndex: Math.round(v.uvIndex ?? 7),
            precipitationProbability: Math.round(v.precipitationProbability ?? 0),
            weatherCode: v.weatherCode ?? 1000,
            dewPoint: Math.round((v.dewPoint ?? 14) * 10) / 10,
            pressureSurfaceLevel: Math.round(v.pressureSurfaceLevel ?? 1012),
            conditionText: TOMORROW_WEATHER_CODES[v.weatherCode] || 'Quyoshli, ochiq havo',
            source: 'tomorrow.io',
            lastUpdated: new Date().toISOString()
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, JSON.stringify(result));
          }
          return result;
        }
      } else {
        console.warn('Tomorrow.io API responded with status:', res.status);
      }
    } catch (err) {
      console.warn('Tomorrow.io fetch exception, falling back to simulated agro station:', err);
    }
  }

  // Fallback realistic microclimate based on Yozyovon agro coordinates
  const now = new Date();
  const fallbackResult: TomorrowWeatherValues = {
    temperature: 31.4,
    temperatureApparent: 33.2,
    humidity: 38,
    windSpeed: 3.6,
    windDirection: 140,
    uvIndex: 7,
    precipitationProbability: 0,
    weatherCode: 1000,
    dewPoint: 14.2,
    pressureSurfaceLevel: 1014,
    conditionText: 'Musaffo, quyoshli (Yozyovon)',
    source: 'fallback',
    lastUpdated: now.toISOString()
  };

  return fallbackResult;
}
