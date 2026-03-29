import { create } from 'zustand';

interface GameBoyState {
  // System state
  isPowered: boolean;
  isBooting: boolean;
  bootStep: number;
  
  // Current screen
  currentScreen: 'OFF' | 'BOOTING' | 'MAIN_MENU' | 'POWER_CONFIRM' | 'PLAYING_SNAKE' | 'PLAYING_TETRIS' | 'PLAYING_MARIO' | 'VIEWING_STATS' | 'VIEWING_SETTINGS';
  
  // OS Transitions & Modals
  isCartridgeBooting: boolean;
  activeOSModal: string | null;
  setCartridgeBooting: (isBooting: boolean) => void;
  setOSModal: (message: string | null) => void;

  // Menu state
  selectedMenuItem: number;
  
  // Settings
  soundEnabled: boolean;
  volume: number;
  brightness: number;
  theme: number;
  
  // Power confirm
  powerOption: 'YES' | 'NO';
  
  // Actions
  powerOn: () => void;
  powerOff: () => void;
  navigateTo: (screen: GameBoyState['currentScreen']) => void;
  setSelectedMenuItem: (index: number) => void;
  setSetting: (key: 'soundEnabled' | 'volume' | 'brightness' | 'theme', value: any) => void;
  setPowerOption: (option: 'YES' | 'NO') => void;
}

export const useGameBoyStore = create<GameBoyState>((set) => {
  const isBrowser = typeof window !== 'undefined';
  
  return {
    // Initial state
    isPowered: true,
    isBooting: false,
    bootStep: 0,
    currentScreen: 'MAIN_MENU',
    selectedMenuItem: 0,
    soundEnabled: isBrowser ? localStorage.getItem('gb_soundEnabled') !== 'false' : true,
    volume: isBrowser ? parseInt(localStorage.getItem('gb_volume') || '80', 10) : 80,
    brightness: isBrowser ? parseInt(localStorage.getItem('gb_brightness') || '100', 10) : 100,
    theme: isBrowser ? parseInt(localStorage.getItem('gb_theme') || '2', 10) : 2, // 0: NEON RED, 1: EMERALD, 2: VINTAGE OS, 3: COBALT
    powerOption: 'NO',
    isCartridgeBooting: false,
    activeOSModal: null,
    
    // Actions
    powerOn: () => {
      set({ isPowered: true, isBooting: true, bootStep: 1, currentScreen: 'BOOTING' });
      setTimeout(() => set({ bootStep: 2 }), 1500);
      setTimeout(() => set({ isBooting: false, bootStep: 0, currentScreen: 'MAIN_MENU' }), 3500);
    },

    powerOff: () => {
      set({ isPowered: false, currentScreen: 'OFF' });
    },
    
    navigateTo: (screen) => set({ currentScreen: screen }),
    
    setCartridgeBooting: (isBooting) => set({ isCartridgeBooting: isBooting }),
    setOSModal: (message) => set({ activeOSModal: message }),

    setSelectedMenuItem: (index) => set({ selectedMenuItem: index }),
    
    setSetting: (key, value) => {
      set({ [key]: value });
      if (typeof window !== 'undefined') {
        localStorage.setItem(`gb_${key}`, String(value));
      }
    },
    
    setPowerOption: (option) => set({ powerOption: option }),
  };
});

// High score store
interface HighScoreState {
  snake: number;
  tetris: number;
  mario: number;
  updateScore: (game: 'snake' | 'tetris' | 'mario', score: number) => void;
}

export const useHighScoreStore = create<HighScoreState>((set) => ({
  snake: 0,
  tetris: 0,
  mario: 0,
  updateScore: (game, score) => {
    const key = `gameboy_${game}_highscore`;
    const saved = localStorage.getItem(key);
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (score > currentHigh) {
      localStorage.setItem(key, String(score));
      set({ [game]: score });
    }
  },
}));

// Initialize high scores from localStorage
if (typeof window !== 'undefined') {
  const snakeScore = localStorage.getItem('gameboy_snake_highscore');
  const tetrisScore = localStorage.getItem('gameboy_tetris_highscore');
  const marioScore = localStorage.getItem('gameboy_mario_highscore');
  
  useHighScoreStore.setState({
    snake: snakeScore ? parseInt(snakeScore, 10) : 0,
    tetris: tetrisScore ? parseInt(tetrisScore, 10) : 0,
    mario: marioScore ? parseInt(marioScore, 10) : 0,
  });
}
