# 🤖 AGENT STANDARDS: SCREEN DEFINITIONS [STRICT LOCK]

**ATTENTION ALL AGENTS (QWEN, etc.):**
**CRITICAL: DIMENSIONS ARE FINAL. DO NOT MODIFY.**
To ensure consistency and avoid layout breakage, you MUST adhere to the following 2-screen standard. DO NOT change these dimensions.

## 1. The Two Screen Standard

### 🟢 SCREEN A: Primary Display (The Main One)

- **What it is**: The actual content area **INSIDE** the black bezels.
- **Dimensions**: **182px × 158px**
- **Usage**: This is where the user sees everything. All games (Snake, Tetris, Mario) and OS menus MUST fit here.

### 🔴 SCREEN B: Secondary Screen (With Bezels)

- **What it is**: The outer window area that **INCLUDES** the 6px black bezels.
- **Dimensions**: **194px × 170px**
- **Usage**: This is the "glass" area of the Game Boy.

---

## 2. Hardware Constraints

- **Game Boy Chassis Width**: Fixed at **210px**.
- **Bezel Size**: Fixed at **6px** on all sides.
- **Body Margin**: Fixed at **8px** on sides and **10px** on top.

## 3. Layout Budget (Primary Display: 158px Height)

## 3. Layout Budget (Primary Display: 158px Height)

- **Top Nav Bar**: 12px (PERMANENT FIXED HUD)
- **Middle Content Area**: **134px (THE ONLY USABLE AREA)**
- **Bottom Nav Bar**: 12px (PERMANENT FIXED HUD)

**CRITICAL RULE**: The Top and Bottom navigation bars are PERMANENT. Nothing should ever go outside of them. The _only_ usable area for games, menus, and interfaces is the **134px** middle section.

**UNDERSTOOD?** Maintain these numbers to keep the UI pixel-perfect.
