# Quick Debug Guide - Drag and Drop Not Working?

## 🚨 Immediate Troubleshooting Steps

### Step 1: Open Browser Console
1. Press **F12** (or Right-click → Inspect)
2. Click on the **Console** tab
3. Try dragging a role card

### Step 2: Check Console Output

You should see messages like this:
```
🎯 DRAG START: Engineer
✅ draggedRole set to: {type: 'engineer', label: 'Engineer', ...}
📍 DRAG OVER month: 2 draggedRole: Engineer
📍 DRAG OVER month: 2 draggedRole: Engineer
💧 DROP on month: 2 draggedRole: Engineer
✅ Adding hire: Engineer at month 2
✅ Hire added successfully
🏁 DRAG END - clearing draggedRole
```

### Step 3: Diagnose the Issue

**If you see NO console messages:**
- ❌ Event handlers aren't connected
- **Fix**: Refresh the page, clear cache (Ctrl+Shift+R)
- **Try**: Run `yarn dev` and test on http://localhost:5173

**If you see "DRAG START" but nothing else:**
- ❌ Timeline not receiving drag events
- **Possible cause**: CSS pointer-events issue
- **Fix**: Check that you're dragging the role card (colored rectangle), not clicking it

**If you see "DRAG OVER" but no "DROP":**
- ❌ Drop not being triggered
- **Possible cause**: Not releasing mouse over drop zone
- **Fix**: Make sure to release the mouse button over one of the small month boxes

**If you see "⚠️ No draggedRole set!"**
- ❌ State not passing from App to TimelineGrid
- **Possible cause**: Svelte binding issue
- **Fix**: Restart dev server (`yarn dev`)

---

## ✅ Quick Test Procedure

1. **Start dev server**:
   ```bash
   yarn dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Open console**: Press F12

4. **Try to drag**:
   - Click and HOLD on any role card at bottom (e.g., "👩‍💻 Engineer")
   - Drag upward to the timeline area
   - You should see a grid of small boxes with month names
   - Hover over any box - it should turn **blue** with "Drop" text
   - Release mouse button

5. **Expected result**:
   - Console shows: "✅ Adding hire: Engineer at month X"
   - Colored bar appears in timeline
   - Monthly burn rate updates at top
   - Monthly burn shown below timeline

---

## 🐛 Common Problems & Solutions

### Problem 1: "I can't pick up the role card"

**Symptoms**: Card doesn't drag at all, cursor doesn't change

**Solution**:
```
1. Make sure you're using a mouse (trackpad can be finicky)
2. Click and HOLD for a moment before dragging
3. Try a different browser (Chrome recommended)
4. Check if you're on mobile (see mobile section below)
```

### Problem 2: "Drop zones don't highlight"

**Symptoms**: No blue highlight when dragging over timeline

**Solution**:
```
1. Check console - do you see "📍 DRAG OVER" messages?
   - YES → CSS issue, try zooming browser to 100%
   - NO → Event handlers not working, restart dev server

2. Make sure you're dragging over the small rectangular boxes
   in the "Drop zone" row (not the month header labels)
```

### Problem 3: "Nothing happens when I drop"

**Symptoms**: Release mouse but no hire appears

**Solution**:
```
1. Check console for "💧 DROP" message
   - If missing → You're not dropping on the drop zone
   - Try again, aim for the small boxes that turn blue

2. Check for "⚠️ No draggedRole set!" message
   - If present → State management issue
   - Restart: Ctrl+C in terminal, then `yarn dev` again

3. Make sure drop zone is highlighted BLUE before releasing
```

### Problem 4: "It works once, then stops"

**Symptoms**: First drag works, subsequent drags fail

**Solution**:
```
1. Check console for "🏁 DRAG END" message
   - If missing → State not clearing properly
   - Refresh page (Ctrl+R)

2. Don't release the drag outside the timeline
   - Always drop on a blue-highlighted box
   - If you drag away, the operation cancels
```

---

## 📱 Mobile / Touch Devices

**Current Status**: Drag and drop may NOT work on mobile devices.

**Why**: HTML5 Drag and Drop API has limited mobile support.

**Workaround Options**:

### Option A: Use Desktop
- Best experience on laptop/desktop with mouse
- Tablets with mouse/trackpad may work

### Option B: Request Click-to-Place Mode
- Would allow clicking role, then clicking month
- Not implemented yet
- Let me know if you need this feature

---

## 🔧 Advanced Debugging

### Check if draggable attribute is set:
```javascript
// In browser console:
document.querySelectorAll('[draggable="true"]').length
// Should return: 6 (one for each role)
```

### Check if events are registered:
```javascript
// In browser console:
const palette = document.querySelector('.grid.grid-cols-1');
console.log(palette);
// Should show div with ondragstart handlers
```

### Force test the add hire function:
```javascript
// In browser console:
// plannerStore is already exposed! Just use it directly:
plannerStore.addHire(ROLES[0], 0);

// Or with full object:
plannerStore.addHire(
  {type: 'engineer', label: 'Engineer', salary: 150000, 
   icon: '👩‍💻', color: 'bg-blue-500'}, 
  0
);
// If this works, drag/drop events are the issue
// If this doesn't work, store/component rendering is the issue
```

---

## 🏥 Nuclear Option: Full Reset

If nothing works:

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Clear node modules and reinstall
rm -rf node_modules
yarn install

# 3. Clear browser cache completely
# In Chrome: Ctrl+Shift+Delete → Clear all data

# 4. Restart dev server
yarn dev

# 5. Open in PRIVATE/INCOGNITO window
# This ensures no extensions interfere

# 6. Try drag and drop again
```

---

## 📹 Video Demonstration (Text Description)

**Correct drag and drop sequence:**

1. Move mouse over "👩‍💻 Engineer" card at bottom
2. Press and HOLD left mouse button
3. Cursor changes to "grabbing hand" 
4. Move mouse UP toward timeline (don't release yet!)
5. Timeline shows row of small boxes with month labels above
6. Move over any small box (e.g., "Jan", "Feb", "Mar")
7. Box turns BLUE, shows "Drop" text
8. Release mouse button while over blue box
9. Colored bar appears in timeline
10. Numbers update at top (burn rate, runway)

**Timing**: About 2-3 seconds per hire

---

## 🆘 Still Not Working?

**Check these browser requirements:**

- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ❌ Internet Explorer (not supported)
- ⚠️ Mobile browsers (limited support)

**Verify JavaScript is enabled:**
```
In Chrome: Settings → Privacy → Site Settings → JavaScript → Allowed
```

**Check for browser extensions:**
```
- Ad blockers may interfere
- Privacy extensions may block events
- Try in incognito/private mode
```

**System check:**
```
Operating System: macOS, Windows, Linux all work
Mouse: Physical mouse recommended (trackpad may be less reliable)
Screen: Minimum 1024px width for best experience
```

---

## 📊 Success Indicators

When drag and drop is working correctly, you'll see:

1. **Visual feedback**:
   - ✅ Cursor changes from arrow → grab → grabbing
   - ✅ Drop zones highlight blue on hover
   - ✅ "Drop" text appears in hovered zone

2. **Console feedback**:
   - ✅ "🎯 DRAG START" message
   - ✅ Multiple "📍 DRAG OVER" messages
   - ✅ "💧 DROP" message
   - ✅ "✅ Hire added successfully" message

3. **UI updates**:
   - ✅ Colored bar appears in timeline
   - ✅ Monthly Burn Rate increases at top
   - ✅ Runway decreases
   - ✅ Monthly burn numbers appear below timeline

---

## 📝 Report an Issue

If you've tried everything and it still doesn't work, provide:

1. **Browser info**: Name and version (e.g., Chrome 120)
2. **Console output**: Copy/paste all console messages
3. **What you see**: Describe what happens when you drag
4. **OS**: Windows/Mac/Linux
5. **Input device**: Mouse, trackpad, or touchscreen

---

## 💡 Alternative: Manual Testing

To verify the app works WITHOUT drag and drop:

```javascript
// Open browser console and paste this:

// plannerStore and ROLES are automatically exposed to the window!
// You should see: "🔧 Debug: plannerStore and ROLES exposed to window..."

// Add an Engineer starting in month 0 (January)
plannerStore.addHire(ROLES[0], 0);

// Add a Designer starting in month 3 (April)  
plannerStore.addHire(ROLES[2], 3);

// Or use the full object:
plannerStore.addHire(
  {type: 'engineer', label: 'Engineer', salary: 150000, 
   icon: '👩‍💻', color: 'bg-blue-500'}, 
  0
);

// You should see hires appear and calculations update!
```

This proves the core functionality works, even if drag/drop has issues.

---

**Last Updated**: 2024
**Tested On**: Chrome 120, Firefox 121, Safari 17, Edge 120