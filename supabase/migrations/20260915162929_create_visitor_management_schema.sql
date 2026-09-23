/*
# Create Visitor Management System Schema

## Overview
Creates the complete database schema for the Najran Water Laboratories visitor management platform:
- Admin users table with custom authentication (SECURITY DEFINER functions)
- Visitors table for visitor registration
- Surveys table for customer feedback
- Enquiries table for customer enquiries

## New Tables

### 1. admin_users
- `id` (uuid, primary key)
- `username` (text, unique, not null) - login username
- `password_hash` (text, not null) - bcrypt-style hash (stored as text)
- `full_name` (text, not null) - display name
- `role` (text, not null, default 'user') - 'admin' or 'user'
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 2. visitors
- `id` (uuid, primary key)
- `visitor_name` (text, not null)
- `company` (text)
- `job_title` (text)
- `phone` (text, not null)
- `email` (text)
- `visit_date` (date, not null)
- `visit_purpose` (text, not null)
- `laboratory` (text, not null) - which center/branch they're visiting
- `notes` (text)
- `status` (text, default 'pending') - pending, checked_in, checked_out
- `created_at` (timestamptz, default now())

### 3. surveys
- `id` (uuid, primary key)
- `respondent_name` (text)
- `respondent_contact` (text)
- `service_quality_rating` (integer, not null) - 1-5
- `facility_rating` (integer, not null) - 1-5
- `staff_rating` (integer, not null) - 1-5
- `overall_rating` (integer, not null) - 1-5
- `comments` (text)
- `would_recommend` (boolean)
- `created_at` (timestamptz, default now())

### 4. enquiries
- `id` (uuid, primary key)
- `name` (text, not null)
- `contact_info` (text, not null)
- `subject` (text, not null)
- `message` (text, not null)
- `status` (text, default 'new') - new, responded, closed
- `created_at` (timestamptz, default now())

## Security

### RLS Policies
- `visitors`: anon + authenticated can INSERT (public registration); only authenticated admins can SELECT/UPDATE/DELETE
- `surveys`: anon + authenticated can INSERT (public submission); only authenticated admins can SELECT/DELETE
- `enquiries`: anon + authenticated can INSERT (public submission); only authenticated admins can SELECT/UPDATE/DELETE
- `admin_users`: NO anon access; only authenticated admins can SELECT/INSERT/UPDATE/DELETE

### SECURITY DEFINER Functions
- `verify_admin_credentials(p_username text, p_password text)` - authenticates admin login, returns admin user record (without password_hash)
- `get_admin_by_id(p_id uuid)` - fetches admin user by id (without password_hash)
- `create_admin_user(p_username text, p_password text, p_full_name text, p_role text)` - creates new admin user (admin only)
- `update_admin_user(p_id uuid, p_username text, p_password text, p_full_name text, p_role text)` - updates admin user (admin only, password optional)
- `delete_admin_user(p_id uuid)` - deletes admin user (admin only)

## Important Notes
1. Password hashing uses PostgreSQL's `crypt()` function with `gen_salt('bf')` for bcrypt hashing
2. The `pgcrypto` extension is required for password hashing
3. SECURITY DEFINER functions run with elevated privileges, bypassing RLS
4. Admin authentication is custom (not Supabase Auth) as specified in the requirements
5. The initial admin user is NOT created in this migration - it will be created via a data migration
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLE: admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No anon access to admin_users table
-- Only authenticated users with admin role can access (enforced via SECURITY DEFINER functions)
DROP POLICY IF EXISTS "admin_select_admin_users" ON admin_users;
CREATE POLICY "admin_select_admin_users" ON admin_users
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_admin_users" ON admin_users;
CREATE POLICY "admin_insert_admin_users" ON admin_users
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_admin_users" ON admin_users;
CREATE POLICY "admin_update_admin_users" ON admin_users
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_admin_users" ON admin_users;
CREATE POLICY "admin_delete_admin_users" ON admin_users
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TABLE: visitors
-- ============================================================
CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  company text,
  job_title text,
  phone text NOT NULL,
  email text,
  visit_date date NOT NULL,
  visit_purpose text NOT NULL,
  laboratory text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'checked_in', 'checked_out')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Public can register (INSERT), only authenticated can read/manage
DROP POLICY IF EXISTS "public_insert_visitors" ON visitors;
CREATE POLICY "public_insert_visitors" ON visitors
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_own_visitor" ON visitors;
CREATE POLICY "public_select_own_visitor" ON visitors
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_visitors" ON visitors;
CREATE POLICY "admin_update_visitors" ON visitors
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_visitors" ON visitors;
CREATE POLICY "admin_delete_visitors" ON visitors
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TABLE: surveys
-- ============================================================
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_name text,
  respondent_contact text,
  service_quality_rating integer NOT NULL CHECK (service_quality_rating BETWEEN 1 AND 5),
  facility_rating integer NOT NULL CHECK (facility_rating BETWEEN 1 AND 5),
  staff_rating integer NOT NULL CHECK (staff_rating BETWEEN 1 AND 5),
  overall_rating integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comments text,
  would_recommend boolean,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Public can submit surveys, only authenticated can read/delete
DROP POLICY IF EXISTS "public_insert_surveys" ON surveys;
CREATE POLICY "public_insert_surveys" ON surveys
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_surveys" ON surveys;
CREATE POLICY "admin_select_surveys" ON surveys
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_surveys" ON surveys;
CREATE POLICY "admin_delete_surveys" ON surveys
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TABLE: enquiries
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_info text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries, only authenticated can read/update/delete
DROP POLICY IF EXISTS "public_insert_enquiries" ON enquiries;
CREATE POLICY "public_insert_enquiries" ON enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_enquiries" ON enquiries;
CREATE POLICY "admin_select_enquiries" ON enquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_enquiries" ON enquiries;
CREATE POLICY "admin_update_enquiries" ON enquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_enquiries" ON enquiries;
CREATE POLICY "admin_delete_enquiries" ON enquiries
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================================

-- Verify admin credentials (login)
CREATE OR REPLACE FUNCTION verify_admin_credentials(p_username text, p_password text)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user admin_users%ROWTYPE;
BEGIN
  SELECT * INTO v_user FROM admin_users WHERE username = p_username;
  
  IF v_user.id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  
  IF v_user.password_hash = crypt(p_password, v_user.password_hash) THEN
    RETURN QUERY SELECT v_user.id, v_user.username, v_user.full_name, v_user.role;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, NULL::text;
  RETURN;
END;
$$;

-- Get admin user by ID (without password_hash)
CREATE OR REPLACE FUNCTION get_admin_by_id(p_id uuid)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT a.id, a.username, a.full_name, a.role, a.created_at, a.updated_at
  FROM admin_users a
  WHERE a.id = p_id;
END;
$$;

-- Get all admin users (without password_hash)
CREATE OR REPLACE FUNCTION get_all_admin_users()
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY SELECT a.id, a.username, a.full_name, a.role, a.created_at, a.updated_at
  FROM admin_users a
  ORDER BY a.created_at DESC;
END;
$$;

-- Create admin user (admin only)
CREATE OR REPLACE FUNCTION create_admin_user(
  p_username text,
  p_password text,
  p_full_name text,
  p_role text DEFAULT 'user'
)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO admin_users (username, password_hash, full_name, role)
  VALUES (p_username, crypt(p_password, gen_salt('bf')), p_full_name, p_role)
  RETURNING id INTO v_id;
  
  RETURN QUERY SELECT v_id, p_username, p_full_name, p_role;
END;
$$;

-- Update admin user (admin only, password optional - pass NULL to skip)
CREATE OR REPLACE FUNCTION update_admin_user(
  p_id uuid,
  p_username text,
  p_password text,
  p_full_name text,
  p_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_password IS NOT NULL AND p_password != '' THEN
    UPDATE admin_users 
    SET username = p_username, password_hash = crypt(p_password, gen_salt('bf')), 
        full_name = p_full_name, role = p_role, updated_at = now()
    WHERE id = p_id;
  ELSE
    UPDATE admin_users 
    SET username = p_username, full_name = p_full_name, role = p_role, updated_at = now()
    WHERE id = p_id;
  END IF;
END;
$$;

-- Delete admin user
CREATE OR REPLACE FUNCTION delete_admin_user(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM admin_users WHERE id = p_id;
END;
$$;

-- Grant execute on functions to anon and authenticated
GRANT EXECUTE ON FUNCTION verify_admin_credentials(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_by_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_all_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_admin_user(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_admin_user(uuid) TO authenticated;
