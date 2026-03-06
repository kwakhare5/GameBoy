import React, { useState, useEffect } from "react";
import OSLayout from "./components/OSLayout";

export default function StatsScreen() {
  const [snakeScore, setSnakeScore] = useState(0);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisLines, setTetrisLines] = useState(0);

  useEffect(() => {
    // Read stats from localStorage
    const snakeHigh = parseInt(localStorage.getItem("snake_high_score") || "0", 10);
    const tetrisHigh = parseInt(localStorage.getItem("tetris_high_score") || "0", 10);
    const tetrisMaxLines = parseInt(localStorage.getItem("tetris_max_lines") || "0", 10);
    
    setSnakeScore(snakeHigh);
    setTetrisScore(tetrisHigh);
    setTetrisLines(tetrisMaxLines);
  }, []);

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint">
            <span className="vintage-hk">D-PAD</span>
            <span className="vintage-ha">SCROLL</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">DETAILS</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">B</span>
            <span className="vintage-ha">BACK</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">X</span>
            <span className="vintage-ha">CLEAR</span>
          </div>
        </>
      }
    >
      {/* Header */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">STATS</span>
      </div>

      {/* Content */}
      <div className="vintage-main-area">
        <div className="flex flex-col gap-[6px] p-[6px] overflow-y-auto">
          {/* Mario Card */}
          <div className="flex items-center gap-[6px] bg-[rgba(6,12,26,0.8)] border border-[var(--border)] rounded-[2px] p-[4px] shadow-[inset_0_0_8px_rgba(255,140,0,0.1)] relative z-10">
            <img
              src="/images/covers/mario.png"
              className="w-[16px] h-[16px] rounded-[1px] object-cover border border-[var(--dim)]"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="flex flex-col flex-1">
              <span className="text-[5px] text-[var(--orange)] font-bold tracking-widest uppercase mb-[2px]">
                MARIO BROS
              </span>
              <div className="flex justify-between mt-[2px] text-[4px] text-[var(--text)]">
                <span>RECORD:</span>
                <span className="text-[var(--gold)]">1-1 CLEAR</span>
              </div>
            </div>
          </div>

          {/* Snake Card */}
          <div className="flex items-center gap-[6px] bg-[rgba(6,12,26,0.8)] border border-[var(--border)] rounded-[2px] p-[4px] shadow-[inset_0_0_8px_rgba(255,140,0,0.1)] relative z-10">
            <img
              src="/images/covers/snake.png"
              className="w-[16px] h-[16px] rounded-[1px] object-cover border border-[var(--dim)]"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="flex flex-col flex-1">
              <span className="text-[5px] text-[#22c55e] font-bold tracking-widest uppercase mb-[2px]">
                SNAKE CLASSIC
              </span>
              <div className="flex justify-between mt-[2px] text-[4px] text-[var(--text)]">
                <span>HIGH SCORE:</span>
                <span className="text-[var(--gold)]">
                  {String(snakeScore).padStart(4, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Tetris Card */}
          <div className="flex items-center gap-[6px] bg-[rgba(6,12,26,0.8)] border border-[var(--border)] rounded-[2px] p-[4px] shadow-[inset_0_0_8px_rgba(255,140,0,0.1)] relative z-10 mb-2">
            <img
              src="/images/covers/tetris.png"
              className="w-[16px] h-[16px] rounded-[1px] object-cover border border-[var(--dim)]"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="flex flex-col flex-1">
              <span className="text-[5px] text-[#3b82f6] font-bold tracking-widest uppercase mb-[2px]">
                TETRIS PUZZLE
              </span>
              <div className="flex justify-between mt-[2px] text-[4px] text-[var(--text)]">
                <span>HIGH SCORE:</span>
                <span className="text-[var(--gold)]">
                  {String(tetrisScore).padStart(6, "0")}
                </span>
              </div>
              <div className="flex justify-between mt-[1px] text-[4px] text-[var(--dim)]">
                <span>MAX LINES:</span>
                <span className="text-[#22c55e]">{tetrisLines}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OSLayout>
  );
}
