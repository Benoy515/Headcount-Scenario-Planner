<script lang="ts">
    const { role }: { role: any } = $props();
</script>

<div
    class="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all pointer-events-none select-none"
>
    <role.icon class="w-6 h-6 text-gray-700" />
    <div class="flex-1">
        <div class="font-semibold text-gray-900">{role.label}</div>
        <div class="text-sm text-gray-600">
            ${(role.salary / 1000).toFixed(0)}k/year
        </div>
    </div>
    <div class="w-3 h-3 rounded-full {role.color}"></div>
</div>
