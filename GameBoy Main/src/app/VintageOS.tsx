import React from "react";
import { ChartColumnIncreasing, Settings } from "lucide-react";
import OSLayout from "./components/OSLayout";
import "../styles/VintageOS.css";

interface VintageOSProps {
  activeIndex: number;
}

// ── DATA ──
const menuItems = [
  {
    id: "snake",
    name: "SNAKE",
    genre: "SURVIVAL",
    hs: "0",
    plays: "0",
    tag: "●●●",
    img: "/images/covers/snake_2-removebg-preview.png",
  },
  {
    id: "tetris",
    name: "TETRIS",
    genre: "PUZZLE",
    hs: "0",
    plays: "0",
    tag: "●●●",
    img: "/images/covers/tetris-removebg-preview.png",
  },
  {
    id: "mario",
    name: "MARIO",
    genre: "ACTION",
    hs: "1-1 CLR",
    plays: "0",
    tag: "●●●",
    img: "/images/covers/Mario_1-removebg-preview.png",
  },
  {
    id: "stats",
    name: "STATS",
    genre: "RECORDS",
    hs: "--",
    plays: "--",
    tag: "★★★",
    img: "/images/covers/Gemini_Generated_Image_gabt1wgabt1wgabt-removebg-preview.png",
    icon: <ChartColumnIncreasing size={12} />,
  },
  {
    id: "settings",
    name: "CONFIG",
    genre: "SYSTEM",
    hs: "--",
    plays: "--",
    tag: "⚙⚙",
    img: "/images/covers/Gemini_Generated_Image_n3tdqfn3tdqfn3td-removebg-preview.png",
    icon: <Settings size={12} />,
  },
];

// Pixel art rendering logic removed in favor of uploaded cover images.

export default function VintageOS({ activeIndex }: VintageOSProps) {
  const [stats, setStats] = React.useState<Record<string, { hs: string, plays: string }>>({});

  React.useEffect(() => {
    setStats({
      snake: {
        hs: String(parseInt(localStorage.getItem("snake_high_score") || "0", 10)),
        plays: String(parseInt(localStorage.getItem("snake_plays") || "0", 10)),
      },
      tetris: {
        hs: String(parseInt(localStorage.getItem("tetris_high_score") || "0", 10)),
        plays: String(parseInt(localStorage.getItem("tetris_plays") || "0", 10)),
      },
      mario: {
        hs: "1-1 CLR",
        plays: String(parseInt(localStorage.getItem("mario_plays") || "0", 10)),
      }
    });
  }, []);

  const activeData = menuItems[activeIndex] || menuItems[0];
  const activeStats = stats[activeData.id] || { hs: activeData.hs, plays: activeData.plays };

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">OPEN</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">START</span>
            <span className="vintage-ha">OPEN</span>
          </div>
        </>
      }
    >
      {/* Title Row */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">SELECT</span>
      </div>

      {/* Main Area */}
      <div className="vintage-main-area">
        {/* Left Menu */}
        <nav className="vintage-menu-col">
          {menuItems.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <React.Fragment key={item.id}>
                {i === 3 && <div className="vintage-menu-sep"></div>}
                <div className={`vintage-menu-row ${isActive ? "active" : ""}`}>
                  <span className="vintage-row-cursor">▶</span>
                  <div className="vintage-row-icon">
                    {item.img ? (
                      <img src={item.img} alt={item.name} />
                    ) : item.icon ? (
                      <div className="vintage-icon-wrapper">{item.icon}</div>
                    ) : (
                      <div className="vintage-icon-placeholder" />
                    )}
                  </div>
                  <span className="vintage-row-name">{item.name}</span>
                  <span className="vintage-row-tag">{item.tag}</span>
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right Preview */}
        <div className="vintage-preview-col">
          <div className="vintage-prev-art">
            {activeData.img ? (
              <img src={activeData.img} alt={activeData.name} />
            ) : (
              <div className="vintage-icon-placeholder" />
            )}
            <div className="vintage-prev-art-glow"></div>
          </div>
          <div className="vintage-prev-name">{activeData.name}</div>
          <div className="vintage-prev-genre">{activeData.genre}</div>
          <div className="vintage-prev-stats">
            <div className="vintage-stat-row">
              <span className="vintage-stat-label">HI-SC</span>
              <span className="vintage-stat-val">{activeStats.hs}</span>
            </div>
            <div className="vintage-stat-row">
              <span className="vintage-stat-label">PLAYS</span>
              <span className="vintage-stat-val">{activeStats.plays}</span>
            </div>
          </div>
        </div>
      </div>
    </OSLayout>
  );
}
