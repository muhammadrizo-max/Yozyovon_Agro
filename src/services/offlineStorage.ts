/**
 * Yozyovon Agro - Qishloq joylarda beqaror internet sharoitida
 * ma'lumotlarni saqlash va oflayn ishlash strategiyasi (LocalStorage & Service Worker).
 */

const STORAGE_KEYS = {
  WEATHER: 'yozyovon_offline_weather',
  MFY_LIST: 'yozyovon_offline_mfy_list',
  LAST_SYNC: 'yozyovon_offline_last_sync',
  GOV_DISEASES: 'yozyovon_offline_gov_diseases',
  FARMER_DATA: 'yozyovon_offline_farmer_data'
};

export interface OfflineCacheStatus {
  isOffline: boolean;
  lastSyncTime: string | null;
  hasCachedData: boolean;
}

export const offlineStorage = {
  /**
   * Ob-havo ma'lumotlarini keshga saqlash
   */
  saveWeather(weatherData: any) {
    try {
      localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weatherData));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('Oflayn ob-havoni saqlashda xatolik:', e);
    }
  },

  /**
   * Keshdagi ob-havo ma'lumotlarini olish
   */
  getCachedWeather(): any | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEATHER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * 33 ta MFY ma'lumotlarini keshga saqlash
   */
  saveMfyList(mfyList: any[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MFY_LIST, JSON.stringify(mfyList));
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('Oflayn MFY roʻyxatini saqlashda xatolik:', e);
    }
  },

  /**
   * Keshdagi 33 ta MFY ma'lumotlarini olish
   */
  getCachedMfyList(): any[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MFY_LIST);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Fitosanitariya kasalliklar bazasini saqlash
   */
  saveGovDiseases(diseases: any[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.GOV_DISEASES, JSON.stringify(diseases));
    } catch (e) {
      console.warn('Oflayn kasalliklar bazasini saqlashda xatolik:', e);
    }
  },

  /**
   * Keshdagi kasalliklar bazasini olish
   */
  getCachedGovDiseases(): any[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOV_DISEASES);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Oxirgi sinxronizatsiya vaqti
   */
  getLastSyncTime(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch {
      return null;
    }
  },

  /**
   * Service Worker ni ro'yxatdan o'tkazish
   */
  registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('Agro SW muvaffaqiyatli roʻyxatga olindi:', registration.scope);
          },
          err => {
            console.warn('Agro SW roʻyxatga olishda xatolik:', err);
          }
        );
      });
    }
  }
};
