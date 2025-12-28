<script lang="ts">
    import FinancialSummary from "./lib/components/FinancialSummary.svelte";
    import TimelineGrid from "./lib/components/TimelineGrid.svelte";
    import RolePalette from "./lib/components/RolePalette.svelte";
    import { plannerStore } from "./lib/stores/plannerStore.js";

    let draggedRole: any = $state(null);
    let timelineRef: HTMLDivElement | null = $state(null);

    function handleDragStart(e: DragEvent, role: any) {
        draggedRole = role;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("text/plain", role.type);
        }
    }

    function handleDragEnd() {
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

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">
                        Headcount Scenario Planner
                    </h1>
                    <p class="text-sm text-gray-600 mt-1">
                        Model team growth and calculate burn rate & runway
                    </p>
                </div>
                <button
                    onclick={handleReset}
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Reset All
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Financial Summary -->
        <FinancialSummary />

        <!-- Timeline Grid -->
        <div
            ondragover={(e) => e.preventDefault()}
            ondragend={handleDragEnd}
            bind:this={timelineRef}
            role="region"
            aria-label="Timeline drag and drop area"
        >
            <TimelineGrid bind:draggedRole />
        </div>

        <!-- Role Palette -->
        <RolePalette ondragstart={handleDragStart} />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p class="text-center text-sm text-gray-500">
                Built with Svelte + Tailwind CSS · Drag roles onto the timeline
                to plan your team
            </p>
        </div>
    </footer>
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
