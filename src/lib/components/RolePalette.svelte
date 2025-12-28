<script>
  import { ROLES } from '../stores/plannerStore.js';
  import RoleCard from './RoleCard.svelte';

  const { ondragstart } = $props();
</script>

<div class="bg-white shadow-lg rounded-lg p-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Role Palette</h2>
  <p class="text-sm text-gray-600 mb-4">Drag roles to the timeline to add hires</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
    {#each ROLES as role (role.type)}
      <div
        draggable="true"
        ondragstart={(e) => ondragstart(e, role)}
        role="button"
        tabindex="0"
        onkeydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Could add keyboard support here
          }
        }}
      >
        <RoleCard {role} />
      </div>
    {/each}
  </div>
</div>
