<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let { runwayMonths, totalSpent, currentBurn } = $props();

    let days = $state(0);
    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);
    let intervalId: number | null = null;

    const secondsPerMonth = 30 * 24 * 60 * 60; // Approximate

    function updateCountdown() {
        const totalSeconds = runwayMonths * secondsPerMonth;
        const now = Date.now();
        const startTime = now;
        const endTime = startTime + totalSeconds * 1000;

        // Calculate remaining time
        const remaining = Math.max(0, endTime - now);

        days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        hours = Math.floor(
            (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    }

    onMount(() => {
        // Convert runway months to approximate time units
        const totalDays = runwayMonths * 30;
        days = Math.floor(totalDays);
        hours = Math.floor((totalDays % 1) * 24);
        minutes = Math.floor(((totalDays % 1) * 24 * 60) % 60);
        seconds = 0;

        // Update every second for effect
        intervalId = window.setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            } else if (days > 0) {
                days--;
                hours = 23;
                minutes = 59;
                seconds = 59;
            }
        }, 1000);
    });

    onDestroy(() => {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }
    });

    const urgencyLevel = $derived(
        runwayMonths < 3 ? "critical" : runwayMonths < 6 ? "warning" : "safe",
    );
</script>

<div
    class="death-clock-container bg-gradient-to-br from-gray-900 to-black border-4 rounded-xl p-6 shadow-2xl {urgencyLevel ===
    'critical'
        ? 'border-red-500 shake'
        : urgencyLevel === 'warning'
          ? 'border-yellow-500'
          : 'border-green-500'}"
>
    <!-- Skull Header -->
    <div class="text-center mb-4">
        <div class="text-5xl mb-2 skull-icon">💀</div>
        <h3
            class="text-2xl font-bold text-white tracking-wider uppercase animate-pulse"
        >
            Startup Death Clock
        </h3>
        <p class="text-gray-400 text-sm mt-1">Your startup dies in:</p>
    </div>

    <!-- Countdown Display -->
    <div
        class="grid grid-cols-4 gap-3 mb-6 bg-black/50 rounded-lg p-4 backdrop-blur-sm"
    >
        <div class="text-center">
            <div
                class="text-4xl font-bold text-white mb-1 tabular-nums countdown-number"
            >
                {days}
            </div>
            <div class="text-xs text-gray-400 uppercase tracking-wide">
                Days
            </div>
        </div>
        <div class="text-center">
            <div
                class="text-4xl font-bold text-white mb-1 tabular-nums countdown-number"
            >
                {hours.toString().padStart(2, "0")}
            </div>
            <div class="text-xs text-gray-400 uppercase tracking-wide">
                Hours
            </div>
        </div>
        <div class="text-center">
            <div
                class="text-4xl font-bold text-white mb-1 tabular-nums countdown-number"
            >
                {minutes.toString().padStart(2, "0")}
            </div>
            <div class="text-xs text-gray-400 uppercase tracking-wide">
                Minutes
            </div>
        </div>
        <div class="text-center">
            <div
                class="text-4xl font-bold text-white mb-1 tabular-nums countdown-number"
            >
                {seconds.toString().padStart(2, "0")}
            </div>
            <div class="text-xs text-gray-400 uppercase tracking-wide">
                Seconds
            </div>
        </div>
    </div>

    <!-- Stats -->
    <div class="space-y-2 text-sm">
        <div class="flex justify-between text-gray-300">
            <span>💸 Burning:</span>
            <span class="font-bold text-red-400"
                >${(currentBurn / 1000).toFixed(0)}k/month</span
            >
        </div>
        <div class="flex justify-between text-gray-300">
            <span>🔥 Total Burned:</span>
            <span class="font-bold text-orange-400"
                >${(totalSpent / 1000000).toFixed(2)}M</span
            >
        </div>
        <div class="flex justify-between text-gray-300">
            <span>⏰ Runway:</span>
            <span
                class="font-bold {urgencyLevel === 'critical'
                    ? 'text-red-500'
                    : urgencyLevel === 'warning'
                      ? 'text-yellow-500'
                      : 'text-green-500'}"
            >
                {runwayMonths >= 24 ? "24+" : runwayMonths} months
            </span>
        </div>
    </div>

    <!-- Warning Messages -->
    {#if urgencyLevel === "critical"}
        <div
            class="mt-4 bg-red-500/20 border border-red-500 rounded-lg p-3 text-center"
        >
            <p class="text-red-400 text-sm font-semibold">
                🚨 CRITICAL: Better raise soon!
            </p>
        </div>
    {:else if urgencyLevel === "warning"}
        <div
            class="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-center"
        >
            <p class="text-yellow-400 text-sm font-semibold">
                ⚠️ WARNING: Start talking to VCs
            </p>
        </div>
    {:else}
        <div
            class="mt-4 bg-green-500/20 border border-green-500 rounded-lg p-3 text-center"
        >
            <p class="text-green-400 text-sm font-semibold">
                ✅ HEALTHY: You're doing fine
            </p>
        </div>
    {/if}
</div>

<style>
    .death-clock-container {
        position: relative;
        overflow: hidden;
    }

    .death-clock-container::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            circle,
            rgba(255, 0, 0, 0.1) 0%,
            transparent 70%
        );
        animation: pulse-glow 3s ease-in-out infinite;
    }

    @keyframes pulse-glow {
        0%,
        100% {
            opacity: 0.3;
            transform: scale(1);
        }
        50% {
            opacity: 0.6;
            transform: scale(1.1);
        }
    }

    .skull-icon {
        animation: skull-float 2s ease-in-out infinite;
        display: inline-block;
    }

    @keyframes skull-float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .countdown-number {
        text-shadow:
            0 0 10px rgba(255, 255, 255, 0.5),
            0 0 20px rgba(255, 255, 255, 0.3);
    }

    .shake {
        animation: shake 0.5s infinite;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translateX(-5px);
        }
        20%,
        40%,
        60%,
        80% {
            transform: translateX(5px);
        }
    }
</style>
