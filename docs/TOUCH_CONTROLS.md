# Touch-Friendly Controls Implementation

## Overview

This document describes the touch-friendly arrow button controls added to hire bars for mobile and tablet devices.

## Problem

On touch devices, dragging the edges of hire bars to resize them was difficult due to:
1. Small hit targets (3px wide resize handles)
2. Precision requirements when dragging
3. Long-press delay required before drag starts (HTML5 drag-and-drop behavior)

## Solution

Added **arrow buttons** that appear on hire bars when the app detects a touch device. These buttons provide a simple, tap-based interface for adjusting hire durations.

## Implementation

### Detection

The app detects touch devices on mount using:

```javascript
onMount(() => {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
});
```

### Button Layout

Each hire bar displays **4 arrow buttons** on touch devices:

**Left Side (Start Month):**
- ← Extend Left: Moves start date earlier by 1 month
- → Shrink Left: Moves start date later by 1 month (reduces duration)

**Right Side (End Month):**
- → Extend Right: Moves end date later by 1 month (increases duration)
- ← Shrink Right: Moves end date earlier by 1 month (reduces duration)

### Visual Design

- **Size**: 24px × 24px (6 × 6 Tailwind units)
- **Background**: Semi-transparent white (white/80) with hover/active states
- **Icons**: Lucide chevrons (ChevronLeft, ChevronRight)
- **Layout**: Stacked vertically on left/right edges of hire bars
- **Z-index**: 20 (above the hire bar but below modals)
- **Touch Target**: Follows `touch-manipulation` CSS for optimized touch response

### Functions

```javascript
// Left side controls
handleExtendLeft(hire)  // Decreases startMonth by 1, increases duration
handleShrinkLeft(hire)  // Increases startMonth by 1, decreases duration

// Right side controls  
handleExtendRight(hire) // Increases duration by 1
handleShrinkRight(hire) // Decreases duration by 1
```

### Constraints

- Start month cannot go below 0
- End month cannot exceed month 23 (24 total months)
- Duration cannot go below 1 month
- All adjustments are in 1-month increments

## User Experience

### Desktop (Mouse)
- Shows traditional resize handles (3px draggable edges)
- Click and drag to adjust start/end dates
- Smooth, continuous resizing

### Touch Devices (Mobile/Tablet)
- Shows arrow buttons instead of resize handles
- Tap arrows to adjust in 1-month increments
- Clear, large touch targets
- Immediate visual feedback (blue for extend, red for shrink)

### Tip Text

The help text at the bottom of the timeline automatically adjusts:

- **Touch**: "Use the arrow buttons on hire bars to adjust duration. Outer arrows extend, inner arrows shrink."
- **Desktop**: "Drag edges of hire bars to adjust duration. Left edge adjusts start date, right edge adjusts end date."

## Files Modified

- `src/lib/components/TimelineGrid.svelte`
  - Added `isTouchDevice` state
  - Added touch detection in `onMount`
  - Added 4 button handler functions
  - Imported `ChevronLeft` and `ChevronRight` from lucide-svelte
  - Conditionally render arrow buttons vs. resize handles
  - Updated help text based on device type

## Browser Compatibility

Touch detection works in:
- All iOS devices (Safari, Chrome)
- All Android devices (Chrome, Firefox, Samsung Internet)
- Windows tablets (Edge, Chrome)
- Any device with `'ontouchstart'` support or `maxTouchPoints > 0`

## Testing

### On Touch Device:
1. Open the app on a mobile device or tablet
2. Add a hire to the timeline
3. Observe arrow buttons on the left and right edges of the hire bar
4. Tap the outer arrows to extend the hire duration
5. Tap the inner arrows to shrink the hire duration
6. Verify constraints (can't go below 1 month, can't exceed timeline bounds)

### On Desktop:
1. Open the app on a desktop browser
2. Add a hire to the timeline
3. Observe traditional resize handles (no arrow buttons)
4. Drag edges to resize as before

### Testing Touch Detection:
- Chrome DevTools: Open DevTools → Toggle device toolbar → Select a mobile device
- Firefox: Open DevTools → Responsive Design Mode
- Safari: Develop menu → Enter Responsive Design Mode

**Note**: Some browsers may not trigger touch detection in device emulation mode. For accurate testing, use a real touch device or simulate touch events.

## Future Enhancements

Possible improvements:
- Add keyboard shortcuts for hire bar adjustments
- Add drag-and-drop for moving entire hire bars to different months
- Add gesture support (swipe to extend/shrink)
- Add visual indicators showing available adjustment range