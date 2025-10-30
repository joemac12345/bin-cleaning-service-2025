# Waitlist Feature Documentation

## Overview
Dark-themed mobile-friendly admin panel for viewing and managing service expansion leads from the waitlist.

## Features

### User-Facing Waitlist Page (`/waitlist`)
- **Professional Design**: Clean blue and gray corporate design
- **Form Submission**: Captures name, email, and postcode
- **Real-time Validation**: Client-side form validation
- **Database Integration**: Saves entries to Supabase `waitlist` table
- **Success State**: Confirmation screen after submission

### Admin Waitlist Viewer (`/admin/waitlist`)
- **Dark Theme**: Zinc-950 background for comfortable viewing
- **Mobile-Optimized**: Touch-friendly cards with smooth interactions
- **Real-time Stats**: Total, Pending, Contacted, Converted counts
- **Search Functionality**: Filter by name, email, or postcode
- **Bottom Filter Menu**: Quick status filtering (All, Pending, Contacted, Converted)
- **Detail Modal**: Full entry information with action buttons
- **Status Indicators**: Color-coded status badges and dots

## Database Schema

### Table: `waitlist`
```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  entry_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  postcode TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Status Values
- `pending` - New entry, not yet contacted
- `contacted` - Follow-up email sent
- `converted` - Successfully converted to customer

## API Endpoints

### GET `/api/waitlist`
Fetches all waitlist entries with statistics.

**Response:**
```json
{
  "success": true,
  "entries": [
    {
      "id": 1,
      "entry_id": "WL-1234567890-abc123",
      "name": "John Smith",
      "email": "john@example.com",
      "postcode": "DE1 1BG",
      "status": "pending",
      "notes": null,
      "created_at": "2025-10-30T12:00:00Z"
    }
  ],
  "stats": {
    "total": 1,
    "pending": 1,
    "contacted": 0,
    "converted": 0
  }
}
```

### POST `/api/waitlist`
Creates a new waitlist entry.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "postcode": "DE1 1BG"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Waitlist entry saved successfully",
  "entryId": "WL-1234567890-abc123"
}
```

### PATCH `/api/waitlist`
Updates a waitlist entry's status or notes.

**Request Body:**
```json
{
  "entryId": "WL-1234567890-abc123",
  "status": "contacted",
  "notes": "Follow-up email sent"
}
```

### DELETE `/api/waitlist?entryId=WL-1234567890-abc123`
Deletes a waitlist entry.

## Design System

### Colors
- **Background**: `bg-zinc-950` (main), `bg-zinc-900` (cards), `bg-zinc-800` (inputs)
- **Text**: `text-white` (primary), `text-zinc-400` (secondary), `text-zinc-500` (muted)
- **Status Colors**:
  - Pending: `text-yellow-500`, `bg-yellow-500`
  - Contacted: `text-blue-500`, `bg-blue-500`
  - Converted: `text-green-500`, `bg-green-500`

### Layout
- **Mobile-First**: Optimized for touch interactions
- **Fixed Bottom Menu**: Always accessible filter controls
- **Card-Based**: Each entry displayed as an interactive card
- **Modal Details**: Full-screen overlay for entry details

### Typography
- **Headers**: `text-xl font-semibold` for page titles
- **Card Titles**: `font-semibold text-white` for entry names
- **Meta Info**: `text-sm text-zinc-400` for timestamps
- **Labels**: `text-xs text-zinc-500 uppercase tracking-wider`

## User Flow

1. **Customer Journey**:
   - Customer enters postcode on home page
   - If postcode not serviced → redirected to `/waitlist?postcode=XX1 1XX`
   - Customer fills in name and email
   - Submission saves to database with status `pending`
   - Success screen confirms registration

2. **Admin Management**:
   - Navigate to `/admin/waitlist`
   - View all entries with live stats
   - Search or filter by status
   - Click entry to view full details
   - Click "Send Email" to contact customer
   - (Future) Update status to track progress

## Integration Points

### Navigation
- Added to admin dashboard (`/admin`) as "Waitlist Viewer" card
- Cyan color theme (matches other admin tools)
- Back button returns to admin dashboard

### Database Setup
- Table creation included in `/api/setup-database`
- Automatically creates `waitlist` table with policies
- Row-level security enabled

### Form Tracking
- Integrates with existing postcode checker flow
- Automatic postcode pre-fill from query params
- Consistent error handling and validation

## Mobile Optimization

### Touch Targets
- Minimum 44px touch targets for buttons
- 48px height for bottom menu items
- Large clickable card areas

### Responsive Design
- Single column layout for mobile
- Grid stats adjust to screen width
- Modal slides up from bottom on mobile
- Safe area insets for notched devices

### Performance
- Lazy loading with React Suspense
- Optimized re-renders with proper state management
- Minimal API calls (only on mount and refresh)

## Future Enhancements

### Potential Features
- [ ] Bulk email sending to filtered entries
- [ ] Export to CSV functionality
- [ ] Email templates for follow-ups
- [ ] Auto-notification when service area expands
- [ ] Analytics dashboard (conversion rates, time to contact)
- [ ] In-app status updates (no need to leave page)
- [ ] Notes editing capability
- [ ] Entry deletion with confirmation
- [ ] Sorting options (date, postcode, name)
- [ ] Pagination for large datasets

### Integration Opportunities
- Email service integration (Gmail API)
- CRM sync (Salesforce, HubSpot)
- Marketing automation (Mailchimp)
- Geographic clustering (identify high-demand areas)

## Testing

### Manual Testing Checklist
- [ ] Submit waitlist form with valid data
- [ ] Verify entry appears in admin panel
- [ ] Test search functionality
- [ ] Test each status filter
- [ ] Click entry to open detail modal
- [ ] Test email link functionality
- [ ] Verify responsive design on mobile
- [ ] Check dark theme consistency
- [ ] Test with no entries (empty state)
- [ ] Test with many entries (scrolling)

### API Testing
```bash
# Create entry
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","postcode":"DE1 1BG"}'

# Fetch entries
curl http://localhost:3000/api/waitlist

# Update status
curl -X PATCH http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"entryId":"WL-xxx","status":"contacted"}'
```

## Troubleshooting

### Common Issues

**Entries not appearing:**
- Check Supabase connection (verify .env.local)
- Run database setup: `/admin/supabase-setup`
- Check browser console for API errors

**Search not working:**
- Ensure search term is at least 2 characters
- Check for case sensitivity (search is case-insensitive)
- Verify data format in database

**Modal not opening:**
- Check for JavaScript errors in console
- Verify z-index layering
- Test click event propagation

**Bottom menu not visible:**
- Check `pb-20` class on content container
- Verify `fixed bottom-0` on menu
- Test safe area insets on notched devices

## Deployment Notes

### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Migration
Run `/api/setup-database` endpoint or execute SQL manually in Supabase dashboard.

### Performance Considerations
- Implement pagination if entries exceed 100
- Add database indexes on `status` and `created_at`
- Consider caching stats for high-traffic sites

---

**Version**: 1.0.0  
**Last Updated**: October 30, 2025  
**Author**: GitHub Copilot
