<script lang="ts">
    import { Share2, Copy, Check, X } from "lucide-svelte";
    import { generateShareableURL } from "../utils/shareLink.js";

    let { scenarios } = $props();

    let showModal = $state(false);
    let shareURL = $state("");
    let copySuccess = $state(false);
    let error = $state("");

    function handleShare() {
        error = "";
        const result = generateShareableURL(scenarios);

        if (result.error) {
            error = result.error;
            return;
        }

        shareURL = result.url;
        showModal = true;
        copySuccess = false;
    }

    async function handleCopyToClipboard() {
        try {
            await navigator.clipboard.writeText(shareURL);
            copySuccess = true;

            // Reset success state after 2 seconds
            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            error = "Failed to copy to clipboard";
        }
    }

    function closeModal() {
        showModal = false;
        error = "";
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            closeModal();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Share Button -->
<button
    onclick={handleShare}
    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
    aria-label="Share scenarios"
>
    <Share2 size={16} strokeWidth={2} />
    <span>Share</span>
</button>

<!-- Error Toast -->
{#if error && !showModal}
    <div
        class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
    >
        <span class="text-sm">{error}</span>
        <button
            onclick={() => (error = "")}
            class="hover:bg-red-600 rounded p-1"
        >
            <X size={16} />
        </button>
    </div>
{/if}

<!-- Modal -->
{#if showModal}
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onclick={closeModal}
        onkeydown={(e) => e.key === "Enter" && closeModal()}
        role="button"
        tabindex="-1"
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="share-modal-title"
            aria-modal="true"
            tabindex="0"
        >
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
                <h2
                    id="share-modal-title"
                    class="text-2xl font-bold text-gray-900 dark:text-white"
                >
                    Share Your Scenarios
                </h2>
                <button
                    onclick={closeModal}
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close modal"
                >
                    <X size={20} class="text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            <!-- Divider -->
            <div
                class="border-t border-gray-200 dark:border-gray-700 mb-4"
            ></div>

            <!-- Content -->
            <div class="space-y-4">
                <!-- URL Display -->
                <div class="space-y-2">
                    <label
                        for="share-url-input"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Shareable Link
                    </label>
                    <div class="flex gap-2">
                        <input
                            id="share-url-input"
                            type="text"
                            readonly
                            value={shareURL}
                            class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 font-mono"
                            onclick={(e) => e.currentTarget.select()}
                        />
                        <button
                            onclick={handleCopyToClipboard}
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Copy link to clipboard"
                        >
                            {#if copySuccess}
                                <Check size={16} strokeWidth={2} />
                                <span class="text-sm font-medium">Copied!</span>
                            {:else}
                                <Copy size={16} strokeWidth={2} />
                                <span class="text-sm font-medium"
                                    >Copy Link</span
                                >
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Success Message -->
                {#if copySuccess}
                    <div
                        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
                    >
                        <p
                            class="text-sm text-green-800 dark:text-green-300 flex items-center gap-2"
                        >
                            <Check size={16} strokeWidth={2} />
                            Link copied to clipboard!
                        </p>
                    </div>
                {/if}

                <!-- Info Box -->
                <div
                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <p
                        class="text-sm text-blue-800 dark:text-blue-300 leading-relaxed"
                    >
                        Share this link with anyone to show your headcount
                        planning scenarios. The link contains all your scenarios
                        and hires encoded directly in the URL.
                    </p>
                </div>

                <!-- Scenario Summary -->
                <div class="space-y-2">
                    <p
                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Including {scenarios.length}
                        {scenarios.length === 1 ? "scenario" : "scenarios"}:
                    </p>
                    <ul
                        class="space-y-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3"
                    >
                        {#each scenarios as scenario}
                            <li
                                class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                            >
                                <span
                                    class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                ></span>
                                <span class="font-medium">{scenario.name}</span>
                                <span class="text-gray-500 dark:text-gray-400"
                                    >({scenario.hires.length}
                                    {scenario.hires.length === 1
                                        ? "hire"
                                        : "hires"})</span
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 flex justify-end">
                <button
                    onclick={closeModal}
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Done
                </button>
            </div>
        </div>
    </div>
{/if}
