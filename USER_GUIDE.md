# Headcount Scenario Planner - User Guide

## Quick Start in 3 Steps

### 1️⃣ Set Your Starting Cash
Click on the starting cash amount in the top-left to edit it. Default is $2,000,000.

```
┌─────────────────────────────────────────────────────┐
│  Starting Cash     Monthly Burn    Runway    Status │
│  [$2,000,000] ◄──  $150,000/mo    13 mo   ✓ Healthy│
│   Click to edit                                     │
└─────────────────────────────────────────────────────┘
```

### 2️⃣ Drag Roles to Timeline
Drag any role from the bottom palette and drop it on a month to add a hire.

```
Timeline:
┌──────────────────────────────────────────────────────┐
│ Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct... │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  │
│ │  │ │  │ │🎯│ │  │ │  │ │  │ │  │ │  │ │  │ │  │  │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘  │
│      Drop zone highlights when you drag over it     │
└──────────────────────────────────────────────────────┘

Hires appear as colored bars:
┌──────────────────────────────────────────────────────┐
│ ░░░░░[👩‍💻 Engineer - $150k/yr - $12.5k/mo]░░░░░░░░░│ ◄─ Hire bar
│ ░░░░░░░░░[👨‍💼 Sales - $120k/yr - $10k/mo]░░░░░░░░░░│
└──────────────────────────────────────────────────────┘
```

### 3️⃣ Watch the Numbers Update
All calculations happen in real-time as you add or remove hires.

```
Burn Rate Updates:
Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep
$0    $0    $12k  $12k  $22k  $22k  $22k  $22k  $22k
▓     ▓     ▓▓▓   ▓▓▓   ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓
```

---

## Features in Detail

### 💰 Financial Summary Panel

Located at the top of the screen, this panel shows:

**Starting Cash**
- Click to edit the amount
- Press Enter to save, Escape to cancel
- Must be a positive number

**Monthly Burn Rate**
- Current month's total expenses
- Calculated as: sum of (all active salaries ÷ 12)
- Updates automatically when you add/remove hires

**Runway Remaining**
- How many months until you run out of money
- Shows "24+" if runway exceeds 24 months
- Formula: months until (starting cash - cumulative burn) ≤ 0

**Status Indicator**
- 🟢 **Green (Healthy)**: > 12 months runway
- 🟡 **Yellow (Caution)**: 6-12 months runway
- 🔴 **Red (Critical)**: < 6 months runway

---

### 📅 Timeline Grid

The main interactive area showing your hiring plan over 24 months.

**How to Add a Hire:**
1. Click and hold on any role card in the palette below
2. Drag it up to the timeline
3. Drop it on the month when you want to hire that person
4. The hire appears as a colored bar extending to the end of the timeline

**Understanding Hire Bars:**
```
┌────────────────────────────────────────────────────┐
│ Start Month ──►                                    │
│    [Icon] Role Name - Annual Salary - Monthly Burn │
│       👩‍💻 Engineer - $150,000/yr · $12,500/mo     │
│                                            [×] ◄─── Hover to see
└────────────────────────────────────────────────────┘
```

**How to Remove a Hire:**
1. Hover your mouse over any hire bar
2. An × button appears on the right side
3. Click the × to remove that hire

**Monthly Burn Display:**
Below the timeline, you'll see:
- Monthly burn rate for each month
- Visual bar chart showing relative burn
- Helps you identify when burn increases

---

### 👥 Role Palette

Located at the bottom, the palette contains pre-configured roles:

| Icon | Role             | Annual Salary | Monthly Cost |
|------|------------------|---------------|--------------|
| 👩‍💻   | Engineer         | $150,000      | $12,500      |
| 👨‍💼   | Sales            | $120,000      | $10,000      |
| 🎨   | Designer         | $130,000      | $10,833      |
| 📋   | Product Manager  | $140,000      | $11,667      |
| 📊   | Data Analyst     | $135,000      | $11,250      |
| 📣   | Marketing        | $110,000      | $9,167       |

**Color Coding:**
- Blue: Engineers
- Green: Sales
- Purple: Designers
- Orange: Product Managers
- Cyan: Data Analysts
- Pink: Marketing

---

## Common Scenarios

### Scenario 1: Seed Stage Startup
```
Starting Cash: $1,000,000
Initial Team: 2 Engineers, 1 Designer
Timeline:
- Month 0: Hire 2 Engineers
- Month 2: Hire 1 Designer
- Month 6: Hire 1 Sales

Result: ~30 months runway initially, ~18 months after all hires
```

### Scenario 2: Series A Growth
```
Starting Cash: $5,000,000
Aggressive hiring:
- Q1: 3 Engineers, 1 Product Manager
- Q2: 2 Engineers, 2 Sales, 1 Marketing
- Q3: 1 Engineer, 1 Sales, 1 Data Analyst
- Q4: 2 Sales, 1 Designer

Result: Watch runway carefully as team scales
```

### Scenario 3: Runway Extension
```
Starting Cash: $800,000
Conservative hiring:
- Month 0: 1 Engineer
- Month 3: 1 Engineer
- Month 6: 1 Designer
- Month 9: 1 Sales

Result: Extend runway by spacing out hires
```

---

## Tips & Tricks

### 💡 Planning Best Practices

**1. Start with Core Team**
- Add essential roles first (founders, key engineers)
- See baseline burn rate

**2. Model Different Scenarios**
- Try aggressive hiring plan
- Use "Reset All" button
- Try conservative hiring plan
- Compare runway outcomes

**3. Watch Key Milestones**
- 12-month runway: Healthy fundraising position
- 6-month runway: Start fundraising process
- 3-month runway: Critical - reduce burn or secure funding

**4. Plan Around Fundraising**
- If raising in 6 months, ensure 12+ month runway
- Model post-raise hiring with increased cash

**5. Consider Burn Rate Acceleration**
- Notice how quickly burn increases
- Each hire is permanent ongoing cost
- Plan for sustainable growth

### 🎯 UI Tips

**Efficient Workflow:**
- Add multiple hires quickly by dragging one after another
- No need to wait - drops are instant
- Hover over hires to quickly see remove button
- Use horizontal scroll if timeline extends beyond screen

**Keyboard Shortcuts:**
- Enter: Save when editing starting cash
- Escape: Cancel when editing starting cash
- Tab: Navigate between UI elements

**Visual Indicators:**
- Drop zones highlight blue when you drag over them
- "Drop" text appears to confirm you're in the right spot
- Hire bars use consistent colors for role types
- Status indicator provides at-a-glance health check

---

## Calculations Explained

### Monthly Burn Rate
For any given month, the burn rate is the total monthly cost of all hires who have started by that month.

```
Example:
Jan: $0 (no hires yet)
Feb: $12,500 (1 Engineer hired in Feb)
Mar: $12,500 (same Engineer)
Apr: $23,333 (Engineer + Designer hired in Apr)
May: $23,333 (same two)
```

### Runway Calculation
The system simulates spending month by month until cash runs out.

```
Starting Cash: $1,000,000

Month 0: $1,000,000 - $0 = $1,000,000
Month 1: $1,000,000 - $0 = $1,000,000
Month 2: $1,000,000 - $12,500 = $987,500 (hired engineer)
Month 3: $987,500 - $12,500 = $975,000
Month 4: $975,000 - $23,333 = $951,667 (hired designer)
... continues until cash ≤ 0

Runway: Number of months before running out
```

### Status Determination
```
if runway >= 12 months → 🟢 Healthy
else if runway >= 6 months → 🟡 Caution  
else → 🔴 Critical
```

---

## Troubleshooting

### "I can't drop a role on the timeline"
- Make sure you're dropping on the small drop zone boxes, not between them
- Drop zone should highlight blue when you're over it
- Try refreshing the page if drag & drop stops working

### "My runway is showing 24+"
- This means you have more than 24 months of runway
- You won't run out of money in the visible timeline
- This is generally a good thing! 🎉

### "I want to move a hire to a different month"
- Currently, you need to remove it (×) and add it again
- Click × on the hire bar
- Drag the same role to the new month

### "The numbers don't look right"
- Check starting cash is set correctly
- Verify hires are showing in the timeline
- Remember: salaries are annual, divided by 12 for monthly burn
- Runway calculation stops at 24 months maximum

### "I want to start over"
- Click the "Reset All" button in the top right
- Confirm the dialog
- All hires removed and starting cash resets to $2M

---

## Example Walkthrough

Let's plan a typical early-stage startup:

**Step 1: Set context**
- Click starting cash, change to $1,500,000
- Press Enter

**Step 2: Hire founding team (Month 0)**
- Drag "Engineer" to January → First hire
- Drag "Engineer" to January → Second hire  
- Drag "Product Manager" to January → PM/Co-founder

Expected result:
- Monthly burn: $35,000
- Runway: ~43 months
- Status: 🟢 Healthy

**Step 3: Add designer (Month 3)**
- Drag "Designer" to April

Expected result:
- Month 0-2 burn: $35,000/mo
- Month 3+ burn: $45,833/mo
- Runway: ~33 months
- Status: 🟢 Healthy

**Step 4: Hire first salesperson (Month 6)**
- Drag "Sales" to July

Expected result:
- Month 0-2: $35,000/mo
- Month 3-5: $45,833/mo  
- Month 6+: $55,833/mo
- Runway: ~27 months
- Status: 🟢 Healthy

**Step 5: Aggressive growth (Month 9-12)**
- Drag "Engineer" to October
- Drag "Engineer" to November
- Drag "Marketing" to December
- Drag "Sales" to December

Expected result:
- Final burn: ~$100,000/mo
- Runway: ~15 months
- Status: 🟢 Healthy (but getting close to yellow!)

**Insight:** You can see exactly when your burn rate accelerates and plan fundraising accordingly.

---

## FAQ

**Q: Can I edit a hire after adding it?**
A: Not currently. Remove it and add it again to change the start month or role.

**Q: Can I add custom roles with different salaries?**
A: Not in this version. The six pre-configured roles cover most common startup positions.

**Q: Does this save my data?**
A: No, data is lost on page refresh. Copy your configuration elsewhere if needed.

**Q: Can I export this plan?**
A: Not currently. Take a screenshot or manually record your hiring plan.

**Q: Why are all hire bars the same width?**
A: Bars extend from the hire month to the end of the 24-month timeline. They show duration, not compensation.

**Q: Can I model multiple scenarios side-by-side?**
A: Not in this version. Use the Reset button to try different scenarios sequentially.

**Q: Do the salaries include benefits/overhead?**
A: No, these are base salaries. In reality, total cost might be 1.2-1.4x due to benefits, taxes, equipment, etc.

**Q: Can I model part-time or contract roles?**
A: No, all roles are assumed full-time with the listed annual salary.

**Q: What if I need more than 24 months?**
A: The runway calculation continues beyond 24 months - you'll see "24+" if you have longer runway.

---

## Keyboard & Accessibility

### Keyboard Support
- **Tab**: Navigate between interactive elements
- **Enter**: Activate buttons, save edits
- **Escape**: Cancel editing
- **Space**: Activate focused buttons

### Screen Reader Support
- All interactive elements have ARIA labels
- Buttons clearly describe their actions
- Form inputs have associated labels
- Status indicators include descriptive text

### Visual Accessibility
- High contrast text and backgrounds
- Color-coded elements also use icons
- Large touch targets for mobile
- Clear visual feedback for interactions

---

## Mobile Usage

The app works on mobile devices with some considerations:

**Touch & Drag:**
- Long-press on role cards to start dragging
- Drag to drop zones on timeline
- Tap × button to remove hires

**Layout:**
- Financial summary stacks vertically
- Timeline scrolls horizontally
- Role palette becomes narrower grid

**Best Experience:**
- Use tablet or desktop for easiest drag & drop
- Portrait mode may require more scrolling
- Landscape mode provides better timeline view

---

## Need Help?

If you encounter issues:
1. Try refreshing the page
2. Check browser console for errors (F12)
3. Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
4. Verify JavaScript is enabled

---

**Happy Planning! 🚀**

Built with Svelte 5 + Tailwind CSS