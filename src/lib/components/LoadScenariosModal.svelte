<script lang="ts">
    import { X } from "lucide-svelte";
    import type { SerializedState } from "../utils/shareLink.js";

    let {
        sharedState,
        onReplace,
        onAdd,
        onCancel
    }: {
        sharedState: SerializedState;
        onReplace: () => void;
        onAdd: () => void;
        onCancel: () => void;
    } = $props();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onCancel();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={onCancel}
    onkeydown={(e) => e.key === "Enter" && onCancel()}
    role="button"
    tabindex="-1"
>
    <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="load-modal-title"
        aria-modal="true"
        tabindex="0"
    >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h2
                id="load-modal-title"
                class="text-2xl font-bold text-gray-900 dark:text-white"
            >
                Load Scenarios from Link?
            </h2>
            <button
                onclick={onCancel}
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
            >
                <X size={20} class="text-gray-500 dark:text-gray-400" />
            </button>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

        <!-- Content -->
        <div class="space-y-4">
            <!-- Info Text -->
            <p class="text-gray-700 dark:text-gray-300">
                This link contains {sharedState.scenarios.length}
                {sharedState.scenarios.length === 1 ? "scenario" : "scenarios"}:
            </p>

            <!-- Scenario List -->
            <ul
                class="space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-64 overflow-y-auto"
            >
                {#each sharedState.scenarios as scenario}
                    <li
                        class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                        <span
                            class="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"
                        ></span>
                        <div class="flex-1">
                            <div class="font-semibold">{scenario.name}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {scenario.hires.length}
                                {scenario.hires.length === 1 ? "hire" : "hires"}
                                • Starting cash: ${(
                                    scenario.startingCash / 1000000
                                ).toFixed(2)}M
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>

            <!-- Warning Box -->
            <div
                class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
            >
                <p
                    class="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed"
                >
                    <strong>Choose an option:</strong> Replace your current scenarios
                    with these ones, or add them alongside your existing scenarios.
                </p>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="mt-6 flex flex-wrap gap-3 justify-end">
            <button
                onclick={onCancel}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                Cancel
            </button>
            <button
                onclick={onAdd}
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Add to Existing
            </button>
            <button
                onclick={onReplace}
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Replace All
            </button>
        </div>
    </div>
</div>
