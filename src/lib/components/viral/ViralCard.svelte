<script lang="ts">
    import type { ViralRole } from "../../stores/viralRoles.js";

    let {
        role,
        inDeck = false,
        size = "medium",
    }: {
        role: ViralRole;
        inDeck?: boolean;
        size?: "small" | "medium" | "large";
    } = $props();

    const formattedSalary = $derived(() => {
        if (role.salary >= 1000000) {
            return `$${(role.salary / 1000000).toFixed(1)}M`;
        } else {
            return `$${(role.salary / 1000).toFixed(0)}k`;
        }
    });

    const sizeClasses = {
        small: "w-32 h-44",
        medium: "w-40 h-56",
        large: "w-48 h-64",
    };

    const isLegendary = role.rarity === "legendary";
    const cardShape = isLegendary ? "hexagon-card" : "rounded-xl";

    const emojiSizes = {
        small: "text-5xl",
        medium: "text-6xl",
        large: "text-7xl",
    };

    const characterAreas = {
        small: "top-4 h-16",
        medium: "top-6 h-20",
        large: "top-8 h-24",
    };

    const nameBannerPositions = {
        small: "top-20",
        medium: "top-26",
        large: "top-32",
    };

    const descriptionPositions = {
        small: "top-28",
        medium: "top-36",
        large: "top-44",
    };

    const rarityColors = {
        legendary: {
            border: "from-yellow-400 via-orange-400 to-yellow-400",
            glow: "shadow-yellow-500/50",
            bg: "from-yellow-900/30 to-orange-900/30",
            shine: "from-yellow-400/20 to-transparent",
            cardBorder: "border-yellow-400",
        },
        epic: {
            border: "from-purple-400 via-purple-500 to-purple-400",
            glow: "shadow-purple-500/50",
            bg: "from-purple-900/30 to-purple-800/30",
            shine: "from-purple-400/20 to-transparent",
            cardBorder: "border-purple-400",
        },
        rare: {
            border: "from-orange-400 via-orange-500 to-orange-400",
            glow: "shadow-orange-500/50",
            bg: "from-orange-900/30 to-orange-800/30",
            shine: "from-orange-400/20 to-transparent",
            cardBorder: "border-orange-400",
        },
        common: {
            border: "from-gray-400 via-gray-300 to-gray-400",
            glow: "shadow-gray-500/30",
            bg: "from-gray-800/30 to-gray-700/30",
            shine: "from-gray-400/20 to-transparent",
            cardBorder: "border-gray-400",
        },
    };

    const colors = rarityColors[role.rarity || "common"] || rarityColors.common;
</script>

<div
    class="clash-card relative {sizeClasses[
        size
    ]} cursor-pointer select-none transform transition-all duration-200 hover:scale-105 hover:-translate-y-2 {inDeck
        ? 'scale-95'
        : ''} {isLegendary ? 'hexagon-wrapper' : ''}"
    style="perspective: 1000px; {isLegendary ? 'padding: 6px;' : ''}"
>
    <!-- Rarity Border (Hexagonal or Rounded) -->
    <div
        class="card-border-wrapper absolute inset-0 {cardShape} bg-gradient-to-br {colors.border} opacity-90"
    ></div>

    <!-- Card Container -->
    <div
        class="relative w-full h-full bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-950 {cardShape} overflow-hidden shadow-2xl {colors.glow} {isLegendary
            ? ''
            : 'border-4 ' + colors.cardBorder}"
    >
        <!-- Shine Effect -->
        <div
            class="absolute inset-0 bg-gradient-to-br {colors.shine} shine-effect pointer-events-none"
        ></div>

        <!-- Character Area -->
        <div
            class="absolute {characterAreas[
                size
            ]} left-0 right-0 flex items-center justify-center"
        >
            <div
                class="{emojiSizes[
                    size
                ]} character-float filter drop-shadow-2xl"
                style="text-shadow: 0 0 20px rgba(0,0,0,0.8);"
            >
                {role.emoji}
            </div>
        </div>

        <!-- Card Name Banner -->
        <div
            class="absolute {nameBannerPositions[
                size
            ]} left-0 right-0 px-2 py-1 bg-gradient-to-r {colors.bg} backdrop-blur-sm"
        >
            <div
                class="text-center text-white font-bold text-xs leading-tight"
                style="text-shadow: 0 2px 4px rgba(0,0,0,0.8);"
            >
                {role.label}
            </div>
        </div>

        <!-- Description -->
        <div class="absolute {descriptionPositions[size]} left-0 right-0 px-2">
            <div
                class="text-center text-white/80 text-[9px] leading-tight italic"
                style="text-shadow: 0 1px 2px rgba(0,0,0,0.8);"
            >
                {role.description}
            </div>
        </div>

        <!-- Cost Footer -->
        <div
            class="absolute bottom-2 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center border-t border-white/10"
        >
            <div class="text-center">
                <div class="text-yellow-400 font-bold text-sm leading-none">
                    {formattedSalary()}
                </div>
                <div class="text-white/60 text-[8px] uppercase tracking-wider">
                    per year
                </div>
            </div>
        </div>

        <!-- Inner Glow Border -->
        <div
            class="absolute inset-0 {cardShape} border-2 bg-gradient-to-br {colors.border} opacity-50 pointer-events-none"
            style="mask: linear-gradient(transparent 50%, black 100%); -webkit-mask: linear-gradient(transparent 50%, black 100%);"
        ></div>
    </div>
</div>

<style>
    .clash-card {
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
    }

    .hexagon-wrapper {
        overflow: visible;
    }

    .card-border-wrapper {
        z-index: 0;
    }

    .hexagon-card {
        clip-path: polygon(
            50% 0%,
            100% 15%,
            100% 85%,
            50% 100%,
            0% 85%,
            0% 15%
        );
        border-radius: 0;
        z-index: 1;
    }

    .character-float {
        animation: character-float 3s ease-in-out infinite;
    }

    @keyframes character-float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }

    .shine-effect {
        animation: shine-sweep 3s ease-in-out infinite;
    }

    @keyframes shine-sweep {
        0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
        }
        50%,
        100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .character-float,
        .shine-effect {
            animation: none;
        }
    }
</style>
