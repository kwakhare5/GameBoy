import { useEffect, useRef, useState, useCallback } from "react";
import OSLayout from "../shared/OSLayout";

// ═══ LAYOUT ═══
// Main display: 192px × 151px (content area inside bezels)
const GAME_H = 134;

// ═══ BOARD ═══
// Playable area: 130px × 130px
const COLS = 13, ROWS = 13, CS = 10;
const BX = 0, BY = 0;

// ═══ DIRECTIONS ═══
const DIR: Record<string, { x: number; y: number }> = { UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 } };
const OPPOSITE: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

// ═══ COLORS ═══
const GREEN_HEAD = "#88eeff", GREEN_BODY = "#00d4ff", GREEN_DARK = "#006688";
const GREEN_HI = "#ffffff", GREEN_SH = "#004466";
const FOOD_C = "#ff3333", FOOD_HI = "#ff9988", FOOD_SH = "#991111";
const FOOD2_C = "#ffd700", FOOD2_HI = "#fff099";
const BG = "#060c1a", GRID = "rgba(0,180,50,0.05)", BORDER = "#0d3010";

// ═══ LEVELS ═══
const LEVEL_SPEEDS = [150, 130, 115, 100, 90, 80, 70, 60, 50, 45];
const LEVEL_THRESHOLDS = [0, 5, 10, 16, 23, 31, 40, 50, 62, 75];

function getLevel(score: number) {
  let lv = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (score >= LEVEL_THRESHOLDS[i]) lv = i;
  return lv;
}

// ═══ FOOD SPAWN ═══
function spawnFood(snake: { x: number; y: number }[], bonus = false) {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  let pos;
  do { pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (occupied.has(`${pos.x},${pos.y}`));
  return { ...pos, bonus };
}

// ═══ AI PATHFINDING (Survival-Aware BFS) ═══
// Counts reachable cells from a position via flood-fill
function floodFillCount(startX: number, startY: number, walls: Set<string>) {
  const visited = new Set([`${startX},${startY}`]);
  const queue = [{ x: startX, y: startY }];
  let count = 0;
  const dirs = Object.values(DIR);
  while (queue.length) {
    const pos = queue.shift()!;
    count++;
    for (const d of dirs) {
      const nx = pos.x + d.x, ny = pos.y + d.y;
      const key = `${nx},${ny}`;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (walls.has(key) || visited.has(key)) continue;
      visited.add(key);
      queue.push({ x: nx, y: ny });
    }
  }
  return count;
}

function aiBFS(snake: { x: number; y: number }[], food: { x: number; y: number }) {
  const head = snake[0];
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  const dirs = Object.values(DIR);

  // BFS to find shortest path to food
  const queue: { pos: { x: number; y: number }; firstDir: { x: number; y: number } }[] = [];
  const visited = new Set([`${head.x},${head.y}`]);
  
  for (const d of dirs) {
    const nx = head.x + d.x, ny = head.y + d.y;
    const key = `${nx},${ny}`;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
    if (occupied.has(key)) continue;
    if (nx === food.x && ny === food.y) {
      // Check if eating here leaves enough open space for survival
      const newOccupied = new Set(occupied);
      newOccupied.add(key); // new head position (snake grows, no tail removal)
      const space = floodFillCount(nx, ny, newOccupied);
      if (space >= snake.length) return d; // Safe to eat
    }
    visited.add(key);
    queue.push({ pos: { x: nx, y: ny }, firstDir: d });
  }

  while (queue.length) {
    const { pos, firstDir } = queue.shift()!;
    for (const d of dirs) {
      const nx = pos.x + d.x, ny = pos.y + d.y;
      const key = `${nx},${ny}`;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (occupied.has(key) || visited.has(key)) continue;
      if (nx === food.x && ny === food.y) {
        // Found food — verify survival after eating
        const newHead = { x: head.x + firstDir.x, y: head.y + firstDir.y };
        const newOccupied = new Set(occupied);
        newOccupied.add(`${newHead.x},${newHead.y}`);
        const space = floodFillCount(newHead.x, newHead.y, newOccupied);
        if (space >= snake.length) return firstDir;
        break; // Path to food exists but is unsafe, fall through to survival mode
      }
      visited.add(key);
      queue.push({ pos: { x: nx, y: ny }, firstDir });
    }
  }

  // Survival mode: pick the direction with the most open flood-fill space
  let bestDir = dirs[0];
  let bestSpace = -1;
  for (const d of dirs) {
    const nx = head.x + d.x, ny = head.y + d.y;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
    if (occupied.has(`${nx},${ny}`)) continue;
    const walls = new Set(occupied);
    walls.add(`${nx},${ny}`);
    const space = floodFillCount(nx, ny, walls);
    if (space > bestSpace) {
      bestSpace = space;
      bestDir = d;
    }
  }
  return bestDir;
}

// ═══ DRAW HELPERS ═══
// ═══ DRAW HELPERS: PREMIUM REFINED RETRO SHADERS ═══
function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, colorBase: string, colorHi: string, colorSh: string, isRound = false) {
  // Base Color
  ctx.fillStyle = colorBase;
  if (isRound) {
    ctx.beginPath();
    ctx.roundRect(x, y, CS, CS, 2);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, CS, CS);
  }

  // Crisp Top-Left Highlight (matches Tetris 1px bevel)
  ctx.fillStyle = colorHi;
  if (isRound) {
    ctx.beginPath(); ctx.roundRect(x, y, CS - 1, 1, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x, y, 1, CS - 1, 2); ctx.fill();
  } else {
    ctx.fillRect(x, y, CS, 1); 
    ctx.fillRect(x, y, 1, CS);
  }

  // Crisp Bottom-Right Shadow (matches Tetris 1px bevel)
  ctx.fillStyle = colorSh;
  if (isRound) {
    ctx.beginPath(); ctx.roundRect(x, y + CS - 1, CS, 1, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x + CS - 1, y, 1, CS, 2); ctx.fill();
  } else {
    ctx.fillRect(x, y + CS - 1, CS, 1); 
    ctx.fillRect(x + CS - 1, y, 1, CS);
  }
}

function drawBg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, COLS * CS, GAME_H);
  // Grid lines strictly within board bounds only (COLS*CS × ROWS*CS)
  const boardW = COLS * CS, boardH = ROWS * CS;
  ctx.strokeStyle = GRID; ctx.lineWidth = 1;
  for (let c = 0; c <= COLS; c++) {
    const x = BX + c * CS + 0.5; // +0.5 for crisp 1px lines
    ctx.beginPath(); ctx.moveTo(x, BY); ctx.lineTo(x, BY + boardH); ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = BY + r * CS + 0.5;
    ctx.beginPath(); ctx.moveTo(BX, y); ctx.lineTo(BX + boardW, y); ctx.stroke();
  }
}

function drawBoard(ctx: CanvasRenderingContext2D) {
  const bw = COLS * CS, bh = ROWS * CS;
  ctx.fillStyle = BORDER;
  // Top edge
  ctx.fillRect(BX, BY, bw, 1);
  // Bottom edge
  ctx.fillRect(BX, BY + bh - 1, bw, 1);
  // Left edge
  ctx.fillRect(BX, BY, 1, bh);
  // Right edge
  ctx.fillRect(BX + bw - 1, BY, 1, bh);
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: { x: number; y: number }[], eatAnim: number) {
  snake.forEach((seg, i) => {
    const x = BX + seg.x * CS, y = BY + seg.y * CS;
    if (i === 0) {
      const scale = eatAnim > 0 ? 1 + eatAnim * 0.08 : 1;
      
      ctx.save();
      if (scale !== 1) {
        const cx = x + CS / 2, cy = y + CS / 2;
        ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
      }
      
      // Snake Head (Slightly rounded to distinguish from body)
      drawCell(ctx, x, y, GREEN_HEAD, GREEN_HI, GREEN_DARK, true);
      
      // Eyes with directional tracking and glowing pupils
      const dx = snake[1] ? snake[0].x - snake[1].x : 0;
      const dy = snake[1] ? snake[0].y - snake[1].y : 0;
      
      // Soft ambient glow around head
      ctx.shadowColor = "#88ffaa";
      ctx.shadowBlur = 4;
      
      ctx.fillStyle = "#ffffff"; // Sclera
      if (dy < 0) { ctx.fillRect(x + 1, y + 1, 3, 3); ctx.fillRect(x + 6, y + 1, 3, 3); }
      else if (dy > 0) { ctx.fillRect(x + 1, y + 6, 3, 3); ctx.fillRect(x + 6, y + 6, 3, 3); }
      else if (dx < 0) { ctx.fillRect(x + 1, y + 1, 3, 3); ctx.fillRect(x + 1, y + 6, 3, 3); }
      else { ctx.fillRect(x + 6, y + 1, 3, 3); ctx.fillRect(x + 6, y + 6, 3, 3); }
      
      ctx.shadowBlur = 0; // Turn off glow for pupils
      ctx.fillStyle = "#060c1a"; // Pupils
      if (dy < 0) { ctx.fillRect(x + 2, y + 1, 1, 2); ctx.fillRect(x + 7, y + 1, 1, 2); }
      else if (dy > 0) { ctx.fillRect(x + 2, y + 7, 1, 2); ctx.fillRect(x + 7, y + 7, 1, 2); }
      else if (dx < 0) { ctx.fillRect(x + 1, y + 2, 2, 1); ctx.fillRect(x + 1, y + 7, 2, 1); }
      else { ctx.fillRect(x + 7, y + 2, 2, 1); ctx.fillRect(x + 7, y + 7, 2, 1); }
      
      ctx.restore();
    } else {
      // Body Segments
      const t = i / snake.length;
      const r = Math.round(34 + (Math.floor(t * 4)) * 4);
      const gv = Math.round(204 - t * 80);
      drawCell(ctx, x, y, `rgb(${r},${gv},${Math.round(68 - t * 30)})`, GREEN_BODY, GREEN_SH, false);
    }
  });
}

function drawFood(ctx: CanvasRenderingContext2D, food: { x: number; y: number; bonus?: boolean }, pulse: number) {
  const x = BX + food.x * CS, y = BY + food.y * CS;
  const s = 1 + Math.sin(pulse * 0.1) * 0.1;
  const cx = x + CS / 2, cy = y + CS / 2;
  
  ctx.save(); 
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
  
  if (food.bonus) {
    ctx.shadowColor = "#ffcc00";
    ctx.shadowBlur = 8 + Math.sin(pulse * 0.2) * 4;
    drawCell(ctx, x, y, FOOD2_C, FOOD2_HI, "#aa8800", true);
  } else {
    ctx.shadowColor = "#ff3333";
    ctx.shadowBlur = 6 + Math.sin(pulse * 0.15) * 2;
    drawCell(ctx, x, y, FOOD_C, FOOD_HI, FOOD_SH, true);
  }
  
  ctx.restore();
}

function drawDeadSnake(ctx: CanvasRenderingContext2D, snake: { x: number; y: number }[], frame: number) {
  snake.forEach((seg, i) => {
    const x = BX + seg.x * CS, y = BY + seg.y * CS;
    const alpha = Math.max(0, 1 - frame / 40);
    ctx.globalAlpha = alpha;
    // Exploding particles effect on death
    const s = 1 + (frame / 20) * (i % 2 === 0 ? 1.2 : 0.8);
    const cx = x + CS / 2, cy = y + CS / 2;
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
    drawCell(ctx, x, y, "#553333", "#774444", "#331111", true);
    ctx.restore();
    ctx.globalAlpha = 1;
  });
}

function drawPreview(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const CW = canvas.width, CH = canvas.height;
  ctx.clearRect(0, 0, CW, CH);
  const body = [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }];
  const food = { x: 5, y: 2 };
  const ps = 4;
  ctx.fillStyle = "#44ff66"; ctx.fillRect(body[0].x * ps, body[0].y * ps, ps, ps);
  ctx.fillStyle = "#22cc44";
  body.slice(1).forEach(s => ctx.fillRect(s.x * ps, s.y * ps, ps, ps));
  ctx.fillStyle = "#ff3333"; ctx.fillRect(food.x * ps, food.y * ps, ps, ps);
}

interface SnakeGameProps {
  onAction: (type: string) => void;
}

export default function SnakeGame({ onAction }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef<any>(null);
  const lastT = useRef(0);
  const raf = useRef<number>(0);
  const pulse = useRef(0);

  const [ui, setUI] = useState({
    score: 0, hi: 0, level: 0, length: 1,
    phase: "start" as string, ai: false,
  });

  const hiRef = useRef(0);

  // Auto-start game when component mounts
  useEffect(() => {
    init(false);
  }, []);

  const init = useCallback((ai = false) => {
    const snake = [{ x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }];
    const food = spawnFood(snake);
    gs.current = {
      snake, food,
      bonusFood: null as any, bonusTimer: 0,
      dir: DIR.RIGHT, inputQueue: [] as {x:number, y:number}[],
      score: 0, level: 0, length: 3,
      moveTimer: 0, moveInterval: LEVEL_SPEEDS[0],
      eatAnim: 0, deathFrame: 0,
      phase: "playing", ai,
    };
    setUI(u => ({ ...u, score: 0, level: 0, length: 3, phase: "playing", ai }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let live = true;

    function loop(ts: number) {
      if (!live) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf.current = requestAnimationFrame(loop);
        return;
      }
      // Clamp delta-time to 50ms to prevent massive jumps on lag/tabbing out
      const dt = Math.min(ts - lastT.current, 50); lastT.current = ts;
      pulse.current += dt;
      const g = gs.current;

      if (g && g.phase === "playing") {
        if (g.ai && g.food) {
          const aiDir = aiBFS(g.snake, g.food);
          const dirKey = Object.keys(DIR).find(k => DIR[k] === g.dir) || "RIGHT";
          const oppKey = OPPOSITE[dirKey];
          const aiDirKey = Object.keys(DIR).find(k => DIR[k] === aiDir);
          if (aiDir && aiDirKey !== oppKey) {
            if (g.inputQueue.length === 0) g.inputQueue.push(aiDir);
          }
        }

        g.moveTimer += dt;
        if (g.moveTimer >= g.moveInterval) {
          g.moveTimer -= g.moveInterval; // Precise carry-over, not reset to 0
          
          if (g.inputQueue.length > 0) {
            g.dir = g.inputQueue.shift();
          }

          const head = g.snake[0];
          const next = { x: head.x + g.dir.x, y: head.y + g.dir.y };

          if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
            g.phase = "dying"; g.deathFrame = 0;
          } else {
            const body = g.snake.slice(0, -1);
            if (body.some((s: any) => s.x === next.x && s.y === next.y)) {
              g.phase = "dying"; g.deathFrame = 0;
            } else {
              const ateFood = g.food && next.x === g.food.x && next.y === g.food.y;
              const ateBonus = g.bonusFood && next.x === g.bonusFood.x && next.y === g.bonusFood.y;

              if (ateFood || ateBonus) {
                g.snake = [next, ...g.snake];
                g.eatAnim = 8;
                const pts = ateBonus ? 5 : 1;
                g.score += pts;
                const newLevel = getLevel(g.score);
                g.level = newLevel;
                g.moveInterval = LEVEL_SPEEDS[Math.min(newLevel, LEVEL_SPEEDS.length - 1)];
                if (ateFood) { g.food = spawnFood(g.snake); }
                if (ateBonus) { g.bonusFood = null; g.bonusTimer = 0; }
                if (!g.bonusFood && Math.random() < 0.15 && g.snake.length > 3) {
                  g.bonusFood = spawnFood(g.snake, true);
                  g.bonusTimer = 10000;
                }
                if (g.score > hiRef.current) hiRef.current = g.score;
                setUI(u => ({ ...u, score: g.score, hi: hiRef.current, level: g.level, length: g.snake.length }));
              } else {
                g.snake = [next, ...g.snake.slice(0, -1)];
              }

              if (g.eatAnim > 0) g.eatAnim--;

              if (g.bonusFood) {
                g.bonusTimer -= g.moveInterval;
                if (g.bonusTimer <= 0) g.bonusFood = null;
              }
            }
          }
        }
      }

      if (g && g.phase === "dying") {
        g.deathFrame++;
        if (g.deathFrame > 45) { g.phase = "gameover"; setUI(u => ({ ...u, phase: "gameover" })); }
      }

      drawBg(ctx);
      drawBoard(ctx);
      if (g) {
        if (g.food) drawFood(ctx, g.food, pulse.current);
        if (g.bonusFood) drawFood(ctx, g.bonusFood, pulse.current + 50);
        if (g.phase === "dying") drawDeadSnake(ctx, g.snake, g.deathFrame);
        else drawSnake(ctx, g.snake, g.eatAnim || 0);
      }

      drawPreview(prevRef.current);
      raf.current = requestAnimationFrame(loop);
    }

    lastT.current = performance.now();
    raf.current = requestAnimationFrame(loop);
    return () => { live = false; cancelAnimationFrame(raf.current); };
  }, []);

  useEffect(() => {
    // ═══ GAMEBOY CONTROLLER MAPPINGS ═══
    // D-PAD: Arrow keys
    // A: Z (Start/Confirm)
    // B: X (Pause/Back)
    function handleInput(action: string) {
      const g = gs.current;
      const phase = g?.phase ?? ui.phase;

      if (action === "SELECT") {
        if (g && (phase === "playing" || phase === "start")) { g.ai = !g.ai; setUI(u => ({ ...u, ai: g.ai })); return; }
      }
      
      if (action === "START" || action === "A") {
        if (phase === "start" || phase === "gameover") { init(false); return; }
        if (phase === "paused") { if (g) g.phase = "playing"; setUI(u => ({ ...u, phase: "playing" })); return; }
      }
      
      if (action === "B") {
        if (g && phase !== "gameover" && phase !== "start") {
          g.phase = g.phase === "paused" ? "playing" : "paused";
          setUI(u => ({ ...u, phase: g.phase })); return;
        }
      }

      // X/Y buttons (A/S keys) mappings were previously mapped. We'll map them via generic actions if possible, 
      // but standard GameBoy logic for boost:
      if (action === "X" || action === "Y") {
        if (g && phase === "playing") {
          g.moveInterval = Math.max(30, LEVEL_SPEEDS[Math.min(9, g.level + 2)]);
          return;
        }
      }
      
      const DIR_STR_MAP: Record<string, {x:number, y:number}> = {
        UP: DIR.UP, DOWN: DIR.DOWN, LEFT: DIR.LEFT, RIGHT: DIR.RIGHT
      };
      const d = DIR_STR_MAP[action];
      if (d) {
        if (g && phase === "start") {
           // Should not happen anymore, but just in case
           g.phase = "playing"; setUI(u => ({ ...u, phase: "playing" }));
        }
        
        if (g && g.phase === "playing") {
          const effectiveDir = g.inputQueue.length > 0 ? g.inputQueue[g.inputQueue.length - 1] : g.dir;
          const dirKey = Object.keys(DIR).find(k => DIR[k] === effectiveDir) || "RIGHT";
          const oppKey = OPPOSITE[dirKey];
          const dKey = Object.keys(DIR).find(k => DIR[k] === d);
          
          if (dKey !== oppKey && dKey !== dirKey && g.inputQueue.length < 3) {
            g.inputQueue.push(d);
          }
        }
      }
    }
    
    function onKey(e: KeyboardEvent) {
      const KEY_TO_ACTION: Record<string, string> = {
        ArrowUp: "UP", KeyW: "UP",
        ArrowDown: "DOWN", KeyS: "DOWN",
        ArrowLeft: "LEFT", KeyA: "LEFT",
        ArrowRight: "RIGHT", KeyD: "RIGHT",
        Enter: "START", KeyZ: "A",
        KeyX: "B",
        ShiftLeft: "SELECT", ShiftRight: "SELECT"
      };
      const action = KEY_TO_ACTION[e.code];
      if (action) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.code)) e.preventDefault();
        handleInput(action);
      }
    }
    
    window.addEventListener("keydown", onKey);
    (window as any).__gameInput = handleInput;
    return () => {
      window.removeEventListener("keydown", onKey);
      delete (window as any).__gameInput;
    };
  }, [init, ui.phase]);

  const touch = useRef<any>({});
  const onTS = (e: React.TouchEvent) => { e.preventDefault(); touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }; };
  const onTE = (e: React.TouchEvent) => {
    e.preventDefault();
    const g = gs.current, phase = g?.phase ?? ui.phase;
    if (phase === "start" || phase === "gameover") { init(false); return; }
    if (!g || g.phase !== "playing") return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    let d;
    if (Math.abs(dx) > Math.abs(dy)) d = dx < 0 ? DIR.LEFT : DIR.RIGHT;
    else d = dy < 0 ? DIR.UP : DIR.DOWN;
    
    const effectiveDir = g.inputQueue.length > 0 ? g.inputQueue[g.inputQueue.length - 1] : g.dir;
    const dirKey = Object.keys(DIR).find(k => DIR[k] === effectiveDir) || "RIGHT";
    const oppKey = OPPOSITE[dirKey];
    const dKey = Object.keys(DIR).find(k => DIR[k] === d);
    
    if (dKey !== oppKey && dKey !== dirKey && g.inputQueue.length < 3) {
      g.inputQueue.push(d);
    }
  };

  useEffect(() => {
    (window as any).__gameInput = (type: string) => {
      const g = gs.current;
      if (!g) return;
      const phase = g.phase;

      if (phase === "start") {
        if (type === "START") init(false);
        return;
      }

      if (phase === "gameover") {
        if (type === "START") init(false);
        return;
      }

      if (type === "START") {
        g.phase = g.phase === "paused" ? "playing" : "paused";
        setUI(u => ({ ...u, phase: g.phase }));
        return;
      }

      // Y toggles AI mode
      if (type === "Y") {
        g.ai = !g.ai;
        setUI(u => ({ ...u, ai: g.ai }));
        return;
      }
      
      if (!g || g.phase !== "playing") return;
      
      const KEY_MAP: Record<string, { x: number; y: number }> = {
        UP: DIR.UP, DOWN: DIR.DOWN, LEFT: DIR.LEFT, RIGHT: DIR.RIGHT
      };
      const d = KEY_MAP[type];
      if (d) {
        const effectiveDir = g.inputQueue.length > 0 ? g.inputQueue[g.inputQueue.length - 1] : g.dir;
        const dirKey = Object.keys(DIR).find(k => DIR[k] === effectiveDir) || "RIGHT";
        const oppKey = OPPOSITE[dirKey];
        const dKey = Object.keys(DIR).find(k => DIR[k] === d);
        if (dKey !== oppKey && dKey !== dirKey && g.inputQueue.length < 3) {
          g.inputQueue.push(d);
        }
      }
    };
    return () => { delete (window as any).__snakeInput; };
  }, [init, onAction]);

  const spd = Math.min(9, ui.level);

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">START</span>
            <span className="vintage-ha">PAUSE</span>
          </div>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">Y</span>
            <span className="vintage-ha">AI</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">SEL</span>
            <span className="vintage-ha">EXIT</span>
          </div>
        </>
      }
    >
      <div onTouchStart={onTS} onTouchEnd={onTE} style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        fontFamily: "'Press Start 2P', monospace",
        overflow: "hidden",
        background: "#060c1a",
      }}>
        <canvas ref={canvasRef} className="game-canvas" width={130} height={134} style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "130px",
          height: "134px",
          display: "block",
          imageRendering: "pixelated",
          zIndex: 1,
        }} />

        <div style={{
          width: "130px",
          height: "100%",
          flex: "0 0 130px",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}>
          {ui.phase === "start" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "130px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "128px",
                border: "1px solid #22cc44",
                padding: "4px 6px",
                background: "rgba(4,8,20,0.97)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#22cc44" }}>SNAKE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#1a5022" }}>EAT · GROW · SURVIVE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ PRESS START</div>
              </div>
            </div>
          )}
          {ui.phase === "paused" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "130px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "128px",
                border: "1px solid #22cc44",
                padding: "4px 6px",
                background: "rgba(4,8,20,0.97)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
              }}>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#22cc44" }}>PAUSE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ PRESS B</div>
              </div>
            </div>
          )}
          {ui.phase === "gameover" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "130px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "128px",
                border: "1px solid #ff3333",
                padding: "6px 8px",
                background: "rgba(4,8,20,0.97)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#ff3333" }}>GAME</div>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#ff3333", marginTop: "2px" }}>OVER</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#1a5022" }}>SCORE</div>
                <div className="ov-score" style={{ fontSize: "6px", color: "#ffd700" }}>{String(ui.score).padStart(4, "0")}</div>
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#1a5022", marginTop: "2px" }}>LEN {ui.length} · LV {ui.level}</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ PRESS START</div>
              </div>
            </div>
          )}
        </div>

        {/* panel column */}
        <div className="panel-col" style={{
          width: "52px",
          height: "100%",
          flex: "0 0 52px",
          display: "flex",
          flexDirection: "column",
          padding: "3px 3px",
          gap: 0,
          borderLeft: "1px solid #0d3010",
          background: "rgba(4,8,20,0.78)",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
          justifyContent: "space-between",
        }}>
          {/* Top section: scores */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {ui.ai && (
              <div className="ai-badge" style={{
                fontSize: "4px",
                background: "rgba(34,204,68,0.15)",
                border: "1px solid #22cc44",
                color: "#22cc44",
                padding: "1px 2px",
                borderRadius: "1px",
                textAlign: "center",
                marginBottom: "2px",
                letterSpacing: "0.5px",
                animation: "gp 1.5s ease-in-out infinite",
              }}>AI ON</div>
            )}

            <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1 }}>SCORE</div>
            <div className="p-val p-score" style={{ fontSize: "7px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "3px", color: "#c8e0ff" }}>{String(ui.score).padStart(4, "0")}</div>

            <div className="p-sep" style={{ height: "1px", background: "#0d3010", flexShrink: 0 }} />
            <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginTop: "2px" }}>HI-SCORE</div>
            <div className="p-val p-hi" style={{ fontSize: "7px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "3px", color: "#ffd700" }}>{String(ui.hi).padStart(4, "0")}</div>
          </div>

          {/* Middle section: stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <div className="p-sep" style={{ height: "1px", background: "#0d3010", flexShrink: 0 }} />
            <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginTop: "2px" }}>LENGTH</div>
            <div className="p-val p-len" style={{ fontSize: "7px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "3px", color: "#22cc44" }}>{String(ui.length).padStart(3, "0")}</div>

            <div className="p-sep" style={{ height: "1px", background: "#0d3010", flexShrink: 0 }} />
            <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginTop: "2px" }}>LEVEL</div>
            <div className="p-val p-lv" style={{ fontSize: "7px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "3px", color: "#88ff99" }}>{String(ui.level).padStart(2, "0")}</div>
          </div>

          {/* Bottom section: speed + preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <div className="p-sep" style={{ height: "1px", background: "#0d3010", flexShrink: 0 }} />
            <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginTop: "2px" }}>SPEED</div>
            <div className="speed-bar" style={{ display: "flex", gap: "1px", marginTop: "2px", marginBottom: "3px" }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="spd-seg" style={{
                  height: "5px",
                  flex: 1,
                  borderRadius: "1px",
                  transition: "background 0.2s",
                  background: i <= spd ? "#22cc44" : "rgba(34,204,68,0.1)",
                  boxShadow: i <= spd ? "0 0 3px #22cc44" : "none",
                }} />
              ))}
            </div>

            <div className="p-sep" style={{ height: "1px", background: "#0d3010", flexShrink: 0 }} />
            <div className="preview-wrap" style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px 0",
            }}>
              <canvas ref={prevRef} className="prev-canvas" width={40} height={20} style={{
                display: "block",
                imageRendering: "pixelated",
              }} />
            </div>
          </div>
        </div>
    </div>
    </OSLayout>
  );
}
