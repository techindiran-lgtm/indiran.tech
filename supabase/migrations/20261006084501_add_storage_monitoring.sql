-- Enable storage monitoring functions
-- This migration allows admin users to check storage usage without service role keys
-- Protected by database function security - only authenticated users can call it

-- Create function to get storage usage statistics
CREATE OR REPLACE FUNCTION get_storage_usage()
RETURNS TABLE (
  total_bytes BIGINT,
  used_bytes BIGINT,
  available_bytes BIGINT,
  usage_percentage NUMERIC,
  total_files BIGINT,
  bucket_id TEXT,
  bucket_name TEXT,
  public BOOLEAN,
  bucket_size_bytes BIGINT,
  bucket_file_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH storage_info AS (
    SELECT 
      10737418240 as total_limit_bytes -- 10GB free tier limit
  ),
  bucket_usage AS (
    SELECT 
      o.bucket_id,
      b.id as bucket_db_id,
      b.name as bucket_name,
      b.public,
      COALESCE(SUM(o.size_bytes), 0) as bucket_size_bytes,
      COUNT(*) as bucket_file_count
    FROM storage.objects o
    JOIN storage.buckets b ON o.bucket_id = b.id
    GROUP BY o.bucket_id, b.id, b.name, b.public
  )
  SELECT 
    si.total_limit_bytes as total_bytes,
    COALESCE(SUM(bu.bucket_size_bytes), 0) as used_bytes,
    si.total_limit_bytes - COALESCE(SUM(bu.bucket_size_bytes), 0) as available_bytes,
    CASE 
      WHEN si.total_limit_bytes > 0 
      THEN ROUND((COALESCE(SUM(bu.bucket_size_bytes), 0)::numeric / si.total_limit_bytes::numeric) * 100, 2)
      ELSE 0 
    END as usage_percentage,
    COALESCE(SUM(bu.bucket_file_count), 0) as total_files,
    bu.bucket_id,
    bu.bucket_name,
    bu.public,
    bu.bucket_size_bytes,
    bu.bucket_file_count
  FROM storage_info si
  CROSS JOIN bucket_usage bu
  GROUP BY si.total_limit_bytes, bu.bucket_id, bu.bucket_name, bu.public, bu.bucket_size_bytes, bu.bucket_file_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_storage_usage TO authenticated;

-- Create function to get largest files in storage
CREATE OR REPLACE FUNCTION get_largest_files(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  bucket_id TEXT,
  bucket_name TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  owner TEXT,
  path TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.bucket_id,
    b.name as bucket_name,
    o.size_bytes,
    o.created_at,
    o.last_accessed_at,
    o.owner,
    o.path
  FROM storage.objects o
  JOIN storage.buckets b ON o.bucket_id = b.id
  ORDER BY o.size_bytes DESC
  LIMIT limit_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_largest_files TO authenticated;

-- Create function to delete a file from storage
CREATE OR REPLACE FUNCTION delete_storage_file(file_id TEXT, bucket_id TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result TEXT;
BEGIN
  -- Check if file exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.objects 
    WHERE id = file_id AND bucket_id = bucket_id
  ) THEN
    RETURN 'File not found';
  END IF;
  
  -- Delete the file
  DELETE FROM storage.objects 
  WHERE id = file_id AND bucket_id = bucket_id;
  
  RETURN 'File deleted successfully';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_storage_file TO authenticated;

-- Create a notification function for storage warnings
-- This should be called manually from the admin panel or via a scheduled job
CREATE OR REPLACE FUNCTION create_storage_warning_notification(usage_percentage NUMERIC)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Check if a notification already exists for this threshold
  IF EXISTS (
    SELECT 1 FROM notifications 
    WHERE type = 'storage_warning' 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) THEN
    RETURN 'Notification already exists';
  END IF;
  
  -- Create appropriate notification based on threshold
  IF usage_percentage >= 70 AND usage_percentage < 80 THEN
    notification_title := 'Storage Warning: 70% Used';
    notification_message := 'Your Supabase storage usage has reached ' || usage_percentage || '%. Consider cleaning up unnecessary files to avoid running out of space.';
  ELSIF usage_percentage >= 80 AND usage_percentage < 90 THEN
    notification_title := 'Storage Warning: 80% Used';
    notification_message := 'Your Supabase storage usage has reached ' || usage_percentage || '%. Please delete unnecessary files immediately to avoid service disruption.';
  ELSIF usage_percentage >= 90 AND usage_percentage < 95 THEN
    notification_title := 'Storage Critical: 90% Used';
    notification_message := 'CRITICAL: Your Supabase storage usage has reached ' || usage_percentage || '%. Service disruption is imminent. Delete files immediately.';
  ELSIF usage_percentage >= 95 AND usage_percentage < 100 THEN
    notification_title := 'Storage Critical: 95% Used';
    notification_message := 'CRITICAL: Your Supabase storage usage has reached ' || usage_percentage || '%. Service will fail soon. Delete files immediately!';
  ELSIF usage_percentage >= 100 THEN
    notification_title := 'Storage Full: 100% Used';
    notification_message := 'EMERGENCY: Your Supabase storage is full. Service cannot function. Delete files immediately!';
  ELSE
    RETURN 'Usage below warning threshold';
  END IF;
  
  -- Insert notification
  INSERT INTO notifications (type, title, message, related_id, related_type, is_read)
  VALUES ('storage_warning', notification_title, notification_message, NULL, 'storage', false);
  
  RETURN 'Notification created successfully';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_storage_warning_notification TO authenticated;
