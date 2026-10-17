import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Key,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  UserCog,
  LogOut,
  Search,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Download,
  X,
  TrendingUp,
  ShieldCheck,
  Building2,
  Sun,
  Moon,
  CheckCircle2,
  Calendar,
  QrCode,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import {
  supabase,
  isSupabaseConfigured,
  STORAGE_KEYS,
  defaultAdminUsers,
  loadData,
  saveData,
  type AdminUserData,
} from '@/lib/supabase';
import { useLang, type Lang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import LabLogo from '@/components/LabLogo';
import ConfirmModal from '@/components/ConfirmModal';
import { QrCodesModule } from '@/components/admin/QrCodesModule';
import { QR_REGISTRY } from '@/data/qrRegistry';
import {
  LAB_HIERARCHY,
  getLabLabel,
  getBranchLabel,
} from '@/data/labServices';
import { APPROVED_SERVICES } from '@/data/labServices';

// ============================================================
// Types & Hierarchy Roles
// ============================================================

export type UserRole =
  | 'super_admin'
  | 'lab_admin'
  | 'local_admin'
  | 'admin'
  | 'user';

export interface AdminUser {
  id: string;
  username: string;
  full_name?: string | null;
  role: string;
  laboratory?: string | null;
  branch?: string | null;
  branches?: string[] | null;
  active?: boolean | null;
  created_at?: string | null;
  is_primary?: boolean | null;
}

export function isSuperAdmin(role?: string | null): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function isLabAdmin(role?: string | null): boolean {
  return role === 'lab_admin';
}

export function isLocalAdmin(role?: string | null): boolean {
  return role === 'local_admin';
}

export function isStandardUser(role?: string | null): boolean {
  return role === 'user';
}

export function isReadOnly(role?: string | null): boolean {
  return role === 'user';
}

export function canManageUsers(role?: string | null): boolean {
  return (
    role === 'super_admin' ||
    role === 'lab_admin' ||
    role === 'local_admin' ||
    role === 'admin'
  );
}

export function hasAdminAccess(role?: string | null): boolean {
  return (
    role === 'super_admin' ||
    role === 'lab_admin' ||
    role === 'local_admin' ||
    role === 'admin' ||
    role === 'user'
  );
}

export function getUserBranches(
  user?: { branch?: string | null; branches?: string[] | null } | null | string
): string[] {
  if (!user) return [];
  if (typeof user === 'string') {
    return user
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);
  }
  if (Array.isArray(user.branches) && user.branches.length > 0) {
    return user.branches.filter(Boolean);
  }
  if (!user.branch) return [];
  return user.branch
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);
}

export function isUserBranchAuthorized(
  actor: AdminUser | null,
  recordBranch?: string | null
): boolean {
  if (!actor) return false;
  if (isSuperAdmin(actor.role) || isLabAdmin(actor.role)) return true;

  const branches = getUserBranches(actor);

  if (isLocalAdmin(actor.role)) {
    if (branches.length === 0) return true;
    if (!recordBranch) return false;
    return branches.some((b) => isBranchMatch(recordBranch, b));
  }

  if (isStandardUser(actor.role) || isReadOnly(actor.role)) {
    if (branches.length === 0) return true;
    if (!recordBranch) return true;
    return branches.some((b) => isBranchMatch(recordBranch, b));
  }

  return false;
}

export function canCreateRole(actorRole?: string | null, targetRole?: string | null): boolean {
  if (isSuperAdmin(actorRole)) return true;
  if (isLabAdmin(actorRole)) {
    // Lab admin cannot create super_admin or lab_admin
    return targetRole === 'local_admin' || targetRole === 'user';
  }
  if (isLocalAdmin(actorRole)) {
    // Local admin can only create ordinary users
    return targetRole === 'user';
  }
  return false;
}


export function canEditUser(actor: AdminUser | null, target: AdminUser): boolean {
  if (!actor || !target) return false;

  // Super admin: cannot manage another super admin
  if (isSuperAdmin(actor.role)) {
    return !isSuperAdmin(target.role);
  }

  // Lab admin: can manage local admins and users in their laboratory
  if (isLabAdmin(actor.role)) {
    if (!['local_admin', 'user'].includes(target.role)) return false;
    return isLabMatch(target.laboratory, actor.laboratory);
  }

  // Local admin: can manage ordinary users in assigned branches only
  if (isLocalAdmin(actor.role)) {
    if (target.role !== 'user') return false;
    if (!isLabMatch(target.laboratory, actor.laboratory)) return false;
    return isUserBranchAuthorized(actor, target.branch);
  }

  return false;
}



export function canDeleteUser(
  actor: AdminUser | null,
  target: AdminUser
): boolean {
  if (!actor || !target) return false;

  // Protect primary and legacy admin accounts.
  if (target.is_primary || target.username === 'admin') {
    return false;
  }

  // Prevent self-deletion.
  if (actor.id === target.id) {
    return false;
  }

  // Super Admin: global access, except protected accounts.
  if (isSuperAdmin(actor.role)) {
    return true;
  }

  // Lab Admin: same laboratory only; cannot delete Super Admin or Lab Admins.
  if (isLabAdmin(actor.role)) {
    if (
      !actor.laboratory ||
      !target.laboratory ||
      !isLabMatch(target.laboratory, actor.laboratory)
    ) {
      return false;
    }

    return (
      target.role === 'local_admin' ||
      target.role === 'user'
    );
  }

  // Local Admin: ordinary users in their assigned laboratory and authorized branch(es).
  if (isLocalAdmin(actor.role)) {
    if (
      target.role !== 'user' ||
      !actor.laboratory ||
      !target.laboratory ||
      !isLabMatch(target.laboratory, actor.laboratory)
    ) {
      return false;
    }

    return isUserBranchAuthorized(actor, target.branch);
  }

  return false;
}


export function isLabMatch(recordLab?: string | null, targetLab?: string | null): boolean {
  if (!targetLab) return true;
  if (!recordLab) return false;
  if (recordLab === targetLab) return true;
  const r = recordLab.toLowerCase();
  const t = targetLab.toLowerCase();
  if (r.includes(t) || t.includes(r)) return true;
  if (targetLab === 'asir' && (r.includes('عسير') || r.includes('asir'))) return true;
  if (targetLab === 'najran' && (r.includes('نجران') || r.includes('najran'))) return true;
  if (targetLab === 'al-baha' && (r.includes('باحة') || r.includes('baha'))) return true;
  if (targetLab === 'jazan' && (r.includes('جازان') || r.includes('jazan'))) return true;
  return false;
}

export function isBranchMatch(recordBranch?: string | null, targetBranch?: string | null): boolean {
  if (!targetBranch) return true;
  if (!recordBranch) return false;
  if (recordBranch === targetBranch) return true;

  // If targetBranch contains multiple branches (e.g. 'bisha,mahayel'), check any match
  if (targetBranch.includes(',')) {
    const branches = targetBranch.split(',').map((b) => b.trim()).filter(Boolean);
    return branches.some((b) => isBranchMatch(recordBranch, b));
  }

  // If recordBranch contains multiple branches, check any match
  if (recordBranch.includes(',')) {
    const branches = recordBranch.split(',').map((b) => b.trim()).filter(Boolean);
    return branches.some((b) => isBranchMatch(b, targetBranch));
  }

  const r = recordBranch.toLowerCase();
  const t = targetBranch.toLowerCase();
  if (r === t || r.includes(t) || t.includes(r)) return true;
  if (t === 'bisha' && (r.includes('بيشة') || r.includes('bisha'))) return true;
  if ((t === 'mahayel' || t === 'muhayil') && (r.includes('محايل') || r.includes('mahayel') || r.includes('muhayil'))) return true;
  if (t === 'sharurah' && (r.includes('شرورة') || r.includes('sharurah'))) return true;
  if (t === 'qalwah' && (r.includes('قلوة') || r.includes('qalwah'))) return true;
  if (t === 'al-darb' && (r.includes('درب') || r.includes('darb'))) return true;
  if (t === 'farasan' && (r.includes('فرسان') || r.includes('farasan'))) return true;
  return false;
}

export function getRoleLabel(role: string, lang: Lang): string {
  switch (role) {
    case 'super_admin':
      return lang === 'ar'
        ? 'مشرف عام (وصول شامل)'
        : lang === 'fr'
          ? 'Super Administrateur (Accès global)'
          : 'Super Admin (Global Access)';
    case 'lab_admin':
      return lang === 'ar'
        ? 'مدير مختبر مركزي'
        : lang === 'fr'
          ? 'Administrateur de Laboratoire'
          : 'Lab Administrator';
    case 'local_admin':
      return lang === 'ar'
        ? 'مسؤول محلي'
        : lang === 'fr'
          ? 'Administrateur Local'
          : 'Local Administrator';
    case 'admin':
      return lang === 'ar'
        ? 'مدير نظام (سجل تاريخي)'
        : lang === 'fr'
          ? 'Administrateur (Historique)'
          : 'Admin (Legacy)';
    case 'user':
    default:
      return lang === 'ar'
        ? 'مستخدم عادي'
        : lang === 'fr'
          ? 'Utilisateur ordinaire'
          : 'Standard User';
  }
}

interface Visitor {
  id: string;
  visitor_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  visitor_name?: string | null;
  national_id?: string | null;
  company?: string | null;
  job_title?: string | null;
  phone?: string | null;
  email?: string | null;
  visit_date?: string | null;
  arrival_time?: string | null;
  laboratory?: string | null;
  branch?: string | null;
  department?: string | null;
  employee?: string | null;
  purpose?: string | null;
  visit_purpose?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
}

interface Survey {
  id: string;
  laboratory?: string | null;
  branch?: string | null;
  service_used?: string | null;
  how_heard?: string | null;
  overall_satisfaction?: string | number | null;
  staff_professionalism?: string | number | null;
  service_speed?: string | number | null;
  sample_submission?: string | number | null;
  report_clarity?: string | number | null;
  communication?: string | number | null;
  laboratory_cleanliness?: string | number | null;
  overall_experience?: string | number | null;
  results_on_time?: string | number | null;
  reports_understandable?: string | number | null;
  recommendation_score?: string | number | null;
  liked_most?: string | null;
  improvements?: string | null;
  contact_me?: boolean | string | null;
  additional_comments?: string | null;
  created_at?: string | null;
}

interface Enquiry {
  id: string;
  laboratory?: string | null;
  branch?: string | null;
  full_name?: string | null;
  name?: string | null;
  company_name?: string | null;
  email?: string | null;
  contact_info?: string | null;
  phone?: string | null;
  location?: string | null;
  service_required?: string | null;
  subject?: string | null;
  message?: string | null;
  status?: string | null;
  created_at?: string | null;
}

type Tab =
  | 'dashboard'
  | 'visitors'
  | 'surveys'
  | 'enquiries'
  | 'users'
  | 'qrcodes';


// ============================================================
// Helpers
// ============================================================

function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';

  if (typeof error === 'string') {
    return error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    return String((error as { message?: unknown }).message ?? 'Unknown error');
  }

  return 'Unknown error';
}

function formatDate(value?: string | null): string {
  if (!value) return '—';

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function getVisitorName(visitor: Visitor): string {
  if (visitor.visitor_name) {
    return visitor.visitor_name;
  }

  const name = [
    visitor.first_name,
    visitor.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return name || '—';
}

function getEnquiryName(enquiry: Enquiry): string {
  return (
    enquiry.full_name ||
    enquiry.name ||
    enquiry.company_name ||
    '—'
  );
}

interface ActivityDataPoint {
  period: string;
  arPeriod: string;
  frPeriod: string;
  chemical: number;
  microbiological: number;
  physical: number;
  total: number;
}

const SAMPLE_ACTIVITY_LAST_MONTH: ActivityDataPoint[] = [
  { period: 'Week 1', arPeriod: 'الأسبوع الأول', frPeriod: 'Semaine 1', chemical: 345, microbiological: 490, physical: 215, total: 1050 },
  { period: 'Week 2', arPeriod: 'الأسبوع الثاني', frPeriod: 'Semaine 2', chemical: 380, microbiological: 510, physical: 230, total: 1120 },
  { period: 'Week 3', arPeriod: 'الأسبوع الثالث', frPeriod: 'Semaine 3', chemical: 410, microbiological: 560, physical: 250, total: 1220 },
  { period: 'Week 4', arPeriod: 'الأسبوع الرابع', frPeriod: 'Semaine 4', chemical: 360, microbiological: 480, physical: 226, total: 1066 },
];

const LAB_Central_ACTIVITY = [
  { name: 'Asir Central Laboratory', arName: ' مختبر عسير المرجعي', frName: 'Laboratoire Central Asir', samples: 1420, completed: 1395, compliance: '99.6%', labId: 'asir' },
  { name: 'Najran Central Laboratory', arName: 'مختبر نجران المركزي', frName: 'Laboratoire Central Najran', samples: 1180, completed: 1162, compliance: '99.3%', labId: 'najran' },
  { name: 'Al-Baha Central Laboratory', arName: 'مختبر الباحة المركزي', frName: 'Laboratoire Central Al-Baha', samples: 890, completed: 875, compliance: '99.5%', labId: 'al-baha' },
  { name: 'Jazan Central Laboratory', arName: 'مختبر جازان المركزي', frName: 'Laboratoire Central Jazan', samples: 966, completed: 948, compliance: '99.1%', labId: 'jazan' },
];


// ============================================================
// Component
// ============================================================

export default function Admin() {
  const { lang, dir } = useLang();
  const { theme, toggleTheme } = useTheme();

  const isRtl = dir === 'rtl';

  // ============================================================
  // Authentication
  // ============================================================

  const [loggedIn, setLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [surveysError, setSurveysError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Change Own Password State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [showChangePwdCurrent, setShowChangePwdCurrent] = useState(false);
  const [showChangePwdNew, setShowChangePwdNew] = useState(false);

  // ============================================================
  // Dashboard
  // ============================================================

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [selectedVisitorIds, setSelectedVisitorIds] = useState<string[]>([]);
  const [selectedEnquiryIds, setSelectedEnquiryIds] = useState<string[]>([]);


  const [bulkSurveyDeleteOpen, setBulkSurveyDeleteOpen] = useState(false);
  const [bulkSurveyDeleteLoading, setBulkSurveyDeleteLoading] = useState(false);
  const [bulkSurveyDeleteError, setBulkSurveyDeleteError] = useState<string | null>(null);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const [loading, setLoading] = useState(false);

  // Unified delete target and confirmation modal state
  interface DeleteTarget {
    type: 'visitor' | 'survey' | 'enquiry' | 'user';
    id: string;
    name?: string;
    title?: string;
    message?: string;
    details?: Array<{ label: string; value: React.ReactNode }>;
    rawRecord: unknown;
  }
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalError, setDeleteModalError] = useState<string | null>(null);


  const [bulkVisitorDeleteOpen, setBulkVisitorDeleteOpen] = useState(false);
  const [bulkVisitorDeleteLoading, setBulkVisitorDeleteLoading] = useState(false);
  const [bulkVisitorDeleteError, setBulkVisitorDeleteError] = useState<string | null>(null);
  const [bulkEnquiryDeleteOpen, setBulkEnquiryDeleteOpen] = useState(false);
  const [bulkEnquiryDeleteLoading, setBulkEnquiryDeleteLoading] = useState(false);
  const [bulkEnquiryDeleteError, setBulkEnquiryDeleteError] = useState<string | null>(null);

  // Feedback banner state (replaces alert dialogs)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);


  // ============================================================
  // Filters
  // ============================================================

  const [searchTerm, setSearchTerm] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [surveyStartDate, setSurveyStartDate] = useState('');
  const [surveyEndDate, setSurveyEndDate] = useState('');

  // ============================================================
  // User Modal
  // ============================================================

  const [showUserModal, setShowUserModal] = useState(false);

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'user',
    laboratory: '',
    branch: '',
  });

  const [userError, setUserError] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);



  // ============================================================
  // Session Restore
  // ============================================================

  useEffect(() => {
    let isCancelled = false;

    const restoreSession = async () => {
      const storedUser = sessionStorage.getItem('admin_user');
      const storedToken = sessionStorage.getItem('admin_token');

      if (!storedUser || !storedToken) {
        return;
      }

      // Reject mock tokens when connected to real Supabase.
      if (
        isSupabaseConfigured &&
        storedToken.startsWith('mock-token-')
      ) {
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        return;
      }

      try {
        const user = JSON.parse(storedUser) as AdminUser;

        // Reject invalid users and roles without admin access.
        if (!user || !hasAdminAccess(user.role)) {
          sessionStorage.removeItem('admin_user');
          sessionStorage.removeItem('admin_token');
          return;
        }

        // Validate the session against Supabase.
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.rpc(
            'validate_admin_session',
            {
              p_token: storedToken,
            }
          );

          const validation = Array.isArray(data) ? data[0] : data;

          const sessionIsValid =
            !error &&
            validation?.success === true &&
            String(validation?.user_id) === String(user.id) &&
            validation?.role === user.role;

          if (!sessionIsValid) {
            console.warn(
              'Session verification rejected or user data mismatch:',
              error || validation
            );

            sessionStorage.removeItem('admin_user');
            sessionStorage.removeItem('admin_token');

            if (!isCancelled) {
              setAdminUser(null);
              setAdminToken('');
              setLoggedIn(false);
              setSessionExpired(true);
            }

            return;
          }
        }

        if (isCancelled) return;

        // Restore authenticated state.
        setAdminUser(user);
        setAdminToken(storedToken);

        // Initialize filters according to the user's role.
        if (
          user.role === 'super_admin' ||
          user.role === 'admin'
        ) {
          // Global administrators must not inherit scoped filters.
          setLabFilter('');
          setBranchFilter('');
        } else if (
          isLabAdmin(user.role) &&
          user.laboratory
        ) {
          setLabFilter(user.laboratory);
          setBranchFilter('');
        } else if (isLocalAdmin(user.role)) {
          if (user.laboratory) {
            setLabFilter(user.laboratory);
          }

          const branches = getUserBranches(user);

          setBranchFilter(
            branches.length === 1 ? branches[0] : ''
          );
        } else if (isReadOnly(user.role)) {
          if (user.laboratory) {
            setLabFilter(user.laboratory);
          }

          const branches = getUserBranches(user);

          setBranchFilter(
            branches.length === 1 ? branches[0] : ''
          );
        }

        setLoggedIn(true);
      } catch (error) {
        console.error(
          'Failed to restore admin session:',
          error
        );

        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');

        if (!isCancelled) {
          setAdminUser(null);
          setAdminToken('');
          setLoggedIn(false);
        }
      }
    };

    restoreSession();

    return () => {
      isCancelled = true;
    };
  }, []);



  // ============================================================
  // Login
  // ============================================================

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginError('');
    setLoggingIn(true);

    try {
      const username = loginForm.username.trim();
      const password = loginForm.password;

      if (!username || !password) {
        setLoginError(
          lang === 'ar'
            ? 'يرجى إدخال اسم المستخدم وكلمة المرور.'
            : lang === 'fr'
              ? "Veuillez saisir le nom d'utilisateur et le mot de passe."
              : 'Please enter username and password.'
        );
        setLoggingIn(false);
        return;
      }

      console.log('Admin login attempt for:', username);

      let authenticatedUser: Partial<AdminUser> | null = null;
      let sessionToken = '';
      let userRole = 'user';

      if (isSupabaseConfigured) {
        // Real Supabase Authentication exclusively
        const { data, error } = await supabase.rpc('login_user', {
          p_username: username,
          p_password: password,
        });

        console.log('LOGIN RPC RESPONSE:', data, error);

        if (error) {
          console.warn('Login RPC rejected by database:', error);
          setLoginError(
            lang === 'ar'
              ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
              : lang === 'fr'
                ? "Nom d'utilisateur ou mot de passe incorrect."
                : 'Invalid username or password.'
          );
          setLoggingIn(false);
          return;
        }

        const loginData = Array.isArray(data) ? data[0] : data;

        if (!loginData || !loginData.success) {
          const rawMsg = String(loginData?.message || loginData?.error || '').toLowerCase();
          if (
            rawMsg.includes('deactivat') ||
            rawMsg.includes('désactiv') ||
            rawMsg.includes('معطل') ||
            rawMsg.includes('inactive')
          ) {
            setLoginError(
              lang === 'ar'
                ? 'تم تعطيل هذا الحساب. يرجى التواصل مع مسؤول النظام.'
                : lang === 'fr'
                  ? 'Ce compte est désactivé. Veuillez contacter l’administrateur.'
                  : 'This account is deactivated. Please contact the administrator.'
            );
          } else {
            setLoginError(
              lang === 'ar'
                ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
                : lang === 'fr'
                  ? "Nom d'utilisateur ou mot de passe incorrect."
                  : 'Invalid username or password.'
            );
          }
          setLoggingIn(false);
          return;
        }

        authenticatedUser = loginData.user || loginData;
        sessionToken =
          loginData.session_token ||
          loginData.token ||
          loginData.admin_token;
        userRole = authenticatedUser?.role || loginData.role || 'user';

        if (authenticatedUser?.active === false) {
          setLoginError(
            lang === 'ar'
              ? 'تم تعطيل هذا الحساب. يرجى التواصل مع مسؤول النظام.'
              : lang === 'fr'
                ? 'Ce compte est désactivé. Veuillez contacter l’administrateur.'
                : 'This account is deactivated. Please contact the administrator.'
          );
          setLoggingIn(false);
          return;
        }
      } else {
        // Pure unconfigured mock/demo environment ONLY
        const localUsers = loadData<AdminUserData[]>(
          STORAGE_KEYS.ADMIN_USERS,
          defaultAdminUsers
        );

        const match = localUsers.find(
          (u) =>
            u.username.toLowerCase() === username.toLowerCase() &&
            u.password === password
        );

        if (!match) {
          setLoginError(
            lang === 'ar'
              ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
              : lang === 'fr'
                ? "Nom d'utilisateur ou mot de passe incorrect."
                : 'Invalid username or password.'
          );
          setLoggingIn(false);
          return;
        }

        if (match.active === false) {
          setLoginError(
            lang === 'ar'
              ? 'تم تعطيل هذا الحساب. يرجى التواصل مع مسؤول النظام.'
              : lang === 'fr'
                ? 'Ce compte est désactivé. Veuillez contacter l’administrateur.'
                : 'This account is deactivated. Please contact the administrator.'
          );
          setLoggingIn(false);
          return;
        }

        sessionToken = `mock-token-${match.id}-${Date.now()}`;
        authenticatedUser = {
          id: match.id,
          username: match.username,
          full_name: match.full_name,
          role: match.role,
          laboratory: match.laboratory || null,
          branch: match.branch || null,
          active: match.active !== false,
          is_primary: match.is_primary || match.username === 'admin',
        };
        userRole = match.role;
      }

      if (!sessionToken) {
        setLoginError(
          lang === 'ar'
            ? 'تم تسجيل الدخول ولكن لم يتم إنشاء جلسة آمنة.'
            : lang === 'fr'
              ? 'Connexion réussie, mais aucune session sécurisée n’a été créée.'
              : 'Login succeeded, but no secure session token was created.'
        );
        setLoggingIn(false);
        return;
      }

      // Strict access enforcement: standard users have NO administrative access
      if (!hasAdminAccess(userRole)) {
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        setLoginError(
          lang === 'ar'
            ? 'تم رفض الوصول: هذا الحساب مسجل كمستخدم عادي ولا يملك صلاحيات إدارية لدخول هذه البوابة.'
            : lang === 'fr'
              ? "Accès refusé : ce compte utilisateur standard ne dispose d'aucun privilège pour accéder au portail d'administration."
              : 'Access denied: standard user accounts do not have administrative privileges to access the admin portal.'
        );
        setLoggingIn(false);
        return;
      }

      const user: AdminUser = {
        id: authenticatedUser?.id || `usr-${Date.now()}`,
        username: authenticatedUser?.username || username,
        full_name: authenticatedUser?.full_name || null,
        role: userRole,
        laboratory: authenticatedUser?.laboratory || null,
        branch: authenticatedUser?.branch || null,
        active:
          typeof authenticatedUser?.active === 'boolean'
            ? authenticatedUser.active
            : true,
        created_at: authenticatedUser?.created_at || null,
        is_primary:
          typeof authenticatedUser?.is_primary === 'boolean'
            ? authenticatedUser.is_primary
            : false,
      };

      sessionStorage.setItem('admin_user', JSON.stringify(user));
      sessionStorage.setItem('admin_token', sessionToken);

      setAdminUser(user);
      setAdminToken(sessionToken);
      setLoggedIn(true);
      setSessionExpired(false);
      setSurveysError(null);
      setUsersError(null);
      setLoginForm({
        username: '',
        password: '',
      });

      // Automatically scope filters according to user's assigned role
      if (isLabAdmin(user.role) && user.laboratory) {
        setLabFilter(user.laboratory);
        setBranchFilter('');
      } else if (isLocalAdmin(user.role)) {
        if (user.laboratory) setLabFilter(user.laboratory);
        const branches = getUserBranches(user);
        if (branches.length === 1) {
          setBranchFilter(branches[0]);
        } else {
          setBranchFilter('');
        }
      } else if (isReadOnly(user.role)) {
        if (user.laboratory) setLabFilter(user.laboratory);
        const branches = getUserBranches(user);
        if (branches.length === 1) {
          setBranchFilter(branches[0]);
        } else {
          setBranchFilter('');
        }
      }
    } catch (error) {
      console.warn('Admin login exception caught:', error);

      const message = getErrorMessage(error);

      setLoginError(
        message === 'Identifiants invalides'
          ? (lang === 'ar'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
            : lang === 'fr'
              ? "Nom d'utilisateur ou mot de passe incorrect."
              : 'Invalid username or password.')
          : (message ||
            (lang === 'ar'
              ? 'فشل تسجيل الدخول.'
              : lang === 'fr'
                ? 'Échec de la connexion.'
                : 'Login failed.'))
      );
    } finally {
      setLoggingIn(false);
    }
  };


  // ============================================================
  // Logout
  // ============================================================

  const handleLogout = async () => {
    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    try {
      if (token) {
        const { error } = await supabase.rpc('logout_user', {
          p_token: token,
        });

        if (error) {
          console.warn('logout_user RPC failed:', error);
        }
      }
    } catch (error) {
      console.warn('Logout RPC exception:', error);
    } finally {
      sessionStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_token');

      setAdminUser(null);
      setAdminToken('');
      setLoggedIn(false);
      setSessionExpired(false);
      setSurveysError(null);
      setUsersError(null);
      setLoginError('');
      setLoggingIn(false);
      setLoading(false);

      setVisitors([]);
      setSurveys([]);
      setEnquiries([]);
      setAdminUsers([]);

      setActiveTab('dashboard');
    }
  };


  // ============================================================
  // Change Own Password
  // ============================================================

  const handleChangeOwnPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChangePasswordError(null);

    const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!newPassword) {
      setChangePasswordError(
        lang === 'ar'
          ? 'يرجى إدخال كلمة المرور الجديدة.'
          : lang === 'fr'
            ? 'Veuillez saisir le nouveau mot de passe.'
            : 'Please enter the new password.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError(
        lang === 'ar'
          ? 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
          : lang === 'fr'
            ? 'Le mot de passe doit comporter au moins 6 caractères.'
            : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError(
        lang === 'ar'
          ? 'كلمتا المرور غير متطابقتين.'
          : lang === 'fr'
            ? 'Les mots de passe ne correspondent pas.'
            : 'Passwords do not match.'
      );
      return;
    }

    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    if (!token) {
      setChangePasswordError(
        lang === 'ar'
          ? 'انتهت جلسة تسجيل الدخول.'
          : 'Session expired.'
      );
      return;
    }

    setChangePasswordLoading(true);

    try {
      const res = await supabase.rpc('change_own_password', {
        p_token: token,
        p_old_password: currentPassword || null,
        p_new_password: newPassword,
      });

      if (res.error) {
        throw new Error(getErrorMessage(res.error));
      }

      const resData = Array.isArray(res.data) ? res.data[0] : res.data;
      if (resData && typeof resData === 'object' && resData.success === false) {
        throw new Error(
          String(
            resData.error ||
            resData.message ||
            (lang === 'ar' ? 'فشل تغيير كلمة المرور.' : 'Password update failed.')
          )
        );
      }

      setFeedback({
        type: 'success',
        message:
          lang === 'ar'
            ? 'تم تغيير كلمة المرور بنجاح.'
            : lang === 'fr'
              ? 'Mot de passe modifié avec succès.'
              : 'Password changed successfully.',
      });

      setShowChangePasswordModal(false);
      setChangePasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setChangePasswordError(getErrorMessage(err));
    } finally {
      setChangePasswordLoading(false);
    }
  };


  // ============================================================
  // Fetch Data
  // ============================================================
  // Prevent overlapping data refreshes
  const fetchInProgress = useRef(false);
  const fetchData = useCallback(async () => {
    if (!loggedIn) return;

    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    if (!token) {
      console.warn('No admin token available in session.');
      setSessionExpired(true);
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------------
      // Visitors
      // --------------------------------------------------------

      const visitorsRes = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      console.log(
        'VISITORS RESPONSE:',
        visitorsRes
      );

      if (visitorsRes.error) {
        console.error(
          'VISITORS ERROR:',
          visitorsRes.error
        );
      } else {
        setVisitors(
          (visitorsRes.data || []) as Visitor[]
        );
      }


      // --------------------------------------------------------
      // Enquiries
      // --------------------------------------------------------

      const enquiriesRes = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      console.log(
        'ENQUIRIES RESPONSE:',
        enquiriesRes
      );

      if (enquiriesRes.error) {
        console.error(
          'ENQUIRIES ERROR:',
          enquiriesRes.error
        );
      } else {
        setEnquiries(
          (enquiriesRes.data || []) as Enquiry[]
        );
      }


      // --------------------------------------------------------
      // Surveys
      // IMPORTANT: Token-protected RPC with server-side filtering
      // --------------------------------------------------------

      const surveysQuery = supabase.rpc('get_admin_surveys', {
        p_token: token,
      });

      const surveysRes = await surveysQuery;

      console.log(
        'SURVEYS RAW RESPONSE:',
        surveysRes
      );

      if (surveysRes.error) {
        console.warn('SURVEYS RPC ERROR:', surveysRes.error);
        const errMsg = getErrorMessage(surveysRes.error);
        if (!isSupabaseConfigured) {
          const localSurveys = loadData<Survey[]>(STORAGE_KEYS.SURVEYS, []);
          setSurveys(localSurveys);
          setSurveysError(null);
        } else {
          setSurveysError(errMsg);
          if (
            errMsg.toLowerCase().includes('expired') ||
            errMsg.toLowerCase().includes('invalid token') ||
            errMsg.toLowerCase().includes('unauthorized') ||
            surveysRes.error.code === 'P0001'
          ) {
            setSessionExpired(true);
          }
          setSurveys([]);
        }
      } else {
        setSurveysError(null);
        const rawSurveys = surveysRes.data;
        let parsedSurveys: Survey[] = [];

        if (Array.isArray(rawSurveys)) {
          parsedSurveys = rawSurveys as Survey[];
        } else if (
          rawSurveys &&
          typeof rawSurveys === 'object' &&
          'surveys' in rawSurveys &&
          Array.isArray(
            (rawSurveys as { surveys?: unknown }).surveys
          )
        ) {
          parsedSurveys = (
            rawSurveys as { surveys: Survey[] }
          ).surveys;
        } else if (
          rawSurveys &&
          typeof rawSurveys === 'object' &&
          'data' in rawSurveys &&
          Array.isArray(
            (rawSurveys as { data?: unknown }).data
          )
        ) {
          parsedSurveys = (
            rawSurveys as { data: Survey[] }
          ).data;
        }

        console.log(
          'SURVEYS PARSED DATA:',
          parsedSurveys
        );

        setSurveys(parsedSurveys);
      }


      // --------------------------------------------------------
      // Users
      // IMPORTANT: Token-protected RPC, only called for roles authorized to manage users
      // --------------------------------------------------------

      if (canManageUsers(adminUser?.role)) {
        const usersRes = await supabase.rpc(
          'list_users_scoped',
          {
            p_token: token,
          }
        );

        console.log(
          'LIST USERS RAW RESPONSE:',
          usersRes
        );

        if (usersRes.error) {
          console.warn(
            'LIST USERS RPC ERROR:',
            usersRes.error
          );
          const errMsg = getErrorMessage(usersRes.error);
          if (!isSupabaseConfigured) {
            const localUsers = loadData<AdminUserData[]>(
              STORAGE_KEYS.ADMIN_USERS,
              defaultAdminUsers
            );
            setAdminUsers(
              localUsers.map((u) => ({
                id: u.id,
                username: u.username,
                full_name: u.full_name,
                role: u.role,
                laboratory: u.laboratory || null,
                branch: u.branch || null,
                active: u.active !== false,
                is_primary: u.is_primary || u.username === 'admin',
                created_at: null,
              }))
            );
            setUsersError(null);
          } else {
            setUsersError(errMsg);
            if (
              errMsg.toLowerCase().includes('expired') ||
              errMsg.toLowerCase().includes('invalid token') ||
              errMsg.toLowerCase().includes('unauthorized') ||
              usersRes.error.code === 'P0001'
            ) {
              setSessionExpired(true);
            }
            setAdminUsers([]);
          }
        } else {
          setUsersError(null);
          const rawUsers = usersRes.data;

          console.log(
            'LIST USERS RAW DATA:',
            rawUsers
          );

          let parsedUsers: AdminUser[] = [];

          // Primary expected format: { users: [...] }
          if (
            rawUsers &&
            typeof rawUsers === 'object' &&
            'users' in rawUsers &&
            Array.isArray(
              (rawUsers as { users?: unknown }).users
            )
          ) {
            parsedUsers = (
              rawUsers as {
                users: AdminUser[];
              }
            ).users;
          }
          // Direct array: [{ id, username, ... }]
          else if (Array.isArray(rawUsers)) {
            parsedUsers = rawUsers as AdminUser[];
          }
          // Alternative object format: { data: [...] }
          else if (
            rawUsers &&
            typeof rawUsers === 'object' &&
            'data' in rawUsers &&
            Array.isArray(
              (rawUsers as { data?: unknown }).data
            )
          ) {
            parsedUsers = (
              rawUsers as {
                data: AdminUser[];
              }
            ).data;
          }

          console.log(
            'LIST USERS PARSED DATA:',
            parsedUsers
          );

          setAdminUsers(parsedUsers);
        }
      } else if (isReadOnly(adminUser?.role) && adminUser) {
        setAdminUsers([
          {
            ...adminUser,
            active: adminUser.active !== false,
          },
        ]);
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      console.warn(
        'Admin fetchData failed:',
        error
      );
    } finally {
      fetchInProgress.current = false;
      setLoading(false);
    }
  }, [
    loggedIn,
    adminToken,
    adminUser,
    branchFilter,
    labFilter,
    surveyStartDate,
    surveyEndDate,
  ]);


  // ============================================================
  // Fetch after login + automatic refresh
  // ============================================================

  useEffect(() => {
    if (!loggedIn) return;

    void fetchData();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchData();
      }
    }, 30_000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [loggedIn, fetchData]);


  // ============================================================
  // User Form Helpers
  // ============================================================

  const resetUserForm = () => {
    const defaultRole = isSuperAdmin(adminUser?.role)
      ? 'lab_admin'
      : isLabAdmin(adminUser?.role)
        ? 'local_admin'
        : 'user';
    const defaultLab = isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role)
      ? adminUser?.laboratory || ''
      : '';
    const adminBranches = getUserBranches(adminUser);
    const defaultBranch = isLocalAdmin(adminUser?.role)
      ? (adminBranches.length === 1 ? adminBranches[0] : '')
      : '';

    setUserForm({
      username: '',
      password: '',
      full_name: '',
      role: defaultRole,
      laboratory: defaultLab,
      branch: defaultBranch,
    });

    setSelectedBranches(isLocalAdmin(adminUser?.role) && adminBranches.length === 1 ? adminBranches : []);
    setEditingUserId(null);
    setUserError('');
  };


  const openCreateUserModal = () => {
    resetUserForm();
    setShowUserModal(true);
  };


  const openEditUserModal = (user: AdminUser) => {
    // Check permission to edit
    if (!canEditUser(adminUser, user)) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا تملك صلاحية تعديل هذا الحساب وفقاً لمستوى صلاحياتك الإدارية.'
            : lang === 'fr'
              ? "Vous n'avez pas l'autorisation de modifier ce compte selon vos privilèges."
              : 'You do not have permission to edit this account under your role level.',
      });
      return;
    }

    setEditingUserId(user.id);
    const parsedBranches = getUserBranches(user);
    setSelectedBranches(parsedBranches);

    setUserForm({
      username: user.username || '',
      password: '',
      full_name: user.full_name || '',
      role: user.role || 'user',
      laboratory: user.laboratory || '',
      branch: user.branch || '',
    });

    setUserError('');
    setShowUserModal(true);
  };


  const closeUserModal = () => {
    setShowUserModal(false);
    resetUserForm();
  };


  // ============================================================
  // Save User
  // ============================================================

  const handleSaveUser = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setUserError('');
    setLoading(true);

    try {
      const token =
        adminToken ||
        sessionStorage.getItem('admin_token') ||
        '';

      if (!token) {
        throw new Error('Admin session expired.');
      }

      const username =
        userForm.username.trim();

      const password =
        userForm.password;

      const role =
        userForm.role || 'user';

      if (!username) {
        throw new Error(
          lang === 'ar'
            ? 'اسم المستخدم مطلوب.'
            : lang === 'fr'
              ? "Le nom d'utilisateur est obligatoire."
              : 'Username is required.'
        );
      }

      if (!editingUserId && !password) {
        throw new Error(
          lang === 'ar'
            ? 'كلمة المرور مطلوبة.'
            : lang === 'fr'
              ? 'Le mot de passe est obligatoire.'
              : 'Password is required.'
        );
      }

      // Hierarchy authorization rules
      if (!canCreateRole(adminUser?.role, role)) {
        throw new Error(
          lang === 'ar'
            ? 'لا تملك صلاحية تعيين هذا الدور الإداري للمستخدم.'
            : lang === 'fr'
              ? "Vous n'avez pas l'autorisation d'attribuer ce rôle."
              : 'You do not have permission to assign this role.'
        );
      }

      if (isLabAdmin(adminUser?.role)) {
        if (role === 'super_admin' || role === 'admin' || role === 'lab_admin') {
          throw new Error(
            lang === 'ar'
              ? 'مدير المختبر المركزي مخول فقط بإدارة المسؤولين المحليين والمستخدمين العاديين.'
              : lang === 'fr'
                ? 'Un administrateur de laboratoire ne peut gérer que des administrateurs locaux et utilisateurs ordinaires.'
                : 'A lab administrator can only manage local administrators and standard users.'
          );
        }
      }

      if (isLocalAdmin(adminUser?.role) && role !== 'user') {
        throw new Error(
          lang === 'ar'
            ? 'المسؤول المحلي مخول فقط بإنشاء أو تعديل حسابات المستخدمين العاديين.'
            : lang === 'fr'
              ? "L'administrateur local ne peut gérer que des utilisateurs ordinaires."
              : 'Local administrators can only manage standard users.'
        );
      }

      const assignedLab =
        isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role)
          ? adminUser?.laboratory || userForm.laboratory
          : userForm.laboratory;

      let assignedBranch = userForm.branch;
      if (role === 'local_admin') {
        if (selectedBranches.length === 0) {
          throw new Error(
            lang === 'ar'
              ? 'يجب تحديد فرع واحد على الأقل للمسؤول المحلي (بحد أقصى فرعين).'
              : lang === 'fr'
                ? "Vous devez sélectionner au moins une agence (maximum 2) pour l'administrateur local."
                : 'You must select at least one branch (up to 2 branches) for a local administrator.'
          );
        }
        if (selectedBranches.length > 2) {
          throw new Error(
            lang === 'ar'
              ? 'لا يمكن تعيين أكثر من فرعين للمسؤول المحلي.'
              : lang === 'fr'
                ? "Impossible d'affecter plus de 2 agences à un administrateur local."
                : 'A local administrator cannot be assigned to more than 2 branches.'
          );
        }
        assignedBranch = selectedBranches.join(',');
      } else if (isLocalAdmin(adminUser?.role)) {
        const adminBranches = getUserBranches(adminUser);
        if (adminBranches.length > 0) {
          if (!assignedBranch) {
            assignedBranch = adminBranches[0];
          } else if (!adminBranches.includes(assignedBranch)) {
            throw new Error(
              lang === 'ar'
                ? 'لا يمكنك تعيين مستخدم في فرع خارج نطاق فروعك المصرح بها.'
                : 'You cannot assign a user to a branch outside your authorized branches.'
            );
          }
        }
      }

      // --------------------------------------------------------
      // Update existing user
      // --------------------------------------------------------

      if (editingUserId) {
        const existingUser = adminUsers.find(
          (user) => user.id === editingUserId
        );
        const active = existingUser?.active !== false;

        if (!isSupabaseConfigured) {
          // Mock mode update ONLY
          const localUsers = loadData<AdminUserData[]>(
            STORAGE_KEYS.ADMIN_USERS,
            defaultAdminUsers
          );
          const updatedLocal = localUsers.map((u) => {
            if (u.id === editingUserId) {
              return {
                ...u,
                role: role,
                full_name: userForm.full_name || u.full_name,
                laboratory: assignedLab || null,
                branch: assignedBranch || null,
                ...(password ? { password } : {}),
              };
            }
            return u;
          });
          saveData(STORAGE_KEYS.ADMIN_USERS, updatedLocal);
        } else {
          // Real Supabase update — strictly validated
          const res = await supabase.rpc('update_user_secure', {
            p_token: token,
            p_id: editingUserId,
            p_password: password || null,
            p_role: role,
            p_active: active,
            p_full_name: userForm.full_name || null,
            p_laboratory: assignedLab || null,
            p_branch: assignedBranch || null,
          });

          console.log('UPDATE USER RESPONSE:', res.data, res.error);

          if (res.error) {
            throw new Error(getErrorMessage(res.error));
          }

          const resData = Array.isArray(res.data) ? res.data[0] : res.data;
          if (resData && typeof resData === 'object') {
            if (resData.success === false || resData.error) {
              throw new Error(
                String(
                  resData.error ||
                  resData.message ||
                  (lang === 'ar'
                    ? 'فشل تحديث بيانات المستخدم في قاعدة البيانات.'
                    : lang === 'fr'
                      ? "Échec de la mise à jour de l'utilisateur."
                      : 'User update failed on the server.')
                )
              );
            }
          }
        }

        setFeedback({
          type: 'success',
          message:
            lang === 'ar'
              ? `تم تحديث بيانات المستخدم "${username}" بنجاح.`
              : lang === 'fr'
                ? `Données de l'utilisateur "${username}" mises à jour avec succès.`
                : `User "${username}" updated successfully.`,
        });
      }

      // --------------------------------------------------------
      // Create new user
      // --------------------------------------------------------


      else {
        if (!isSupabaseConfigured) {
          // Mock mode creation ONLY
          const localUsers = loadData<AdminUserData[]>(
            STORAGE_KEYS.ADMIN_USERS,
            defaultAdminUsers
          );

          const newLocalUser: AdminUserData = {
            id: `usr-${Date.now()}`,
            username,
            password,
            full_name: userForm.full_name || username,
            role,
            laboratory: assignedLab || null,
            branch: assignedBranch || null,
            active: true,
            is_primary: false,
          };

          saveData(STORAGE_KEYS.ADMIN_USERS, [
            newLocalUser,
            ...localUsers.filter(
              (u) => u.username.toLowerCase() !== username.toLowerCase()
            ),
          ]);
        } else {
          // Create user and details through one Supabase RPC.
          const { data, error } = await supabase.rpc(
            'create_user_with_details',
            {
              p_token: token,
              p_username: username.trim(),
              p_password: password,
              p_role: role,
              p_full_name: userForm.full_name?.trim() || null,
              p_laboratory: assignedLab || null,
              p_branch: assignedBranch || null,
            }
          );

          console.log('CREATE USER WITH DETAILS:', data, error);

          if (error) {
            throw new Error(getErrorMessage(error));
          }

          const resData = Array.isArray(data) ? data[0] : data;

          if (
            !resData ||
            typeof resData !== 'object' ||
            resData.success === false ||
            resData.error
          ) {
            throw new Error(
              String(
                resData?.error ||
                resData?.message ||
                (lang === 'ar'
                  ? 'فشل إنشاء الحساب في قاعدة البيانات.'
                  : lang === 'fr'
                    ? "Échec de la création du compte dans la base de données."
                    : 'Database account creation failed.')
              )
            );
          }

          const createdUser = resData.user;

          if (
            !createdUser?.id ||
            createdUser.username !== username.trim()
          ) {
            throw new Error(
              lang === 'ar'
                ? 'لم يتم تأكيد إنشاء الحساب أو أن بياناته المعادة غير مكتملة.'
                : lang === 'fr'
                  ? 'La création du compte ou les données retournées sont incomplètes.'
                  : 'Account creation was not confirmed or returned data is incomplete.'
            );
          }

          console.log('CREATED USER DETAILS:', {
            id: createdUser.id,
            username: createdUser.username,
            role: createdUser.role,
            full_name: createdUser.full_name,
            laboratory: createdUser.laboratory,
            branch: createdUser.branch,
            active: createdUser.active,
          });
        }

        setFeedback({
          type: 'success',
          message:
            lang === 'ar'
              ? `تم إنشاء حساب المستخدم "${username}" بنجاح.`
              : lang === 'fr'
                ? `Compte "${username}" créé avec succès.`
                : `User account "${username}" created successfully.`,
        });
      }


      closeUserModal();

      await fetchData();
    } catch (error) {
      console.warn('Save user error:', error);

      setUserError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // Toggle User Active
  // ============================================================

  const handleToggleUser = async (user: AdminUser) => {
    if (user.is_primary || user.username === 'admin') {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا يمكن تعطيل المستخدم الأساسي.'
            : lang === 'fr'
              ? "L'utilisateur principal ne peut pas être désactivé."
              : 'The primary user cannot be disabled.',
      });
      return;
    }

    if (!canEditUser(adminUser, user)) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا تملك صلاحية تعديل حالة هذا الحساب وفقاً لمستوى صلاحياتك.'
            : lang === 'fr'
              ? "Vous n'avez pas l'autorisation de modifier le statut de ce compte selon vos privilèges."
              : 'You do not have permission to change the status of this account under your role level.',
      });
      return;
    }

    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    if (!token) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
            : lang === 'fr'
              ? 'Session administrateur expirée. Veuillez vous reconnecter.'
              : 'Admin session expired. Please log in again.',
      });
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        const localUsers = loadData<AdminUserData[]>(
          STORAGE_KEYS.ADMIN_USERS,
          defaultAdminUsers
        );
        saveData(
          STORAGE_KEYS.ADMIN_USERS,
          localUsers.map((u) =>
            u.id === user.id ? { ...u, active: user.active === false } : u
          )
        );
      } else {

        const targetUser = adminUsers.find((u) => u.id === user.id);

        if (!targetUser) {
          throw new Error('User not found.');
        }

        const { data, error } = await supabase.rpc('update_user_secure', {
          p_token: token,
          p_id: user.id,
          p_password: null,
          p_role: targetUser.role,
          p_active: targetUser.active === false,
          p_full_name: targetUser.full_name || null,
          p_laboratory: targetUser.laboratory || null,
          p_branch: targetUser.branch || null,
        });

        if (error) {
          throw new Error(getErrorMessage(error));
        }

        const resData = Array.isArray(data) ? data[0] : data;

        if (
          resData &&
          typeof resData === 'object' &&
          (resData.success === false || resData.error)
        ) {
          throw new Error(
            String(resData.error || resData.message || 'Failed to update user status.')
          );
        }

      }

      setFeedback({
        type: 'success',
        message:
          lang === 'ar'
            ? `تم ${user.active === false ? 'تفعيل' : 'تعطيل'} حساب "${user.username}" بنجاح.`
            : lang === 'fr'
              ? `Compte "${user.username}" ${user.active === false ? 'activé' : 'désactivé'} avec succès.`
              : `Account "${user.username}" ${user.active === false ? 'enabled' : 'disabled'} successfully.`,
      });

      await fetchData();
    } catch (error) {
      console.warn('Toggle user failed:', error);
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // Open Delete Dialogs — React confirmation modal triggers
  // ============================================================

  const openDeleteUser = (user: AdminUser) => {
    if (user.is_primary || user.username === 'admin') {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا يمكن حذف المستخدم الأساسي.'
            : lang === 'fr'
              ? "L'utilisateur principal ne peut pas être supprimé."
              : 'The primary user cannot be deleted.',
      });
      return;
    }

    if (!canDeleteUser(adminUser, user)) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا تملك صلاحية حذف هذا الحساب وفقاً لمستوى صلاحياتك.'
            : lang === 'fr'
              ? "Vous n'avez pas l'autorisation de supprimer ce compte selon vos privilèges."
              : 'You do not have permission to delete this account under your role level.',
      });
      return;
    }

    setDeleteModalError(null);
    setDeleteTarget({
      type: 'user',
      id: user.id,
      name: user.username,
      title:
        lang === 'ar'
          ? 'تأكيد حذف حساب المستخدم'
          : lang === 'fr'
            ? "Confirmer la suppression de l'utilisateur"
            : 'Confirm User Deletion',
      message:
        lang === 'ar'
          ? `هل أنت متأكد من رغبتك في حذف حساب المستخدم "${user.username}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`
          : lang === 'fr'
            ? `Êtes-vous sûr de vouloir supprimer définitivement le compte utilisateur "${user.username}" ? Cette action est irréversible.`
            : `Are you sure you want to permanently delete the user account "${user.username}"? This action cannot be undone.`,
      details: [
        {
          label: lang === 'ar' ? 'اسم المستخدم' : lang === 'fr' ? "Nom d'utilisateur" : 'Username',
          value: user.username,
        },
        {
          label: lang === 'ar' ? 'الاسم الكامل' : lang === 'fr' ? 'Nom complet' : 'Full Name',
          value: user.full_name || '—',
        },
        {
          label: lang === 'ar' ? 'الدور والصلاحية' : lang === 'fr' ? 'Rôle' : 'Role',
          value: getRoleLabel(user.role, lang),
        },
      ],
      rawRecord: user,
    });
  };

  // ============================================================
  // Visitor Status
  // ============================================================

  const handleVisitorStatusChange = async (
    visitor: Visitor,
    status: string
  ) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('visitors')
        .update({ status })
        .eq('id', visitor.id);

      if (error) {
        throw error;
      }

      await fetchData();

      setFeedback({
        type: 'success',
        message:
          lang === 'ar'
            ? `تم تحديث حالة الزيارة إلى "${status}".`
            : lang === 'fr'
              ? `Statut de la visite mis à jour : "${status}".`
              : `Visitor status updated to "${status}".`,
      });
    } catch (error) {
      console.error('Visitor status update failed:', error);
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Open Delete Visitor
  // ============================================================

  const openDeleteVisitor = (visitor: Visitor) => {
    setDeleteModalError(null);
    setDeleteTarget({
      type: 'visitor',
      id: visitor.id,
      name: getVisitorName(visitor),
      title:
        lang === 'ar'
          ? 'تأكيد حذف الزيارة'
          : lang === 'fr'
            ? 'Confirmer la suppression de la visite'
            : 'Confirm Visitor Deletion',
      message:
        lang === 'ar'
          ? 'هل أنت متأكد من رغبتك في حذف سجل هذه الزيارة نهائياً من النظام؟'
          : lang === 'fr'
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cet enregistrement de visite ?'
            : 'Are you sure you want to permanently delete this visitor record?',
      details: [
        {
          label: lang === 'ar' ? 'اسم الزائر' : lang === 'fr' ? 'Nom' : 'Visitor Name',
          value: getVisitorName(visitor),
        },
        {
          label: lang === 'ar' ? 'رقم الهاتف' : lang === 'fr' ? 'Téléphone' : 'Phone',
          value: visitor.phone || '—',
        },
        {
          label: lang === 'ar' ? 'المختبر' : lang === 'fr' ? 'Laboratoire' : 'Laboratory',
          value: visitor.laboratory ? getLabLabel(visitor.laboratory, lang) : '—',
        },
        {
          label: lang === 'ar' ? 'تاريخ الزيارة' : lang === 'fr' ? 'Date de visite' : 'Visit Date',
          value: visitor.visit_date || '—',
        },
      ],
      rawRecord: visitor,
    });
  };

  const handleDeleteVisitor = async (visitor: Visitor) => {
    openDeleteVisitor(visitor);
  };

  // ============================================================
  // Open Delete Survey
  // ============================================================

  const openDeleteSurvey = (survey: Survey) => {
    setDeleteModalError(null);
    setDeleteTarget({
      type: 'survey',
      id: survey.id,
      name: survey.service_used || (survey.laboratory ? getLabLabel(survey.laboratory, lang) : 'Survey'),
      title:
        lang === 'ar'
          ? 'تأكيد حذف الاستبيان'
          : lang === 'fr'
            ? "Confirmer la suppression de l'enquête"
            : 'Confirm Survey Deletion',
      message:
        lang === 'ar'
          ? 'هل أنت متأكد من رغبتك في حذف هذا الاستبيان نهائياً من النظام؟'
          : lang === 'fr'
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cette réponse d’enquête ?'
            : 'Are you sure you want to permanently delete this survey response?',
      details: [
        {
          label: lang === 'ar' ? 'الخدمة المقيمة' : lang === 'fr' ? 'Service évalué' : 'Evaluated Service',
          value: survey.service_used || '—',
        },
        {
          label: lang === 'ar' ? 'المختبر' : lang === 'fr' ? 'Laboratoire' : 'Laboratory',
          value: survey.laboratory ? getLabLabel(survey.laboratory, lang) : '—',
        },
        {
          label: lang === 'ar' ? 'تاريخ التقديم' : lang === 'fr' ? 'Date de soumission' : 'Submitted Date',
          value: formatDate(survey.created_at),
        },
      ],
      rawRecord: survey,
    });
  };

  const handleDeleteSurvey = async (survey: Survey) => {
    openDeleteSurvey(survey);
  };

  // ============================================================
  // Enquiry Status
  // ============================================================

  const handleEnquiryStatusChange = async (
    enquiry: Enquiry,
    status: string
  ) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', enquiry.id);

      if (error) {
        throw error;
      }

      await fetchData();

      setFeedback({
        type: 'success',
        message:
          lang === 'ar'
            ? `تم تحديث حالة الاستفسار إلى "${status}".`
            : lang === 'fr'
              ? `Statut de la demande mis à jour : "${status}".`
              : `Enquiry status updated to "${status}".`,
      });
    } catch (error) {
      console.error('Enquiry status update failed:', error);
      setFeedback({
        type: 'error',
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Open Delete Enquiry
  // ============================================================

  const openDeleteEnquiry = (enquiry: Enquiry) => {
    setDeleteModalError(null);
    setDeleteTarget({
      type: 'enquiry',
      id: enquiry.id,
      name: enquiry.subject || getEnquiryName(enquiry),
      title:
        lang === 'ar'
          ? 'تأكيد حذف الاستفسار'
          : lang === 'fr'
            ? 'Confirmer la suppression de la demande'
            : 'Confirm Enquiry Deletion',
      message:
        lang === 'ar'
          ? 'هل أنت متأكد من رغبتك في حذف هذا الاستفسار نهائياً من النظام؟'
          : lang === 'fr'
            ? 'Êtes-vous sûr de vouloir supprimer définitivement cette demande ?'
            : 'Are you sure you want to permanently delete this customer enquiry?',
      details: [
        {
          label: lang === 'ar' ? 'الموضوع' : lang === 'fr' ? 'Sujet' : 'Subject',
          value: enquiry.subject || '—',
        },
        {
          label: lang === 'ar' ? 'المرسل' : lang === 'fr' ? 'Expéditeur' : 'Sender',
          value: getEnquiryName(enquiry),
        },
        {
          label: lang === 'ar' ? 'تاريخ الاستفسار' : lang === 'fr' ? 'Date de réception' : 'Received Date',
          value: formatDate(enquiry.created_at),
        },
      ],
      rawRecord: enquiry,
    });
  };

  const handleDeleteEnquiry = async (enquiry: Enquiry) => {
    openDeleteEnquiry(enquiry);
  };

  // ============================================================
  // Execute Delete — Unified Supabase Operation & Response Validation
  // ============================================================

  const executeDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    setDeleteModalError(null);

    try {
      switch (deleteTarget.type) {

        case 'visitor': {
          const token =
            adminToken ||
            sessionStorage.getItem('admin_token') ||
            '';

          if (!token) {
            setSessionExpired(true);
            throw new Error(
              lang === 'ar'
                ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
                : lang === 'fr'
                  ? 'Session administrateur expirée. Veuillez vous reconnecter.'
                  : 'Admin session expired. Please log in again.'
            );
          }

          const { data, error } = await supabase.rpc(
            'admin_delete_visitor',
            {
              p_token: token,
              p_id: deleteTarget.id,
            }
          );

          if (error) {
            const message = getErrorMessage(error).toLowerCase();

            if (
              message.includes('unauthorized') ||
              message.includes('invalid token') ||
              message.includes('expired') ||
              error.code === 'P0001'
            ) {
              setSessionExpired(true);
            }

            throw error;
          }

          const result = Array.isArray(data) ? data[0] : data;

          const confirmed =
            result === true ||
            (
              typeof result === 'object' &&
              result !== null &&
              'success' in result &&
              result.success === true &&
              !('error' in result && result.error)
            );

          if (!confirmed) {
            throw new Error(
              lang === 'ar'
                ? 'لم يؤكد الخادم حذف سجل الزائر. لم تُعرض العملية على أنها ناجحة.'
                : lang === 'fr'
                  ? 'Le serveur n’a pas confirmé la suppression. L’opération n’est pas considérée comme réussie.'
                  : 'The server did not confirm visitor deletion. The operation is not considered successful.'
            );
          }

          setVisitors((prev) =>
            prev.filter((visitor) => visitor.id !== deleteTarget.id)
          );

          setFeedback({
            type: 'success',
            message:
              lang === 'ar'
                ? 'تم حذف سجل الزيارة بنجاح.'
                : lang === 'fr'
                  ? 'Visite supprimée avec succès.'
                  : 'Visitor record deleted successfully.',
          });

          setDeleteTarget(null);
          await fetchData();
          break;
        }


        case 'survey': {
          const token =
            adminToken ||
            sessionStorage.getItem('admin_token') ||
            '';

          if (!token) {
            throw new Error(
              lang === 'ar'
                ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
                : lang === 'fr'
                  ? 'Session administrateur expirée. Veuillez vous reconnecter.'
                  : 'Admin session expired. Please log in again.'
            );
          }

          const { data, error } = await supabase.rpc('admin_delete_survey', {
            p_token: token,
            p_id: deleteTarget.id,
          });

          if (error) {
            const errMsg = getErrorMessage(error);

            if (
              errMsg.toLowerCase().includes('unauthorized') ||
              errMsg.toLowerCase().includes('invalid token') ||
              errMsg.toLowerCase().includes('expired')
            ) {
              setSessionExpired(true);
            }

            console.error('admin_delete_survey RPC failed:', error);
            throw error;
          }

          if (!data || typeof data !== 'object') {
            throw new Error(
              lang === 'ar'
                ? 'استجابة غير متوقعة من الخادم أثناء الحذف.'
                : lang === 'fr'
                  ? 'Réponse inattendue du serveur lors de la suppression.'
                  : 'Unexpected server response during survey deletion.'
            );
          }

          const result = data as {
            success?: boolean;
            error?: unknown;
            message?: string;
          };

          if (result.success !== true || result.error) {
            throw new Error(
              String(
                result.error ||
                result.message ||
                (lang === 'ar'
                  ? 'لم يؤكد الخادم حذف الاستبيان.'
                  : lang === 'fr'
                    ? "Le serveur n'a pas confirmé la suppression."
                    : 'The server did not confirm survey deletion.')
              )
            );
          }

          setSurveys((prev) =>
            prev.filter((survey) => survey.id !== deleteTarget.id)
          );

          setFeedback({
            type: 'success',
            message:
              lang === 'ar'
                ? 'تم حذف الاستبيان بنجاح.'
                : lang === 'fr'
                  ? 'Enquête supprimée avec succès.'
                  : 'Survey deleted successfully.',
          });

          setDeleteTarget(null);
          await fetchData();
          break;
        }


        case 'enquiry': {
          const token =
            adminToken ||
            sessionStorage.getItem('admin_token') ||
            '';

          if (!token) {
            throw new Error(
              lang === 'ar'
                ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
                : lang === 'fr'
                  ? 'Session administrateur expirée. Veuillez vous reconnecter.'
                  : 'Admin session expired. Please log in again.'
            );
          }

          const { data, error } = await supabase.rpc(
            'admin_delete_enquiry',
            {
              p_token: token,
              p_id: deleteTarget.id,
            }
          );

          if (error) {
            const message = getErrorMessage(error).toLowerCase();

            if (
              message.includes('unauthorized') ||
              message.includes('invalid token') ||
              message.includes('expired') ||
              error.code === 'P0001'
            ) {
              setSessionExpired(true);
            }

            throw error;
          }

          const result = Array.isArray(data) ? data[0] : data;

          if (
            !result ||
            typeof result !== 'object' ||
            result.success !== true ||
            result.error
          ) {
            throw new Error(
              String(
                result?.error ||
                result?.message ||
                (lang === 'ar'
                  ? 'لم يؤكد الخادم نجاح حذف الاستفسار.'
                  : lang === 'fr'
                    ? 'Le serveur n’a pas confirmé la suppression.'
                    : 'The server did not confirm enquiry deletion.')
              )
            );
          }

          setEnquiries((prev) =>
            prev.filter((item) => item.id !== deleteTarget.id)
          );

          setFeedback({
            type: 'success',
            message:
              lang === 'ar'
                ? 'تم حذف الاستفسار بنجاح.'
                : lang === 'fr'
                  ? 'Demande supprimée avec succès.'
                  : 'Enquiry deleted successfully.',
          });

          setDeleteTarget(null);
          await fetchData();
          break;
        }



        case 'user': {
          const token =
            adminToken ||
            sessionStorage.getItem('admin_token') ||
            '';

          if (!token) {
            throw new Error(
              lang === 'ar'
                ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
                : lang === 'fr'
                  ? 'Session administrateur expirée. Veuillez vous reconnecter.'
                  : 'Admin session expired. Please log in again.'
            );
          }

          const targetUser = adminUsers.find(
            (item) => item.id === deleteTarget.id
          );

          if (
            !targetUser ||
            !canDeleteUser(adminUser, targetUser)
          ) {
            throw new Error(
              lang === 'ar'
                ? 'لا تملك صلاحية حذف هذا الحساب.'
                : lang === 'fr'
                  ? 'Vous n’avez pas l’autorisation de supprimer ce compte.'
                  : 'You are not authorized to delete this account.'
            );
          }

          const { data, error } = await supabase.rpc(
            'delete_user_secure',
            {
              p_token: token,
              p_id: deleteTarget.id,
            }
          );

          if (error) {
            const message = getErrorMessage(error).toLowerCase();

            if (
              message.includes('unauthorized') ||
              message.includes('invalid token') ||
              message.includes('expired') ||
              error.code === 'P0001'
            ) {
              setSessionExpired(true);
            }

            throw error;
          }

          const result = Array.isArray(data) ? data[0] : data;

          if (
            !result ||
            typeof result !== 'object' ||
            result.success !== true ||
            result.error
          ) {
            throw new Error(
              String(
                result?.error ||
                result?.message ||
                (lang === 'ar'
                  ? 'لم يؤكد الخادم نجاح حذف المستخدم.'
                  : lang === 'fr'
                    ? 'Le serveur n’a pas confirmé la suppression.'
                    : 'The server did not confirm user deletion.')
              )
            );
          }

          // Local storage is used only in mock mode.
          if (!isSupabaseConfigured) {
            const localUsers = loadData<AdminUserData[]>(
              STORAGE_KEYS.ADMIN_USERS,
              defaultAdminUsers
            );

            saveData(
              STORAGE_KEYS.ADMIN_USERS,
              localUsers.filter((item) => item.id !== deleteTarget.id)
            );
          }

          setAdminUsers((prev) =>
            prev.filter((item) => item.id !== deleteTarget.id)
          );

          setFeedback({
            type: 'success',
            message:
              lang === 'ar'
                ? 'تم حذف حساب المستخدم بنجاح.'
                : lang === 'fr'
                  ? 'Compte utilisateur supprimé avec succès.'
                  : 'User account deleted successfully.',
          });

          setDeleteTarget(null);
          await fetchData();
          break;
        }

      }
    } catch (err: unknown) {
      console.error('Delete execution error:', err);
      setDeleteModalError(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  // حذف مجموعة من الاستبيانات
  const executeBulkSurveyDelete = async () => {
    if (
      bulkSurveyDeleteLoading ||
      selectedSurveyIds.length === 0 ||
      isReadOnly(adminUser?.role)
    ) {
      return;
    }

    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    if (!token) {
      setBulkSurveyDeleteError(
        lang === 'ar'
          ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
          : 'Admin session expired. Please log in again.'
      );
      return;
    }

    setBulkSurveyDeleteLoading(true);
    setBulkSurveyDeleteError(null);

    const idsToDelete = [...new Set(selectedSurveyIds)];
    const deletedIds: string[] = [];
    const failedIds: string[] = [];

    try {
      for (const id of idsToDelete) {
        try {
          const { data, error } = await supabase.rpc(
            'admin_delete_survey',
            {
              p_token: token,
              p_id: id,
            }
          );

          if (error) {
            const message = getErrorMessage(error).toLowerCase();

            if (
              message.includes('unauthorized') ||
              message.includes('invalid token') ||
              message.includes('expired')
            ) {
              setSessionExpired(true);
            }

            failedIds.push(id);
            continue;
          }

          if (!data || typeof data !== 'object') {
            failedIds.push(id);
            continue;
          }

          const result = data as {
            success?: boolean;
            error?: unknown;
            message?: string;
          };

          if (result.success === true && !result.error) {
            deletedIds.push(id);
          } else {
            failedIds.push(id);
          }
        } catch (error) {
          console.error('Survey deletion failed:', id, error);
          failedIds.push(id);
        }
      }

      if (deletedIds.length > 0) {
        setSurveys((prev) =>
          prev.filter((survey) => !deletedIds.includes(survey.id))
        );
      }

      setSelectedSurveyIds(failedIds);

      if (failedIds.length === 0) {
        setBulkSurveyDeleteOpen(false);
        setFeedback({
          type: 'success',
          message:
            lang === 'ar'
              ? `تم حذف ${deletedIds.length} استبيان بنجاح.`
              : `${deletedIds.length} survey/s deleted successfully.`,
        });
      } else {
        setBulkSurveyDeleteError(
          lang === 'ar'
            ? `تم حذف ${deletedIds.length} استبيان، وفشل حذف ${failedIds.length}.`
            : `${deletedIds.length} deleted; ${failedIds.length} failed.`
        );
      }

      await fetchData();
    } catch (error) {
      setBulkSurveyDeleteError(getErrorMessage(error));
    } finally {
      setBulkSurveyDeleteLoading(false);
    }
  };


  // حذف مجموعة من سجلات الزوار عبر دالة Supabase الآمنة
  const executeBulkVisitorDelete = async () => {
    if (
      bulkVisitorDeleteLoading ||
      selectedVisitorIds.length === 0 ||
      isReadOnly(adminUser?.role)
    ) {
      return;
    }

    setBulkVisitorDeleteLoading(true);
    setBulkVisitorDeleteError(null);

    const idsToDelete = [...new Set(selectedVisitorIds)];
    const deletedIds: string[] = [];
    const failedIds: string[] = [];

    try {
      const token =
        adminToken ||
        sessionStorage.getItem('admin_token') ||
        '';

      if (!token) {
        setSessionExpired(true);
        throw new Error(
          lang === 'ar'
            ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
            : lang === 'fr'
              ? 'Session administrateur expirée. Veuillez vous reconnecter.'
              : 'Admin session expired. Please log in again.'
        );
      }

      for (const id of idsToDelete) {
        try {
          const { data, error } = await supabase.rpc(
            'admin_delete_visitor',
            {
              p_token: token,
              p_id: id,
            }
          );

          if (error) {
            const message = getErrorMessage(error).toLowerCase();

            const isSessionError =
              message.includes('unauthorized') ||
              message.includes('invalid token') ||
              message.includes('session expired') ||
              message.includes('session has expired');

            if (isSessionError) {
              setSessionExpired(true);
              throw new Error(`SESSION_ERROR: ${getErrorMessage(error)}`);
            }

            failedIds.push(id);
            continue;
          }

          const result = Array.isArray(data) ? data[0] : data;

          if (
            !result ||
            typeof result !== 'object' ||
            result.success !== true
          ) {
            failedIds.push(id);
            continue;
          }

          deletedIds.push(id);
        } catch (error) {
          const message = getErrorMessage(error).toLowerCase();

          if (message.includes('session_error:')) {
            throw error;
          }

          const isSessionError =
            message.includes('unauthorized') ||
            message.includes('invalid token') ||
            message.includes('session expired') ||
            message.includes('session has expired');

          if (isSessionError) {
            setSessionExpired(true);
            throw error;
          }

          failedIds.push(id);
        }
      }

      if (deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);

        setVisitors((prev) =>
          prev.filter((visitor) => !deletedSet.has(visitor.id))
        );
      }

      setSelectedVisitorIds(failedIds);

      if (failedIds.length === 0) {
        setBulkVisitorDeleteOpen(false);

        setFeedback({
          type: 'success',
          message:
            lang === 'ar'
              ? `تم حذف ${deletedIds.length} سجل زائر بنجاح.`
              : lang === 'fr'
                ? `${deletedIds.length} visiteur(s) supprimé(s) avec succès.`
                : `${deletedIds.length} visitor record(s) deleted successfully.`,
        });
      } else {
        setBulkVisitorDeleteError(
          lang === 'ar'
            ? `تم حذف ${deletedIds.length} سجل، وفشل حذف ${failedIds.length}. بقيت السجلات غير المحذوفة محددة.`
            : lang === 'fr'
              ? `${deletedIds.length} supprimé(s), ${failedIds.length} échec(s). Les enregistrements non supprimés restent sélectionnés.`
              : `${deletedIds.length} deleted; ${failedIds.length} failed. Failed records remain selected.`
        );
      }

      await fetchData();
    } catch (error) {
      const message = getErrorMessage(error);

      setBulkVisitorDeleteError(message);

      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes('session_error:') ||
        normalizedMessage.includes('unauthorized') ||
        normalizedMessage.includes('invalid token') ||
        normalizedMessage.includes('session expired') ||
        normalizedMessage.includes('session has expired')
      ) {
        setSessionExpired(true);
      }
    } finally {
      setBulkVisitorDeleteLoading(false);
    }
  };


  // حذف مجموعة من الاستفسارات عبر دالة Supabase الآمنة
  const executeBulkEnquiryDelete = async () => {
    if (
      bulkEnquiryDeleteLoading ||
      selectedEnquiryIds.length === 0 ||
      isReadOnly(adminUser?.role)
    ) {
      return;
    }

    const token =
      adminToken ||
      sessionStorage.getItem('admin_token') ||
      '';

    if (!token) {
      setSessionExpired(true);
      setBulkEnquiryDeleteError(
        lang === 'ar'
          ? 'انتهت جلسة المسؤول. يرجى تسجيل الدخول مجددًا.'
          : lang === 'fr'
            ? 'Session administrateur expirée. Veuillez vous reconnecter.'
            : 'Admin session expired. Please log in again.'
      );
      return;
    }

    setBulkEnquiryDeleteLoading(true);
    setBulkEnquiryDeleteError(null);

    const idsToDelete = [...new Set(selectedEnquiryIds)];
    const deletedIds: string[] = [];
    const failedIds: string[] = [];

    try {
      for (const id of idsToDelete) {
        const { data, error } = await supabase.rpc(
          'admin_delete_enquiry',
          {
            p_token: token,
            p_id: id,
          }
        );

        if (error) {
          const message = getErrorMessage(error).toLowerCase();

          const isSessionError =
            message.includes('unauthorized') ||
            message.includes('invalid token') ||
            message.includes('session expired') ||
            message.includes('session has expired');

          if (isSessionError) {
            setSessionExpired(true);
            throw new Error(
              `SESSION_ERROR: ${getErrorMessage(error)}`
            );
          }

          console.error('Enquiry deletion failed:', id, error);
          failedIds.push(id);
          continue;
        }

        const result = Array.isArray(data) ? data[0] : data;

        if (
          !result ||
          typeof result !== 'object' ||
          result.success !== true ||
          result.error
        ) {
          failedIds.push(id);
          continue;
        }

        deletedIds.push(id);
      }

      if (deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);

        setEnquiries((prev) =>
          prev.filter((enquiry) => !deletedSet.has(enquiry.id))
        );
      }

      setSelectedEnquiryIds(failedIds);

      if (failedIds.length === 0) {
        setBulkEnquiryDeleteOpen(false);

        setFeedback({
          type: 'success',
          message:
            lang === 'ar'
              ? `تم حذف ${deletedIds.length} استفسار بنجاح.`
              : lang === 'fr'
                ? `${deletedIds.length} demande(s) supprimée(s) avec succès.`
                : `${deletedIds.length} enquiry/enquiries deleted successfully.`,
        });
      } else {
        setBulkEnquiryDeleteError(
          lang === 'ar'
            ? `تم حذف ${deletedIds.length} استفسار، وفشل حذف ${failedIds.length}. بقيت الاستفسارات التي فشل حذفها محددة.`
            : lang === 'fr'
              ? `${deletedIds.length} supprimée(s), ${failedIds.length} échec(s). Les demandes non supprimées restent sélectionnées.`
              : `${deletedIds.length} deleted; ${failedIds.length} failed. Failed enquiries remain selected.`
        );
      }

      await fetchData();
    } catch (error) {
      const message = getErrorMessage(error);

      console.error('Bulk enquiry deletion failed:', error);
      setBulkEnquiryDeleteError(message);

      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes('session_error:') ||
        normalizedMessage.includes('unauthorized') ||
        normalizedMessage.includes('invalid token') ||
        normalizedMessage.includes('session expired') ||
        normalizedMessage.includes('session has expired')
      ) {
        setSessionExpired(true);
      }
    } finally {
      setBulkEnquiryDeleteLoading(false);
    }
  };


  // ============================================================
  // Filter Visitors (Scoped by Role and Laboratory)
  // ============================================================

  const filteredVisitors = visitors.filter((visitor) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (!isLabMatch(visitor.laboratory, adminUser.laboratory)) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(visitor.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, visitor.branch)) return false;
    }
    if (isReadOnly(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(visitor.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, visitor.branch)) return false;
    }

    const search = searchTerm.trim().toLowerCase();

    const visitorText = [
      getVisitorName(visitor),
      visitor.phone,
      visitor.email,
      visitor.national_id,
      visitor.company,
      visitor.laboratory,
      visitor.branch,
      visitor.visitor_id,
      visitor.purpose,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !search || visitorText.includes(search);
    const matchesLab = !labFilter || isLabMatch(visitor.laboratory, labFilter);
    const matchesBranch = !branchFilter || isBranchMatch(visitor.branch, branchFilter);
    const matchesStatus = !statusFilter || visitor.status === statusFilter;

    return (
      matchesSearch &&
      matchesLab &&
      matchesBranch &&
      matchesStatus
    );
  });

  const overviewVisitors = visitors.filter((visitor) => {
    if (
      isLabAdmin(adminUser?.role) &&
      adminUser?.laboratory &&
      !isLabMatch(visitor.laboratory, adminUser.laboratory)
    ) {
      return false;
    }

    if (isLocalAdmin(adminUser?.role) || isReadOnly(adminUser?.role)) {
      if (
        adminUser?.laboratory &&
        !isLabMatch(visitor.laboratory, adminUser.laboratory)
      ) {
        return false;
      }

      if (!isUserBranchAuthorized(adminUser, visitor.branch)) {
        return false;
      }
    }

    return true;
  });
  // ============================================================
  // Filter Surveys (Scoped by Role and Laboratory)
  // ============================================================

  const filteredSurveys = surveys.filter((survey) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (!isLabMatch(survey.laboratory, adminUser.laboratory)) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(survey.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, survey.branch)) return false;
    }
    if (isReadOnly(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(survey.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, survey.branch)) return false;
    }

    const search = searchTerm.trim().toLowerCase();

    const surveyText = [
      survey.laboratory,
      survey.branch,
      survey.service_used,
      survey.overall_satisfaction,
      survey.liked_most,
      survey.improvements,
      survey.additional_comments,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !search || surveyText.includes(search);
    const matchesLab = !labFilter || isLabMatch(survey.laboratory, labFilter);
    const matchesBranch = !branchFilter || isBranchMatch(survey.branch, branchFilter);

    let matchesDate = true;
    if (survey.created_at) {
      const surveyTime = new Date(survey.created_at).getTime();
      if (surveyStartDate) {
        const startTime = new Date(`${surveyStartDate}T00:00:00`).getTime();
        if (surveyTime < startTime) matchesDate = false;
      }
      if (surveyEndDate) {
        const endTime = new Date(`${surveyEndDate}T23:59:59`).getTime();
        if (surveyTime > endTime) matchesDate = false;
      }
    }

    return (
      matchesSearch &&
      matchesLab &&
      matchesBranch &&
      matchesDate
    );
  });
  console.log('[SURVEYS DEBUG]', {
    role: adminUser?.role,
    laboratory: adminUser?.laboratory,
    branch: adminUser?.branch,
    totalSurveys: surveys.length,
    filteredSurveys: filteredSurveys.length,
    searchTerm,
    labFilter,
    branchFilter,
    surveyStartDate,
    surveyEndDate,
    visibleIds: filteredSurveys.map((s) => s.id),
  });
  const overviewSurveys = surveys.filter((survey) => {
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (!isLabMatch(survey.laboratory, adminUser.laboratory)) {
        return false;
      }
    }

    if (isLocalAdmin(adminUser?.role) || isReadOnly(adminUser?.role)) {
      if (
        adminUser?.laboratory &&
        !isLabMatch(survey.laboratory, adminUser.laboratory)
      ) {
        return false;
      }

      if (!isUserBranchAuthorized(adminUser, survey.branch)) {
        return false;
      }
    }

    return true;
  });
  // ============================================================
  // Filter Enquiries (Scoped by Role and Laboratory)
  // ============================================================

  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (!isLabMatch(enquiry.laboratory, adminUser.laboratory)) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(enquiry.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, enquiry.branch)) return false;
    }
    if (isReadOnly(adminUser?.role)) {
      if (adminUser?.laboratory && !isLabMatch(enquiry.laboratory, adminUser.laboratory)) return false;
      if (!isUserBranchAuthorized(adminUser, enquiry.branch)) return false;
    }

    const search = searchTerm.trim().toLowerCase();

    const enquiryText = [
      getEnquiryName(enquiry),
      enquiry.email,
      enquiry.phone,
      enquiry.laboratory,
      enquiry.branch,
      enquiry.service_required,
      enquiry.subject,
      enquiry.message,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !search || enquiryText.includes(search);
    const matchesLab = !labFilter || isLabMatch(enquiry.laboratory, labFilter);
    const matchesBranch = !branchFilter || isBranchMatch(enquiry.branch, branchFilter);
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;

    return (
      matchesSearch &&
      matchesLab &&
      matchesBranch &&
      matchesStatus
    );
  });

  const overviewEnquiries = enquiries.filter((enquiry) => {
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (!isLabMatch(enquiry.laboratory, adminUser.laboratory)) {
        return false;
      }
    }

    if (isLocalAdmin(adminUser?.role) || isReadOnly(adminUser?.role)) {
      if (
        adminUser?.laboratory &&
        !isLabMatch(enquiry.laboratory, adminUser.laboratory)
      ) {
        return false;
      }

      if (!isUserBranchAuthorized(adminUser, enquiry.branch)) {
        return false;
      }
    }

    return true;
  });


  // ============================================================
  // Filter Users (Scoped by Hierarchy Role)
  // ============================================================

  const scopedAdminUsers = adminUsers.filter((user) => {
    // Super admin: all accounts
    if (isSuperAdmin(adminUser?.role)) {
      return true;
    }

    // Lab admin: own account and accounts in the same laboratory
    if (isLabAdmin(adminUser?.role)) {
      return (
        user.id === adminUser?.id ||
        isLabMatch(user.laboratory, adminUser?.laboratory)
      );
    }

    // Local admin: own account and ordinary users in authorized branches
    if (isLocalAdmin(adminUser?.role)) {
      if (user.id === adminUser?.id) {
        return true;
      }

      if (user.role !== 'user') {
        return false;
      }

      if (!isLabMatch(user.laboratory, adminUser?.laboratory)) {
        return false;
      }

      return isUserBranchAuthorized(adminUser, user.branch);
    }

    // Ordinary user: own account only, for the Overview
    if (isReadOnly(adminUser?.role)) {
      return user.id === adminUser?.id;
    }

    return false;
  });

  const overviewAdminUsers = adminUsers.filter((user) => {
    // Le compte connecté doit toujours être visible.
    if (user.id === adminUser?.id) return true;

    // Les autres comptes visibles dans Overview doivent
    // appartenir au même laboratoire central.
    if (!isLabMatch(user.laboratory, adminUser?.laboratory)) {
      return false;
    }

    // Dans Overview, les comptes des branches sont visibles
    // uniquement si la branche est autorisée.
    if (user.branch) {
      return isUserBranchAuthorized(adminUser, user.branch);
    }

    // Compte du laboratoire central, sans branche.
    return true;
  });


  // ============================================================
  // Shared Excel XLS Export Helper
  // ============================================================

  const exportRowsToXls = (
    headers: string[],
    rows: unknown[][],
    filename: string
  ) => {
    const escapeHtml = (value: unknown): string => {
      const text =
        value === null || value === undefined ? '' : String(value);

      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const headerHtml = headers
      .map(
        (header) =>
          `<th style="background:#1f4e78;color:#fff;border:1px solid #ccc;padding:6px;">${escapeHtml(header)}</th>`
      )
      .join('');

    const bodyHtml = rows
      .map(
        (row) =>
          `<tr>${row
            .map(
              (value) =>
                `<td style="border:1px solid #ccc;padding:6px;mso-number-format:'\\@';">${escapeHtml(value)}</td>`
            )
            .join('')}</tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table {
            border-collapse: collapse;
            font-family: Arial, sans-serif;
          }
          th, td {
            padding: 6px;
            border: 1px solid #ccc;
          }
          th {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(
      ['\uFEFF', html],
      { type: 'application/vnd.ms-excel;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ============================================================
  // Visitors Export
  // ============================================================

  const exportVisitorsXls = () => {
    const headers = [
      'Visitor ID',
      'Name',
      'National ID',
      'Company',
      'Phone',
      'Email',
      'Laboratory',
      'Branch',
      'Department',
      'Employee',
      'Purpose',
      'Visit Date',
      'Arrival Time',
      'Status',
      'Notes',
      'Created At',
    ];

    const rows: unknown[][] = filteredVisitors.map((visitor) => [
      visitor.visitor_id,
      getVisitorName(visitor),
      visitor.national_id,
      visitor.company,
      visitor.phone,
      visitor.email,
      visitor.laboratory,
      visitor.branch,
      visitor.department,
      visitor.employee,
      visitor.purpose || visitor.visit_purpose,
      visitor.visit_date,
      visitor.arrival_time,
      visitor.status,
      visitor.notes,
      visitor.created_at,
    ]);

    exportRowsToXls(
      headers,
      rows,
      `visitors-${new Date().toISOString().slice(0, 10)}.xls`
    );
  };

  // ============================================================
  // Surveys Export
  // ============================================================

  const exportSurveysXls = () => {
    const headers = [
      'Survey ID',
      'Laboratory',
      'Branch',
      'Service Used',
      'Overall Satisfaction',
      'Liked Most',
      'Improvements',
      'Additional Comments',
      'Created At',
    ];

    const rows: unknown[][] = filteredSurveys.map((survey) => [
      survey.id,
      survey.laboratory,
      survey.branch,
      survey.service_used,
      survey.overall_satisfaction,
      survey.liked_most,
      survey.improvements,
      survey.additional_comments,
      survey.created_at,
    ]);

    exportRowsToXls(
      headers,
      rows,
      `surveys-${new Date().toISOString().slice(0, 10)}.xls`
    );
  };

  // ============================================================
  // Enquiries Export
  // ============================================================

  const exportEnquiriesXls = () => {
    const headers = [
      'Enquiry ID',
      'Name',
      'Email',
      'Phone',
      'Laboratory',
      'Branch',
      'Service Required',
      'Subject',
      'Message',
      'Status',
      'Created At',
    ];

    const rows: unknown[][] = filteredEnquiries.map((enquiry) => [
      enquiry.id,
      getEnquiryName(enquiry),
      enquiry.email,
      enquiry.phone,
      enquiry.laboratory,
      enquiry.branch,
      enquiry.service_required,
      enquiry.subject,
      enquiry.message,
      enquiry.status,
      enquiry.created_at,
    ]);

    exportRowsToXls(
      headers,
      rows,
      `enquiries-${new Date().toISOString().slice(0, 10)}.xls`
    );
  };

  // ============================================================
  // Users Export
  // ============================================================

  const exportUsersXls = () => {
    const headers = [
      'User ID',
      'Username',
      'Full Name',
      'Role',
      'Laboratory',
      'Branch',
      'Active',
    ];

    const rows: unknown[][] = scopedAdminUsers.map((user) => [
      user.id,
      user.username,
      user.full_name,
      user.role,
      user.laboratory,
      user.branch,
      user.active ? 'Active' : 'Inactive',
    ]);

    exportRowsToXls(
      headers,
      rows,
      `users-${new Date().toISOString().slice(0, 10)}.xls`
    );
  };


  // ============================================================
  // Main Admin Layout
  // ============================================================

  const tabs: {
    id: Tab;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
      {
        id: 'dashboard',
        label:
          lang === 'ar'
            ? 'نظرة عامة'
            : lang === 'fr'
              ? 'Vue d’ensemble'
              : 'Overview',
        icon: LayoutDashboard,
      },
      {
        id: 'visitors',
        label:
          lang === 'ar'
            ? 'الزوار'
            : lang === 'fr'
              ? 'Visiteurs'
              : 'Visitors',
        icon: Users,
      },
      {
        id: 'surveys',
        label:
          lang === 'ar'
            ? 'الاستبيانات'
            : lang === 'fr'
              ? 'Enquêtes'
              : 'Surveys',
        icon: FileText,
      },
      {
        id: 'enquiries',
        label:
          lang === 'ar'
            ? 'الاستفسارات والرسائل'
            : lang === 'fr'
              ? 'Demandes et messages'
              : 'Enquiries & Messages',
        icon: MessageSquare,
      },
      ...(canManageUsers(adminUser?.role)
        ? [
          {
            id: 'users' as Tab,
            label:
              lang === 'ar'
                ? 'إدارة المستخدمين'
                : lang === 'fr'
                  ? 'Gestion des utilisateurs'
                  : 'User Management',
            icon: UserCog,
          },
        ]
        : []),
      {
        id: 'qrcodes',
        label:
          lang === 'ar'
            ? 'رموز الاستجابة (QR)'
            : lang === 'fr'
              ? 'QR Codes'
              : 'QR Codes',
        icon: QrCode,
      },
    ];


  const statCards = [
    {
      label:
        lang === 'ar'
          ? 'الزوار'
          : lang === 'fr'
            ? 'Visiteurs'
            : 'Visitors',
      value: overviewVisitors.length,
      icon: Users,
    },
    {
      label:
        lang === 'ar'
          ? 'الاستبيانات'
          : lang === 'fr'
            ? 'Enquêtes'
            : 'Surveys',
      value: overviewSurveys.length,
      icon: FileText,
    },
    {
      label:
        lang === 'ar'
          ? 'الاستفسارات'
          : lang === 'fr'
            ? 'Demandes'
            : 'Enquiries',
      value: overviewEnquiries.length,
      icon: MessageSquare,
    },
    {
      label:
        lang === 'ar'
          ? 'المستخدمون'
          : lang === 'fr'
            ? 'Utilisateurs'
            : 'Users',
      value: overviewAdminUsers.length,
      icon: UserCog,
    },
    {
      label:
        lang === 'ar'
          ? 'رموز QR'
          : lang === 'fr'
            ? 'QR Codes'
            : 'QR Codes',
      value: isLabAdmin(adminUser?.role) && adminUser?.laboratory
        ? QR_REGISTRY.filter((q) => q.labId === adminUser.laboratory || !q.labId).length
        : QR_REGISTRY.length,
      icon: QrCode,
    },
  ];


  return (
    <div
      className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pt-[62px] xl:pt-[100px] transition-colors"
      dir={dir}
    >
      {/* ======================================================
          Header - ALWAYS rendered regardless of session state
          3-column layout:
          LEFT: Sleek Portal Badge & Title
          CENTER: Segmented Navigation Tabs (Desktop)
          RIGHT: User Badge with Role/Scope, Theme Toggle, Website Quick-Link, Pro Logout
      ======================================================= */}

      <header className="bg-[#0B132B]/95 backdrop-blur-md text-white sticky top-[62px] xl:top-[100px] z-40 border-b border-slate-800/80 shadow-sm shadow-black/20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[60px] py-2 flex items-center justify-between gap-3 lg:gap-6">
            {/* LEFT: Sleek Portal Badge & Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm sm:text-base text-white tracking-tight truncate">
                    {lang === 'ar'
                      ? 'لوحة الإدارة'
                      : lang === 'fr'
                        ? 'Tableau de bord'
                        : 'Admin Portal'}
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-400/25">
                    {lang === 'ar' ? 'المختبرات المركزية' : lang === 'fr' ? 'Laboratoires Centraux' : 'Central Laboratories'}
                  </span>
                </div>
              </div>
            </div>

            {/* CENTER: Segmented Navigation Control (Desktop) */}
            {loggedIn && (
              <nav
                aria-label={lang === 'ar' ? 'أقسام لوحة الإدارة' : lang === 'fr' ? 'Navigation de l\'administration' : 'Admin Navigation'}
                className="hidden lg:inline-flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800/90 gap-0.5"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${active
                        ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-900/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* RIGHT: User Badge + Theme Toggle + Website Link + Chic Pro Logout */}
            <div className="flex flex-nowrap items-center gap-1.5 shrink-0">
              {loggedIn && (
                <div className="hidden md:flex min-w-0 max-w-[220px] items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase shrink-0 ${isSuperAdmin(adminUser?.role)
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                    : isLabAdmin(adminUser?.role)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                      : isLocalAdmin(adminUser?.role)
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-400/40'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-400/40'
                    }`}>
                    {(adminUser?.username || 'A')[0]}
                  </div>

                  <div className="min-w-0 text-start">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-200 truncate max-w-[110px] block leading-tight text-xs">
                        {adminUser?.full_name || adminUser?.username || 'Admin'}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${isSuperAdmin(adminUser?.role)
                        ? 'bg-purple-500/25 text-purple-300 border border-purple-400/30'
                        : isLabAdmin(adminUser?.role)
                          ? 'bg-blue-500/25 text-blue-300 border border-blue-400/30'
                          : isLocalAdmin(adminUser?.role)
                            ? 'bg-teal-500/25 text-teal-300 border border-teal-400/30'
                            : 'bg-slate-700/60 text-slate-300'
                        }`}>
                        {adminUser?.role === 'super_admin' ? 'Super' : adminUser?.role === 'lab_admin' ? 'Lab Admin' : adminUser?.role === 'local_admin' ? 'Local' : adminUser?.role || 'Admin'}
                      </span>
                      {isReadOnly(adminUser?.role) && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/25 text-amber-300 border border-amber-400/30">
                          {lang === 'ar' ? 'قراءة فقط' : lang === 'fr' ? 'Lecture seule' : 'Read-only'}
                        </span>
                      )}
                    </div>

                    {adminUser?.laboratory ? (
                      <span className="text-[10px] text-blue-300/80 truncate block leading-tight">
                        {getLabLabel(adminUser.laboratory, lang)}
                        {adminUser.branch
                          ? ` • ${adminUser.branch
                            .split(',')
                            .map((b) => getBranchLabel(adminUser.laboratory!, b.trim(), lang))
                            .join(' & ')}`
                          : ''}
                      </span>
                    ) : isSuperAdmin(adminUser?.role) ? (
                      <span className="text-[10px] text-purple-300/80 truncate block leading-tight">
                        {lang === 'ar' ? 'وصول شامل لجميع المراكز' : lang === 'fr' ? 'Accès global tous centres' : 'Global Access'}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Change Password Button */}
              {loggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordError(null);
                    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setShowChangePasswordModal(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                  title={lang === 'ar' ? 'تغيير كلمة المرور' : lang === 'fr' ? 'Changer mot de passe' : 'Change Password'}
                >
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden xl:inline">
                    {lang === 'ar' ? 'كلمة المرور' : lang === 'fr' ? 'Mot de passe' : 'Password'}
                  </span>
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Mode Clair / Light' : 'Mode Sombre / Dark'}
                aria-label={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
              </button>

              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent hover:border-slate-800 transition cursor-pointer"
                title={lang === 'ar' ? 'الموقع الرئيسي' : lang === 'fr' ? 'Site web principal' : 'Website'}
              >
                <Eye className="w-3.5 h-3.5 opacity-70" />
                <span>{lang === 'ar' ? 'الموقع' : lang === 'fr' ? 'Site' : 'Website'}</span>
              </Link>

              {/* Chic, refined Pro Logout button (No harsh red!) */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-500/10 active:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-slate-700/70 hover:border-rose-500/40 text-xs font-medium transition-all shadow-xs cursor-pointer shrink-0 group"
                title={lang === 'ar' ? 'تسجيل الخروج / Logout' : lang === 'fr' ? 'Déconnexion / Logout' : 'Log Out'}
                aria-label={lang === 'ar' ? 'تسجيل الخروج / Logout' : lang === 'fr' ? 'Déconnexion / Logout' : 'Logout'}
                data-testid="logout-button"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors shrink-0" />
                <span className="sr-only">Logout </span>
                <span className="whitespace-nowrap">
                  {lang === 'ar'
                    ? 'تسجيل الخروج'
                    : lang === 'fr'
                      ? 'Déconnexion'
                      : 'Log Out'}
                </span>
              </button>
            </div>
          </div>

          {/* TABLET & MOBILE: Horizontal Navigation Tabs */}
          {loggedIn && (
            <div className="lg:hidden border-t border-slate-800/60 py-1.5">
              <nav
                aria-label={lang === 'ar' ? 'أقسام لوحة الإدارة' : lang === 'fr' ? 'Navigation mobile de l\'administration' : 'Admin Mobile Navigation'}
                className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${active
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {!loggedIn ? (
        /* Login Screen */
        <div className="flex-1 flex items-center justify-center px-4 py-16 bg-slate-100 dark:bg-slate-950 transition-colors">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8">
              <div className="flex justify-center mb-6">
                <LabLogo />
              </div>

              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-blue-700 dark:text-blue-400" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'دخول الإدارة'
                    : lang === 'fr'
                      ? 'Connexion administrateur'
                      : 'Admin Login'}
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {lang === 'ar'
                    ? 'لوحة إدارة المختبرات المركزية'
                    : lang === 'fr'
                      ? 'Administration des laboratoires centraux'
                      : 'Central Laboratories Administration'}
                </p>
              </div>

              {loginError && (
                <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {lang === 'ar'
                      ? 'اسم المستخدم'
                      : lang === 'fr'
                        ? "Nom d'utilisateur"
                        : 'Username'}
                  </label>

                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username:
                          e.target.value,
                      }))
                    }
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {lang === 'ar'
                      ? 'كلمة المرور'
                      : lang === 'fr'
                        ? 'Mot de passe'
                        : 'Password'}
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                      dir="ltr"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                      aria-label={
                        showPassword
                          ? lang === 'ar'
                            ? 'إخفاء كلمة المرور'
                            : lang === 'fr'
                              ? 'Masquer le mot de passe'
                              : 'Hide password'
                          : lang === 'ar'
                            ? 'إظهار كلمة المرور'
                            : lang === 'fr'
                              ? 'Afficher le mot de passe'
                              : 'Show password'
                      }
                      title={
                        showPassword
                          ? lang === 'ar'
                            ? 'إخفاء كلمة المرور'
                            : lang === 'fr'
                              ? 'Masquer le mot de passe'
                              : 'Hide password'
                          : lang === 'ar'
                            ? 'إظهار كلمة المرور'
                            : lang === 'fr'
                              ? 'Afficher le mot de passe'
                              : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full rounded-xl bg-blue-700 hover:bg-blue-800 text-white py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer transition shadow-xs"
                >
                  {loggingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {lang === 'ar'
                        ? 'جاري الدخول...'
                        : lang === 'fr'
                          ? 'Connexion...'
                          : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      {lang === 'ar'
                        ? 'دخول'
                        : lang === 'fr'
                          ? 'Connexion'
                          : 'Sign In'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <Link
                  to="/"
                  className="text-blue-700 hover:underline"
                >
                  {lang === 'ar'
                    ? 'العودة إلى الموقع'
                    : lang === 'fr'
                      ? 'Retour au site'
                      : 'Back to website'}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 inline-flex items-center gap-1.5 transition cursor-pointer"
                  title={lang === 'ar' ? 'تسجيل الخروج / Logout' : lang === 'fr' ? 'Déconnexion / Logout' : 'Logout'}
                  aria-label={lang === 'ar' ? 'تسجيل الخروج / Logout' : lang === 'fr' ? 'Déconnexion / Logout' : 'Logout'}
                  data-testid="login-card-logout-button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="sr-only">Logout </span>
                  <span>
                    {lang === 'ar'
                      ? 'تسجيل الخروج'
                      : lang === 'fr'
                        ? 'Déconnexion'
                        : 'Log Out'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ======================================================
              Main Content
          ======================================================= */}

          <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-8">

            {sessionExpired && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">
                      {lang === 'ar'
                        ? 'تنبيه: الجلسة منتهية الصلاحية أو غير مصرح بها'
                        : lang === 'fr'
                          ? 'Attention : session expirée ou non autorisée'
                          : 'Notice: Session expired or unauthorized'}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {lang === 'ar'
                        ? 'يرجى تسجيل الخروج ثم إعادة تسجيل الدخول لتحديث بيانات الاستبيانات والمستخدمين.'
                        : lang === 'fr'
                          ? 'Veuillez vous déconnecter et vous reconnecter pour actualiser les données.'
                          : 'Please log out and sign in again to refresh survey and user data.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap transition cursor-pointer"
                  title={lang === 'ar' ? 'تسجيل الخروج الآن / Logout' : lang === 'fr' ? 'Se déconnecter / Logout' : 'Log Out Now'}
                  aria-label={lang === 'ar' ? 'تسجيل الخروج الآن / Logout' : lang === 'fr' ? 'Se déconnecter / Logout' : 'Log Out Now'}
                  data-testid="session-expired-logout-button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="sr-only">Logout </span>
                  <span>
                    {lang === 'ar' ? 'تسجيل الخروج الآن' : lang === 'fr' ? 'Se déconnecter' : 'Log Out Now'}
                  </span>
                </button>
              </div>
            )}

            {/* ====================================================
            Filters
        ===================================================== */}

            {activeTab !== 'dashboard' &&
              activeTab !== 'users' &&
              activeTab !== 'qrcodes' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

                    <div className="relative">
                      <Search
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isRtl
                          ? 'right-3'
                          : 'left-3'
                          }`}
                      />

                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(
                            e.target.value
                          )
                        }
                        placeholder={
                          lang === 'ar'
                            ? 'بحث...'
                            : lang === 'fr'
                              ? 'Rechercher...'
                              : 'Search...'
                        }
                        className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2.5 ${isRtl
                          ? 'pr-10 pl-3'
                          : 'pl-10 pr-3'
                          } outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                    </div>


                    <select
                      value={labFilter}
                      disabled={isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role) || (isReadOnly(adminUser?.role) && !!adminUser?.laboratory)}
                      onChange={(e) => {
                        setLabFilter(
                          e.target.value
                        );
                        setBranchFilter('');
                      }}
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {lang === 'ar'
                          ? 'كل المختبرات'
                          : lang === 'fr'
                            ? 'Tous les laboratoires'
                            : 'All Laboratories'}
                      </option>

                      {LAB_HIERARCHY.map(
                        (lab) => (
                          <option
                            key={lab.id}
                            value={lab.id}
                          >
                            {getLabLabel(
                              lab.id,
                              lang
                            )}
                          </option>
                        )
                      )}
                    </select>


                    <select
                      value={branchFilter}
                      disabled={
                        (isLocalAdmin(adminUser?.role) && getUserBranches(adminUser).length <= 1) ||
                        (isReadOnly(adminUser?.role) && !!adminUser?.branch)
                      }
                      onChange={(e) =>
                        setBranchFilter(
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isLocalAdmin(adminUser?.role) && getUserBranches(adminUser).length > 1
                          ? (lang === 'ar'
                            ? `كافة الفروع المصرح بها (${getUserBranches(adminUser).length})`
                            : lang === 'fr'
                              ? `Toutes mes agences (${getUserBranches(adminUser).length})`
                              : `All Authorized Branches (${getUserBranches(adminUser).length})`)
                          : (lang === 'ar'
                            ? 'كل الفروع'
                            : lang === 'fr'
                              ? 'Toutes les agences'
                              : 'All Branches')}
                      </option>

                      {isLocalAdmin(adminUser?.role)
                        ? getUserBranches(adminUser).map((branchId) => (
                          <option key={branchId} value={branchId}>
                            {getBranchLabel(adminUser?.laboratory || '', branchId, lang)}
                          </option>
                        ))
                        : LAB_HIERARCHY
                          .filter(
                            (lab) =>
                              !labFilter ||
                              lab.id ===
                              labFilter
                          )
                          .flatMap((lab) =>
                            (lab.branches || []).map(
                              (branch) => (
                                <option
                                  key={`${lab.id}-${branch.id}`}
                                  value={branch.id}
                                >
                                  {getBranchLabel(
                                    lab.id,
                                    branch.id,
                                    lang
                                  )}
                                </option>
                              )
                            )
                          )}
                    </select>


                    {(activeTab ===
                      'visitors' ||
                      activeTab ===
                      'enquiries') && (
                        <select
                          value={statusFilter}
                          onChange={(e) =>
                            setStatusFilter(
                              e.target.value
                            )
                          }
                          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">
                            {lang === 'ar'
                              ? 'كل الحالات'
                              : lang === 'fr'
                                ? 'Tous les statuts'
                                : 'All Statuses'}
                          </option>


                          <option value="Pending">
                            {lang === 'ar' ? 'قيد الانتظار' : lang === 'fr' ? 'En attente' : 'Pending'}
                          </option>

                          <option value="Approved">
                            {lang === 'ar' ? 'تمت الموافقة' : lang === 'fr' ? 'Approuvé' : 'Approved'}
                          </option>

                          <option value="Completed">
                            {lang === 'ar' ? 'مكتمل' : lang === 'fr' ? 'Terminé' : 'Completed'}
                          </option>

                          <option value="Cancelled">
                            {lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled'}
                          </option>

                          <option value="New">
                            {lang === 'ar' ? 'جديد' : lang === 'fr' ? 'Nouveau' : 'New'}
                          </option>

                          <option value="In Progress">
                            {lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En cours' : 'In Progress'}
                          </option>

                          <option value="Resolved">
                            {lang === 'ar' ? 'تم الحل' : lang === 'fr' ? 'Résolu' : 'Resolved'}
                          </option>
                          <option value="Confirmed">
                            {lang === 'ar' ? 'تم التأكيد' : lang === 'fr' ? 'Confirmé' : 'Confirmed'}
                          </option>

                        </select>
                      )}
                  </div>
                </div>
              )}

            {/* ====================================================
                Feedback Banner (Success / Error / Info)
            ===================================================== */}
            {feedback && (
              <div
                role="alert"
                className={`p-4 rounded-2xl flex items-start justify-between gap-3 border shadow-xs animate-in fade-in duration-200 ${feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedback.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : feedback.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium leading-relaxed">{feedback.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}


            {/* ====================================================
            Loading
        ===================================================== */}

            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
              </div>
            )}


            {/* ====================================================
            Dashboard
        ===================================================== */}

            {!loading &&
              activeTab === 'dashboard' && (
                <div className="space-y-8">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {lang === 'ar'
                        ? 'نظرة عامة'
                        : lang === 'fr'
                          ? 'Vue d’ensemble'
                          : 'Overview'}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {lang === 'ar'
                        ? 'ملخص بيانات النظام'
                        : lang === 'fr'
                          ? 'Résumé des données du système'
                          : 'System data summary'}
                    </p>
                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {statCards.map(
                      (card) => {
                        const Icon =
                          card.icon;

                        return (
                          <div
                            key={card.label}
                            className="bg-white rounded-2xl border border-slate-200 p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-slate-500">
                                  {card.label}
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                  {card.value}
                                </p>
                              </div>

                              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-blue-700" />
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>


                  {/* ====================================================
                  Laboratory Activity Summary Chart (Recharts)
              ===================================================== */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {lang === 'ar'
                              ? 'نشاط المختبرات وفحص العينات (الشهر الماضي)'
                              : lang === 'fr'
                                ? 'Activité des Laboratoires & Analyse des Échantillons (Dernier Mois)'
                                : 'Laboratory Activity & Sample Analysis Throughput (Last Month)'}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {lang === 'ar'
                            ? 'معدل العينات التي تمت معالجتها وفحصها أسبوعياً وتوزيعها حسب التخصص والمختبر المركزي'
                            : lang === 'fr'
                              ? 'Volume hebdomadaire des échantillons traités par type d’analyse et par centre régional'
                              : 'Weekly sample processing volume categorized by analysis type and Central Laboratorieoratory'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {lang === 'ar' ? 'معدل المطابقة: 99.4%' : '99.4% Compliance'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {lang === 'ar' ? 'إجمالي العينات: 4,456' : 'Total Samples: 4,456'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Monthly Trend Area Chart */}
                      <div className="lg:col-span-8">
                        <div className="h-72 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={SAMPLE_ACTIVITY_LAST_MONTH}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorChemical" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorMicro" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis
                                dataKey={lang === 'ar' ? 'arPeriod' : lang === 'fr' ? 'frPeriod' : 'period'}
                                stroke="#64748b"
                                fontSize={12}
                              />
                              <YAxis stroke="#64748b" fontSize={12} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#ffffff',
                                  borderRadius: '12px',
                                  border: '1px solid #e2e8f0',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                  fontSize: '12px',
                                }}
                              />
                              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                              <Area
                                type="monotone"
                                dataKey="microbiological"
                                name={lang === 'ar' ? 'فحوصات ميكروبيولوجية' : lang === 'fr' ? 'Microbiologie' : 'Microbiological'}
                                stroke="#059669"
                                fillOpacity={1}
                                fill="url(#colorMicro)"
                              />
                              <Area
                                type="monotone"
                                dataKey="chemical"
                                name={lang === 'ar' ? 'تحاليل كيميائية' : lang === 'fr' ? 'Analyses Chimiques' : 'Chemical Analysis'}
                                stroke="#2563eb"
                                fillOpacity={1}
                                fill="url(#colorChemical)"
                              />
                              <Area
                                type="monotone"
                                dataKey="physical"
                                name={lang === 'ar' ? 'فحوصات فيزيائية ومعايرة' : lang === 'fr' ? 'Analyses Physiques' : 'Physical / Calibration'}
                                stroke="#d97706"
                                fillOpacity={1}
                                fill="url(#colorPhysical)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Central Laboratorieoratory Breakdown */}
                      <div className="lg:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                          {lang === 'ar'
                            ? 'توزيع العينات حسب المختبر المركزي'
                            : lang === 'fr'
                              ? 'Échantillons par Laboratoire Régional'
                              : 'Throughput by Central Laboratorieoratory'}
                        </h4>
                        <div className="space-y-3">
                          {LAB_Central_ACTIVITY.map((lab) => (
                            <div key={lab.name} className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold text-slate-800">
                                  {lang === 'ar' ? lab.arName : lang === 'fr' ? lab.frName : lab.name}
                                </span>
                                <span className="font-bold text-blue-700">
                                  {lab.samples.toLocaleString()}{' '}
                                  <span className="text-[10px] text-slate-500 font-normal">
                                    {lang === 'ar' ? 'عينة' : lang === 'fr' ? 'échantillons' : 'samples'}
                                  </span>
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full"
                                  style={{ width: `${(lab.samples / 1500) * 100}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                                <span>{lang === 'ar' ? 'المطابقة القياسية' : lang === 'fr' ? 'Conformité' : 'Compliance'}</span>
                                <span className="text-emerald-600 font-semibold">{lab.compliance}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-lg">
                          {lang === 'ar'
                            ? 'أحدث الزوار'
                            : lang === 'fr'
                              ? 'Derniers visiteurs'
                              : 'Recent Visitors'}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              'visitors'
                            )
                          }
                          className="text-sm text-blue-700 hover:underline"
                        >
                          {lang === 'ar'
                            ? 'عرض الكل'
                            : lang === 'fr'
                              ? 'Voir tout'
                              : 'View all'}
                        </button>
                      </div>

                      {overviewVisitors
                        .slice(0, 5)
                        .map((visitor) => (
                          <div
                            key={visitor.id}
                            className="py-3 border-b border-slate-100 last:border-0"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">
                                  {getVisitorName(
                                    visitor
                                  )}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {visitor.laboratory
                                    ? getLabLabel(
                                      visitor.laboratory,
                                      lang
                                    )
                                    : '—'}
                                </p>
                              </div>

                              <span className="text-xs text-slate-500">
                                {formatDate(
                                  visitor.created_at
                                )}
                              </span>
                            </div>
                          </div>
                        ))}

                      {overviewVisitors.length === 0 && (
                        <p className="text-sm text-slate-500">
                          {lang === 'ar'
                            ? 'لا توجد سجلات.'
                            : lang === 'fr'
                              ? 'Aucun enregistrement.'
                              : 'No records found.'}
                        </p>
                      )}
                    </div>


                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-lg">
                          {lang === 'ar'
                            ? 'أحدث الاستفسارات'
                            : lang === 'fr'
                              ? 'Dernières demandes'
                              : 'Recent Enquiries'}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              'enquiries'
                            )
                          }
                          className="text-sm text-blue-700 hover:underline"
                        >
                          {lang === 'ar'
                            ? 'عرض الكل'
                            : lang === 'fr'
                              ? 'Voir tout'
                              : 'View all'}
                        </button>
                      </div>

                      {overviewEnquiries
                        .slice(0, 5)
                        .map((enquiry) => (
                          <div
                            key={enquiry.id}
                            className="py-3 border-b border-slate-100 last:border-0"
                          >
                            <p className="font-medium truncate">
                              {enquiry.subject ||
                                getEnquiryName(
                                  enquiry
                                )}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(
                                enquiry.created_at
                              )}
                            </p>
                          </div>
                        ))}

                      {overviewEnquiries.length === 0 && (
                        <p className="text-sm text-slate-500">
                          {lang === 'ar'
                            ? 'لا توجد سجلات.'
                            : lang === 'fr'
                              ? 'Aucun enregistrement.'
                              : 'No records found.'}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              )}


            {/* ====================================================
            Visitors
        ===================================================== */}

            {!loading &&
              activeTab === 'visitors' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                  <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {lang === 'ar'
                          ? 'سجل الزوار'
                          : lang === 'fr'
                            ? 'Registre des visiteurs'
                            : 'Visitors Log'}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {filteredVisitors.length}{' '}
                        {lang === 'ar'
                          ? 'سجل'
                          : 'records'}
                      </p>
                    </div>


                    <div className="flex items-center gap-2 flex-wrap">
                      {!isReadOnly(adminUser?.role) && (
                        <button
                          type="button"
                          disabled={
                            selectedVisitorIds.length === 0 ||
                            bulkVisitorDeleteLoading
                          }
                          onClick={() => {
                            setBulkVisitorDeleteError(null);
                            setBulkVisitorDeleteOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          {lang === 'ar'
                            ? `حذف المحدد (${selectedVisitorIds.length})`
                            : lang === 'fr'
                              ? `Supprimer (${selectedVisitorIds.length})`
                              : `Delete selected (${selectedVisitorIds.length})`}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={exportVisitorsXls}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        {lang === 'ar'
                          ? 'تصدير Xls'
                          : lang === 'fr'
                            ? 'Exporter Xls'
                            : 'Export Xls'}
                      </button>
                    </div>

                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {!isReadOnly(adminUser?.role) && (
                            <th className="text-start px-4 py-3">
                              <input
                                type="checkbox"
                                checked={
                                  filteredVisitors.length > 0 &&
                                  filteredVisitors.every((visitor) =>
                                    selectedVisitorIds.includes(visitor.id)
                                  )
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedVisitorIds((prev) => [
                                      ...new Set([
                                        ...prev,
                                        ...filteredVisitors.map((visitor) => visitor.id),
                                      ]),
                                    ]);
                                  } else {
                                    setSelectedVisitorIds((prev) =>
                                      prev.filter(
                                        (id) =>
                                          !filteredVisitors.some(
                                            (visitor) => visitor.id === id
                                          )
                                      )
                                    );
                                  }
                                }}
                                aria-label={
                                  lang === 'ar'
                                    ? 'تحديد جميع الزوار'
                                    : lang === 'fr'
                                      ? 'Sélectionner tous les visiteurs'
                                      : 'Select all visitors'
                                }
                                className="h-4 w-4 cursor-pointer accent-blue-600"
                              />
                            </th>
                          )}


                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'الاسم'
                              : lang === 'fr'
                                ? 'Nom'
                                : 'Name'}
                          </th>

                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'الهاتف'
                              : lang === 'fr'
                                ? 'Téléphone'
                                : 'Phone'}
                          </th>

                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'المختبر'
                              : lang === 'fr'
                                ? 'Laboratoire'
                                : 'Laboratory'}
                          </th>

                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'التاريخ'
                              : lang === 'fr'
                                ? 'Date'
                                : 'Date'}
                          </th>

                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'الغرض'
                              : lang === 'fr'
                                ? 'Objet'
                                : 'Purpose'}
                          </th>

                          <th className="text-start px-4 py-3">
                            {lang === 'ar'
                              ? 'الحالة'
                              : lang === 'fr'
                                ? 'Statut'
                                : 'Status'}
                          </th>

                          <th className="text-end px-4 py-3">
                            {lang === 'ar'
                              ? 'إجراءات'
                              : lang === 'fr'
                                ? 'Actions'
                                : 'Actions'}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredVisitors.map(
                          (visitor) => (
                            <tr
                              key={visitor.id}
                              className="border-b border-slate-100 hover:bg-slate-50"
                            >

                              {!isReadOnly(adminUser?.role) && (
                                <td className="px-4 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedVisitorIds.includes(visitor.id)}
                                    onChange={(e) => {
                                      setSelectedVisitorIds((prev) =>
                                        e.target.checked
                                          ? [...new Set([...prev, visitor.id])]
                                          : prev.filter((id) => id !== visitor.id)
                                      );
                                    }}
                                    aria-label={
                                      lang === 'ar'
                                        ? `تحديد الزائر ${getVisitorName(visitor)}`
                                        : `Select visitor ${getVisitorName(visitor)}`
                                    }
                                    className="h-4 w-4 cursor-pointer accent-blue-600"
                                  />
                                </td>
                              )}

                              <td className="px-4 py-4">
                                <div className="font-medium">
                                  {getVisitorName(
                                    visitor
                                  )}
                                </div>

                                <div className="text-xs text-slate-500">
                                  {visitor.visitor_id ||
                                    visitor.id}
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                {visitor.phone ||
                                  '—'}
                              </td>

                              <td className="px-4 py-4">
                                <div>
                                  {visitor.laboratory
                                    ? getLabLabel(
                                      visitor.laboratory,
                                      lang
                                    )
                                    : '—'}
                                </div>

                                {visitor.branch && (
                                  <div className="text-xs text-slate-500 mt-1">
                                    {getBranchLabel(
                                      visitor.laboratory,
                                      visitor.branch,
                                      lang
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                {visitor.visit_date ||
                                  '—'}
                              </td>


                              <td className="px-4 py-4 max-w-xs">
                                <span className="line-clamp-2">
                                  {(() => {
                                    const purpose =
                                      visitor.purpose || visitor.visit_purpose || '';

                                    const translations: Record<
                                      string,
                                      { ar: string; en: string; fr: string }
                                    > = {
                                      'Job Interview': {
                                        ar: 'مقابلة عمل',
                                        en: 'Job Interview',
                                        fr: "Entretien d'embauche",
                                      },
                                    };

                                    return purpose
                                      ? translations[purpose]?.[lang] ?? purpose
                                      : '—';
                                  })()}
                                </span>
                              </td>


                              <td className="px-4 py-4">
                                {isReadOnly(adminUser?.role) ? (
                                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    {visitor.status || 'Pending'}
                                  </span>
                                ) : (
                                  <select
                                    value={visitor.status || 'Pending'}
                                    onChange={(e) =>
                                      handleVisitorStatusChange(visitor, e.target.value)
                                    }
                                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="Pending">
                                      {lang === 'ar' ? 'قيد الانتظار' : lang === 'fr' ? 'En attente' : 'Pending'}
                                    </option>
                                    <option value="Approved">
                                      {lang === 'ar' ? 'تمت الموافقة' : lang === 'fr' ? 'Approuvé' : 'Approved'}
                                    </option>
                                    <option value="Completed">
                                      {lang === 'ar' ? 'مكتمل' : lang === 'fr' ? 'Terminé' : 'Completed'}
                                    </option>
                                    <option value="Cancelled">
                                      {lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled'}
                                    </option>
                                    <option value="New">
                                      {lang === 'ar' ? 'جديد' : lang === 'fr' ? 'Nouveau' : 'New'}
                                    </option>
                                    <option value="In Progress">
                                      {lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En cours' : 'In Progress'}
                                    </option>
                                    <option value="Resolved">
                                      {lang === 'ar' ? 'تم الحل' : lang === 'fr' ? 'Résolu' : 'Resolved'}
                                    </option>
                                    <option value="Confirmed">
                                      {lang === 'ar' ? 'تم التأكيد' : lang === 'fr' ? 'Confirmé' : 'Confirmed'}
                                    </option>
                                  </select>
                                )}
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {visitor.visitor_id && (
                                    <Link
                                      to={`/visitor/${visitor.visitor_id}`}
                                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                                      title={lang === 'ar' ? 'عرض التفاصيل' : lang === 'fr' ? 'Voir' : 'View'}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  )}

                                  {!isReadOnly(adminUser?.role) && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteVisitor(
                                          visitor
                                        )
                                      }
                                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors"
                                      title={lang === 'ar' ? 'حذف' : lang === 'fr' ? 'Supprimer' : 'Delete'}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>


                  {overviewVisitors.length === 0 && (
                    <div className="py-16 text-center text-slate-500">
                      {lang === 'ar'
                        ? 'لا توجد سجلات.'
                        : lang === 'fr'
                          ? 'Aucun enregistrement.'
                          : 'No data records found'}
                    </div>
                  )}
                </div>
              )}


            {/* ====================================================
            Surveys
        ===================================================== */}

            {!loading &&
              activeTab === 'surveys' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-xl font-bold">
                        {lang === 'ar'
                          ? 'الاستبيانات'
                          : lang === 'fr'
                            ? 'Enquêtes'
                            : 'Surveys'}
                      </h2>

                      <button
                        type="button"
                        onClick={exportSurveysXls}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm shrink-0 shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {lang === 'ar'
                          ? 'تصدير Excel'
                          : lang === 'fr'
                            ? 'Exporter Excel'
                            : 'Export Excel'}
                      </button>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {filteredSurveys.length}{' '}
                      {lang === 'ar'
                        ? 'استبيان'
                        : 'records'}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      {!isReadOnly(adminUser?.role) && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const allVisibleSelected =
                                filteredSurveys.length > 0 &&
                                filteredSurveys.every((survey) =>
                                  selectedSurveyIds.includes(survey.id)
                                );

                              if (allVisibleSelected) {
                                setSelectedSurveyIds((prev) =>
                                  prev.filter(
                                    (id) =>
                                      !filteredSurveys.some(
                                        (survey) => survey.id === id
                                      )
                                  )
                                );
                              } else {
                                setSelectedSurveyIds((prev) => [
                                  ...new Set([
                                    ...prev,
                                    ...filteredSurveys.map(
                                      (survey) => survey.id
                                    ),
                                  ]),
                                ]);
                              }
                            }}
                            disabled={
                              filteredSurveys.length === 0 ||
                              bulkSurveyDeleteLoading
                            }
                            className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {filteredSurveys.length > 0 &&
                              filteredSurveys.every((survey) =>
                                selectedSurveyIds.includes(survey.id)
                              )
                              ? lang === 'ar'
                                ? 'إلغاء تحديد الكل'
                                : lang === 'fr'
                                  ? 'Tout désélectionner'
                                  : 'Clear selection'
                              : lang === 'ar'
                                ? 'تحديد الكل'
                                : lang === 'fr'
                                  ? 'Tout sélectionner'
                                  : 'Select all'}
                          </button>

                          {selectedSurveyIds.length > 0 && (
                            <>
                              <span className="text-sm text-slate-600">
                                {lang === 'ar'
                                  ? `تم تحديد ${selectedSurveyIds.length} استبيان`
                                  : lang === 'fr'
                                    ? `${selectedSurveyIds.length} enquête(s) sélectionnée(s)`
                                    : `${selectedSurveyIds.length} survey/s selected`}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setBulkSurveyDeleteError(null);
                                  setBulkSurveyDeleteOpen(true);
                                }}
                                disabled={bulkSurveyDeleteLoading}
                                className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {lang === 'ar'
                                  ? `حذف المحدد (${selectedSurveyIds.length})`
                                  : lang === 'fr'
                                    ? `Supprimer la sélection (${selectedSurveyIds.length})`
                                    : `Delete selected (${selectedSurveyIds.length})`}
                              </button>
                            </>
                          )}
                        </div>
                      )}


                    </div>

                    {/* Server-side date range and branch filters */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">{lang === 'ar' ? 'من:' : 'From:'}</span>
                        <input
                          type="date"
                          value={surveyStartDate}
                          onChange={(e) => setSurveyStartDate(e.target.value)}
                          className="outline-none bg-transparent text-slate-700 text-xs"
                          aria-label={lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">{lang === 'ar' ? 'إلى:' : 'To:'}</span>
                        <input
                          type="date"
                          value={surveyEndDate}
                          onChange={(e) => setSurveyEndDate(e.target.value)}
                          className="outline-none bg-transparent text-slate-700 text-xs"
                          aria-label={lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                        />
                      </div>

                      {(surveyStartDate || surveyEndDate || branchFilter || labFilter) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSurveyStartDate('');
                            setSurveyEndDate('');
                            setBranchFilter('');
                            setLabFilter('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                        >
                          {lang === 'ar' ? 'إعادة ضبط' : lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredSurveys.map(
                    (survey) => (
                      <div
                        key={survey.id}
                        className="bg-white rounded-2xl border border-slate-200 p-6"
                      >

                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="flex min-w-0 items-start gap-3">
                            {!isReadOnly(adminUser?.role) && (
                              <input
                                type="checkbox"
                                checked={selectedSurveyIds.includes(survey.id)}
                                onChange={(e) => {
                                  setSelectedSurveyIds((prev) =>
                                    e.target.checked
                                      ? [...new Set([...prev, survey.id])]
                                      : prev.filter((id) => id !== survey.id)
                                  );
                                }}
                                aria-label={
                                  lang === 'ar'
                                    ? 'تحديد الاستبيان'
                                    : lang === 'fr'
                                      ? "Sélectionner l'enquête"
                                      : 'Select survey'
                                }
                                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
                              />
                            )}

                            <div className="min-w-0">
                              <h3 className="font-bold">
                                {(() => {
                                  const serviceTranslations: Record<
                                    string,
                                    { ar: string; en: string; fr: string }
                                  > = {
                                    'Laboratory Testing': {
                                      ar: 'الفحوصات المخبرية',
                                      en: 'Laboratory Testing',
                                      fr: 'Analyses de laboratoire',
                                    },
                                    'Test Results / Reports': {
                                      ar: 'نتائج التحاليل / التقارير',
                                      en: 'Test Results / Reports',
                                      fr: "Résultats d'analyses / Rapports",
                                    },
                                    'Environmental Analysis': {
                                      ar: 'التحاليل البيئية',
                                      en: 'Environmental Analysis',
                                      fr: 'Analyse environnementale',
                                    },
                                    'Drinking Water Analysis': {
                                      ar: 'تحليل مياه الشرب',
                                      en: 'Drinking Water Analysis',
                                      fr: "Analyse de l'eau potable",
                                    },
                                  };

                                  const service = survey.service_used;

                                  return service
                                    ? serviceTranslations[service]?.[lang] ?? service
                                    : lang === 'ar'
                                      ? 'استبيان'
                                      : lang === 'fr'
                                        ? 'Enquête'
                                        : 'Survey';
                                })()}
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                {survey.laboratory
                                  ? getLabLabel(survey.laboratory, lang)
                                  : '—'}
                                {survey.branch
                                  ? ` • ${getBranchLabel(
                                    survey.laboratory,
                                    survey.branch,
                                    lang
                                  )}`
                                  : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {formatDate(survey.created_at)}
                            </span>

                            {!isReadOnly(adminUser?.role) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSurvey(survey)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                                title={
                                  lang === 'ar'
                                    ? 'حذف الاستبيان'
                                    : lang === 'fr'
                                      ? "Supprimer l'enquête"
                                      : 'Delete Survey'
                                }
                                aria-label={
                                  lang === 'ar'
                                    ? 'حذف الاستبيان'
                                    : lang === 'fr'
                                      ? "Supprimer l'enquête"
                                      : 'Delete Survey'
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>



                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

                          {[
                            [
                              lang === 'ar' ? 'التقييم العام' : lang === 'fr' ? 'Satisfaction globale' : 'Overall Satisfaction',
                              survey.overall_satisfaction,
                            ],
                            [
                              lang === 'ar' ? 'أداء الموظفين' : lang === 'fr' ? 'Professionnalisme du personnel' : 'Staff Professionalism',
                              survey.staff_professionalism,
                            ],
                            [
                              lang === 'ar' ? 'سرعة الخدمة' : lang === 'fr' ? 'Rapidité du service' : 'Service Speed',
                              survey.service_speed,
                            ],
                            [
                              lang === 'ar' ? 'وضوح التقارير' : lang === 'fr' ? 'Clarté des rapports' : 'Report Clarity',
                              survey.report_clarity,
                            ],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="bg-slate-50 rounded-xl p-3"
                            >
                              <p className="text-xs text-slate-500">
                                {label}
                              </p>

                              <p className="font-bold mt-1">
                                {value == null
                                  ? '—'
                                  : String(value) === 'Very Satisfied'
                                    ? lang === 'ar'
                                      ? 'راضٍ جدًا'
                                      : lang === 'fr'
                                        ? 'Très satisfait'
                                        : 'Very Satisfied'
                                    : String(value) === 'Satisfied'
                                      ? lang === 'ar'
                                        ? 'راضٍ'
                                        : lang === 'fr'
                                          ? 'Satisfait'
                                          : 'Satisfied'
                                      : String(value) === 'Neutral'
                                        ? lang === 'ar'
                                          ? 'محايد'
                                          : lang === 'fr'
                                            ? 'Neutre'
                                            : 'Neutral'
                                        : String(value) === 'Dissatisfied'
                                          ? lang === 'ar'
                                            ? 'غير راضٍ'
                                            : lang === 'fr'
                                              ? 'Insatisfait'
                                              : 'Dissatisfied'
                                          : String(value) === 'Very Dissatisfied'
                                            ? lang === 'ar'
                                              ? 'غير راضٍ جدًا'
                                              : lang === 'fr'
                                                ? 'Très insatisfait'
                                                : 'Very Dissatisfied'
                                            : value}
                              </p>
                            </div>
                          ))}

                        </div>


                        {(survey.liked_most ||
                          survey.improvements ||
                          survey.additional_comments) && (
                            <div className="space-y-3 text-sm">
                              {survey.liked_most && (
                                <div>
                                  <p className="font-semibold">
                                    {lang === 'ar'
                                      ? 'ما أعجبك:'
                                      : lang === 'fr'
                                        ? 'Ce que vous avez le plus apprécié :'
                                        : 'What you liked most:'}
                                  </p>

                                  <p className="text-slate-600 mt-1">
                                    {survey.liked_most}
                                  </p>
                                </div>
                              )}

                              {survey.improvements && (
                                <div>
                                  <p className="font-semibold">
                                    {lang === 'ar'
                                      ? 'التحسينات المقترحة:'
                                      : lang === 'fr'
                                        ? 'Améliorations proposées :'
                                        : 'Suggested improvements:'}
                                  </p>

                                  <p className="text-slate-600 mt-1">
                                    {survey.improvements}
                                  </p>
                                </div>
                              )}

                              {survey.additional_comments && (
                                <div>
                                  <p className="font-semibold">
                                    {lang === 'ar'
                                      ? 'تعليقات إضافية:'
                                      : lang === 'fr'
                                        ? 'Commentaires supplémentaires :'
                                        : 'Additional comments:'}
                                  </p>

                                  <p className="text-slate-600 mt-1">
                                    {
                                      survey.additional_comments
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                      </div>

                    )
                  )}

                  {surveysError ? (
                    <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-xs">
                      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-red-900 mb-1">
                        {surveysError.toLowerCase().includes('unauthorized') || sessionExpired
                          ? (lang === 'ar'
                            ? 'جلسة الدخول منتهية أو غير مصرح بها'
                            : lang === 'fr'
                              ? 'Session expirée ou non autorisée'
                              : 'Session Expired or Unauthorized')
                          : (lang === 'ar'
                            ? 'تعذر تحميل الاستبيانات'
                            : lang === 'fr'
                              ? 'Impossible de charger les enquêtes'
                              : 'Could not load surveys')}
                      </h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
                        {surveysError.toLowerCase().includes('unauthorized') || sessionExpired
                          ? (lang === 'ar'
                            ? 'انتهت صلاحية رمز الجلسة لتصفح الاستبيانات. يرجى تسجيل الخروج ثم إعادة تسجيل الدخول لمتابعة العمل.'
                            : lang === 'fr'
                              ? 'Votre session a expiré. Veuillez vous déconnecter et vous reconnecter.'
                              : 'Your session token has expired or is unauthorized. Please log out and sign in again.')
                          : surveysError}
                      </p>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer transition shadow-xs"
                        title={lang === 'ar' ? 'تسجيل الخروج وإعادة الدخول' : lang === 'fr' ? 'Déconnexion et reconnexion' : 'Log Out & Sign In Again'}
                        aria-label={lang === 'ar' ? 'تسجيل الخروج وإعادة الدخول' : lang === 'fr' ? 'Déconnexion et reconnexion' : 'Log Out & Sign In Again'}
                        data-testid="surveys-error-logout-button"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="sr-only">Logout </span>
                        <span>
                          {lang === 'ar'
                            ? 'تسجيل الخروج وإعادة الدخول'
                            : lang === 'fr'
                              ? 'Déconnexion et reconnexion'
                              : 'Log Out & Sign In Again'}
                        </span>
                      </button>
                    </div>
                  ) : filteredSurveys.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
                      {lang === 'ar'
                        ? 'لا توجد سجلات.'
                        : lang === 'fr'
                          ? 'Aucun enregistrement.'
                          : 'No data records found'}
                    </div>
                  ) : null}
                </div>
              )}


            {/* ====================================================
            Enquiries
        ===================================================== */}

            {!loading &&
              activeTab === 'enquiries' && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-xl font-bold">
                        {lang === 'ar'
                          ? 'الاستفسارات والرسائل'
                          : lang === 'fr'
                            ? 'Demandes et messages'
                            : 'Enquiries & Messages'}
                      </h2>

                      <button
                        type="button"
                        onClick={exportEnquiriesXls}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm shrink-0 shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {lang === 'ar'
                          ? 'تصدير Excel'
                          : lang === 'fr'
                            ? 'Exporter Excel'
                            : 'Export Excel'}
                      </button>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {filteredEnquiries.length}{' '}
                      {lang === 'ar'
                        ? 'سجل'
                        : 'records'}
                    </p>
                  </div>

                  {!isReadOnly(adminUser?.role) && filteredEnquiries.length > 0 && (
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={
                            filteredEnquiries.length > 0 &&
                            filteredEnquiries.every((enquiry) =>
                              selectedEnquiryIds.includes(enquiry.id)
                            )
                          }
                          onChange={(e) => {
                            setSelectedEnquiryIds((prev) =>
                              e.target.checked
                                ? [
                                  ...new Set([
                                    ...prev,
                                    ...filteredEnquiries.map((enquiry) => enquiry.id),
                                  ]),
                                ]
                                : prev.filter(
                                  (id) =>
                                    !filteredEnquiries.some(
                                      (enquiry) => enquiry.id === id
                                    )
                                )
                            );
                          }}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />

                        {lang === 'ar'
                          ? 'تحديد كل الاستفسارات المعروضة'
                          : lang === 'fr'
                            ? 'Tout sélectionner'
                            : 'Select all enquiries'}
                      </label>

                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {lang === 'ar'
                            ? `تم تحديد ${selectedEnquiryIds.filter((id) =>
                              filteredEnquiries.some((enquiry) => enquiry.id === id)
                            ).length}`
                            : lang === 'fr'
                              ? `${selectedEnquiryIds.filter((id) =>
                                filteredEnquiries.some((enquiry) => enquiry.id === id)
                              ).length} sélectionnée(s)`
                              : `${selectedEnquiryIds.filter((id) =>
                                filteredEnquiries.some((enquiry) => enquiry.id === id)
                              ).length} selected`}
                        </span>

                        <button
                          type="button"
                          disabled={selectedEnquiryIds.length === 0}
                          onClick={() => {
                            setBulkEnquiryDeleteError(null);
                            setBulkEnquiryDeleteOpen(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {lang === 'ar'
                            ? 'حذف المحدد'
                            : lang === 'fr'
                              ? 'Supprimer la sélection'
                              : 'Delete selected'}
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border ${selectedEnquiryIds.includes(enquiry.id)
                        ? 'border-blue-500 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800'
                        } p-6 shadow-xs`}
                    >
                      {!isReadOnly(adminUser?.role) && (
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="checkbox"
                            checked={selectedEnquiryIds.includes(enquiry.id)}
                            onChange={(e) => {
                              setSelectedEnquiryIds((prev) =>
                                e.target.checked
                                  ? [...new Set([...prev, enquiry.id])]
                                  : prev.filter((id) => id !== enquiry.id)
                              );
                            }}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                            aria-label={`Select enquiry ${enquiry.id}`}
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {lang === 'ar'
                              ? 'تحديد الاستفسار'
                              : lang === 'fr'
                                ? 'Sélectionner la demande'
                                : 'Select enquiry'}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                            {enquiry.subject ||
                              'Enquiry'}
                          </h3>

                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {getEnquiryName(
                              enquiry
                            )}

                            {enquiry.email
                              ? ` • ${enquiry.email}`
                              : ''}
                          </p>

                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {formatDate(
                              enquiry.created_at
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isReadOnly(adminUser?.role) ? (
                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {enquiry.status || 'New'}
                            </span>
                          ) : (
                            <select
                              value={
                                enquiry.status ||
                                'New'
                              }
                              onChange={(e) =>
                                handleEnquiryStatusChange(
                                  enquiry,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Pending">
                                {lang === 'ar' ? 'قيد الانتظار' : lang === 'fr' ? 'En attente' : 'Pending'}
                              </option>

                              <option value="Approved">
                                {lang === 'ar' ? 'تمت الموافقة' : lang === 'fr' ? 'Approuvé' : 'Approved'}
                              </option>

                              <option value="Completed">
                                {lang === 'ar' ? 'مكتمل' : lang === 'fr' ? 'Terminé' : 'Completed'}
                              </option>

                              <option value="Cancelled">
                                {lang === 'ar' ? 'ملغي' : lang === 'fr' ? 'Annulé' : 'Cancelled'}
                              </option>

                              <option value="New">
                                {lang === 'ar' ? 'جديد' : lang === 'fr' ? 'Nouveau' : 'New'}
                              </option>

                              <option value="In Progress">
                                {lang === 'ar' ? 'قيد المعالجة' : lang === 'fr' ? 'En cours' : 'In Progress'}
                              </option>

                              <option value="Resolved">
                                {lang === 'ar' ? 'تم الحل' : lang === 'fr' ? 'Résolu' : 'Resolved'}
                              </option>

                              <option value="Confirmed">
                                {lang === 'ar' ? 'تم التأكيد' : lang === 'fr' ? 'Confirmé' : 'Confirmed'}
                              </option>
                            </select>
                          )}

                          {!isReadOnly(adminUser?.role) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteEnquiry(
                                  enquiry
                                )
                              }
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                              title={lang === 'ar' ? 'حذف' : lang === 'fr' ? 'Supprimer' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>


                      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500">
                            {lang === 'ar'
                              ? 'المختبر'
                              : 'Laboratory'}
                          </span>

                          <p className="font-medium mt-1">
                            {enquiry.laboratory
                              ? getLabLabel(
                                enquiry.laboratory,
                                lang
                              )
                              : '—'}
                          </p>
                        </div>

                        <div>
                          <span className="text-slate-500">
                            {lang === 'ar'
                              ? 'الفرع'
                              : 'Branch'}
                          </span>

                          <p className="font-medium mt-1">
                            {enquiry.branch
                              ? getBranchLabel(
                                enquiry.laboratory,
                                enquiry.branch,
                                lang
                              )
                              : '—'}
                          </p>
                        </div>


                        <div>
                          <span className="text-slate-500">
                            {lang === 'ar'
                              ? 'الخدمة المطلوبة'
                              : lang === 'fr'
                                ? 'Service demandé'
                                : 'Requested Service'}
                          </span>

                          <p className="font-medium mt-1">
                            {(() => {
                              const service = APPROVED_SERVICES.find(
                                (item) => item.value === enquiry.service_required
                              );

                              return service
                                ? service[lang]
                                : enquiry.service_required || '—';
                            })()}
                          </p>
                        </div>

                      </div>


                      {enquiry.message && (
                        <div className="mt-5 p-4 bg-slate-50 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">
                          {enquiry.message}
                        </div>
                      )}
                    </div>
                  ))}


                  {
                    filteredEnquiries.length === 0 && (
                      <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
                        {lang === 'ar'
                          ? 'لا توجد سجلات.'
                          : lang === 'fr'
                            ? 'Aucun enregistrement.'
                            : 'No data records found'}
                      </div>
                    )
                  }
                </div>
              )}


            {/* ====================================================
            Users
        ===================================================== */}

            {!loading &&
              activeTab === 'users' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">

                  <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'ar'
                          ? 'إدارة المستخدمين'
                          : lang === 'fr'
                            ? 'Gestion des utilisateurs'
                            : 'User Management'}
                      </h2>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {scopedAdminUsers.length}{' '}
                        {lang === 'ar'
                          ? 'مستخدم متاح في نطاقك'
                          : lang === 'fr'
                            ? 'utilisateur(s) dans votre périmètre'
                            : 'users in your scope'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={exportUsersXls}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        {lang === 'ar'
                          ? 'تصدير Excel'
                          : lang === 'fr'
                            ? 'Exporter Excel'
                            : 'Export Excel'}
                      </button>
                      <button
                        type="button"
                        onClick={
                          openCreateUserModal
                        }
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium cursor-pointer transition shadow-xs"
                      >
                        <Plus className="w-4 h-4" />

                        {lang === 'ar'
                          ? 'إضافة مستخدم'
                          : lang === 'fr'
                            ? 'Ajouter un utilisateur'
                            : 'Add User'}

                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          <tr>
                            <th className="text-start px-4 py-3">
                              {lang === 'ar'
                                ? 'الاسم الكامل'
                                : lang === 'fr'
                                  ? 'Nom complet'
                                  : 'Full Name'}
                            </th>

                            <th className="text-start px-4 py-3">
                              {lang === 'ar'
                                ? 'اسم المستخدم'
                                : lang === 'fr'
                                  ? "Nom d'utilisateur"
                                  : 'Username'}
                            </th>

                            <th className="text-start px-4 py-3">
                              {lang === 'ar'
                                ? 'الدور والنطاق'
                                : lang === 'fr'
                                  ? 'Rôle & Périmètre'
                                  : 'Role & Scope'}
                            </th>

                            <th className="text-start px-4 py-3">
                              {lang === 'ar'
                                ? 'الحالة'
                                : lang === 'fr'
                                  ? 'Statut'
                                  : 'Status'}
                            </th>

                            <th className="text-end px-4 py-3">
                              {lang === 'ar'
                                ? 'إجراءات'
                                : lang === 'fr'
                                  ? 'Actions'
                                  : 'Actions'}
                            </th>
                          </tr>
                        </thead>


                        <tbody>
                          {scopedAdminUsers.map(
                            (user) => (
                              <tr
                                key={user.id}
                                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="px-4 py-4">
                                  <div className="font-medium text-slate-900 dark:text-slate-100">
                                    {user.full_name ||
                                      '—'}
                                  </div>

                                  {user.is_primary && (
                                    <span className="inline-flex mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                      Primary
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-4 font-mono text-sm text-slate-700 dark:text-slate-300">
                                  {user.username}
                                </td>

                                <td className="px-4 py-4">
                                  <div className="space-y-1">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'super_admin' || user.role === 'admin'
                                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                      : user.role === 'lab_admin'
                                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                        : user.role === 'local_admin'
                                          ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                      }`}>
                                      {getRoleLabel(user.role, lang)}
                                    </span>

                                    {user.laboratory && (
                                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                        <span>{getLabLabel(user.laboratory, lang)}</span>
                                        {user.branch && (
                                          <span>• {getBranchLabel(user.laboratory, user.branch, lang)}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${user.active ===
                                      false
                                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                                      : 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900/50'
                                      }`}
                                  >
                                    {user.active ===
                                      false
                                      ? lang === 'ar'
                                        ? 'غير نشط'
                                        : lang === 'fr'
                                          ? 'Inactif'
                                          : 'Inactive'
                                      : lang === 'ar'
                                        ? 'نشط'
                                        : lang === 'fr'
                                          ? 'Actif'
                                          : 'Active'}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-center justify-end gap-2">

                                    {/* Edit button */}
                                    {canEditUser(adminUser, user) && (
                                      <button
                                        type="button"
                                        onClick={() => openEditUserModal(user)}
                                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400 transition-colors cursor-pointer"
                                        title={lang === 'ar' ? 'تعديل' : lang === 'fr' ? 'Modifier' : 'Edit'}
                                      >
                                        <UserCog className="w-4 h-4" />
                                      </button>
                                    )}

                                    {canEditUser(adminUser, user) && !user.is_primary && user.username !== 'admin' && (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleUser(user)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${user.active === false
                                          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                                          }`}
                                      >
                                        {user.active === false
                                          ? (lang === 'ar' ? 'تفعيل' : lang === 'fr' ? 'Activer' : 'Enable')
                                          : (lang === 'ar' ? 'تعطيل' : lang === 'fr' ? 'Désactiver' : 'Disable')}
                                      </button>
                                    )}

                                    {canDeleteUser(adminUser, user) && (
                                      <button
                                        type="button"
                                        onClick={() => openDeleteUser(user)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer transition"
                                        title={lang === 'ar' ? 'حذف' : lang === 'fr' ? 'Supprimer' : 'Delete'}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>


                    {usersError ? (
                      <div className="py-12 px-6 text-center bg-red-50 border-t border-red-200">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base text-red-900 mb-1">
                          {usersError.toLowerCase().includes('unauthorized') || sessionExpired
                            ? (lang === 'ar'
                              ? 'جلسة الدخول منتهية أو غير مصرح بها'
                              : lang === 'fr'
                                ? 'Session expirée ou non autorisée'
                                : 'Session Expired or Unauthorized')
                            : (lang === 'ar'
                              ? 'تعذر تحميل المستخدمين'
                              : lang === 'fr'
                                ? 'Impossible de charger les utilisateurs'
                                : 'Could not load users')}
                        </h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
                          {usersError.toLowerCase().includes('unauthorized') || sessionExpired
                            ? (lang === 'ar'
                              ? 'انتهت صلاحية رمز الجلسة للوصول إلى إدارة المستخدمين. يرجى تسجيل الخروج ثم إعادة تسجيل الدخول.'
                              : lang === 'fr'
                                ? 'Votre session a expiré. Veuillez vous déconnecter et vous reconnecter.'
                                : 'Your session token has expired or is unauthorized. Please log out and sign in again.')
                            : usersError}
                        </p>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer transition shadow-xs"
                          title={lang === 'ar' ? 'تسجيل الخروج وإعادة الدخول' : lang === 'fr' ? 'Déconnexion et reconnexion' : 'Log Out & Sign In Again'}
                          aria-label={lang === 'ar' ? 'تسجيل الخروج وإعادة الدخول' : lang === 'fr' ? 'Déconnexion et reconnexion' : 'Log Out & Sign In Again'}
                          data-testid="users-error-logout-button"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="sr-only">Logout </span>
                          <span>
                            {lang === 'ar'
                              ? 'تسجيل الخروج وإعادة الدخول'
                              : lang === 'fr'
                                ? 'Déconnexion et reconnexion'
                                : 'Log Out & Sign In Again'}
                          </span>
                        </button>
                      </div>
                    ) : scopedAdminUsers.length === 0 ? (
                      <div className="py-16 text-center bg-white dark:bg-slate-900">
                        <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          <UserCog className="w-7 h-7 text-slate-400" />
                        </div>

                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {lang === 'ar'
                            ? 'لا توجد بيانات مستخدمين في هذا النطاق'
                            : lang === 'fr'
                              ? 'Aucun utilisateur trouvé dans ce périmètre'
                              : 'No user accounts found in this scope'}
                        </p>
                      </div>
                    ) : null}
                  </div>
              )}

                  {/* ====================================================
                QR Codes Module
            ===================================================== */}

                  {!loading && activeTab === 'qrcodes' && (
                    <QrCodesModule currentLabId={adminUser?.laboratory || null} />
                  )}
                </main>
        </>
          )
      }


          {/* ======================================================
          User Modal
      ======================================================= */}

          {
            showUserModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div
                  className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
                  dir={dir}
                >

                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold">
                        {editingUserId
                          ? lang === 'ar'
                            ? 'تعديل المستخدم'
                            : lang === 'fr'
                              ? "Modifier l'utilisateur"
                              : 'Edit User'
                          : lang === 'ar'
                            ? 'إضافة مستخدم'
                            : lang === 'fr'
                              ? 'Ajouter un utilisateur'
                              : 'Add New User'}
                      </h2>

                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {editingUserId
                          ? lang === 'ar'
                            ? 'تحديث بيانات المستخدم وصلاحياته'
                            : lang === 'fr'
                              ? "Mettre à jour l'utilisateur et ses permissions"
                              : 'Update user information and permissions'
                          : lang === 'ar'
                            ? 'إنشاء حساب جديد في نطاق صلاحياتك الإدارية'
                            : lang === 'fr'
                              ? 'Créer un nouveau compte dans votre périmètre'
                              : 'Create a new user within your authorized scope'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeUserModal}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>


                  <form
                    onSubmit={handleSaveUser}
                    className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
                  >

                    {userError && (
                      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{userError}</span>
                      </div>
                    )}


                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {lang === 'ar'
                          ? 'الاسم الكامل'
                          : lang === 'fr'
                            ? 'Nom complet'
                            : 'Full Name'}
                      </label>

                      <input
                        type="text"
                        value={userForm.full_name}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                        placeholder={lang === 'ar' ? 'مثال: د. عبدالله الشهري' : 'e.g. Dr. Abdullah'}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {lang === 'ar'
                          ? 'اسم المستخدم'
                          : lang === 'fr'
                            ? "Nom d'utilisateur"
                            : 'Username'}
                      </label>

                      <input
                        type="text"
                        value={userForm.username}
                        disabled={!!editingUserId}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="e.g. user_asir"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500"
                        dir="ltr"
                      />
                    </div>



                    <div className="relative">
                      <input
                        type={showNewUserPassword ? 'text' : 'password'}
                        value={userForm.password}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder={
                          editingUserId
                            ? '••••••••'
                            : ''
                        }
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                        dir="ltr"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewUserPassword((prev) => !prev)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                        aria-label={
                          showNewUserPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        title={
                          showNewUserPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showNewUserPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>



                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {lang === 'ar'
                          ? 'الدور الإداري'
                          : lang === 'fr'
                            ? 'Rôle administratif'
                            : 'Administrative Role'}
                      </label>

                      <select
                        value={userForm.role}
                        disabled={isLocalAdmin(adminUser?.role)}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setUserForm((prev) => ({
                            ...prev,
                            role: newRole,
                            laboratory: newRole === 'super_admin' ? '' : prev.laboratory,
                            branch: newRole === 'super_admin' ? '' : prev.branch,
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60"
                      >
                        {isSuperAdmin(adminUser?.role) && (
                          <option value="super_admin">
                            {lang === 'ar'
                              ? 'مشرف عام (وصول شامل لكافة المختبرات والفروع)'
                              : lang === 'fr'
                                ? 'Super Admin (Accès global)'
                                : 'Super Admin (Global Access)'}
                          </option>
                        )}

                        {isSuperAdmin(adminUser?.role) && (
                          <option value="lab_admin">
                            {lang === 'ar'
                              ? 'مدير مختبر مركزي (إدارة المختبر وفروعه)'
                              : lang === 'fr'
                                ? 'Administrateur de Laboratoire'
                                : 'Lab Administrator'}
                          </option>
                        )}

                        {(isSuperAdmin(adminUser?.role) || isLabAdmin(adminUser?.role)) && (
                          <option value="local_admin">
                            {lang === 'ar'
                              ? 'مسؤول محلي (فرع محدد)'
                              : lang === 'fr'
                                ? 'Administrateur Local'
                                : 'Local Administrator'}
                          </option>
                        )}

                        <option value="user">
                          {lang === 'ar'
                            ? 'مستخدم عادي (قراءة فقط للسجلات)'
                            : lang === 'fr'
                              ? 'Utilisateur standard (Lecture seule)'
                              : 'Standard User (Read-Only)'}
                        </option>
                      </select>

                      {isLabAdmin(adminUser?.role) && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {lang === 'ar'
                            ? 'بصفتك مدير مختبر، يمكنك إنشاء حسابات المسؤولين المحليين والمستخدمين العاديين فقط.'
                            : lang === 'fr'
                              ? 'En tant que directeur de labo, vous ne pouvez créer que des admins locaux et utilisateurs.'
                              : 'As a Lab Admin, you can only create Local Administrators and Standard Users.'}
                        </p>
                      )}

                      {isLocalAdmin(adminUser?.role) && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {lang === 'ar'
                            ? 'بصفتك مسؤولاً محلياً، يمكنك فقط إدارة حسابات المستخدمين العاديين في فرعك.'
                            : lang === 'fr'
                              ? 'En tant qu’admin local, vous ne pouvez gérer que des utilisateurs standard de votre agence.'
                              : 'As a Local Admin, you can only manage standard users for your branch.'}
                        </p>
                      )}
                    </div>


                    {userForm.role !== 'super_admin' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {lang === 'ar'
                            ? 'المختبر المركزي المعيّن'
                            : lang === 'fr'
                              ? 'Laboratoire central'
                              : 'Assigned Central Laboratory'}
                        </label>

                        <select
                          value={userForm.laboratory || ''}
                          disabled={isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role)}
                          onChange={(e) => {
                            const newLab = e.target.value;
                            setUserForm((prev) => ({
                              ...prev,
                              laboratory: newLab,
                              branch: '',
                            }));
                          }}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60"
                        >
                          <option value="">
                            {lang === 'ar'
                              ? '— اختر المختبر المركزي —'
                              : lang === 'fr'
                                ? '— Choisir le laboratoire —'
                                : '— Select Central Laboratory —'}
                          </option>

                          {LAB_HIERARCHY.map((lab) => (
                            <option key={lab.id} value={lab.id}>
                              {getLabLabel(lab.id, lang)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}


                    {userForm.laboratory && userForm.role === 'local_admin' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            {lang === 'ar'
                              ? 'الفروع المصرح بها (اختر فرعاً واحداً أو فرعين كحد أقصى)'
                              : lang === 'fr'
                                ? 'Agences autorisées (Sélectionnez 1 ou 2 agences maximum)'
                                : 'Authorized Branches (Select 1 or 2 branches maximum)'}
                          </label>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedBranches.length > 0 && selectedBranches.length <= 2
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}>
                            {selectedBranches.length} / 2 {lang === 'ar' ? 'فروع' : 'branches'}
                          </span>
                        </div>

                        <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                          {(LAB_HIERARCHY.find((l) => l.id === userForm.laboratory)?.branches || []).map((branch) => {
                            const isChecked = selectedBranches.includes(branch.id);
                            const isDisabled = !isChecked && selectedBranches.length >= 2;

                            return (
                              <label
                                key={branch.id}
                                className={`flex items-center gap-3 p-2.5 rounded-lg border transition select-none ${isChecked
                                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-200 font-medium'
                                  : isDisabled
                                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                                    : 'hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={isDisabled}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      if (selectedBranches.length < 2) {
                                        const next = [...selectedBranches, branch.id];
                                        setSelectedBranches(next);
                                        setUserForm((prev) => ({ ...prev, branch: next.join(',') }));
                                      }
                                    } else {
                                      const next = selectedBranches.filter((b) => b !== branch.id);
                                      setSelectedBranches(next);
                                      setUserForm((prev) => ({ ...prev, branch: next.join(',') }));
                                    }
                                  }}
                                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-sm">
                                  {getBranchLabel(userForm.laboratory!, branch.id, lang)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                          {lang === 'ar'
                            ? 'يمكن تعيين المسؤول المحلي لإدارة فرع واحد أو فرعين في آن واحد ضمن نفس المختبر المركزي.'
                            : lang === 'fr'
                              ? "Un administrateur local peut être affecté à 1 ou 2 agences simultanément au sein du même laboratoire."
                              : 'A local administrator can be assigned to 1 or 2 branches simultaneously within the same laboratory.'}
                        </p>
                      </div>
                    )}

                    {userForm.laboratory && userForm.role !== 'local_admin' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {lang === 'ar'
                            ? 'الفرع المعيّن'
                            : lang === 'fr'
                              ? 'Agence / Branche'
                              : 'Assigned Branch'}
                        </label>

                        <select
                          value={userForm.branch || ''}
                          onChange={(e) =>
                            setUserForm((prev) => ({
                              ...prev,
                              branch: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60"
                        >
                          {!isLocalAdmin(adminUser?.role) && (
                            <option value="">
                              {lang === 'ar'
                                ? 'المقر الرئيسي للمختبر المركزي (كافة الفروع)'
                                : lang === 'fr'
                                  ? 'Siège central du laboratoire (Toutes agences)'
                                  : 'Main Central Lab Office (All Branches)'}
                            </option>
                          )}

                          {(isLocalAdmin(adminUser?.role)
                            ? (LAB_HIERARCHY.find((l) => l.id === userForm.laboratory)?.branches || []).filter((b) =>
                              getUserBranches(adminUser).includes(b.id)
                            )
                            : (LAB_HIERARCHY.find((l) => l.id === userForm.laboratory)?.branches || [])
                          ).map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {getBranchLabel(userForm.laboratory!, branch.id, lang)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}


                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={closeUserModal}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        {lang === 'ar'
                          ? 'إلغاء'
                          : lang === 'fr'
                            ? 'Annuler'
                            : 'Cancel'}
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium flex items-center gap-2 disabled:opacity-60 transition shadow-xs cursor-pointer"
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}

                        {editingUserId
                          ? lang === 'ar'
                            ? 'حفظ التعديلات'
                            : lang === 'fr'
                              ? 'Enregistrer'
                              : 'Save Changes'
                          : lang === 'ar'
                            ? 'إنشاء المستخدم'
                            : lang === 'fr'
                              ? 'Créer'
                              : 'Create User'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )
          }

          {/* ============================================================
          CHANGE PASSWORD MODAL
      ============================================================= */}
          {showChangePasswordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-200">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'ar' ? 'تغيير كلمة المرور' : lang === 'fr' ? 'Modifier le mot de passe' : 'Change Password'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {adminUser?.username} ({getRoleLabel(adminUser?.role || '', lang)})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleChangeOwnPassword} className="p-5 space-y-4">
                  {changePasswordError && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex gap-2.5 items-start">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{changePasswordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'ar' ? 'كلمة المرور الحالية' : lang === 'fr' ? 'Mot de passe actuel' : 'Current Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showChangePwdCurrent ? 'text' : 'password'}
                        value={changePasswordForm.currentPassword}
                        onChange={(e) =>
                          setChangePasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowChangePwdCurrent((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showChangePwdCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'ar' ? 'كلمة المرور الجديدة' : lang === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showChangePwdNew ? 'text' : 'password'}
                        value={changePasswordForm.newPassword}
                        onChange={(e) =>
                          setChangePasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 pr-11 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowChangePwdNew((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showChangePwdNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {lang === 'ar' ? 'يجب ألا تقل عن 6 أحرف' : 'Minimum 6 characters'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : lang === 'fr' ? 'Confirmer le mot de passe' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      value={changePasswordForm.confirmPassword}
                      onChange={(e) =>
                        setChangePasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowChangePasswordModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={changePasswordLoading}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center gap-2 disabled:opacity-60 transition shadow-xs cursor-pointer"
                    >
                      {changePasswordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {lang === 'ar' ? 'حفظ كلمة المرور' : lang === 'fr' ? 'Enregistrer' : 'Save Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


          {/* ============================================================
          CONFIRM DELETE MODAL (Visitors, Surveys, Enquiries, Users)
      ============================================================= */}
          {deleteTarget && (
            <ConfirmModal
              isOpen={Boolean(deleteTarget)}
              onClose={() => {
                if (!deleteLoading) {
                  setDeleteTarget(null);
                  setDeleteModalError(null);
                }
              }}
              onConfirm={executeDelete}
              title={deleteTarget.title}
              message={deleteTarget.message}
              itemName={deleteTarget.name}
              details={deleteTarget.details}
              confirmText={
                lang === 'ar'
                  ? 'تأكيد الحذف'
                  : lang === 'fr'
                    ? 'Confirmer la suppression'
                    : 'Confirm Delete'
              }
              cancelText={
                lang === 'ar'
                  ? 'إلغاء'
                  : lang === 'fr'
                    ? 'Annuler'
                    : 'Cancel'
              }
              confirmVariant="danger"
              isLoading={deleteLoading}
              errorMessage={deleteModalError}
            />
          )}

          {/* ============================================================
          BULK DELETE SURVEYS CONFIRMATION
      ============================================================= */}
          {bulkSurveyDeleteOpen && (
            <ConfirmModal
              isOpen={bulkSurveyDeleteOpen}
              onClose={() => {
                if (!bulkSurveyDeleteLoading) {
                  setBulkSurveyDeleteOpen(false);
                  setBulkSurveyDeleteError(null);
                }
              }}
              onConfirm={executeBulkSurveyDelete}
              title={
                lang === 'ar'
                  ? 'تأكيد حذف الاستبيانات'
                  : lang === 'fr'
                    ? 'Confirmer la suppression des enquêtes'
                    : 'Confirm Survey Deletion'
              }
              message={
                lang === 'ar'
                  ? `هل أنتِ متأكدة من حذف ${selectedSurveyIds.length} استبيان محدد؟`
                  : lang === 'fr'
                    ? `Voulez-vous vraiment supprimer les ${selectedSurveyIds.length} enquêtes sélectionnées ?`
                    : `Are you sure you want to delete the ${selectedSurveyIds.length} selected surveys?`
              }
              confirmText={
                lang === 'ar'
                  ? 'حذف الاستبيانات المحددة'
                  : lang === 'fr'
                    ? 'Supprimer les enquêtes sélectionnées'
                    : 'Delete Selected Surveys'
              }
              cancelText={
                lang === 'ar'
                  ? 'إلغاء'
                  : lang === 'fr'
                    ? 'Annuler'
                    : 'Cancel'
              }
              confirmVariant="danger"
              isLoading={bulkSurveyDeleteLoading}
              errorMessage={bulkSurveyDeleteError}
            />
          )}

          {/* BULK DELETE VISITORS CONFIRMATION */}
          {bulkVisitorDeleteOpen && (
            <ConfirmModal
              isOpen={bulkVisitorDeleteOpen}
              onClose={() => {
                if (!bulkVisitorDeleteLoading) {
                  setBulkVisitorDeleteOpen(false);
                  setBulkVisitorDeleteError(null);
                }
              }}
              onConfirm={executeBulkVisitorDelete}
              title={
                lang === 'ar'
                  ? 'تأكيد حذف الزوار'
                  : lang === 'fr'
                    ? 'Confirmer la suppression des visiteurs'
                    : 'Confirm Visitor Deletion'
              }
              message={
                lang === 'ar'
                  ? `هل أنتِ متأكدة من حذف ${selectedVisitorIds.length} سجل زائر محدد؟ لا يمكن التراجع عن هذا الإجراء.`
                  : lang === 'fr'
                    ? `Voulez-vous supprimer ${selectedVisitorIds.length} visiteur(s) sélectionné(s) ? Cette action est irréversible.`
                    : `Are you sure you want to delete ${selectedVisitorIds.length} selected visitor record(s)? This action cannot be undone.`
              }
              confirmText={
                lang === 'ar'
                  ? 'حذف الزوار المحددين'
                  : lang === 'fr'
                    ? 'Supprimer les visiteurs sélectionnés'
                    : 'Delete Selected Visitors'
              }
              cancelText={
                lang === 'ar'
                  ? 'إلغاء'
                  : lang === 'fr'
                    ? 'Annuler'
                    : 'Cancel'
              }
              confirmVariant="danger"
              isLoading={bulkVisitorDeleteLoading}
              errorMessage={bulkVisitorDeleteError}
            />
          )}

          {/* BULK DELETE ENQUIRIES CONFIRMATION */}
          {bulkEnquiryDeleteOpen && (
            <ConfirmModal
              isOpen={bulkEnquiryDeleteOpen}
              onClose={() => {
                if (!bulkEnquiryDeleteLoading) {
                  setBulkEnquiryDeleteOpen(false);
                  setBulkEnquiryDeleteError(null);
                }
              }}
              onConfirm={executeBulkEnquiryDelete}
              title={
                lang === 'ar'
                  ? 'تأكيد حذف الاستفسارات'
                  : lang === 'fr'
                    ? 'Confirmer la suppression des demandes'
                    : 'Confirm Enquiry Deletion'
              }
              message={
                lang === 'ar'
                  ? `هل أنت متأكد من حذف ${selectedEnquiryIds.length} استفسار محدد؟ لا يمكن التراجع عن هذا الإجراء.`
                  : lang === 'fr'
                    ? `Voulez-vous supprimer les ${selectedEnquiryIds.length} demandes sélectionnées ? Cette action est irréversible.`
                    : `Are you sure you want to delete the ${selectedEnquiryIds.length} selected enquiries? This action cannot be undone.`
              }
              confirmText={
                lang === 'ar'
                  ? 'حذف الاستفسارات'
                  : lang === 'fr'
                    ? 'Supprimer les demandes'
                    : 'Delete Enquiries'
              }
              cancelText={
                lang === 'ar'
                  ? 'إلغاء'
                  : lang === 'fr'
                    ? 'Annuler'
                    : 'Cancel'
              }
              confirmVariant="danger"
              isLoading={bulkEnquiryDeleteLoading}
              errorMessage={bulkEnquiryDeleteError}
            />
          )}
        </div>
      );
}