import svgPaths from "./svg-lmu6lkplfc";
import VintageOS from "../app/VintageOS";
import SnakeGame from "../app/SnakeGame";
import TetrisGame from "../app/TetrisGame";
import NESEmulator from "../app/NESEmulator";
import StatsScreen from "../app/StatsScreen";
import SettingsScreen from "../app/SettingsScreen";

interface GameBoyProps {
  state: "OFF" | "BOOTING" | "MAIN_MENU" | "POWER_CONFIRM" | "PLAYING_SNAKE" | "PLAYING_TETRIS" | "PLAYING_MARIO" | "VIEWING_STATS" | "VIEWING_SETTINGS";
  bootStep: number;
  onAction: (type: string) => void;
  selectedPowerOption: "YES" | "NO";
  osActiveIndex: number;
}

function DPad1({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="absolute left-[20px] size-[72px] top-[207px] transition-transform duration-[50ms] active:scale-[0.98]" data-name="D-Pad">
      <div className="absolute inset-[-16.67%_-16.67%_-27.78%_-27.78%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 104">
          <g filter="url(#filter0_d_2_76)" id="D-Pad">
            <path d={svgPaths.p7bde280} fill="url(#paint0_linear_2_76)" id="Indent" />
            <g filter="url(#filter1_ii_2_76)" id="Cross">
              <path
                d={svgPaths.p20e9c00}
                fill="var(--fill-0, #5D5F60)"
              />
            </g>
            <g
              filter="url(#filter2_i_2_76)"
              id="Icon"
              className="cursor-pointer"
              onPointerDown={() => { onAction("LEFT"); }}
              onPointerUp={() => { onAction("LEFT_RELEASE"); }}
              onPointerLeave={() => { onAction("LEFT_RELEASE"); }}
            >
              {/* Invisible Hitbox Expander for LEFT */}
              <rect x="18" y="38" width="26" height="26" fill="transparent" />
              <path d={svgPaths.p2df174c0} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter3_i_2_76)"
              id="Icon_2"
              className="cursor-pointer"
              onPointerDown={() => { onAction("UP"); }}
              onPointerUp={() => { onAction("UP_RELEASE"); }}
              onPointerLeave={() => { onAction("UP_RELEASE"); }}
            >
              {/* Invisible Hitbox Expander for UP */}
              <rect x="38" y="16" width="26" height="26" fill="transparent" />
              <path d={svgPaths.p1adcca00} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter4_i_2_76)"
              id="Icon_3"
              className="cursor-pointer"
              onPointerDown={() => { onAction("RIGHT"); }}
              onPointerUp={() => { onAction("RIGHT_RELEASE"); }}
              onPointerLeave={() => { onAction("RIGHT_RELEASE"); }}
            >
              {/* Invisible Hitbox Expander for RIGHT */}
              <rect x="62" y="38" width="26" height="26" fill="transparent" />
              <path d={svgPaths.p1fbf7280} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter5_i_2_76)"
              id="Icon_4"
              className="cursor-pointer"
              onPointerDown={() => { onAction("DOWN"); }}
              onPointerUp={() => { onAction("DOWN_RELEASE"); }}
              onPointerLeave={() => { onAction("DOWN_RELEASE"); }}
            >
              {/* Invisible Hitbox Expander for DOWN */}
              <rect x="38" y="62" width="26" height="26" fill="transparent" />
              <path d={svgPaths.p2eaf4980} stroke="#111111" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g filter="url(#filter6_ii_2_76)" id="Gap">
              <circle cx="56" cy="48" fill="var(--fill-0, #5D5F60)" r="6" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="104" id="filter0_d_2_76" width="104" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-4" dy="4" />
              <feGaussianBlur stdDeviation="8" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_76" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_76" mode="normal" result="shape" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="72.2109" id="filter1_ii_2_76" width="72.2109" x="19.8945" y="11.8945">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-2" dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="2" dy="-2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="effect1_innerShadow_2_76" mode="normal" result="effect2_innerShadow_2_76" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter2_i_2_76" width="15" x="26.5" y="41.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter3_i_2_76" width="13" x="49.5" y="18.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter4_i_2_76" width="15" x="70.5" y="41.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15" id="filter5_i_2_76" width="13" x="49.5" y="62.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="14" id="filter6_ii_2_76" width="14" x="49" y="41">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="-1" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_2_76" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="-1" dy="1" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="effect1_innerShadow_2_76" mode="normal" result="effect2_innerShadow_2_76" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2_76" x1="92" x2="20" y1="12" y2="84">
              <stop stopColor="#2A2729" />
              <stop offset="1" stopColor="#121112" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function DPad({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="absolute contents left-[20px] top-[207px]" data-name="D-Pad">
      <DPad1 onAction={onAction} />
    </div>
  );
}

function Center() {
  return <div className="rounded-[999px] shrink-0 size-[22px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 22 22\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.4 -1.5 1.5 1.4 4 19)\\'><stop stop-color=\\'rgba(106,106,104,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(81,81,79,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(56,56,55,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(30,30,30,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(18,18,17,1)\\' offset=\\'0.875\\'/><stop stop-color=\\'rgba(5,5,5,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }}>
      <Center />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent />
    </div>
  );
}

function Button1({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[66.8px] top-[226.64px] w-[25.2px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="X Button" onPointerDown={() => onAction("X")} onPointerUp={() => onAction("X_RELEASE")} onPointerLeave={() => onAction("X_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.92] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button2 />
      </div>
      <div className="opacity-90 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#2e2b5e] text-[8px] tracking-[-0.24px] whitespace-nowrap pt-[2px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.15)]">X</p>
      </div>
    </div>
  );
}

function Center1() {
  return <div className="rounded-[999px] shrink-0 size-[22px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 22 22\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.4 -1.5 1.5 1.4 4 19)\\'><stop stop-color=\\'rgba(106,106,104,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(81,81,79,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(56,56,55,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(30,30,30,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(18,18,17,1)\\' offset=\\'0.875\\'/><stop stop-color=\\'rgba(5,5,5,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent1() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }}>
      <Center1 />
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent1 />
    </div>
  );
}

function Button3({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[43.4px] top-[203px] w-[25.2px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="Y Button" onPointerDown={() => onAction("Y")} onPointerUp={() => onAction("Y_RELEASE")} onPointerLeave={() => onAction("Y_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.92] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button4 />
      </div>
      <div className="opacity-90 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#2e2b5e] text-[8px] tracking-[-0.24px] whitespace-nowrap pt-[2px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.15)]">Y</p>
      </div>
    </div>
  );
}

function Center2() {
  return <div className="rounded-[999px] shrink-0 size-[22px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 22 22\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.4 -1.5 1.5 1.4 4 19)\\'><stop stop-color=\\'rgba(242,142,190,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(223,111,172,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(203,80,155,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(183,49,138,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(164,18,120,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent2() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(225deg, rgb(242, 134, 202) 16.087%, rgb(119, 13, 88) 84.152%)" }}>
      <Center2 />
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent2 />
    </div>
  );
}

function Button5({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[20px] top-[226.64px] w-[25.2px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="B Button" onPointerDown={() => onAction("B")} onPointerUp={() => onAction("B_RELEASE")} onPointerLeave={() => onAction("B_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.92] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button6 />
      </div>
      <div className="opacity-90 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#732031] text-[8px] tracking-[-0.24px] whitespace-nowrap pt-[2px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.15)]">B</p>
      </div>
    </div>
  );
}

function Center3() {
  return <div className="rounded-[999px] shrink-0 size-[22px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 22 22\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.4 -1.5 1.5 1.4 4 19)\\'><stop stop-color=\\'rgba(242,142,190,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(223,111,172,1)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(203,80,155,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(183,49,138,1)\\' offset=\\'0.75\\'/><stop stop-color=\\'rgba(164,18,120,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent3() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(225deg, rgb(242, 134, 202) 16.087%, rgb(119, 13, 88) 84.152%)" }}>
      <Center3 />
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex items-start p-[2px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent3 />
    </div>
  );
}

function Button7({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[43.4px] top-[250.27px] w-[25.2px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="A Button" onPointerDown={() => onAction("A")} onPointerUp={() => onAction("A_RELEASE")} onPointerLeave={() => onAction("A_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.92] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button8 />
      </div>
      <div className="opacity-90 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#732031] text-[8px] tracking-[-0.24px] whitespace-nowrap pt-[2px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.15)]">A</p>
      </div>
    </div>
  );
}

function Button({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="absolute contents right-[20px] top-[203px]" data-name="Button">
      <Button1 onAction={onAction} />
      <Button3 onAction={onAction} />
      <Button5 onAction={onAction} />
      <Button7 onAction={onAction} />
    </div>
  );
}

function Center4() {
  return <div className="rounded-[999px] shrink-0 size-[12px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 12 12\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0.76364 -0.81818 0.81818 0.76364 2.1818 10.364)\\'><stop stop-color=\\'rgba(106,106,104,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(85,85,84,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(64,64,64,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent4() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(225deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }}>
      <Center4 />
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent4 />
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(225deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }}>
      <Button11 />
    </div>
  );
}

function Button9({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group -translate-x-1/2 absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[28px] items-center left-1/2 top-[187px] w-[22px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="Power Button" onClick={() => onAction("MENU")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.92] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button10 />
      </div>
      <div className="opacity-80 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#555] text-[7px] tracking-tight whitespace-nowrap pt-[2px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.3)]">ON/OFF</p>
      </div>
    </div>
  );
}

function Center5() {
  return <div className="h-[8px] rounded-[999px] shrink-0 w-[24px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 8\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.5273 -0.54545 1.6364 0.50909 4.3636 6.9091)\\'><stop stop-color=\\'rgba(106,106,104,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(85,85,84,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(64,64,64,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent5() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(201.038deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }}>
      <Center5 />
    </div>
  );
}

function Button14() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(203.199deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent5 />
    </div>
  );
}

function Button13() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(209.055deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }}>
      <Button14 />
    </div>
  );
}

function Button12({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group content-stretch cursor-pointer flex flex-col gap-[4px] h-[22px] items-center relative w-[32px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="Select Button" onPointerDown={() => onAction("SELECT")} onPointerUp={() => onAction("SELECT_RELEASE")} onPointerLeave={() => onAction("SELECT_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.95] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button13 />
      </div>
      <div className="opacity-80 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#555] text-[7px] tracking-tight whitespace-nowrap pt-[4px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.3)]">SELECT</p>
      </div>
    </div>
  );
}

function Group2({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%-27.91px)] top-[301px]">
      <div className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%-27.91px)] size-[38.184px] top-[301px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-45 flex-none">
          <Button12 onAction={onAction} />
        </div>
      </div>
    </div>
  );
}

function Center6() {
  return <div className="h-[8px] rounded-[999px] shrink-0 w-[24px]" data-name="Center" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 24 8\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(1.5273 -0.54545 1.6364 0.50909 4.3636 6.9091)\\'><stop stop-color=\\'rgba(106,106,104,1)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(85,85,84,1)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(64,64,64,1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />;
}

function Indent6() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Indent" style={{ backgroundImage: "linear-gradient(201.038deg, rgb(133, 133, 131) 16.087%, rgb(53, 52, 49) 84.152%)" }}>
      <Center6 />
    </div>
  );
}

function Button17() {
  return (
    <div className="content-stretch flex items-start p-px relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(203.199deg, rgb(42, 39, 41) 0%, rgb(18, 17, 18) 100%)" }}>
      <Indent6 />
    </div>
  );
}

function Button16() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[999px] shrink-0" data-name="Button" style={{ backgroundImage: "linear-gradient(209.055deg, rgb(156, 154, 150) 20.818%, rgb(181, 180, 176) 78.599%)" }}>
      <Button17 />
    </div>
  );
}

function Button15({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div
      className="group content-stretch cursor-pointer flex flex-col gap-[4px] h-[22px] items-center relative w-[32px]"
      data-name="Button"
    >
      <div className="absolute -inset-1 z-10" role="button" aria-label="Start Button" onPointerDown={() => onAction("START")} onPointerUp={() => onAction("START_RELEASE")} onPointerLeave={() => onAction("START_RELEASE")} />
      <div className="transition-transform duration-[50ms] group-active:scale-[0.95] group-active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-[999px]">
        <Button16 />
      </div>
      <div className="opacity-80 flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#555] text-[7px] tracking-tight whitespace-nowrap pt-[4px]">
        <p className="leading-[1.2] drop-shadow-[0_1px_rgba(255,255,255,0.3)]">START</p>
      </div>
    </div>
  );
}

function Group1({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+27.09px)] top-[301px]">
      <div className="-translate-x-1/2 absolute flex items-center justify-center left-[calc(50%+27.09px)] size-[38.184px] top-[301px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-45 flex-none">
          <Button15 onAction={onAction} />
        </div>
      </div>
    </div>
  );
}

function Frame({
  state,
  bootStep,
  selectedPowerOption,
  osActiveIndex,
  onAction,
}: {
  state: string;
  bootStep: number;
  selectedPowerOption: string;
  osActiveIndex: number;
  onAction: (type: string) => void;
}) {
  return (
    <div className="absolute bg-[#1b1b1b] flex flex-col items-center justify-center overflow-hidden rounded-[4px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] inset-[6px]" style={{ width: '182px', height: '158px' }}>
      {state === "OFF" && <div className="absolute inset-0 bg-black" />}

      {state === "BOOTING" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg)] z-50 overflow-hidden">
          {bootStep === 2 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="vintage-screen-bg" />
              <div className="vintage-scanlines" />
              <div className="vintage-vignette" />
              <div className="vintage-screen-glow" />
            </div>
          )}

          <div className={`flex flex-col items-center gap-[6px] transition-all duration-1000 ease-out ${bootStep >= 1 ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 -translate-y-4"} z-10 relative`}>
             
             {/* Main Logo stylized like header */}
             <div className="vintage-title-main text-[14px] tracking-widest text-shadow-sm mb-[2px]">
                GAME BOY
             </div>

             <div className="flex items-center justify-center bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)] px-[6px] py-[3px] rounded-[2px]">
               <span className="text-[6.5px] font-black text-[var(--orange)] tracking-[3px] drop-shadow-[0_0_2px_rgba(255,140,0,0.4)]">VINTAGE OS</span>
             </div>

             {bootStep === 2 && (
               <div className="text-[4px] font-bold text-[#888] tracking-widest mt-6 animate-pulse uppercase">
                 SYSTEM BOOTING...
               </div>
             )}
          </div>
        </div>
      )}

      {state === "MAIN_MENU" && (
        <VintageOS activeIndex={osActiveIndex} />
      )}

      {state === "PLAYING_SNAKE" && (
        <SnakeGame onAction={onAction} />
      )}

      {state === "PLAYING_TETRIS" && (
        <TetrisGame onAction={onAction} />
      )}

      {state === "PLAYING_MARIO" && (
        <NESEmulator />
      )}
      
      {state === "VIEWING_SETTINGS" && (
        <SettingsScreen onAction={onAction} />
      )}
      
      {state === "VIEWING_STATS" && (
        <StatsScreen />
      )}

      {state === "POWER_CONFIRM" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg)] overflow-hidden">
          {/* Background CRT Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="vintage-screen-bg" />
            <div className="vintage-scanlines" />
            <div className="vintage-vignette" />
            <div className="vintage-screen-glow" />
          </div>

          <div className="z-10 w-full px-2 flex flex-col gap-2">
            
            <div className="vintage-title-row">
              <span className="vintage-title-main">GAME BOY</span>
              <span className="vintage-title-tag !text-[#ef4444] !border-[rgba(239,68,68,0.3)]">POWER</span>
            </div>

            <div className="vintage-main-area flex-col p-2 gap-[4px]">
              
              <div className="flex items-center justify-center p-[5px] rounded-[2px] bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.5)] shadow-[inset_0_0_4px_rgba(239,68,68,0.1)] mb-[2px]">
                <span className="text-[5.5px] font-black tracking-widest text-[#ef4444] drop-shadow-[0_0_2px_rgba(239,68,68,0.8)]">SYSTEM SHUTDOWN?</span>
              </div>

              {/* NO Option */}
              <div 
                className={`flex items-center justify-between p-[5px] rounded-[2px] transition-colors ${selectedPowerOption === "NO" ? "bg-[rgba(255,140,0,0.15)] border border-[rgba(255,140,0,0.5)] shadow-[inset_0_0_4px_rgba(255,140,0,0.1)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}
              >
                <span className={`text-[5px] font-bold tracking-wide ${selectedPowerOption === "NO" ? "text-white" : "text-[#888]"}`}>CANCEL</span>
                <span className={`text-[5px] font-black ${selectedPowerOption === "NO" ? "text-[#ff8c00] animate-pulse" : "text-transparent"}`}>◄</span>
              </div>

              {/* YES Option */}
              <div 
                className={`flex items-center justify-between p-[5px] rounded-[2px] transition-colors ${selectedPowerOption === "YES" ? "bg-[rgba(239,68,68,0.15)] border border-[#ef4444] shadow-[inset_0_0_4px_rgba(239,68,68,0.2)]" : "bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.05)]"}`}
              >
                <span className={`text-[5px] font-bold tracking-wide ${selectedPowerOption === "YES" ? "text-white" : "text-[#555]"}`}>POWER OFF</span>
                <span className={`text-[5px] font-black ${selectedPowerOption === "YES" ? "text-[#ef4444] animate-pulse" : "text-transparent"}`}>◄</span>
              </div>

            </div>
          </div>

          {/* Bottom hints */}
          <div className="absolute bottom-0 left-0 right-0 h-[14px] flex items-center justify-between px-2 bg-[var(--bg)] border-t border-[rgba(255,255,255,0.05)] z-[200]">
            <div className="vintage-hint" style={{ marginRight: 'auto' }}>
              <span className="vintage-hk">A</span>
              <span className="vintage-ha">CONFIRM</span>
            </div>
            <div className="vintage-hint">
              <span className="vintage-hk">B</span>
              <span className="vintage-ha">BACK</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenContainer({
  state,
  bootStep,
  selectedPowerOption,
  osActiveIndex,
  onAction,
}: {
  state: string;
  bootStep: number;
  selectedPowerOption: string;
  osActiveIndex: number;
  onAction: (type: string) => void;
}) {
  return (
    <div
      className="absolute bg-[#080808] left-[8px] overflow-clip right-[8px] rounded-[6px] shadow-[0px_1px_1px_0px_rgba(255,255,255,0.5)] top-[10px]"
      style={{ height: "170px", width: "194px" }}
      data-name="Screen container"
    >
      <Frame state={state} bootStep={bootStep} selectedPowerOption={selectedPowerOption} osActiveIndex={osActiveIndex} onAction={onAction} />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_2px_2px_0px_rgba(0,0,0,0.5),inset_-2px_2px_2px_0px_rgba(255,255,255,0.25)]" />
    </div>
  );
}

function Gap() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Gap1() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Gap2() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Gap3() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Gap4() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Gap5() {
  return (
    <div className="bg-[#868079] h-[3px] relative rounded-[3px] shrink-0 w-[24px]" data-name="Gap">
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-1px_0px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function SoundGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[35.827px] items-center justify-center relative w-[26.399px]" data-name="Sound grid">
      <Gap />
      <Gap1 />
      <Gap2 />
      <Gap3 />
      <Gap4 />
      <Gap5 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute bottom-[6px] contents right-[6px]">
      <div className="absolute bottom-[6px] flex items-center justify-center right-[6px] size-[44px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-45">
          <SoundGrid />
        </div>
      </div>
    </div>
  );
}

export default function GameBoy({ state, bootStep, onAction, selectedPowerOption, osActiveIndex }: GameBoyProps) {
  return (
    <div className="bg-[#c8c5c2] overflow-clip relative rounded-bl-[14px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] size-full select-none" data-name="GameBoy" role="application" aria-label="GameBoy Emulator Core">
      <DPad onAction={onAction} />
      <Button onAction={onAction} />
      <Button9 onAction={onAction} />
      <Group2 onAction={onAction} />
      <Group1 onAction={onAction} />
      <ScreenContainer state={state} bootStep={bootStep} selectedPowerOption={selectedPowerOption} osActiveIndex={osActiveIndex} onAction={onAction} />
      <Group />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-2px_2px_4px_0px_rgba(0,0,0,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.25),inset_2px_0px_4px_0px_rgba(255,255,255,0.5)]" />
    </div>
  );
}