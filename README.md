# Headcount Scenario Planner

A professional headcount planning tool that helps startup founders model team growth and calculate burn rate/runway. Built with Svelte 5 + Tailwind CSS.

![Headcount Planner](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat&logo=svelte)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript)

## Features

### 📊 Financial Summary Dashboard
- **Starting Cash Input**: Edit your starting cash position (default: $2,000,000)
- **Monthly Burn Rate**: Real-time calculation of current monthly expenses
- **Runway Display**: See how many months of runway remain
- **Status Indicator**: Color-coded health status (Green > 12mo, Yellow 6-12mo, Red < 6mo)

### 📅 Interactive Timeline Grid
- **24-Month View**: Plan your team growth over 2 years
- **Drag & Drop**: Intuitive role placement by dragging to specific months
- **Visual Hire Bars**: Each hire appears as a colored bar showing duration
- **Burn Rate Chart**: Monthly burn visualization below the timeline

### 👥 Role Palette
Pre-configured roles with industry-standard salaries:
- 👩‍💻 **Engineer** - $150k/year
- 👨‍💼 **Sales** - $120k/year  
- 🎨 **Designer** - $130k/year
- 📋 **Product Manager** - $140k/year
- 📊 **Data Analyst** - $135k/year
- 📣 **Marketing** - $110k/year

## Getting Started

### Prerequisites
- Node.js 16+ 
- Yarn or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd WarpTakeHome

# Install dependencies
yarn install
# or
npm install
```

### Development

```bash
# Start the development server
yarn dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
# Build for production
yarn build
# or
npm run build

# Preview production build
yarn preview
# or
npm run preview
```

## How to Use

1. **Set Your Starting Cash**: Click on the starting cash amount to edit it
2. **Drag Roles to Timeline**: Drag any role card from the bottom palette
3. **Drop on Month**: Drop it on the month you want to hire that person
4. **View Calculations**: Watch the burn rate and runway update in real-time
5. **Remove Hires**: Hover over a hire bar and click the × button to remove it
6. **Reset**: Click "Reset All" to start over

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── FinancialSummary.svelte   # Top financial dashboard
│   │   ├── TimelineGrid.svelte       # Main timeline with drag/drop
│   │   ├── HireBar.svelte            # Individual hire visualization
│   │   ├── RolePalette.svelte        # Bottom role selector
│   │   └── RoleCard.svelte           # Individual role card
│   ├── stores/
│   │   └── plannerStore.js           # Svelte store for state management
│   └── utils/
│       └── calculations.js           # Burn rate & runway calculations
├── App.svelte                         # Main app component
├── app.css                            # Global styles + Tailwind
└── main.ts                            # App entry point
```

## Technology Stack

- **Framework**: [Svelte 5](https://svelte.dev) - Reactive UI framework with runes
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Build Tool**: [Vite](https://vitejs.dev) - Fast modern build tool
- **Language**: TypeScript - Type-safe JavaScript
- **Drag & Drop**: Native HTML5 Drag and Drop API

## Key Calculations

### Monthly Burn Rate
For each month, the burn rate is calculated as:
```javascript
monthlyBurn = sum(all active salaries / 12)
```

### Runway
Calculated by iterating through months until cash runs out:
```javascript
let runway = 0;
let cash = startingCash;
for each month:
  cash -= monthlyBurn
  if cash <= 0: break
  runway++
```

### Runway Status
- 🟢 **Green/Healthy**: > 12 months runway
- 🟡 **Yellow/Caution**: 6-12 months runway  
- 🔴 **Red/Critical**: < 6 months runway

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- **Bundle Size**: ~17KB CSS + ~45KB JS (gzipped)
- **No Backend Required**: Fully client-side application
- **Instant Updates**: Reactive state management with Svelte 5

## Future Enhancements

Potential features for future iterations:
- [ ] Edit existing hires (change role, start date, or salary)
- [ ] Custom role creation with custom salaries
- [ ] Location-based salary adjustments
- [ ] Export scenarios to PDF/CSV
- [ ] Save/load multiple scenarios
- [ ] Annual salary increases modeling
- [ ] Team size by role charts
- [ ] Comparison between scenarios

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built as a take-home project demonstrating:
- Modern Svelte 5 patterns (runes, stores, derived state)
- Clean component architecture
- Professional UI/UX design
- Real-time calculations
- Drag & drop interactions