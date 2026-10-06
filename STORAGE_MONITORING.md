# Supabase Storage Monitoring System

## Overview

A professional storage monitoring and warning system integrated into the Admin Panel's Settings page. This system allows admin users to monitor Supabase Free Plan storage usage without exposing service role keys.

## Features

### 1. Storage Dashboard
- **Total Storage**: Shows the 10GB free tier limit
- **Used Storage**: Current storage usage
- **Available Storage**: Remaining space
- **Usage Percentage**: Visual progress bar with color-coded warnings
- **Total Files**: Count of all files across buckets

### 2. Bucket Breakdown
- Per-bucket usage statistics
- File count per bucket
- Public/Private bucket indicators
- Percentage contribution to total storage

### 3. Automatic Warnings
The system creates notifications at these thresholds:
- **70%**: Warning - Consider cleaning up files
- **80%**: Warning - Delete files immediately
- **90%**: Critical - Service disruption imminent
- **95%**: Critical - Service will fail soon
- **100%**: Emergency - Service cannot function

### 4. File Management
- **View Largest Files**: Shows top 20 largest files
- **File Details**: View complete file metadata
- **Delete Files**: Safe deletion with confirmation dialog
- **Refresh Usage**: Manual refresh capability

## Security Architecture

### Backend Security (No Service Role Keys)
- Uses **database functions** with `SECURITY DEFINER` privilege
- Functions run with elevated permissions but can only be called by authenticated users
- No service role keys exposed to the client
- Supabase Auth validates user identity before function execution

### Database Functions

#### `get_storage_usage()`
Returns storage statistics including:
- Total bytes (10GB free tier limit)
- Used bytes
- Available bytes
- Usage percentage
- Total file count
- Per-bucket breakdown

#### `get_largest_files(limit_count)`
Returns the largest files sorted by size:
- File metadata (name, size, created date, etc.)
- Bucket information
- Owner information

#### `delete_storage_file(file_id, bucket_id)`
Safely deletes a file from storage:
- Validates file existence
- Performs deletion
- Returns success/error message

#### `create_storage_warning_notification(usage_percentage)`
Creates notification based on threshold:
- Checks for duplicate notifications (1-hour cooldown)
- Creates appropriate notification message
- Integrates with existing notification system

### Authentication
- Functions use `GRANT EXECUTE TO authenticated`
- Admin panel already restricts access to admin users only
- No direct database access from client

## Integration with Admin Panel

### Settings Page
- Added third tab: "Storage Management"
- Tabbed interface for: Business Information | Admin Users | Storage Management
- Uses existing admin layout and styling

### Notification System
- Storage warnings appear in the notification center
- Icon indicator shows unread notifications
- Warnings integrate seamlessly with existing notification types

## How to Use

### Access Storage Management
1. Navigate to Admin Panel
2. Go to Settings
3. Click "Storage Management" tab

### Monitor Storage
- View overall usage statistics
- Check bucket breakdown
- Review warning banners if usage is high

### Manage Files
1. Click "View Largest Files"
2. Review file list with sizes
3. Click eye icon to view file details
4. Click trash icon to delete (with confirmation)

### Refresh Data
- Click "Refresh" button to reload storage data
- Automatic notification creation when thresholds reached

## Database Migration

Run the migration to enable storage monitoring:

```bash
supabase db push
```

Or apply manually via Supabase Dashboard:
- Open SQL Editor
- Run: `supabase/migrations/20261006084501_add_storage_monitoring.sql`

## Technical Details

### Storage Limit
- Free Tier: 10GB (10,737,418,240 bytes)
- Hardcoded in database function
- Can be updated for paid plans

### File Size Calculation
- Uses Supabase `storage.objects` table
- `size` and `size_bytes` columns provide accurate measurements
- Aggregated per bucket and total

### Bucket Access
- Reads from `storage.buckets` and `storage.objects`
- Shows public/private status
- Groups by bucket for breakdown

### Notification Deduplication
- Checks for existing notifications in last hour
- Prevents spam warnings
- One notification per threshold per hour

## Design Consistency

- Matches existing admin panel styling
- Uses Tailwind CSS classes
- Responsive design (mobile-friendly)
- Icons from Lucide React
- Color-coded warnings (green → yellow → orange → red)
- Same card layout as other admin pages

## Files Added/Modified

### New Files
- `supabase/migrations/20261006084501_add_storage_monitoring.sql` - Database functions
- `src/components/admin/StorageManagement.tsx` - Storage management component

### Modified Files
- `src/lib/types.ts` - Added StorageUsage, BucketUsage, StorageFile interfaces
- `src/components/admin/AdminSettings.tsx` - Added storage management tab

## Future Enhancements

Potential improvements:
- Scheduled automatic storage checks (via cron job)
- File type breakdown (images, documents, etc.)
- Storage trend charts over time
- Automated cleanup of old files
- Compression suggestions
- Upload size limits per bucket
- Storage usage predictions
- Email alerts for critical warnings

## Troubleshooting

### Permission Errors
If you see permission errors:
1. Ensure migration was applied
2. Check user is authenticated
3. Verify user is in admin_users table

### No Data Showing
If storage data doesn't load:
1. Check Supabase connection
2. Verify storage buckets exist
3. Check browser console for errors

### Notifications Not Creating
If warnings don't create notifications:
1. Check notifications table exists
2. Verify usage percentage calculation
3. Check 1-hour cooldown period
