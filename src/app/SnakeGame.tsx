import React, { useEffect, useRef, useState, useCallback } from "react";

// ═══ LAYOUT ═══
// Responsive: screen is 210px × 172px (fits within 246px × 196px container with padding)
const W = 210, GAME_H = 160;

// ═══ BOARD ═══
const COLS = 20, ROWS = 20, CS = 8; // 20×8=160px board — perfect fit
const BX = 0, BY = 0;

// ═══ DIRECTIONS ═══
const DIR: Record<string, { x: number; y: number }> = { UP: { x: 0, y: -1 }, DOWN: { x: 0, y: 1 }, LEFT: { x: -1, y: 0 }, RIGHT: { x: 1, y: 0 } };
const OPPOSITE: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

// ═══ COLORS ═══
const GREEN_HEAD = "#44ff66", GREEN_BODY = "#22cc44", GREEN_DARK = "#116622";
const GREEN_HI = "#88ffaa", GREEN_SH = "#0a4418";
const FOOD_C = "#ff3333", FOOD_HI = "#ff9988", FOOD_SH = "#991111";
const FOOD2_C = "#ffd700", FOOD2_HI = "#fff099";
const BG = "#060c1a", GRID = "rgba(0,180,50,0.05)", BORDER = "#0d3010";

// ═══ LEVELS ═══
const LEVEL_SPEEDS = [220, 190, 165, 140, 120, 100, 85, 72, 60, 50];
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

// ═══ AI PATHFINDING (BFS) ═══
function aiBFS(snake: { x: number; y: number }[], food: { x: number; y: number }) {
  const head = snake[0];
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  const queue: { pos: { x: number; y: number }; path: { x: number; y: number }[] }[] = [{ pos: head, path: [] }];
  const visited = new Set([`${head.x},${head.y}`]);
  const dirs = Object.values(DIR);
  while (queue.length) {
    const { pos, path } = queue.shift()!;
    for (const d of dirs) {
      const nx = pos.x + d.x, ny = pos.y + d.y;
      const key = `${nx},${ny}`;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      if (occupied.has(key) || visited.has(key)) continue;
      if (nx === food.x && ny === food.y) return path[0] || d;
      visited.add(key);
      queue.push({ pos: { x: nx, y: ny }, path: [...path, d] });
    }
  }
  const safe = dirs.filter(d => {
    const nx = head.x + d.x, ny = head.y + d.y;
    return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !occupied.has(`${nx},${ny}`);
  });
  return safe[0] || dirs[0];
}

// ═══ DRAW HELPERS ═══
function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, c: string, hi: string, sh: string) {
  ctx.fillStyle = c; ctx.fillRect(x, y, CS, CS);
  ctx.fillStyle = hi; ctx.fillRect(x, y, CS, 2); ctx.fillRect(x, y, 2, CS);
  ctx.fillStyle = sh; ctx.fillRect(x, y + CS - 2, CS, 2); ctx.fillRect(x + CS - 2, y, 2, CS);
}

function drawBg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, GAME_H);
  ctx.strokeStyle = GRID; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += CS) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke(); }
  for (let y = 0; y < GAME_H; y += CS) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const g = ctx.createRadialGradient(80, GAME_H, 0, 80, GAME_H, 200);
  g.addColorStop(0, "rgba(34,204,68,0.07)"); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, GAME_H);
}

function drawBoard(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1;
  ctx.strokeRect(BX, BY, COLS * CS, ROWS * CS);
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: { x: number; y: number }[], eatAnim: number) {
  snake.forEach((seg, i) => {
    const x = BX + seg.x * CS, y = BY + seg.y * CS;
    if (i === 0) {
      const scale = eatAnim > 0 ? 1 + eatAnim * 0.06 : 1;
      if (scale !== 1) {
        const cx = x + CS / 2, cy = y + CS / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(scale, scale); ctx.translate(-cx, -cy);
      }
      drawCell(ctx, x, y, GREEN_HEAD, GREEN_HI, GREEN_DARK);
      const dx = snake[1] ? snake[0].x - snake[1].x : 0;
      const dy = snake[1] ? snake[0].y - snake[1].y : 0;
      ctx.fillStyle = "#060c1a";
      if (dy < 0) { ctx.fillRect(x + 1, y + 2, 2, 2); ctx.fillRect(x + 5, y + 2, 2, 2); }
      else if (dy > 0) { ctx.fillRect(x + 1, y + 4, 2, 2); ctx.fillRect(x + 5, y + 4, 2, 2); }
      else if (dx < 0) { ctx.fillRect(x + 2, y + 1, 2, 2); ctx.fillRect(x + 2, y + 5, 2, 2); }
      else { ctx.fillRect(x + 4, y + 1, 2, 2); ctx.fillRect(x + 4, y + 5, 2, 2); }
      if (scale !== 1) ctx.restore();
    } else {
      const t = i / snake.length;
      const r = Math.round(34 + (Math.floor(t * 4)) * 4);
      const gv = Math.round(204 - t * 80);
      drawCell(ctx, x, y, `rgb(${r},${gv},${Math.round(68 - t * 30)})`, GREEN_BODY, GREEN_SH);
    }
  });
}

function drawFood(ctx: CanvasRenderingContext2D, food: { x: number; y: number; bonus?: boolean }, pulse: number) {
  const x = BX + food.x * CS, y = BY + food.y * CS;
  if (food.bonus) {
    const s = 1 + Math.sin(pulse * 0.1) * 0.12;
    const cx = x + CS / 2, cy = y + CS / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
    drawCell(ctx, x, y, FOOD2_C, FOOD2_HI, "#aa8800");
    ctx.restore();
  } else {
    const s = 1 + Math.sin(pulse * 0.08) * 0.08;
    const cx = x + CS / 2, cy = y + CS / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
    drawCell(ctx, x, y, FOOD_C, FOOD_HI, FOOD_SH);
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(x + 1, y + 1, 2, 2);
    ctx.restore();
  }
}

function drawDeadSnake(ctx: CanvasRenderingContext2D, snake: { x: number; y: number }[], frame: number) {
  snake.forEach((seg) => {
    const x = BX + seg.x * CS, y = BY + seg.y * CS;
    const alpha = Math.max(0, 1 - frame / 40);
    ctx.globalAlpha = alpha;
    drawCell(ctx, x, y, "#553333", "#774444", "#331111");
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

  const init = useCallback((ai = false) => {
    const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    const food = spawnFood(snake);
    gs.current = {
      snake, food,
      bonusFood: null as any, bonusTimer: 0,
      dir: DIR.RIGHT, nextDir: DIR.RIGHT,
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
            g.nextDir = aiDir;
          }
        }

        g.moveTimer += dt;
        if (g.moveTimer >= g.moveInterval) {
          g.moveTimer = 0;
          g.dir = g.nextDir;

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
    // X: A (Boost speed)
    // Y: S (Boost speed)
    // START: Enter (Start game/Quit)
    // SELECT: Shift (Toggle AI)
    const KEY_DIR: Record<string, { x: number; y: number }> = {
      ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
    };
    function onKey(e: KeyboardEvent) {
      const g = gs.current;
      const phase = g?.phase ?? ui.phase;

      // SELECT button - toggle AI
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (g && (phase === "playing" || phase === "start")) { g.ai = !g.ai; setUI(u => ({ ...u, ai: g.ai })); return; }
      }

      // START button - start/restart game or quit
      if (e.code === "Enter") {
        if (phase === "start" || phase === "gameover") { init(false); return; }
        if (phase === "paused") { g.phase = "playing"; setUI(u => ({ ...u, phase: g.phase })); return; }
      }

      // B button (X key) - pause/back
      if (e.code === "KeyX") {
        if (g && phase !== "gameover") {
          g.phase = g.phase === "paused" ? "playing" : "paused";
          setUI(u => ({ ...u, phase: g.phase })); return;
        }
      }

      // X/Y buttons (A/S keys) - boost speed
      if (e.code === "KeyA" || e.code === "KeyS") {
        if (g && phase === "playing") {
          g.moveInterval = Math.max(30, LEVEL_SPEEDS[Math.min(9, g.level + 2)]);
          return;
        }
      }

      // A button (Z key) - start/confirm
      if (e.code === "KeyZ") {
        if (phase === "start" || phase === "gameover") { init(false); return; }
      }

      if (!g || phase !== "playing") return;
      const d = KEY_DIR[e.code];
      if (d) {
        e.preventDefault();
        const dirKey = Object.keys(DIR).find(k => DIR[k] === g.dir) || "RIGHT";
        const oppKey = OPPOSITE[dirKey];
        const dKey = Object.keys(DIR).find(k => DIR[k] === d);
        if (dKey !== oppKey) g.nextDir = d;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    const dirKey = Object.keys(DIR).find(k => DIR[k] === g.dir) || "RIGHT";
    const oppKey = OPPOSITE[dirKey];
    const dKey = Object.keys(DIR).find(k => DIR[k] === d);
    if (dKey !== oppKey) g.nextDir = d;
  };

  useEffect(() => {
    (window as any).__snakeInput = (type: string) => {
      const g = gs.current;
      if (!g) return;
      if (type === "START") {
        onAction("QUIT_GAME");
        return;
      }
      if (type === "SELECT") {
        g.ai = !g.ai;
        setUI(u => ({ ...u, ai: g.ai }));
        return;
      }
      if (type === "B") {
        g.phase = g.phase === "paused" ? "playing" : "paused";
        setUI(u => ({ ...u, phase: g.phase }));
        return;
      }
      if (g.phase === "start" || g.phase === "gameover") {
        if (type === "A" || type === "START") init(false);
        return;
      }
      const KEY_MAP: Record<string, { x: number; y: number }> = {
        UP: DIR.UP, DOWN: DIR.DOWN, LEFT: DIR.LEFT, RIGHT: DIR.RIGHT
      };
      const d = KEY_MAP[type];
      if (d) {
        const dirKey = Object.keys(DIR).find(k => DIR[k] === g.dir) || "RIGHT";
        const oppKey = OPPOSITE[dirKey];
        const dKey = Object.keys(DIR).find(k => DIR[k] === d);
        if (dKey !== oppKey) g.nextDir = d;
      }
    };
    return () => { delete (window as any).__snakeInput; };
  }, [init, onAction]);

  const spd = Math.min(9, ui.level);

  return (
    <div className="screen" onTouchStart={onTS} onTouchEnd={onTE} style={{
      position: "relative",
      width: "210px",
      height: "184px",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Press Start 2P', monospace",
      overflow: "hidden",
      background: "#060c1a",
    }}>
      {/* ── ROW 1: HUD 12px ── */}
      <div className="hud" style={{
        width: "210px",
        height: "12px",
        flex: "0 0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5px",
        background: "rgba(4,8,20,0.98)",
        borderBottom: "1px solid #0d3010",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}>
        <span className="hud-title" style={{ fontSize: "5px", color: "#22cc44", letterSpacing: "1px", lineHeight: 1 }}>SNAKE</span>
        <span className="hud-score" style={{ fontSize: "5px", color: "#c8e0ff", letterSpacing: "0.5px", lineHeight: 1 }}>SC {String(ui.score).padStart(4, "0")}</span>
        <span className="hud-hi" style={{ fontSize: "5px", color: "#ffd700", letterSpacing: "0.5px", lineHeight: 1 }}>HI {String(ui.hi).padStart(4, "0")}</span>
      </div>

      {/* ── ROW 2: GAME 160px ── */}
      <div className="game-area" style={{
        width: "210px",
        height: "160px",
        flex: "0 0 160px",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
      }}>
        <canvas ref={canvasRef} className="game-canvas" width={210} height={160} style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "210px",
          height: "160px",
          display: "block",
          imageRendering: "pixelated",
          zIndex: 1,
        }} />

        {/* board column for overlays */}
        <div className="board-col" style={{
          width: "160px",
          height: "160px",
          flex: "0 0 160px",
          position: "relative",
          zIndex: 2,
        }}>
          {ui.phase === "start" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "160px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "138px",
                border: "1px solid #22cc44",
                padding: "7px 8px",
                background: "rgba(4,8,20,0.97)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#22cc44" }}>SNAKE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#1a5022" }}>EAT · GROW · SURVIVE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ ANY KEY</div>
              </div>
            </div>
          )}
          {ui.phase === "paused" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "160px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "138px",
                border: "1px solid #22cc44",
                padding: "7px 8px",
                background: "rgba(4,8,20,0.97)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "8px", lineHeight: 1, letterSpacing: "1px", color: "#22cc44" }}>PAUSE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#0d3010", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ PRESS P</div>
              </div>
            </div>
          )}
          {ui.phase === "gameover" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "160px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "138px",
                border: "1px solid #ff3333",
                padding: "7px 8px",
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
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ ENTER</div>
              </div>
            </div>
          )}
        </div>

        {/* panel column */}
        <div className="panel-col" style={{
          flex: 1,
          height: "160px",
          display: "flex",
          flexDirection: "column",
          padding: "5px 5px 4px 6px",
          gap: 0,
          borderLeft: "1px solid #0d3010",
          background: "rgba(4,8,20,0.78)",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}>
          {ui.ai && (
            <div className="ai-badge" style={{
              fontSize: "4px",
              background: "rgba(34,204,68,0.15)",
              border: "1px solid #22cc44",
              color: "#22cc44",
              padding: "2px 4px",
              borderRadius: "1px",
              textAlign: "center",
              marginBottom: "3px",
              letterSpacing: "0.5px",
              animation: "gp 1.5s ease-in-out infinite",
            }}>AI ON</div>
          )}

          <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>SCORE</div>
          <div className="p-val p-score" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#c8e0ff" }}>{String(ui.score).padStart(4, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#0d3010", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>HI-SCORE</div>
          <div className="p-val p-hi" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#ffd700" }}>{String(ui.hi).padStart(4, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#0d3010", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>LENGTH</div>
          <div className="p-val p-len" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#22cc44" }}>{String(ui.length).padStart(3, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#0d3010", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>LEVEL</div>
          <div className="p-val p-lv" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#88ff99" }}>{String(ui.level).padStart(2, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#0d3010", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#1a5022", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>SPEED</div>
          <div className="speed-bar" style={{ display: "flex", gap: "1px", marginTop: "1px" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="spd-seg" style={{
                height: "4px",
                flex: 1,
                borderRadius: "1px",
                transition: "background 0.2s",
                background: i <= spd ? "#22cc44" : "rgba(34,204,68,0.1)",
                boxShadow: i <= spd ? "0 0 3px #22cc44" : "none",
              }} />
            ))}
          </div>

          <div className="p-sep" style={{ height: "1px", background: "#0d3010", margin: "3px 0", flexShrink: 0 }} />
          <div className="preview-wrap" style={{
            width: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            <canvas ref={prevRef} className="prev-canvas" width={40} height={20} style={{
              display: "block",
              imageRendering: "pixelated",
            }} />
          </div>
        </div>
      </div>

      {/* ── ROW 3: HINTS 12px ── */}
      <div className="hints" style={{
        width: "210px",
        height: "12px",
        flex: "0 0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        background: "rgba(4,8,20,0.98)",
        borderTop: "1px solid #0d3010",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}>
        {[["D-PAD", "MOVE"], ["A", "START"], ["B", "PAUSE"], ["X/Y", "BOOST"], ["SEL", "AI"], ["START", "QUIT"]].map(([k, a]) => (
          <div className="hint" key={k} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <span className="hk" style={{
              fontSize: "3.5px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "1px",
              padding: "1px 2px",
              color: "#fff",
              lineHeight: 1,
            }}>{k}</span>
            <span className="ha" style={{ fontSize: "3.5px", color: "#1a5022", lineHeight: 1 }}>{a}</span>
          </div>
        ))}
      </div>

      <div className="scanlines" style={{
        position: "absolute",
        top: "12px",
        left: 0,
        right: 0,
        bottom: "12px",
        zIndex: 50,
        pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.09) 2px,rgba(0,0,0,0.09) 3px)",
      }} />
      <div className="vignette" style={{
        position: "absolute",
        top: "12px",
        left: 0,
        right: 0,
        bottom: "12px",
        zIndex: 49,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.55) 100%)",
      }} />
    </div>
  );
}
