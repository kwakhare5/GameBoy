import { useState, useEffect } from "react";
import OSLayout from "./components/OSLayout";

export default function StatsScreen() {
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeLen, setSnakeLen] = useState(0);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(0);
  const [totalPlays, setTotalPlays] = useState(0);

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
        <>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">B</span>
            <span className="vintage-ha">BACK</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">SEL</span>
            <span className="vintage-ha">EXIT</span>
          </div>
        </>
      }
    >
      {/* Header */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">RECORDS</span>
      </div>

      {/* Content - Full height distribution */}
      <div className="vintage-main-area" style={{ flexDirection: "column", padding: "3px 4px", justifyContent: "space-between" }}>

        {/* ═══ TOTAL PLAYS BAR ═══ */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "3px 0",
          borderBottom: "1px solid var(--border)",
          marginBottom: "3px",
        }}>
          <span style={{ fontSize: "4px", color: "var(--dim)", letterSpacing: "1px", fontWeight: "bold" }}>TOTAL GAMES</span>
          <span style={{ fontSize: "7px", color: "var(--gold)", fontWeight: 900 }}>{totalPlays}</span>
        </div>

        {/* ═══ SNAKE CARD ═══ */}
        <div style={{
          display: "flex",
          gap: "4px",
          padding: "4px",
          background: "rgba(6,12,26,0.8)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          boxShadow: "inset 0 0 8px rgba(0,212,255,0.06)",
        }}>
          <img
            src="/images/covers/snake_2-removebg-preview.png"
            alt="SNAKE"
            style={{ width: "22px", height: "22px", borderRadius: "2px", objectFit: "cover", imageRendering: "pixelated", border: "0.5px solid var(--dim)", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1px", justifyContent: "center" }}>
            <span style={{ fontSize: "5px", fontWeight: 900, color: "var(--text)", letterSpacing: "1px", lineHeight: 1 }}>SNAKE</span>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1px" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>HI-SCORE</span>
              <span style={{ fontSize: "4.5px", color: "var(--gold)", fontWeight: "bold" }}>{String(snakeScore).padStart(5, "0")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>MAX LEN</span>
              <span style={{ fontSize: "4.5px", color: "#00d4ff", fontWeight: "bold" }}>{snakeLen}</span>
            </div>
          </div>
        </div>

        {/* ═══ TETRIS CARD ═══ */}
        <div style={{
          display: "flex",
          gap: "4px",
          padding: "4px",
          background: "rgba(6,12,26,0.8)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          boxShadow: "inset 0 0 8px rgba(204,68,255,0.06)",
        }}>
          <img
            src="/images/covers/tetris-removebg-preview.png"
            alt="TETRIS"
            style={{ width: "22px", height: "22px", borderRadius: "2px", objectFit: "cover", imageRendering: "pixelated", border: "0.5px solid var(--dim)", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1px", justifyContent: "center" }}>
            <span style={{ fontSize: "5px", fontWeight: 900, color: "var(--text)", letterSpacing: "1px", lineHeight: 1 }}>TETRIS</span>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1px" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>HI-SCORE</span>
              <span style={{ fontSize: "4.5px", color: "var(--gold)", fontWeight: "bold" }}>{String(tetrisScore).padStart(6, "0")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>LINES</span>
              <span style={{ fontSize: "4.5px", color: "#22c55e", fontWeight: "bold" }}>{tetrisLines}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>MAX LV</span>
              <span style={{ fontSize: "4.5px", color: "#a855f7", fontWeight: "bold" }}>{tetrisLevel}</span>
            </div>
          </div>
        </div>

        {/* ═══ MARIO CARD ═══ */}
        <div style={{
          display: "flex",
          gap: "4px",
          padding: "4px",
          background: "rgba(6,12,26,0.8)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          boxShadow: "inset 0 0 8px rgba(255,140,0,0.06)",
        }}>
          <img
            src="/images/covers/Mario_1-removebg-preview.png"
            alt="MARIO"
            style={{ width: "22px", height: "22px", borderRadius: "2px", objectFit: "cover", imageRendering: "pixelated", border: "0.5px solid var(--dim)", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "1px", justifyContent: "center" }}>
            <span style={{ fontSize: "5px", fontWeight: 900, color: "var(--text)", letterSpacing: "1px", lineHeight: 1 }}>MARIO</span>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1px" }}>
              <span style={{ fontSize: "4px", color: "var(--dim)", fontWeight: "bold" }}>RECORD</span>
              <span style={{ fontSize: "4.5px", color: "var(--gold)", fontWeight: "bold" }}>1-1 CLEAR</span>
            </div>
          </div>
        </div>

      </div>
    </OSLayout>
  );
}
