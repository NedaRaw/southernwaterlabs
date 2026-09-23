/*
# Fix ambiguous column reference in create_admin_user

The RETURNING id was ambiguous between the PL/pgSQL variable and the table column.
Added table alias to disambiguate. No data or policy changes.
*/

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
  RETURNING admin_users.id INTO v_id;
  
  RETURN QUERY SELECT v_id, p_username, p_full_name, p_role;
END;
$$;

GRANT EXECUTE ON FUNCTION create_admin_user(text, text, text, text) TO authenticated;
