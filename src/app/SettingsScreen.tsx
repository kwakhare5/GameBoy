import React, { useState, useEffect, useCallback } from "react";
import OSLayout from "./components/OSLayout";
import useGameBoySound from "../hooks/useGameBoySound";

interface SettingsScreenProps {
  onAction?: (type: string) => void;
}

export default function SettingsScreen({ onAction }: SettingsScreenProps) {
  const { getEnabled, setEnabled, play } = useGameBoySound();
  const [activeIndex, setActiveIndex] = useState(0); // 0: Sound, 1: Volume, 2: Brightness, 3: Theme
  const [soundEnabled, setSoundEnabled] = useState(getEnabled);
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem("gb_volume") || "80", 10));
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem("gb_brightness") || "100", 10));
  const [theme, setTheme] = useState(() => parseInt(localStorage.getItem("gb_theme") || "2", 10));

  const themes = [
    { name: "NEON RED", color: "#ef4444" },
    { name: "EMERALD", color: "#22c55e" },
    { name: "VINTAGE OS", color: "#061e38" },
    { name: "COBALT", color: "#3b82f6" },
  ];

  const handleInput = useCallback((type: string) => {
    if (type === "UP") {
      setActiveIndex((prev) => (prev <= 0 ? 3 : prev - 1));
      play("MOVE");
    } else if (type === "DOWN") {
      setActiveIndex((prev) => (prev >= 3 ? 0 : prev + 1));
      play("MOVE");
    } else if (type === "LEFT") {
      if (activeIndex === 1) {
        setVolume((prev) => Math.max(0, prev - 10));
        play("MOVE");
      } else if (activeIndex === 2) {
        setBrightness((prev) => Math.max(10, prev - 10));
        play("MOVE");
      } else if (activeIndex === 0) {
        setSoundEnabled(false);
        setEnabled(false);
        play("BACK");
      }
    } else if (type === "RIGHT") {
      if (activeIndex === 1) {
        setVolume((prev) => Math.min(100, prev + 10));
        play("MOVE");
      } else if (activeIndex === 2) {
        setBrightness((prev) => Math.min(100, prev + 10));
        play("MOVE");
      } else if (activeIndex === 0) {
        setSoundEnabled(true);
        setEnabled(true);
        play("CONFIRM");
      }
    } else if (type === "A") {
      if (activeIndex === 0) {
        // Toggle sound
        const newVal = !soundEnabled;
        setSoundEnabled(newVal);
        setEnabled(newVal);
        play(newVal ? "CONFIRM" : "BACK");
      } else if (activeIndex === 3) {
        setTheme((prev) => (prev + 1) % themes.length);
        play("SELECT");
      }
    } else if (type === "B") {
        play("BACK");
        if(onAction) onAction("QUIT_GAME");
    }
  }, [activeIndex, themes.length, onAction, soundEnabled, play, setEnabled]);

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

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint">
            <span className="vintage-hk">D-PAD</span>
            <span className="vintage-ha">NAV</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">CHANGE</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">B</span>
            <span className="vintage-ha">BACK</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">X/Y</span>
            <span className="vintage-ha">RESET</span>
          </div>
        </>
      }
    >
      {/* Header */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">SETTINGS</span>
      </div>

      {/* Content */}
      <div className="vintage-main-area">
        <div className="flex flex-col gap-[8px] p-[8px]">
          {/* Sound Toggle */}
          <div className={`flex flex-col gap-[4px] relative z-10 p-[4px] border rounded-[2px] transition-colors ${activeIndex === 0 ? "bg-[rgba(255,140,0,0.2)] border-[var(--orange)] shadow-[0_0_8px_rgba(255,140,0,0.3)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] ${activeIndex === 0 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>SOUND</span>
              <span className={`text-[5px] ${soundEnabled ? "text-[#22c55e]" : "text-[var(--dim)]"}`}>{soundEnabled ? "ON" : "OFF"}</span>
            </div>
            <div className="flex gap-[2px] mt-[2px]">
              <div className={`h-[6px] flex-1 rounded-[1px] transition-all ${soundEnabled ? "bg-[#22c55e] shadow-[0_0_4px_rgba(34,197,94,0.6)]" : "bg-[rgba(0,0,0,0.5)]"}`}></div>
              <div className={`h-[6px] flex-1 rounded-[1px] transition-all ${soundEnabled ? "bg-[#22c55e] shadow-[0_0_4px_rgba(34,197,94,0.6)]" : "bg-[rgba(0,0,0,0.5)]"}`}></div>
            </div>
          </div>

          {/* Volume */}
          <div className={`flex flex-col gap-[4px] relative z-10 p-[4px] border rounded-[2px] transition-colors ${activeIndex === 1 ? "bg-[rgba(255,140,0,0.2)] border-[var(--orange)] shadow-[0_0_8px_rgba(255,140,0,0.3)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] ${activeIndex === 1 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>VOLUME</span>
              <span className="text-[5px] text-[var(--text)]">{volume}%</span>
            </div>
            <div className="w-full h-[4px] bg-[rgba(0,0,0,0.5)] rounded-full overflow-hidden border border-[var(--border)]">
              <div className="h-full bg-[#a855f7] transition-all duration-200" style={{ width: `${volume}%` }}></div>
            </div>
          </div>

          {/* Brightness */}
          <div className={`flex flex-col gap-[4px] relative z-10 p-[4px] border rounded-[2px] transition-colors ${activeIndex === 2 ? "bg-[rgba(255,140,0,0.2)] border-[var(--orange)] shadow-[0_0_8px_rgba(255,140,0,0.3)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <div className="flex justify-between items-center">
              <span className={`text-[5px] ${activeIndex === 2 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>BRIGHTNESS</span>
              <span className="text-[5px] text-[var(--text)]">{brightness}%</span>
            </div>
            <div className="w-full h-[4px] bg-[rgba(0,0,0,0.5)] rounded-full overflow-hidden border border-[var(--border)]">
              <div className="h-full bg-[#fcd34d] transition-all duration-200" style={{ width: `${brightness}%` }}></div>
            </div>
          </div>

          {/* Theme */}
          <div className={`flex flex-col gap-[4px] relative z-10 p-[4px] border rounded-[2px] transition-colors ${activeIndex === 3 ? "bg-[rgba(255,140,0,0.2)] border-[var(--orange)] shadow-[0_0_8px_rgba(255,140,0,0.3)]" : "bg-[rgba(6,12,26,0.8)] border-[var(--border)]"}`}>
            <span className={`text-[5px] mb-[2px] ${activeIndex === 3 ? "text-[var(--orange)]" : "text-[var(--dim)]"}`}>
              THEME: {themes[theme].name}
            </span>
            <div className="flex gap-[4px]">
              {themes.map((t, i) => (
                <div
                    key={i}
                    className={`w-[12px] h-[12px] rounded-[2px] border transition-all ${theme === i ? "border-2 border-[var(--orange)] shadow-[0_0_8px_rgba(255,140,0,0.6)]" : "border-white/20 opacity-50"}`}
                    style={{ backgroundColor: t.color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mt-auto pb-[4px] relative z-10">
            <p className="text-[3.5px] text-[var(--dim)] text-center leading-relaxed font-bold tracking-widest uppercase">
              SYSTEM v1.0.5
              <br />
              VINTAGE OS
            </p>
          </div>
        </div>
      </div>
    </OSLayout>
  );
}
