<script>
    import { formatCurrency } from "../utils/calculations.js";
    import { Trash2 } from "lucide-svelte";

    const { hire, totalMonths, onremove } = $props();

    const monthlySalary = $derived(hire.salary / 12);
    const barWidth = $derived(
        ((totalMonths - hire.startMonth) / totalMonths) * 100,
    );
    const barOffset = $derived((hire.startMonth / totalMonths) * 100);
</script>

<div class="relative h-16 mb-2" style="padding-left: {barOffset}%">
    <div
        class="absolute inset-y-0 left-0 right-0 {hire.color} rounded-lg shadow-md flex items-center justify-between px-4 group hover:shadow-lg transition-shadow"
        style="width: {barWidth}%"
    >
        <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-2xl">{hire.icon}</span>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-white truncate">
                    {hire.roleLabel}
                </div>
                <div class="text-xs text-white/90">
                    {formatCurrency(hire.salary)}/yr · {formatCurrency(
                        monthlySalary,
                    )}/mo
                </div>
            </div>
        </div>

        <button
            onclick={onremove}
            class="ml-2 shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-red-500/90 active:bg-red-600 text-white hover:text-white flex items-center justify-center transition-all touch-manipulation backdrop-blur-sm"
            aria-label="Remove hire"
        >
            <Trash2 size={16} strokeWidth={2} />
        </button>
    </div>
</div>
