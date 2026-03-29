import React, { useState, useEffect } from "react";
import { useGameBoyStore } from "../../stores/gameBoyStore";

interface OSLayoutProps {
  children: React.ReactNode;
  customHints?: React.ReactNode;
}

const THEMES = [
  // 0: NEON RED
  { bg: "#0a0608", orange: "#ff3333", gold: "#ff8888", text: "#ffc8c8", dim: "#5a2828", border: "#3a1010" },
  // 1: EMERALD
  { bg: "#040e08", orange: "#22cc44", gold: "#88ff88", text: "#c8ffd0", dim: "#1a5028", border: "#0d3010" },
  // 2: VINTAGE OS (default)
  { bg: "#060c1a", orange: "#ff8c00", gold: "#ffd700", text: "#c8e0ff", dim: "#3a5888", border: "#1a3060" },
  // 3: COBALT
  { bg: "#060818", orange: "#3b82f6", gold: "#93c5fd", text: "#dbeafe", dim: "#1e3a5f", border: "#1e3060" },
];

export default function OSLayout({ children, customHints }: OSLayoutProps) {
  const [time, setTime] = useState("");
  const { isCartridgeBooting, activeOSModal, brightness, theme: themeIdx } = useGameBoyStore();

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = n.getHours();
      const m = n.getMinutes();
      const ap = h >= 12 ? "PM" : "AM";
      const hh = h % 12 || 12;
      setTime(
        `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`,
      );
    };
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);

  const t = THEMES[themeIdx] || THEMES[2];
  const themeVars: React.CSSProperties = {
    "--bg": t.bg,
    "--orange": t.orange,
    "--gold": t.gold,
    "--text": t.text,
    "--dim": t.dim,
    "--border": t.border,
  } as React.CSSProperties;

  const [bootAnim, setBootAnim] = useState(true);
  const [isScreensaver, setIsScreensaver] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBootAnim(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const reset = () => {
      setIsScreensaver(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScreensaver(true), 60000);
    };
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    reset();
    return () => {
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
      clearTimeout(timeout);
    };
  }, []);

  const brightnessOverlayOpacity = 1 - (brightness / 100);

  return (
    <div className={`vintage-ui ${bootAnim ? "tv-turn-on" : ""}`} style={{ ...themeVars, width: "182px", height: "158px", overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box", position: "relative", filter: "contrast(1.05) brightness(1.1)" }}>
      {/* Backgrounds */}
      <div className="vintage-screen-bg" />
      <div className="vintage-screen-glow" />
      <div className="vintage-scanlines" />
      <div className="vintage-noise" />
      <div className="vintage-glare" />

      {/* Brightness Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1000] bg-black"
        style={{ opacity: brightnessOverlayOpacity }}
      />

      {/* TOP NAV BAR - 12px LOCKED (appears on EVERY screen) */}
      <div className="vintage-hud" style={{ zIndex: 200, flex: "none", height: "12px", minHeight: "12px", maxHeight: "12px" }}>
        <div className="vintage-hud-sys">GAME BOY</div>
        <div className="vintage-hud-right">
          <div className="vintage-bat">
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s e"></div>
            <div className="vintage-bat-c"></div>
          </div>
          <span className="vintage-bat-n mr-[4px]">92%</span>
          <div className="vintage-hud-time">{time || "--:--"}</div>
        </div>
      </div>

      {/* CONTENT AREA - 134px (158 - 12 - 12 = 134) */}
      <div className={`vintage-content-area ${isCartridgeBooting ? 'os-boot-seq' : ''}`} style={{ flex: "none", height: "134px", minHeight: "134px", maxHeight: "134px", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        {children}

        {/* GLOBAL OS MODAL OVERLAY */}
        {activeOSModal && (
          <div className="os-modal-overlay" style={{
            position: "absolute",
            inset: 0,
            background: "rgba(6, 12, 26, 0.85)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px"
          }}>
            <div className="os-modal os-modal-content" style={{
              width: "140px",
              background: "#0a1428",
              border: "2px solid #ff3333",
              borderRadius: "2px",
              padding: "12px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(255,51,51,0.2)"
            }}>
              <span style={{ color: "#ff8c00", fontSize: "6px", marginBottom: "8px", textAlign: "center", lineHeight: "1.4" }}>SYSTEM ALERT</span>
              <span style={{ color: "#c8e0ff", fontSize: "5px", textAlign: "center", lineHeight: "1.5", marginBottom: "12px", padding: "0 4px", whiteSpace: "pre-wrap" }}>
                {activeOSModal}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className="vintage-hint" style={{ background: "rgba(0,0,0,0.5)", padding: "2px 4px", borderRadius: "1px", display: "flex", gap: "2px", alignItems: "center" }}>
                  <span className="vintage-hk" style={{ color: "#22cc44", fontSize: "5px" }}>A</span>
                  <span className="vintage-ha" style={{ fontSize: "4px" }}>OK</span>
                </span>
                <span className="vintage-hint" style={{ background: "rgba(0,0,0,0.5)", padding: "2px 4px", borderRadius: "1px", display: "flex", gap: "2px", alignItems: "center" }}>
                  <span className="vintage-hk" style={{ color: "#ff3333", fontSize: "5px" }}>B</span>
                  <span className="vintage-ha" style={{ fontSize: "4px" }}>CLOSE</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV BAR - 12px LOCKED (appears on EVERY screen) */}
      <div className="vintage-hints" style={{ zIndex: 200, flex: "none", height: "12px", minHeight: "12px", maxHeight: "12px" }}>
        {customHints || (
          <>
            <div className="vintage-hint">
              <span className="vintage-hk">A</span>
              <span className="vintage-ha">SELECT</span>
            </div>
            <div className="vintage-hint">
              <span className="vintage-hk">B</span>
              <span className="vintage-ha">BACK</span>
            </div>
          </>
        )}
      </div>

      {/* SCREENSAVER OVERLAY */}
      {isScreensaver && !activeOSModal && (
        <div className="absolute inset-0 z-[1001] bg-black flex flex-col items-center justify-center p-4">
          <div className="vintage-screen-glow opacity-50" />
          <div className="vintage-scanlines" />
          <div className="vintage-noise opacity-20" />
          
          <div className="animate-pulse flex flex-col items-center gap-[4px]">
            <span className="text-[10px] font-black tracking-widest text-[#ff3333] drop-shadow-[0_0_8px_rgba(255,51,51,0.8)]" style={{ fontFamily: "var(--font)" }}>GAME BOY</span>
            <span className="text-[5px] text-[#c8e0ff] mt-[4px]" style={{ fontFamily: "var(--font)" }}>STANDBY MODE</span>
            <div className="mt-[8px] flex items-center gap-[2px]">
              <span className="vintage-hk bg-[rgba(255,255,255,0.2)] border-white/40">ANY KEY</span>
              <span className="text-[4px] text-[#22cc44]" style={{ fontFamily: "var(--font)" }}>TO RESUME</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
