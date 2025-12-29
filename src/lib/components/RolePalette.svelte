<script lang="ts">
    import { ROLES } from "../stores/plannerStore.js";
    import RoleCard from "./RoleCard.svelte";

    let { draggedRole = $bindable(null) } = $props();
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
                    e.dataTransfer!.setData("text/plain", role.type);
                    draggedRole = role;
                }}
                ondragend={() => {
                    draggedRole = null;
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

    <!-- Helper Text -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-xs text-gray-500 dark:text-gray-400">
            <strong>Tip:</strong> Click and hold a role, then drag it to any month
            to add a hire.
        </div>
    </div>
</div>
