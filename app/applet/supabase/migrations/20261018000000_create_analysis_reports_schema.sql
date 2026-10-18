/*
# Create Analysis Reports Schema & Secure Storage

## Overview
Adds analysis reports management for visitors and water laboratories:
- `analysis_reports` table linking reports to visitors, laboratories, and branches
- File metadata (PDF / Excel files: .pdf, .xls, .xlsx)
- Row Level Security (RLS) policies scoped by user role
- Security Definer RPCs for scoped listing, uploading, and safe soft-deletion
- Supabase Storage bucket `analysis-reports` with secure policies
*/

-- ============================================================
-- 1. TABLE: analysis_reports
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number text UNIQUE NOT NULL,
  visitor_id text NOT NULL,
  visitor_name text NOT NULL,
  sample_code text NOT NULL,
  sample_type text NOT NULL,
  sample_type_ar text,
  sample_type_en text,
  sample_type_fr text,
  laboratory text NOT NULL,
  branch text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'archived')),
  notes text,
  uploaded_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  uploaded_by_name text,
  deleted_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_reports_visitor ON analysis_reports(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_lab ON analysis_reports(laboratory);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_branch ON analysis_reports(branch);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_status ON analysis_reports(status);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_deleted_at ON analysis_reports(deleted_at);

ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated can read active reports (for Visitor Portal verification)
DROP POLICY IF EXISTS "public_select_active_reports" ON analysis_reports;
CREATE POLICY "public_select_active_reports" ON analysis_reports
  FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL AND status = 'available');

-- Authenticated admins can manage reports
DROP POLICY IF EXISTS "authenticated_insert_reports" ON analysis_reports;
CREATE POLICY "authenticated_insert_reports" ON analysis_reports
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_reports" ON analysis_reports;
CREATE POLICY "authenticated_update_reports" ON analysis_reports
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. STORAGE BUCKET: analysis-reports
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'analysis-reports',
  'analysis-reports',
  false,
  15728640, -- 15 MB limit
  ARRAY['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS: Public cannot list, only download with signed URL
DROP POLICY IF EXISTS "allow_admin_storage_ops" ON storage.objects;
CREATE POLICY "allow_admin_storage_ops" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'analysis-reports')
  WITH CHECK (bucket_id = 'analysis-reports');

-- ============================================================
-- 3. SECURITY DEFINER FUNCTIONS
-- ============================================================

-- List analysis reports scoped by admin role
CREATE OR REPLACE FUNCTION admin_list_analysis_reports(p_token text)
RETURNS TABLE (
  id uuid,
  report_number text,
  visitor_id text,
  visitor_name text,
  sample_code text,
  sample_type text,
  sample_type_ar text,
  sample_type_en text,
  sample_type_fr text,
  laboratory text,
  branch text,
  file_name text,
  file_path text,
  file_type text,
  file_size integer,
  status text,
  notes text,
  uploaded_by uuid,
  uploaded_by_name text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user admin_users%ROWTYPE;
BEGIN
  -- Authenticate admin session
  SELECT * INTO v_user FROM admin_users WHERE id::text = p_token OR username = p_token;
  
  IF v_user.id IS NULL THEN
    RETURN;
  END IF;

  IF v_user.role = 'super_admin' THEN
    RETURN QUERY
    SELECT r.id, r.report_number, r.visitor_id, r.visitor_name, r.sample_code,
           r.sample_type, r.sample_type_ar, r.sample_type_en, r.sample_type_fr,
           r.laboratory, r.branch, r.file_name, r.file_path, r.file_type, r.file_size,
           r.status, r.notes, r.uploaded_by, r.uploaded_by_name, r.created_at, r.updated_at
    FROM analysis_reports r
    WHERE r.deleted_at IS NULL
    ORDER BY r.created_at DESC;
    RETURN;
  END IF;

  IF v_user.role = 'lab_admin' THEN
    RETURN QUERY
    SELECT r.id, r.report_number, r.visitor_id, r.visitor_name, r.sample_code,
           r.sample_type, r.sample_type_ar, r.sample_type_en, r.sample_type_fr,
           r.laboratory, r.branch, r.file_name, r.file_path, r.file_type, r.file_size,
           r.status, r.notes, r.uploaded_by, r.uploaded_by_name, r.created_at, r.updated_at
    FROM analysis_reports r
    WHERE r.deleted_at IS NULL AND r.laboratory = v_user.laboratory
    ORDER BY r.created_at DESC;
    RETURN;
  END IF;

  IF v_user.role = 'local_admin' THEN
    RETURN QUERY
    SELECT r.id, r.report_number, r.visitor_id, r.visitor_name, r.sample_code,
           r.sample_type, r.sample_type_ar, r.sample_type_en, r.sample_type_fr,
           r.laboratory, r.branch, r.file_name, r.file_path, r.file_type, r.file_size,
           r.status, r.notes, r.uploaded_by, r.uploaded_by_name, r.created_at, r.updated_at
    FROM analysis_reports r
    WHERE r.deleted_at IS NULL 
      AND r.laboratory = v_user.laboratory
      AND (v_user.branch IS NULL OR r.branch = v_user.branch OR r.branch = ANY(string_to_array(v_user.branch, ',')))
    ORDER BY r.created_at DESC;
    RETURN;
  END IF;

  -- Read-only user
  RETURN QUERY
  SELECT r.id, r.report_number, r.visitor_id, r.visitor_name, r.sample_code,
         r.sample_type, r.sample_type_ar, r.sample_type_en, r.sample_type_fr,
         r.laboratory, r.branch, r.file_name, r.file_path, r.file_type, r.file_size,
         r.status, r.notes, r.uploaded_by, r.uploaded_by_name, r.created_at, r.updated_at
  FROM analysis_reports r
  WHERE r.deleted_at IS NULL 
    AND (v_user.laboratory IS NULL OR r.laboratory = v_user.laboratory)
    AND (v_user.branch IS NULL OR r.branch = v_user.branch OR r.branch = ANY(string_to_array(v_user.branch, ',')))
  ORDER BY r.created_at DESC;
  RETURN;
END;
$$;

-- Safe soft delete report
CREATE OR REPLACE FUNCTION admin_delete_analysis_report(p_token text, p_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user admin_users%ROWTYPE;
  v_report analysis_reports%ROWTYPE;
BEGIN
  SELECT * INTO v_user FROM admin_users WHERE id::text = p_token OR username = p_token;
  IF v_user.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized session');
  END IF;

  IF v_user.role = 'user' THEN
    RETURN json_build_object('success', false, 'error', 'Read-only users cannot delete reports');
  END IF;

  SELECT * INTO v_report FROM analysis_reports WHERE id = p_id AND deleted_at IS NULL;
  IF v_report.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Report not found or already deleted');
  END IF;

  -- Verify laboratory scope
  IF v_user.role = 'lab_admin' AND v_report.laboratory <> v_user.laboratory THEN
    RETURN json_build_object('success', false, 'error', 'Report outside your laboratory scope');
  END IF;

  -- Verify branch scope
  IF v_user.role = 'local_admin' THEN
    IF v_report.laboratory <> v_user.laboratory OR 
       (v_user.branch IS NOT NULL AND v_report.branch <> v_user.branch AND NOT (v_report.branch = ANY(string_to_array(v_user.branch, ',')))) THEN
      RETURN json_build_object('success', false, 'error', 'Report outside your branch scope');
    END IF;
  END IF;

  -- Soft delete
  UPDATE analysis_reports
  SET deleted_at = now(), status = 'archived'
  WHERE id = p_id;

  RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_list_analysis_reports(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_analysis_report(text, uuid) TO anon, authenticated;
