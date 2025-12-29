<script lang="ts">
    import {
        plannerStore,
        calculations,
        MONTHS,
    } from "../stores/plannerStore.js";
    import { formatCurrency } from "../utils/calculations.js";
    import { Trash2 } from "lucide-svelte";

    let { draggedRole = $bindable(null) } = $props();
    let hoveredCell: { row: number; month: number } | null = $state(null);
    let dragMode:
        | { type: "move"; hireId: string; initialMonth: number }
        | { type: "resize-left"; hireId: string }
        | { type: "resize-right"; hireId: string }
        | null = $state(null);
    let descriptiveMode = $state(false);

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
        e: MouseEvent | TouchEvent,
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

        processResize(gridElement, x);
    }

    function handleTouchMove(e: TouchEvent) {
        if (!dragMode) return;

        const gridElement = e.currentTarget as HTMLElement;
        const rect = gridElement.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left + gridElement.scrollLeft;

        processResize(gridElement, x);
    }

    function processResize(gridElement: HTMLElement, x: number) {
        // Calculate which month column we're over (80px per column + 48px for delete column)
        const columnWidth = 80;
        const deleteColumnWidth = 48;
        const adjustedX = x - deleteColumnWidth;
        const monthIndex = Math.floor(adjustedX / columnWidth);

        if (monthIndex < 0 || monthIndex >= 24) return;

        const hire = hires.find((h) => h.id === dragMode?.hireId);
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

    function handleTouchEnd() {
        dragMode = null;
    }

    const calc = $derived($calculations);
    const hires: any[] = $derived($plannerStore.hires);

    // Show only one empty row for new hires
    const emptyRowsCount = 1;
    const totalRows = $derived(hires.length + emptyRowsCount);
</script>

<svelte:window onmouseup={handleMouseUp} ontouchend={handleTouchEnd} />

<!-- Grid Container with Scroll -->
<div
    class="overflow-x-auto overflow-y-auto max-h-150 border border-gray-200 dark:border-gray-700 rounded-lg select-none bg-white dark:bg-gray-900"
    onmousemove={handleMouseMove}
    ontouchmove={handleTouchMove}
    role="grid"
    tabindex="0"
>
    <div class="inline-block min-w-full">
        <!-- Header Row: Months -->
        <div
            class="flex sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600"
        >
            <!-- Empty header cell for delete button column -->
            <div
                class="shrink-0 w-12 border-r border-gray-200 dark:border-gray-700"
            ></div>

            {#each MONTHS as month, i (i)}
                <div
                    class="shrink-0 w-20 p-2 border-r border-gray-200 dark:border-gray-700 text-center"
                >
                    <div
                        class="text-xs font-semibold text-gray-700 dark:text-gray-300"
                    >
                        {month.label}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {month.year}
                    </div>
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
            <div
                class="flex border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
                <!-- Delete button column -->
                <div
                    class="shrink-0 w-12 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center {descriptiveMode
                        ? 'min-h-36'
                        : 'min-h-16'}"
                >
                    <button
                        onclick={() => handleRemoveHire(hire.id)}
                        class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 active:bg-red-600 text-gray-600 dark:text-gray-300 hover:text-white flex items-center justify-center transition-all touch-manipulation"
                        aria-label="Remove {hire.roleLabel}"
                    >
                        <Trash2 size={16} strokeWidth={2} />
                    </button>
                </div>

                <!-- Month cells for this hire -->
                {#each MONTHS as month, monthIndex (monthIndex)}
                    {@const isActive =
                        monthIndex >= hire.startMonth &&
                        monthIndex < hire.startMonth + hire.duration}
                    {@const isStart = monthIndex === hire.startMonth}
                    {@const isEnd =
                        monthIndex === hire.startMonth + hire.duration - 1}

                    <div
                        class="shrink-0 w-20 border-r border-gray-200 dark:border-gray-700 p-2 {descriptiveMode
                            ? 'min-h-36'
                            : 'min-h-16'} flex items-center justify-center relative
                            {hoveredCell?.row === hireIndex &&
                        hoveredCell?.month === monthIndex
                            ? 'ring-2 ring-blue-500 ring-inset dark:ring-blue-400'
                            : ''}"
                        ondragover={(e) =>
                            handleDragOver(e, hireIndex, monthIndex)}
                        ondragleave={handleDragLeave}
                        ondrop={(e) => handleDrop(e, hireIndex, monthIndex)}
                        role="gridcell"
                        tabindex="0"
                        aria-label="Month {monthIndex + 1} for {hire.roleLabel}"
                    >
                        {#if isActive}
                            <!-- Inner bar with rounded corners -->
                            <div
                                class="absolute inset-0 flex items-center justify-center m-auto h-[70%] {hire.color}
                                    {isStart ? 'rounded-l-lg' : ''}
                                    {isEnd ? 'rounded-r-lg' : ''}
                                    group"
                            >
                                {#if isStart}
                                    <!-- Left resize handle -->
                                    <div
                                        class="absolute left-0 top-0 bottom-0 w-3 bg-white/40 hover:bg-white/60 active:bg-white/70 cursor-ew-resize transition-all z-10 rounded-l-lg touch-manipulation"
                                        onmousedown={(e) =>
                                            handleResizeStart(
                                                e,
                                                hire.id,
                                                "left",
                                            )}
                                        ontouchstart={(e) =>
                                            handleResizeStart(
                                                e,
                                                hire.id,
                                                "left",
                                            )}
                                        role="button"
                                        tabindex="0"
                                        aria-label="Resize start date"
                                    ></div>

                                    <!-- Show role info on start month -->
                                    {#if descriptiveMode}
                                        <div class="text-center">
                                            <div
                                                class="mb-1 flex items-center justify-center"
                                            >
                                                <hire.icon
                                                    class="w-4 h-4 text-white"
                                                />
                                            </div>
                                            <div
                                                class="text-xs font-semibold text-white"
                                            >
                                                {hire.roleLabel}
                                            </div>
                                            <div
                                                class="text-xs text-white/90 mt-0.5"
                                            >
                                                ${(hire.salary / 1000).toFixed(
                                                    0,
                                                )}k/yr
                                            </div>
                                            <div
                                                class="text-xs text-white/75 mt-0.5"
                                            >
                                                {hire.duration}
                                                {hire.duration === 1
                                                    ? "mo"
                                                    : "mos"}
                                            </div>
                                        </div>
                                    {:else}
                                        <div
                                            class="flex items-center justify-center"
                                        >
                                            <hire.icon
                                                class="w-5 h-5 text-white"
                                            />
                                        </div>
                                    {/if}
                                {/if}

                                {#if isEnd}
                                    <!-- Right resize handle -->
                                    <div
                                        class="absolute right-0 top-0 bottom-0 w-3 bg-white/40 hover:bg-white/60 active:bg-white/70 cursor-ew-resize transition-all z-10 rounded-r-lg touch-manipulation"
                                        onmousedown={(e) =>
                                            handleResizeStart(
                                                e,
                                                hire.id,
                                                "right",
                                            )}
                                        ontouchstart={(e) =>
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
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}

        <!-- Empty Rows for New Hires -->
        {#each Array(emptyRowsCount) as _, emptyIndex (emptyIndex + hires.length)}
            {@const rowIndex = hires.length + emptyIndex}
            <div
                class="flex border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-gray-800/30 {descriptiveMode
                    ? 'min-h-32'
                    : 'min-h-16'}"
            >
                <!-- Empty delete button column for new hire rows -->
                <div
                    class="shrink-0 w-12 border-r border-gray-200 dark:border-gray-700 {descriptiveMode
                        ? 'min-h-32'
                        : 'min-h-16'}"
                ></div>

                <!-- Month cells -->
                {#each MONTHS as month, monthIndex (monthIndex)}
                    <div
                        class="shrink-0 w-20 border-r border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center relative
                            {descriptiveMode ? 'min-h-32' : 'min-h-16'}
                            transition-colors bg-gray-50/30 dark:bg-gray-800/30
                            {hoveredCell?.row === rowIndex &&
                        hoveredCell?.month === monthIndex
                            ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-inset dark:ring-blue-400'
                            : 'hover:bg-blue-50 dark:hover:bg-gray-700'}"
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
                            <div
                                class="text-blue-600 dark:text-blue-400 text-xs font-medium pointer-events-none"
                            >
                                Drop Here
                            </div>
                        {:else}
                            <div
                                class="text-gray-300 dark:text-gray-600 text-xs"
                            >
                                +
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<!-- Legend/Help -->
<div
    class="mt-4 flex items-center justify-between gap-4 text-xs text-gray-600 dark:text-gray-400"
>
    <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Descriptive Mode</span
        >
        <button
            onclick={() => (descriptiveMode = !descriptiveMode)}
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 {descriptiveMode
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-600'}"
            role="switch"
            aria-checked={descriptiveMode}
            aria-label="Toggle descriptive mode"
        >
            <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {descriptiveMode
                    ? 'translate-x-6'
                    : 'translate-x-1'}"
            ></span>
        </button>
    </div>
    <div class="flex-1 text-right">
        <strong>Tip:</strong> Drag edges of hire bars to adjust duration. Left edge
        adjusts start date, right edge adjusts end date.
    </div>
</div>
