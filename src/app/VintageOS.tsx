import { useEffect, useState } from "react";

interface VintageOSProps {
  activeIndex: number;
}

export default function VintageOS({ activeIndex }: VintageOSProps) {
  const menuItems = ["Snake", "Tetris", "Stats", "Settings", "Power Off"];
  
  // A simple blink effect for the cursor
  const [cursorVisible, setCursorVisible] = useState(true);
  
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500); // 500ms blink rate
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div 
      className="absolute inset-0 flex flex-col font-['Press_Start_2P',sans-serif] select-none overflow-hidden"
      style={{
        backgroundColor: "#1E2235", // Deep Slate Blue
        color: "#E8EDF2",           // Warm Cream
        padding: "8px", 
      }}
    >
      {/* Top spacing to push menu down slightly */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="flex flex-col gap-3">
          {menuItems.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={item} 
                className="flex items-center gap-2"
                style={{
                  color: isActive ? "#D49A6A" : "#E8EDF2", // Warm Wood for active, Cream for inactive
                  textShadow: isActive ? "0px 1px 0px rgba(0,0,0,0.5)" : "none",
                }}
              >
                {/* Cursor column (fixed width to keep text aligned) */}
                <span className="w-3 text-[10px] leading-none mb-[2px]">
                  {isActive && cursorVisible ? ">" : ""}
                </span>
                
                {/* Text column */}
                <span className="text-[12px] leading-none tracking-tighter">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom System Info Bar */}
      <div 
        className="h-[14px] flex items-center justify-between border-t border-[#E8EDF2]/20 pt-1 px-1"
        style={{
          fontSize: "6px",
          color: "#E8EDF2",
          opacity: 0.7,
        }}
      >
        <span>Firmware v1.0</span>
        <span>Last Played: Snake</span>
      </div>
    </div>
  );
}
