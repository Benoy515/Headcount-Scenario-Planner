<script lang="ts">
    import FinancialSummary from "./lib/components/FinancialSummary.svelte";
    import TimelineGrid from "./lib/components/TimelineGrid.svelte";
    import RolePalette from "./lib/components/RolePalette.svelte";
    import { plannerStore, ROLES } from "./lib/stores/plannerStore.js";
    import { Sun, Moon } from "lucide-svelte";
    import { onMount } from "svelte";

    // Expose to window for debugging (development only)
    if (typeof window !== "undefined") {
        (window as any).plannerStore = plannerStore;
        (window as any).ROLES = ROLES;
        console.log(
            "🔧 Debug: plannerStore and ROLES exposed to window. Try: plannerStore.addHire(ROLES[0], 0)",
        );
    }

    let draggedRole: any = $state(null);
    let timelineRef: HTMLDivElement | null = $state(null);
    let isDarkMode = $state(false);

    onMount(() => {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem("theme");
        console.log("🌙 Saved theme:", savedTheme);
        if (savedTheme === "dark") {
            isDarkMode = true;
            document.documentElement.classList.add("dark");
        } else {
            isDarkMode = false;
            document.documentElement.classList.remove("dark");
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

    function handleDragStart(e: DragEvent, role: any) {
        console.log("🎯 DRAG START:", role.label);
        draggedRole = role;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("text/plain", role.type);
        }
        console.log("✅ draggedRole set to:", draggedRole);
    }

    function handleDragEnd() {
        console.log("🏁 DRAG END - clearing draggedRole");
        draggedRole = null;
    }

    function handleReset() {
        if (
            confirm("Are you sure you want to reset all hires and start over?")
        ) {
            plannerStore.reset();
        }
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
                    <h1
                        class="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                        Headcount Scenario Planner
                    </h1>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Model team growth and calculate burn rate & runway
                    </p>
                </div>
                <div class="flex items-center gap-3">
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
                        onclick={handleReset}
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Reset All
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex gap-6 max-w-full mx-auto">
            <!-- Left Sidebar: Role Palette -->
            <div class="w-64 shrink-0">
                <RolePalette ondragstart={handleDragStart} />
            </div>

            <!-- Right Content: Combined Financial Summary + Timeline Grid -->
            <div
                class="flex-1 min-w-0"
                ondragover={(e) => e.preventDefault()}
                ondragend={handleDragEnd}
                bind:this={timelineRef}
                role="region"
                aria-label="Calendar drag and drop area"
            >
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                    <!-- Financial Summary (inside same box) -->
                    <FinancialSummary />

                    <!-- Horizontal Divider -->
                    <div
                        class="border-t border-gray-200 dark:border-gray-700 my-6"
                    ></div>

                    <!-- Timeline Grid (inside same box) -->
                    <TimelineGrid bind:draggedRole />
                </div>
            </div>
        </div>
    </main>

    
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
    }
</style>
