# Analysis Reports Management & Secure Document Retrieval System

A complete review of the existing system architecture and a concise implementation plan for introducing the **Analysis Reports** page to the Admin Portal, supporting secure PDF/Excel file handling, strict hierarchical role-based permissions, visitor portal integration, and responsive cross-device layout.

---

## Review of Existing Codebase & Infrastructure

### 1. Existing Infrastructure & Capabilities
- **Dual-Mode Backend Architecture (`src/lib/supabase.ts`)**:
  - The application automatically switches between **Remote Supabase** (when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined) and a **Local Mock Client** with `localStorage` persistence.
  - Active tables: `admin_users`, `visitors`, `surveys`, `enquiries`.
  - Custom token-based authorization and session management via SECURITY DEFINER RPCs (`verify_admin_credentials`, `login_user`, `validate_admin_session`, `list_users`, `delete_user_secure`, `admin_delete_visitor`, `admin_delete_survey`, `admin_delete_enquiry`).
- **Hierarchy & Scoping Model**:
  - `super_admin`: Global visibility and actions across all central labs (`asir`, `najran`, `al-baha`, `jazan`) and branches.
  - `lab_admin`: Scoped strictly to their designated central laboratory and all its subordinate branches.
  - `local_admin`: Scoped strictly to their assigned branch(es) within their designated laboratory (up to 2 branches).
  - `user`: Read-only access within their designated laboratory and branch; prohibited from uploading, modifying, or deleting.
- **Visitor Portal (`src/services/visitorPortal.ts` & `src/pages/VisitorDashboard.tsx`)**:
  - Currently contains mock/demo test records (`DEMO_LAB_REPORTS`) with structured chemical and microbiological parameters, but has no link to real uploaded files (`.pdf`, `.xls`, `.xlsx`).
- **Admin Portal UI (`src/pages/Admin.tsx`)**:
  - Contains navigation tabs for `dashboard`, `visitors`, `surveys`, `enquiries`, `users`, and `qrcodes`.
  - Responsive header with desktop segmented control, tablet/mobile horizontal scrolling tabs, status badges, and action bars.

### 2. Missing Infrastructure for PDF/Excel Reports
- **Database Schema**: No `analysis_reports` table exists to store report metadata, file paths, mime types, file sizes, sample codes, visitor links, laboratory, branch, and status.
- **Storage Infrastructure**: No Supabase Storage bucket (`analysis-reports`) or RLS storage policies are configured for file uploads and secure downloads.
- **Backend RPC Endpoints**: Missing secure RPC functions for listing reports by scope, recording report uploads, downloading via signed URLs, and safely deleting reports with authorization checks.
- **Mock Mode File Handling**: No local mock storage handler for simulated file uploads (converting files to IndexedDB/base64 data URLs for offline testing without corrupting localStorage quotas).
- **Admin Navigation & UI**: Missing the "Analysis Reports" tab, reports management data table with "Available / Not Available" status for visitors, file upload modal, file preview/download action, and safe deletion confirmation dialog.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **No database, storage, RLS, or source code modifications have been made.** In accordance with Section 5 of your prompt, this plan is submitted for your explicit review and approval before any implementation begins.

- **Storage Mode Strategy**:
  - *Production / Supabase Mode*: Store raw files in a dedicated private Supabase Storage bucket (`analysis-reports`) with authenticated signed URL generation for secure retrieval. Store file metadata in the `analysis_reports` PostgreSQL table with foreign-key linkage to `visitors.id`.
  - *Mock / Offline Mode*: Store file metadata in `localStorage` under `STORAGE_KEYS.ANALYSIS_REPORTS`, and store file binary data as Base64 strings or in browser IndexedDB/Blob URLs to allow functional file downloads during local development without claiming persistence across separate browsers.
- **File Types & Limits**: Support `.pdf`, `.xls`, `.xlsx` with a client- and backend-enforced maximum file size of 15 MB.
- **Safe Deletion**: Implement soft deletion (`deleted_at` timestamp / `status = 'archived'`) in both the database schema and mock handler, backed by a mandatory confirmation modal before execution.
- **Responsive Admin Header**: Refactor the header navigation to ensure seamless layout on mobile (360px–640px), tablet (768px–1024px), and desktop (1280px+) with no overlapping buttons, no truncated titles, and smooth touch scrolling.

---

## 1. Overview & Core Concept

The **Analysis Reports System** introduces a laboratory document management module inside the Admin Portal and bridges it directly to the Visitor Portal:
1. **Administrators** upload official laboratory analysis certificates (PDF test sheets or Excel batch data) and link them directly to a registered visitor, sample request ID, central laboratory, and branch.
2. **Visitors** view a real-time status indicator ("Available" vs. "Not Available") beside each visit or sample record, and can view report details or download the original PDF/Excel document directly through their existing Visitor Portal.
3. **Role Scoping** is strictly verified on the backend for every read, upload, and deletion request.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ADMIN PORTAL (Role-Based)                       │
│  [Overview] [Visitors] [Surveys] [Enquiries] [Users] [Analysis Reports]│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
[super_admin]                 [lab_admin]                  [local_admin]
Global read/write/delete      Central lab + branches       Assigned branch(es) only
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │     Backend Authorization & Scoping Validation          │
       │   - Token & Role Verification                           │
       │   - Laboratory & Branch Match                           │
       │   - Safe Soft-Deletion Protocol                         │
       └────────────────────────────┬────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                ▼                                       ▼
  [analysis_reports Table]               [analysis-reports Storage]
  Metadata, links, sample codes          Private PDF / Excel Files
                │                                       │
                └───────────────────┬───────────────────┘
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                VISITOR PORTAL (Read-Only)               │
       │   - Visitor identifies by Permit ID / Phone             │
       │   - Reports Tab shows: Available / Not Available        │
       │   - 1-Click Secure Download (PDF / Excel)               │
       └─────────────────────────────────────────────────────────┘
```

---

## 2. User Experience & Visual Design

### A. Admin Navigation & Responsive Header
- **Desktop (1024px+)**:
  - Centered segmented tab navigation with icons and multilingual labels (`dashboard`, `visitors`, `reports`, `surveys`, `enquiries`, `users`, `qrcodes`).
  - Active tab highlighted in vibrant NWC blue (`bg-blue-600 text-white shadow-xs`).
  - Page header displays breadcrumb trail, role badge, quick lab switcher, and primary action buttons (`Upload New Report`, `Export XLS`).
- **Tablet & Mobile (< 1024px)**:
  - Header adopts a fluid single-line layout with touch-friendly segmented scroll pills (`min-h-[44px]`, smooth momentum horizontal scroll, no clipping).
  - Breadcrumb and user status badges collapse into an intuitive contextual drawer or compact subtitle to prevent header overflow.
  - Action buttons stack neatly with full-width primary touch targets on small screens.

### B. Reports Management Page Layout
1. **Quick Metrics Strip**:
   - Total Reports, Available Reports, Pending Analysis, and Storage Quota / Lab Breakdown.
2. **Filter & Search Bar**:
   - Search by Visitor Name, Permit/Visitor ID, Report Number, Sample Code, or Keyword.
   - Filters: Laboratory filter (disabled for local admins), Branch filter, Report Status (`Available` vs `Not Available`), Date Range.
3. **Visitors & Reports Table**:
   - Columns:
     - **Visitor / Organization**: Name, National ID/Permit ID, Phone, Company.
     - **Laboratory & Branch**: Tagged with official central lab and branch names.
     - **Sample Code & Request**: Linked test request number.
     - **Report Status**: Unboxed clear badge (`Available` with file type icon, or `Not Available` with upload prompt).
     - **File Details**: File format (`PDF` / `XLS` / `XLSX`), file size, issue date.
     - **Actions**:
       - *View Details* (modal with metadata and parameter previews).
       - *Download Original* (secure direct file download).
       - *Upload / Replace* (authorized admins only).
       - *Delete* (authorized admins only; triggers safe confirmation modal).

### C. Upload Modal Dialog
- Accessible only to authorized `super_admin`, `lab_admin`, and `local_admin` within their scope.
- Pre-selects visitor and automatically fills laboratory and branch based on visitor record and admin credentials.
- Drag-and-drop zone with instant file validation (`.pdf`, `.xls`, `.xlsx`, max 15MB).
- Form fields: Report Number (auto-generated e.g. `NWC-REP-2026-XXXX` with manual override), Sample Code, Sample Type, Issue Date, Notes.
- Progress bar during upload with error handling and success toast notification.

### D. Safe Deletion Dialog
- Modal warning clearly identifying the file name, report number, and affected visitor.
- Displays who uploaded the report and the deletion reason input.
- Clear distinction: soft archiving vs permanent removal, requiring explicit confirmation text or button hold.

---

## 3. Required Changes & Technical Blueprint

### A. Database Schema (`supabase/migrations/` & Remote PostgreSQL)

```sql
-- Create analysis_reports table
CREATE TABLE IF NOT EXISTS analysis_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_number text UNIQUE NOT NULL,
  visitor_id text NOT NULL,
  visitor_name text NOT NULL,
  sample_code text NOT NULL,
  sample_type text NOT NULL,
  laboratory text NOT NULL,
  branch text,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'archived')),
  notes text,
  uploaded_by uuid REFERENCES admin_users(id),
  deleted_at timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- Storage Bucket Creation
INSERT INTO storage.buckets (id, name, public)
VALUES ('analysis-reports', 'analysis-reports', false)
ON CONFLICT (id) DO NOTHING;
```

### B. Security Definer RPCs & Authorization Handlers
1. `admin_list_analysis_reports(p_token text)`:
   - Validates admin session token.
   - Filters rows by admin scope:
     - `super_admin`: all records.
     - `lab_admin`: records matching `laboratory = caller.laboratory`.
     - `local_admin`: records matching `laboratory = caller.laboratory` and `branch IN (caller.branches)`.
     - `user`: read-only list matching caller's laboratory and branch.
2. `admin_upload_analysis_report(p_token text, ...)`:
   - Blocks `user` role from uploading.
   - Enforces laboratory and branch matching with caller's assigned scope.
   - Writes row to `analysis_reports` and logs audit entry.
3. `admin_delete_analysis_report(p_token text, p_report_id uuid)`:
   - Blocks `user` role from deleting.
   - Verifies target record belongs to caller's laboratory and branch scope.
   - Sets `deleted_at = now()` (soft delete) to ensure data safety.
4. `get_visitor_analysis_reports(p_visitor_id text)`:
   - Allows public / visitor portal lookup for active reports linked to the authenticated visitor's permit ID, phone, or national ID.

### C. Local Mock Implementation (`src/lib/supabase.ts`)
- Add `STORAGE_KEYS.ANALYSIS_REPORTS = 'swl_analysis_reports'`.
- Provide default sample reports linked to existing demo visitors (`demo-visitor-001`, `LAB-2026-0001`, etc.) so the page is immediately testable and functional offline.
- Mock file uploads store Base64 data URLs or Object URLs so downloading immediately works in offline mode.
- Mock RPCs mirror the exact scoping and role enforcement logic of the remote PostgreSQL functions.

### D. Frontend Integration Files
1. **`src/pages/Admin.tsx`**:
   - Add `'reports'` to the `Tab` type union.
   - Add the Analysis Reports tab entry with translations (`تقارير التحاليل` / `Analysis Reports` / `Rapports d'analyse`).
   - Implement the reports table view, status filters, search, and responsive header adjustments.
   - Implement the Upload Modal and Delete Confirmation Modal.
2. **`src/services/visitorPortal.ts` & `src/pages/VisitorDashboard.tsx`**:
   - Update `getVisitorReports` to query both uploaded `analysis_reports` and existing test parameters.
   - Provide direct download handler for uploaded PDF and Excel files.
3. **`src/lib/i18n.tsx`**:
   - Ensure all reports terminology, file statuses, upload forms, and error messages have complete Arabic, English, and French translations.

---

## 4. Execution Sequence (Upon Approval)

1. **Step 1: Mock Backend & Types**: Add TypeScript interfaces and mock RPCs in `src/lib/supabase.ts` for report listing, upload, and soft deletion.
2. **Step 2: Admin Header & Navigation**: Update `Admin.tsx` header layout to ensure full responsiveness on mobile, tablet, and desktop without clipping.
3. **Step 3: Analysis Reports Management View**: Implement the table, visitor linkage, "Available / Not Available" badges, and search/filter controls in `Admin.tsx`.
4. **Step 4: Upload & Delete Modals**: Build the upload form (with `.pdf`, `.xls`, `.xlsx` file picker) and the safe deletion modal with role-based permission checks.
5. **Step 5: Visitor Portal Sync**: Connect `visitorPortalService` and `VisitorDashboard.tsx` so visitors can see report availability and download uploaded files.
6. **Step 6: SQL Migration File**: Create the migration file `supabase/migrations/20261018000000_create_analysis_reports_schema.sql` ready for deployment upon Supabase connection.
7. **Step 7: Verification**: Run `compile_applet` and test all role permissions (`super_admin`, `lab_admin`, `local_admin`, `user`).
