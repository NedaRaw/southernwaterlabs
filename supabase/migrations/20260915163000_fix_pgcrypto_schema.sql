/*
# Fix pgcrypto function schema references

The pgcrypto extension is installed in the `extensions` schema, not `public`.
Updated all SECURITY DEFINER functions to use schema-qualified calls:
- extensions.crypt()
- extensions.gen_salt()

No table changes. No data changes. No policy changes.
*/

-- ============================================================
-- Re-create functions with correct schema references
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
SET search_path = public, extensions
AS $$
DECLARE
  v_user admin_users%ROWTYPE;
BEGIN
  SELECT * INTO v_user FROM admin_users WHERE username = p_username;
  
  IF v_user.id IS NULL THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, NULL::text;
    RETURN;
  END IF;
  
  IF v_user.password_hash = extensions.crypt(p_password, v_user.password_hash) THEN
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
SET search_path = public, extensions
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO admin_users (username, password_hash, full_name, role)
  VALUES (p_username, extensions.crypt(p_password, extensions.gen_salt('bf')), p_full_name, p_role)
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
SET search_path = public, extensions
AS $$
BEGIN
  IF p_password IS NOT NULL AND p_password != '' THEN
    UPDATE admin_users 
    SET username = p_username, password_hash = extensions.crypt(p_password, extensions.gen_salt('bf')), 
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

-- Re-grant execute
GRANT EXECUTE ON FUNCTION verify_admin_credentials(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_by_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_all_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_admin_user(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_admin_user(uuid) TO authenticated;
