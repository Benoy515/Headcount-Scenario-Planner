<script lang="ts">
    import {
        plannerStore,
        calculations,
        MONTHS,
    } from "../stores/plannerStore.js";
    import { formatCurrency } from "../utils/calculations.js";
    import HireBar from "./HireBar.svelte";

    let { draggedRole = $bindable(null) } = $props();
    let hoveredMonth: number | null = $state(null);

    function handleDragOver(e: DragEvent, monthIndex: number) {
        e.preventDefault();
        hoveredMonth = monthIndex;
    }

    function handleDragLeave() {
        hoveredMonth = null;
    }

    function handleDrop(e: DragEvent, monthIndex: number) {
        e.preventDefault();
        if (draggedRole) {
            plannerStore.addHire(draggedRole, monthIndex);
            draggedRole = null;
            hoveredMonth = null;
        }
    }

    function handleRemoveHire(id: string) {
        plannerStore.removeHire(id);
    }

    const calc = $derived($calculations);
    const hires: any[] = $derived($plannerStore.hires);
</script>

<div class="bg-white shadow-lg rounded-lg p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">
            Timeline (24 Months)
        </h2>
        <div class="text-sm text-gray-600">
            {hires.length}
            {hires.length === 1 ? "hire" : "hires"} planned
        </div>
    </div>

    <!-- Timeline container with horizontal scroll -->
    <div class="overflow-x-auto">
        <div class="min-w-300">
            <!-- Month headers -->
            <div class="flex gap-0.5 mb-4 sticky top-0 bg-white z-10 pb-2">
                {#each MONTHS as month, i (i)}
                    <div class="flex-1 min-w-12.5">
                        <div class="text-center">
                            <div class="text-xs font-semibold text-gray-700">
                                {month.label}
                            </div>
                            <div class="text-xs text-gray-500">
                                {month.year}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Drop zones for each month -->
            <div class="flex gap-0.5 mb-4 border-b-2 border-gray-200 pb-2">
                {#each MONTHS as month, i (i)}
                    <div
                        class="flex-1 min-w-12.5 h-12 border-2 border-dashed rounded transition-colors {hoveredMonth ===
                        i
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'}"
                        ondragover={(e) => handleDragOver(e, i)}
                        ondragleave={handleDragLeave}
                        ondrop={(e) => handleDrop(e, i)}
                        role="button"
                        tabindex="0"
                    >
                        {#if hoveredMonth === i}
                            <div
                                class="h-full flex items-center justify-center text-xs text-blue-600 font-medium"
                            >
                                Drop
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- Hire bars -->
            <div class="space-y-2 mb-6">
                {#if hires.length === 0}
                    <div class="text-center py-12 text-gray-400">
                        <p class="text-lg mb-2">No hires yet</p>
                        <p class="text-sm">
                            Drag roles from below to add them to the timeline
                        </p>
                    </div>
                {:else}
                    {#each hires as hire (hire.id)}
                        <HireBar
                            {hire}
                            totalMonths={MONTHS.length}
                            onremove={() => handleRemoveHire(hire.id)}
                        />
                    {/each}
                {/if}
            </div>

            <!-- Monthly burn rate display -->
            <div class="border-t-2 border-gray-200 pt-4">
                <div class="flex gap-0.5">
                    {#each MONTHS as month, i (i)}
                        <div class="flex-1 min-w-12.5">
                            <div class="text-center">
                                <div
                                    class="text-xs font-semibold text-gray-700"
                                >
                                    {#if calc.monthlyBurns[i] > 0}
                                        ${(calc.monthlyBurns[i] / 1000).toFixed(
                                            0,
                                        )}k
                                    {:else}
                                        <span class="text-gray-400">$0</span>
                                    {/if}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    {#if calc.monthlyBurns[i] > 0}
                                        <div
                                            class="w-full bg-gray-200 rounded-full h-1 mt-1"
                                        >
                                            <div
                                                class="bg-blue-500 h-1 rounded-full"
                                                style="width: {Math.min(
                                                    (calc.monthlyBurns[i] /
                                                        Math.max(
                                                            ...calc.monthlyBurns,
                                                        )) *
                                                        100,
                                                    100,
                                                )}%"
                                            ></div>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="text-xs text-gray-500 text-center mt-2">
                    Monthly Burn Rate
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        overscroll-behavior-x: contain;
    }
</style>
