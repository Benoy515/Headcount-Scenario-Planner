<script lang="ts">
    import { ROLES } from "../stores/plannerStore.js";
    import RoleCard from "./RoleCard.svelte";

    const { ondragstart }: { ondragstart: (e: DragEvent, role: any) => void } =
        $props();
</script>

<div class="bg-white shadow-lg rounded-lg p-6">
    <div class="mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Available Roles</h2>
        <p class="text-sm text-gray-600 mt-1">
            Drag any role onto the calendar to schedule a hire
        </p>
    </div>

    <!-- Role Grid -->
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
    >
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

        <!-- Placeholder for Custom Roles (Future) -->
        <div
            class="flex items-center justify-center gap-2 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all cursor-not-allowed"
            title="Custom roles coming soon"
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
        </div>
    </div>

    <!-- Helper Text -->
    <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="text-xs text-gray-500">
            <strong>Tip:</strong> Click and hold a role card, then drag it to any
            month in the calendar above to add a hire. You can add multiple people
            to the same month.
        </div>
    </div>
</div>
