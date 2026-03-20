import { Howler } from 'howler';
import { create } from 'zustand';

// Sound definitions with GameBoy-style frequencies
const SOUND_PRESETS: Record<string, { freq: number; duration: number; type: OscillatorType; volume: number; slide?: { to: number; duration: number } }> = {
  SELECT: { freq: 800, duration: 0.05, type: 'square', volume: 0.3 },
  CONFIRM: { freq: 600, duration: 0.08, type: 'square', volume: 0.3 },
  BACK: { freq: 400, duration: 0.08, type: 'square', volume: 0.25 },
  MOVE: { freq: 500, duration: 0.04, type: 'square', volume: 0.2 },
  POWER_ON: { freq: 440, duration: 0.1, type: 'square', volume: 0.3 },
  POWER_OFF: { freq: 880, duration: 0.1, type: 'square', volume: 0.3 },
  BOOT: { freq: 660, duration: 0.05, type: 'square', volume: 0.25 },
  
  // Snake
  SNAKE_EAT: { freq: 1200, duration: 0.06, type: 'square', volume: 0.3 },
  SNAKE_DIE: { freq: 400, duration: 0.1, type: 'sawtooth', volume: 0.3 },
  SNAKE_PAUSE: { freq: 700, duration: 0.1, type: 'square', volume: 0.3 },
  
  // Tetris
  TETRIS_DROP: { freq: 300, duration: 0.05, type: 'square', volume: 0.25 },
  TETRIS_ROTATE: { freq: 800, duration: 0.04, type: 'square', volume: 0.25 },
  TETRIS_CLEAR: { freq: 523, duration: 0.08, type: 'square', volume: 0.3 },
  TETRIS_GAME_OVER: { freq: 400, duration: 0.15, type: 'sawtooth', volume: 0.3 },
  TETRIS_PAUSE: { freq: 600, duration: 0.1, type: 'square', volume: 0.3 },
  
  // Mario
  MARIO_JUMP: { freq: 350, duration: 0.1, type: 'square', volume: 0.3 },
  MARIO_COIN: { freq: 988, duration: 0.08, type: 'square', volume: 0.35 },
  MARIO_BUMP: { freq: 200, duration: 0.08, type: 'sawtooth', volume: 0.3 },
  MARIO_DIE: { freq: 400, duration: 0.1, type: 'sawtooth', volume: 0.3 },
  MARIO_PAUSE: { freq: 800, duration: 0.1, type: 'square', volume: 0.3 },
};

interface SoundState {
  enabled: boolean;
  volume: number;
  init: () => void;
  play: (sound: keyof typeof SOUND_PRESETS) => void;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useSoundStore = create<SoundState>((set, get) => ({
  enabled: true,
  volume: 0.3,
  
  init: () => {
    // Resume audio context if suspended
    if (Howler.ctx?.state === 'suspended') {
      Howler.ctx.resume();
    }
  },
  
  play: (sound) => {
    const { enabled, volume } = get();
    if (!enabled) return;
    
    const preset = SOUND_PRESETS[sound];
    if (!preset) return;
    
    // Create oscillator-based sound (GameBoy style)
    const audioCtx = Howler.ctx;
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = preset.type;
    oscillator.frequency.setValueAtTime(preset.freq, audioCtx.currentTime);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(preset.volume * volume, audioCtx.currentTime + 0.01);
    gainNode.gain.setValueAtTime(preset.volume * volume, audioCtx.currentTime + preset.duration - 0.02);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + preset.duration);
    
    // Frequency slide if specified
    if (preset.slide) {
      oscillator.frequency.exponentialRampToValueAtTime(
        preset.slide.to,
        audioCtx.currentTime + preset.slide.duration
      );
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + preset.duration + 0.02);
  },
  
  setEnabled: (enabled) => {
    set({ enabled });
    localStorage.setItem('gameboy_sound_enabled', String(enabled));
    Howler.mute(!enabled);
  },
  
  setVolume: (volume) => {
    set({ volume });
    localStorage.setItem('gameboy_volume', String(volume));
    Howler.volume(volume);
  },
}));

// Initialize sound settings from localStorage
if (typeof window !== 'undefined') {
  const savedEnabled = localStorage.getItem('gameboy_sound_enabled');
  const savedVolume = localStorage.getItem('gameboy_volume');
  
  if (savedEnabled !== null) {
    useSoundStore.setState({ enabled: savedEnabled === 'true' });
    Howler.mute(savedEnabled !== 'true');
  }
  
  if (savedVolume !== null) {
    const vol = parseFloat(savedVolume);
    useSoundStore.setState({ volume: vol });
    Howler.volume(vol);
  }
  
  // Set master volume
  Howler.volume(useSoundStore.getState().volume);
}

// Custom hook for playing sounds
export function useGameBoySound() {
  const { init, play, enabled, setEnabled, setVolume } = useSoundStore();
  
  return {
    init,
    play,
    enabled,
    setEnabled,
    setVolume,
  };
}

export default useGameBoySound;
