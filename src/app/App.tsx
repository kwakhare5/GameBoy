import { useState, useEffect, useCallback } from "react";
import GameBoy from "../imports/GameBoy-3-330";
import { useGameBoyStore } from "../stores/gameBoyStore";
import { useGameBoySound } from "../hooks/useGameBoySound";

export default function App() {
  const {
    currentScreen,
    bootStep,
    selectedMenuItem,
    powerOption,
    powerOn,
    powerOff,
    navigateTo,
    setSelectedMenuItem,
    setPowerOption,
  } = useGameBoyStore();

  const { init: initAudio, play } = useGameBoySound();

  // Calculate scale based on window size
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const targetWidth = 220;
      const targetHeight = 362;

      const scaleX = (width * 0.85) / targetWidth;
      const scaleY = (height * 0.85) / targetHeight;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAction = useCallback((type: string) => {
    // Initialize audio on first user interaction
    initAudio();

    const isRelease = type.endsWith("_RELEASE");
    const baseType = isRelease ? type.replace("_RELEASE", "") : type;

    // GLOBAL ON/OFF INTERCEPT
    if (baseType === "MENU" && !isRelease) {
      if (currentScreen === "OFF") {
        play("POWER_ON");
        powerOn();
      } else if (currentScreen !== "BOOTING") {
        play("SELECT");
        navigateTo("POWER_CONFIRM");
        setPowerOption("NO");
      }
      return;
    }

    // If powered off or booting, ignore everything else
    if (currentScreen === "OFF" || currentScreen === "BOOTING") return;

    // GLOBAL QUIT INTERCEPT
    if (!isRelease && baseType === "QUIT_GAME") {
      play("BACK");
      if (currentScreen !== "MAIN_MENU" && currentScreen !== "POWER_CONFIRM") {
        navigateTo("MAIN_MENU");
        return;
      }
    }

    // STATE-SPECIFIC ACTIONS
    if (currentScreen === "MAIN_MENU") {
      if (isRelease) return;

      if (baseType === "UP") {
        play("MOVE");
        setSelectedMenuItem(selectedMenuItem <= 0 ? 4 : selectedMenuItem - 1);
      } else if (baseType === "DOWN") {
        play("MOVE");
        setSelectedMenuItem(selectedMenuItem >= 4 ? 0 : selectedMenuItem + 1);
      } else if (baseType === "A" || baseType === "START") {
        play("CONFIRM");
        const screens: Array<"PLAYING_SNAKE" | "PLAYING_TETRIS" | "PLAYING_MARIO" | "VIEWING_STATS" | "VIEWING_SETTINGS"> = 
          ["PLAYING_SNAKE", "PLAYING_TETRIS", "PLAYING_MARIO", "VIEWING_STATS", "VIEWING_SETTINGS"];
        navigateTo(screens[selectedMenuItem]);
      }
      return;
    }

    if (currentScreen === "PLAYING_SNAKE") {
      if (isRelease) return;
      const snakeInput = (window as any).__snakeInput;
      if (snakeInput) snakeInput(baseType);
      return;
    }

    if (currentScreen === "PLAYING_TETRIS") {
      if (isRelease) return;
      const tetrisInput = (window as any).__tetrisInput;
      if (tetrisInput) tetrisInput(baseType);
      return;
    }

    if (currentScreen === "PLAYING_MARIO") {
      if (baseType === "START" && !isRelease) {
        play("BACK");
        navigateTo("MAIN_MENU");
        return;
      }
      const nesInput = (window as any).__nesInput;
      if (nesInput && ["UP", "DOWN", "LEFT", "RIGHT", "A", "B"].includes(baseType)) {
        nesInput(baseType, !isRelease);
      }
      return;
    }

    if (currentScreen === "VIEWING_STATS" || currentScreen === "VIEWING_SETTINGS") {
      if (isRelease) return;
      if (baseType === "B" || baseType === "QUIT_GAME") {
        play("BACK");
        navigateTo("MAIN_MENU");
        return;
      }

      if (currentScreen === "VIEWING_SETTINGS") {
        const settingsInput = (window as any).__settingsInput;
        if (settingsInput) settingsInput(baseType);
      }
      return;
    }

    if (currentScreen === "POWER_CONFIRM") {
      if (isRelease) return;
      if (baseType === "UP" || baseType === "DOWN") {
        play("MOVE");
        setPowerOption(powerOption === "YES" ? "NO" : "YES");
      } else if (baseType === "B") {
        play("BACK");
        navigateTo("MAIN_MENU");
      } else if (baseType === "A") {
        if (powerOption === "YES") {
          play("POWER_OFF");
          powerOff();
        } else {
          play("BACK");
          navigateTo("MAIN_MENU");
        }
      }
      return;
    }
  }, [currentScreen, selectedMenuItem, powerOption, initAudio, play, powerOn, powerOff, navigateTo, setSelectedMenuItem, setPowerOption]);

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
          <GameBoy
            state={currentScreen}
            bootStep={bootStep}
            onAction={handleAction}
            selectedPowerOption={powerOption}
            osActiveIndex={selectedMenuItem}
          />
        </div>
      </div>
    </div>
  );
}
