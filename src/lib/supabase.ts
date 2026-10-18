import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('ACTIVE SUPABASE URL:', supabaseUrl);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const STORAGE_KEYS = {
  VISITORS: 'swl_visitors',
  SURVEYS: 'swl_surveys',
  ENQUIRIES: 'swl_enquiries',
  ADMIN_USERS: 'swl_admin_users',
  ACTIVE_SESSIONS: 'swl_active_sessions',
  ANALYSIS_REPORTS: 'swl_analysis_reports',
};

export interface AnalysisReportRecord {
  id: string;
  report_number: string;
  visitor_id: string;
  visitor_name: string;
  sample_code: string;
  sample_type: string;
  sample_type_ar?: string;
  sample_type_en?: string;
  sample_type_fr?: string;
  laboratory: string;
  branch?: string | null;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  file_data_url?: string;
  status: 'available' | 'pending' | 'archived';
  notes?: string | null;
  uploaded_by?: string | null;
  uploaded_by_name?: string | null;
  deleted_at?: string | null;
  created_at: string;
  issue_date?: string;
  [key: string]: unknown;
}

export interface AdminUserData {
  id: string;
  username: string;
  password?: string;
  full_name: string;
  role: string;
  laboratory?: string | null;
  branch?: string | null;
  branches?: string[] | null;
  active?: boolean;
  is_primary?: boolean;
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

export const defaultAdminUsers: AdminUserData[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    full_name: 'مدير النظام العام (المشرف العام)',
    role: 'super_admin',
    laboratory: null,
    branch: null,
    active: true,
    is_primary: true,
  },
  {
    id: '2',
    username: 'lab_asir',
    password: 'admin123',
    full_name: 'مدير  مختبر عسير المرجعي',
    role: 'lab_admin',
    laboratory: 'asir',
    branch: null,
    active: true,
    is_primary: false,
  },
  {
    id: '3',
    username: 'local_bisha',
    password: 'admin123',
    full_name: 'مسؤول فرع بيشة - عسير',
    role: 'local_admin',
    laboratory: 'asir',
    branch: 'bisha',
    active: true,
    is_primary: false,
  },
  {
    id: '4',
    username: 'local_mahayel',
    password: 'admin123',
    full_name: 'مسؤول فرع محايل عسير',
    role: 'local_admin',
    laboratory: 'asir',
    branch: 'mahayel',
    active: true,
    is_primary: false,
  },
  {
    id: '5',
    username: 'user_asir',
    password: 'admin123',
    full_name: 'فني مختبر عسير (مستخدم عادي)',
    role: 'user',
    laboratory: 'asir',
    branch: 'bisha',
    active: true,
    is_primary: false,
  },
  {
    id: '6',
    username: 'lab_najran',
    password: 'admin123',
    full_name: 'مدير مختبر نجران المركزي',
    role: 'lab_admin',
    laboratory: 'najran',
    branch: null,
    active: true,
    is_primary: false,
  },
  {
    id: '7',
    username: 'local_sharurah',
    password: 'admin123',
    full_name: 'مسؤول فرع شرورة - نجران',
    role: 'local_admin',
    laboratory: 'najran',
    branch: 'sharurah',
    active: true,
    is_primary: false,
  },
  {
    id: '8',
    username: 'user_najran',
    password: 'admin123',
    full_name: 'محلل جودة نجران (مستخدم عادي)',
    role: 'user',
    laboratory: 'najran',
    branch: 'sharurah',
    active: true,
    is_primary: false,
  },
  {
    id: '9',
    username: 'lab_albaha',
    password: 'admin123',
    full_name: 'مدير مختبر الباحة المركزي',
    role: 'lab_admin',
    laboratory: 'al-baha',
    branch: null,
    active: true,
    is_primary: false,
  },
  {
    id: '10',
    username: 'local_qalwah',
    password: 'admin123',
    full_name: 'مسؤول فرع قلوة - الباحة',
    role: 'local_admin',
    laboratory: 'al-baha',
    branch: 'qalwah',
    active: true,
    is_primary: false,
  },
  {
    id: '11',
    username: 'lab_jazan',
    password: 'admin123',
    full_name: 'مدير مختبر جازان المركزي',
    role: 'lab_admin',
    laboratory: 'jazan',
    branch: null,
    active: true,
    is_primary: false,
  },
  {
    id: '12',
    username: 'local_aldarb',
    password: 'admin123',
    full_name: 'مسؤول فرع الدرب - جازان',
    role: 'local_admin',
    laboratory: 'jazan',
    branch: 'al-darb',
    active: true,
    is_primary: false,
  },
  {
    id: '13',
    username: 'local_farasan',
    password: 'admin123',
    full_name: 'مسؤول فرع جزر فرسان - جازان',
    role: 'local_admin',
    laboratory: 'jazan',
    branch: 'farasan',
    active: true,
    is_primary: false,
  },
  {
    id: '14',
    username: 'local_asir_dual',
    password: 'admin123',
    full_name: 'مسؤول فروع عسير المشتركة (بيشة ومحايل)',
    role: 'local_admin',
    laboratory: 'asir',
    branch: 'bisha,mahayel',
    branches: ['bisha', 'mahayel'],
    active: true,
    is_primary: false,
  },
  {
    id: '15',
    username: 'local_jazan_dual',
    password: 'admin123',
    full_name: 'مسؤول فروع جازان (الدرب وفرسان)',
    role: 'local_admin',
    laboratory: 'jazan',
    branch: 'al-darb,farasan',
    branches: ['al-darb', 'farasan'],
    active: true,
    is_primary: false,
  },
];

const defaultVisitors: VisitorDataRecord[] = [
  {
    id: 'vis-1001',
    visitor_name: 'م. أحمد القحطاني',
    company: 'هيئة المياه الوطنية',
    job_title: 'مهندس جودة مياه',
    phone: '0501234567',
    email: 'ahmed@nwc.com.sa',
    visit_date: '2026-09-24',
    laboratory: 'asir',
    branch: 'bisha',
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
    laboratory: 'jazan',
    branch: 'al-darb',
    visit_purpose: 'بحث علمي واختبار ميكروبيولوجي',
    notes: 'تنسيق مع إدارة المختبر المركزي',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'vis-1003',
    visitor_name: 'سالم بن علي الصيعري',
    company: 'بلدية شرورة',
    job_title: 'مفتش صحي',
    phone: '0543322110',
    email: 'salem@sharurah.gov.sa',
    visit_date: '2026-09-26',
    laboratory: 'najran',
    branch: 'sharurah',
    visit_purpose: 'تسليم عينات مياه شبكة الشرب',
    notes: 'عينات عاجلة',
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'vis-1004',
    visitor_name: 'فهد عبدالله الزهراني',
    company: 'فرع وزارة البيئة والمياه والزراعة بالباحة',
    job_title: 'أخصائي بيئي',
    phone: '0567788112',
    email: 'fahad@mewa.gov.sa',
    visit_date: '2026-09-27',
    laboratory: 'al-baha',
    branch: 'qalwah',
    visit_purpose: 'فحص عينات سد وادي قلوة',
    notes: 'تقارير معتمدة',
    status: 'checked_in',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'vis-1005',
    visitor_name: 'سلطان مريع عسيري',
    company: 'بلدية محايل عسير',
    job_title: 'رئيس قسم صحة البيئة',
    phone: '0505544332',
    email: 'sultan@mahayel.gov.sa',
    visit_date: '2026-09-28',
    laboratory: 'asir',
    branch: 'mahayel',
    visit_purpose: 'فحص عينات مياه الآبار بمحايل عسير',
    notes: 'عينات شهرية مجدولة',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'vis-1006',
    visitor_name: 'فيصل عبده صيادي',
    company: 'إدارة تشغيل وصيانة مياه فرسان',
    job_title: 'مشرف محطة تحلية',
    phone: '0539988771',
    email: 'faisal@farasan-water.sa',
    visit_date: '2026-09-29',
    laboratory: 'jazan',
    branch: 'farasan',
    visit_purpose: 'فحص ملوحة وميكروبيولوجيا محطة التحلية',
    notes: 'عاجل جداً',
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const defaultSurveys: SurveyDataRecord[] = [
  {
    id: 'srv-101',
    respondent_name: 'عبدالله الغامدي',
    respondent_contact: '0540001122',
    laboratory: 'asir',
    branch: 'bisha',
    service_used: 'Drinking Water Analysis',
    service_quality_rating: 5,
    facility_rating: 5,
    staff_rating: 5,
    overall_rating: 5,
    comments: 'خدمة متميزة وسرعة في استلام العينات وظهور النتائج في فرع بيشة.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'srv-102',
    respondent_name: 'محمد هادي اليامي',
    respondent_contact: '0551122334',
    laboratory: 'najran',
    branch: 'sharurah',
    service_used: 'Water Quality Testing',
    service_quality_rating: 5,
    facility_rating: 4,
    staff_rating: 5,
    overall_rating: 5,
    comments: 'تعامل راقي ودقة متناهية في فحوصات مختبر نجران وفرع شرورة.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'srv-103',
    respondent_name: 'إبراهيم يحيى الفيفي',
    respondent_contact: '0533344556',
    laboratory: 'jazan',
    branch: 'farasan',
    service_used: 'Chemical Analysis',
    service_quality_rating: 4,
    facility_rating: 5,
    staff_rating: 4,
    overall_rating: 4,
    comments: 'جهود تشكرون عليها لخدمة أهالي جزر فرسان والمختبر المركزي.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'srv-104',
    respondent_name: 'سعيد مفرح العسيري',
    respondent_contact: '0501199228',
    laboratory: 'asir',
    branch: 'mahayel',
    service_used: 'Microbiological Testing',
    service_quality_rating: 5,
    facility_rating: 5,
    staff_rating: 5,
    overall_rating: 5,
    comments: 'كفاءة عالية وسرعة استجابة من طاقم فرع محايل عسير والمختبر المرجعي.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 'srv-105',
    respondent_name: 'يحيى قاسم الدربي',
    respondent_contact: '0556677889',
    laboratory: 'jazan',
    branch: 'al-darb',
    service_used: 'Drinking Water Analysis',
    service_quality_rating: 5,
    facility_rating: 4,
    staff_rating: 5,
    overall_rating: 5,
    comments: 'خدمة ممتازة وفحوصات دقيقة لمياه الشرب بفرع الدرب.',
    would_recommend: true,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const defaultEnquiries: EnquiryDataRecord[] = [
  {
    id: 'enq-201',
    name: 'مبارك اليامي',
    laboratory: 'najran',
    branch: 'sharurah',
    contact_info: '0567788990',
    email: 'mubarak@gmail.com',
    phone: '0567788990',
    service_required: 'Drinking Water Analysis',
    subject: 'طلب تحليل عينات مياه آبار خاصة',
    message: 'السلام عليكم، أرغب في معرفة الإجراءات والرسوم المطلوبة لفحص عينات بئر ارتوازية في منطقة نجران وفرع شرورة.',
    status: 'New',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'enq-202',
    name: 'خالد عسيري',
    laboratory: 'asir',
    branch: 'mahayel',
    contact_info: '0509988776',
    email: 'khaled@asir-water.sa',
    phone: '0509988776',
    service_required: 'Water Quality Testing',
    subject: 'استفسار عن فحص محطات التحلية المصغرة',
    message: 'نود الاستفسار عن إمكانية التعاقد لفحص دوري لمحطات التنقية في محايل عسير.',
    status: 'In Progress',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'enq-203',
    name: 'عبدالرحمن الشهراني',
    laboratory: 'asir',
    branch: 'bisha',
    contact_info: '0544455667',
    email: 'a.shahrani@bisha.gov.sa',
    phone: '0544455667',
    service_required: 'Chemical Analysis',
    subject: 'فحص مياه شبكة بيشة',
    message: 'طلب تحليل كيميائي دوري لعينات شبكة التوزيع ببيشة.',
    status: 'New',
    created_at: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
  {
    id: 'enq-204',
    name: 'علي ناصر الدربي',
    laboratory: 'jazan',
    branch: 'al-darb',
    contact_info: '0555566778',
    email: 'ali.darb@jazan-lab.sa',
    phone: '0555566778',
    service_required: 'Drinking Water Analysis',
    subject: 'طلب اعتماد تحاليل لمصنع مياه',
    message: 'نطلب تقرير فحص دوري لاعتماد خطوط الإنتاج بفرع الدرب.',
    status: 'Resolved',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
];

export const defaultAnalysisReports: AnalysisReportRecord[] = [
  {
    id: 'rep-1001',
    report_number: 'NWC-ASR-2026-0941',
    visitor_id: 'vis-1001',
    visitor_name: 'م. أحمد القحطاني',
    sample_code: 'SMP-2026-8819',
    sample_type: 'مياه شرب معالجة — شبكة التوزيع المركزية',
    sample_type_ar: 'مياه شرب معالجة — شبكة التوزيع المركزية',
    sample_type_en: 'Treated Potable Water - Central Network',
    sample_type_fr: 'Eau potable traitée - Réseau central',
    laboratory: 'asir',
    branch: 'bisha',
    file_name: 'Analysis_Report_NWC_ASR_2026_0941.pdf',
    file_path: 'analysis-reports/asir/bisha/Analysis_Report_NWC_ASR_2026_0941.pdf',
    file_type: 'application/pdf',
    file_size: 1024 * 480, // ~480 KB
    file_data_url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0+PmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA2NiAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxODEKJSVFT0YK',
    status: 'available',
    notes: 'تقرير فحص دوري مطابق للمواصفة القياسية السعودية GSO 149/2014',
    uploaded_by: '2',
    uploaded_by_name: 'مدير مختبر عسير المرجعي',
    issue_date: '2026-10-14',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'rep-1002',
    report_number: 'NWC-NJR-2026-0812',
    visitor_id: 'vis-1003',
    visitor_name: 'سالم بن علي الصيعري',
    sample_code: 'SMP-2026-7240',
    sample_type: 'مياه خام غير معالجة — حقل آبار الشرفة',
    sample_type_ar: 'مياه خام غير معالجة — حقل آبار الشرفة',
    sample_type_en: 'Raw Ground Water - Al-Shorfa Wells',
    sample_type_fr: 'Eau brute souterraine - Puits Al-Shorfa',
    laboratory: 'najran',
    branch: 'sharurah',
    file_name: 'Groundwater_Chemical_Analysis_2026_0812.xlsx',
    file_path: 'analysis-reports/najran/sharurah/Groundwater_Chemical_Analysis_2026_0812.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 1024 * 315, // ~315 KB
    file_data_url: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAAA=',
    status: 'available',
    notes: 'جدول تحاليل كيميائية وفيزيائية شاملة لعينات بئر الشرفة وفرع شرورة',
    uploaded_by: '7',
    uploaded_by_name: 'مسؤول فرع شرورة - نجران',
    issue_date: '2026-10-12',
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'rep-1003',
    report_number: 'NWC-ABH-2026-0518',
    visitor_id: 'vis-1004',
    visitor_name: 'فهد عبدالله الزهراني',
    sample_code: 'SMP-2026-5531',
    sample_type: 'عينات مياه سد وادي قلوة',
    sample_type_ar: 'عينات مياه سد وادي قلوة',
    sample_type_en: 'Wadi Qalwah Dam Water Testing',
    sample_type_fr: 'Analyse d’eau du barrage de Wadi Qalwah',
    laboratory: 'al-baha',
    branch: 'qalwah',
    file_name: 'Dam_Water_Testing_ABH_0518.pdf',
    file_path: 'analysis-reports/al-baha/qalwah/Dam_Water_Testing_ABH_0518.pdf',
    file_type: 'application/pdf',
    file_size: 1024 * 620, // ~620 KB
    file_data_url: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0+PmVuZG9iagp4cmVmCjAgNAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA2NiAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxODEKJSVFT0YK',
    status: 'available',
    notes: 'تحليل بيئي معتمد لسد وادي قلوة والتعكر ونسبة المواد العالقة',
    uploaded_by: '10',
    uploaded_by_name: 'مسؤول فرع قلوة - الباحة',
    issue_date: '2026-10-10',
    created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: 'rep-1004',
    report_number: 'NWC-JZN-2026-0319',
    visitor_id: 'vis-1006',
    visitor_name: 'فيصل عبده صيادي',
    sample_code: 'SMP-2026-3199',
    sample_type: 'فحص ملوحة وميكروبيولوجيا محطة التحلية',
    sample_type_ar: 'فحص ملوحة وميكروبيولوجيا محطة التحلية',
    sample_type_en: 'Desalination Plant Salinity & Microbiology Test',
    sample_type_fr: 'Test de salinité et microbiologie de dessalement',
    laboratory: 'jazan',
    branch: 'farasan',
    file_name: 'Farasan_Desalination_Output_2026_0319.xlsx',
    file_path: 'analysis-reports/jazan/farasan/Farasan_Desalination_Output_2026_0319.xlsx',
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 1024 * 280, // ~280 KB
    file_data_url: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAAAAAAAAAAAAAAAAAAAAAAA=',
    status: 'available',
    notes: 'نتائج فحوصات جودة مخرجات محطة تحلية فرسان والتوصيلية الكهربائية',
    uploaded_by: '13',
    uploaded_by_name: 'مسؤول فرع جزر فرسان - جازان',
    issue_date: '2026-10-08',
    created_at: new Date(Date.now() - 3600000 * 24 * 8).toISOString(),
  },
];

export function loadData<T>(key: string, defaultVal: T): T {
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

export function saveData<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('Could not persist data to localStorage:', err);
  }
}

type GenericRow = Record<string, unknown>;

const canManageAccounts = (
  caller: AdminUserData | null
): caller is AdminUserData => {
  return Boolean(
    caller &&
    caller.active !== false &&
    ['super_admin', 'lab_admin', 'local_admin'].includes(caller.role)
  );
};

const canAssignRole = (
  callerRole: string,
  targetRole: string
): boolean => {
  const allowedRoles: Record<string, string[]> = {
    super_admin: ['super_admin', 'lab_admin', 'local_admin', 'user'],
    lab_admin: ['local_admin', 'user'],
    local_admin: ['user'],
  };

  return allowedRoles[callerRole]?.includes(targetRole) ?? false;
};

export const validBranchForLab = (
  laboratory: string | null | undefined,
  branch: string | null | undefined
): boolean => {
  if (!laboratory) {
    return branch == null || branch === '';
  }

  const branchesByLab: Record<string, string[]> = {
    asir: ['bisha', 'mahayel', 'muhayil'],
    najran: ['sharurah'],
    'al-baha': ['qalwah'],
    jazan: ['al-darb', 'farasan'],
  };

  const allowedBranches = branchesByLab[laboratory];

  if (!allowedBranches) return false;

  if (branch == null || branch === '') return true;

  // Split comma-separated branches (supports 1 or 2 branches simultaneously)
  const branches = branch
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean);

  if (branches.length === 0) return true;
  // Maximum 2 branches allowed simultaneously for local admin accounts
  if (branches.length > 2) return false;

  return branches.every((b) => allowedBranches.includes(b));
};

export const checkBranchScope = (
  callerBranches: string[],
  recordBranch?: string | null
): boolean => {
  if (!recordBranch) return false;
  const rb = recordBranch.trim().toLowerCase();
  return callerBranches.some((cb) => {
    const b = cb.trim().toLowerCase();
    if (rb === b || rb.includes(b) || b.includes(rb)) return true;
    if (b === 'bisha' && (rb.includes('بيشة') || rb.includes('bisha'))) return true;
    if ((b === 'mahayel' || b === 'muhayil') && (rb.includes('محايل') || rb.includes('mahayel') || rb.includes('muhayil'))) return true;
    if (b === 'sharurah' && (rb.includes('شرورة') || rb.includes('sharurah'))) return true;
    if (b === 'qalwah' && (rb.includes('قلوة') || rb.includes('qalwah'))) return true;
    if (b === 'al-darb' && (rb.includes('درب') || rb.includes('darb'))) return true;
    if (b === 'farasan' && (rb.includes('فرسان') || rb.includes('farasan'))) return true;
    return false;
  });
};

function createMockSupabaseClient() {
  return {
    from: (table: string) => {
      return {
        select: () => {
          let rows: GenericRow[] = [];
          if (table === 'visitors') rows = loadData<GenericRow[]>(STORAGE_KEYS.VISITORS, defaultVisitors);
          else if (table === 'surveys') rows = loadData<GenericRow[]>(STORAGE_KEYS.SURVEYS, defaultSurveys);
          else if (table === 'enquiries') rows = loadData<GenericRow[]>(STORAGE_KEYS.ENQUIRIES, defaultEnquiries);
          else if (table === 'analysis_reports') rows = loadData<GenericRow[]>(STORAGE_KEYS.ANALYSIS_REPORTS, defaultAnalysisReports);

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
            status: table === 'enquiries' ? 'new' : table === 'analysis_reports' ? 'available' : 'pending',
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
          } else if (table === 'analysis_reports') {
            const reports = loadData<GenericRow[]>(STORAGE_KEYS.ANALYSIS_REPORTS, defaultAnalysisReports);
            saveData(STORAGE_KEYS.ANALYSIS_REPORTS, [newRecord, ...reports]);
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
              else if (table === 'analysis_reports') storageKey = STORAGE_KEYS.ANALYSIS_REPORTS;

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
              else if (table === 'analysis_reports') storageKey = STORAGE_KEYS.ANALYSIS_REPORTS;

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



      const getCaller = (token?: string): AdminUserData | null => {
        if (!token) return null;

        const sessions = loadData<Record<string, AdminUserData>>(
          STORAGE_KEYS.ACTIVE_SESSIONS,
          {}
        );

        const sessionUser = sessions[token];
        if (!sessionUser) return null;

        // Toujours vérifier l'utilisateur actuel, pas seulement
        // les données potentiellement anciennes de la session.
        const currentUser = users.find(
          (user) => user.id === sessionUser.id
        );

        if (!currentUser || currentUser.active === false) {
          return null;
        }

        return currentUser;
      };



      switch (fnName) {
        case 'require_admin': {
          const caller = getCaller(args.p_token as string);
          if (!caller || caller.active === false || caller.role === 'user') {
            return { data: null, error: { message: 'Unauthorized', code: 'P0001' } };
          }
          return { data: { success: true, user: caller }, error: null };
        }

        case 'verify_admin_credentials': {
          const { p_username, p_password } = args as { p_username?: string; p_password?: string };
          const match = users.find(
            u => u.username === p_username && u.password === p_password && u.active !== false
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
          const caller = getCaller(args.p_token as string);

          // Reject invalid sessions and inactive accounts.
          if (!canManageAccounts(caller)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Invalid session or insufficient permissions',
              },
            };
          }

          let scoped: AdminUserData[] = [];

          if (caller.role === 'super_admin') {
            // Super admins can view all administrator accounts.
            scoped = users.filter(
              u =>
                ['super_admin', 'lab_admin', 'local_admin', 'admin'].includes(u.role)
            );
          } else if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: No laboratory is assigned to this account',
                },
              };
            }

            // Show only administrators assigned to the same laboratory
            // and valid branches.
            scoped = users.filter(
              u =>
                ['lab_admin', 'local_admin', 'admin'].includes(u.role) &&
                u.laboratory === caller.laboratory &&
                validBranchForLab(u.laboratory, u.branch)
            );
          } else if (caller.role === 'local_admin') {
            // Local admins manage ordinary users, not administrator accounts.
            return {
              data: null,
              error: {
                message: 'Unauthorized: Local administrators cannot access admin account management',
              },
            };
          } else {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Unsupported account role',
              },
            };
          }

          const safeUsers = scoped.map(u => ({
            id: u.id,
            username: u.username,
            full_name: u.full_name,
            role: u.role,
          }));

          return { data: safeUsers, error: null };
        }

        case 'login_user': {
          const { p_username, p_password } = args as { p_username?: string; p_password?: string };
          const match = users.find(
            u => u.username === p_username && u.password === p_password
          );
          if (!match) {
            return {
              data: { success: false, message: 'Invalid username or password' },
              error: null,
            };
          }
          if (match.active === false) {
            return {
              data: { success: false, message: 'Account is deactivated' },
              error: null,
            };
          }

          const token = `mock-token-${match.id}-${Date.now()}`;
          const sessions = loadData<Record<string, AdminUserData>>(STORAGE_KEYS.ACTIVE_SESSIONS, {});
          sessions[token] = match;
          saveData(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);

          return {
            data: {
              success: true,
              session_token: token,
              user: {
                id: match.id,
                username: match.username,
                full_name: match.full_name,
                role: match.role,
                laboratory: match.laboratory || null,
                branch: match.branch || null,
                branches: match.branches || (match.branch ? match.branch.split(',').map(b => b.trim()).filter(Boolean) : null),
                active: match.active !== false,
                is_primary: match.is_primary || match.username === 'admin',
              },
            },
            error: null,
          };
        }

        case 'validate_admin_session': {
          const caller = getCaller(args.p_token as string);
          if (!caller || caller.active === false) {
            return {
              data: { success: false, error: 'Invalid or expired session' },
              error: null,
            };
          }
          const callerBranches = caller.branches || (caller.branch ? caller.branch.split(',').map(b => b.trim()).filter(Boolean) : []);
          return {
            data: {
              success: true,
              user_id: caller.id,
              username: caller.username,
              full_name: caller.full_name,
              role: caller.role,
              laboratory: caller.laboratory || null,
              branch: caller.branch || null,
              branches: callerBranches,
            },
            error: null,
          };
        }

        case 'change_own_password': {
          const caller = getCaller(args.p_token as string);
          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session or inactive account' },
            };
          }

          const { p_old_password, p_new_password } = args as {
            p_old_password?: string | null;
            p_new_password?: string;
          };

          if (!p_new_password || p_new_password.trim().length < 6) {
            return {
              data: null,
              error: { message: 'Password must be at least 6 characters long' },
            };
          }

          if (p_old_password && caller.password && caller.password !== p_old_password) {
            return {
              data: null,
              error: { message: 'Current password is incorrect' },
            };
          }

          const updatedUsers = users.map((u) => {
            if (u.id === caller.id) {
              return { ...u, password: p_new_password };
            }
            return u;
          });

          saveData(STORAGE_KEYS.ADMIN_USERS, updatedUsers);

          const token = args.p_token as string;
          const sessions = loadData<Record<string, AdminUserData>>(STORAGE_KEYS.ACTIVE_SESSIONS, {});
          if (sessions[token]) {
            sessions[token] = { ...sessions[token], password: p_new_password };
            saveData(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
          }

          return {
            data: { success: true, message: 'Password updated successfully' },
            error: null,
          };
        }

        case 'logout_user': {
          const { p_token } = args as { p_token?: string };
          if (p_token) {
            const sessions = loadData<Record<string, AdminUserData>>(STORAGE_KEYS.ACTIVE_SESSIONS, {});
            delete sessions[p_token];
            saveData(STORAGE_KEYS.ACTIVE_SESSIONS, sessions);
          }
          return { data: { success: true }, error: null };
        }


        case 'list_users_scoped':
        case 'list_users': {
          const caller = getCaller(args.p_token as string);

          if (!canManageAccounts(caller)) {
            return {
              data: null,
              error: {
                message:
                  'Unauthorized: Invalid session or insufficient permissions',
              },
            };
          }

          let scoped: AdminUserData[] = [];

          if (caller.role === 'super_admin') {
            // Super admins can view all accounts.
            scoped = users;
          } else if (caller.role === 'lab_admin') {
            // Lab admins must have a laboratory assignment.
            if (!caller.laboratory) {
              return {
                data: null,
                error: {
                  message:
                    'Unauthorized: No laboratory is assigned to this account',
                },
              };
            }

            // Only accounts assigned to their own laboratory and valid branches.
            scoped = users.filter(
              (u) =>
                u.role !== 'super_admin' &&
                u.laboratory === caller.laboratory &&
                validBranchForLab(u.laboratory, u.branch)
            );
          } else if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: {
                  message:
                    'Unauthorized: No laboratory or branch is assigned to this account',
                },
              };
            }

            const callerBranches = [
              ...new Set(
                caller.branch
                  .split(',')
                  .map((b) => b.trim())
                  .filter(Boolean)
              ),
            ];

            // Reject invalid or unsupported branch assignments.
            if (
              callerBranches.length === 0 ||
              callerBranches.length > 2 ||
              !callerBranches.every((branch) =>
                validBranchForLab(caller.laboratory, branch)
              )
            ) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Invalid branch assignment',
                },
              };
            }

            // Local admins can view ordinary users in their assigned branches.
            scoped = users.filter((u) => {
              if (
                u.role !== 'user' ||
                u.laboratory !== caller.laboratory ||
                !u.branch
              ) {
                return false;
              }

              const userBranch = u.branch.trim();

              return (
                !userBranch.includes(',') &&
                callerBranches.includes(userBranch) &&
                validBranchForLab(u.laboratory, userBranch)
              );
            });
          } else {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Unsupported account role',
              },
            };
          }

          // Return safe account fields only; never expose passwords.
          const safeUsers = scoped.map((u) => ({
            id: u.id,
            username: u.username,
            full_name: u.full_name,
            role: u.role,
            laboratory: u.laboratory || null,
            branch: u.branch || null,
            active: u.active !== false,
            is_primary: u.is_primary || u.username === 'admin',
          }));

          return { data: safeUsers, error: null };
        }




        case 'create_user_with_details':
        case 'create_user':
        case 'create_admin_user': {
          const caller = getCaller(args.p_token as string);

          // Reject invalid sessions and inactive accounts.
          if (!canManageAccounts(caller)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Invalid session or insufficient permissions',
              },
            };
          }

          const { p_username, p_password, p_role } = args as {
            p_username: string;
            p_password?: string;
            p_role?: string;
          };

          const targetRole = p_role || 'user';

          // Enforce the role hierarchy for every account creation.
          if (!canAssignRole(caller.role, targetRole)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: You cannot create this account role',
              },
            };
          }

          if (!p_username || !p_username.trim()) {
            return {
              data: null,
              error: { message: 'Username is required' },
            };
          }

          const p_full_name =
            (args.p_full_name as string) ||
            (args.full_name as string) ||
            p_username;

          let p_laboratory =
            (args.p_laboratory as string) ||
            (args.laboratory as string) ||
            null;

          let p_branch =
            (args.p_branch as string) ||
            (args.branch as string) ||
            null;

          // Super admin accounts are global, not assigned to a lab.
          if (targetRole === 'super_admin') {
            p_laboratory = null;
            p_branch = null;
          }

          // Laboratory administrators can create local admins and users
          // only inside their assigned central laboratory and branches.
          if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: No laboratory is assigned to this account',
                },
              };
            }

            p_laboratory = caller.laboratory;

            if (!p_branch) {
              if (targetRole === 'local_admin') {
                return {
                  data: null,
                  error: {
                    message: 'A local administrator must be assigned to a branch',
                  },
                };
              }

              p_branch = null;
            }

            if (!validBranchForLab(p_laboratory, p_branch)) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Invalid branch for this laboratory',
                },
              };
            }
          }

          // Local administrators can create ordinary users in their authorized branch(es) only.
          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: No laboratory or branch is assigned to this account',
                },
              };
            }

            p_laboratory = caller.laboratory;
            const callerBranches = caller.branch
              .split(',')
              .map((b) => b.trim())
              .filter(Boolean);

            if (p_branch && !callerBranches.includes(p_branch)) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Local administrator cannot assign user outside assigned branches',
                },
              };
            }

            if (!p_branch) {
              p_branch = callerBranches[0] || caller.branch;
            }
          }

          // Validate the final laboratory/branch assignment.
          if (!validBranchForLab(p_laboratory, p_branch)) {
            return {
              data: null,
              error: {
                message: 'Invalid laboratory or branch assignment',
              },
            };
          }

          if (users.some(u => u.username === p_username)) {
            return {
              data: null,
              error: { message: 'duplicate username' },
            };
          }

          const newUser: AdminUserData = {
            id: `usr-${Date.now()}`,
            username: p_username,
            password: p_password,
            full_name: p_full_name,
            role: targetRole,
            laboratory: p_laboratory,
            branch: p_branch,
            active: true,
            is_primary: false,
          };

          saveData(STORAGE_KEYS.ADMIN_USERS, [...users, newUser]);

          return {
            data: { success: true, user: newUser },
            error: null,
          };
        }



        case 'update_user_secure':
        case 'update_user':
        case 'update_admin_user': {
          const caller = getCaller(args.p_token as string);

          if (!canManageAccounts(caller)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Invalid session or insufficient permissions',
              },
            };
          }

          const {
            p_id,
            p_password,
            p_role,
            p_active,
          } = args as {
            p_id: string;
            p_password?: string | null;
            p_role?: string;
            p_active?: boolean;
          };

          const target = users.find((u) => u.id === p_id);

          if (!target) {
            return {
              data: null,
              error: { message: 'User not found' },
            };
          }

          const p_full_name =
            (args.p_full_name as string | undefined) ??
            (args.full_name as string | undefined);

          let p_laboratory =
            (args.p_laboratory as string | null | undefined) ??
            (args.laboratory as string | null | undefined);

          let p_branch =
            (args.p_branch as string | null | undefined) ??
            (args.branch as string | null | undefined);

          // Prevent administrators from changing their own account.
          if (caller.id === target.id) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: You cannot modify your own account here',
              },
            };
          }

          // Determine the role after the requested update.
          const effectiveRole = p_role ?? target.role;

          if (!canAssignRole(caller.role, effectiveRole)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: You cannot assign this role',
              },
            };
          }

          // Only the super administrator can manage all laboratories.
          if (caller.role === 'super_admin') {
            if (effectiveRole === 'super_admin') {
              p_laboratory = null;
              p_branch = null;
            }
          }

          // Laboratory administrators are restricted to their own central lab
          // and its authorized branches.
          if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: No laboratory is assigned to this account',
                },
              };
            }

            if (
              !['local_admin', 'user'].includes(target.role) ||
              target.laboratory !== caller.laboratory
            ) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Cannot edit this account',
                },
              };
            }

            p_laboratory = caller.laboratory;

            if (p_branch === undefined) {
              p_branch = target.branch ?? null;
            }

            if (!validBranchForLab(p_laboratory, p_branch)) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Invalid branch for this laboratory',
                },
              };
            }

            if (effectiveRole === 'local_admin' && !p_branch) {
              return {
                data: null,
                error: {
                  message: 'A local administrator must be assigned to a branch',
                },
              };
            }
          }

          // Local administrators can manage ordinary users in their authorized branch(es) only.
          if (caller.role === 'local_admin') {
            const callerBranches = (caller.branch || '')
              .split(',')
              .map((b) => b.trim())
              .filter(Boolean);

            if (
              !caller.laboratory ||
              callerBranches.length === 0 ||
              target.role !== 'user' ||
              target.laboratory !== caller.laboratory ||
              !callerBranches.includes(target.branch || '')
            ) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Cannot edit users outside your assigned branch',
                },
              };
            }

            p_laboratory = caller.laboratory;
            if (p_branch && !callerBranches.includes(p_branch)) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Cannot assign user to branch outside your authorization',
                },
              };
            }
            if (!p_branch) {
              p_branch = target.branch;
            }
          }

          if (!validBranchForLab(p_laboratory, p_branch)) {
            return {
              data: null,
              error: {
                message: 'Invalid laboratory or branch assignment',
              },
            };
          }

          const updated = users.map((u) => {
            if (u.id !== p_id) {
              return u;
            }

            return {
              ...u,
              ...(p_password ? { password: p_password } : {}),
              ...(p_full_name !== undefined
                ? { full_name: p_full_name }
                : {}),
              ...(p_role !== undefined ? { role: p_role } : {}),
              ...(p_laboratory !== undefined
                ? { laboratory: p_laboratory }
                : {}),
              ...(p_branch !== undefined ? { branch: p_branch } : {}),
              ...(p_active !== undefined ? { active: p_active } : {}),
            };
          });

          saveData(STORAGE_KEYS.ADMIN_USERS, updated);

          return {
            data: { success: true },
            error: null,
          };
        }



        case 'delete_user_secure':
        case 'delete_admin_user':
        case 'delete_user': {
          const caller = getCaller(args.p_token as string);

          // 1. Require a valid, active administrator session.
          if (!canManageAccounts(caller)) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Invalid session or insufficient permissions',
              },
            };
          }

          const { p_id } = args as { p_id: string };

          if (!p_id) {
            return {
              data: null,
              error: { message: 'User ID is required' },
            };
          }

          const target = users.find(u => u.id === p_id);

          if (!target) {
            return {
              data: null,
              error: { message: 'User not found' },
            };
          }

          // 2. Protect the primary administrator.
          if (target.is_primary || target.username === 'admin') {
            return {
              data: null,
              error: {
                message: 'Cannot delete primary super administrator account',
              },
            };
          }

          // 3. Prevent self-deletion.
          if (caller.id === target.id) {
            return {
              data: null,
              error: {
                message: 'Unauthorized: You cannot delete your own account',
              },
            };
          }

          // 4. Enforce role hierarchy and scope.
          if (caller.role === 'super_admin') {
            // Super admin can delete other accounts,
            // except the protected primary account above.
          } else if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: No laboratory is assigned to this account',
                },
              };
            }

            // Lab admins can delete local admins and users only
            // within their own central laboratory.
            if (!['local_admin', 'user'].includes(target.role)) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Cannot delete this account role',
                },
              };
            }

            if (
              !target.laboratory ||
              target.laboratory !== caller.laboratory ||
              !validBranchForLab(target.laboratory, target.branch)
            ) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Account is outside your laboratory scope',
                },
              };
            }

            if (target.role === 'local_admin' && !target.branch) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Local administrator has no valid branch assignment',
                },
              };
            }
          } else if (caller.role === 'local_admin') {
            const callerBranches = (caller.branch || '')
              .split(',')
              .map((b) => b.trim())
              .filter(Boolean);

            if (
              !caller.laboratory ||
              callerBranches.length === 0 ||
              target.role !== 'user' ||
              target.laboratory !== caller.laboratory ||
              !callerBranches.includes(target.branch || '')
            ) {
              return {
                data: null,
                error: {
                  message: 'Unauthorized: Can only delete users in your assigned branch',
                },
              };
            }
          } else {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Unsupported account role',
              },
            };
          }

          // 5. Delete only after all checks pass.
          const filtered = users.filter(u => u.id !== p_id);
          saveData(STORAGE_KEYS.ADMIN_USERS, filtered);

          return {
            data: { success: true },
            error: null,
          };
        }



        case 'get_admin_surveys':
        case 'admin_list_surveys': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          const surveys = loadData<SurveyDataRecord[]>(
            STORAGE_KEYS.SURVEYS,
            defaultSurveys
          );

          if (caller.role === 'super_admin') {
            return { data: surveys, error: null };
          }

          if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory assigned' },
              };
            }
            const scoped = surveys.filter(
              survey => survey.laboratory === caller.laboratory
            );
            return { data: scoped, error: null };
          }

          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            const scoped = surveys.filter(
              survey =>
                survey.laboratory === caller.laboratory &&
                checkBranchScope(callerBranches, survey.branch)
            );
            return { data: scoped, error: null };
          }

          if (caller.role === 'user') {
            const callerBranches = (caller.branch || '').split(',').map(b => b.trim()).filter(Boolean);
            const scoped = surveys.filter(survey => {
              if (caller.laboratory && survey.laboratory !== caller.laboratory) return false;
              if (callerBranches.length > 0 && !checkBranchScope(callerBranches, survey.branch)) return false;
              return true;
            });
            return { data: scoped, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Insufficient permissions to view surveys' },
          };
        }

        case 'admin_list_enquiries': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          const enquiries = loadData<EnquiryDataRecord[]>(
            STORAGE_KEYS.ENQUIRIES,
            defaultEnquiries
          );

          if (caller.role === 'super_admin') {
            return { data: enquiries, error: null };
          }

          if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory assigned' },
              };
            }
            const scoped = enquiries.filter(
              enquiry => enquiry.laboratory === caller.laboratory
            );
            return { data: scoped, error: null };
          }

          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            const scoped = enquiries.filter(
              enquiry =>
                enquiry.laboratory === caller.laboratory &&
                checkBranchScope(callerBranches, enquiry.branch)
            );
            return { data: scoped, error: null };
          }

          if (caller.role === 'user') {
            const callerBranches = (caller.branch || '').split(',').map(b => b.trim()).filter(Boolean);
            const scoped = enquiries.filter(enquiry => {
              if (caller.laboratory && enquiry.laboratory !== caller.laboratory) return false;
              if (callerBranches.length > 0 && !checkBranchScope(callerBranches, enquiry.branch)) return false;
              return true;
            });
            return { data: scoped, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Insufficient permissions to view enquiries' },
          };
        }

        case 'admin_delete_visitor': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          if (caller.role === 'user') {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Standard users have read-only access and cannot delete visitors',
              },
            };
          }

          const { p_id } = args as { p_id: string };

          if (!p_id) {
            return {
              data: null,
              error: { message: 'Missing visitor ID' },
            };
          }

          const visitors = loadData<VisitorDataRecord[]>(
            STORAGE_KEYS.VISITORS,
            defaultVisitors
          );

          const target = visitors.find(visitor => visitor.id === p_id);

          if (!target) {
            return {
              data: null,
              error: { message: 'Visitor record not found' },
            };
          }

          if (caller.role === 'super_admin') {
            const filtered = visitors.filter(visitor => visitor.id !== p_id);
            saveData(STORAGE_KEYS.VISITORS, filtered);
            return { data: { success: true }, error: null };
          }

          if (caller.role === 'lab_admin') {
            if (!caller.laboratory || target.laboratory !== caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: Visitor record is outside your laboratory scope' },
              };
            }
            const filtered = visitors.filter(visitor => visitor.id !== p_id);
            saveData(STORAGE_KEYS.VISITORS, filtered);
            return { data: { success: true }, error: null };
          }

          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            if (
              target.laboratory !== caller.laboratory ||
              !checkBranchScope(callerBranches, target.branch)
            ) {
              return {
                data: null,
                error: { message: 'Unauthorized: Visitor record is outside your authorized branches' },
              };
            }
            const filtered = visitors.filter(visitor => visitor.id !== p_id);
            saveData(STORAGE_KEYS.VISITORS, filtered);
            return { data: { success: true }, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Unsupported account role' },
          };
        }

        case 'admin_delete_survey': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          if (caller.role === 'user') {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Standard users have read-only access and cannot delete surveys',
              },
            };
          }

          const { p_id } = args as { p_id: string };

          if (!p_id) {
            return {
              data: null,
              error: { message: 'Missing survey ID' },
            };
          }

          const surveys = loadData<SurveyDataRecord[]>(
            STORAGE_KEYS.SURVEYS,
            defaultSurveys
          );

          const target = surveys.find(survey => survey.id === p_id);

          if (!target) {
            return {
              data: null,
              error: { message: 'Survey not found' },
            };
          }

          if (caller.role === 'super_admin') {
            const filtered = surveys.filter(survey => survey.id !== p_id);
            saveData(STORAGE_KEYS.SURVEYS, filtered);
            return { data: { success: true }, error: null };
          }

          if (caller.role === 'lab_admin') {
            if (!caller.laboratory || target.laboratory !== caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: Survey is outside your laboratory scope' },
              };
            }
            const filtered = surveys.filter(survey => survey.id !== p_id);
            saveData(STORAGE_KEYS.SURVEYS, filtered);
            return { data: { success: true }, error: null };
          }

          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            if (
              target.laboratory !== caller.laboratory ||
              !checkBranchScope(callerBranches, target.branch)
            ) {
              return {
                data: null,
                error: { message: 'Unauthorized: Survey is outside your authorized branches' },
              };
            }
            const filtered = surveys.filter(survey => survey.id !== p_id);
            saveData(STORAGE_KEYS.SURVEYS, filtered);
            return { data: { success: true }, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Insufficient permissions to delete surveys' },
          };
        }

        case 'admin_delete_enquiry': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          if (caller.role === 'user') {
            return {
              data: null,
              error: {
                message: 'Unauthorized: Standard users have read-only access and cannot delete enquiries',
              },
            };
          }

          const { p_id } = args as { p_id: string };

          if (!p_id) {
            return {
              data: null,
              error: { message: 'Missing enquiry ID' },
            };
          }

          const enquiries = loadData<EnquiryDataRecord[]>(
            STORAGE_KEYS.ENQUIRIES,
            defaultEnquiries
          );

          const target = enquiries.find(enquiry => enquiry.id === p_id);

          if (!target) {
            return {
              data: null,
              error: { message: 'Enquiry not found' },
            };
          }

          // Super Admin: global access.
          if (caller.role === 'super_admin') {
            const filtered = enquiries.filter(enquiry => enquiry.id !== p_id);
            saveData(STORAGE_KEYS.ENQUIRIES, filtered);
            return { data: { success: true }, error: null };
          }

          // Lab Admin: must match laboratory.
          if (caller.role === 'lab_admin') {
            if (!caller.laboratory || target.laboratory !== caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: Enquiry is outside your laboratory scope' },
              };
            }
            const filtered = enquiries.filter(enquiry => enquiry.id !== p_id);
            saveData(STORAGE_KEYS.ENQUIRIES, filtered);
            return { data: { success: true }, error: null };
          }

          // Local Admin: must match laboratory and authorized branches (supports 1 or 2 branches).
          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            if (
              target.laboratory !== caller.laboratory ||
              !checkBranchScope(callerBranches, target.branch)
            ) {
              return {
                data: null,
                error: { message: 'Unauthorized: Enquiry is outside your authorized branches' },
              };
            }
            const filtered = enquiries.filter(enquiry => enquiry.id !== p_id);
            saveData(STORAGE_KEYS.ENQUIRIES, filtered);
            return { data: { success: true }, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Insufficient permissions to delete enquiries' },
          };
        }

        case 'admin_list_analysis_reports': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          const reports = loadData<AnalysisReportRecord[]>(
            STORAGE_KEYS.ANALYSIS_REPORTS,
            defaultAnalysisReports
          ).filter(r => !r.deleted_at && r.status !== 'archived');

          if (caller.role === 'super_admin') {
            return { data: reports, error: null };
          }

          if (caller.role === 'lab_admin') {
            if (!caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory assigned' },
              };
            }
            const scoped = reports.filter(r => r.laboratory === caller.laboratory);
            return { data: scoped, error: null };
          }

          if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            const scoped = reports.filter(
              r =>
                r.laboratory === caller.laboratory &&
                checkBranchScope(callerBranches, r.branch)
            );
            return { data: scoped, error: null };
          }

          if (caller.role === 'user') {
            const callerBranches = (caller.branch || '').split(',').map(b => b.trim()).filter(Boolean);
            const scoped = reports.filter(r => {
              if (caller.laboratory && r.laboratory !== caller.laboratory) return false;
              if (callerBranches.length > 0 && !checkBranchScope(callerBranches, r.branch)) return false;
              return true;
            });
            return { data: scoped, error: null };
          }

          return {
            data: null,
            error: { message: 'Unauthorized: Insufficient permissions' },
          };
        }

        case 'admin_upload_analysis_report': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          if (caller.role === 'user') {
            return {
              data: null,
              error: { message: 'Unauthorized: Standard users have read-only access and cannot upload reports' },
            };
          }

          const payload = (args.p_report || args) as Partial<AnalysisReportRecord>;

          if (!payload.report_number || !payload.visitor_id || !payload.file_name) {
            return {
              data: null,
              error: { message: 'Missing required report fields (report_number, visitor_id, file_name)' },
            };
          }

          // Validate scope
          if (caller.role === 'lab_admin') {
            if (!caller.laboratory || payload.laboratory !== caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: Cannot upload report outside your central laboratory' },
              };
            }
          } else if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            if (
              payload.laboratory !== caller.laboratory ||
              !checkBranchScope(callerBranches, payload.branch)
            ) {
              return {
                data: null,
                error: { message: 'Unauthorized: Cannot upload report outside your authorized branches' },
              };
            }
          }

          const reports = loadData<AnalysisReportRecord[]>(
            STORAGE_KEYS.ANALYSIS_REPORTS,
            defaultAnalysisReports
          );

          const newReport: AnalysisReportRecord = {
            id: `rep-${Date.now()}`,
            report_number: payload.report_number,
            visitor_id: payload.visitor_id,
            visitor_name: payload.visitor_name || 'زائر مختبر',
            sample_code: payload.sample_code || `SMP-${Date.now().toString().slice(-4)}`,
            sample_type: payload.sample_type || 'تحليل مياه معتمد',
            sample_type_ar: payload.sample_type_ar || payload.sample_type || 'تحليل مياه معتمد',
            sample_type_en: payload.sample_type_en || 'Certified Water Analysis',
            sample_type_fr: payload.sample_type_fr || 'Analyse d’eau certifiée',
            laboratory: payload.laboratory || caller.laboratory || 'asir',
            branch: payload.branch || (caller.role === 'local_admin' ? caller.branch : null),
            file_name: payload.file_name,
            file_path: payload.file_path || `analysis-reports/${payload.file_name}`,
            file_type: payload.file_type || 'application/pdf',
            file_size: payload.file_size || 1024 * 100,
            file_data_url: payload.file_data_url,
            status: 'available',
            notes: payload.notes || null,
            uploaded_by: caller.id,
            uploaded_by_name: caller.full_name,
            issue_date: payload.issue_date || new Date().toISOString().slice(0, 10),
            created_at: new Date().toISOString(),
          };

          saveData(STORAGE_KEYS.ANALYSIS_REPORTS, [newReport, ...reports]);

          return { data: { success: true, report: newReport }, error: null };
        }

        case 'admin_delete_analysis_report': {
          const caller = getCaller(args.p_token as string);

          if (!caller || caller.active === false) {
            return {
              data: null,
              error: { message: 'Unauthorized: Invalid session' },
            };
          }

          if (caller.role === 'user') {
            return {
              data: null,
              error: { message: 'Unauthorized: Standard users have read-only access and cannot delete reports' },
            };
          }

          const { p_id } = args as { p_id: string };

          if (!p_id) {
            return {
              data: null,
              error: { message: 'Missing report ID' },
            };
          }

          const reports = loadData<AnalysisReportRecord[]>(
            STORAGE_KEYS.ANALYSIS_REPORTS,
            defaultAnalysisReports
          );

          const target = reports.find(r => r.id === p_id);

          if (!target || target.deleted_at || target.status === 'archived') {
            return {
              data: null,
              error: { message: 'Report not found or already deleted' },
            };
          }

          // Verify scope
          if (caller.role === 'lab_admin') {
            if (!caller.laboratory || target.laboratory !== caller.laboratory) {
              return {
                data: null,
                error: { message: 'Unauthorized: Report is outside your laboratory scope' },
              };
            }
          } else if (caller.role === 'local_admin') {
            if (!caller.laboratory || !caller.branch) {
              return {
                data: null,
                error: { message: 'Unauthorized: No laboratory or branch assigned' },
              };
            }
            const callerBranches = caller.branch.split(',').map(b => b.trim()).filter(Boolean);
            if (
              target.laboratory !== caller.laboratory ||
              !checkBranchScope(callerBranches, target.branch)
            ) {
              return {
                data: null,
                error: { message: 'Unauthorized: Report is outside your authorized branches' },
              };
            }
          }

          // Soft delete: keep record for audit / safe recovery
          const updated = reports.map(r =>
            r.id === p_id
              ? { ...r, deleted_at: new Date().toISOString(), status: 'archived' as const }
              : r
          );
          saveData(STORAGE_KEYS.ANALYSIS_REPORTS, updated);

          return { data: { success: true }, error: null };
        }

        case 'get_visitor_analysis_reports': {
          const { p_visitor_id, p_phone, p_national_id } = args as {
            p_visitor_id?: string;
            p_phone?: string;
            p_national_id?: string;
          };

          const reports = loadData<AnalysisReportRecord[]>(
            STORAGE_KEYS.ANALYSIS_REPORTS,
            defaultAnalysisReports
          ).filter(r => !r.deleted_at && r.status === 'available');

          const visitors = loadData<VisitorDataRecord[]>(
            STORAGE_KEYS.VISITORS,
            defaultVisitors
          );

          // Find matches
          const matched = reports.filter(r => {
            if (p_visitor_id && (r.visitor_id === p_visitor_id || r.id === p_visitor_id)) {
              return true;
            }
            const linkedVisitor = visitors.find(v => v.id === r.visitor_id || v.visitor_id === r.visitor_id);
            if (linkedVisitor) {
              if (p_phone && linkedVisitor.phone === p_phone) return true;
              if (p_national_id && linkedVisitor.national_id === p_national_id) return true;
              if (p_visitor_id && (linkedVisitor.id === p_visitor_id || linkedVisitor.visitor_id === p_visitor_id)) return true;
            }
            return false;
          });

          return { data: matched, error: null };
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
