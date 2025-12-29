<script lang="ts">
    let { totalSpent, startingCash, currentBurn } = $props();

    // Calculate how full the meter is (can exceed 100%)
    const fillPercentage = $derived((totalSpent / startingCash) * 100);

    const meterLevel = $derived(
        fillPercentage < 30
            ? "low"
            : fillPercentage < 60
              ? "medium"
              : fillPercentage < 90
                ? "high"
                : "critical",
    );

    const formattedBurn = $derived(() => {
        if (currentBurn >= 1000000) {
            return `$${(currentBurn / 1000000).toFixed(1)}M`;
        } else {
            return `$${(currentBurn / 1000).toFixed(0)}k`;
        }
    });
</script>

<div class="wework-meter-container">
    <!-- Header -->
    <div class="text-center mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
            The WeWork-O-Meter™
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
            Measuring your burn with Adam Neumann's blessing
        </p>
    </div>

    <!-- Meter Container -->
    <div class="meter-wrapper relative">
        <!-- Background Container -->
        <div
            class="meter-bg relative bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl border-4 border-gray-400 dark:border-gray-600 overflow-hidden"
            style="height: 300px; width: 200px; margin: 0 auto;"
        >
            <!-- Money Fill -->
            <div
                class="money-fill absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out {meterLevel ===
                'critical'
                    ? 'bg-gradient-to-t from-red-500 via-red-400 to-orange-400'
                    : meterLevel === 'high'
                      ? 'bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-300'
                      : meterLevel === 'medium'
                        ? 'bg-gradient-to-t from-yellow-500 via-yellow-400 to-green-400'
                        : 'bg-gradient-to-t from-green-500 via-green-400 to-blue-400'}"
                style="height: {fillPercentage}%"
            >
                <!-- Floating Dollar Signs -->
                <div class="dollar-signs">
                    {#each Array(Math.floor(fillPercentage / 10) + 1) as _, i}
                        <span
                            class="dollar text-2xl absolute"
                            style="left: {((i * 37) % 80) + 10}%; bottom: {(i *
                                43) %
                                80}%; animation-delay: {i * 0.3}s"
                        >
                            💰
                        </span>
                    {/each}
                </div>

                <!-- Waves Effect -->
                <div class="waves">
                    <div class="wave wave1"></div>
                    <div class="wave wave2"></div>
                </div>
            </div>

            <!-- Adam Neumann Head (floats on top) -->
            <div
                class="adam-head absolute left-1/2 transition-all duration-1000 ease-out"
                style="transform: translateX(-50%); bottom: {fillPercentage}%; z-index: 10;"
            >
                <div
                    class="head-container text-6xl {meterLevel === 'critical'
                        ? 'shake-head'
                        : ''}"
                >
                    🧔
                </div>
                {#if meterLevel === "critical"}
                    <div
                        class="money-overflow absolute -top-8 left-1/2 -translate-x-1/2"
                    >
                        <span class="text-2xl animate-bounce">💸</span>
                    </div>
                {/if}
            </div>

            <!-- Meter Markings -->
            <div class="absolute inset-0 pointer-events-none">
                {#each [25, 50, 75, 100] as mark}
                    <div
                        class="absolute left-0 right-0 border-t-2 border-gray-500/30"
                        style="bottom: {mark}%"
                    >
                        <span
                            class="absolute -right-12 -top-2 text-xs text-gray-600 dark:text-gray-400 font-mono"
                        >
                            {mark}%
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Stats Below -->
    <div class="mt-6 grid grid-cols-2 gap-4 text-center">
        <div
            class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600"
        >
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {fillPercentage.toFixed(1)}%
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Money Burned
            </div>
        </div>
        <div
            class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600"
        >
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {formattedBurn()}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Per Month
            </div>
        </div>
    </div>

    <!-- Status Message -->
    <div class="mt-4 text-center">
        {#if meterLevel === "critical"}
            <p class="text-red-600 dark:text-red-400 font-bold text-sm">
                🚨 WeWork Level Burning!
            </p>
        {:else if meterLevel === "high"}
            <p
                class="text-orange-600 dark:text-orange-400 font-semibold text-sm"
            >
                ⚠️ Approaching SoftBank Territory
            </p>
        {:else if meterLevel === "medium"}
            <p
                class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm"
            >
                💰 Healthy Burn Rate
            </p>
        {:else}
            <p class="text-green-600 dark:text-green-400 font-semibold text-sm">
                ✅ Conservative Spending
            </p>
        {/if}
    </div>
</div>

<style>
    .wework-meter-container {
        max-width: 350px;
        margin: 0 auto;
    }

    .meter-wrapper {
        position: relative;
    }

    .dollar {
        animation: float-dollar 3s ease-in-out infinite;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    @keyframes float-dollar {
        0%,
        100% {
            transform: translateY(0px) rotate(0deg);
        }
        25% {
            transform: translateY(-10px) rotate(5deg);
        }
        50% {
            transform: translateY(-5px) rotate(-5deg);
        }
        75% {
            transform: translateY(-15px) rotate(3deg);
        }
    }

    .waves {
        position: absolute;
        top: -10px;
        left: 0;
        right: 0;
        height: 20px;
        overflow: hidden;
    }

    .wave {
        position: absolute;
        width: 200%;
        height: 100%;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: wave-motion 3s ease-in-out infinite;
    }

    .wave1 {
        animation-delay: 0s;
        left: -50%;
    }

    .wave2 {
        animation-delay: 1.5s;
        left: -50%;
    }

    @keyframes wave-motion {
        0% {
            transform: translateX(0) translateY(0);
        }
        50% {
            transform: translateX(25%) translateY(-5px);
        }
        100% {
            transform: translateX(50%) translateY(0);
        }
    }

    .head-container {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
        transition: all 0.3s ease;
    }

    .shake-head {
        animation: shake-head 0.5s infinite;
    }

    @keyframes shake-head {
        0%,
        100% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(-5deg);
        }
        75% {
            transform: rotate(5deg);
        }
    }

    .money-overflow {
        animation: money-fly 1s ease-out infinite;
    }

    @keyframes money-fly {
        0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
        }
    }
</style>
