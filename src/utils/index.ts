import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// CN utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with leading zeros
export function padNumber(num: number, length: number): string {
  return String(num).padStart(length, '0');
}

// Random integer between min and max (inclusive)
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random array element
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Check collision between two rectangles
export function rectCollision(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Check collision between two circles
export function circleCollision(
  x1: number, y1: number, r1: number,
  x2: number, y2: number, r2: number
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < r1 + r2;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Sleep/delay helper
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// GameBoy screen dimensions
export const SCREEN = {
  WIDTH: 234,
  HEIGHT: 184,
  HUD_HEIGHT: 12,
  GAME_HEIGHT: 160,
  HINTS_HEIGHT: 12,
};

// Color palettes for different themes
export const THEMES = {
  NEON_RED: {
    primary: '#ef4444',
    secondary: '#fca5a5',
    accent: '#991b1b',
    background: '#1a0505',
  },
  EMERALD: {
    primary: '#22c55e',
    secondary: '#86efac',
    accent: '#14532d',
    background: '#052e16',
  },
  VINTAGE_OS: {
    primary: '#ff8c00',
    secondary: '#c8e0ff',
    accent: '#1a3060',
    background: '#060c1a',
  },
  COBALT: {
    primary: '#3b82f6',
    secondary: '#93c5fd',
    accent: '#1e3a8a',
    background: '#0f172a',
  },
};

// Direction vectors
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Opposite directions
export const OPPOSITE_DIRECTION: Record<string, string> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export default {
  cn,
  padNumber,
  randomInt,
  randomElement,
  clamp,
  lerp,
  rectCollision,
  circleCollision,
  debounce,
  throttle,
  deepClone,
  sleep,
  SCREEN,
  THEMES,
  DIRECTIONS,
  OPPOSITE_DIRECTION,
};
