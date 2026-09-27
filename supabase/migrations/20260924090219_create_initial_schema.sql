/*
# AAR Document Office - Initial Database Schema

## Overview
Creates the complete database schema for AAR (AAR பத்திரம் எழுதும் அலுவலகம்),
a document registration office located in Panagudi (பனகுடி).

## New Tables

1. **admin_users** - Authorized admin email addresses
   - Only users whose email is in this table can access admin data
   - Seeded with default admin email "admin@aaroffice.com"

2. **settings** - Business configuration (name, contact info, office hours, about)
   - Single-row table storing business information displayed on the public website
   - Public can read; admin can update

3. **customers** - Customer records
   - Stores customer name, phone, email, and address
   - Auto-created via find_or_create_customer() RPC when submitting requests
   - Public can insert; admin can read/update/delete

4. **service_requests** - Service request submissions
   - Links to customer; stores service type, status, and form data as JSONB
   - Service types: document_registration, marriage_registration, ec_request,
     document_copy, birth_death_certificate, patta_chitta
   - Status workflow: pending -> in_review -> processing -> completed/rejected
   - Public can insert; admin can read/update/delete

5. **ec_requests** - EC (Encumbrance Certificate) request tracking
   - Links to service_requests; stores property details (district, taluk, village,
     survey number, subdivision number, EC period)
   - Admin uploads the EC certificate URL after manual processing
   - Public can insert; admin can read/update

6. **appointments** - Appointment bookings
   - Links to customer; stores preferred date/time and service type
   - Status workflow: pending -> confirmed -> rescheduled/completed/cancelled
   - Public can insert; admin can read/update/delete

7. **documents** - Uploaded document files
   - Links to customer and optionally to service_request
   - Stores file name, URL, type, and document category
   - Public can insert; admin can read/delete

8. **payments** - Payment tracking
   - Links to customer and optionally to service_request
   - Amount, payment status, method, transaction ID
   - Admin only: full CRUD

9. **notifications** - Admin notification feed
   - Auto-created via triggers when new requests/appointments/documents arrive
   - Type, title, message, related entity reference, read status
   - Admin only: full CRUD

## Functions

1. **is_admin()** - SECURITY DEFINER; checks if current user's email is in admin_users
2. **find_or_create_customer()** - SECURITY DEFINER; finds or creates customer by phone
3. **update_updated_at_column()** - Auto-updates updated_at on row change
4. **notify_new_service_request()** - Creates notification on new service request
5. **notify_new_appointment()** - Creates notification on new appointment
6. **notify_new_document()** - Creates notification on new document upload

## Storage
- Creates 'documents' bucket for file uploads (public bucket)
- Public can upload and read; admin can delete/update

## Security (RLS)
- All tables have RLS enabled
- Public (anon) can:
  - SELECT settings (display business info on website)
  - INSERT into customers, service_requests, ec_requests, appointments, documents
- Authenticated admins (email in admin_users) can:
  - Full CRUD on all tables
- Payments and notifications are admin-only (no public access)

## Important Notes
1. The settings table is seeded with real business data from the reference image
2. Admin access requires Supabase authentication (email/password) + email in admin_users
3. The admin panel is at a separate route from the public website
4. File uploads go to Supabase Storage 'documents' bucket
5. Default admin email is admin@aaroffice.com - sign up with this email first
*/

-- ==========================================
-- 1. Tables
-- ==========================================

-- Admin users (authorized admin emails)
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Business settings
CREATE TABLE IF NOT EXISTS settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name text NOT NULL DEFAULT 'IDIRAN TECH',
    tamil_name text NOT NULL DEFAULT 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம்',
    address text NOT NULL DEFAULT 'கங்கைகொண்டான் சார்பதிவாளர் அலுவலகம் நேரில், திருநெல்வேலி - 627352
    phone text DEFAULT '',
    whatsapp text DEFAULT '',
    email text DEFAULT '',
    office_hours text DEFAULT 'Monday - Saturday: 9:00 AM - 6:00 PM',
    about text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    phone text NOT NULL,
    email text,
    address text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_type text NOT NULL CHECK (
        service_type IN ('document_registration', 'marriage_registration',
        'ec_request', 'document_copy', 'birth_death_certificate', 'patta_chitta')
    ),
    status text NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'in_review', 'processing', 'completed', 'rejected')
    ),
    form_data jsonb DEFAULT '{}',
    admin_notes text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- EC Requests (Encumbrance Certificate)
CREATE TABLE IF NOT EXISTS ec_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_request_id uuid NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
    district text NOT NULL,
    taluk text NOT NULL,
    village text NOT NULL,
    survey_number text NOT NULL,
    subdivision_number text DEFAULT '',
    ec_period_from date NOT NULL,
    ec_period_to date NOT NULL,
    ec_certificate_url text DEFAULT '',
    status text NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'processing', 'completed', 'rejected')
    ),
    admin_notes text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_type text NOT NULL CHECK (
        service_type IN ('document_registration', 'marriage_registration',
        'ec_request', 'document_copy', 'birth_death_certificate', 'patta_chitta')
    ),
    preferred_date date NOT NULL,
    preferred_time text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled')
    ),
    notes text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
    service_request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_type text DEFAULT '',
    document_type text DEFAULT '',
    file_size bigint DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
    service_request_id uuid REFERENCES service_requests(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL DEFAULT 0,
    payment_status text NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'refunded', 'failed')
    ),
    payment_method text DEFAULT '',
    transaction_id text DEFAULT '',
    notes text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    related_id uuid,
    related_type text DEFAULT '',
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 2. Enable RLS
-- ==========================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. Functions
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.email = auth.jwt() ->> 'email'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Find or create a customer by phone number
CREATE OR REPLACE FUNCTION find_or_create_customer(
    p_name text,
    p_phone text,
    p_email text DEFAULT NULL,
    p_address text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    v_customer_id uuid;
BEGIN
    SELECT id INTO v_customer_id FROM customers WHERE phone = p_phone LIMIT 1;
    IF v_customer_id IS NULL THEN
        INSERT INTO customers (name, phone, email, address)
        VALUES (p_name, p_phone, p_email, p_address)
        RETURNING id INTO v_customer_id;
    END IF;
    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Notification trigger functions (SECURITY DEFINER to bypass RLS on notifications)
CREATE OR REPLACE FUNCTION notify_new_service_request()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES ('new_request', 'New Service Request',
        CONCAT('A new ', NEW.service_type, ' request has been submitted'),
        NEW.id, 'service_request');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_new_appointment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES ('new_appointment', 'New Appointment',
        CONCAT('New appointment for ', NEW.service_type, ' on ', NEW.preferred_date::text, ' at ', NEW.preferred_time),
        NEW.id, 'appointment');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_new_document()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES ('new_document', 'New Document Uploaded',
        CONCAT('Document "', NEW.file_name, '" has been uploaded'),
        NEW.id, 'document');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- 4. Policies
-- ==========================================

-- Admin Users
DROP POLICY IF EXISTS "admin_select_admin_users" ON admin_users;
CREATE POLICY "admin_select_admin_users" ON admin_users FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_admin_users" ON admin_users;
CREATE POLICY "admin_insert_admin_users" ON admin_users FOR INSERT
    TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_admin_users" ON admin_users;
CREATE POLICY "admin_delete_admin_users" ON admin_users FOR DELETE
    TO authenticated USING (is_admin());

-- Settings
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Customers
DROP POLICY IF EXISTS "public_insert_customers" ON customers;
CREATE POLICY "public_insert_customers" ON customers FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_customers" ON customers;
CREATE POLICY "admin_select_customers" ON customers FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_customers" ON customers;
CREATE POLICY "admin_update_customers" ON customers FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_customers" ON customers;
CREATE POLICY "admin_delete_customers" ON customers FOR DELETE
    TO authenticated USING (is_admin());

-- Service Requests
DROP POLICY IF EXISTS "public_insert_service_requests" ON service_requests;
CREATE POLICY "public_insert_service_requests" ON service_requests FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_service_requests" ON service_requests;
CREATE POLICY "admin_select_service_requests" ON service_requests FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_service_requests" ON service_requests;
CREATE POLICY "admin_update_service_requests" ON service_requests FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_service_requests" ON service_requests;
CREATE POLICY "admin_delete_service_requests" ON service_requests FOR DELETE
    TO authenticated USING (is_admin());

-- EC Requests
DROP POLICY IF EXISTS "public_insert_ec_requests" ON ec_requests;
CREATE POLICY "public_insert_ec_requests" ON ec_requests FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_ec_requests" ON ec_requests;
CREATE POLICY "admin_select_ec_requests" ON ec_requests FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_ec_requests" ON ec_requests;
CREATE POLICY "admin_update_ec_requests" ON ec_requests FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_ec_requests" ON ec_requests;
CREATE POLICY "admin_delete_ec_requests" ON ec_requests FOR DELETE
    TO authenticated USING (is_admin());

-- Appointments
DROP POLICY IF EXISTS "public_insert_appointments" ON appointments;
CREATE POLICY "public_insert_appointments" ON appointments FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_appointments" ON appointments;
CREATE POLICY "admin_select_appointments" ON appointments FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_appointments" ON appointments;
CREATE POLICY "admin_update_appointments" ON appointments FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_appointments" ON appointments;
CREATE POLICY "admin_delete_appointments" ON appointments FOR DELETE
    TO authenticated USING (is_admin());

-- Documents
DROP POLICY IF EXISTS "public_insert_documents" ON documents;
CREATE POLICY "public_insert_documents" ON documents FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_documents" ON documents;
CREATE POLICY "admin_select_documents" ON documents FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_delete_documents" ON documents;
CREATE POLICY "admin_delete_documents" ON documents FOR DELETE
    TO authenticated USING (is_admin());

-- Payments (admin only)
DROP POLICY IF EXISTS "admin_select_payments" ON payments;
CREATE POLICY "admin_select_payments" ON payments FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_payments" ON payments;
CREATE POLICY "admin_insert_payments" ON payments FOR INSERT
    TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_payments" ON payments;
CREATE POLICY "admin_update_payments" ON payments FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_payments" ON payments;
CREATE POLICY "admin_delete_payments" ON payments FOR DELETE
    TO authenticated USING (is_admin());

-- Notifications (admin only)
DROP POLICY IF EXISTS "admin_select_notifications" ON notifications;
CREATE POLICY "admin_select_notifications" ON notifications FOR SELECT
    TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_notifications" ON notifications;
CREATE POLICY "admin_update_notifications" ON notifications FOR UPDATE
    TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_notifications" ON notifications;
CREATE POLICY "admin_delete_notifications" ON notifications FOR DELETE
    TO authenticated USING (is_admin());

-- ==========================================
-- 5. Triggers
-- ==========================================

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ec_requests_updated_at ON ec_requests;
CREATE TRIGGER update_ec_requests_updated_at BEFORE UPDATE ON ec_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_service_request_insert ON service_requests;
CREATE TRIGGER on_service_request_insert
    AFTER INSERT ON service_requests
    FOR EACH ROW EXECUTE FUNCTION notify_new_service_request();

DROP TRIGGER IF EXISTS on_appointment_insert ON appointments;
CREATE TRIGGER on_appointment_insert
    AFTER INSERT ON appointments
    FOR EACH ROW EXECUTE FUNCTION notify_new_appointment();

DROP TRIGGER IF EXISTS on_document_insert ON documents;
CREATE TRIGGER on_document_insert
    AFTER INSERT ON documents
    FOR EACH ROW EXECUTE FUNCTION notify_new_document();

-- ==========================================
-- 6. Grants
-- ==========================================

GRANT EXECUTE ON FUNCTION find_or_create_customer TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ==========================================
-- 7. Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_service_requests_customer ON service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_type ON service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_ec_requests_service_request ON ec_requests(service_request_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_documents_customer ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_service_request ON documents(service_request_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_service_request ON payments(service_request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ==========================================
-- 8. Storage Bucket
-- ==========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_upload_documents" ON storage.objects;
CREATE POLICY "public_upload_documents" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "public_read_documents" ON storage.objects;
CREATE POLICY "public_read_documents" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "admin_delete_documents_storage" ON storage.objects;
CREATE POLICY "admin_delete_documents_storage" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'documents' AND is_admin());

DROP POLICY IF EXISTS "admin_update_documents_storage" ON storage.objects;
CREATE POLICY "admin_update_documents_storage" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'documents' AND is_admin())
    WITH CHECK (bucket_id = 'documents' AND is_admin());

-- ==========================================
-- 9. Seed Data
-- ==========================================

INSERT INTO admin_users (email)
VALUES ('admin@idirantech.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO settings (id, business_name, tamil_name, address, location, phone, whatsapp, email, office_hours, about)
SELECT gen_random_uuid(), 'IDIRAN TECH', 'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம்',
    'கங்கைகொண்டான் சார்பதிவாளர் அலுவலகம் நேரில், திருநெல்வேலி  - 627352',
    'கங்கைகொண்டான்', '', '', '',
    'Monday - Saturday: 9:00 AM - 6:00 PM',
    'IDIRAN TECH பத்திரம் எழுதும் அலுவலகம் is a trusted document registration office in Gangaikondan, offering document registration, marriage registration, EC certificates, document copies, birth/death certificates, and patta/chitta services.'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);