# Shareable Links Implementation Plan

## Overview
Add the ability to create shareable URLs that encode all scenario data, allowing users to share their headcount planning scenarios with colleagues or save them for later.

## Approach: Client-Side Compression + URL Encoding

### Why This Approach?
1. **No Backend Required** - Works entirely client-side
2. **Immediate Availability** - No server setup or API development needed
3. **Privacy** - Data never leaves the user's control
4. **Sufficient Capacity** - Modern browsers support 10,000+ character URLs
5. **Cost-Free** - No hosting or database costs

### Trade-offs
- **URL Length Limits** - May be limited to 5-10 complex scenarios
- **No Analytics** - Can't track link usage
- **No Versioning** - Can't update a shared link after creation

## Technical Implementation

### 1. Dependencies
```bash
npm install lz-string
```
- **lz-string**: Compression library optimized for URL-safe strings
- Tiny size (~3KB minified)
- Excellent compression ratios for JSON data

### 2. Data Structure to Serialize

```typescript
interface SerializedState {
  version: 1, // For future compatibility
  scenarios: {
    id: string,
    name: string,
    startingCash: number,
    collapsed: boolean,
    hires: {
      id: string,
      role: string,        // type identifier (e.g., "engineer")
      roleLabel: string,   // display name
      salary: number,
      startMonth: number,
      duration: number,
      // icon and color can be reconstructed from role type
    }[]
  }[]
}
```

**Size Estimation:**
- Single scenario with 10 hires: ~1.5KB uncompressed
- After lz-string compression: ~400-600 bytes
- Base64 URL-safe encoded: ~600-800 bytes
- **Result**: Can fit 10+ scenarios in a single URL

### 3. Implementation Files

#### A. `src/lib/utils/shareLink.ts`
```typescript
// Core serialization/deserialization logic
export function serializeScenarios(scenarios)
export function deserializeScenarios(compressed)
export function generateShareableURL(scenarios)
export function parseShareableURL(url)
```

#### B. `src/lib/components/ShareButton.svelte`
```svelte
<!-- Button component with:
  - Share icon
  - Click to generate and copy link
  - Success/error toast notifications
  - Modal showing the generated URL
-->
```

#### C. Update `src/App.svelte`
```typescript
// On mount, check for URL parameter
// If present, deserialize and populate scenarios
// Show modal asking: "Replace current scenarios?" or "Add to current scenarios?"
```

### 4. URL Format

```
https://yourapp.com/?share=N4IgdghgtgpiBcIDCADAYwgEwJ...
```

- Use query parameter `?share=` for compatibility
- Alternative: hash fragment `#share=` (doesn't hit server logs)

### 5. User Flow

#### Creating a Shareable Link:
1. User clicks "Share All Scenarios" button (in header)
2. App serializes all scenarios → JSON
3. Compress with lz-string
4. Base64 URL-safe encode
5. Generate full URL with parameter
6. Copy to clipboard automatically
7. Show success toast: "Link copied to clipboard!"
8. Optional: Show modal with link and QR code

#### Loading from Shareable Link:
1. User visits URL with `?share=` parameter
2. App detects parameter on load
3. Deserialize and validate data
4. Show modal: 
   - "Load 3 scenarios from this link?"
   - Preview: List scenario names
   - Options: [Replace All] [Add to Existing] [Cancel]
5. Apply user's choice
6. Remove parameter from URL (clean history)

### 6. Edge Cases & Error Handling

#### Validation:
- Check data version compatibility
- Validate all required fields exist
- Verify data types (numbers, strings, etc.)
- Ensure salary/duration values are reasonable
- Limit maximum scenarios (e.g., 20)
- Limit maximum hires per scenario (e.g., 50)

#### Error States:
- **Corrupt Data**: "Invalid share link. Link may be corrupted."
- **Version Mismatch**: "This link was created with a newer version."
- **Too Large**: "URL too long. Try reducing scenarios or hires."
- **Decode Failed**: "Unable to read share link."

#### URL Length Handling:
```typescript
const MAX_URL_LENGTH = 8000; // Conservative limit
if (generatedURL.length > MAX_URL_LENGTH) {
  // Show error with suggestions:
  // - Remove some scenarios
  // - Remove collapsed scenarios
  // - Simplify scenario names
}
```

### 7. UI Components

#### Header Section:
```
┌─────────────────────────────────────────────┐
│  Headcount Planner    [🌙] [📤 Share] [⚙️]  │
└─────────────────────────────────────────────┘
```

#### Share Modal:
```
┌──────────────────────────────────────────┐
│  Share Your Scenarios                    │
│  ────────────────────────────────────    │
│                                          │
│  📋 https://app.com/?share=N4Igdg...    │
│      [Copy Link]                         │
│                                          │
│  ✓ Link copied to clipboard!            │
│                                          │
│  Share this link with anyone to show    │
│  your headcount planning scenarios.     │
│                                          │
│              [Done]                      │
└──────────────────────────────────────────┘
```

#### Load Confirmation Modal:
```
┌──────────────────────────────────────────┐
│  Load Scenarios from Link?               │
│  ────────────────────────────────────    │
│                                          │
│  This link contains 3 scenarios:         │
│   • Conservative Growth (5 hires)        │
│   • Aggressive Hiring (12 hires)         │
│   • Remote Team (8 hires)                │
│                                          │
│  [Replace All]  [Add to Existing]        │
│                              [Cancel]    │
└──────────────────────────────────────────┘
```

### 8. Implementation Steps

#### Phase 1: Core Functionality (1-2 hours)
1. Install lz-string
2. Create `shareLink.ts` utility
3. Implement serialize/deserialize functions
4. Write unit tests for edge cases
5. Test with sample data

#### Phase 2: Share Button (1 hour)
1. Create ShareButton component
2. Add to app header
3. Implement clipboard API
4. Add success/error toasts
5. Style modal

#### Phase 3: Load from URL (1 hour)
1. Add URL parameter detection in App.svelte
2. Create load confirmation modal
3. Implement replace/add logic
4. Clean URL after loading
5. Add error handling

#### Phase 4: Polish & Testing (1 hour)
1. Test with various scenario sizes
2. Test URL length limits
3. Add loading states
4. Improve error messages
5. Add analytics events (optional)

### 9. Testing Checklist

- [ ] Single scenario serialization/deserialization
- [ ] Multiple scenarios (2, 5, 10, 20)
- [ ] Large scenarios (50+ hires)
- [ ] Empty scenarios (0 hires)
- [ ] Special characters in scenario names
- [ ] Very long scenario names (100+ chars)
- [ ] URL length validation
- [ ] Corrupt data handling
- [ ] Missing fields handling
- [ ] Type validation
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers
- [ ] Copy to clipboard on different devices
- [ ] URL history cleaning

### 10. Future Enhancements (Optional)

#### V2: Backend Short URLs
- Add optional backend for shorter URLs
- Generate 6-character codes (e.g., `/s/a3f9k2`)
- Store in database with expiration
- Fallback to client-side if backend unavailable

#### V3: QR Codes
- Generate QR code for sharing link
- Useful for mobile → desktop transfer
- Use `qrcode` library

#### V4: Templates
- Pre-defined scenario templates
- "YC Batch Schedule"
- "Remote-First Startup"
- "Sales-Heavy Growth"

#### V5: Versioning
- Support for backward compatibility
- Graceful degradation for old links
- Migration helpers

### 11. Security Considerations

1. **No Sensitive Data**: Never include sensitive information in URLs
2. **Data Validation**: Strictly validate all deserialized data
3. **Size Limits**: Enforce maximum sizes to prevent abuse
4. **Sanitization**: Sanitize scenario names and text fields
5. **HTTPS Only**: Ensure app is served over HTTPS

### 12. Performance Considerations

1. **Lazy Loading**: Only deserialize when needed
2. **Debouncing**: Don't regenerate URL on every change
3. **Compression**: Use lz-string's fastest algorithm
4. **Caching**: Cache generated URLs temporarily

## Summary

This approach provides a robust, serverless solution for shareable links that:
- ✅ Works immediately without backend infrastructure
- ✅ Handles realistic scenario sizes (5-10 scenarios)
- ✅ Maintains user privacy (data never stored server-side)
- ✅ Provides excellent UX with clear feedback
- ✅ Handles errors gracefully
- ✅ Can be extended with backend later if needed

**Estimated Total Implementation Time**: 4-5 hours