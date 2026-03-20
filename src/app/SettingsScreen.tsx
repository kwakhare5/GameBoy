import { useState, useEffect, useCallback } from "react";
import OSLayout from "./components/OSLayout";
import { useGameBoySound } from "../hooks/useGameBoySound";

interface SettingsScreenProps {
  onAction?: (type: string) => void;
}

const THEMES = [
  { name: "NEON RED", color: "#ef4444" },
  { name: "EMERALD", color: "#22c55e" },
  { name: "VINTAGE", color: "#ff8c00" },
  { name: "COBALT", color: "#3b82f6" },
];

export default function SettingsScreen({ onAction }: SettingsScreenProps) {
  const { enabled, setEnabled, play } = useGameBoySound();
  const [activeIndex, setActiveIndex] = useState(0); // 0: Sound, 1: Volume, 2: Brightness, 3: Theme, 4: Reset
  const [soundEnabled, setSoundEnabled] = useState(enabled);
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem("gb_volume") || "80", 10));
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem("gb_brightness") || "100", 10));
  const [theme, setTheme] = useState(() => parseInt(localStorage.getItem("gb_theme") || "2", 10));
  const [resetFeedback, setResetFeedback] = useState(false);

  const handleInput = useCallback((type: string) => {
    if (type === "UP") {
      setActiveIndex((prev) => (prev <= 0 ? 4 : prev - 1));
      play("MOVE");
    } else if (type === "DOWN") {
      setActiveIndex((prev) => (prev >= 4 ? 0 : prev + 1));
      play("MOVE");
    } else if (type === "LEFT") {
      if (activeIndex === 0) {
        setSoundEnabled(false);
        setEnabled(false);
        play("BACK");
      } else if (activeIndex === 1) {
        setVolume((prev) => Math.max(0, prev - 10));
        play("MOVE");
      } else if (activeIndex === 2) {
        setBrightness((prev) => Math.max(10, prev - 10));
        play("MOVE");
      } else if (activeIndex === 3) {
        setTheme((prev) => (prev <= 0 ? THEMES.length - 1 : prev - 1));
        play("SELECT");
      }
    } else if (type === "RIGHT") {
      if (activeIndex === 0) {
        setSoundEnabled(true);
        setEnabled(true);
        play("CONFIRM");
      } else if (activeIndex === 1) {
        setVolume((prev) => Math.min(100, prev + 10));
        play("MOVE");
      } else if (activeIndex === 2) {
        setBrightness((prev) => Math.min(100, prev + 10));
        play("MOVE");
      } else if (activeIndex === 3) {
        setTheme((prev) => (prev >= THEMES.length - 1 ? 0 : prev + 1));
        play("SELECT");
      }
    } else if (type === "A") {
      if (activeIndex === 0) {
        const newVal = !soundEnabled;
        setSoundEnabled(newVal);
        setEnabled(newVal);
        play(newVal ? "CONFIRM" : "BACK");
      } else if (activeIndex === 3) {
        setTheme((prev) => (prev + 1) % THEMES.length);
        play("SELECT");
      } else if (activeIndex === 4) {
        // Reset all scores
        localStorage.removeItem("snake_high_score");
        localStorage.removeItem("snake_max_length");
        localStorage.removeItem("tetris_high_score");
        localStorage.removeItem("tetris_max_lines");
        localStorage.removeItem("tetris_max_level");
        localStorage.removeItem("snake_plays");
        localStorage.removeItem("tetris_plays");
        localStorage.removeItem("mario_plays");
        setResetFeedback(true);
        play("CONFIRM");
        setTimeout(() => setResetFeedback(false), 1500);
      }
    } else if (type === "B") {
      play("BACK");
      if (onAction) onAction("QUIT_GAME");
    }
  }, [activeIndex, onAction, soundEnabled, play, setEnabled]);

  useEffect(() => {
    (window as any).__settingsInput = handleInput;
    return () => {
      delete (window as any).__settingsInput;
    };
  }, [handleInput]);

  useEffect(() => {
    localStorage.setItem("gb_volume", String(volume));
    localStorage.setItem("gb_brightness", String(brightness));
    localStorage.setItem("gb_theme", String(theme));
  }, [volume, brightness, theme]);

  const volBars = Math.round(volume / 10);
  const briBars = Math.round(brightness / 10);

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">TOGGLE</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">B</span>
            <span className="vintage-ha">BACK</span>
          </div>
        </>
      }
    >
      {/* Header - 14px */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">SETTINGS</span>
      </div>

      {/* Content - Uses full remaining space with even distribution */}
      <div className="vintage-main-area" style={{ overflow: "hidden", flexDirection: "column", padding: "3px 2px" }}>
        <div className="flex flex-col gap-[3px]" style={{ flex: 1, overflow: "hidden", justifyContent: "space-between" }}>

          {/* ═══ SOUND ═══ */}
          <div className={`flex items-center justify-between p-[5px] border rounded-[2px] transition-colors ${activeIndex === 0 ? "bg-[rgba(255,140,0,0.15)] border-[var(--orange)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 0 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>SOUND</span>
            <div className="flex gap-[3px]">
              <span
                className={`text-[5px] font-black px-[4px] py-[1px] rounded-[1px] border transition-all ${
                  soundEnabled
                    ? "bg-[#22c55e] text-black border-[#16a34a]"
                    : "bg-transparent text-[var(--dim)] border-[var(--border)]"
                }`}
              >
                ON
              </span>
              <span
                className={`text-[5px] font-black px-[4px] py-[1px] rounded-[1px] border transition-all ${
                  !soundEnabled
                    ? "bg-[#ef4444] text-black border-[#dc2626]"
                    : "bg-transparent text-[var(--dim)] border-[var(--border)]"
                }`}
              >
                OFF
              </span>
            </div>
          </div>

          {/* ═══ VOLUME ═══ */}
          <div className={`flex flex-col gap-[3px] p-[5px] border rounded-[2px] transition-colors ${activeIndex === 1 ? "bg-[rgba(255,140,0,0.15)] border-[var(--orange)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 1 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>VOLUME</span>
              <span className="text-[5px] font-bold text-[var(--text)]">{volume}%</span>
            </div>
            <div className="flex gap-[1px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[5px] rounded-[0.5px] transition-all"
                  style={{
                    background: i < volBars ? "#a855f7" : "rgba(0,0,0,0.5)",
                    border: `0.5px solid ${i < volBars ? "#7c3aed" : "rgba(255,255,255,0.05)"}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ═══ BRIGHTNESS ═══ */}
          <div className={`flex flex-col gap-[3px] p-[5px] border rounded-[2px] transition-colors ${activeIndex === 2 ? "bg-[rgba(255,140,0,0.15)] border-[var(--orange)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 2 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>BRIGHTNESS</span>
              <span className="text-[5px] font-bold text-[var(--text)]">{brightness}%</span>
            </div>
            <div className="flex gap-[1px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[5px] rounded-[0.5px] transition-all"
                  style={{
                    background: i < briBars ? "#fcd34d" : "rgba(0,0,0,0.5)",
                    border: `0.5px solid ${i < briBars ? "#eab308" : "rgba(255,255,255,0.05)"}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* ═══ THEME ═══ */}
          <div className={`flex flex-col gap-[3px] p-[5px] border rounded-[2px] transition-colors ${activeIndex === 3 ? "bg-[rgba(255,140,0,0.15)] border-[var(--orange)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 3 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>THEME</span>
              <span className="text-[5px] font-bold text-[var(--gold)]">{THEMES[theme]?.name || "VINTAGE"}</span>
            </div>
            <div className="flex gap-[4px] mt-[1px]">
              {THEMES.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-[1px]"
                >
                  <div
                    className={`w-[8px] h-[8px] rounded-[1px] border-[1px] transition-all ${theme === i ? "border-[var(--orange)] scale-110" : "border-white/20 opacity-50"}`}
                    style={{ backgroundColor: t.color }}
                  />
                  {theme === i && (
                    <div className="w-[2px] h-[1px] bg-[var(--orange)] rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RESET SCORES ═══ */}
          <div className={`flex items-center justify-between p-[5px] border rounded-[2px] transition-colors ${activeIndex === 4 ? "bg-[rgba(239,68,68,0.12)] border-[#ef4444]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 4 ? "text-[#ef4444]" : "text-[var(--dim)]"}`}>RESET SCORES</span>
            <span className={`text-[4px] font-bold ${resetFeedback ? "text-[#22c55e]" : activeIndex === 4 ? "text-[#ef4444]" : "text-[var(--dim)]"}`}>
              {resetFeedback ? "CLEARED!" : activeIndex === 4 ? "PRESS A" : ""}
            </span>
          </div>

          {/* System Info */}
          <div className="flex justify-center items-center">
            <p className="text-[3px] text-[var(--dim)] text-center font-bold tracking-widest uppercase leading-normal">
              SYS v1.0.5
            </p>
          </div>

        </div>
      </div>
    </OSLayout>
  );
}
