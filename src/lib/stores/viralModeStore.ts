import { writable } from "svelte/store";

export interface ViralModeState {
  enabled: boolean;
  soundEnabled: boolean;
  achievements: string[];
}

function createViralModeStore() {
  // Load from localStorage if available
  const savedState =
    typeof window !== "undefined"
      ? localStorage.getItem("viralMode")
      : null;

  const initialState: ViralModeState = savedState
    ? JSON.parse(savedState)
    : {
        enabled: false,
        soundEnabled: true,
        achievements: [],
      };

  const { subscribe, set, update } = writable<ViralModeState>(initialState);

  return {
    subscribe,

    toggle: () =>
      update((state) => {
        const newState = { ...state, enabled: !state.enabled };
        if (typeof window !== "undefined") {
          localStorage.setItem("viralMode", JSON.stringify(newState));
        }
        return newState;
      }),

    toggleSound: () =>
      update((state) => {
        const newState = { ...state, soundEnabled: !state.soundEnabled };
        if (typeof window !== "undefined") {
          localStorage.setItem("viralMode", JSON.stringify(newState));
        }
        return newState;
      }),

    addAchievement: (achievement: string) =>
      update((state) => {
        if (state.achievements.includes(achievement)) {
          return state;
        }
        const newState = {
          ...state,
          achievements: [...state.achievements, achievement],
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("viralMode", JSON.stringify(newState));
        }
        return newState;
      }),

    reset: () => {
      const newState: ViralModeState = {
        enabled: false,
        soundEnabled: true,
        achievements: [],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("viralMode", JSON.stringify(newState));
      }
      set(newState);
    },
  };
}

export const viralModeStore = createViralModeStore();
