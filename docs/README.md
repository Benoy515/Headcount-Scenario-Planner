# Documentation Index

Welcome to the Headcount Scenario Planner documentation! This folder contains comprehensive guides covering everything from user instructions to deep technical implementation details.

## 📚 Documentation Files

### 1. [USER_GUIDE.md](./USER_GUIDE.md)
**For End Users** | 428 lines

Complete user manual with step-by-step instructions for using the Headcount Scenario Planner.

**Contents:**
- Quick start guide (3 simple steps)
- Feature explanations with visual diagrams
- Role palette overview
- Common planning scenarios
- Tips & tricks for effective planning
- Calculation explanations
- Troubleshooting common issues
- FAQ section
- Mobile usage considerations

**Start here if you're:** A startup founder, finance manager, or anyone who wants to plan team growth.

---

### 2. [QUICK_DEBUG.md](./QUICK_DEBUG.md)
**For Troubleshooting** | 328 lines

Fast troubleshooting guide specifically for drag and drop issues.

**Contents:**
- Immediate troubleshooting steps
- Console debugging with emoji-tagged logs
- Common problems & solutions
- Mobile/touch device workarounds
- Advanced debugging techniques
- Nuclear option: full reset
- Browser compatibility checklist
- Success indicators

**Start here if:** Drag and drop isn't working and you need a quick fix.

---

### 3. [DRAG_AND_DROP.md](./DRAG_AND_DROP.md)
**For Developers** | 609 lines

Deep dive into the drag and drop implementation using HTML5 Drag and Drop API with Svelte 5.

**Contents:**
- Complete architecture overview
- Component-by-component breakdown
- HTML5 drag and drop event sequence
- Critical implementation details
- State management strategy
- Common issues and solutions
- Performance considerations
- Alternative implementations
- Mobile touch support strategies
- Testing procedures

**Start here if:** You're a developer who wants to understand or modify the drag and drop system.

---

### 4. [IMPLEMENTATION.md](./IMPLEMENTATION.md)
**For Developers** | 616 lines

Comprehensive technical documentation covering the entire application architecture and implementation.

**Contents:**
- Architecture overview with diagrams
- State management (stores & runes)
- Component details (all 6 components)
- Calculation logic & algorithms
- Complete drag & drop flow
- Styling strategy with Tailwind
- Performance optimizations
- Type safety with TypeScript
- Testing considerations
- Browser compatibility
- Build & deployment
- Known limitations
- Future enhancement ideas
- Svelte 5 runes reference
- Code quality principles

**Start here if:** You're a developer who wants to understand the complete system, contribute, or extend functionality.

---

## 🗺️ Documentation Map

```
Need to use the app?
└─► USER_GUIDE.md

Drag & drop not working?
└─► QUICK_DEBUG.md
    └─► Still not working?
        └─► DRAG_AND_DROP.md (advanced)

Want to understand the code?
└─► IMPLEMENTATION.md
    └─► Specifically drag & drop?
        └─► DRAG_AND_DROP.md

Building a similar app?
└─► IMPLEMENTATION.md + DRAG_AND_DROP.md
```

---

## 📖 Quick Reference

### For Users

| Task | Document | Section |
|------|----------|---------|
| How to add a hire | USER_GUIDE.md | Quick Start |
| Understanding calculations | USER_GUIDE.md | Calculations Explained |
| Planning scenarios | USER_GUIDE.md | Common Scenarios |
| Keyboard shortcuts | USER_GUIDE.md | Keyboard & Accessibility |

### For Troubleshooting

| Issue | Document | Section |
|-------|----------|---------|
| Can't drag roles | QUICK_DEBUG.md | Problem 1 |
| Drop zones don't highlight | QUICK_DEBUG.md | Problem 2 |
| Nothing happens on drop | QUICK_DEBUG.md | Problem 3 |
| Works once then stops | QUICK_DEBUG.md | Problem 4 |
| Mobile issues | QUICK_DEBUG.md | Mobile / Touch Devices |

### For Developers

| Topic | Document | Section |
|-------|----------|---------|
| State management | IMPLEMENTATION.md | State Management |
| Component structure | IMPLEMENTATION.md | Component Details |
| Burn rate calculation | IMPLEMENTATION.md | Calculation Logic |
| Drag & drop flow | DRAG_AND_DROP.md | Data Flow |
| Event handlers | DRAG_AND_DROP.md | Component Breakdown |
| Debugging setup | DRAG_AND_DROP.md | Debugging Checklist |
| Svelte 5 runes | IMPLEMENTATION.md | Svelte 5 Patterns |

---

## 🎯 Common Questions

**Q: Where do I start as a complete beginner?**  
A: [USER_GUIDE.md](./USER_GUIDE.md) - Section: "Quick Start in 3 Steps"

**Q: Drag and drop isn't working!**  
A: [QUICK_DEBUG.md](./QUICK_DEBUG.md) - Follow Step 1-3 immediately

**Q: How are burn rate and runway calculated?**  
A: [USER_GUIDE.md](./USER_GUIDE.md) - Section: "Calculations Explained"  
Or: [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Section: "Calculation Logic"

**Q: I want to modify the drag and drop behavior**  
A: [DRAG_AND_DROP.md](./DRAG_AND_DROP.md) - Read the full document

**Q: How does Svelte 5's reactivity work here?**  
A: [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Section: "Svelte 5 Runes Used"

**Q: Can I add custom roles?**  
A: [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Section: "Known Limitations & Future Improvements"

**Q: Why doesn't it work on my iPhone?**  
A: [DRAG_AND_DROP.md](./DRAG_AND_DROP.md) - Section: "Mobile Touch Support"

**Q: How do I add console debugging?**  
A: Already added! See [QUICK_DEBUG.md](./QUICK_DEBUG.md) - Section: "Check Console Output"

---

## 🔍 Search by Topic

### Architecture & Design
- Architecture overview → IMPLEMENTATION.md
- Component structure → IMPLEMENTATION.md
- Data flow → DRAG_AND_DROP.md
- State management → IMPLEMENTATION.md

### Features
- Financial summary → IMPLEMENTATION.md, USER_GUIDE.md
- Timeline grid → IMPLEMENTATION.md, USER_GUIDE.md
- Role palette → IMPLEMENTATION.md, USER_GUIDE.md
- Drag and drop → DRAG_AND_DROP.md

### Development
- Svelte 5 runes → IMPLEMENTATION.md
- TypeScript types → IMPLEMENTATION.md
- Event handlers → DRAG_AND_DROP.md
- Store creation → IMPLEMENTATION.md

### Debugging
- Console logs → QUICK_DEBUG.md
- Event tracing → DRAG_AND_DROP.md
- Common issues → QUICK_DEBUG.md, DRAG_AND_DROP.md
- Browser compatibility → All docs

### Calculations
- Monthly burn → IMPLEMENTATION.md, USER_GUIDE.md
- Runway → IMPLEMENTATION.md, USER_GUIDE.md
- Algorithms → IMPLEMENTATION.md
- Examples → USER_GUIDE.md

---

## 📝 Documentation Stats

| Document | Lines | Words | Target Audience | Read Time |
|----------|-------|-------|-----------------|-----------|
| USER_GUIDE.md | 428 | ~3,500 | End Users | 15 min |
| QUICK_DEBUG.md | 328 | ~2,400 | Users/Developers | 10 min |
| DRAG_AND_DROP.md | 609 | ~4,800 | Developers | 25 min |
| IMPLEMENTATION.md | 616 | ~4,900 | Developers | 25 min |
| **Total** | **1,981** | **~15,600** | - | **75 min** |

---

## 🚀 Getting Started Paths

### Path 1: I want to use the app
1. Read [USER_GUIDE.md](./USER_GUIDE.md) - Quick Start (5 min)
2. Try the app
3. If issues → [QUICK_DEBUG.md](./QUICK_DEBUG.md)

### Path 2: I'm debugging drag & drop
1. Open [QUICK_DEBUG.md](./QUICK_DEBUG.md) immediately
2. Follow troubleshooting steps
3. If still stuck → [DRAG_AND_DROP.md](./DRAG_AND_DROP.md)

### Path 3: I'm a developer exploring the code
1. Skim [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Architecture (10 min)
2. Read sections relevant to your interest
3. Deep dive [DRAG_AND_DROP.md](./DRAG_AND_DROP.md) if modifying interactions

### Path 4: I'm building something similar
1. Read [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Full document (25 min)
2. Read [DRAG_AND_DROP.md](./DRAG_AND_DROP.md) - Full document (25 min)
3. Reference [USER_GUIDE.md](./USER_GUIDE.md) for UX patterns

---

## 🛠️ Contributing to Documentation

If you find issues or want to improve the docs:

1. **Typos/Errors**: Note the file and line number
2. **Missing Info**: Describe what's missing and where it should go
3. **Unclear Sections**: Point out what's confusing
4. **New Features**: Update relevant docs when adding features

---

## 📄 License

Same as the main project (MIT).

---

**Last Updated**: 2024  
**Documentation Version**: 1.0  
**Application Version**: See package.json