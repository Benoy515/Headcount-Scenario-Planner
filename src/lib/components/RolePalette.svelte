<script lang="ts">
    import { ROLES } from "../stores/plannerStore.js";
    import RoleCard from "./RoleCard.svelte";

    const { ondragstart }: { ondragstart: (e: DragEvent, role: any) => void } =
        $props();
</script>

<div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full"
>
    <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Available Roles
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Drag roles to schedule hires
        </p>
    </div>

    <!-- Role Stack (Vertical) -->
    <div class="space-y-3">
        {#each ROLES as role (role.type)}
            <div
                draggable="true"
                ondragstart={(e) => {
                    e.dataTransfer!.effectAllowed = "copy";
                    ondragstart(e, role);
                }}
                class="cursor-grab active:cursor-grabbing"
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                    }
                }}
            >
                <RoleCard {role} />
            </div>
        {/each}
    </div>

    <!-- Placeholder for Custom Roles (Future) -->
    <div class="mt-4">
        <button
            class="w-full flex items-center justify-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-500 transition-all cursor-not-allowed"
            title="Custom roles coming soon"
            disabled
        >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
            </svg>
            <span class="text-xs font-medium">Add Custom</span>
        </button>
    </div>

    <!-- Helper Text -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-xs text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> Click and hold a role, then drag it to any month
            to add a hire.
        </div>
    </div>
</div>
