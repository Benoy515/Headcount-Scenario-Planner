import { writable, derived } from 'svelte/store';

// Role definitions
export const ROLES = [
  { type: 'engineer', label: 'Engineer', salary: 150000, icon: '👩‍💻', color: 'bg-blue-500' },
  { type: 'sales', label: 'Sales', salary: 120000, icon: '👨‍💼', color: 'bg-green-500' },
  { type: 'designer', label: 'Designer', salary: 130000, icon: '🎨', color: 'bg-purple-500' },
  { type: 'product', label: 'Product Manager', salary: 140000, icon: '📋', color: 'bg-orange-500' },
  { type: 'data', label: 'Data Analyst', salary: 135000, icon: '📊', color: 'bg-cyan-500' },
  { type: 'marketing', label: 'Marketing', salary: 110000, icon: '📣', color: 'bg-pink-500' }
];

// Generate month labels (24 months starting from current month)
function generateMonths() {
  const months = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 24; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    months.push({
      label: monthNames[monthIndex],
      year: year,
      fullLabel: `${monthNames[monthIndex]} ${year}`
    });
  }

  return months;
}

export const MONTHS = generateMonths();

// Create the main store
function createPlannerStore() {
  const { subscribe, set, update } = writable({
    startingCash: 2000000,
    hires: []
  });

  return {
    subscribe,
    setStartingCash: (amount) => update(state => ({ ...state, startingCash: amount })),
    addHire: (role, startMonth) => update(state => ({
      ...state,
      hires: [...state.hires, {
        id: crypto.randomUUID(),
        role: role.type,
        roleLabel: role.label,
        salary: role.salary,
        startMonth: startMonth,
        icon: role.icon,
        color: role.color
      }]
    })),
    removeHire: (id) => update(state => ({
      ...state,
      hires: state.hires.filter(h => h.id !== id)
    })),
    reset: () => set({
      startingCash: 2000000,
      hires: []
    })
  };
}

export const plannerStore = createPlannerStore();

// Derived store for calculations
export const calculations = derived(plannerStore, $planner => {
  const { startingCash, hires } = $planner;

  // Calculate monthly burn for each month
  const monthlyBurns = MONTHS.map((_, monthIndex) => {
    return hires
      .filter(hire => hire.startMonth <= monthIndex)
      .reduce((sum, hire) => sum + (hire.salary / 12), 0);
  });

  // Calculate runway
  let remainingCash = startingCash;
  let runwayMonths = 0;
  let runoutMonth = -1;

  for (let month = 0; month < 24; month++) {
    const burn = monthlyBurns[month];
    if (burn > 0) {
      remainingCash -= burn;
      if (remainingCash <= 0) {
        runoutMonth = month;
        break;
      }
      runwayMonths++;
    } else {
      runwayMonths++;
    }
  }

  // If we haven't run out in 24 months, runway is 24+
  if (runoutMonth === -1 && monthlyBurns[23] > 0) {
    runwayMonths = 24;
  }

  // Current monthly burn (month 0)
  const currentBurn = monthlyBurns[0] || 0;

  // Runway status
  let runwayStatus = 'green';
  if (runwayMonths < 6) {
    runwayStatus = 'red';
  } else if (runwayMonths < 12) {
    runwayStatus = 'yellow';
  }

  return {
    monthlyBurns,
    currentBurn,
    runwayMonths,
    runwayStatus
  };
});
