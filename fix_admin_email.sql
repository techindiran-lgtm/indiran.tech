-- Update admin_users to match the actual email you created
UPDATE admin_users 
SET email = 'admin@indirantech.com' 
WHERE email = 'admin@idirantech.com';

-- Or insert if it doesn't exist
INSERT INTO admin_users (email)
VALUES ('admin@indirantech.com')
ON CONFLICT (email) DO NOTHING;
