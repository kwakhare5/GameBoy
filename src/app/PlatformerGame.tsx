import { useState, useEffect, useCallback, useRef } from "react";
import OSLayout from "./components/OSLayout";

// --- Constants ---
const TILE = 16; 
const GRAVITY = 0.28;
const JUMP_FORCE = -5.6;
const MOVE_SPEED = 1.9;
const FRICTION = 0.82;
const MAX_FALL = 6;
const SCREEN_W = 224; // 14 tiles wide
const SCREEN_H = 160;
const TILES_Y = Math.ceil(SCREEN_H / TILE);

const HIGH_SCORE_KEY = "gameboy_mario_highscore";

// Tile types: 0=air, 1=ground, 2=brick, 3=coin, 4=qblock, 5=pipe_tl, 6=pipe_tr, 7=pipe_bl, 8=pipe_br, 9=flag, 10=cloud, 11=bush
function createLevel(): number[][] {
  const W = 220; 
  const H = TILES_Y;
  const map: number[][] = [];
  for (let x = 0; x < W; x++) {
    const col: number[] = new Array(H).fill(0);
    // Ground with some pits
    if (x < 68 || (x > 70 && x < 84) || (x > 86 && x < 150) || x > 152) {
      col[H - 1] = 1;
      col[H - 2] = 1;
    }
    map.push(col);
  }

  // Decorative clouds and bushes
  for (let x = 0; x < W; x += 15) {
     map[x][2] = 10; map[x+1][2] = 10; 
     map[x+5][H-3] = 11;
  }

  const layout = [
    { x: 16, y: H - 5, type: 4 },
    { x: 20, y: H - 5, type: 2 }, { x: 21, y: H - 5, type: 4 }, { x: 22, y: H - 5, type: 2 }, { x: 23, y: H - 5, type: 4 }, { x: 24, y: H - 5, type: 2 },
    { x: 22, y: H - 8, type: 4 },
    
    { x: 28, y: H - 4, h: 2 }, { x: 38, y: H - 5, h: 3 }, { x: 46, y: H - 6, h: 4 }, { x: 57, y: H - 6, h: 4 },

    { x: 80, y: H - 5, type: 2 }, { x: 81, y: H - 5, type: 4 }, { x: 82, y: H - 5, type: 2 },
    { x: 91, y: H - 8, type: 2 }, { x: 92, y: H - 8, type: 2 }, { x: 93, y: H - 8, type: 2 }, { x: 94, y: H - 8, type: 2 }, 

    { x: 134, y: H-3, steps: 4, dir: 1 },
    { x: 144, y: H-3, steps: 4, dir: -1 },

    { x: 208, y: H-12, type: 9 } // Final flag
  ];

  layout.forEach(item => {
    if ('h' in item) {
       for (let dy = 0; dy < (item as any).h; dy++) {
         const isTop = dy === (item as any).h - 1;
         const ty = H - 3 - dy;
         map[item.x][ty] = isTop ? 5 : 7;
         map[item.x + 1][ty] = isTop ? 6 : 8;
       }
    } else if ('steps' in item) {
       for (let i = 0; i < (item as any).steps; i++) {
         for (let j = 0; j <= i; j++) {
           const tx = (item as any).dir === 1 ? item.x + i : item.x - i;
           map[tx][H - 3 - j] = 2;
         }
       }
    } else {
       map[item.x][item.y] = item.type!;
    }
  });

  return map;
}

interface Enemy {
  x: number; y: number; vx: number; alive: boolean; type: 'goomba'; s: number;
}

function createEnemies(): Enemy[] {
  return [
    { x: 450, y: (TILES_Y-3.5)*TILE, vx: -0.7, alive: true, type: 'goomba', s: 0 },
    { x: 800, y: (TILES_Y-3.5)*TILE, vx: -0.7, alive: true, type: 'goomba', s: 0 },
    { x: 1200, y: (TILES_Y-3.5)*TILE, vx: -0.7, alive: true, type: 'goomba', s: 0 },
  ];
}

export default function PlatformerGame({ onAction }: { onAction: (type: string) => void }) {
  const [level, setLevel] = useState(createLevel);
  const [enemies, setEnemies] = useState(createEnemies);
  const [playerX, setPlayerX] = useState(48);
  const [playerY, setPlayerY] = useState((TILES_Y - 4) * TILE);
  const [vx, setVx] = useState(0);
  const [vy, setVy] = useState(0);
  const [onGround, setOnGround] = useState(false);
  const [cameraX, setCameraX] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0"));
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [phase, setPhase] = useState<"START" | "PLAYING" | "GAME_OVER" | "PAUSED" | "WIN">("START");
  const [pauseSelection, setPauseSelection] = useState<"RESUME" | "QUIT">("RESUME");
  const [facingRight, setFacingRight] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [anim, setAnim] = useState(0);

  const keys = useRef({ l: false, r: false, j: false, jh: false });
  const state = useRef({ px: playerX, py: playerY, vx, vy, g: onGround, cam: cameraX, sc: score, cn: coins, lv: lives, ph: phase, ai: aiEnabled, en: enemies, lvl: level });

  useEffect(() => {
    state.current = { px: playerX, py: playerY, vx, vy, g: onGround, cam: cameraX, sc: score, cn: coins, lv: lives, ph: phase, ai: aiEnabled, en: enemies, lvl: level };
  }, [playerX, playerY, vx, vy, onGround, cameraX, score, coins, lives, phase, aiEnabled, enemies, level]);

  const PW = 12; const PH = 16;
  const isSolid = (x: number, y: number) => {
    const tx = Math.floor(x / TILE); const ty = Math.floor(y / TILE);
    if (tx < 0 || tx >= state.current.lvl.length || ty < 0 || ty >= TILES_Y) return ty >= TILES_Y;
    const t = state.current.lvl[tx][ty];
    return t >= 1 && t <= 8;
  };

  const handleInput = useCallback((type: string) => {
    if (type === "SELECT") { setAiEnabled(p => !p); return; }
    if (phase === "START") { if (type === "A" || type === "START") setPhase("PLAYING"); return; }
    if (phase !== "PLAYING") {
      if (type === "A") {
        if (phase === "PAUSED") { if (pauseSelection === "RESUME") setPhase("PLAYING"); else onAction("QUIT_GAME"); }
        else { setLevel(createLevel()); setEnemies(createEnemies()); setPlayerX(48); setPlayerY((TILES_Y-4)*TILE); setVx(0); setVy(0); setScore(0); setCoins(0); setLives(3); setPhase("PLAYING"); setCameraX(0); }
      } else if (type === "B") onAction("QUIT_GAME");
      else if (type === "UP" || type === "DOWN") setPauseSelection(s => s === "RESUME" ? "QUIT" : "RESUME");
      return;
    }
    if (type === "B") { setPhase("PAUSED"); setPauseSelection("RESUME"); return; }
    if (aiEnabled) return;
    if (type === "LEFT") keys.current.l = true; if (type === "RIGHT") keys.current.r = true;
    if (type === "A" || type === "UP") { keys.current.j = true; keys.current.jh = true; }
  }, [phase, pauseSelection, aiEnabled, onAction]);

  useEffect(() => {
    (window as any).__platformerInput = handleInput;
    // ═══ GAMEBOY CONTROLLER MAPPINGS ═══
    // D-PAD: Arrow keys
    // A: Z (Jump)
    // B: X (Run)
    // START: Enter
    // SELECT: Shift (Toggle AI)
    const release = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") keys.current.l = false;
      if (e.code === "ArrowRight") keys.current.r = false;
      if (e.code === "KeyZ" || e.code === "ArrowUp") keys.current.jh = false;
    };
    
    const press = (e: KeyboardEvent) => {
      // SELECT - toggle AI
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        handleInput("SELECT");
        return;
      }
      // START - start game
      if (e.code === "Enter") {
        if (phase === "START" || phase === "GAME_OVER" || phase === "WIN") {
          handleInput("A");
        }
        return;
      }
      // D-PAD
      if (e.code === "ArrowLeft") keys.current.l = true;
      if (e.code === "ArrowRight") keys.current.r = true;
      // A button (Z) - Jump
      if (e.code === "KeyZ" || e.code === "ArrowUp") {
        keys.current.j = true;
        keys.current.jh = true;
      }
      // B button (X) - Run (treated as right for simplicity)
      if (e.code === "KeyX") keys.current.r = true;
    };
    
    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
    return () => { 
      delete (window as any).__platformerInput; 
      window.removeEventListener("keydown", press);
      window.removeEventListener("keyup", release); 
    };
  }, [handleInput, phase]);

  useEffect(() => {
    if (phase !== "PLAYING") return;
    const tick = () => {
      let { px, py, vx: cvx, vy: cvy, g, cam, sc, cn, lv, ph, ai, lvl, en } = state.current;
      if (ai) {
          keys.current.r = true;
          const ahead = isSolid(px + 24, py + 8) || !isSolid(px + 24, py+20) || en.some(e => e.alive && Math.abs(e.x - px) < 40);
          if (ahead) keys.current.j = true;
      }
      if (keys.current.l) cvx -= 0.35; else if (keys.current.r) cvx += 0.35; else cvx *= FRICTION;
      cvx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, cvx));
      let nx = px + cvx; if (nx < 0) nx = 0;
      if (cvx > 0) { if (isSolid(nx+PW, py+2) || isSolid(nx+PW, py+PH-2)) { nx = Math.floor((nx+PW)/TILE)*TILE-PW; cvx = 0; } }
      else if (cvx < 0) { if (isSolid(nx, py+2) || isSolid(nx, py+PH-2)) { nx = Math.ceil(nx/TILE)*TILE; cvx = 0; } }
      px = nx; if (cvx > 0.1) setFacingRight(true); else if (cvx < -0.1) setFacingRight(false);
      if (keys.current.j && g) { cvy = JUMP_FORCE; g = false; }
      keys.current.j = false; if (!keys.current.jh && cvy < 0) cvy *= 0.88;
      cvy += GRAVITY; if (cvy > MAX_FALL) cvy = MAX_FALL;
      let ny = py + cvy;
      if (cvy > 0) { if (isSolid(px+2, ny+PH) || isSolid(px+PW-2, ny+PH)) { ny = Math.floor((ny+PH)/TILE)*TILE-PH; cvy = 0; g = true; } else g = false; }
      else if (cvy < 0) { if (isSolid(px+2, ny) || isSolid(px+PW-2, ny)) {
        const tx = Math.floor((px+PW/2)/TILE); const ty = Math.floor(ny/TILE);
        if (lvl[tx][ty] === 4) { lvl[tx][ty] = 2; sc += 100; cn++; }
        ny = Math.ceil(ny/TILE)*TILE; cvy = 0;
      }}
      py = ny;
      if (py > SCREEN_H) { lv--; if (lv<=0) setPhase("GAME_OVER"); else { px = cam+32; py = 0; cvy = 0; } }
      if (px > (lvl.length-12)*TILE) setPhase("WIN");
      const nEn = en.map(e => {
        if (!e.alive) { if (e.s > 0) e.s--; return e; } e.x += e.vx;
        if (isSolid(e.x + (e.vx > 0 ? 12 : 0), e.y + 4) || !isSolid(e.x + (e.vx > 0 ? 12 : 0), e.y + 12)) e.vx = -e.vx;
        const dx = Math.abs(px + PW/2 - (e.x + 8)); const dy = Math.abs(py + PH/2 - (e.y + 8));
        if (dx < 12 && dy < 14) { if (cvy > 0 && py + PH < e.y + 8) { e.alive = false; e.s = 20; cvy = -2.5; sc += 200; } else { lv--; px = cam+32; py = 0; } }
        return e;
      });
      cam = Math.max(cam, Math.min(px - 100, (lvl.length * TILE) - SCREEN_W));
      setPlayerX(px); setPlayerY(py); setVx(cvx); setVy(cvy); setOnGround(g); setCameraX(cam); setScore(sc); setCoins(cn); setLives(lv); setEnemies(nEn); setAnim(f => f + 1);
    };
    const loop = setInterval(tick, 1000/60); return () => clearInterval(loop);
  }, [phase, aiEnabled]);

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint">
            <span className="vintage-hk">D-PAD</span>
            <span className="vintage-ha">MOVE</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">JUMP</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">B</span>
            <span className="vintage-ha">RUN</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">START</span>
            <span className="vintage-ha">START</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">SEL</span>
            <span className="vintage-ha">AI</span>
          </div>
        </>
      }
    >
      <div className="vintage-main-area">
        <div className="absolute inset-0 bg-[#5c94fc] font-['Press_Start_2P',sans-serif] overflow-hidden">
          {phase === "START" && <div className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center">
             <div className="text-[12px] text-white font-black italic mb-2 tracking-tighter drop-shadow-[2px_2px_#e40010]">SUPER AI MARIO</div>
             <div className="text-[5px] text-[#ffcc00] animate-pulse">PRESS A TO START</div>
          </div>}
          <div className="absolute top-1 left-2 text-[5px] text-white z-30 drop-shadow-[1px_1px_black]">MARIO {String(score).padStart(6,'0')}</div>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[5px] text-white z-30 drop-shadow-[1px_1px_black]">🪙x{coins}</div>
          <div className="absolute top-1 right-2 text-[5px] text-white z-30 drop-shadow-[1px_1px_black]">LIVES x{lives}</div>
          <div className="absolute inset-0" style={{ transform: `translateX(-${cameraX}px)` }}>
            {level.map((col, x) => col.map((t, y) => {
              if (t === 0) return null; let color = "#944018";
              if (t === 4) color = (anim % 40 < 20) ? "#f8d870" : "#f8b800";
              if (t >= 5 && t <= 8) color = "#00a800";
              if (t === 9) return <div key={`${x}-${y}`} className="absolute bg-white w-[2px] h-[100px]" style={{ left: x*TILE+7, top: y*TILE }}><div className="size-2 bg-red-600 absolute -left-1" /></div>;
              if (t === 10) return <div key={`${x}-${y}`} className="absolute bg-white/30 rounded-full w-8 h-3" style={{ left: x*TILE, top: y*TILE+32 }} />;
              if (t === 11) return <div key={`${x}-${y}`} className="absolute bg-[#00a800]/50 rounded-t-full w-6 h-3" style={{ left: x*TILE, top: y*TILE+13 }} />;
              return <div key={`${x}-${y}`} style={{ position: "absolute", left: x*TILE, top: y*TILE, width: TILE, height: TILE, background: color, border: "0.5px solid rgba(0,0,0,0.2)" }} />;
            }))}
            {enemies.map((e, i) => (e.alive || e.s > 0) ? <div key={i} style={{ position: "absolute", left: e.x, top: e.y+(e.alive?0:10), width: 14, height: e.alive?14:4, background: '#944018', borderRadius: e.alive?"4px 4px 0 0":"2px", border: "1px solid black" }} /> : null)}
            <div style={{ position: "absolute", left: playerX - cameraX + cameraX, top: playerY, width: PW, height: PH, transform: facingRight ? "" : "scaleX(-1)", zIndex: 25 }}>
              <div style={{ position: "absolute", inset: 0, boxShadow: `2px 0 0 #e40010, 4px 0 0 #e40010, 6px 0 0 #e40010, 2px 2px 0 #fac490, 4px 2px 0 #fac490, 6px 2px 0 black, 8px 2px 0 #fac490, 0px 4px 0 #fac490, 2px 4px 0 #fac490, 4px 4px 0 #fac490, 6px 4px 0 #fac490, 8px 4px 0 #fac490, 2px 6px 0 #e40010, 4px 6px 0 #0050c0, 6px 6px 0 #e40010, 0px 8px 0 #0050c0, 2px 8px 0 #e40010, 4px 8px 0 #0050c0, 6px 8px 0 #e40010, 8px 8px 0 #0050c0, 0px 10px 0 #0050c0, 2px 10px 0 #0050c0, 4px 10px 0 #0050c0, 6px 10px 0 #0050c0, 8px 10px 0 #0050c0, 2px 12px 0 #7c4c00, 6px 12px 0 #7c4c00, 0px 14px 0 #7c4c00, 2px 14px 0 #7c4c00, 6px 14px 0 #7c4c00, 8px 14px 0 #7c4c00` }} />
            </div>
          </div>
          {phase === "PAUSED" && <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 text-white text-[8px]">PAUSED<div className="mt-4 text-[6px]">{pauseSelection === "RESUME" ? "> " : " "}RESUME</div><div className="text-[6px]">{pauseSelection === "QUIT" ? "> " : " "}QUIT</div></div>}
          {phase === "GAME_OVER" && <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white text-[8px]">GAME OVER<div className="mt-4 text-[5px]">PRESS A TO RETRY</div></div>}
          {phase === "WIN" && <div className="absolute inset-0 bg-blue-900/80 flex flex-col items-center justify-center z-50 text-white text-[8px]">COURSE CLEAR!<div className="mt-4 text-[5px]">PRESS A TO CONTINUE</div></div>}
          {aiEnabled && <div className="absolute bottom-1 left-2 text-[4px] text-green-400 animate-pulse bg-black/40 px-1">AUTO</div>}
        </div>
      </div>
    </OSLayout>
  );
}
