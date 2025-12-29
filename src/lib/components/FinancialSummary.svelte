<script lang="ts">
    import { formatCurrency } from "../utils/calculations.js";

    let { startingCash, calculations, onUpdateStartingCash } = $props();

    let isEditing = $state(false);
    let inputValue = $state("");

    function handleCashUpdate() {
        const amount = parseFloat(String(inputValue));
        if (!isNaN(amount) && amount >= 0) {
            onUpdateStartingCash(amount);
        }
        isEditing = false;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleCashUpdate();
        } else if (event.key === "Escape") {
            isEditing = false;
        }
    }

    function startEditing() {
        inputValue = String(startingCash);
        isEditing = true;
    }

    const runwayColor = $derived(
        calculations.runwayStatus === "green"
            ? "bg-green-100 text-green-800 border-green-300"
            : calculations.runwayStatus === "yellow"
              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
              : "bg-red-100 text-red-800 border-red-300",
    );
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Starting Cash -->
    <div class="space-y-2">
        <div class="block text-sm font-medium text-gray-600 dark:text-gray-300">
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
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(startingCash)}
                </span>
            </button>
        {/if}
    </div>

    <!-- Monthly Burn Rate -->
    <div class="space-y-2">
        <div class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            Peak Monthly Burn
        </div>
        <div class="px-3 py-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculations.currentBurn)}
            </span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                maximum across all months
            </p>
        </div>
    </div>

    <!-- Average Monthly Burn -->
    <div class="space-y-2">
        <div class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            Average Monthly Burn
        </div>
        <div class="px-3 py-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculations.averageBurn || 0)}
            </span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                across active months
            </p>
        </div>
    </div>

    <!-- Total Spent -->
    <div class="space-y-2">
        <div class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Spent
        </div>
        <div class="px-3 py-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(calculations.totalSpent || 0)}
            </span>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                cumulative
            </p>
        </div>
    </div>
</div>
