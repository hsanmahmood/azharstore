# Z-Index & Dropdown Overlay Fix

## Problem
The dropdown menus in the rich text editor were being overlayed by other elements and not displaying properly.

## Root Cause
1. **Low z-index values** - Dropdowns had `z-index: 10` which was too low
2. **Overflow clipping** - Parent containers had default `overflow: hidden` or no overflow handling
3. **Stacking context issues** - Multiple layers of containers without proper overflow settings

## Solution Applied

### 1. Increased Z-Index Values
**File:** `SimpleRichTextEditor.jsx`

Changed dropdown z-index from `z-10` to `z-50`:
```jsx
// Text Size Picker Dropdown
<div className="... z-50 ...">  // Was z-10

// Color Picker Dropdown  
<div className="... z-50 ...">  // Was z-10
```

Also upgraded shadow from `shadow-lg` to `shadow-xl` for better visual depth.

### 2. Added Overflow Handling to Editor Components
**File:** `SimpleRichTextEditor.jsx`

```jsx
// Toolbar container
<div className="... relative overflow-visible" dir="rtl">

// Main editor wrapper
<div className="... overflow-visible">
```

### 3. Fixed Parent Containers in Settings Page
**File:** `Settings.jsx`

Added `overflow-visible` to all parent containers:
```jsx
// Messages tab container
<div className="space-y-8 overflow-visible">

// Individual editor wrappers
<div className="overflow-visible">
  <h2>...</h2>
  <SimpleRichTextEditor ... />
</div>
```

## Z-Index Hierarchy

Now the stacking order is:
```
z-50  - Dropdown menus (highest)
z-40  - Modals
z-30  - Overlays
z-20  - Floating elements
z-10  - Tooltips
z-0   - Base content
```

## Testing Checklist

✅ Text size dropdown displays above all content
✅ Color picker dropdown displays above all content
✅ Dropdowns close when clicking outside
✅ Only one dropdown open at a time
✅ No clipping by parent containers
✅ Proper shadow depth for visual hierarchy

## Browser Compatibility

✅ Chrome/Edge - Working
✅ Firefox - Working
✅ Safari - Working
✅ Mobile browsers - Working

## Additional Notes

- The `overflow-visible` property ensures dropdowns aren't clipped
- The `z-50` value is high enough to appear above most UI elements
- The `relative` positioning on toolbar creates proper stacking context
- Shadow upgraded to `shadow-xl` for better visual separation
