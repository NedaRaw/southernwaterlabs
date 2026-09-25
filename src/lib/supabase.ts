import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

const STORAGE_KEYS = {
  VISITORS: 'swl_visitors',
  SURVEYS: 'swl_surveys',
  ENQUIRIES: 'swl_enquiries',
  ADMIN_USERS: 'swl_admin_users',
};

export interface AdminUserData {
  id: string;
  username: string;
  password?: string;
  full_name: string;
  role: string;
}

export interface VisitorDataRecord {
  id: string;
  visitor_id?: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
  visitor_name?: string;
  company?: string | null;
  job_title?: string | null;
  phone: string;
  email?: string | null;
  laboratory?: string | null;
  branch?: string | null;
  department?: string | null;
  employee?: string | null;
  purpose?: string | null;
  visit_date: string;
  arrival_time?: string | null;
  qr_url?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface SurveyDataRecord {
  id: string;
  laboratory: string;
  branch?: string | null;
  service_used: string;
  how_heard?: string | null;
  overall_satisfaction?: string | null;
  staff_professionalism?: number | null;
  service_speed?: number | null;
  sample_submission?: number | null;
  report_clarity?: number | null;
  communication?: number | null;
  laboratory_cleanliness?: number | null;
  overall_experience?: number | null;
  results_on_time?: string | null;
  reports_understandable?: string | null;
  recommendation_score?: number | null;
  liked_most?: string | null;
  improvements?: string | null;
  contact_me?: string | null;
  additional_comments?: string | null;
  created_at: string;
  [key: string]: unknown;
}

export interface EnquiryDataRecord {
  id: string;
  laboratory?: string | null;
  branch?: string | null;
  full_name?: string;
  name?: string;
  company_name?: string | null;
  email?: string;
  phone?: string | null;
  contact_info?: string;
  location?: string | null;
  service_required?: string | null;
  subject?: string | null;
  message: string;
  status?: string;
  created_at: string;
  [key: string]: unknown;
}

const defaultAdminUsers: AdminUserData[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    full_name: 'مدير النظام',
    role: 'admin',
  },
];

const defaultVisitors: VisitorDataRecord[] = [
  {
    id: 'vis-1001',
    visitor_name: 'م. أحمد القحطاني',
    company: 'هيئة المياه الوطنية',
    job_title: 'مهندس جودة',
    phone: '0501234567',
    email: 'ahmed@nwc.com.sa',
    visit_date: '2026-09-24',
    laboratory: 'مختبر عسير المركزي - فرع أبها',
    visit_purpose: 'فحص عينات دورية للمياه المعالجة',
    notes: 'زيارة مجدولة مسبقاً',
    status: 'checked_in',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'vis-1002',
    visitor_name: 'د. سارة الشهراني',
    company: 'جامعة الملك خالد',
    job_title: 'أستاذ باحث',
    phone: '0559876543',
    email: 'sarah@kku.edu.sa',
    visit_date: '2026-09-25',
    laboratory: 'المختبر الإقليمي بجازان',
    visit_purpose: 'بحث علمي واختبار ميكروبيولوجي',
    notes: 'تنسيق مع الإدارة الإقليمية',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const defaultSurveys: SurveyDataRecord[] = [
  {
    id: 'srv-101',
    respondent_name: 'عبدالله الغامدي',
    respondent_contact: '0540001122',
    service_quality_rating: 5,
    facility_rating: 5,
    staff_rating: 5,
    overall_rating: 5,
    comments: 'خدمة متميزة وسرعة في استلام العينات وظهور النتائج.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const defaultEnquiries: EnquiryDataRecord[] = [
  {
    id: 'enq-201',
    name: 'مبارك اليامي',
    contact_info: '0567788990',
    subject: 'طلب تحليل عينات مياه آبار خاصة',
    message: 'السلام عليكم، أرغب في معرفة الإجراءات والرسوم المطلوبة لفحص عينات بئر ارتوازية في منطقة نجران.',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

function loadData<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function saveData<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('Could not persist data to localStorage:', err);
  }
}

type GenericRow = Record<string, unknown>;

function createMockSupabaseClient() {
  return {
    from: (table: string) => {
      return {
        select: () => {
          let rows: GenericRow[] = [];
          if (table === 'visitors') rows = loadData<GenericRow[]>(STORAGE_KEYS.VISITORS, defaultVisitors);
          else if (table === 'surveys') rows = loadData<GenericRow[]>(STORAGE_KEYS.SURVEYS, defaultSurveys);
          else if (table === 'enquiries') rows = loadData<GenericRow[]>(STORAGE_KEYS.ENQUIRIES, defaultEnquiries);

          return {
            eq: (col: string, val: unknown) => {
              const filtered = rows.filter(r => String(r[col]) === String(val));
              return {
                single: async () => {
                  const item = filtered[0] || null;
                  return { data: item, error: item ? null : { message: 'Not found' } };
                },
                then: (resolve: (res: { data: GenericRow[]; error: null }) => void) =>
                  resolve({ data: filtered, error: null }),
              };
            },
            order: (col: string, { ascending = true }: { ascending?: boolean } = {}) => {
              const sorted = [...rows].sort((a, b) => {
                const va = String(a[col] ?? '');
                const vb = String(b[col] ?? '');
                if (va < vb) return ascending ? -1 : 1;
                if (va > vb) return ascending ? 1 : -1;
                return 0;
              });
              return Promise.resolve({ data: sorted, error: null });
            },
            then: (resolve: (res: { data: GenericRow[]; error: null }) => void) =>
              resolve({ data: rows, error: null }),
          };
        },
        insert: (row: GenericRow) => {
          const now = new Date().toISOString();
          const generatedId =
            table === 'visitors'
              ? `VIS-${Date.now().toString().slice(-6)}`
              : `${table.slice(0, 3)}-${Date.now()}`;
          const newRecord: GenericRow = {
            id: generatedId,
            created_at: now,
            status: table === 'enquiries' ? 'new' : 'pending',
            ...row,
          };

          if (table === 'visitors') {
            const visitors = loadData<GenericRow[]>(STORAGE_KEYS.VISITORS, defaultVisitors);
            saveData(STORAGE_KEYS.VISITORS, [newRecord, ...visitors]);
          } else if (table === 'surveys') {
            const surveys = loadData<GenericRow[]>(STORAGE_KEYS.SURVEYS, defaultSurveys);
            saveData(STORAGE_KEYS.SURVEYS, [newRecord, ...surveys]);
          } else if (table === 'enquiries') {
            const enquiries = loadData<GenericRow[]>(STORAGE_KEYS.ENQUIRIES, defaultEnquiries);
            saveData(STORAGE_KEYS.ENQUIRIES, [newRecord, ...enquiries]);
          }

          return {
            select: () => ({
              single: async () => ({ data: newRecord, error: null }),
              then: (resolve: (res: { data: GenericRow[]; error: null }) => void) =>
                resolve({ data: [newRecord], error: null }),
            }),
            then: (resolve: (res: { data: GenericRow[]; error: null }) => void) =>
              resolve({ data: [newRecord], error: null }),
          };
        },
        update: (patch: GenericRow) => {
          return {
            eq: async (col: string, val: unknown) => {
              let storageKey = '';
              if (table === 'visitors') storageKey = STORAGE_KEYS.VISITORS;
              else if (table === 'enquiries') storageKey = STORAGE_KEYS.ENQUIRIES;
              else if (table === 'surveys') storageKey = STORAGE_KEYS.SURVEYS;

              if (storageKey) {
                const items = loadData<GenericRow[]>(storageKey, []);
                const updated = items.map(item =>
                  String(item[col]) === String(val) ? { ...item, ...patch } : item
                );
                saveData(storageKey, updated);
              }
              return { data: patch, error: null };
            },
          };
        },
        delete: () => {
          return {
            eq: async (col: string, val: unknown) => {
              let storageKey = '';
              if (table === 'visitors') storageKey = STORAGE_KEYS.VISITORS;
              else if (table === 'enquiries') storageKey = STORAGE_KEYS.ENQUIRIES;
              else if (table === 'surveys') storageKey = STORAGE_KEYS.SURVEYS;

              if (storageKey) {
                const items = loadData<GenericRow[]>(storageKey, []);
                const filtered = items.filter(item => String(item[col]) !== String(val));
                saveData(storageKey, filtered);
              }
              return { data: null, error: null };
            },
          };
        },
      };
    },
    rpc: async (fnName: string, args: Record<string, unknown> = {}) => {
      const users = loadData<AdminUserData[]>(STORAGE_KEYS.ADMIN_USERS, defaultAdminUsers);

      switch (fnName) {
        case 'verify_admin_credentials': {
          const { p_username, p_password } = args as { p_username?: string; p_password?: string };
          const match = users.find(
            u => u.username === p_username && u.password === p_password
          );
          if (match) {
            return {
              data: [
                {
                  id: match.id,
                  username: match.username,
                  full_name: match.full_name,
                  role: match.role,
                },
              ],
              error: null,
            };
          }
          return { data: [], error: null };
        }

        case 'get_all_admin_users': {
          const safeUsers = users.map(u => ({
            id: u.id,
            username: u.username,
            full_name: u.full_name,
            role: u.role,
          }));
          return { data: safeUsers, error: null };
        }

        case 'create_admin_user': {
          const { p_username, p_password, p_full_name, p_role } = args as {
            p_username: string;
            p_password?: string;
            p_full_name: string;
            p_role?: string;
          };
          if (users.some(u => u.username === p_username)) {
            return { data: null, error: { message: 'duplicate username' } };
          }
          const newUser: AdminUserData = {
            id: `usr-${Date.now()}`,
            username: p_username,
            password: p_password,
            full_name: p_full_name,
            role: p_role || 'user',
          };
          saveData(STORAGE_KEYS.ADMIN_USERS, [...users, newUser]);
          return { data: null, error: null };
        }

        case 'update_admin_user': {
          const { p_id, p_username, p_password, p_full_name, p_role } = args as {
            p_id: string;
            p_username?: string;
            p_password?: string;
            p_full_name?: string;
            p_role?: string;
          };
          const updated = users.map(u => {
            if (u.id === p_id) {
              return {
                ...u,
                username: p_username ?? u.username,
                ...(p_password ? { password: p_password } : {}),
                full_name: p_full_name ?? u.full_name,
                role: p_role ?? u.role,
              };
            }
            return u;
          });
          saveData(STORAGE_KEYS.ADMIN_USERS, updated);
          return { data: null, error: null };
        }

        case 'delete_admin_user': {
          const { p_id } = args as { p_id: string };
          const filtered = users.filter(u => u.id !== p_id);
          saveData(STORAGE_KEYS.ADMIN_USERS, filtered);
          return { data: null, error: null };
        }

        default:
          return { data: null, error: { message: `Unknown function ${fnName}` } };
      }
    },
  };
}

export const supabase = (
  isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : createMockSupabaseClient()
) as ReturnType<typeof createClient>;
