import React, { useEffect, useRef, useState, useCallback } from "react";
import OSLayout from "./components/OSLayout";
// @ts-ignore
import { NES } from "jsnes";

interface NESEmulatorProps {
  onAction: (type: string) => void;
}

// NES controller button indices
const BTN: Record<string, number> = {
  A: 0, B: 1, SELECT: 2, START: 3,
  UP: 4, DOWN: 5, LEFT: 6, RIGHT: 7,
};

export default function NESEmulator({ onAction }: NESEmulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nesRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Create NES, load ROM, start loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(256, 240);

    const nes = new NES({
      onFrame: (frameBuffer: any) => {
        // jsnes outputs each pixel as 0x00BBGGRR
        // Canvas ImageData is [R, G, B, A] per pixel
        for (let i = 0; i < 256 * 240; i++) {
          const px = frameBuffer[i];
          const off = i * 4;
          imageData.data[off]     = px & 0xff;         // R
          imageData.data[off + 1] = (px >> 8) & 0xff;  // G
          imageData.data[off + 2] = (px >> 16) & 0xff;  // B
          imageData.data[off + 3] = 0xff;               // A
        }
        ctx.putImageData(imageData, 0, 0);
      },
      onAudioSample: () => {
        // Audio disabled to prevent lag
      },
    });

    nesRef.current = nes;

    // Load ROM
    fetch("/roms/smb.nes")
      .then((res) => {
        if (!res.ok) throw new Error("ROM file not found");
        return res.arrayBuffer();
      })
      .then((buffer) => {
        const bytes = new Uint8Array(buffer);
        let romStr = "";
        for (let i = 0; i < bytes.length; i++) {
          romStr += String.fromCharCode(bytes[i]);
        }
        nes.loadROM(romStr);

        // Start frame loop (throttled to 60 FPS)
        let lastTime = performance.now();
        const fpsInterval = 1000 / 60; // 60 FPS

        const loop = (time: number) => {
          frameRef.current = requestAnimationFrame(loop);
          const elapsed = time - lastTime;
          
          if (elapsed >= fpsInterval) {
            lastTime = time - (elapsed % fpsInterval);
            nes.frame();
          }
        };
        frameRef.current = requestAnimationFrame(loop);
      })
      .catch((err) => {
        console.error("ROM load error:", err);
        setError("Place smb.nes in public/roms/");
      });

    return () => {
      cancelAnimationFrame(frameRef.current);
      nesRef.current = null;
    };
  }, []);

  // Input: called from App.tsx with (type, isDown)
  // isDown=true → press, isDown=false → release
  const handleInput = useCallback((type: string, isDown: boolean = true) => {
    const nes = nesRef.current;
    if (!nes) return;

    const btn = BTN[type];
    if (btn === undefined) return;

    if (isDown) {
      nes.buttonDown(1, btn);
    } else {
      nes.buttonUp(1, btn);
    }
  }, []);

  // Expose to window + keyboard support with GameBoy controller bindings
  useEffect(() => {
    (window as any).__nesInput = handleInput;

    const held = new Set<string>();

    // ═══ GAMEBOY CONTROLLER MAPPINGS FOR NES ═══
    // D-PAD: Arrow keys
    // A: Z (Jump)
    // B: X (Run)
    // START: Enter
    // SELECT: Shift
    const keyMap: Record<string, string> = {
      // D-PAD
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",

      // A button (Jump)
      KeyZ: "A",

      // B button (Run)
      KeyX: "B",

      // START
      Enter: "START",

      // SELECT
      ShiftLeft: "SELECT",
      ShiftRight: "SELECT",
    };

    const onDown = (e: KeyboardEvent) => {
      const action = keyMap[e.key];
      if (!action || held.has(e.key)) return;
      held.add(e.key);
      e.preventDefault();
      handleInput(action, true);
    };

    const onUp = (e: KeyboardEvent) => {
      const action = keyMap[e.key];
      if (!action) return;
      held.delete(e.key);
      e.preventDefault();
      handleInput(action, false);
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      delete (window as any).__nesInput;
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [handleInput]);

  const nesHints = (
    <>
      <div className="vintage-hint">
        <span className="vintage-hk">A</span>
        <span className="vintage-ha">JUMP</span>
      </div>
      <div className="vintage-hint">
        <span className="vintage-hk">B</span>
        <span className="vintage-ha">RUN</span>
      </div>
      <div className="vintage-hint">
        <span className="vintage-hk">X/Y</span>
        <span className="vintage-ha">ITEM</span>
      </div>
      <div className="vintage-hint">
        <span className="vintage-hk">D-PAD</span>
        <span className="vintage-ha">MOVE</span>
      </div>
      <div className="vintage-hint">
        <span className="vintage-hk">START</span>
        <span className="vintage-ha">PAUSE</span>
      </div>
      <div className="vintage-hint">
        <span className="vintage-hk">SEL</span>
        <span className="vintage-ha">OPT</span>
      </div>
    </>
  );

  return (
    <OSLayout customHints={nesHints}>
      <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-0 p-1">
      {error ? (
        <div className="flex flex-col items-center justify-center text-center p-4 font-['Press_Start_2P',sans-serif]">
          <div className="text-[8px] text-red-500 mb-3 animate-pulse">ROM MISSING</div>
          <div className="text-[5px] text-white/80 leading-relaxed max-w-[160px]">
            Place <span className="text-yellow-400">smb.nes</span> in <span className="text-blue-400">public/roms/</span>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={256}
          height={240}
          className="max-w-full max-h-full object-contain shadow-2xl"
          style={{ imageRendering: "pixelated" }}
        />
      )}
      </div>
    </OSLayout>
  );
}
