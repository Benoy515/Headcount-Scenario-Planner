import { writable, derived } from "svelte/store";
import { MONTHS, ROLES } from "./plannerStore.js";

// Create a store that manages multiple scenarios
function createScenariosStore() {
  const { subscribe, set, update } = writable({
    scenarios: [
      {
        id: crypto.randomUUID(),
        name: "Scenario 1",
        startingCash: 2000000,
        hires: [],
        collapsed: false,
      },
    ],
  });

  return {
    subscribe,

    // Add a new scenario
    addScenario: () =>
      update((state) => {
        const newScenarioNumber = state.scenarios.length + 1;
        return {
          ...state,
          scenarios: [
            ...state.scenarios,
            {
              id: crypto.randomUUID(),
              name: `Scenario ${newScenarioNumber}`,
              startingCash: 2000000,
              hires: [],
              collapsed: false,
            },
          ],
        };
      }),

    // Remove a scenario
    removeScenario: (scenarioId) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.filter((s) => s.id !== scenarioId),
      })),

    // Toggle collapse state
    toggleCollapse: (scenarioId) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId ? { ...s, collapsed: !s.collapsed } : s,
        ),
      })),

    // Update scenario name
    updateName: (scenarioId, newName) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId ? { ...s, name: newName } : s,
        ),
      })),

    // Update starting cash
    setStartingCash: (scenarioId, amount) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId ? { ...s, startingCash: amount } : s,
        ),
      })),

    // Add hire to specific scenario
    addHire: (scenarioId, role, startMonth, duration = 1) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId
            ? {
                ...s,
                hires: [
                  ...s.hires,
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
              }
            : s,
        ),
      })),

    // Update hire duration
    updateHireDuration: (scenarioId, hireId, newDuration, newStartMonth) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId
            ? {
                ...s,
                hires: s.hires.map((h) =>
                  h.id === hireId
                    ? {
                        ...h,
                        duration: newDuration,
                        startMonth:
                          newStartMonth !== undefined
                            ? newStartMonth
                            : h.startMonth,
                      }
                    : h,
                ),
              }
            : s,
        ),
      })),

    // Remove hire from specific scenario
    removeHire: (scenarioId, hireId) =>
      update((state) => ({
        ...state,
        scenarios: state.scenarios.map((s) =>
          s.id === scenarioId
            ? {
                ...s,
                hires: s.hires.filter((h) => h.id !== hireId),
              }
            : s,
        ),
      })),
  };
}

export const scenariosStore = createScenariosStore();

// Helper function to calculate metrics for a single scenario
function calculateScenarioMetrics(scenario) {
  const { startingCash, hires } = scenario;

  // Calculate monthly burn for each month
  const monthlyBurns = MONTHS.map((_, monthIndex) => {
    const burn = hires
      .filter(
        (hire) =>
          hire.startMonth <= monthIndex &&
          monthIndex < hire.startMonth + hire.duration,
      )
      .reduce((sum, hire) => sum + hire.salary / 12, 0);
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

  // Calculate total spent
  const monthsToCalculate =
    runoutMonth !== -1 ? runoutMonth + 1 : Math.min(runwayMonths, 24);
  const totalSpent = monthlyBurns
    .slice(0, monthsToCalculate)
    .reduce((sum, burn) => sum + burn, 0);

  // Calculate average monthly burn
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
}

// Derived store for all scenario calculations
export const scenarioCalculations = derived(scenariosStore, ($scenarios) => {
  return $scenarios.scenarios.map((scenario) => ({
    id: scenario.id,
    ...calculateScenarioMetrics(scenario),
  }));
});
