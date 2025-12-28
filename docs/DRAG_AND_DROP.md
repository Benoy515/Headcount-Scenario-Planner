# Drag and Drop Implementation Guide

## Overview

The drag and drop system in this application uses the native HTML5 Drag and Drop API combined with Svelte 5's reactive state management. This document explains how it works and how to debug issues.

---

## Architecture

### Data Flow

```
User drags role card
        ↓
RolePalette fires ondragstart
        ↓
App.svelte sets draggedRole state
        ↓
TimelineGrid receives draggedRole via $bindable
        ↓
User hovers over month → visual feedback
        ↓
User drops → TimelineGrid calls plannerStore.addHire()
        ↓
Store updates → UI rerenders with new hire
```

---

## Component Breakdown

### 1. App.svelte (Parent/Coordinator)

**Role**: Manages the shared `draggedRole` state between RolePalette and TimelineGrid.

```typescript
let draggedRole: any = $state(null);

function handleDragStart(e: DragEvent, role: any) {
    draggedRole = role;  // Store the role being dragged
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData("text/plain", role.type);
    }
}

function handleDragEnd() {
    draggedRole = null;  // Clear when drag ends
}
```

**Key Points**:
- `draggedRole` uses Svelte 5's `$state()` rune for reactivity
- Passed to TimelineGrid via `bind:draggedRole` (two-way binding)
- Passed to RolePalette as `ondragstart` callback

---

### 2. RolePalette.svelte (Drag Source)

**Role**: Makes role cards draggable and initiates drag operations.

```svelte
<div
    draggable="true"
    ondragstart={(e) => {
        e.dataTransfer!.effectAllowed = "copy";
        ondragstart(e, role);
    }}
    class="cursor-grab active:cursor-grabbing"
>
    <RoleCard {role} />
</div>
```

**Key Points**:
- `draggable="true"` enables dragging on the container div
- `ondragstart` calls the parent's handler, passing the event and role
- Cursor changes to `grab` → `grabbing` for visual feedback
- The role data is passed through the callback, not dataTransfer

---

### 3. RoleCard.svelte (Visual Component)

**Role**: Pure presentation component for role display.

```svelte
<div class="... pointer-events-none select-none">
    <!-- Role content -->
</div>
```

**Key Points**:
- `pointer-events-none` prevents the card from interfering with drag events
- `select-none` prevents text selection during drag
- Parent container handles all drag logic

---

### 4. TimelineGrid.svelte (Drop Target)

**Role**: Receives dropped roles and adds them to the timeline.

```typescript
let { draggedRole = $bindable(null) } = $props();
let hoveredMonth: number | null = $state(null);

function handleDragOver(e: DragEvent, monthIndex: number) {
    e.preventDefault();  // CRITICAL: Required to allow drop!
    hoveredMonth = monthIndex;  // Show visual feedback
}

function handleDrop(e: DragEvent, monthIndex: number) {
    e.preventDefault();  // CRITICAL: Required!
    if (draggedRole) {
        plannerStore.addHire(draggedRole, monthIndex);
        draggedRole = null;  // Clear the state
        hoveredMonth = null;
    }
}
```

**Key Points**:
- `$bindable()` creates two-way binding with parent's `draggedRole`
- `e.preventDefault()` in `dragOver` is **required** for drops to work
- `hoveredMonth` provides visual feedback (blue highlight)
- Accesses `draggedRole` directly from reactive state (not from dataTransfer)

---

## HTML5 Drag and Drop Events

### Event Sequence

1. **dragstart** - Fires when user starts dragging
   - Set `effectAllowed` (copy, move, link)
   - Optionally set drag data with `setData()`
   - Update application state

2. **drag** - Fires continuously while dragging
   - Not used in this implementation

3. **dragenter** - Fires when dragged item enters a valid drop target
   - Not used (we use dragover instead)

4. **dragover** - Fires continuously while over a drop target
   - **MUST call `e.preventDefault()`** to allow dropping
   - Used for visual feedback (highlight drop zones)

5. **dragleave** - Fires when dragged item leaves a drop target
   - Used to remove visual feedback

6. **drop** - Fires when user releases the drag
   - **MUST call `e.preventDefault()`** to prevent default behavior
   - Execute the drop logic (add hire)

7. **dragend** - Fires when drag operation ends (success or cancel)
   - Used to clean up state

---

## Critical Implementation Details

### Why `e.preventDefault()` is Required

```javascript
// In dragover handler - REQUIRED!
function handleDragOver(e: DragEvent, monthIndex: number) {
    e.preventDefault();  // Without this, drop won't work!
    hoveredMonth = monthIndex;
}

// In drop handler - REQUIRED!
function handleDrop(e: DragEvent, monthIndex: number) {
    e.preventDefault();  // Without this, browser may navigate
    // ... handle drop
}
```

**Why**: By default, browsers don't allow dropping on most elements. `preventDefault()` tells the browser "this is a valid drop target".

### State Management Strategy

We use **application state** instead of `dataTransfer` for the main data flow:

```javascript
// We could use dataTransfer:
e.dataTransfer.setData("application/json", JSON.stringify(role));
const role = JSON.parse(e.dataTransfer.getData("application/json"));

// But we use reactive state instead:
draggedRole = role;  // Set in dragstart
// Later, access directly:
if (draggedRole) { ... }
```

**Why**: 
- Simpler and more reliable
- Works better with Svelte's reactivity
- No serialization/deserialization needed
- Type-safe

### Svelte 5 Bindable Props

```javascript
// Parent (App.svelte):
let draggedRole = $state(null);
<TimelineGrid bind:draggedRole />

// Child (TimelineGrid.svelte):
let { draggedRole = $bindable(null) } = $props();
```

This creates a **two-way binding**:
- Parent can set `draggedRole`
- Child can modify `draggedRole`
- Both see the same reactive value

---

## Common Issues and Solutions

### Issue 1: Drag doesn't start

**Symptoms**: Can't drag role cards at all

**Possible Causes**:
1. Missing `draggable="true"` attribute
2. CSS `pointer-events: none` on wrong element
3. Event handler not connected

**Solution**:
```svelte
<!-- Container must have draggable="true" -->
<div draggable="true" ondragstart={handler}>
    <!-- Inner content can have pointer-events-none -->
    <div class="pointer-events-none">...</div>
</div>
```

### Issue 2: Can't drop on timeline

**Symptoms**: Drop zones don't accept drops, no visual feedback

**Possible Causes**:
1. Missing `e.preventDefault()` in `dragover`
2. Drop handler not registered
3. `draggedRole` not being set

**Solution**:
```javascript
// MUST prevent default in dragover
ondragover={(e) => {
    e.preventDefault();  // This is required!
    // ... your code
}}

ondrop={(e) => {
    e.preventDefault();  // This too!
    // ... your code
}}
```

### Issue 3: No visual feedback on hover

**Symptoms**: Drop zones don't highlight when dragging over them

**Possible Causes**:
1. `hoveredMonth` state not updating
2. CSS classes not applied
3. Event handlers not firing

**Solution**:
```javascript
// Track hovered month
let hoveredMonth = $state(null);

ondragover={(e) => {
    e.preventDefault();
    hoveredMonth = monthIndex;  // Set state
}}

ondragleave={() => {
    hoveredMonth = null;  // Clear state
}}

// Apply conditional classes
class={hoveredMonth === i ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
```

### Issue 4: State not clearing after drop

**Symptoms**: Can't drag another role, state stuck

**Possible Causes**:
1. Not clearing `draggedRole` after drop
2. Not handling `dragend` event

**Solution**:
```javascript
// In drop handler
function handleDrop(e, monthIndex) {
    e.preventDefault();
    if (draggedRole) {
        plannerStore.addHire(draggedRole, monthIndex);
        draggedRole = null;  // Clear state!
        hoveredMonth = null;
    }
}

// In parent App.svelte
ondragend={handleDragEnd}

function handleDragEnd() {
    draggedRole = null;  // Safety cleanup
}
```

---

## Debugging Checklist

When drag and drop isn't working, check these in order:

### 1. Check Draggable Element
```javascript
// In browser console:
document.querySelectorAll('[draggable="true"]')
// Should show role cards
```

### 2. Check Event Handlers
Add console logs:
```javascript
ondragstart={(e) => {
    console.log('DRAG START', role);
    ondragstart(e, role);
}}

ondragover={(e) => {
    console.log('DRAG OVER', monthIndex);
    e.preventDefault();
    hoveredMonth = monthIndex;
}}

ondrop={(e) => {
    console.log('DROP', draggedRole, monthIndex);
    e.preventDefault();
    // ...
}}
```

### 3. Check State Updates
```javascript
// In TimelineGrid.svelte
$effect(() => {
    console.log('draggedRole changed:', draggedRole);
});
```

### 4. Check Browser Compatibility
- Chrome 90+: ✅ Full support
- Firefox 88+: ✅ Full support  
- Safari 14+: ✅ Full support
- Mobile Safari: ⚠️ Touch events need special handling

### 5. Check CSS Interference
```css
/* These can break drag and drop: */
.bad {
    user-select: none;  /* On draggable container */
    pointer-events: none;  /* On draggable container */
    touch-action: none;  /* Can interfere on mobile */
}

/* Correct usage: */
.draggable-container {
    cursor: grab;
    /* user-select and pointer-events CAN be on children */
}
.draggable-content {
    pointer-events: none;  /* OK here */
    user-select: none;  /* OK here */
}
```

---

## Mobile Touch Support

The current implementation uses HTML5 Drag and Drop, which has **limited mobile support**.

### Mobile Limitations

- **iOS Safari**: Drag and Drop API support is incomplete
- **Android Chrome**: Works but may have quirks
- **Touch events**: Not automatically handled

### Solution for Production

For full mobile support, consider:

1. **Touch Events Library**
```bash
yarn add mobile-drag-drop
```

2. **Polyfill Approach**
```javascript
import { polyfill } from "mobile-drag-drop";
import "mobile-drag-drop/default.css";

polyfill({
    dragImageTranslateOverride: true
});
```

3. **Alternative: Click-to-Place**
```javascript
let selectedRole = $state(null);

function selectRole(role) {
    selectedRole = role;
    // Show visual feedback
}

function placeHire(monthIndex) {
    if (selectedRole) {
        plannerStore.addHire(selectedRole, monthIndex);
        selectedRole = null;
    }
}
```

---

## Testing the Implementation

### Manual Test Cases

1. **Basic Drag and Drop**
   - [ ] Can pick up role card (cursor changes)
   - [ ] Drop zone highlights on hover
   - [ ] Hire appears in timeline after drop
   - [ ] Can drop on different months
   - [ ] State clears after successful drop

2. **Edge Cases**
   - [ ] Drag and release outside drop zone (cancels)
   - [ ] Rapid drag and drop multiple roles
   - [ ] Drop on same month multiple times
   - [ ] Drop after scrolling timeline

3. **Visual Feedback**
   - [ ] Cursor changes (grab → grabbing)
   - [ ] Drop zones highlight blue on hover
   - [ ] Hover highlight clears on drag leave
   - [ ] "Drop" text appears in hovered zone

4. **State Management**
   - [ ] Burn rate updates after adding hire
   - [ ] Runway recalculates immediately
   - [ ] Remove hire works correctly
   - [ ] Reset clears all hires

### Browser DevTools Testing

1. **Open Console** (F12)
2. **Add Debug Logs** (see debugging section above)
3. **Watch Network Tab** (should be no requests during drag)
4. **Check React/Svelte Devtools** to see state changes

---

## Performance Considerations

### Current Implementation

- **Pros**:
  - Lightweight (native API)
  - No external dependencies
  - Fast and responsive

- **Cons**:
  - Limited mobile support
  - Browser inconsistencies

### Optimizations

1. **Avoid Re-renders During Drag**
```javascript
// Use local state for hover, not store
let hoveredMonth = $state(null);  // ✅ Good
// vs
plannerStore.setHoveredMonth(index);  // ❌ Unnecessary store update
```

2. **Throttle Drag Events** (if needed)
```javascript
let lastUpdate = 0;
function handleDragOver(e, monthIndex) {
    e.preventDefault();
    const now = Date.now();
    if (now - lastUpdate > 16) {  // ~60fps
        hoveredMonth = monthIndex;
        lastUpdate = now;
    }
}
```

---

## Alternative Implementations

### Option 1: svelte-dnd-action (Already Installed!)

The package is installed but not used. To implement:

```svelte
<script>
import { dndzone } from 'svelte-dnd-action';

let items = $state([...ROLES]);
let hires = $state([]);

function handleDndConsider(e) {
    items = e.detail.items;
}

function handleDndFinalize(e) {
    items = e.detail.items;
    // Check if item moved to timeline
}
</script>

<div use:dndzone={{items}} on:consider={handleDndConsider}>
    {#each items as item (item.id)}
        <RoleCard role={item} />
    {/each}
</div>
```

### Option 2: Simple Click-to-Place

```svelte
<script>
let selectedRole = $state(null);
</script>

{#each ROLES as role}
    <button 
        onclick={() => selectedRole = role}
        class={selectedRole === role ? 'selected' : ''}
    >
        <RoleCard {role} />
    </button>
{/each}

{#each MONTHS as month, i}
    <button onclick={() => {
        if (selectedRole) {
            plannerStore.addHire(selectedRole, i);
            selectedRole = null;
        }
    }}>
        {month.label}
    </button>
{/each}
```

---

## Summary

### How It Works

1. **User starts drag** → RolePalette fires `ondragstart` → App sets `draggedRole`
2. **User drags over timeline** → TimelineGrid's `dragover` prevents default → Shows highlight
3. **User drops** → TimelineGrid's `drop` adds hire → Clears state
4. **Store updates** → UI reactively updates → Hire appears

### Key Requirements

- ✅ `draggable="true"` on draggable elements
- ✅ `e.preventDefault()` in `dragover` and `drop`
- ✅ State management for drag data
- ✅ Visual feedback during drag
- ✅ Cleanup after drop/cancel

### Current Status

The implementation uses native HTML5 Drag and Drop API with Svelte 5 reactive state management. It works well on desktop browsers but may need enhancements for full mobile support.

---

## Next Steps

If drag and drop still isn't working after checking this guide:

1. Check browser console for errors
2. Verify all event handlers are connected
3. Add debug console.log statements
4. Test in different browsers
5. Check if CSS is interfering
6. Consider using the alternative click-to-place approach for mobile

For production mobile support, consider adding the `mobile-drag-drop` polyfill or implementing a dual interface (drag on desktop, click/tap on mobile).