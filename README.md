# Headcount Scenario Planner

A professional headcount planning tool that helps startup founders model team growth and calculate burn rate & runway. Built with Svelte 5 + TypeScript + Tailwind CSS.

## What It Does

Plan your startup's hiring and track financial runway over 24 months. Drag roles onto a timeline, see monthly burn rates update in real-time, and make informed hiring decisions.

## Features

### 💼 Professional Mode
- **Multiple Scenarios**: Create and compare different hiring plans side-by-side
- **Drag & Drop Hiring**: Drag pre-configured roles (Engineer, Designer, PM, etc.) onto any month
- **Resizable Hire Bars**: Extend or shrink hire durations by dragging edges (desktop) or using arrow buttons (mobile/tablet)
- **Real-Time Calculations**: See burn rate, runway, and cash remaining update instantly
- **Financial Dashboard**: Track starting cash, monthly burn, and runway status with color-coded health indicators
- **Share Links**: Generate shareable URLs to send scenarios to teammates or investors
- **Dark Mode**: Toggle between light and dark themes
- **Touch-Friendly**: Optimized for both desktop and mobile devices

### 🎮 Viral Mode
Click the **✨ sparkle button** in the top-right corner to enter Viral Mode - a Clash Royale-inspired card game interface!

**Viral Mode Features:**
- **Clash Royale Card Design**: All roles displayed as animated trading cards with rarity levels (Common, Rare, Epic, Legendary)
- **Deck Builder**: Build an 8-card deck by dragging roles into slots
- **WeWork-O-Meter™**: Animated meter showing your burn rate with Adam Neumann's floating head
- **Death Clock**: Dramatic countdown showing time until your startup runs out of money
- **Dynamic Formatting**: Burn rates automatically switch from k to M when crossing $1M threshold

## Getting Started

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

### Usage

1. **Set Starting Cash**: Click the starting cash amount in the financial summary to edit
2. **Drag Roles**: Drag any role from the palette and drop on a month to hire
3. **Adjust Duration**: 
   - **Desktop**: Drag the left/right edges of hire bars to adjust start/end dates
   - **Mobile/Tablet**: Use the arrow buttons on hire bars (outer arrows extend, inner arrows shrink)
4. **View Metrics**: Watch burn rate and runway update automatically
5. **Add Scenarios**: Click "+ Add New Scenario" to create comparison scenarios
6. **Share**: Click the share button to generate a URL for your scenario

## Switching to Viral Mode

Click the **✨ sparkle button** in the header (next to the dark mode toggle) to transform the interface into Viral Mode. Click it again to return to Professional Mode.

## Technology

- **Svelte 5** - Modern reactive framework with runes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tooling

## License

MIT