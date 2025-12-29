<script lang="ts">
    const { role }: { role: any } = $props();
</script>

<div
    class="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all pointer-events-none select-none w-full"
>
    <role.icon class="w-5 h-5 text-gray-700 dark:text-gray-300 shrink-0" />
    <div class="flex-1 min-w-0">
        <div class="font-medium text-sm text-gray-900 dark:text-white truncate">
            {role.label}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400">
            ${(role.salary / 1000).toFixed(0)}k/yr
        </div>
    </div>
    <div class="w-2.5 h-2.5 rounded-full {role.color} shrink-0"></div>
</div>
