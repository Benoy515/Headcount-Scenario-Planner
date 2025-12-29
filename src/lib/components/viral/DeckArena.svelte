<script lang="ts">
    import ViralCard from "./ViralCard.svelte";
    import WeWorkMeter from "./WeWorkMeter.svelte";
    import { VIRAL_ROLES } from "../../stores/viralRoles.js";
    import type { ViralRole } from "../../stores/viralRoles.js";
    import clashBg from "../../../assets/clash-royale-background.png";

    // Sort roles by rarity: common -> rare -> epic -> legendary
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    const sortedRoles = [...VIRAL_ROLES].sort((a, b) => {
        const rarityA = rarityOrder[a.rarity || "common"];
        const rarityB = rarityOrder[b.rarity || "common"];
        return rarityA - rarityB;
    });

    let deck: (ViralRole | null)[] = $state([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ]);
    let draggedRole: ViralRole | null = $state(null);
    let draggedFromDeck = $state(false);
    let draggedFromSlot = $state(-1);

    const totalBurn = $derived(
        deck.reduce((sum, role) => sum + (role ? role.salary : 0), 0),
    );

    let startingCash = $state(2000000);
    const monthlyBurn = $derived(totalBurn / 12);
    const runwayMonths = $derived(
        monthlyBurn > 0 ? Math.floor(startingCash / monthlyBurn) : 24,
    );

    function handleDragStart(
        e: DragEvent,
        role: ViralRole,
        fromDeck: boolean,
        slotIndex: number = -1,
    ) {
        draggedRole = role;
        draggedFromDeck = fromDeck;
        draggedFromSlot = slotIndex;

        // Set custom drag image to prevent multiple cards showing
        if (e.dataTransfer && e.currentTarget instanceof HTMLElement) {
            const cardElement = e.currentTarget.querySelector(".clash-card");
            if (cardElement) {
                // Use the actual card element as drag image, positioned at cursor
                e.dataTransfer.setDragImage(
                    cardElement as HTMLElement,
                    80,
                    112,
                );
            }
        }
    }

    function handleDragEnd() {
        draggedRole = null;
        draggedFromDeck = false;
        draggedFromSlot = -1;
    }

    function handleDropInDeck(slotIndex: number) {
        if (!draggedRole) return;

        if (draggedFromDeck && draggedFromSlot !== -1) {
            // Moving within deck
            const temp = deck[slotIndex];
            deck[slotIndex] = deck[draggedFromSlot];
            deck[draggedFromSlot] = temp;
        } else {
            // Adding from collection
            deck[slotIndex] = draggedRole;
        }

        handleDragEnd();
    }

    function handleRemoveFromDeck(slotIndex: number) {
        deck[slotIndex] = null;
    }

    function handleDropInCollection() {
        if (draggedFromDeck && draggedFromSlot !== -1) {
            deck[draggedFromSlot] = null;
        }
        handleDragEnd();
    }

    function handleAddToDeck(role: ViralRole) {
        // Find first empty slot
        const emptySlot = deck.findIndex((slot) => slot === null);
        if (emptySlot !== -1) {
            deck[emptySlot] = role;
        }
    }
</script>

<div
    class="arena-container min-h-screen p-4 overflow-hidden"
    style="background-image: url({clashBg}); background-size: cover; background-position: center; background-attachment: fixed;"
>
    <!-- Dark overlay for better contrast -->
    <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
    <!-- Header -->
    <div class="text-center mb-6">
        <h1
            class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 mb-2"
            style="text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);"
        >
            🏰 STARTUP ARENA 🏰
        </h1>
        <p class="text-purple-300 text-sm">
            Build your dream team and burn that cash!
        </p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Side: Deck Builder -->
        <div class="lg:col-span-2">
            <!-- Deck Stats -->
            <div
                class="mb-4 p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl border-2 border-purple-500/30 backdrop-blur-sm"
            >
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div class="text-2xl font-bold text-yellow-400">
                            {deck.filter((r) => r !== null).length}/8
                        </div>
                        <div class="text-xs text-purple-300 uppercase">
                            Cards
                        </div>
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-orange-400">
                            ${(totalBurn / 1000).toFixed(0)}k
                        </div>
                        <div class="text-xs text-purple-300 uppercase">
                            Annual Burn
                        </div>
                    </div>
                    <div>
                        <input
                            type="number"
                            bind:value={startingCash}
                            class="w-full text-2xl font-bold text-green-400 bg-transparent text-center border-b-2 border-green-500/30 hover:border-green-500 focus:border-green-500 focus:outline-none transition-colors"
                            min="0"
                            step="100000"
                        />
                        <div class="text-xs text-purple-300 uppercase">
                            Starting Funds
                        </div>
                    </div>
                </div>
            </div>

            <!-- Deck Slots -->
            <div
                class="p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl border-4 border-purple-500/50 shadow-2xl backdrop-blur-sm mb-6"
            >
                <h2
                    class="text-xl font-bold text-center text-purple-200 mb-4 uppercase tracking-wider"
                >
                    Your Deck
                </h2>
                <div class="grid grid-cols-4 gap-6">
                    {#each deck as role, index}
                        <div
                            class="deck-slot relative w-full aspect-[3/4] rounded-xl border-2 transition-all duration-200 {role
                                ? 'border-purple-400/50 bg-gradient-to-br from-purple-800/30 to-indigo-800/30'
                                : 'border-dashed border-purple-600/30 bg-purple-950/30 hover:border-purple-400/50 hover:bg-purple-900/30'}"
                            ondragover={(e) => e.preventDefault()}
                            ondrop={() => handleDropInDeck(index)}
                        >
                            {#if role}
                                <div
                                    draggable="true"
                                    ondragstart={(e) =>
                                        handleDragStart(e, role, true, index)}
                                    ondragend={handleDragEnd}
                                    class="absolute inset-0 flex items-center justify-center"
                                >
                                    <ViralCard
                                        {role}
                                        inDeck={true}
                                        size="large"
                                    />
                                </div>
                                <button
                                    onclick={() => handleRemoveFromDeck(index)}
                                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-20 shadow-lg"
                                    aria-label="Remove card"
                                >
                                    ✕
                                </button>
                            {:else}
                                <div
                                    class="absolute inset-0 flex items-center justify-center"
                                >
                                    <div class="text-purple-600/50 text-4xl">
                                        +
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
                <p class="text-center text-purple-400/60 text-xs mt-4">
                    Drag cards here to build your team
                </p>
            </div>

            <!-- Card Collection -->
            <div
                class="p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border-4 border-indigo-500/50 shadow-2xl backdrop-blur-sm"
                ondragover={(e) => e.preventDefault()}
                ondrop={handleDropInCollection}
            >
                <h2
                    class="text-xl font-bold text-center text-indigo-200 mb-4 uppercase tracking-wider"
                >
                    Available Hires
                </h2>
                <div
                    class="grid grid-cols-4 gap-6 max-h-[500px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-custom"
                >
                    {#each sortedRoles as role}
                        <div class="flex flex-col items-center gap-2">
                            <div
                                draggable="true"
                                ondragstart={(e) =>
                                    handleDragStart(e, role, false)}
                                ondragend={handleDragEnd}
                                class="flex items-center justify-center"
                            >
                                <ViralCard {role} size="medium" />
                            </div>
                            <button
                                onclick={() => handleAddToDeck(role)}
                                class="w-full px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!deck.some((slot) => slot === null)}
                                aria-label="Add {role.label} to deck"
                            >
                                + Add
                            </button>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Right Side: WeWork-O-Meter -->
        <div class="lg:col-span-1">
            <div class="sticky top-4">
                <WeWorkMeter
                    totalSpent={totalBurn}
                    {startingCash}
                    currentBurn={monthlyBurn}
                />

                <!-- Runway Display -->
                <div
                    class="mt-4 p-4 bg-gradient-to-br from-gray-900 to-black border-4 border-red-500 rounded-xl text-center"
                >
                    <div class="text-5xl mb-2">💀</div>
                    <div class="text-white text-lg font-bold mb-1">
                        Death in:
                    </div>
                    <div class="text-red-400 text-3xl font-bold mb-2">
                        {runwayMonths >= 24 ? "24+" : runwayMonths} months
                    </div>
                    <div class="text-gray-400 text-sm">
                        {runwayMonths < 3
                            ? "🚨 CRITICAL!"
                            : runwayMonths < 6
                              ? "⚠️ Warning"
                              : "✅ Healthy"}
                    </div>
                </div>

                <!-- Share Button -->
                <button
                    class="mt-4 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
                >
                    🎉 Share Your Deck
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .deck-slot {
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .scrollbar-custom::-webkit-scrollbar {
        width: 8px;
    }

    .scrollbar-custom::-webkit-scrollbar-track {
        background: rgba(79, 70, 229, 0.1);
        border-radius: 4px;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb {
        background: rgba(167, 139, 250, 0.5);
        border-radius: 4px;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: rgba(167, 139, 250, 0.8);
    }

    .arena-container {
        min-height: 100vh;
        position: relative;
    }

    .arena-container > * {
        position: relative;
        z-index: 1;
    }
</style>
