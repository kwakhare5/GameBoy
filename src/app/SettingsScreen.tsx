import { useState, useEffect, useCallback, useRef } from "react";
import OSLayout from "./components/OSLayout";
import { useGameBoySound } from "../hooks/useGameBoySound";
import { useGameBoyStore } from "../stores/gameBoyStore";

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
  const { play, enabled: soundEnabled, setEnabled: setSoundEnabled, setVolume: setAudioVolume } = useGameBoySound();
  const { volume, brightness, theme, setSetting } = useGameBoyStore();
  const [activeIndex, setActiveIndex] = useState(0); // 0-5: Sound, Vol, Bri, Theme, Reset, Info
  const [resetFeedback, setResetFeedback] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((type: string) => {
    if (type === "UP") {
      setActiveIndex((prev) => (prev <= 0 ? 5 : prev - 1));
      play("MOVE");
    } else if (type === "DOWN") {
      setActiveIndex((prev) => (prev >= 5 ? 0 : prev + 1));
      play("MOVE");
    } else if (type === "LEFT") {
      if (activeIndex === 1) { // SOUND
        setSoundEnabled(false);
        setSetting("soundEnabled", false);
        play("BACK");
      } else if (activeIndex === 2) { // VOL
        const newVol = Math.max(0, volume - 10);
        setSetting("volume", newVol);
        setAudioVolume(newVol / 100);
        play("MOVE");
      } else if (activeIndex === 3) { // BRI
        setSetting("brightness", Math.max(10, brightness - 10));
        play("MOVE");
      } else if (activeIndex === 4) { // THEME
        setSetting("theme", theme <= 0 ? THEMES.length - 1 : theme - 1);
        play("SELECT");
      }
    } else if (type === "RIGHT") {
      if (activeIndex === 1) { // SOUND
        setSoundEnabled(true);
        setSetting("soundEnabled", true);
        play("CONFIRM");
      } else if (activeIndex === 2) { // VOL
        const newVol = Math.min(100, volume + 10);
        setSetting("volume", newVol);
        setAudioVolume(newVol / 100);
        play("MOVE");
      } else if (activeIndex === 3) { // BRI
        setSetting("brightness", Math.min(100, brightness + 10));
        play("MOVE");
      } else if (activeIndex === 4) { // THEME
        setSetting("theme", theme >= THEMES.length - 1 ? 0 : theme + 1);
        play("SELECT");
      }
    } else if (type === "A") {
      if (activeIndex === 1) { // SOUND
        const newVal = !soundEnabled;
        setSoundEnabled(newVal);
        setSetting("soundEnabled", newVal);
        play(newVal ? "CONFIRM" : "BACK");
      } else if (activeIndex === 4) { // THEME
        setSetting("theme", (theme + 1) % THEMES.length);
        play("SELECT");
      } else if (activeIndex === 5) { // RESET
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
  }, [activeIndex, onAction, soundEnabled, volume, brightness, theme, setSetting, play]);

  useEffect(() => {
    (window as any).__gameInput = handleInput;
    return () => {
      delete (window as any).__gameInput;
    };
  }, [handleInput]);

  // Auto-scroll logic
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIndex]);

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
            <span className="vintage-hk">SEL</span>
            <span className="vintage-ha">EXIT</span>
          </div>
        </>
      }
    >
      {/* Header - 14px */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">SETTINGS</span>
      </div>

      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="vintage-main-area flex-col p-2 gap-2 overflow-y-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex flex-col gap-[3px] w-full">

          {/* ═══ ABOUT DEVICE ═══ */}
          <div 
            data-active={activeIndex === 0}
            className={`flex flex-col gap-[3px] p-[5px] rounded-[2px] transition-colors ${activeIndex === 0 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"} mb-[1px]`}>
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-[2px] mb-[1px]">
              <span className={`text-[4px] font-bold tracking-widest ${activeIndex === 0 ? "text-[#ff8c00]" : "text-[#888]"}`}>DEVICE MODEL</span>
              <span className={`text-[4.5px] font-black ${activeIndex === 0 ? "text-white" : "text-[#aaa]"}`}>DMG-01-V</span>
            </div>
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-[2px] mb-[1px]">
              <span className={`text-[4px] font-bold tracking-widest ${activeIndex === 0 ? "text-[#ff8c00]" : "text-[#888]"}`}>SERIAL ID</span>
              <span className={`text-[4.5px] font-black ${activeIndex === 0 ? "text-white" : "text-[#aaa]"}`}>GB-2026-X42</span>
            </div>
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-[2px] mb-[1px]">
              <span className={`text-[4px] font-bold tracking-widest ${activeIndex === 0 ? "text-[#ff8c00]" : "text-[#888]"}`}>OS BUILD</span>
              <span className={`text-[4px] font-black ${activeIndex === 0 ? "text-white" : "text-[#aaa]"}`}>2026.03.29.v1.0.6</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[4px] font-bold tracking-widest ${activeIndex === 0 ? "text-[#ff8c00]" : "text-[#888]"}`}>BATTERY</span>
              <span className={`text-[4.5px] font-black ${activeIndex === 0 ? "text-[#22c55e]" : "text-[#aaa]"} flex gap-[3px] items-center`}>
                98% <div className="flex gap-[0.5px]"><div className={`w-[1.5px] h-[3px] ${activeIndex === 0 ? "bg-[#22c55e]" : "bg-[#22c55e]/50"}`}></div><div className={`w-[1.5px] h-[3px] ${activeIndex === 0 ? "bg-[#22c55e]" : "bg-[#22c55e]/50"}`}></div><div className={`w-[1.5px] h-[3px] ${activeIndex === 0 ? "bg-[#22c55e]" : "bg-[#22c55e]/50"}`}></div><div className="w-[1.5px] h-[3px] bg-[#666]"></div></div>
              </span>
            </div>
          </div>

          {/* ═══ SOUND ═══ */}
          <div 
            data-active={activeIndex === 1}
            className={`flex items-center justify-between p-[5px] rounded-[2px] transition-colors ${activeIndex === 1 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}>
            <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 1 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#888]"}`}>SOUND</span>
            <div className="flex gap-[3px]">
              <span
                className={`text-[4.5px] font-black px-[4px] py-[1px] rounded-[1px] border transition-all ${
                  soundEnabled
                    ? "bg-[#ff8c00] text-black border-[#ff8c00] shadow-[0_0_3px_rgba(255,140,0,0.5)]"
                    : "bg-transparent text-[#666] border-[#333]"
                }`}
              >
                ON
              </span>
              <span
                className={`text-[4.5px] font-black px-[4px] py-[1px] rounded-[1px] border transition-all ${
                  !soundEnabled
                    ? "bg-[#ff8c00] text-black border-[#ff8c00] shadow-[0_0_3px_rgba(255,140,0,0.5)]"
                    : "bg-transparent text-[#666] border-[#333]"
                }`}
              >
                OFF
              </span>
            </div>
          </div>

          {/* ═══ VOLUME ═══ */}
          <div 
            data-active={activeIndex === 2}
            className={`flex flex-col gap-[3px] p-[5px] rounded-[2px] transition-colors ${activeIndex === 2 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 2 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#888]"}`}>VOLUME</span>
              <span className="text-[4.5px] font-bold text-[#aaa]">{volume}%</span>
            </div>
            <div className="flex gap-[1px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[5px] rounded-[0.5px] transition-all"
                  style={{
                    background: i < volBars ? "#ff8c00" : "rgba(0,0,0,0.5)",
                    border: `0.5px solid ${i < volBars ? "rgba(255,140,0,0.8)" : "rgba(255,255,255,0.05)"}`,
                    boxShadow: i < volBars ? "0 0 2px rgba(255,140,0,0.4)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ═══ BRIGHTNESS ═══ */}
          <div 
            data-active={activeIndex === 3}
            className={`flex flex-col gap-[3px] p-[5px] rounded-[2px] transition-colors ${activeIndex === 3 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 3 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#888]"}`}>BRIGHTNESS</span>
              <span className="text-[4.5px] font-bold text-[#aaa]">{brightness}%</span>
            </div>
            <div className="flex gap-[1px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[5px] rounded-[0.5px] transition-all"
                  style={{
                    background: i < briBars ? "#ff8c00" : "rgba(0,0,0,0.5)",
                    border: `0.5px solid ${i < briBars ? "rgba(255,140,0,0.8)" : "rgba(255,255,255,0.05)"}`,
                    boxShadow: i < briBars ? "0 0 2px rgba(255,140,0,0.4)" : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ═══ THEME ═══ */}
          <div 
            data-active={activeIndex === 4}
            className={`flex flex-col gap-[3px] p-[5px] rounded-[2px] transition-colors ${activeIndex === 4 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 4 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#888]"}`}>THEME</span>
              <span className="text-[4.5px] font-bold text-[#ff8c00]">{THEMES[theme]?.name || "VINTAGE"}</span>
            </div>
            <div className="flex gap-[4px] mt-[1px]">
              {THEMES.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-[1px]"
                >
                  <div
                    className={`w-[8px] h-[8px] rounded-[1px] border-[1px] transition-all ${theme === i ? "border-[#ff8c00] scale-110 shadow-[0_0_3px_rgba(255,140,0,0.5)]" : "border-white/10 opacity-30"}`}
                    style={{ backgroundColor: t.color }}
                  />
                  {theme === i && (
                    <div className="w-[2px] h-[1px] bg-[#ff8c00] rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RESET SCORES is now Index 5 */}
          <div 
            data-active={activeIndex === 5}
            className={`flex items-center justify-between p-[5px] rounded-[2px] transition-colors ${activeIndex === 5 ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}>
            <span className={`text-[5px] font-bold tracking-wide ${activeIndex === 5 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#888]"}`}>RESET SCORES</span>
            <span className={`text-[4.5px] font-bold ${resetFeedback ? "text-[#22c55e] drop-shadow-[0_0_2px_rgba(34,197,94,0.8)]" : activeIndex === 5 ? "text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.8)]" : "text-[#555]"}`}>
              {resetFeedback ? "CLEARED!" : activeIndex === 5 ? "PRESS A" : ""}
            </span>
          </div>

        </div>

        {/* System Footer - Inside main area scroll bit */}
        <div className="flex justify-center items-center py-[4px] mt-[10px] pb-[10px]">
          <p className="text-[3px] text-[#444] text-center font-bold tracking-widest uppercase leading-normal">
            SYSTEM BUILD: 2026.03.29.REL.v1.0.6
          </p>
        </div>
      </div>
    </OSLayout>
  );
}
