<script lang="ts">
    import { plannerStore, calculations } from "../stores/plannerStore.js";
    import { formatCurrency } from "../utils/calculations.js";

    let isEditing = $state(false);
    let inputValue = $state(String($plannerStore.startingCash));

    function handleCashUpdate() {
        const amount = parseFloat(String(inputValue));
        if (!isNaN(amount) && amount >= 0) {
            plannerStore.setStartingCash(amount);
        } else {
            inputValue = String($plannerStore.startingCash);
        }
        isEditing = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleCashUpdate();
        } else if (event.key === "Escape") {
            inputValue = String($plannerStore.startingCash);
            isEditing = false;
        }
    }

    function startEditing() {
        inputValue = String($plannerStore.startingCash);
        isEditing = true;
    }

    const calc = $derived($calculations);
    const runwayColor = $derived(
        calc.runwayStatus === "green"
            ? "bg-green-100 text-green-800 border-green-300"
            : calc.runwayStatus === "yellow"
              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
              : "bg-red-100 text-red-800 border-red-300",
    );
</script>

<div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Starting Cash -->
        <div class="space-y-2">
            <div
                class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                Starting Cash
            </div>
            {#if isEditing}
                <input
                    type="text"
                    bind:value={inputValue}
                    onblur={handleCashUpdate}
                    onkeydown={handleKeydown}
                    class="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    aria-label="Starting cash amount"
                />
            {:else}
                <button
                    onclick={startEditing}
                    class="w-full text-left px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                    aria-label="Edit starting cash"
                >
                    <span
                        class="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                        {formatCurrency($plannerStore.startingCash)}
                    </span>
                </button>
            {/if}
        </div>

        <!-- Monthly Burn Rate -->
        <div class="space-y-2">
            <div
                class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                Monthly Burn Rate
            </div>
            <div class="px-3 py-2">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(calc.currentBurn)}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    per month
                </p>
            </div>
        </div>

        <!-- Runway -->
        <div class="space-y-2">
            <div
                class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                Runway Remaining
            </div>
            <div class="px-3 py-2">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {calc.runwayMonths}{calc.runwayMonths >= 24 ? "+" : ""}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    months
                </p>
            </div>
        </div>

        <!-- Status Indicator -->
        <div class="space-y-2">
            <div
                class="block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                Status
            </div>
            <div class="px-3 py-2">
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border {runwayColor}"
                >
                    {#if calc.runwayStatus === "green"}
                        ✓ Healthy
                    {:else if calc.runwayStatus === "yellow"}
                        ⚠ Caution
                    {:else}
                        ⚠ Critical
                    {/if}
                </span>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {#if calc.runwayStatus === "green"}
                        &gt; 12 months
                    {:else if calc.runwayStatus === "yellow"}
                        6-12 months
                    {:else}
                        &lt; 6 months
                    {/if}
                </p>
            </div>
        </div>
    </div>
</div>
