# File Audit & Cleanup Report

## 🗑️ Files/Folders to Remove

### 1. Old Abandoned Forms Analytics Page
**Path:** `/src/app/admin/abandoned-forms-analytics/`
**Reason:** Replaced by new `/admin/abandoned-forms` with contact tracking
**Status:** ✅ WILL BE DELETED

### 2. Unused Component: AbandonedFormCard
**Path:** `/src/components/AbandonedFormCard.tsx`
**Reason:** Only used by old analytics page, not needed in new system
**Status:** ✅ WILL BE DELETED

### 3. Unused Component: AbandonedFormsBottomMenu
**Path:** `/src/components/AbandonedFormsBottomMenu.tsx`
**Reason:** Not imported anywhere, orphaned component
**Status:** ✅ WILL BE DELETED

### 4. Unused Component: FormsManagementBottomMenu
**Path:** `/src/components/FormsManagementBottomMenu.tsx`
**Reason:** Not imported anywhere, orphaned component
**Status:** ✅ WILL BE DELETED

## ✅ Files to Keep

### Keep: AnalyticsBottomMenu
**Path:** `/src/components/AnalyticsBottomMenu.tsx`
**Reason:** Used by InvalidPostcodeAnalytics component (active feature)
**Usage:** `src/components/postcode-manager/InvalidPostcodeAnalytics.tsx`

### Keep: data/abandoned-forms.json
**Path:** `/data/abandoned-forms.json`
**Reason:** May still be used as fallback or legacy data
**Note:** Now using Supabase, but keeping for safety

### Keep: All Other Components
- BookingBottomMenu.tsx ✅ (Used by bookings)
- PostcodeBottomMenu.tsx ✅ (Used by postcode manager)
- BookingForm.tsx ✅ (Core booking flow)
- SendEmailModal.tsx ✅ (Email system)
- All navigation components ✅
- All UI components ✅

## Summary

**Total Files to Remove:** 4
**Total Folders to Remove:** 1
**Space Saved:** ~15KB of code

**Impact:**
- No breaking changes (all removed files are unused)
- Clean up reduces codebase confusion
- New contact tracking system is standalone
