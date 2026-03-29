import { useState, useEffect, useCallback, useRef } from "react";
import OSLayout from "./components/OSLayout";
import { useGameBoySound } from "../hooks/useGameBoySound";

export default function StatsScreen() {
  const { play } = useGameBoySound();
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeLen, setSnakeLen] = useState(0);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(0);
  const [totalPlays, setTotalPlays] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // 0: Snake, 1: Tetris, 2: Mario
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback((type: string) => {
    if (type === "UP") {
      setActiveIndex((prev) => (prev <= 0 ? 2 : prev - 1));
      play("MOVE");
    } else if (type === "DOWN") {
      setActiveIndex((prev) => (prev >= 2 ? 0 : prev + 1));
      play("MOVE");
    }
  }, [play]);

  useEffect(() => {
    (window as any).__gameInput = handleInput;
    return () => {
      delete (window as any).__gameInput;
    };
  }, [handleInput]);

  useEffect(() => {
    if (!scrollRef.current) return;
    
    // If we're at the top item, scroll the entire container to the top 
    // to ensure the Global Usage banner is also visible.
    if (activeIndex === 0) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    setSnakeScore(parseInt(localStorage.getItem("snake_high_score") || "0", 10));
    setSnakeLen(parseInt(localStorage.getItem("snake_max_length") || "3", 10));
    setTetrisScore(parseInt(localStorage.getItem("tetris_high_score") || "0", 10));
    setTetrisLines(parseInt(localStorage.getItem("tetris_max_lines") || "0", 10));
    setTetrisLevel(parseInt(localStorage.getItem("tetris_max_level") || "0", 10));
    setTotalPlays(
      parseInt(localStorage.getItem("snake_plays") || "0", 10) +
      parseInt(localStorage.getItem("tetris_plays") || "0", 10) +
      parseInt(localStorage.getItem("mario_plays") || "0", 10)
    );
  }, []);

  return (
    <OSLayout
      customHints={
        <div className="vintage-hint">
          <span className="vintage-hk">SEL</span>
          <span className="vintage-ha">EXIT</span>
        </div>
      }
    >
      {/* Header */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">RECORDS</span>
      </div>

      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="vintage-main-area flex-col p-2 gap-2 overflow-y-auto scrollbar-hide scroll-smooth"
      >
        <div className="flex flex-col gap-[4px] w-full pb-[20px]">
          
          {/* Total Stats Banner */}
          <div className="flex flex-shrink-0 items-center justify-between px-2 py-1.5 rounded-[2px] bg-[rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.05)] shadow-sm">
            <span className="text-[4px] font-bold tracking-widest text-[#888] leading-tight">GLOBAL USAGE</span>
            <span className="text-[6.5px] font-black text-[#ff8c00] drop-shadow-[0_0_2px_rgba(255,140,0,0.4)]">{totalPlays} GAMES</span>
          </div>

          {/* Snake Card */}
          <div 
            data-active={activeIndex === 0}
            className={`flex flex-shrink-0 gap-2 p-2 rounded-[2px] border transition-all ${activeIndex === 0 ? "bg-[rgba(255,140,0,0.15)] border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}
          >
            <div className="w-[24px] h-[24px] border border-[rgba(255,255,255,0.05)] flex-shrink-0 bg-[#0a0a0a] rounded-[1px]">
              <img src="/images/covers/snake_2-removebg-preview.png" alt="SNAKE" className="w-full h-full object-contain pixelated" />
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[2px]">
              <span className={`text-[6px] font-black tracking-wider ${activeIndex === 0 ? "text-white" : "text-[#aaa]"}`}>SNAKE</span>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">SCORE</span>
                <span className="text-[5px] font-medium text-[#ffd700]">{String(snakeScore).padStart(5, "0")}</span>
              </div>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">LENGTH</span>
                <span className="text-[5px] font-medium text-[#00d4ff]">{snakeLen}</span>
              </div>
            </div>
          </div>

          {/* Tetris Card */}
          <div 
            data-active={activeIndex === 1}
            className={`flex flex-shrink-0 gap-2 p-2 rounded-[2px] border transition-all ${activeIndex === 1 ? "bg-[rgba(255,140,0,0.15)] border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}
          >
            <div className="w-[24px] h-[24px] border border-[rgba(255,255,255,0.05)] flex-shrink-0 bg-[#0a0a0a] rounded-[1px]">
              <img src="/images/covers/tetris-removebg-preview.png" alt="TETRIS" className="w-full h-full object-contain pixelated" />
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[1px]">
              <span className={`text-[6px] font-black tracking-wider ${activeIndex === 1 ? "text-white" : "text-[#aaa]"}`}>TETRIS</span>
              <div className="flex justify-between items-center opacity-80 mt-[1px]">
                <span className="text-[4px] font-bold text-[#666] leading-tight">HI-SCORE</span>
                <span className="text-[5px] font-medium text-[#ffd700]">{String(tetrisScore).padStart(6, "0")}</span>
              </div>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">LINES</span>
                <span className="text-[5px] font-medium text-[#22c55e]">{tetrisLines}</span>
              </div>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">LEVEL</span>
                <span className="text-[5px] font-medium text-[#a855f7]">{tetrisLevel}</span>
              </div>
            </div>
          </div>

          {/* Mario Card */}
          <div 
            data-active={activeIndex === 2}
            className={`flex flex-shrink-0 gap-2 p-2 rounded-[2px] border transition-all ${activeIndex === 2 ? "bg-[rgba(255,140,0,0.15)] border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}
          >
            <div className="w-[24px] h-[24px] border border-[rgba(255,255,255,0.05)] flex-shrink-0 bg-[#0a0a0a] rounded-[1px]">
              <img src="/images/covers/Mario_1-removebg-preview.png" alt="MARIO" className="w-full h-full object-contain pixelated" />
            </div>
            <div className="flex flex-col flex-1 justify-center gap-[2px]">
              <span className={`text-[6px] font-black tracking-wider ${activeIndex === 2 ? "text-white" : "text-[#aaa]"}`}>MARIO</span>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">STAGES</span>
                <span className="text-[5px] font-medium text-[#ffd700]">1-1 Clear</span>
              </div>
              <div className="flex justify-between items-center opacity-80">
                <span className="text-[4px] font-bold text-[#666] leading-tight">COINS</span>
                <span className="text-[5px] font-medium text-[#fbbf24]">000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OSLayout>
  );
}
