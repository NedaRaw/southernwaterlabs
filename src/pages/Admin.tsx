```tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock, Loader2, AlertCircle, LayoutDashboard, Users, FileText, MessageSquare,
  UserCog, LogOut, Search, Trash2, Plus, Eye, Download, X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import LabLogo from '@/components/LabLogo';
import { LAB_HIERARCHY, getLabLabel, getBranchLabel } from '@/data/labServices';

interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

interface Visitor {
  id: string;
  visitor_id?: string;
  first_name?: string;
  last_name?: string;
  visitor_name?: string;
  national_id?: string;
  company: string | null;
  job_title: string | null;
  phone: string;
  email: string | null;
  visit_date: string;
  arrival_time?: string;
  laboratory: string;
  branch: string | null;
  department?: string;
  employee?: string;
  purpose?: string;
  visit_purpose?: string;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Survey {
  id: string;
  laboratory: string;
  branch: string | null;
  service_used: string;
  how_heard: string | null;
  overall_satisfaction: string | null;
  staff_professionalism: number | null;
  service_speed: number | null;
  sample_submission: number | null;
  report_clarity: number | null;
  communication: number | null;
  laboratory_cleanliness: number | null;
  overall_experience: number | null;
  results_on_time: string | null;
  reports_understandable: string | null;
  recommendation_score: number | null;
  liked_most: string | null;
  improvements: string | null;
  contact_me: string | null;
  additional_comments: string | null;
  created_at: string;
}

interface Enquiry {
  id: string;
  laboratory?: string;
  branch?: string | null;
  full_name?: string;
  name?: string;
  company_name?: string | null;
  email?: string;
  contact_info?: string;
  phone?: string | null;
  location?: string | null;
  service_required?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  created_at: string;
}

type Tab = 'dashboard' | 'visitors' | 'surveys' | 'enquiries' | 'users';

export default function Admin() {
  const { lang, t, dir } = useLang();

  const [loggedIn, setLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string>('');
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // User modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'user',
  });
  const [userError, setUserError] = useState('');

  // ============================================================
  // Restore existing admin session
  // ============================================================
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_user');
    const storedToken =
      sessionStorage.getItem('admin_token') || 'local-admin-token';

    if (stored) {
      try {
        const user = JSON.parse(stored) as AdminUser;

        setAdminUser(user);
        setAdminToken(storedToken);
        setLoggedIn(true);
      } catch {
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_token');
      }
    }
  }, []);

  // ============================================================
  // Login
  // ============================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginForm.username || !loginForm.password) {
      setLoginError(t('admin.requiredFields'));
      return;
    }

    setLoggingIn(true);

    try {
      // --------------------------------------------------------
      // 1. Try the real custom login_user RPC
      // --------------------------------------------------------
      const { data, error } = await supabase.rpc('login_user', {
        p_username: loginForm.username,
        p_password: loginForm.password,
      });

      // TEMPORARY DIAGNOSTIC LOG
      // IMPORTANT: remove after authentication problem is identified.
      console.log('LOGIN USER RESULT:', {
        data,
        error,
      });

      if (
        !error &&
        data &&
        (data as { success?: boolean }).success
      ) {
        const res = data as {
          success: boolean;
          token?: string;
          user?: AdminUser;
        };

        const user: AdminUser = res.user || {
          id: 'admin-1',
          username: loginForm.username,
          full_name: 'Administrator',
          role: 'admin',
        };

        const token = res.token || 'valid-admin-token';

        sessionStorage.setItem(
          'admin_user',
          JSON.stringify(user)
        );

        sessionStorage.setItem(
          'admin_token',
          token
        );

        setAdminUser(user);
        setAdminToken(token);
        setLoggedIn(true);

        setLoginForm({
          username: '',
          password: '',
        });

        return;
      }

      // --------------------------------------------------------
      // 2. Temporary fallback for diagnosis
      // --------------------------------------------------------
      const {
        data: vData,
        error: vErr,
      } = await supabase.rpc('verify_admin_credentials', {
        p_username: loginForm.username,
        p_password: loginForm.password,
      });

      // TEMPORARY DIAGNOSTIC LOG
      console.log('VERIFY ADMIN RESULT:', {
        data: vData,
        error: vErr,
      });

      if (
        !vErr &&
        vData &&
        vData.length > 0 &&
        vData[0].id
      ) {
        const user: AdminUser = {
          id: vData[0].id,
          username: vData[0].username,
          full_name: vData[0].full_name,
          role: vData[0].role,
        };

        const token = 'session-' + Date.now();

        sessionStorage.setItem(
          'admin_user',
          JSON.stringify(user)
        );

        sessionStorage.setItem(
          'admin_token',
          token
        );

        setAdminUser(user);
        setAdminToken(token);
        setLoggedIn(true);

        setLoginForm({
          username: '',
          password: '',
        });

        return;
      }

      setLoginError(t('admin.invalidCredentials'));
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(t('admin.loginError'));
    } finally {
      setLoggingIn(false);
    }
  };

  // ============================================================
  // Logout
  // ============================================================
  const handleLogout = () => {
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_token');

    setAdminUser(null);
    setAdminToken('');
    setLoggedIn(false);
    setActiveTab('dashboard');
  };

  // ============================================================
  // Fetch admin data
  // ============================================================
  const fetchData = useCallback(async () => {
    if (!loggedIn) return;

    setLoading(true);

    try {
      // --------------------------------------------------------
      // 1. Visitors
      // --------------------------------------------------------
      const visitorsPromise = supabase
        .from('visitors')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      // --------------------------------------------------------
      // 2. Enquiries
      // --------------------------------------------------------
      const enquiriesPromise = supabase
        .from('enquiries')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      // --------------------------------------------------------
      // 3. Surveys through secure RPC
      // --------------------------------------------------------
      const token =
        sessionStorage.getItem('admin_token') ||
        adminToken;

      const surveysPromise = supabase.rpc(
        'get_admin_surveys',
        {
          p_token: token,
        }
      );

      // --------------------------------------------------------
      // 4. Admin users
      // --------------------------------------------------------
      const usersPromise = supabase
        .rpc('list_users', {
          p_token: token,
        })
        .then((res) => {
          if (!res.error && res.data) {
            return res;
          }

          return supabase.rpc('get_all_admin_users');
        })
        .catch(() => ({
          data: [],
          error: null,
        }));

      const [
        visitorsRes,
        enquiriesRes,
        surveysRes,
        usersRes,
      ] = await Promise.all([
        visitorsPromise,
        enquiriesPromise,
        surveysPromise,
        usersPromise,
      ]);

      if (visitorsRes.data) {
        setVisitors(
          visitorsRes.data as Visitor[]
        );
      }

      if (enquiriesRes.data) {
        setEnquiries(
          enquiriesRes.data as Enquiry[]
        );
      }

      // --------------------------------------------------------
      // Surveys
      // --------------------------------------------------------
      if (
        !surveysRes.error &&
        surveysRes.data
      ) {
        setSurveys(
          surveysRes.data as Survey[]
        );
      } else {
        const fallbackSurveys = await supabase
          .from('surveys')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

        if (fallbackSurveys.data) {
          setSurveys(
            fallbackSurveys.data as Survey[]
          );
        }
      }

      // --------------------------------------------------------
      // Users
      // --------------------------------------------------------
      if (
        usersRes.data &&
        Array.isArray(usersRes.data)
      ) {
        setAdminUsers(
          usersRes.data as AdminUser[]
        );
      }
    } catch (err) {
      console.error(
        'Fetch error in admin:',
        err
      );
    } finally {
      setLoading(false);
    }
  }, [loggedIn, adminToken]);

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn, fetchData]);

  // ============================================================
  // Create user
  // ============================================================
  const handleSaveUser = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setUserError('');

    if (
      !userForm.username.trim() ||
      !userForm.password.trim()
    ) {
      setUserError(
        t('admin.requiredFields')
      );
      return;
    }

    const token =
      sessionStorage.getItem('admin_token') ||
      adminToken;

    try {
      const res = await supabase.rpc(
        'create_user',
        {
          p_token: token,
          p_username:
            userForm.username.trim(),
          p_password:
            userForm.password,
          p_role:
            userForm.role,
        }
      );

      if (res.error) {
        const res2 =
          await supabase.rpc(
            'create_admin_user',
            {
              p_username:
                userForm.username.trim(),
              p_password:
                userForm.password,
              p_full_name:
                userForm.full_name.trim() ||
                userForm.username.trim(),
              p_role:
                userForm.role,
            }
          );

        if (res2.error) {
          throw res.error;
        }
      }

      setShowUserModal(false);

      setUserForm({
        username: '',
        password: '',
        full_name: '',
        role: 'user',
      });

      fetchData();
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === 'object' &&
        'message' in err
          ? String(
              (
                err as {
                  message: string;
                }
              ).message
            )
          : 'Error';

      setUserError(msg);
    }
  };

  // ============================================================
  // Delete visitor
  // ============================================================
  const handleDeleteVisitor = async (
    id: string
  ) => {
    if (
      !confirm(
        t('admin.confirmDeleteVisitor')
      )
    ) {
      return;
    }

    await supabase
      .from('visitors')
      .delete()
      .eq('id', id);

    fetchData();
  };

  // ============================================================
  // Delete enquiry
  // ============================================================
  const handleDeleteEnquiry = async (
    id: string
  ) => {
    if (
      !confirm(
        t('admin.confirmDeleteEnquiry')
      )
    ) {
      return;
    }

    await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    fetchData();
  };

  // ============================================================
  // Update visitor status
  // ============================================================
  const handleUpdateVisitorStatus = async (
    id: string,
    status: string
  ) => {
    await supabase
      .from('visitors')
      .update({ status })
      .eq('id', id);

    fetchData();
  };

  // ============================================================
  // Update enquiry status
  // ============================================================
  const handleUpdateEnquiryStatus = async (
    id: string,
    status: string
  ) => {
    await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    fetchData();
  };

  // ============================================================
  // Filter visitors
  // ============================================================
  const filteredVisitors = visitors.filter(
    (v) => {
      const name = (
        v.first_name
          ? `${v.first_name} ${
              v.last_name || ''
            }`
          : v.visitor_name || ''
      ).toLowerCase();

      const phone = (
        v.phone || ''
      ).toLowerCase();

      const lab = (
        v.laboratory ||
        v.department ||
        ''
      ).toLowerCase();

      const ref = (
        v.visitor_id ||
        v.id ||
        ''
      ).toLowerCase();

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(search) ||
        phone.includes(search) ||
        lab.includes(search) ||
        ref.includes(search);

      const matchesLab =
        !labFilter ||
        v.laboratory === labFilter;

      const matchesBranch =
        !branchFilter ||
        v.branch === branchFilter;

      const matchesStatus =
        !statusFilter ||
        v.status === statusFilter;

      return (
        matchesSearch &&
        matchesLab &&
        matchesBranch &&
        matchesStatus
      );
    }
  );

  // ============================================================
  // Filter enquiries
  // ============================================================
  const filteredEnquiries = enquiries.filter(
    (e) => {
      const name = (
        e.full_name ||
        e.name ||
        ''
      ).toLowerCase();

      const sub = (
        e.subject || ''
      ).toLowerCase();

      const msg = (
        e.message || ''
      ).toLowerCase();

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(search) ||
        sub.includes(search) ||
        msg.includes(search);

      const matchesLab =
        !labFilter ||
        e.laboratory === labFilter;

      const matchesBranch =
        !branchFilter ||
        e.branch === branchFilter;

      const matchesStatus =
        !statusFilter ||
        e.status === statusFilter;

      return (
        matchesSearch &&
        matchesLab &&
        matchesBranch &&
        matchesStatus
      );
    }
  );

  // ============================================================
  // Filter surveys
  // ============================================================
  const filteredSurveys = surveys.filter(
    (s) => {
      const svc = (
        s.service_used || ''
      ).toLowerCase();

      const sat = (
        s.overall_satisfaction || ''
      ).toLowerCase();

      const comm = (
        s.liked_most ||
        s.improvements ||
        s.additional_comments ||
        ''
      ).toLowerCase();

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        svc.includes(search) ||
        sat.includes(search) ||
        comm.includes(search);

      const matchesLab =
        !labFilter ||
        s.laboratory === labFilter;

      const matchesBranch =
        !branchFilter ||
        s.branch === branchFilter;

      return (
        matchesSearch &&
        matchesLab &&
        matchesBranch
      );
    }
  );

  // ============================================================
  // Export CSV
  // ============================================================
  const exportCSV = (
    data: Record<string, unknown>[],
    filename: string
  ) => {
    if (data.length === 0) return;

    const headers = Object.keys(
      data[0]
    );

    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map(
            (h) =>
              `"${String(
                row[h] ?? ''
              ).replace(/"/g, '""')}"`
          )
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob(
      ['\ufeff' + csv],
      {
        type: 'text/csv;charset=utf-8',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ============================================================
  // Login screen
  // ============================================================
  if (!loggedIn) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">

          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-4">
              <LabLogo variant="mark" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">
              {t('admin.dashboard')}
            </h1>

            <p className="text-slate-500 text-sm">
              {t('admin.login')}
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm"
          >
            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                {t('admin.username')}
              </label>

              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm(
                    (prev) => ({
                      ...prev,
                      username:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all"
                placeholder="admin"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                {t('admin.password')}
              </label>

              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm(
                    (prev) => ({
                      ...prev,
                      password:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all"
                placeholder="••••••"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors disabled:opacity-60 shadow-md"
            >
              {loggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}

              {t('admin.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // Admin tabs
  // ============================================================
  const tabs: {
    id: Tab;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    {
      id: 'dashboard',
      label: t('admin.dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'visitors',
      label: t('admin.visitors'),
      icon: Users,
    },
    {
      id: 'surveys',
      label: t('admin.surveys'),
      icon: FileText,
    },
    {
      id: 'enquiries',
      label: t('admin.enquiries'),
      icon: MessageSquare,
    },
    {
      id: 'users',
      label: t('admin.users'),
      icon: UserCog,
    },
  ];

  return (
    <div
      className="pt-20 min-h-screen bg-slate-50"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              {t('admin.dashboard')}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {t('admin.welcome')},{' '}
              <span className="font-semibold text-navy-800">
                {adminUser?.full_name}
              </span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-red-300 hover:text-red-600 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            {t('admin.logout')}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar */}
        {activeTab !== 'dashboard' &&
          activeTab !== 'users' && (
            <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">

              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder={t('admin.search')}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-navy-500"
                />
              </div>

              {/* Laboratory Filter */}
              <select
                value={labFilter}
                onChange={(e) => {
                  setLabFilter(
                    e.target.value
                  );
                  setBranchFilter('');
                }}
                className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
              >
                <option value="">
                  {lang === 'ar'
                    ? '-- جميع المختبرات --'
                    : '-- All Laboratories --'}
                </option>

                {LAB_HIERARCHY.map((l) => (
                  <option
                    key={l.id}
                    value={l.id}
                  >
                    {l.name[lang] ||
                      l.name.en}
                  </option>
                ))}
              </select>

              {/* Branch Filter */}
              {labFilter && (
                <select
                  value={branchFilter}
                  onChange={(e) =>
                    setBranchFilter(
                      e.target.value
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                >
                  <option value="">
                    {lang === 'ar'
                      ? '-- جميع الفروع --'
                      : '-- All Branches --'}
                  </option>

                  {LAB_HIERARCHY.find(
                    (l) =>
                      l.id === labFilter
                  )?.branches.map(
                    (b) => (
                      <option
                        key={b.id}
                        value={b.id}
                      >
                        {b.name[lang] ||
                          b.name.en}
                      </option>
                    )
                  )}
                </select>
              )}

              {/* Status Filter */}
              {activeTab !== 'surveys' && (
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                >
                  <option value="">
                    {lang === 'ar'
                      ? '-- جميع الحالات --'
                      : '-- All Statuses --'}
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="checked_in">
                    Checked In
                  </option>

                  <option value="new">
                    New
                  </option>

                  <option value="responded">
                    Responded
                  </option>
                </select>
              )}

              <button
                onClick={() => {
                  if (
                    activeTab ===
                    'visitors'
                  ) {
                    exportCSV(
                      filteredVisitors as unknown as Record<
                        string,
                        unknown
                      >[],
                      'visitors.csv'
                    );
                  } else if (
                    activeTab ===
                    'enquiries'
                  ) {
                    exportCSV(
                      filteredEnquiries as unknown as Record<
                        string,
                        unknown
                      >[],
                      'enquiries.csv'
                    );
                  } else if (
                    activeTab ===
                    'surveys'
                  ) {
                    exportCSV(
                      filteredSurveys as unknown as Record<
                        string,
                        unknown
                      >[],
                      'surveys.csv'
                    );
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {t('admin.export')}
                </span>
              </button>
            </div>
          )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-navy-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab ===
              'dashboard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label:
                      t('admin.totalVisitors'),
                    value:
                      visitors.length,
                    icon: Users,
                  },
                  {
                    label:
                      t('admin.totalSurveys'),
                    value:
                      surveys.length,
                    icon: FileText,
                  },
                  {
                    label:
                      t('admin.totalEnquiries'),
                    value:
                      enquiries.length,
                    icon: MessageSquare,
                  },
                  {
                    label:
                      t('admin.totalUsers'),
                    value:
                      adminUsers.length,
                    icon: UserCog,
                  },
                ].map(
                  (stat, i) => {
                    const Icon =
                      stat.icon;

                    return (
                      <div
                        key={i}
                        className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-navy-700" />
                        </div>

                        <p className="text-3xl font-extrabold text-slate-800">
                          {stat.value}
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                          {stat.label}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Visitors */}
            {activeTab ===
              'visitors' && (
              <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs">
                      <th className="px-4 py-3 text-start font-bold">
                        {t('visitor.name')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('contact.phone')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('visitor.lab')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('visitor.date')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('register.purpose')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('admin.status')}
                      </th>
                      <th className="px-4 py-3 text-start font-bold">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVisitors.map(
                      (v) => {
                        const name =
                          v.first_name
                            ? `${v.first_name} ${
                                v.last_name ||
                                ''
                              }`
                            : v.visitor_name ||
                              'Visitor';

                        const labName =
                          v.laboratory
                            ? getLabLabel(
                                v.laboratory,
                                lang
                              ) +
                              (v.branch
                                ? ` (${getBranchLabel(
                                    v.laboratory,
                                    v.branch,
                                    lang
                                  )})`
                                : '')
                            : v.department ||
                              '-';

                        return (
                          <tr
                            key={v.id}
                            className="border-t border-slate-100 hover:bg-slate-50"
                          >
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-800">
                                {name}
                              </p>

                              <div className="flex items-center gap-2 mt-0.5">
                                {v.visitor_id && (
                                  <span className="text-[11px] font-mono text-navy-600 bg-navy-50 px-1.5 py-0.5 rounded">
                                    {
                                      v.visitor_id
                                    }
                                  </span>
                                )}

                                {v.company && (
                                  <span className="text-xs text-slate-400">
                                    {
                                      v.company
                                    }
                                  </span>
                                )}
                              </div>
                            </td>

                            <td
                              className="px-4 py-3 text-slate-600"
                              dir="ltr"
                            >
                              {v.phone}
                            </td>

                            <td className="px-4 py-3 text-slate-700 font-medium">
                              {labName}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {v.visit_date}{' '}
                              {v.arrival_time
                                ? `(${v.arrival_time})`
                                : ''}
                            </td>

                            <td className="px-4 py-3 text-slate-600 text-xs">
                              {v.purpose ||
                                v.visit_purpose ||
                                '-'}
                            </td>

                            <td className="px-4 py-3">
                              <select
                                value={
                                  v.status
                                }
                                onChange={(e) =>
                                  handleUpdateVisitorStatus(
                                    v.id,
                                    e.target.value
                                  )
                                }
                                className="text-xs font-bold px-2 py-1 rounded border border-slate-200 bg-white"
                              >
                                <option value="Pending">
                                  Pending
                                </option>

                                <option value="Approved">
                                  Approved
                                </option>

                                <option value="checked_in">
                                  Checked In
                                </option>

                                <option value="checked_out">
                                  Checked Out
                                </option>
                              </select>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/visitor/${
                                    v.visitor_id ||
                                    v.id
                                  }`}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-navy-100 text-slate-600 hover:text-navy-700"
                                  title={t(
                                    'visitor.details'
                                  )}
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>

                                <button
                                  onClick={() =>
                                    handleDeleteVisitor(
                                      v.id
                                    )
                                  }
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>

                {filteredVisitors.length ===
                  0 && (
                  <p className="text-center text-slate-400 py-8">
                    {t('admin.noData')}
                  </p>
                )}
              </div>
            )}

            {/* Surveys */}
            {activeTab ===
              'surveys' && (
              <div className="space-y-4">
                {filteredSurveys.map(
                  (s) => {
                    const labName =
                      s.laboratory
                        ? getLabLabel(
                            s.laboratory,
                            lang
                          ) +
                          (s.branch
                            ? ` (${getBranchLabel(
                                s.laboratory,
                                s.branch,
                                lang
                              )})`
                            : '')
                        : '-';

                    return (
                      <div
                        key={s.id}
                        className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {
                                s.service_used
                              }
                            </p>

                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="font-medium text-navy-700">
                                {
                                  labName
                                }
                              </span>

                              <span>
                                •
                              </span>

                              <span>
                                {new Date(
                                  s.created_at
                                ).toLocaleDateString()}
                              </span>

                              {s.overall_satisfaction && (
                                <>
                                  <span>
                                    •
                                  </span>

                                  <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                                    {
                                      s.overall_satisfaction
                                    }
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {s.recommendation_score !==
                            null && (
                            <div className="text-end">
                              <p className="text-xs text-slate-400">
                                {t(
                                  'survey.recommend'
                                )}
                              </p>

                              <p className="text-base font-extrabold text-navy-800">
                                {
                                  s.recommendation_score
                                }
                                /10
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Criteria scores */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-3">
                          {[
                            {
                              label:
                                'Staff',
                              val: s.staff_professionalism,
                            },
                            {
                              label:
                                'Speed',
                              val: s.service_speed,
                            },
                            {
                              label:
                                'Samples',
                              val: s.sample_submission,
                            },
                            {
                              label:
                                'Reports',
                              val: s.report_clarity,
                            },
                            {
                              label:
                                'Comm',
                              val: s.communication,
                            },
                            {
                              label:
                                'Cleanliness',
                              val: s.laboratory_cleanliness,
                            },
                            {
                              label:
                                'Overall',
                              val: s.overall_experience,
                            },
                          ].map(
                            (
                              item,
                              idx
                            ) => (
                              <div
                                key={
                                  idx
                                }
                                className="p-2 rounded-lg bg-slate-50 text-center"
                              >
                                <p className="text-[10px] text-slate-400 truncate">
                                  {
                                    item.label
                                  }
                                </p>

                                <p className="text-sm font-bold text-navy-700">
                                  {item.val ??
                                    '-'}/5
                                </p>
                              </div>
                            )
                          )}
                        </div>

                        {/* Comments */}
                        {(s.liked_most ||
                          s.improvements ||
                          s.additional_comments) && (
                          <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 space-y-1.5 mt-2">
                            {s.liked_most && (
                              <p>
                                <span className="font-bold text-slate-900">
                                  Liked:
                                </span>{' '}
                                {
                                  s.liked_most
                                }
                              </p>
                            )}

                            {s.improvements && (
                              <p>
                                <span className="font-bold text-slate-900">
                                  Improvements:
                                </span>{' '}
                                {
                                  s.improvements
                                }
                              </p>
                            )}

                            {s.additional_comments && (
                              <p>
                                <span className="font-bold text-slate-900">
                                  Comments:
                                </span>{' '}
                                {
                                  s.additional_comments
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}

                {filteredSurveys.length ===
                  0 && (
                  <p className="text-center text-slate-400 py-8">
                    {t(
                      'admin.noSurveys'
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Enquiries */}
            {activeTab ===
              'enquiries' && (
              <div className="space-y-4">
                {filteredEnquiries.map(
                  (en) => {
                    const labName =
                      en.laboratory
                        ? getLabLabel(
                            en.laboratory,
                            lang
                          ) +
                          (en.branch
                            ? ` (${getBranchLabel(
                                en.laboratory,
                                en.branch,
                                lang
                              )})`
                            : '')
                        : '-';

                    const name =
                      en.full_name ||
                      en.name ||
                      'Enquirer';

                    return (
                      <div
                        key={en.id}
                        className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800 text-sm">
                                {name}
                              </p>

                              {en.company_name && (
                                <span className="text-xs text-slate-400">
                                  (
                                  {
                                    en.company_name
                                  }
                                  )
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span className="font-medium text-navy-700">
                                {
                                  labName
                                }
                              </span>

                              <span>
                                •
                              </span>

                              <span
                                dir="ltr"
                              >
                                {en.email ||
                                  en.contact_info}
                              </span>

                              {en.phone && (
                                <>
                                  <span>
                                    •
                                  </span>

                                  <span
                                    dir="ltr"
                                  >
                                    {
                                      en.phone
                                    }
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={
                                en.status
                              }
                              onChange={(
                                e
                              ) =>
                                handleUpdateEnquiryStatus(
                                  en.id,
                                  e.target.value
                                )
                              }
                              className="text-xs font-bold px-2 py-1 rounded border border-slate-200 bg-white"
                            >
                              <option value="new">
                                {t(
                                  'admin.new'
                                )}
                              </option>

                              <option value="responded">
                                {t(
                                  'admin.responded'
                                )}
                              </option>

                              <option value="closed">
                                {t(
                                  'admin.closed'
                                )}
                              </option>
                            </select>

                            <button
                              onClick={() =>
                                handleDeleteEnquiry(
                                  en.id
                                )
                              }
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {en.service_required && (
                          <p className="text-xs font-semibold text-navy-800 mb-1">
                            Service:{' '}
                            {
                              en.service_required
                            }
                          </p>
                        )}

                        {en.subject && (
                          <p className="font-bold text-slate-700 text-sm mb-1">
                            {
                              en.subject
                            }
                          </p>
                        )}

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {en.message}
                        </p>
                      </div>
                    );
                  }
                )}

                {filteredEnquiries.length ===
                  0 && (
                  <p className="text-center text-slate-400 py-8">
                    {t(
                      'admin.noEnquiries'
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {adminUsers.length}{' '}
                    {t('admin.users')}
                  </p>

                  <button
                    onClick={() => {
                      setUserForm({
                        username: '',
                        password: '',
                        full_name: '',
                        role: 'user',
                      });

                      setShowUserModal(
                        true
                      );
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {t(
                      'admin.addUser'
                    )}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs">
                        <th className="px-4 py-3 text-start font-bold">
                          {t(
                            'admin.fullName'
                          )}
                        </th>

                        <th className="px-4 py-3 text-start font-bold">
                          {t(
                            'admin.username'
                          )}
                        </th>

                        <th className="px-4 py-3 text-start font-bold">
                          {t(
                            'admin.role'
                          )}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {adminUsers.map(
                        (u) => (
                          <tr
                            key={u.id}
                            className="border-t border-slate-100 hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 font-bold text-slate-700">
                              {
                                u.full_name
                              }
                            </td>

                            <td
                              className="px-4 py-3 text-slate-600"
                              dir="ltr"
                            >
                              {
                                u.username
                              }
                            </td>

                            <td className="px-4 py-3">
                              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-navy-50 text-navy-800">
                                {
                                  u.role
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-lg">
                  {t('admin.addUser')}
                </h3>

                <button
                  onClick={() =>
                    setShowUserModal(
                      false
                    )
                  }
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {userError && (
                <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />

                  <span>
                    {userError}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleSaveUser}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t(
                      'admin.fullName'
                    )}
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      userForm.full_name
                    }
                    onChange={(e) =>
                      setUserForm(
                        (p) => ({
                          ...p,
                          full_name:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t(
                      'admin.username'
                    )}
                  </label>

                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={
                      userForm.username
                    }
                    onChange={(e) =>
                      setUserForm(
                        (p) => ({
                          ...p,
                          username:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t(
                      'admin.password'
                    )}
                  </label>

                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={
                      userForm.password
                    }
                    onChange={(e) =>
                      setUserForm(
                        (p) => ({
                          ...p,
                          password:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {t(
                      'admin.role'
                    )}
                  </label>

                  <select
                    value={
                      userForm.role
                    }
                    onChange={(e) =>
                      setUserForm(
                        (p) => ({
                          ...p,
                          role:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-navy-500"
                  >
                    <option value="user">
                      User / Viewer
                    </option>

                    <option value="admin">
                      Administrator
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      setShowUserModal(
                        false
                      )
                    }
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
                  >
                    {t('misc.cancel') ||
                      'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-navy-800 text-white text-xs font-bold hover:bg-navy-700 shadow-sm"
                  >
                    {t('misc.save') ||
                      'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```
