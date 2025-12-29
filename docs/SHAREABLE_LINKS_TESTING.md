# Shareable Links Feature - Testing Guide

## ✅ Implementation Complete!

All phases of the shareable links feature have been successfully implemented:

- ✅ Phase 1: Core serialization/deserialization utilities
- ✅ Phase 2: Share button with modal and clipboard functionality
- ✅ Phase 3: URL loading with confirmation modal
- ✅ Phase 4: Error handling and polish

## 🧪 Testing Instructions

### 1. Manual Testing - Basic Flow

#### Test Share Functionality:
1. Start the dev server: `yarn dev`
2. Open the app in your browser
3. Create a few scenarios with different hires
4. Click the "Share" button in the header
5. **Expected**: Modal opens showing the shareable URL
6. Click "Copy Link" button
7. **Expected**: Button changes to "Copied!" and link is in clipboard
8. Close modal

#### Test Load Functionality:
1. Open a new browser tab/window
2. Paste the copied URL
3. **Expected**: Load modal appears showing:
   - Number of scenarios being loaded
   - List of scenario names with hire counts
   - Three action buttons
4. Click "Replace All"
5. **Expected**: 
   - Current scenarios are replaced with loaded ones
   - URL parameter is removed from address bar
   - Modal closes

#### Test Add to Existing:
1. Create 1-2 new scenarios in the app
2. Click "Share" and copy the link
3. In a new tab with existing scenarios, paste the URL
4. Click "Add to Existing"
5. **Expected**: 
   - New scenarios are added after existing ones
   - Original scenarios remain unchanged

### 2. Console Testing

The app exposes helper functions for testing. Open browser console and try:

```javascript
// Generate a share link from current scenarios
generateTestShareLink()
// Returns the URL and logs size statistics

// Access the scenarios store directly
scenariosStore
$scenariosStore

// Access role definitions
ROLES
```

### 3. Edge Cases to Test

#### Empty Scenarios:
- [ ] Share a scenario with 0 hires
- [ ] Load should work correctly

#### Large Scenarios:
```javascript
// In console, add many hires to test compression
for(let i = 0; i < 20; i++) {
  scenariosStore.addHire(scenariosStore.scenarios[0].id, ROLES[0], i % 24, 1)
}
generateTestShareLink() // Check URL length
```

#### Special Characters in Names:
- [ ] Rename scenario to include: `Test "Scenario" & Co. <tag>`
- [ ] Share and load
- [ ] Name should be preserved correctly

#### URL Parameter Conflicts:
- [ ] Try URL with existing parameters: `?foo=bar&share=...`
- [ ] Should still parse correctly

#### Corrupt URLs:
- [ ] Manually edit the share parameter to gibberish
- [ ] **Expected**: Error toast appears, URL is cleaned

#### Very Long Scenario Names:
- [ ] Create scenario with 150+ character name
- [ ] Should serialize/deserialize correctly

### 4. Cross-Browser Testing

Test on multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers (Chrome Android, Safari iOS)

**Focus areas:**
- Clipboard API compatibility
- URL length limits
- Modal keyboard navigation (ESC key)

### 5. Accessibility Testing

- [ ] Tab through Share button and modal
- [ ] Press ESC to close modals
- [ ] Use screen reader to verify ARIA labels
- [ ] Check modal focus trap
- [ ] Verify button labels are descriptive

### 6. Performance Testing

#### Compression Efficiency:
```javascript
// In console, check serialization stats
const stats = getSerializationStats($scenariosStore.scenarios)
console.log('Uncompressed:', stats.uncompressedSize, 'bytes')
console.log('Compressed:', stats.compressedSize, 'bytes')
console.log('Ratio:', stats.compressionRatio.toFixed(2) + 'x')
console.log('Estimated URL:', stats.estimatedURLLength)
```

**Expected ratios:**
- 1 scenario with 10 hires: ~3-4x compression
- 5 scenarios with 50 hires: ~3.5-4.5x compression

#### URL Length Limits:
- [ ] Create 10+ scenarios with many hires
- [ ] Attempt to share
- [ ] Should show error if URL > 8000 chars

### 7. User Experience Testing

#### Happy Path:
1. User creates 3 scenarios modeling different growth strategies
2. Clicks Share, link is auto-copied
3. Sends link to co-founder via Slack/email
4. Co-founder opens link
5. Sees clear modal asking what to do
6. Chooses appropriate action
7. Both can now discuss the scenarios

#### Error Recovery:
1. User tries to share 20 scenarios with 50+ hires each
2. Gets clear error message: "URL too long..."
3. Message suggests removing scenarios
4. User removes some scenarios
5. Share succeeds

### 8. Known Limitations

#### URL Length:
- **Maximum**: ~8,000 characters (conservative limit)
- **Typical capacity**: 10-15 scenarios with average complexity
- **Workaround**: Users can share multiple links or remove scenarios

#### Browser Compatibility:
- **Clipboard API**: Requires HTTPS (or localhost)
- **URL.searchParams**: IE11 not supported (but app requires modern browser anyway)

#### Data Persistence:
- Links are **immutable** - changes don't update shared links
- No version control - recipient sees snapshot at time of sharing

### 9. Validation Testing

The system validates all deserialized data. Test by manually crafting bad data:

#### Invalid Salary:
```javascript
// Should reject salaries outside reasonable range
// Valid: $0 - $10,000,000
```

#### Invalid Month Range:
```javascript
// Should reject startMonth outside 0-23
// Should reject duration outside 1-24
```

#### Version Mismatch:
```javascript
// If future version > 1, should show friendly error
```

### 10. Security Testing

- [ ] XSS: Try scenario names with `<script>alert('xss')</script>`
  - **Expected**: Sanitized, rendered as text
  
- [ ] URL Injection: Try crafting malicious URLs
  - **Expected**: Validation rejects invalid data

- [ ] Denial of Service: Try massive payloads
  - **Expected**: Size limits prevent acceptance

## 🐛 Bug Reporting Template

If you find issues, report with:

```
**Bug**: [Brief description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome 120 / Firefox 121 / etc]
**Console Errors**: [Any errors in console]
**Share URL**: [If relevant, the problematic URL]
```

## 📊 Success Metrics

The feature is working correctly if:

✅ Users can share scenarios with a single click
✅ Recipients can load scenarios without confusion
✅ URL compression keeps links under 8KB for typical usage
✅ Errors are handled gracefully with clear messages
✅ No data loss during serialization/deserialization
✅ Works on all major browsers
✅ Accessible via keyboard and screen readers

## 🚀 Future Enhancements

Potential improvements for V2:
- Backend short URLs (e.g., `/s/abc123`)
- QR code generation for mobile sharing
- Share link expiration dates
- Analytics (view counts, most shared scenarios)
- Social media preview cards (OpenGraph meta tags)
- Export to PDF alongside share link