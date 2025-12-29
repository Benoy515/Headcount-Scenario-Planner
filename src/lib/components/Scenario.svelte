<script lang="ts">
    import FinancialSummary from "./FinancialSummary.svelte";
    import TimelineGrid from "./TimelineGrid.svelte";
    import { scenariosStore } from "../stores/scenarioStore.js";
    import { Trash2, ChevronDown, ChevronUp } from "lucide-svelte";

    let { scenario, calculations, draggedRole = $bindable(null) } = $props();

    function handleToggleCollapse() {
        scenariosStore.toggleCollapse(scenario.id);
    }

    function handleDelete() {
        scenariosStore.removeScenario(scenario.id);
    }

    function handleSetStartingCash(amount: number) {
        scenariosStore.setStartingCash(scenario.id, amount);
    }

    function handleAddHire(role: any, startMonth: number, duration: number) {
        scenariosStore.addHire(scenario.id, role, startMonth, duration);
    }

    function handleUpdateHireDuration(
        hireId: string,
        newDuration: number,
        newStartMonth?: number,
    ) {
        scenariosStore.updateHireDuration(
            scenario.id,
            hireId,
            newDuration,
            newStartMonth,
        );
    }

    function handleRemoveHire(hireId: string) {
        scenariosStore.removeHire(scenario.id, hireId);
    }
</script>

<div
    class="border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden mb-6"
>
    <!-- Scenario Header -->
    <div
        class="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-4 border-b border-gray-200 dark:border-gray-700"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {scenario.name}
                </h2>
                {#if !scenario.collapsed}
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        {scenario.hires.length}
                        {scenario.hires.length === 1 ? "hire" : "hires"}
                    </div>
                {/if}
            </div>

            <div class="flex items-center gap-2">
                <!-- Collapsed Summary Stats -->
                {#if scenario.collapsed}
                    <div class="flex items-center gap-4 mr-4">
                        <div class="text-right">
                            <div
                                class="text-xs text-gray-500 dark:text-gray-400"
                            >
                                Total Spent
                            </div>
                            <div
                                class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                                ${(calculations.totalSpent / 1000000).toFixed(
                                    2,
                                )}M
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Delete Button -->
                <button
                    onclick={handleDelete}
                    class="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all shadow-sm"
                    aria-label="Delete scenario"
                    title="Delete scenario"
                >
                    <Trash2 size={18} strokeWidth={2} />
                </button>

                <!-- Collapse/Expand Button -->
                <button
                    onclick={handleToggleCollapse}
                    class="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center transition-all shadow-sm"
                    aria-label={scenario.collapsed ? "Expand" : "Collapse"}
                    title={scenario.collapsed ? "Expand" : "Collapse"}
                >
                    {#if scenario.collapsed}
                        <ChevronDown size={20} strokeWidth={2} />
                    {:else}
                        <ChevronUp size={20} strokeWidth={2} />
                    {/if}
                </button>
            </div>
        </div>
    </div>

    <!-- Scenario Content (collapsible) -->
    {#if !scenario.collapsed}
        <div class="p-6 space-y-6">
            <!-- Financial Summary -->
            <FinancialSummary
                startingCash={scenario.startingCash}
                {calculations}
                onUpdateStartingCash={handleSetStartingCash}
            />

            <!-- Timeline Grid -->
            <TimelineGrid
                {scenario}
                {calculations}
                scenarioId={scenario.id}
                bind:draggedRole
                onAddHire={handleAddHire}
                onUpdateHireDuration={handleUpdateHireDuration}
                onRemoveHire={handleRemoveHire}
            />
        </div>
    {/if}
</div>
