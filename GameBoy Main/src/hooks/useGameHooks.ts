import { useEffect, useRef, useCallback, useState } from 'react';

// Game loop hook with requestAnimationFrame
export function useGameLoop(
  callback: (deltaTime: number, timestamp: number) => void,
  isRunning: boolean,
  fps: number = 60
) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const frameInterval = 1000 / fps;

  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;
    
    const deltaTime = timestamp - previousTimeRef.current;
    
    if (deltaTime >= frameInterval) {
      previousTimeRef.current = timestamp - (deltaTime % frameInterval);
      callback(deltaTime, timestamp);
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [callback, isRunning, frameInterval]);

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, animate]);
}

// Keyboard input hook
export function useKeyboardInput(
  keyMap: Record<string, string>,
  onKeyPress: (action: string, isPressed: boolean) => void,
  enabled: boolean = true
) {
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const action = keyMap[e.key];
      if (!action || pressedKeys.current.has(e.key)) return;
      
      pressedKeys.current.add(e.key);
      e.preventDefault();
      onKeyPress(action, true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const action = keyMap[e.key];
      if (!action) return;
      
      pressedKeys.current.delete(e.key);
      e.preventDefault();
      onKeyPress(action, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyMap, onKeyPress, enabled]);
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// High score hook
export function useHighScore(game: string) {
  const [highScore, setHighScore] = useLocalStorage<number>(`gameboy_${game}_highscore`, 0);

  const updateHighScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      return true; // New high score
    }
    return false;
  }, [highScore, setHighScore]);

  return { highScore, updateHighScore };
}

// Canvas helper hook
export function useCanvas(
  width: number,
  height: number,
  render: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    render(ctx, canvas);
  }, [width, height, render]);

  return canvasRef;
}

// Touch/swipe detection hook
export function useSwipe(onSwipe: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const threshold = 30;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      touchStart.current = null;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }

    touchStart.current = null;
  }, [onSwipe]);

  return { handleTouchStart, handleTouchEnd };
}

// Animation frame timing hook
export function useFrameTiming(targetFps: number = 60) {
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(0);
  const fps = useRef(0);

  const updateFps = useCallback((timestamp: number) => {
    frameCount.current++;
    
    if (timestamp - lastFpsUpdate.current >= 1000) {
      fps.current = frameCount.current;
      frameCount.current = 0;
      lastFpsUpdate.current = timestamp;
    }
    
    return fps.current;
  }, []);

  const getFrameTime = useCallback((deltaTime: number) => {
    return Math.min(deltaTime, 1000 / targetFps);
  }, [targetFps]);

  return { updateFps, getFrameTime, fps };
}

export default {
  useGameLoop,
  useKeyboardInput,
  useLocalStorage,
  useHighScore,
  useCanvas,
  useSwipe,
  useFrameTiming,
};
