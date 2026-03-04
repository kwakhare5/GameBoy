import { useState, useEffect, useCallback } from "react";
import GameBoy from "../imports/GameBoy-3-330";

type GameBoyState = "OFF" | "BOOTING" | "MAIN_MENU" | "POWER_CONFIRM";

export default function App() {
  const [scale, setScale] = useState(1);
  const [currentState, setCurrentState] = useState<GameBoyState>("OFF");
  const [bootStep, setBootStep] = useState(0); // 0: None, 1: GAME BOY, 2: Booting...
  const [selectedPowerOption, setSelectedPowerOption] = useState<"YES" | "NO">("NO");
  const [osActiveIndex, setOsActiveIndex] = useState(0); // 0 to 4

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const targetWidth = 220;
      const targetHeight = 362;
      const padding = 40;

      const scaleX = (width - padding) / targetWidth;
      const scaleY = (height - padding) / targetHeight;
      const newScale = Math.min(scaleX, scaleY, 1.5);

      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentState === "BOOTING") {
      setBootStep(1);
      const t1 = setTimeout(() => setBootStep(2), 1500);
      const t2 = setTimeout(() => {
        setBootStep(0);
        setCurrentState("MAIN_MENU");
      }, 3500); // 1.5s + 2s as requested

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentState]);

  const handleAction = useCallback(
    (type: string) => {
      if (currentState === "OFF") {
        if (type === "MENU") {
          setCurrentState("BOOTING");
        }
        return; // No other buttons respond when OFF
      }

      if (currentState === "BOOTING") {
        return; // No buttons respond during BOOTING (except possibly system refresh)
      }

      if (currentState === "MAIN_MENU") {
        if (type === "UP") {
          setOsActiveIndex((prev) => (prev === 0 ? 4 : prev - 1)); // Wrap to bottom
        } else if (type === "DOWN") {
          setOsActiveIndex((prev) => (prev === 4 ? 0 : prev + 1)); // Wrap to top
        } else if (type === "A") {
          // If 'Power Off' (index 4) is selected
          if (osActiveIndex === 4) {
             setCurrentState("POWER_CONFIRM");
             setSelectedPowerOption("NO");
          }
        }
        return;
      }

      if (currentState === "POWER_CONFIRM") {
        if (type === "UP" || type === "DOWN") {
          setSelectedPowerOption((prev) => (prev === "YES" ? "NO" : "YES"));
        } else if (type === "B") {
          setCurrentState("MAIN_MENU");
        } else if (type === "A") {
          if (selectedPowerOption === "YES") {
            setCurrentState("OFF");
          } else {
            setCurrentState("MAIN_MENU");
          }
        }
        return;
      }
    },
    [currentState, selectedPowerOption, osActiveIndex]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e8e5e0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          style={{
            width: "220px",
            height: "362px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <GameBoy state={currentState} bootStep={bootStep} onAction={handleAction} selectedPowerOption={selectedPowerOption} osActiveIndex={osActiveIndex} />
        </div>
      </div>
    </div>
  );
}
