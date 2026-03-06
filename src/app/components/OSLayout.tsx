import React, { useState, useEffect } from "react";
import "../../styles/VintageOS.css";

interface OSLayoutProps {
  children: React.ReactNode;
  customHints?: React.ReactNode;
}

export default function OSLayout({ children, customHints }: OSLayoutProps) {
  const [time, setTime] = useState("");

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

  const [brightness, setBrightness] = useState(() =>
    parseInt(localStorage.getItem("gb_brightness") || "100", 10)
  );

  useEffect(() => {
    const handleStorage = () => {
      setBrightness(parseInt(localStorage.getItem("gb_brightness") || "100", 10));
    };
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(handleStorage, 500);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const brightnessOverlayOpacity = 1 - (brightness / 100);

  return (
    <div className="vintage-ui">
      {/* Backgrounds */}
      <div className="vintage-screen-bg" />
      <div className="vintage-screen-glow" />
      <div className="vintage-scanlines" />
      <div className="vintage-glare" />

      {/* Brightness Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1000] bg-black"
        style={{ opacity: brightnessOverlayOpacity }}
      />

      {/* TOP HUD - FIXED (Battery, Device Name, Time) */}
      <div className="vintage-hud" style={{ zIndex: 200 }}>
        <div className="vintage-hud-sys">GAME BOY</div>
        <div className="vintage-hud-right">
          <div className="vintage-bat">
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s"></div>
            <div className="vintage-bat-s e"></div>
            <div className="vintage-bat-c"></div>
          </div>
          <span className="vintage-bat-n">92%</span>
          <div className="vintage-hud-time">{time || "--:--"}</div>
        </div>
      </div>

      {/* CONTENT AREA - Scrollable */}
      <div className="vintage-content-area">
        {children}
      </div>

      {/* BOTTOM HINTS - FIXED (Key bindings - no D-PAD) */}
      <div className="vintage-hints" style={{ zIndex: 200 }}>
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
            <div className="vintage-hint">
              <span className="vintage-hk">X/Y</span>
              <span className="vintage-ha">ACTION</span>
            </div>
            <div className="vintage-hint">
              <span className="vintage-hk">START</span>
              <span className="vintage-ha">PLAY</span>
            </div>
            <div className="vintage-hint">
              <span className="vintage-hk">SEL</span>
              <span className="vintage-ha">OPT</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
