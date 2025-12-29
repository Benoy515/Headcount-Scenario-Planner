<script lang="ts">
    import Scenario from "./lib/components/Scenario.svelte";
    import {
        scenariosStore,
        scenarioCalculations,
    } from "./lib/stores/scenarioStore.js";
    import { ROLES } from "./lib/stores/plannerStore.js";
    import { Sun, Moon, Plus, Sparkles } from "lucide-svelte";
    import RolePalette from "./lib/components/RolePalette.svelte";
    import { viralModeStore } from "./lib/stores/viralModeStore.js";
    import ShareButton from "./lib/components/ShareButton.svelte";
    import DeckArena from "./lib/components/viral/DeckArena.svelte";
    import LoadScenariosModal from "./lib/components/LoadScenariosModal.svelte";
    import {
        parseShareableURL,
        reconstructScenarios,
        generateShareableURL,
    } from "./lib/utils/shareLink.js";
    import type { SerializedState } from "./lib/utils/shareLink.js";
    import { onMount } from "svelte";
    import warpLogo from "./assets/warp-logo.png";

    // Expose to window for debugging (development only)
    if (typeof window !== "undefined") {
        (window as any).scenariosStore = scenariosStore;
        (window as any).ROLES = ROLES;

        // Helper function for testing share links
        (window as any).generateTestShareLink = () => {
            const result = generateShareableURL($scenariosStore.scenarios);
            if (result.error) {
                console.error("❌ Error:", result.error);
            } else {
                console.log("✅ Share URL:", result.url);
                console.log("📊 URL Length:", result.url.length);
            }
            return result.url;
        };

        console.log(
            "🔧 Debug: scenariosStore, ROLES, and generateTestShareLink() exposed to window.",
        );
    }

    let isDarkMode = $state(false);
    let draggedRole: any = $state(null);
    let showLoadModal = $state(false);
    let sharedState: SerializedState | null = $state(null);
    let loadError = $state("");

    const scenarios = $derived($scenariosStore.scenarios);
    const calculations = $derived($scenarioCalculations);
    const viralMode = $derived($viralModeStore);

    onMount(() => {
        // Check for saved theme preference or default to dark mode
        const savedTheme = localStorage.getItem("theme");
        console.log("🌙 Saved theme:", savedTheme);
        if (savedTheme === "light") {
            isDarkMode = false;
            document.documentElement.classList.remove("dark");
        } else {
            isDarkMode = true;
            document.documentElement.classList.add("dark");
        }

        // Check for shared scenarios in URL
        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = urlParams.get("share");

        if (shareParam) {
            const parsedState = parseShareableURL();
            if (parsedState) {
                console.log("🔗 Found shared scenarios in URL:", parsedState);
                sharedState = parsedState;

                // Check if app is in default state (only default scenario with no hires)
                const currentScenarios = $scenariosStore.scenarios;
                const isDefaultState =
                    currentScenarios.length === 1 &&
                    currentScenarios[0].hires.length === 0 &&
                    currentScenarios[0].name === "Scenario 1";

                if (isDefaultState) {
                    // Auto-load without confirmation
                    console.log("🔗 Auto-loading scenarios (default state)");
                    handleReplaceScenarios();
                } else {
                    // Show confirmation modal if user has made changes
                    showLoadModal = true;
                }
            } else {
                console.error("❌ Failed to parse shared URL");
                loadError =
                    "Invalid share link. The link may be corrupted or incomplete.";
                cleanURL();

                // Clear error after 5 seconds
                setTimeout(() => {
                    loadError = "";
                }, 5000);
            }
        }
    });

    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        console.log("🌙 Toggle dark mode:", isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    function handleAddScenario() {
        scenariosStore.addScenario();
    }

    function toggleViralMode() {
        viralModeStore.toggle();
    }

    function handleReplaceScenarios() {
        if (!sharedState) return;

        const reconstructed = reconstructScenarios(sharedState);
        scenariosStore.replaceScenarios(reconstructed);
        showLoadModal = false;
        cleanURL();
    }

    function handleAddScenarios() {
        if (!sharedState) return;

        const reconstructed = reconstructScenarios(sharedState);
        scenariosStore.loadScenarios(reconstructed);
        showLoadModal = false;
        cleanURL();
    }

    function handleCancelLoad() {
        showLoadModal = false;
        sharedState = null;
        cleanURL();
    }

    function cleanURL() {
        // Remove the share parameter from URL without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete("share");
        window.history.replaceState({}, "", url.toString());
    }
</script>

<svelte:head>
    <title>Headcount Scenario Planner</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header
        class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <div class="flex items-center gap-3">
                        <h1
                            class="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            Headcount Scenario Planner
                        </h1>
                        <a
                            href="https://www.joinwarp.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <span>Powered by</span>
                            <img
                                src={warpLogo}
                                alt="Warp"
                                class="h-6 inline-block"
                            />
                        </a>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Model team growth and calculate burn rate & runway
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <ShareButton {scenarios} />
                    <button
                        onclick={toggleDarkMode}
                        class="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle dark mode"
                    >
                        {#if isDarkMode}
                            <Sun class="w-5 h-5" />
                        {:else}
                            <Moon class="w-5 h-5" />
                        {/if}
                    </button>
                    <button
                        onclick={toggleViralMode}
                        class="disco-button p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 {viralMode.enabled
                            ? 'viral-active'
                            : ''}"
                        aria-label={viralMode.enabled
                            ? "Exit viral mode"
                            : "Enter viral mode"}
                        title={viralMode.enabled
                            ? "Back to Professional Mode"
                            : "🎉 Viral Mode"}
                    >
                        <Sparkles class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    {#if viralMode.enabled}
        <!-- Viral Mode: Clash Royale Deck Builder -->
        <DeckArena />
    {:else}
        <!-- Professional Mode: Standard Planner -->
        <main class="px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex gap-6 max-w-full mx-auto h-[calc(100vh-180px)]">
                <!-- Left Sidebar: Role Palette (Fixed) -->
                <div class="w-64 shrink-0">
                    <RolePalette bind:draggedRole />
                </div>

                <!-- Right Content: Scrollable Scenarios -->
                <div class="flex-1 min-w-0 overflow-y-auto pr-2">
                    <!-- Scenarios List -->
                    {#each scenarios as scenario, index (scenario.id)}
                        {@const calc = calculations.find(
                            (c) => c.id === scenario.id,
                        )}
                        {#if calc}
                            <Scenario
                                {scenario}
                                calculations={calc}
                                bind:draggedRole
                            />
                        {/if}
                    {/each}

                    <!-- Add Scenario Button -->
                    <button
                        onclick={handleAddScenario}
                        class="w-full py-4 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-center justify-center gap-3 group"
                        aria-label="Add new scenario"
                    >
                        <Plus
                            size={24}
                            strokeWidth={2}
                            class="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        />
                        <span
                            class="text-lg font-semibold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                            Add New Scenario
                        </span>
                    </button>
                </div>
            </div>
        </main>
    {/if}

    <!-- Load Scenarios Modal -->
    {#if showLoadModal && sharedState}
        <LoadScenariosModal
            {sharedState}
            onReplace={handleReplaceScenarios}
            onAdd={handleAddScenarios}
            onCancel={handleCancelLoad}
        />
    {/if}

    <!-- Error Toast -->
    {#if loadError}
        <div
            class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 max-w-md"
        >
            <span class="text-sm">{loadError}</span>
            <button
                onclick={() => (loadError = "")}
                class="hover:bg-red-600 rounded p-1"
                aria-label="Close error"
            >
                ✕
            </button>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
    }

    @keyframes disco-gradient {
        0% {
            background: linear-gradient(45deg, #ff00ff, #00ffff);
        }
        14% {
            background: linear-gradient(45deg, #00ffff, #ffff00);
        }
        28% {
            background: linear-gradient(45deg, #ffff00, #ff00ff);
        }
        42% {
            background: linear-gradient(45deg, #ff00ff, #00ff00);
        }
        57% {
            background: linear-gradient(45deg, #00ff00, #ff0080);
        }
        71% {
            background: linear-gradient(45deg, #ff0080, #0080ff);
        }
        85% {
            background: linear-gradient(45deg, #0080ff, #ff00ff);
        }
        100% {
            background: linear-gradient(45deg, #ff00ff, #00ffff);
        }
    }

    .disco-button:hover {
        animation: disco-gradient 1s infinite;
        border-color: transparent;
    }

    .disco-button:hover :global(svg) {
        color: white;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }

    .disco-button.viral-active {
        animation: disco-gradient 1s infinite;
        border-color: transparent;
    }

    .disco-button.viral-active :global(svg) {
        color: white;
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
    }
</style>
