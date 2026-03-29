import { useEffect, useState } from "react";
import OSLayout from "../shared/OSLayout";

interface VintageOSProps {
  activeIndex: number;
}
const menuItems = [
  {
    id: "mario",
    name: "MARIO",
    genre: "PLATFORMER",
    desc: "SAVE THE PRINCESS",
    hs: "1-1 CLR",
    plays: "0",
    img: "/images/covers/Mario_1-removebg-preview.png",
  },
  {
    id: "snake",
    name: "SNAKE",
    genre: "SURVIVAL",
    desc: "CLASSIC DOT-EATER",
    hs: "0",
    plays: "0",
    img: "/images/covers/snake_2-removebg-preview.png",
  },
  {
    id: "tetris",
    name: "TETRIS",
    genre: "PUZZLE",
    desc: "BLOCK DROP DROPPER",
    hs: "0",
    plays: "0",
    img: "/images/covers/tetris-removebg-preview.png",
  },
  {
    id: "stats",
    name: "STATS",
    genre: "SYSTEM",
    desc: "LIFETIME RECORDS",
    img: "/images/covers/stats.png",
    hs: "--",
    plays: "--",
  },
  {
    id: "settings",
    name: "CONFIG",
    genre: "SYSTEM",
    desc: "SYSTEM PREFS",
    img: "/images/covers/settings.png",
    hs: "--",
    plays: "--",
  },
];

export default function VintageOS({ activeIndex }: VintageOSProps) {
  const [stats, setStats] = useState<Record<string, { hs: string, plays: string }>>({});

  useEffect(() => {
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

  const isGame = activeData.id === "snake" || activeData.id === "tetris" || activeData.id === "mario";

  return (
    <OSLayout
      customHints={
        <>
          <div className="vintage-hint" style={{ marginRight: "2px" }}>
            <span className="vintage-hk">A</span>
            <span className="vintage-ha">OPEN</span>
          </div>
          <div className="vintage-hint">
            <span className="vintage-hk">SEL</span>
            <span className="vintage-ha">POWER</span>
          </div>
        </>
      }
    >
      {/* Title Row */}
      <div className="vintage-title-row">
        <span className="vintage-title-main">GAME BOY</span>
        <span className="vintage-title-tag">LAUNCHER</span>
      </div>

      {/* Split Main Area */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: "116px", maxHeight: "116px" }}>
        
        {/* LEFT NAV - List View (Exactly fits 5 items) */}
        <nav className="flex flex-col w-[68px] h-full border-r border-[#1a1a1a] bg-[#02040a]">
          {menuItems.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={item.id}
                className={`flex items-center px-[4px] py-[6px] border-b border-[#0f111a] transition-colors duration-100 ${
                  isActive 
                    ? "bg-[var(--orange)] text-black" 
                    : "bg-transparent text-[var(--dim)]"
                }`}
                style={{ height: "23.2px" }} 
              >
                <div className="w-[8px] flex justify-center shrink-0">
                  {isActive && <span className="text-[5px] font-black animate-pulse">▶</span>}
                </div>
                <span className={`text-[6px] font-black tracking-widest ${isActive ? "text-black" : ""}`}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </nav>

        {/* RIGHT PANEL - Details View */}
        <div className="flex flex-col flex-1 p-[4px] bg-[rgba(0,0,0,0.4)] justify-between relative overflow-hidden backdrop-blur-sm rounded-[2px] border border-[rgba(255,255,255,0.05)] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
          
          <div className="flex flex-col gap-[3px] h-full justify-between">
            {/* Top Bar: Icon + Titles */}
            <div className="flex flex-row gap-[4px] items-center">
              {/* Asset Display Box - Left Side Small Square */}
              <div className="size-[32px] bg-[#000] border border-[#333] rounded-[2px] flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] shrink-0 overflow-visible">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,140,0,0.2)] to-transparent opacity-60"></div>
                <img 
                  src={activeData.img} 
                  alt={activeData.name} 
                  className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] object-contain pixelated filter contrast-[1.05] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10" 
                />
              </div>

              {/* Info Section - Right Side */}
              <div className="flex flex-col gap-[1px] justify-center w-full min-w-0 pr-[2px]">
                <h2 className="text-[7.5px] font-black text-white tracking-widest leading-[10px] drop-shadow-md truncate">
                  {activeData.name}
                </h2>
                <div className="flex items-center">
                  <span className="inline-block text-[3.5px] font-bold text-[#ff8c00] px-[2.5px] py-[1px] bg-[#ff8c00]/20 rounded-[1px] border border-[#ff8c00]/40 leading-none shadow-sm">
                    {activeData.genre}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-[#ff8c00]/40 via-[#ff8c00]/10 to-transparent my-[1px]"></div>

            {/* Detailed Description and Tech Readout */}
            <div className="flex-1 flex flex-col justify-start overflow-hidden mt-[1px]">
               <p className="pl-[2.5px] text-[4.5px] text-[#aaa] leading-[7px] tracking-wide font-medium drop-shadow-sm line-clamp-2">
                 {activeData.desc}
               </p>

               {/* Technical Flavor Box - Vertical but aligned with stats below */}
               {isGame && (
                 <div className="mt-auto mb-[2px] w-full flex flex-col gap-[3.5px] px-[4px] py-[3px] bg-[rgba(0,0,0,0.2)] rounded-[2px] border border-[rgba(255,140,0,0.15)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                   <div className="flex justify-between items-center">
                     <span className="text-[4px] text-[#888] font-bold tracking-widest drop-shadow-sm">CART SIZE</span>
                     <span className="text-[5px] text-[#ff8c00] font-black tracking-widest drop-shadow-[0_0_2px_rgba(255,140,0,0.4)]">32KB</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[4px] text-[#888] font-bold tracking-widest drop-shadow-sm">BAT. SAVE</span>
                     <span className="text-[5px] text-[#ff8c00] font-black tracking-widest drop-shadow-[0_0_2px_rgba(255,140,0,0.4)]">YES</span>
                   </div>
                 </div>
               )}
            </div>

            {/* Stats Footer Box (Only for Games) */}
            {isGame && (
              <div className="w-full flex justify-between bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)] p-[3px] rounded-[2px] mt-auto">
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-[3px] font-bold text-[#888] tracking-widest mb-[1px]">HI-SCORE</span>
                  <span className="text-[5.5px] font-black text-white leading-none drop-shadow-sm">{activeStats.hs}</span>
                </div>
                <div className="w-px h-[8px] bg-[#333] self-center"></div>
                <div className="flex flex-col items-center justify-center flex-1">
                  <span className="text-[3px] font-bold text-[#888] tracking-widest mb-[1px]">PLAYED</span>
                  <span className="text-[5.5px] font-black text-[#ff8c00] leading-none drop-shadow-[0_0_2px_rgba(255,140,0,0.5)]">{activeStats.plays}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </OSLayout>
  );
}
