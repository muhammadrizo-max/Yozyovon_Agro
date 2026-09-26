/**
 * Yozyovon Agro - Web Audio API Orqali Tovushli Bildirishnomalar Tizimi
 * Internet yoki tashqi MP3 fayllarga bog'liq bo'lmagan, 100% oflayn ishlaydigan
 * toza va yoqimli audio sintezator.
 */

class AgroAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // LocalStorage orqali tovush sozlamasini saqlash
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('yozyovon_audio_muted');
      this.isMuted = savedMute === 'true';
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('yozyovon_audio_muted', muted ? 'true' : 'false');
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Tovushli signal chalish
   * @param type 'alert' | 'critical_alert' | 'scan_success' | 'scan_warning' | 'animal_alert'
   */
  public play(type: 'alert' | 'critical_alert' | 'scan_success' | 'scan_warning' | 'animal_alert') {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'alert') {
        // Yumshoq 2-tonli xabarnoma ohangi (Davlat ogohlantirishlari) - C5 -> G5
        this.playTone(ctx, 523.25, now, 0.15, 'sine', 0.25);
        this.playTone(ctx, 783.99, now + 0.12, 0.25, 'sine', 0.28);
      } else if (type === 'critical_alert') {
        // Favqulodda xavf ohangi (Chigirtka, sovuq urishi) - 3 ta tezkor ohang
        this.playTone(ctx, 659.25, now, 0.12, 'triangle', 0.35);
        this.playTone(ctx, 587.33, now + 0.12, 0.12, 'triangle', 0.35);
        this.playTone(ctx, 880.00, now + 0.24, 0.3, 'sine', 0.4);
      } else if (type === 'scan_success') {
        // Sog'lom o'simlik ohangi - Mayor akkord arpedjio (C -> E -> G)
        this.playTone(ctx, 523.25, now, 0.1, 'sine', 0.2);
        this.playTone(ctx, 659.25, now + 0.08, 0.1, 'sine', 0.22);
        this.playTone(ctx, 783.99, now + 0.16, 0.25, 'sine', 0.25);
      } else if (type === 'scan_warning') {
        // Kasallik topilganda ogohlantirish ohangi - Ekin patologiyasi
        this.playTone(ctx, 440.00, now, 0.14, 'triangle', 0.3);
        this.playTone(ctx, 466.16, now + 0.14, 0.25, 'sawtooth', 0.22);
      } else if (type === 'animal_alert') {
        // Hayvon/chorva cheklovi ogohlantirishi - 2 ta past ogohlantiruvchi signal
        this.playTone(ctx, 330.00, now, 0.18, 'square', 0.25);
        this.playTone(ctx, 293.66, now + 0.20, 0.25, 'square', 0.25);
      }
    } catch (e) {
      console.warn('Audio feedback error:', e);
    }
  }

  private playTone(
    ctx: AudioContext, 
    freq: number, 
    startTime: number, 
    duration: number, 
    type: OscillatorType,
    volume: number = 0.2
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const audioFeedback = new AgroAudioSynthesizer();
