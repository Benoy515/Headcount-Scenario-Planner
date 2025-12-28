<script lang="ts">
    import {
        plannerStore,
        calculations,
        MONTHS,
    } from "../stores/plannerStore.js";
    import { formatCurrency } from "../utils/calculations.js";

    let { draggedRole = $bindable(null) } = $props();
    let hoveredCell: { row: number; month: number } | null = $state(null);
    let dragMode:
        | { type: "move"; hireId: string; initialMonth: number }
        | { type: "resize-left"; hireId: string }
        | { type: "resize-right"; hireId: string }
        | null = $state(null);

    function handleDragOver(
        e: DragEvent,
        hireIndex: number,
        monthIndex: number,
    ) {
        e.preventDefault();
        hoveredCell = { row: hireIndex, month: monthIndex };
    }

    function handleDragLeave() {
        hoveredCell = null;
    }

    function handleDrop(e: DragEvent, hireIndex: number, monthIndex: number) {
        e.preventDefault();
        console.log(
            "💧 DROP on row:",
            hireIndex,
            "month:",
            monthIndex,
            "draggedRole:",
            draggedRole?.label,
        );

        if (draggedRole) {
            console.log(
                "✅ Adding hire:",
                draggedRole.label,
                "at month",
                monthIndex,
                "with duration 1",
            );
            plannerStore.addHire(draggedRole, monthIndex, 1);
            draggedRole = null;
            hoveredCell = null;
            console.log("✅ Hire added successfully");
        } else {
            console.warn("⚠️ No draggedRole set!");
        }
    }

    function handleRemoveHire(id: string) {
        plannerStore.removeHire(id);
    }

    function handleResizeStart(
        e: MouseEvent,
        hireId: string,
        side: "left" | "right",
    ) {
        e.stopPropagation();
        e.preventDefault();
        dragMode =
            side === "left"
                ? { type: "resize-left", hireId }
                : { type: "resize-right", hireId };
    }

    function handleMouseMove(e: MouseEvent) {
        if (!dragMode) return;

        const gridElement = e.currentTarget as HTMLElement;
        const rect = gridElement.getBoundingClientRect();
        const x = e.clientX - rect.left + gridElement.scrollLeft;

        // Calculate which month column we're over (80px per column)
        const columnWidth = 80;
        const monthIndex = Math.floor(x / columnWidth);

        if (monthIndex < 0 || monthIndex >= 24) return;

        const hire = hires.find((h) => h.id === dragMode.hireId);
        if (!hire) return;

        if (dragMode.type === "resize-right") {
            // Expanding/shrinking from the right
            const newDuration = Math.max(1, monthIndex - hire.startMonth + 1);
            if (newDuration !== hire.duration) {
                plannerStore.updateHireDuration(
                    hire.id,
                    newDuration,
                    hire.startMonth,
                );
            }
        } else if (dragMode.type === "resize-left") {
            // Expanding/shrinking from the left
            const endMonth = hire.startMonth + hire.duration - 1;
            const newStartMonth = Math.min(monthIndex, endMonth);
            const newDuration = endMonth - newStartMonth + 1;

            if (
                newStartMonth !== hire.startMonth ||
                newDuration !== hire.duration
            ) {
                plannerStore.updateHireDuration(
                    hire.id,
                    newDuration,
                    newStartMonth,
                );
            }
        }
    }

    function handleMouseUp() {
        dragMode = null;
    }

    const calc = $derived($calculations);
    const hires: any[] = $derived($plannerStore.hires);

    // Show only one empty row for new hires
    const emptyRowsCount = 1;
    const totalRows = $derived(hires.length + emptyRowsCount);
</script>

<svelte:window onmouseup={handleMouseUp} />

<div class="bg-white shadow-lg rounded-lg p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
        <div>
            <h2 class="text-lg font-semibold text-gray-900">
                Hiring Timeline Grid
            </h2>
            <p class="text-sm text-gray-600 mt-1">
                Drag roles onto any month cell to schedule hires. Drag edges to
                adjust duration.
            </p>
        </div>
        <div class="text-sm text-gray-600">
            {hires.length}
            {hires.length === 1 ? "hire" : "hires"} planned
        </div>
    </div>

    <!-- Grid Container with Scroll -->
    <div
        class="overflow-x-auto overflow-y-auto max-h-150 border border-gray-200 rounded-lg select-none"
        onmousemove={handleMouseMove}
        role="grid"
        tabindex="0"
    >
        <div class="inline-block min-w-full">
            <!-- Header Row: Months -->
            <div
                class="flex sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-300"
            >
                {#each MONTHS as month, i (i)}
                    <div
                        class="shrink-0 w-20 p-2 border-r border-gray-200 text-center"
                    >
                        <div class="text-xs font-semibold text-gray-700">
                            {month.label}
                        </div>
                        <div class="text-xs text-gray-500">{month.year}</div>
                        {#if calc.monthlyBurns[i] > 0}
                            <div class="text-xs font-medium text-blue-600 mt-1">
                                ${(calc.monthlyBurns[i] / 1000).toFixed(0)}k
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- Data Rows: Existing Hires -->
            {#each hires as hire, hireIndex (hire.id)}
                <div class="flex border-b border-gray-200 hover:bg-gray-50">
                    <!-- Month cells for this hire -->
                    {#each MONTHS as month, monthIndex (monthIndex)}
                        {@const isActive =
                            monthIndex >= hire.startMonth &&
                            monthIndex < hire.startMonth + hire.duration}
                        {@const isStart = monthIndex === hire.startMonth}
                        {@const isEnd =
                            monthIndex === hire.startMonth + hire.duration - 1}

                        <div
                            class="shrink-0 w-20 border-r border-gray-200 p-2 min-h-20 flex items-center justify-center relative group
                            {isActive ? hire.color : 'bg-white'}
                            {hoveredCell?.row === hireIndex &&
                            hoveredCell?.month === monthIndex
                                ? 'ring-2 ring-blue-500 ring-inset'
                                : ''}"
                            ondragover={(e) =>
                                handleDragOver(e, hireIndex, monthIndex)}
                            ondragleave={handleDragLeave}
                            ondrop={(e) => handleDrop(e, hireIndex, monthIndex)}
                            role="gridcell"
                            tabindex="0"
                            aria-label="Month {monthIndex +
                                1} for {hire.roleLabel}"
                        >
                            {#if isStart}
                                <!-- Left resize handle -->
                                <div
                                    class="absolute left-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onmousedown={(e) =>
                                        handleResizeStart(e, hire.id, "left")}
                                    role="button"
                                    tabindex="0"
                                    aria-label="Resize start date"
                                ></div>

                                <!-- Show role info on start month -->
                                <div class="text-center">
                                    <div class="text-2xl mb-1">{hire.icon}</div>
                                    <div
                                        class="text-xs font-semibold text-white"
                                    >
                                        {hire.roleLabel}
                                    </div>
                                    <div class="text-xs text-white/90 mt-0.5">
                                        ${(hire.salary / 1000).toFixed(0)}k/yr
                                    </div>
                                    <div class="text-xs text-white/75 mt-0.5">
                                        {hire.duration}
                                        {hire.duration === 1
                                            ? "month"
                                            : "months"}
                                    </div>
                                </div>

                                <!-- Remove button (visible on hover) -->
                                <button
                                    onclick={() => handleRemoveHire(hire.id)}
                                    class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold z-10"
                                    aria-label="Remove hire"
                                >
                                    ×
                                </button>

                                {#if isEnd}
                                    <!-- Right resize handle (also on start if duration is 1) -->
                                    <div
                                        class="absolute right-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onmousedown={(e) =>
                                            handleResizeStart(
                                                e,
                                                hire.id,
                                                "right",
                                            )}
                                        role="button"
                                        tabindex="0"
                                        aria-label="Resize end date"
                                    ></div>
                                {/if}
                            {:else if isEnd}
                                <!-- Right resize handle -->
                                <div
                                    class="absolute right-0 top-0 bottom-0 w-2 bg-white/30 hover:bg-white/50 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onmousedown={(e) =>
                                        handleResizeStart(e, hire.id, "right")}
                                    role="button"
                                    tabindex="0"
                                    aria-label="Resize end date"
                                ></div>
                                <!-- Continuation of hire -->
                                <div class="text-white/50 text-xs">━━</div>
                            {:else if isActive}
                                <!-- Middle of hire -->
                                <div class="text-white/50 text-xs">━━</div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}

            <!-- Empty Rows for New Hires -->
            {#each Array(emptyRowsCount) as _, emptyIndex (emptyIndex + hires.length)}
                {@const rowIndex = hires.length + emptyIndex}
                <div
                    class="flex border-b border-gray-100 hover:bg-blue-50/30 min-h-20"
                >
                    <!-- Month cells -->
                    {#each MONTHS as month, monthIndex (monthIndex)}
                        <div
                            class="shrink-0 w-20 border-r border-gray-200 p-2 bg-gray-50/30 flex items-center justify-center
                            transition-colors
                            {hoveredCell?.row === rowIndex &&
                            hoveredCell?.month === monthIndex
                                ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset'
                                : 'hover:bg-blue-50'}"
                            ondragover={(e) =>
                                handleDragOver(e, rowIndex, monthIndex)}
                            ondragleave={handleDragLeave}
                            ondrop={(e) => handleDrop(e, rowIndex, monthIndex)}
                            role="gridcell"
                            tabindex="0"
                            aria-label="Empty row {rowIndex +
                                1}, month {monthIndex + 1}"
                        >
                            {#if hoveredCell?.row === rowIndex && hoveredCell?.month === monthIndex}
                                <div class="text-blue-600 text-xs font-medium">
                                    Drop Here
                                </div>
                            {:else}
                                <div class="text-gray-300 text-xs">+</div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <!-- Legend/Help -->
    <div class="mt-4 flex items-start gap-4 text-xs text-gray-600">
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Active employment period</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span>Not hired yet</span>
        </div>
        <div class="flex-1 text-right">
            <strong>Tip:</strong> Drag edges of hire bars to adjust duration. Left
            edge adjusts start date, right edge adjusts end date.
        </div>
    </div>
</div>
