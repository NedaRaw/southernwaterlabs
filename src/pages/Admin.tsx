import {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
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
  Download,
  X,
  TrendingUp,
  ShieldCheck,
  Shield,
  Building2,
  GitBranch,
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

import { supabase } from '@/lib/supabase';
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
  return role === 'super_admin' || role === 'lab_admin' || role === 'admin';
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
  { name: 'Asir Central Laboratory', arName: 'مختبر عسير المركزي', frName: 'Laboratoire Central Asir', samples: 1420, completed: 1395, compliance: '99.6%', labId: 'asir' },
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

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // ============================================================
  // Dashboard
  // ============================================================

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurveyIds, setSelectedSurveyIds] = useState<string[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
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


  // ============================================================
  // Session Restore
  // ============================================================

  useEffect(() => {
    const storedUser = sessionStorage.getItem('admin_user');
    const storedToken = sessionStorage.getItem('admin_token');

    if (!storedUser || !storedToken) {
      return;
    }

    try {
      const user = JSON.parse(storedUser) as AdminUser;

      // Reject non-admin / standard users
      if (!user || !hasAdminAccess(user.role)) {
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        return;
      }

      setAdminUser(user);
      setAdminToken(storedToken);
      setLoggedIn(true);

      // Initialize role-based scope filters
      if (isLabAdmin(user.role) && user.laboratory) {
        setLabFilter(user.laboratory);
      } else if (isLocalAdmin(user.role)) {
        if (user.laboratory) setLabFilter(user.laboratory);
        if (user.branch) setBranchFilter(user.branch);
      }
    } catch (error) {
      console.error('Failed to restore admin session:', error);
    }
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
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال اسم المستخدم وكلمة المرور.'
            : lang === 'fr'
              ? "Veuillez saisir le nom d'utilisateur et le mot de passe."
              : 'Please enter username and password.'
        );
      }

      console.log('Admin login attempt:', username);

      const { data, error } = await supabase.rpc('login_user', {
        p_username: username,
        p_password: password,
      });

      console.log('LOGIN RPC RESPONSE:', data);
      console.log('LOGIN RPC ERROR:', error);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          lang === 'ar'
            ? 'لم يتم إرجاع بيانات تسجيل الدخول.'
            : lang === 'fr'
              ? 'Aucune donnée de connexion retournée.'
              : 'No login data returned.'
        );
      }

      const loginData = Array.isArray(data) ? data[0] : data;

      if (!loginData?.success) {
        throw new Error(
          loginData?.message ||
          (lang === 'ar'
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
            : lang === 'fr'
              ? "Nom d'utilisateur ou mot de passe incorrect."
              : 'Invalid username or password.')
        );
      }

      const authenticatedUser = loginData?.user;
      const sessionToken =
        loginData.session_token ||
        loginData.token ||
        loginData.admin_token;

      if (!sessionToken) {
        console.error('Login succeeded but no session token was returned:', loginData);

        throw new Error(
          lang === 'ar'
            ? 'تم تسجيل الدخول ولكن لم يتم إنشاء جلسة آمنة.'
            : lang === 'fr'
              ? 'Connexion réussie, mais aucune session sécurisée n’a été créée.'
              : 'Login succeeded, but no secure session token was created.'
        );
      }

      const userRole = authenticatedUser?.role || loginData.role || 'user';

      // Strict access enforcement: standard users have NO administrative access
      if (!hasAdminAccess(userRole)) {
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
        throw new Error(
          lang === 'ar'
            ? 'تم رفض الوصول: هذا الحساب مسجل كمستخدم عادي ولا يملك صلاحيات إدارية لدخول هذه البوابة.'
            : lang === 'fr'
              ? "Accès refusé : ce compte utilisateur standard ne dispose d'aucun privilège pour accéder au portail d'administration."
              : 'Access denied: standard user accounts do not have administrative privileges to access the admin portal.'
        );
      }

      const user: AdminUser = {
        id: authenticatedUser?.id || loginData.id,
        username: authenticatedUser?.username || loginData.username || username,
        full_name: authenticatedUser?.full_name || loginData.full_name || null,
        role: userRole,
        laboratory: authenticatedUser?.laboratory || loginData.laboratory || null,
        branch: authenticatedUser?.branch || loginData.branch || null,
        active:
          typeof authenticatedUser?.active === 'boolean'
            ? authenticatedUser.active
            : typeof loginData.active === 'boolean'
              ? loginData.active
              : true,
        created_at: authenticatedUser?.created_at || loginData.created_at || null,
        is_primary:
          typeof authenticatedUser?.is_primary === 'boolean'
            ? authenticatedUser.is_primary
            : typeof loginData.is_primary === 'boolean'
              ? loginData.is_primary
              : false,
      };

      sessionStorage.setItem(
        'admin_user',
        JSON.stringify(user)
      );

      sessionStorage.setItem(
        'admin_token',
        sessionToken
      );

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
        if (user.branch) setBranchFilter(user.branch);
      }
    } catch (error) {
      console.error('Admin login failed:', error);

      const message = getErrorMessage(error);

      setLoginError(
        message ||
        (lang === 'ar'
          ? 'فشل تسجيل الدخول.'
          : lang === 'fr'
            ? 'Échec de la connexion.'
            : 'Login failed.')
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
  // Fetch Data
  // ============================================================

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

      let surveysQuery = supabase.rpc('get_admin_surveys', {
        p_token: token,
      });

      if (branchFilter) {
        surveysQuery = surveysQuery.eq('branch', branchFilter);
      }
      if (labFilter) {
        surveysQuery = surveysQuery.eq('laboratory', labFilter);
      }
      if (surveyStartDate) {
        surveysQuery = surveysQuery.gte(
          'created_at',
          `${surveyStartDate}T00:00:00.000Z`
        );
      }
      if (surveyEndDate) {
        surveysQuery = surveysQuery.lte(
          'created_at',
          `${surveyEndDate}T23:59:59.999Z`
        );
      }

      const surveysRes = await surveysQuery;

      console.log(
        'SURVEYS RAW RESPONSE:',
        surveysRes
      );

      if (surveysRes.error) {
        console.error(
          'SURVEYS RPC ERROR:',
          surveysRes.error
        );
        const errMsg = getErrorMessage(surveysRes.error);
        setSurveysError(errMsg);
        if (
          errMsg.toLowerCase().includes('unauthorized') ||
          errMsg.toLowerCase().includes('expired') ||
          errMsg.toLowerCase().includes('invalid token')
        ) {
          setSessionExpired(true);
        }
        setSurveys([]);
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
          'list_users',
          {
            p_token: token,
          }
        );

        console.log(
          'LIST USERS RAW RESPONSE:',
          usersRes
        );

        if (usersRes.error) {
          console.error(
            'LIST USERS RPC ERROR:',
            usersRes.error
          );
          const errMsg = getErrorMessage(usersRes.error);
          setUsersError(errMsg);
          if (
            errMsg.toLowerCase().includes('unauthorized') ||
            errMsg.toLowerCase().includes('expired') ||
            errMsg.toLowerCase().includes('invalid token')
          ) {
            setSessionExpired(true);
          }

          /*
           * IMPORTANT:
           * Do NOT fallback to list_users() without p_token.
           * That would bypass the custom admin session protection.
           */

          setAdminUsers([]);
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
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      console.error(
        'Admin fetchData failed:',
        error
      );
    } finally {
      setLoading(false);
    }
  }, [loggedIn, adminToken, adminUser, branchFilter, labFilter, surveyStartDate, surveyEndDate]);


  // ============================================================
  // Fetch after login
  // ============================================================

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn, fetchData]);


  // ============================================================
  // User Form Helpers
  // ============================================================

  const resetUserForm = () => {
    setUserForm({
      username: '',
      password: '',
      full_name: '',
      role: isSuperAdmin(adminUser?.role)
        ? 'lab_admin'
        : isLabAdmin(adminUser?.role)
          ? 'local_admin'
          : 'user',
      laboratory: isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role)
        ? adminUser?.laboratory || ''
        : '',
      branch: isLocalAdmin(adminUser?.role)
        ? adminUser?.branch || ''
        : '',
    });

    setEditingUserId(null);
    setUserError('');
  };


  const openCreateUserModal = () => {
    resetUserForm();
    setShowUserModal(true);
  };


  const openEditUserModal = (user: AdminUser) => {
    // Check permission to edit
    if (isLabAdmin(adminUser?.role)) {
      if (isSuperAdmin(user.role) || (user.role === 'lab_admin' && user.id !== adminUser?.id)) {
        setFeedback({
          type: 'error',
          message:
            lang === 'ar'
              ? 'لا تملك صلاحية تعديل حساب المشرف العام أو مدراء المختبرات الأخرى.'
              : lang === 'fr'
                ? "Vous n'avez pas l'autorisation de modifier un compte Super Admin ou d'un autre laboratoire."
                : 'You do not have permission to edit Super Admin or other Lab Administrator accounts.',
        });
        return;
      }
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (hasAdminAccess(user.role)) {
        setFeedback({
          type: 'error',
          message:
            lang === 'ar'
              ? 'المسؤول المحلي لا يملك صلاحية تعديل حسابات المسؤولين.'
              : lang === 'fr'
                ? "L'administrateur local ne peut pas modifier les comptes administrateurs."
                : 'Local administrators cannot edit administrator accounts.',
        });
        return;
      }
    }

    setEditingUserId(user.id);

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
      if (isLocalAdmin(adminUser?.role) && role !== 'user') {
        throw new Error(
          lang === 'ar'
            ? 'المسؤول المحلي مخول فقط بإنشاء أو تعديل حسابات المستخدمين العاديين.'
            : lang === 'fr'
              ? "L'administrateur local ne peut gérer que des utilisateurs ordinaires."
              : 'Local administrators can only manage standard users.'
        );
      }

      if (isLabAdmin(adminUser?.role)) {
        if (isSuperAdmin(role)) {
          throw new Error(
            lang === 'ar'
              ? 'مدير المختبر المركزي لا يمكنه إنشاء أو ترقية حساب إلى مشرف عام.'
              : lang === 'fr'
                ? 'Un administrateur de laboratoire ne peut pas créer de compte Super Admin.'
                : 'A lab administrator cannot create a Super Admin account.'
          );
        }
      }

      const assignedLab =
        isLabAdmin(adminUser?.role) || isLocalAdmin(adminUser?.role)
          ? adminUser?.laboratory || userForm.laboratory
          : userForm.laboratory;

      const assignedBranch =
        isLocalAdmin(adminUser?.role)
          ? adminUser?.branch || userForm.branch
          : userForm.branch;

      // --------------------------------------------------------
      // Update existing user
      // --------------------------------------------------------

      if (editingUserId) {
        const existingUser =
          adminUsers.find(
            (user) =>
              user.id === editingUserId
          );

        const active =
          existingUser?.active !== false;

        const { data, error } =
          await supabase.rpc(
            'update_user',
            {
              p_token: token,
              p_id: editingUserId,
              p_password:
                password || null,
              p_role: role,
              p_active: active,
              p_full_name: userForm.full_name || null,
              p_laboratory: assignedLab || null,
              p_branch: assignedBranch || null,
            }
          );

        console.log(
          'UPDATE USER RESPONSE:',
          data,
          error
        );

        if (error) {
          throw error;
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
        const { data, error } =
          await supabase.rpc(
            'create_user',
            {
              p_token: token,
              p_username: username,
              p_password: password,
              p_role: role,
              p_full_name: userForm.full_name || null,
              p_laboratory: assignedLab || null,
              p_branch: assignedBranch || null,
            }
          );

        console.log(
          'CREATE USER RESPONSE:',
          data,
          error
        );

        if (error) {
          throw error;
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
      console.error(
        'Save user failed:',
        error
      );

      setUserError(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // Toggle User Active
  // ============================================================

  const handleToggleUser = async (user: AdminUser) => {
    if (user.is_primary) {
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

    if (isLocalAdmin(adminUser?.role) && hasAdminAccess(user.role)) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'المسؤول المحلي لا يملك صلاحية تعديل حالة حسابات المسؤولين.'
            : lang === 'fr'
              ? "L'administrateur local ne peut pas modifier le statut des comptes administrateurs."
              : 'Local administrators cannot change the status of administrator accounts.',
      });
      return;
    }

    if (isLabAdmin(adminUser?.role) && (isSuperAdmin(user.role) || (user.role === 'lab_admin' && user.id !== adminUser?.id))) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا تملك صلاحية تعديل حالة حساب المشرف العام أو مدراء المختبرات الأخرى.'
            : lang === 'fr'
              ? 'Vous ne pouvez pas modifier le statut d’un compte Super Admin ou d’un autre administrateur de laboratoire.'
              : 'You cannot change the status of Super Admin or other Lab Administrator accounts.',
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
      const { data, error } = await supabase.rpc('update_user', {
        p_token: token,
        p_id: user.id,
        p_password: null,
        p_role: user.role,
        p_active: user.active === false,
      });

      console.log('TOGGLE USER RESPONSE:', data, error);

      if (error) {
        throw error;
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
      console.error('Toggle user failed:', error);
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
    if (user.is_primary) {
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

    if (isLocalAdmin(adminUser?.role) && hasAdminAccess(user.role)) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'المسؤول المحلي لا يملك صلاحية حذف حسابات المسؤولين.'
            : lang === 'fr'
              ? "L'administrateur local ne peut pas supprimer de compte administrateur."
              : 'Local administrators cannot delete administrator accounts.',
      });
      return;
    }

    if (isLabAdmin(adminUser?.role) && (isSuperAdmin(user.role) || (user.role === 'lab_admin' && user.id !== adminUser?.id))) {
      setFeedback({
        type: 'error',
        message:
          lang === 'ar'
            ? 'لا تملك صلاحية حذف حساب المشرف العام أو مدراء المختبرات الأخرى.'
            : lang === 'fr'
              ? 'Vous ne pouvez pas supprimer un compte Super Admin ou un autre administrateur de laboratoire.'
              : 'You cannot delete Super Admin or other Lab Administrator accounts.',
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

  const handleDeleteUser = async (user: AdminUser) => {
    openDeleteUser(user);
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
          const { count, error } = await supabase
            .from('visitors')
            .delete({ count: 'exact' })
            .eq('id', deleteTarget.id);

          const isNotFound = (msg: string) => {
            const lower = msg.toLowerCase();
            return (
              lower.includes('not found') ||
              lower.includes('introuvable') ||
              lower.includes('غير موجود') ||
              lower.includes('does not exist')
            );
          };

          if (error && !isNotFound(getErrorMessage(error))) {
            throw error;
          }

          if (count === 0) {
            console.info('Visitor record count was 0, confirming absent from server.');
          }

          setVisitors((prev) => prev.filter((v) => v.id !== deleteTarget.id));
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

          let deleted = false;

          const isNotFound = (msg: string) => {
            const lower = msg.toLowerCase();
            return (
              lower.includes('not found') ||
              lower.includes('introuvable') ||
              lower.includes('غير موجود') ||
              lower.includes('does not exist')
            );
          };

          // 1. First attempt: Dedicated token-authenticated RPC for enquiries
          if (token) {
            const { data, error } = await supabase.rpc('admin_delete_enquiry', {
              p_token: token,
              p_id: deleteTarget.id,
            });

            if (!error) {
              if (data && typeof data === 'object') {
                const resObj = data as { success?: boolean; error?: unknown; message?: string };
                if (resObj.success === false || resObj.error) {
                  const errorMsg = String(resObj.error || resObj.message || '');
                  if (isNotFound(errorMsg)) {
                    console.info('Enquiry record was already absent from server:', errorMsg);
                    deleted = true;
                  } else {
                    throw new Error(
                      errorMsg ||
                      (lang === 'ar' ? 'فشل حذف الاستفسار' : 'Failed to delete enquiry')
                    );
                  }
                } else {
                  deleted = true;
                }
              } else {
                deleted = true;
              }
            } else {
              const errMsg = getErrorMessage(error);
              if (isNotFound(errMsg)) {
                console.info('Enquiry record was already absent from server:', errMsg);
                deleted = true;
              } else if (
                errMsg.toLowerCase().includes('unauthorized') ||
                errMsg.toLowerCase().includes('invalid token') ||
                errMsg.toLowerCase().includes('expired')
              ) {
                setSessionExpired(true);
                throw error;
              } else {
                console.warn('admin_delete_enquiry RPC error, attempting fallback:', error);
              }
            }
          }

          // 2. Fallback: Direct table delete (when RPC is not configured or in local storage mock)
          if (!deleted) {
            const { count, error } = await supabase
              .from('enquiries')
              .delete({ count: 'exact' })
              .eq('id', deleteTarget.id);

            if (error && !isNotFound(getErrorMessage(error))) {
              throw error;
            }

            if (count === 0) {
              console.info('Enquiry record count is 0, confirming absent from server.');
            }
          }

          setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
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

          const isNotFound = (msg: string) => {
            const lower = msg.toLowerCase();
            return (
              lower.includes('not found') ||
              lower.includes('introuvable') ||
              lower.includes('غير موجود') ||
              lower.includes('does not exist')
            );
          };

          const { data, error } = await supabase.rpc('delete_user', {
            p_token: token,
            p_id: deleteTarget.id,
          });

          if (error && !isNotFound(getErrorMessage(error))) {
            throw error;
          }

          if (data && typeof data === 'object') {
            const result = data as {
              success?: unknown;
              error?: unknown;
              message?: string;
            };

            if (result.error || result.success === false) {
              const errStr = String(result.error || result.message || '');
              if (!isNotFound(errStr)) {
                throw new Error(
                  errStr ||
                  (lang === 'ar'
                    ? 'لم يتم تأكيد حذف المستخدم من قبل الخادم.'
                    : lang === 'fr'
                      ? "La suppression de l'utilisateur n'a pas été confirmée par le serveur."
                      : 'User deletion was not confirmed by the server.')
                );
              }
            }
          }

          setAdminUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
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


  // ============================================================
  // Filter Visitors (Scoped by Role and Laboratory)
  // ============================================================

  const filteredVisitors = visitors.filter((visitor) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (visitor.laboratory !== adminUser.laboratory) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && visitor.laboratory !== adminUser.laboratory) return false;
      if (adminUser?.branch && visitor.branch !== adminUser.branch) return false;
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
    const matchesLab = !labFilter || visitor.laboratory === labFilter;
    const matchesBranch = !branchFilter || visitor.branch === branchFilter;
    const matchesStatus = !statusFilter || visitor.status === statusFilter;

    return (
      matchesSearch &&
      matchesLab &&
      matchesBranch &&
      matchesStatus
    );
  });


  // ============================================================
  // Filter Surveys (Scoped by Role and Laboratory)
  // ============================================================

  const filteredSurveys = surveys.filter((survey) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (survey.laboratory !== adminUser.laboratory) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && survey.laboratory !== adminUser.laboratory) return false;
      if (adminUser?.branch && survey.branch !== adminUser.branch) return false;
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
    const matchesLab = !labFilter || survey.laboratory === labFilter;
    const matchesBranch = !branchFilter || survey.branch === branchFilter;

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


  // ============================================================
  // Filter Enquiries (Scoped by Role and Laboratory)
  // ============================================================

  const filteredEnquiries = enquiries.filter((enquiry) => {
    // Role-based scoping
    if (isLabAdmin(adminUser?.role) && adminUser?.laboratory) {
      if (enquiry.laboratory !== adminUser.laboratory) return false;
    }
    if (isLocalAdmin(adminUser?.role)) {
      if (adminUser?.laboratory && enquiry.laboratory !== adminUser.laboratory) return false;
      if (adminUser?.branch && enquiry.branch !== adminUser.branch) return false;
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
    const matchesLab = !labFilter || enquiry.laboratory === labFilter;
    const matchesBranch = !branchFilter || enquiry.branch === branchFilter;
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;

    return (
      matchesSearch &&
      matchesLab &&
      matchesBranch &&
      matchesStatus
    );
  });


  // ============================================================
  // Filter Users (Scoped by Hierarchy Role)
  // ============================================================

  const scopedAdminUsers = adminUsers.filter((user) => {
    if (isSuperAdmin(adminUser?.role)) {
      return true; // Super admin sees all accounts
    }

    if (isLabAdmin(adminUser?.role)) {
      // Lab admin cannot see/manage super admin
      if (isSuperAdmin(user.role)) return false;
      // Scoped to lab admin's laboratory or unassigned
      if (user.laboratory && user.laboratory !== adminUser?.laboratory) return false;
      return true;
    }

    if (isLocalAdmin(adminUser?.role)) {
      // Local admin: scope to their lab / branch
      if (user.laboratory && adminUser?.laboratory && user.laboratory !== adminUser.laboratory) return false;
      if (user.branch && adminUser?.branch && user.branch !== adminUser.branch) return false;
      return true;
    }

    return false;
  });


  // ============================================================
  // CSV Export
  // ============================================================

  const exportVisitorsCsv = () => {
    const rows = filteredVisitors;

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

    const escapeCsv = (
      value: unknown
    ) => {
      const text =
        value === null ||
          value === undefined
          ? ''
          : String(value);

      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [
      headers.join(','),
      ...rows.map((visitor) =>
        [
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
          visitor.purpose ||
          visitor.visit_purpose,
          visitor.visit_date,
          visitor.arrival_time,
          visitor.status,
          visitor.notes,
          visitor.created_at,
        ]
          .map(escapeCsv)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download =
      `visitors-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
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
      value: filteredVisitors.length,
      icon: Users,
    },
    {
      label:
        lang === 'ar'
          ? 'الاستبيانات'
          : lang === 'fr'
            ? 'Enquêtes'
            : 'Surveys',
      value: filteredSurveys.length,
      icon: FileText,
    },
    {
      label:
        lang === 'ar'
          ? 'الاستفسارات'
          : lang === 'fr'
            ? 'Demandes'
            : 'Enquiries',
      value: filteredEnquiries.length,
      icon: MessageSquare,
    },
    {
      label:
        lang === 'ar'
          ? 'المستخدمون'
          : lang === 'fr'
            ? 'Utilisateurs'
            : 'Users',
      value: scopedAdminUsers.length,
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
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {loggedIn && (
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
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
                        {adminUser.branch ? ` • ${getBranchLabel(adminUser.laboratory, adminUser.branch, lang)}` : ''}
                      </span>
                    ) : isSuperAdmin(adminUser?.role) ? (
                      <span className="text-[10px] text-purple-300/80 truncate block leading-tight">
                        {lang === 'ar' ? 'وصول شامل لجميع المراكز' : lang === 'fr' ? 'Accès global tous centres' : 'Global Access'}
                      </span>
                    ) : null}
                  </div>
                </div>
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

                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password:
                          e.target.value,
                      }))
                    }
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />
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
                      disabled={isLocalAdmin(adminUser?.role) || (isReadOnly(adminUser?.role) && !!adminUser?.branch)}
                      onChange={(e) =>
                        setBranchFilter(
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {lang === 'ar'
                          ? 'كل الفروع'
                          : lang === 'fr'
                            ? 'Toutes les agences'
                            : 'All Branches'}
                      </option>

                      {LAB_HIERARCHY
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

                      {visitors
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

                      {visitors.length === 0 && (
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

                      {enquiries
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

                      {enquiries.length === 0 && (
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

                    <button
                      type="button"
                      onClick={exportVisitorsCsv}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'ar'
                        ? 'تصدير CSV'
                        : lang === 'fr'
                          ? 'Exporter CSV'
                          : 'Export CSV'}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
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


                  {filteredVisitors.length === 0 && (
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {lang === 'ar'
                          ? 'الاستبيانات'
                          : lang === 'fr'
                            ? 'Enquêtes'
                            : 'Surveys'}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {filteredSurveys.length}{' '}
                        {lang === 'ar'
                          ? 'استبيان'
                          : 'records'}
                      </p>
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
                    <h2 className="text-xl font-bold">
                      {lang === 'ar'
                        ? 'الاستفسارات والرسائل'
                        : lang === 'fr'
                          ? 'Demandes et messages'
                          : 'Enquiries & Messages'}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {filteredEnquiries.length}{' '}
                      {lang === 'ar'
                        ? 'سجل'
                        : 'records'}
                    </p>
                  </div>


                  {filteredEnquiries.map(
                    (enquiry) => (
                      <div
                        key={enquiry.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs"
                      >
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
                    )
                  )}


                  {filteredEnquiries.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-500">
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
                                  {(!isLabAdmin(adminUser?.role) || (!isSuperAdmin(user.role) && (user.role !== 'lab_admin' || user.id === adminUser?.id))) &&
                                    (!isLocalAdmin(adminUser?.role) || user.role === 'user') && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openEditUserModal(
                                            user
                                          )
                                        }
                                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400 transition-colors cursor-pointer"
                                        title={lang === 'ar' ? 'تعديل' : lang === 'fr' ? 'Modifier' : 'Edit'}
                                      >
                                        <UserCog className="w-4 h-4" />
                                      </button>
                                    )}


                                  {!user.is_primary && (!isLabAdmin(adminUser?.role) || (!isSuperAdmin(user.role) && user.role !== 'lab_admin')) && (!isLocalAdmin(adminUser?.role) || user.role === 'user') && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleToggleUser(
                                            user
                                          )
                                        }
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${user.active ===
                                          false
                                          ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                                          }`}
                                      >
                                        {user.active ===
                                          false
                                          ? lang ===
                                            'ar'
                                            ? 'تفعيل'
                                            : lang === 'fr'
                                              ? 'Activer'
                                              : 'Enable'
                                          : lang ===
                                            'ar'
                                            ? 'تعطيل'
                                            : lang === 'fr'
                                              ? 'Désactiver'
                                              : 'Disable'}
                                      </button>


                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteUser(
                                            user
                                          )
                                        }
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer transition"
                                        title={lang === 'ar' ? 'حذف' : lang === 'fr' ? 'Supprimer' : 'Delete'}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
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
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl"
              dir={dir}
            >

              <div className="flex items-center justify-between p-5 border-b border-slate-200">
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
                          : 'Add New Admin'}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {editingUserId
                      ? lang === 'ar'
                        ? 'تحديث بيانات المستخدم'
                        : lang === 'fr'
                          ? "Mettre à jour l'utilisateur"
                          : 'Update user information'
                      : lang === 'ar'
                        ? 'إنشاء حساب إداري جديد'
                        : lang === 'fr'
                          ? 'Créer un nouveau compte'
                          : 'Create a new admin account'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeUserModal
                  }
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>


              <form
                onSubmit={handleSaveUser}
                className="p-5 space-y-5"
              >

                {userError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />

                    <span>
                      {userError}
                    </span>
                  </div>
                )}


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {lang === 'ar'
                      ? 'الاسم الكامل'
                      : lang === 'fr'
                        ? 'Nom complet'
                        : 'Full Name'}
                  </label>

                  <input
                    type="text"
                    value={
                      userForm.full_name
                    }
                    onChange={(e) =>
                      setUserForm(
                        (prev) => ({
                          ...prev,
                          full_name:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {lang === 'ar'
                      ? 'اسم المستخدم'
                      : lang === 'fr'
                        ? "Nom d'utilisateur"
                        : 'Username'}
                  </label>

                  <input
                    type="text"
                    value={
                      userForm.username
                    }
                    disabled={
                      !!editingUserId
                    }
                    onChange={(e) =>
                      setUserForm(
                        (prev) => ({
                          ...prev,
                          username:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                    dir="ltr"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {lang === 'ar'
                      ? editingUserId
                        ? 'كلمة مرور جديدة'
                        : 'كلمة المرور'
                      : lang === 'fr'
                        ? editingUserId
                          ? 'Nouveau mot de passe'
                          : 'Mot de passe'
                        : editingUserId
                          ? 'New Password'
                          : 'Password'}
                  </label>

                  <input
                    type="password"
                    value={
                      userForm.password
                    }
                    onChange={(e) =>
                      setUserForm(
                        (prev) => ({
                          ...prev,
                          password:
                            e.target.value,
                        })
                      )
                    }
                    placeholder={
                      editingUserId
                        ? '••••••••'
                        : ''
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    dir="ltr"
                  />

                  {editingUserId && (
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'ar'
                        ? 'اترك الحقل فارغاً إذا كنت لا تريد تغيير كلمة المرور.'
                        : lang === 'fr'
                          ? 'Laissez vide pour conserver le mot de passe actuel.'
                          : 'Leave blank to keep the current password.'}
                    </p>
                  )}
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {lang === 'ar'
                      ? 'الدور'
                      : lang === 'fr'
                        ? 'Rôle'
                        : 'Role'}
                  </label>

                  <select
                    value={
                      userForm.role
                    }
                    onChange={(e) =>
                      setUserForm(
                        (prev) => ({
                          ...prev,
                          role:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">
                      User
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>


                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={
                      closeUserModal
                    }
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50"
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
                    className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium flex items-center gap-2 disabled:opacity-60"
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
          CONFIRM DELETE MODAL (Visitors, Surveys, Enquiries, Users)
      ============================================================= */}
      {
        deleteTarget && (
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
            confirmText={lang === 'ar' ? 'تأكيد الحذف' : lang === 'fr' ? 'Confirmer la suppression' : 'Confirm Delete'}
            cancelText={lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel'}
            confirmVariant="danger"
            isLoading={deleteLoading}
            errorMessage={deleteModalError}
          />
        )
      }
    </div >
  );
}