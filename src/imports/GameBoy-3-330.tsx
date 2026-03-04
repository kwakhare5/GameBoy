import svgPaths from "./svg-lmu6lkplfc";

interface GameBoyProps {
  state: "OFF" | "BOOTING" | "MAIN_MENU" | "POWER_CONFIRM";
  bootStep: number;
  onAction: (type: string) => void;
  selectedPowerOption: "YES" | "NO";
}

function DPad1({ onAction }: { onAction: (type: string) => void }) {
  return (
    <div className="absolute left-[20px] size-[72px] top-[207px]" data-name="D-Pad">
      <div className="absolute inset-[-16.67%_-16.67%_-27.78%_-27.78%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 104">
          <g filter="url(#filter0_d_2_76)" id="D-Pad">
            <path d={svgPaths.p7bde280} fill="url(#paint0_linear_2_76)" id="Indent" />
            <g filter="url(#filter1_ii_2_76)" id="Cross">
              <path
                d={svgPaths.p20e9c00}
                fill="var(--fill-0, #5D5F60)"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction("DPAD");
                }}
              />
            </g>
            <g
              filter="url(#filter2_i_2_76)"
              id="Icon"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAction("LEFT");
              }}
            >
              <path d={svgPaths.p2df174c0} stroke="var(--stroke-0, #464946)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter3_i_2_76)"
              id="Icon_2"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAction("UP");
              }}
            >
              <path d={svgPaths.p1adcca00} stroke="var(--stroke-0, #464946)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter4_i_2_76)"
              id="Icon_3"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAction("RIGHT");
              }}
            >
              <path d={svgPaths.p1fbf7280} stroke="var(--stroke-0, #464946)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </g>
            <g
              filter="url(#filter5_i_2_76)"
              id="Icon_4"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAction("DOWN");
              }}
            >
              <path d={svgPaths.p2eaf4980} stroke="var(--stroke-0, #464946)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
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
      className="absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[66.8px] top-[226.64px] w-[25.2px]"
      data-name="Button"
      onClick={() => onAction("X")}
    >
      <Button2 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">X</p>
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
      className="absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[43.4px] top-[203px] w-[25.2px]"
      data-name="Button"
      onClick={() => onAction("Y")}
    >
      <Button4 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">Y</p>
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
      className="absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[20px] top-[226.64px] w-[25.2px]"
      data-name="Button"
      onClick={() => onAction("B")}
    >
      <Button6 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">B</p>
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
      className="absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[32.727px] items-center right-[43.4px] top-[250.27px] w-[25.2px]"
      data-name="Button"
      onClick={() => onAction("A")}
    >
      <Button8 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">A</p>
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
      className="-translate-x-1/2 absolute content-stretch cursor-pointer flex flex-col gap-[2px] h-[28px] items-center left-1/2 top-[187px] w-[22px]"
      data-name="Button"
      onClick={() => onAction("MENU")}
    >
      <Button10 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">MENU</p>
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
      className="content-stretch cursor-pointer flex flex-col gap-[2px] h-[22px] items-center relative w-[32px]"
      data-name="Button"
      onClick={() => onAction("SELECT")}
    >
      <Button13 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">Select</p>
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
      className="content-stretch cursor-pointer flex flex-col gap-[2px] h-[22px] items-center relative w-[32px]"
      data-name="Button"
      onClick={() => onAction("START")}
    >
      <Button16 />
      <div className="flex flex-col font-['IBM_Plex_Mono:Bold',sans-serif] justify-end leading-[0] not-italic relative shrink-0 text-[#302f6b] text-[8px] tracking-[-0.24px] whitespace-nowrap">
        <p className="leading-[1.2]">Start</p>
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
}: {
  state: string;
  bootStep: number;
  selectedPowerOption: string;
}) {
  return (
    <div className="absolute bg-[#1b1b1b] flex flex-col items-center justify-center overflow-hidden rounded-[1px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] top-[12px] bottom-[12.37px] left-[12px] right-[12px]">
      {state === "OFF" && <div className="absolute inset-0 bg-black" />}

      {state === "BOOTING" && (
        <div className="flex flex-col items-center gap-2">
          <div className="font-['IBM_Plex_Mono:Bold',sans-serif] text-[20px] text-[#e0dbd1] tracking-widest animate-pulse">
            GAME BOY
          </div>
          {bootStep === 2 && (
            <div className="font-['IBM_Plex_Mono',sans-serif] text-[10px] text-[#e0dbd1] opacity-80">
              Booting...
            </div>
          )}
        </div>
      )}

      {state === "MAIN_MENU" && (
        <div className="flex flex-col items-center p-4 h-full w-full bg-[#8b956d]">
          <div className="font-['IBM_Plex_Mono:Bold',sans-serif] text-[14px] text-[#0f380f] mb-4">
            MAIN MENU
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[10px] text-[#0f380f] text-center italic">
              Ready to Play
            </div>
          </div>
        </div>
      )}

      {state === "POWER_CONFIRM" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center bg-[#c8c5c2] p-4 rounded-sm border-2 border-[#1b1b1b]">
            <div className="font-['IBM_Plex_Mono:Bold',sans-serif] text-[12px] text-[#1b1b1b] mb-4">
              POWER OFF?
            </div>
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${selectedPowerOption === "NO" ? "visible" : "invisible"}`}>
                  {">"}
                </span>
                <span className={`font-['IBM_Plex_Mono',sans-serif] text-[10px] ${selectedPowerOption === "NO" ? "font-bold text-red-600" : "text-[#1b1b1b]"}`}>
                  NO
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] ${selectedPowerOption === "YES" ? "visible" : "invisible"}`}>
                  {">"}
                </span>
                <span className={`font-['IBM_Plex_Mono',sans-serif] text-[10px] ${selectedPowerOption === "YES" ? "font-bold text-red-600" : "text-[#1b1b1b]"}`}>
                  YES
                </span>
              </div>
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
}: {
  state: string;
  bootStep: number;
  selectedPowerOption: string;
}) {
  return (
    <div
      className="-translate-y-1/2 absolute aspect-[246/190] bg-[#080808] left-[6px] overflow-clip right-[6px] rounded-[6px] shadow-[0px_1px_1px_0px_rgba(255,255,255,0.5)] top-[calc(50%-90.81px)]"
      data-name="Screen container"
    >
      <Frame state={state} bootStep={bootStep} selectedPowerOption={selectedPowerOption} />
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

export default function GameBoy({ state, bootStep, onAction, selectedPowerOption }: GameBoyProps) {
  return (
    <div className="bg-[#c8c5c2] overflow-clip relative rounded-bl-[14px] rounded-br-[14px] rounded-tl-[10px] rounded-tr-[10px] size-full select-none" data-name="GameBoy">
      <DPad onAction={onAction} />
      <Button onAction={onAction} />
      <Button9 onAction={onAction} />
      <Group2 onAction={onAction} />
      <Group1 onAction={onAction} />
      <ScreenContainer state={state} bootStep={bootStep} selectedPowerOption={selectedPowerOption} />
      <Group />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-2px_2px_4px_0px_rgba(0,0,0,0.25),inset_0px_-2px_4px_0px_rgba(0,0,0,0.25),inset_2px_0px_4px_0px_rgba(255,255,255,0.5)]" />
    </div>
  );
}