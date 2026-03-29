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
    isCartridgeBooting,
    setCartridgeBooting,
    activeOSModal,
    setOSModal,
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

      const scaleX = (width * 0.9) / targetWidth;
      const scaleY = (height * 0.9) / targetHeight;
      const newScale = Math.min(scaleX, scaleY);

      // Strictly fit screen, removed max() override causing overflow.
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

    // GLOBAL ON/OFF INTERCEPT - Press MENU to toggle power
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
    if (currentScreen === "OFF" || currentScreen === "BOOTING" || isCartridgeBooting) return;

    // GLOBAL OS MODAL DISMISSAL - Intercept A/B/START to close modal
    if (activeOSModal) {
      if (!isRelease && (baseType === "A" || baseType === "B" || baseType === "START")) {
        play("BACK");
        setOSModal(null);
      }
      return;
    }

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
        const screens: Array<"PLAYING_MARIO" | "PLAYING_SNAKE" | "PLAYING_TETRIS" | "VIEWING_STATS" | "VIEWING_SETTINGS"> = 
          ["PLAYING_MARIO", "PLAYING_SNAKE", "PLAYING_TETRIS", "VIEWING_STATS", "VIEWING_SETTINGS"];
        
        const targetScreen = screens[selectedMenuItem];
        
        // Only run boot sequence for games, not OS menus (settings/stats)
        if (targetScreen.startsWith("PLAYING_")) {
          // Increment play counts
          const gameId = targetScreen === "PLAYING_MARIO" ? "mario" : 
                         targetScreen === "PLAYING_SNAKE" ? "snake" : "tetris";
          const currentPlays = parseInt(localStorage.getItem(`${gameId}_plays`) || "0", 10);
          localStorage.setItem(`${gameId}_plays`, (currentPlays + 1).toString());

          setCartridgeBooting(true);
          setTimeout(() => {
            navigateTo(targetScreen);
            setCartridgeBooting(false);
          }, 300); // Wait for CSS flash wipe to complete
        } else {
          navigateTo(targetScreen);
        }
      }
      return;
    }

    if (currentScreen.startsWith("PLAYING_") || currentScreen.startsWith("VIEWING_")) {
      if (!isRelease && baseType === "SELECT") {
        play("BACK");
        navigateTo("MAIN_MENU");
        return;
      }
      const gameInput = (window as any).__gameInput;
      if (gameInput) {
        // Special case for Mario/NES emulator which needs press/release state
        if (currentScreen === "PLAYING_MARIO") {
          gameInput(baseType, !isRelease);
        } else if (!isRelease) {
          gameInput(baseType);
        }
      }
      return;
    }

    if (currentScreen === "POWER_CONFIRM") {
      if (isRelease) return;
      if (baseType === "UP" || baseType === "DOWN" || baseType === "LEFT" || baseType === "RIGHT") {
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
  }, [currentScreen, selectedMenuItem, powerOption, initAudio, play, powerOn, powerOff, navigateTo, setSelectedMenuItem, setPowerOption, isCartridgeBooting, setCartridgeBooting, activeOSModal, setOSModal]);

  // Global Keyboard Event Listener for OS Navigation
  useEffect(() => {
    // Only capture keyboard if we're not in a game (games handle their own keyboard via __gameInput OR their own listeners)
    // Wait, Snake/Tetris/Mario all have their own keydown listeners OR we pass them via __gameInput.
    // So for MAIN_MENU and OS screens, we need our own keyboard hook to dispatch to handleAction.
    const isOSScreen = currentScreen === "MAIN_MENU" || currentScreen === "POWER_CONFIRM" || currentScreen === "VIEWING_STATS" || currentScreen === "VIEWING_SETTINGS" || activeOSModal !== null || currentScreen === "OFF";

    const keyMap: Record<string, string> = {
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
      KeyZ: "A",
      KeyX: "B",
      Enter: "START",
      ShiftLeft: "SELECT",
      ShiftRight: "SELECT",
      Escape: "MENU"
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Always prevent default scrolling for gameboy controls on OS screens
      if (isOSScreen && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.code)) {
        e.preventDefault();
      }
      
      const action = keyMap[e.code];
      if (action && isOSScreen) {
        handleAction(action);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const action = keyMap[e.code];
      if (action && isOSScreen) {
        handleAction(`${action}_RELEASE`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentScreen, activeOSModal, handleAction]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e8e5e0",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        touchAction: "none",
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
            width: "210px",
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
