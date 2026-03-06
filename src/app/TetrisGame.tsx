import React, { useEffect, useRef, useState, useCallback } from "react";

// ═══ LAYOUT CONSTANTS ═══
// Responsive: screen is 210px × 172px (fits within 246px × 196px container with padding)
const W = 210;
const GAME_H = 160;
// board
const COLS = 10, ROWS = 20, CS = 8; // 10×8=80px wide, 20×8=160px tall — perfect fit
const BX = 2, BY = 0; // board inside game-area canvas

// ═══ TETROMINOES ═══
const TETS = [
  { r: [[[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]], c: "#00d4ff", h: "#88eeff", s: "#006688" },
  { r: [[[1, 1], [1, 1]]], c: "#ffd700", h: "#fff099", s: "#aa8800" },
  { r: [[[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]], c: "#cc44ff", h: "#ee99ff", s: "#770099" },
  { r: [[[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]]], c: "#22cc44", h: "#77ff88", s: "#116622" },
  { r: [[[1, 1, 0], [0, 1, 1], [0, 0, 0]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]]], c: "#ff3333", h: "#ff9988", s: "#991111" },
  { r: [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [0, 0, 1]], [[0, 1, 0], [0, 1, 0], [1, 1, 0]]], c: "#4466ff", h: "#99bbff", s: "#223399" },
  { r: [[[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[0, 0, 0], [1, 1, 1], [1, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]]], c: "#ff8800", h: "#ffcc66", s: "#994400" },
];
const KICKS = [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1], [2, 0], [-2, 0]];
const SCORE_TBL = [0, 40, 100, 300, 1200];

// ═══ PURE GAME FUNCTIONS ═══
const mkBoard = () => Array.from({ length: ROWS }, () => new Int8Array(COLS));
const getMat = (p: any) => { const r = TETS[p.type].r; return r[p.rot % r.length]; };
const mkPiece = () => ({ type: Math.floor(Math.random() * 7), rot: 0, x: 3, y: 0 });

function valid(board: any, p: any, dx = 0, dy = 0, rot: any = null) {
  const r = TETS[p.type].r;
  const mat = rot !== null ? r[((rot % r.length) + r.length) % r.length] : getMat(p);
  for (let row = 0; row < mat.length; row++)
    for (let col = 0; col < mat[row].length; col++) {
      if (!mat[row][col]) continue;
      const nx = p.x + col + dx, ny = p.y + row + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  return true;
}
function ghostRow(board: any, p: any) { let g = p.y; while (valid(board, p, 0, g - p.y + 1)) g++; return g; }
function doLock(board: any, p: any) {
  const nb = board.map((r: any) => new Int8Array(r));
  getMat(p).forEach((row: any, r: number) => row.forEach((v: number, c: number) => { if (v && p.y + r >= 0) nb[p.y + r][p.x + c] = p.type + 1; }));
  return nb;
}
function doClears(board: any) {
  const rows: number[] = [];
  board.forEach((r: any, i: number) => { if (r.every((v: number) => v)) rows.push(i); });
  if (!rows.length) return { board, rows };
  const nb = board.filter((_: any, i: number) => !rows.includes(i));
  while (nb.length < ROWS) nb.unshift(new Int8Array(COLS));
  return { board: nb, rows };
}
const calcScore = (n: number, lv: number) => (SCORE_TBL[n] || 0) * (lv + 1);
const calcInterval = (lv: number) => Math.max(80, 800 - lv * 70);

// ═══ CANVAS DRAW HELPERS ═══
function cell(ctx: CanvasRenderingContext2D, x: number, y: number, t: any, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = t.c; ctx.fillRect(x, y, CS, CS);
  ctx.fillStyle = t.h; ctx.fillRect(x, y, CS, 2); ctx.fillRect(x, y, 2, CS);
  ctx.fillStyle = t.s; ctx.fillRect(x, y + CS - 2, CS, 2); ctx.fillRect(x + CS - 2, y, 2, CS);
  ctx.globalAlpha = 1;
}

function drawBg(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#060c1a"; ctx.fillRect(0, 0, W, GAME_H);
  ctx.strokeStyle = "rgba(0,80,255,0.06)"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GAME_H); ctx.stroke(); }
  for (let y = 0; y < GAME_H; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const g = ctx.createRadialGradient(117, GAME_H + 20, 0, 117, GAME_H + 20, 160);
  g.addColorStop(0, "rgba(255,100,0,0.1)"); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, GAME_H);
}

function drawBoard(ctx: CanvasRenderingContext2D, board: any, flashRows: number[], flashT: number) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(BX - 1, BY, COLS * CS + 2, ROWS * CS);
  ctx.strokeStyle = "#1a3060"; ctx.lineWidth = 1;
  ctx.strokeRect(BX - 1, BY, COLS * CS + 2, ROWS * CS);
  ctx.strokeStyle = "rgba(26,48,96,0.3)";
  for (let c = 1; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(BX + c * CS, BY); ctx.lineTo(BX + c * CS, BY + ROWS * CS); ctx.stroke(); }
  for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.moveTo(BX, BY + r * CS); ctx.lineTo(BX + COLS * CS, BY + r * CS); ctx.stroke(); }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const v = board[r][c]; if (!v) continue;
    if (flashRows.includes(r)) {
      ctx.globalAlpha = Math.abs(Math.sin(flashT * Math.PI)) * 0.9 + 0.1;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(BX + c * CS, BY + r * CS, CS, CS);
      ctx.globalAlpha = 1;
    } else { cell(ctx, BX + c * CS, BY + r * CS, TETS[v - 1]); }
  }
}

function drawGhost(ctx: CanvasRenderingContext2D, board: any, piece: any) {
  const gy = ghostRow(board, piece); if (gy === piece.y) return;
  const t = TETS[piece.type];
  getMat(piece).forEach((row: any, r: number) => row.forEach((v: number, c: number) => {
    if (!v) return;
    ctx.strokeStyle = t.c; ctx.lineWidth = 1; ctx.globalAlpha = 0.28;
    ctx.strokeRect(BX + (piece.x + c) * CS + 0.5, BY + (gy + r) * CS + 0.5, CS - 1, CS - 1);
    ctx.globalAlpha = 1;
  }));
}

function drawPiece(ctx: CanvasRenderingContext2D, piece: any) {
  const t = TETS[piece.type];
  getMat(piece).forEach((row: any, r: number) => row.forEach((v: number, c: number) => {
    if (!v) return; const py = piece.y + r; if (py < 0) return;
    cell(ctx, BX + (piece.x + c) * CS, BY + py * CS, t);
  }));
}

function drawNextCanvas(canvas: HTMLCanvasElement | null, type: number | null) {
  if (!canvas || type === null) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const CW = canvas.width, CH = canvas.height;
  ctx.clearRect(0, 0, CW, CH);
  const t = TETS[type], mat = t.r[0];
  const rows = mat.length, cols = mat[0].length;
  const ox = Math.floor((CW - cols * CS) / 2), oy = Math.floor((CH - rows * CS) / 2);
  mat.forEach((row: any, r: number) => row.forEach((v: number, c: number) => { if (v) cell(ctx, ox + c * CS, oy + r * CS, t); }));
}

interface TetrisGameProps {
  onAction: (type: string) => void;
}

export default function TetrisGame({ onAction }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef<any>(null);
  const lastT = useRef(0);
  const raf = useRef<number>(0);

  const [ui, setUI] = useState({
    score: 0, lines: 0, level: 0, nextType: null as number | null, phase: "start" as string
  });

  const init = useCallback(() => {
    const p = mkPiece(), n = mkPiece();
    gs.current = {
      board: mkBoard(), piece: p, next: n,
      score: 0, lines: 0, level: 0,
      dropTimer: 0, dropInterval: 800,
      flashRows: [], flashT: 0, flashing: false,
      phase: "playing",
    };
    setUI({ score: 0, lines: 0, level: 0, nextType: n.type, phase: "playing" });
  }, []);

  const afterLock = useCallback((g: any) => {
    const locked = doLock(g.board, g.piece);
    const { board: cleared, rows } = doClears(locked);
    if (rows.length) {
      g.board = locked; g.flashRows = rows; g.flashT = 0; g.flashing = true;
      setTimeout(() => {
        const s = gs.current; if (!s) return;
        const newLines = s.lines + rows.length, newLevel = Math.floor(newLines / 10);
        s.board = cleared; s.lines = newLines; s.level = newLevel;
        s.score += calcScore(rows.length, s.level);
        s.dropInterval = calcInterval(newLevel);
        s.flashRows = []; s.flashing = false;
        s.piece = s.next; s.next = mkPiece();
        if (!valid(s.board, s.piece)) s.phase = "gameover";
        setUI(u => ({ ...u, score: s.score, lines: s.lines, level: s.level, nextType: s.next.type, phase: s.phase }));
      }, 200);
    } else {
      g.board = cleared; g.piece = g.next; g.next = mkPiece();
      if (!valid(g.board, g.piece)) g.phase = "gameover";
      setUI(u => ({ ...u, score: g.score, lines: g.lines, level: g.level, nextType: g.next.type, phase: g.phase }));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
      const g = gs.current;

      if (g && g.phase === "playing" && !g.flashing) {
        g.dropTimer += dt;
        if (g.dropTimer >= g.dropInterval) {
          g.dropTimer = 0;
          if (valid(g.board, g.piece, 0, 1)) g.piece = { ...g.piece, y: g.piece.y + 1 };
          else afterLock(g);
        }
      }
      if (g && g.flashing) g.flashT = Math.min(1, g.flashT + dt / 200);

      drawBg(ctx);
      if (g) {
        drawBoard(ctx, g.board, g.flashRows, g.flashT);
        if (g.phase === "playing" && !g.flashing) {
          drawGhost(ctx, g.board, g.piece);
          drawPiece(ctx, g.piece);
        }
      }
      drawNextCanvas(nextRef.current, g?.next?.type ?? null);
      raf.current = requestAnimationFrame(loop);
    }
    lastT.current = performance.now();
    raf.current = requestAnimationFrame(loop);
    return () => { live = false; cancelAnimationFrame(raf.current); };
  }, [afterLock]);

  useEffect(() => {
    // ═══ GAMEBOY CONTROLLER MAPPINGS ═══
    // D-PAD: Arrow keys (Move/Rotate)
    // A: Z (Rotate clockwise)
    // B: X (Pause/Back)
    // X: A (Rotate counter-clockwise)
    // Y: S (Toggle ghost piece hint)
    // START: Enter (Start game/Quit)
    // SELECT: Shift (N/A)
    function onKey(e: KeyboardEvent) {
      const g = gs.current;
      const phase = g?.phase ?? ui.phase;

      // START button - start/restart game or quit
      if (e.code === "Enter") {
        if (phase === "start" || phase === "gameover") { init(); return; }
        if (phase === "paused") { g.phase = "playing"; setUI(u => ({ ...u, phase: g.phase })); return; }
      }

      // SELECT button - N/A for Tetris
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        return;
      }

      // B button (X key) - pause/back
      if (e.code === "KeyX") {
        if (!g) return;
        g.phase = g.phase === "paused" ? "playing" : "paused";
        setUI(u => ({ ...u, phase: g.phase })); return;
      }

      // X button (A key) - rotate counter-clockwise
      if (e.code === "KeyA") {
        if (!g || g.phase !== "playing" || g.flashing) return;
        const p = g.piece;
        const nr = (p.rot - 1 + 4) % 4;
        for (const [dx, dy] of KICKS) if (valid(g.board, p, dx, dy, nr)) { g.piece = { ...p, x: p.x + dx, y: p.y + dy, rot: nr }; break; }
        return;
      }

      // Y button (S key) - toggle ghost piece hint
      if (e.code === "KeyS") {
        // Toggle ghost piece visibility (future feature)
        return;
      }

      // A button (Z key) - rotate clockwise
      if (e.code === "KeyZ") {
        if (!g || g.phase !== "playing" || g.flashing) return;
        const p = g.piece;
        const nr = (p.rot + 1) % 4;
        for (const [dx, dy] of KICKS) if (valid(g.board, p, dx, dy, nr)) { g.piece = { ...p, x: p.x + dx, y: p.y + dy, rot: nr }; break; }
        return;
      }

      if (!g || g.phase !== "playing" || g.flashing) return;
      const p = g.piece;

      // D-PAD - move piece
      if (e.code === "ArrowLeft") {
        if (valid(g.board, p, -1, 0)) g.piece = { ...p, x: p.x - 1 };
      }
      if (e.code === "ArrowRight") {
        if (valid(g.board, p, 1, 0)) g.piece = { ...p, x: p.x + 1 };
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        if (valid(g.board, p, 0, 1)) { g.piece = { ...p, y: p.y + 1 }; g.score++; }
      }
      if (e.code === "ArrowUp") {
        const nr = (p.rot + 1) % 4;
        for (const [dx, dy] of KICKS) if (valid(g.board, p, dx, dy, nr)) { g.piece = { ...p, x: p.x + dx, y: p.y + dy, rot: nr }; break; }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [init, afterLock, ui.phase]);

  useEffect(() => {
    (window as any).__tetrisInput = (type: string) => {
      const g = gs.current;
      if (!g) return;
      const phase = g.phase;
      if (type === "START") {
        onAction("QUIT_GAME");
        return;
      }
      if (phase === "start") { init(); return; }
      if (phase === "gameover") { if (type === "A" || type === "START") init(); return; }
      if (type === "B") {
        g.phase = g.phase === "paused" ? "playing" : "paused";
        setUI(u => ({ ...u, phase: g.phase }));
        return;
      }
      if (!g || g.phase !== "playing" || g.flashing) return;
      const p = g.piece;
      if (type === "LEFT") { if (valid(g.board, p, -1, 0)) g.piece = { ...p, x: p.x - 1 }; }
      if (type === "RIGHT") { if (valid(g.board, p, 1, 0)) g.piece = { ...p, x: p.x + 1 }; }
      if (type === "DOWN") { if (valid(g.board, p, 0, 1)) { g.piece = { ...p, y: p.y + 1 }; g.score++; } }
      if (type === "A" || type === "UP") {
        const rots = TETS[p.type].r, nr = (p.rot + 1) % rots.length;
        for (const [dx, dy] of KICKS) if (valid(g.board, p, dx, dy, nr)) { g.piece = { ...p, x: p.x + dx, y: p.y + dy, rot: nr }; break; }
      }
      if (type === "X" || type === "START") { // Hard drop or similar
        let np = { ...p }; while (valid(g.board, np, 0, 1)) { np = { ...np, y: np.y + 1 }; g.score += 2; }
        g.piece = np; afterLock(g);
      }
    };
    return () => { delete (window as any).__tetrisInput; };
  }, [init, afterLock, onAction]);

  const spd = Math.min(9, ui.level);

  return (
    <div className="screen" style={{
      position: "relative",
      width: "210px",
      height: "184px",
      overflow: "hidden",
      background: "#060c1a",
      fontFamily: "'Press Start 2P', monospace",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── ROW 1: HUD 12px ── */}
      <div className="hud" style={{
        width: "210px",
        height: "12px",
        flex: "0 0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4px",
        background: "rgba(4,8,20,0.98)",
        borderBottom: "1px solid #1a3060",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}>
        <span className="hud-title" style={{ fontSize: "5px", color: "#ff8c00", letterSpacing: "1px", lineHeight: "1" }}>TETRIS</span>
        <span className="hud-score" style={{ fontSize: "5px", color: "#c8e0ff", letterSpacing: "0.5px", lineHeight: "1" }}>SC {String(ui.score).padStart(7, "0")}</span>
        <span className="hud-lv" style={{ fontSize: "5px", color: "#ffd700", letterSpacing: "0.5px", lineHeight: "1" }}>LV {String(ui.level).padStart(2, "0")}</span>
      </div>

      {/* ── ROW 2: GAME AREA 160px ── */}
      <div className="game-area" style={{
        width: "210px",
        height: "160px",
        flex: "0 0 160px",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* full-area bg canvas */}
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

        {/* board column (transparent, just for overlay positioning) */}
        <div className="board-col" style={{
          width: "82px",
          height: "160px",
          flex: "0 0 82px",
          position: "relative",
          zIndex: 2,
        }}>
          {ui.phase === "start" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "82px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "74px",
                border: "1px solid #ff8c00",
                padding: "6px 6px",
                background: "rgba(4,8,20,0.96)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "7px", lineHeight: "1", letterSpacing: "1px", color: "#ff8c00" }}>TETRIS</div>
                <div className="ov-sep" style={{ height: "1px", background: "#1a3060", width: "100%" }} />
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#3a5888" }}>ALL 7 PIECES · SRS</div>
                <div className="ov-sep" style={{ height: "1px", background: "#1a3060", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ ANY KEY</div>
              </div>
            </div>
          )}
          {ui.phase === "paused" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "82px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "74px",
                border: "1px solid #ff8c00",
                padding: "6px 6px",
                background: "rgba(4,8,20,0.96)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "7px", lineHeight: "1", letterSpacing: "1px", color: "#ff8c00" }}>PAUSE</div>
                <div className="ov-sep" style={{ height: "1px", background: "#1a3060", width: "100%" }} />
                <div className="blink" style={{ fontSize: "4px", color: "#c8e0ff", letterSpacing: "0.3px", animation: "bl 0.8s step-end infinite" }}>▶ PRESS P</div>
              </div>
            </div>
          )}
          {ui.phase === "gameover" && (
            <div className="overlay" style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "82px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}>
              <div className="ov-box" style={{
                width: "74px",
                border: "1px solid #ff3333",
                padding: "6px 6px",
                background: "rgba(4,8,20,0.96)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}>
                <div className="ov-title" style={{ fontSize: "7px", lineHeight: "1", letterSpacing: "1px", color: "#ff3333" }}>GAME</div>
                <div className="ov-title" style={{ fontSize: "7px", lineHeight: "1", letterSpacing: "1px", color: "#ff3333", marginTop: "2px" }}>OVER</div>
                <div className="ov-sep" style={{ height: "1px", background: "#1a3060", width: "100%" }} />
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#3a5888" }}>SCORE</div>
                <div className="ov-score" style={{ fontSize: "6px", color: "#ffd700" }}>{String(ui.score).padStart(7, "0")}</div>
                <div className="ov-lbl" style={{ fontSize: "4px", color: "#3a5888", marginTop: "2px" }}>LV{ui.level} · {ui.lines}L</div>
                <div className="ov-sep" style={{ height: "1px", background: "#1a3060", width: "100%" }} />
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
          borderLeft: "1px solid #1a3060",
          background: "rgba(4,8,20,0.75)",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}>
          <div className="p-label" style={{ fontSize: "4px", color: "#3a5888", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>NEXT</div>
          <div className="next-wrap" style={{ alignSelf: "flex-start", marginBottom: "4px" }}>
            <div className="next-box" style={{
              width: "36px",
              height: "36px",
              border: "1px solid #1a3060",
              background: "rgba(0,0,0,0.45)",
              position: "relative",
              overflow: "hidden",
            }}>
              <canvas ref={nextRef} className="next-canvas" width={36} height={36} style={{
                display: "block",
                imageRendering: "pixelated",
                position: "absolute",
                top: 0,
                left: 0,
              }} />
            </div>
          </div>

          <div className="p-sep" style={{ height: "1px", background: "#1a3060", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#3a5888", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>SCORE</div>
          <div className="p-val p-score" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#c8e0ff" }}>{String(ui.score).padStart(7, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#1a3060", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#3a5888", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>LEVEL</div>
          <div className="p-val p-level" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#ffd700" }}>{String(ui.level).padStart(2, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#1a3060", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#3a5888", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>LINES</div>
          <div className="p-val p-lines" style={{ fontSize: "6px", lineHeight: 1, letterSpacing: "0.5px", marginBottom: "4px", color: "#22cc44" }}>{String(ui.lines).padStart(3, "0")}</div>

          <div className="p-sep" style={{ height: "1px", background: "#1a3060", margin: "3px 0", flexShrink: 0 }} />
          <div className="p-label" style={{ fontSize: "4px", color: "#3a5888", letterSpacing: "0.5px", lineHeight: 1, marginBottom: "2px" }}>SPEED</div>
          <div className="speed-bar" style={{ display: "flex", gap: "1px", marginTop: "1px" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="spd-seg" style={{
                height: "4px",
                flex: 1,
                borderRadius: "1px",
                transition: "background 0.2s",
                background: i <= spd ? "#ff8c00" : "rgba(255,140,0,0.12)",
                boxShadow: i <= spd ? "0 0 3px #ff8c00" : "none",
              }} />
            ))}
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
        borderTop: "1px solid #1a3060",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
      }}>
        {[["D-PAD", "MOVE"], ["A", "ROTATE"], ["B", "PAUSE"], ["X", "FLIP"], ["Y", "HINT"], ["START", "QUIT"]].map(([k, a]) => (
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
            <span className="ha" style={{ fontSize: "3.5px", color: "#3a5888", lineHeight: 1 }}>{a}</span>
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
