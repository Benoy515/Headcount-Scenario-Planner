import { writable, derived } from "svelte/store";
import {
  Code2,
  Briefcase,
  Palette,
  ClipboardList,
  BarChart3,
  Megaphone,
} from "lucide-svelte";

// Role definitions
export const ROLES = [
  {
    type: "engineer",
    label: "Engineer",
    salary: 200000,
    icon: Code2,
    color: "bg-blue-400",
  },
  {
    type: "sales",
    label: "Sales",
    salary: 120000,
    icon: Briefcase,
    color: "bg-green-400",
  },
  {
    type: "designer",
    label: "Designer",
    salary: 130000,
    icon: Palette,
    color: "bg-purple-400",
  },
  {
    type: "product",
    label: "Product Manager",
    salary: 160000,
    icon: ClipboardList,
    color: "bg-orange-400",
  },
  {
    type: "data",
    label: "Data Analyst",
    salary: 110000,
    icon: BarChart3,
    color: "bg-cyan-400",
  },
  {
    type: "marketing",
    label: "Marketing",
    salary: 90000,
    icon: Megaphone,
    color: "bg-pink-400",
  },
];

// Generate month labels (24 months starting from current month)
function generateMonths() {
  const months = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < 24; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    months.push({
      label: monthNames[monthIndex],
      year: year,
      fullLabel: `${monthNames[monthIndex]} ${year}`,
    });
  }

  return months;
}

export const MONTHS = generateMonths();

// Create the main store
function createPlannerStore() {
  const { subscribe, set, update } = writable({
    startingCash: 2000000,
    hires: [],
  });

  return {
    subscribe,
    setStartingCash: (amount) =>
      update((state) => ({ ...state, startingCash: amount })),
    addHire: (role, startMonth, duration = 1) =>
      update((state) => ({
        ...state,
        hires: [
          ...state.hires,
          {
            id: crypto.randomUUID(),
            role: role.type,
            roleLabel: role.label,
            salary: role.salary,
            startMonth: startMonth,
            duration: duration,
            icon: role.icon,
            color: role.color,
          },
        ],
      })),
    updateHireDuration: (id, newDuration, newStartMonth) =>
      update((state) => ({
        ...state,
        hires: state.hires.map((h) =>
          h.id === id
            ? {
                ...h,
                duration: newDuration,
                startMonth:
                  newStartMonth !== undefined ? newStartMonth : h.startMonth,
              }
            : h,
        ),
      })),
    removeHire: (id) =>
      update((state) => ({
        ...state,
        hires: state.hires.filter((h) => h.id !== id),
      })),
    reset: () =>
      set({
        startingCash: 2000000,
        hires: [],
      }),
  };
}

export const plannerStore = createPlannerStore();

// Derived store for calculations
export const calculations = derived(plannerStore, ($planner) => {
  const { startingCash, hires } = $planner;

  console.log("🔥 Recalculating burns - hires:", hires.length);

  // Calculate monthly burn for each month
  const monthlyBurns = MONTHS.map((_, monthIndex) => {
    const burn = hires
      .filter(
        (hire) =>
          hire.startMonth <= monthIndex &&
          monthIndex < hire.startMonth + hire.duration,
      )
      .reduce((sum, hire) => sum + hire.salary / 12, 0);
    if (burn > 0 && monthIndex === 0) {
      console.log("🔥 Month 0 burn:", burn, "from", hires.length, "hires");
    }
    return burn;
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

  // Current monthly burn - find first non-zero month or use max burn
  const firstNonZeroBurn = monthlyBurns.find((burn) => burn > 0) || 0;
  const maxBurn = Math.max(...monthlyBurns, 0);
  const currentBurn = firstNonZeroBurn > 0 ? maxBurn : 0;

  // Calculate total spent (cumulative burn up to runway end or month 24)
  const monthsToCalculate =
    runoutMonth !== -1 ? runoutMonth + 1 : Math.min(runwayMonths, 24);
  const totalSpent = monthlyBurns
    .slice(0, monthsToCalculate)
    .reduce((sum, burn) => sum + burn, 0);

  // Calculate average monthly burn (only count months with burn > 0)
  const monthsWithBurn = monthlyBurns.filter((burn) => burn > 0);
  const averageBurn =
    monthsWithBurn.length > 0
      ? monthsWithBurn.reduce((sum, burn) => sum + burn, 0) /
        monthsWithBurn.length
      : 0;

  // Runway status
  let runwayStatus = "green";
  if (runwayMonths < 6) {
    runwayStatus = "red";
  } else if (runwayMonths < 12) {
    runwayStatus = "yellow";
  }

  return {
    monthlyBurns,
    currentBurn,
    runwayMonths,
    runwayStatus,
    totalSpent,
    averageBurn,
  };
});
