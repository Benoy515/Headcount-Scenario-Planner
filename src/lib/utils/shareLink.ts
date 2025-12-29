import LZString from "lz-string";
import { ROLES } from "../stores/plannerStore.js";

const SHARE_VERSION = 1;
const MAX_URL_LENGTH = 8000;

export interface SerializedHire {
  id: string;
  role: string;
  roleLabel: string;
  salary: number;
  startMonth: number;
  duration: number;
}

export interface SerializedScenario {
  id: string;
  name: string;
  startingCash: number;
  collapsed: boolean;
  hires: SerializedHire[];
}

export interface SerializedState {
  version: number;
  scenarios: SerializedScenario[];
}

/**
 * Serialize scenarios to a compressed, URL-safe string
 */
export function serializeScenarios(scenarios: any[]): string {
  const state: SerializedState = {
    version: SHARE_VERSION,
    scenarios: scenarios.map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      startingCash: scenario.startingCash,
      collapsed: scenario.collapsed,
      hires: scenario.hires.map((hire: any) => ({
        id: hire.id,
        role: hire.role,
        roleLabel: hire.roleLabel,
        salary: hire.salary,
        startMonth: hire.startMonth,
        duration: hire.duration,
      })),
    })),
  };

  // Convert to JSON
  const json = JSON.stringify(state);

  // Compress using lz-string
  const compressed = LZString.compressToEncodedURIComponent(json);

  return compressed;
}

/**
 * Deserialize a compressed string back to scenarios
 */
export function deserializeScenarios(compressed: string): SerializedState | null {
  try {
    // Decompress
    const json = LZString.decompressFromEncodedURIComponent(compressed);

    if (!json) {
      console.error("Failed to decompress data");
      return null;
    }

    // Parse JSON
    const state = JSON.parse(json) as SerializedState;

    // Validate structure
    if (!validateState(state)) {
      console.error("Invalid state structure");
      return null;
    }

    return state;
  } catch (error) {
    console.error("Error deserializing scenarios:", error);
    return null;
  }
}

/**
 * Validate the deserialized state structure
 */
function validateState(state: any): state is SerializedState {
  // Check version
  if (typeof state.version !== "number") {
    console.error("Invalid version");
    return false;
  }

  // Check if version is compatible
  if (state.version > SHARE_VERSION) {
    console.error("Version too new:", state.version);
    return false;
  }

  // Check scenarios array
  if (!Array.isArray(state.scenarios)) {
    console.error("Scenarios is not an array");
    return false;
  }

  // Limit maximum scenarios
  if (state.scenarios.length > 20) {
    console.error("Too many scenarios:", state.scenarios.length);
    return false;
  }

  // Validate each scenario
  for (const scenario of state.scenarios) {
    if (!validateScenario(scenario)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate a single scenario
 */
function validateScenario(scenario: any): boolean {
  // Required fields
  if (
    typeof scenario.id !== "string" ||
    typeof scenario.name !== "string" ||
    typeof scenario.startingCash !== "number" ||
    typeof scenario.collapsed !== "boolean" ||
    !Array.isArray(scenario.hires)
  ) {
    console.error("Invalid scenario structure");
    return false;
  }

  // Validate ranges
  if (scenario.startingCash < 0 || scenario.startingCash > 1000000000) {
    console.error("Invalid starting cash:", scenario.startingCash);
    return false;
  }

  // Limit scenario name length
  if (scenario.name.length > 200) {
    console.error("Scenario name too long");
    return false;
  }

  // Limit hires
  if (scenario.hires.length > 100) {
    console.error("Too many hires in scenario");
    return false;
  }

  // Validate each hire
  for (const hire of scenario.hires) {
    if (!validateHire(hire)) {
      return false;
    }
  }

  return true;
}

/**
 * Validate a single hire
 */
function validateHire(hire: any): boolean {
  if (
    typeof hire.id !== "string" ||
    typeof hire.role !== "string" ||
    typeof hire.roleLabel !== "string" ||
    typeof hire.salary !== "number" ||
    typeof hire.startMonth !== "number" ||
    typeof hire.duration !== "number"
  ) {
    console.error("Invalid hire structure");
    return false;
  }

  // Validate ranges
  if (hire.salary < 0 || hire.salary > 10000000) {
    console.error("Invalid salary:", hire.salary);
    return false;
  }

  if (hire.startMonth < 0 || hire.startMonth >= 24) {
    console.error("Invalid startMonth:", hire.startMonth);
    return false;
  }

  if (hire.duration < 1 || hire.duration > 24) {
    console.error("Invalid duration:", hire.duration);
    return false;
  }

  return true;
}

/**
 * Generate a shareable URL with the current scenarios
 */
export function generateShareableURL(
  scenarios: any[],
  baseURL: string = window.location.origin + window.location.pathname
): { url: string; error?: string } {
  try {
    const compressed = serializeScenarios(scenarios);
    const url = `${baseURL}?share=${compressed}`;

    // Check URL length
    if (url.length > MAX_URL_LENGTH) {
      return {
        url: "",
        error: `URL too long (${url.length} characters). Try removing some scenarios or hires to reduce the link size.`,
      };
    }

    return { url };
  } catch (error) {
    console.error("Error generating shareable URL:", error);
    return {
      url: "",
      error: "Failed to generate shareable link. Please try again.",
    };
  }
}

/**
 * Parse the current URL and extract shared scenarios if present
 */
export function parseShareableURL(
  url: string = window.location.href
): SerializedState | null {
  try {
    const urlObj = new URL(url);
    const shareParam = urlObj.searchParams.get("share");

    if (!shareParam) {
      return null;
    }

    return deserializeScenarios(shareParam);
  } catch (error) {
    console.error("Error parsing shareable URL:", error);
    return null;
  }
}

/**
 * Reconstruct full scenario objects with icon and color from serialized data
 */
export function reconstructScenarios(state: SerializedState): any[] {
  return state.scenarios.map((scenario) => ({
    ...scenario,
    hires: scenario.hires.map((hire) => {
      // Find the role definition to get icon and color
      const roleDefinition = ROLES.find((r) => r.type === hire.role);

      if (!roleDefinition) {
        console.warn(`Unknown role type: ${hire.role}`);
        // Use a default if role not found
        return {
          ...hire,
          icon: ROLES[0].icon,
          color: ROLES[0].color,
        };
      }

      return {
        ...hire,
        icon: roleDefinition.icon,
        color: roleDefinition.color,
      };
    }),
  }));
}

/**
 * Get statistics about the serialized data size
 */
export function getSerializationStats(scenarios: any[]): {
  uncompressedSize: number;
  compressedSize: number;
  compressionRatio: number;
  estimatedURLLength: number;
} {
  const state: SerializedState = {
    version: SHARE_VERSION,
    scenarios: scenarios.map((s) => ({
      id: s.id,
      name: s.name,
      startingCash: s.startingCash,
      collapsed: s.collapsed,
      hires: s.hires,
    })),
  };

  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);

  const baseURLLength = 50; // Approximate base URL length
  const estimatedURLLength = baseURLLength + compressed.length + 7; // "?share="

  return {
    uncompressedSize: json.length,
    compressedSize: compressed.length,
    compressionRatio: json.length / compressed.length,
    estimatedURLLength,
  };
}
