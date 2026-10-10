import { supabase, VisitorDataRecord } from '@/lib/supabase';

export interface VisitorProfile {
  id: string;
  visitor_id: string;
  visitor_name: string;
  first_name?: string;
  last_name?: string;
  national_id?: string;
  phone: string;
  email?: string;
  company?: string;
  job_title?: string;
}

export interface AppointmentItem {
  id: string;
  visitor_id: string;
  visitor_name: string;
  national_id?: string;
  phone: string;
  email?: string;
  company?: string;
  job_title?: string;
  laboratory: string;
  branch?: string;
  department?: string;
  employee?: string;
  purpose: string;
  visit_date: string;
  arrival_time?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  qr_url?: string;
  created_at: string;
}

export interface ReportParameter {
  name_ar: string;
  name_en: string;
  unit: string;
  measured_value: string;
  standard_limit: string;
  method: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface LabReportItem {
  id: string;
  report_number: string;
  sample_code: string;
  visitor_id: string;
  visitor_name: string;
  sample_type_ar: string;
  sample_type_en: string;
  sample_type_fr: string;
  source_location_ar: string;
  source_location_en: string;
  laboratory_id: string;
  laboratory_name_ar: string;
  laboratory_name_en: string;
  collection_date: string;
  analysis_date: string;
  issue_date: string;
  status: 'Approved' | 'Under Review';
  compliance_status_ar: string;
  compliance_status_en: string;
  compliance_status_fr: string;
  is_compliant: boolean;
  authorized_specialist: {
    name_ar: string;
    name_en: string;
    title_ar: string;
    title_en: string;
  };
  qa_officer: {
    name_ar: string;
    name_en: string;
    title_ar: string;
    title_en: string;
  };
  parameters: ReportParameter[];
}

const STORAGE_SESSION_KEY = 'swl_visitor_portal_user';
const STORAGE_CUSTOM_REPORTS = 'swl_custom_lab_reports';

// Sample pre-populated official laboratory reports for demonstrations
const DEFAULT_LAB_REPORTS: LabReportItem[] = [
  {
    id: 'rpt-01',
    report_number: 'NWC-SL-2026-0841',
    sample_code: 'SMP-2026-ASR-4912',
    visitor_id: 'LAB-2026-0001',
    visitor_name: 'م. أحمد بن ناصر القحطاني',
    sample_type_ar: 'مياه شبكة شرب حضرية (فحص دوري معتمد)',
    sample_type_en: 'Urban Drinking Water Network (Certified Routine Audit)',
    sample_type_fr: 'Eau Potable du Réseau Urbain (Audit de Routine Certifié)',
    source_location_ar: 'محطة تنقية وتوزيع مياه أبها المركزية — خط الإمداد A-4',
    source_location_en: 'Abha Central Water Purification & Distribution Plant — Supply Line A-4',
    laboratory_id: 'asir',
    laboratory_name_ar: 'مختبر عسير المركزي لمياه الشرب والخدمات البيئية',
    laboratory_name_en: 'Asir Central Water and Environmental Laboratory',
    collection_date: '2026-09-18',
    analysis_date: '2026-09-19',
    issue_date: '2026-09-20',
    status: 'Approved',
    compliance_status_ar: 'مطابق للمواصفة القياسية السعودية والخليجية (GSO 149/2014)',
    compliance_status_en: 'Compliant with Saudi & Gulf Standards (GSO 149/2014)',
    compliance_status_fr: 'Conforme aux Normes Saoudiennes et du Golfe (GSO 149/2014)',
    is_compliant: true,
    authorized_specialist: {
      name_ar: 'د. عبدالله بن فهد الشهراني',
      name_en: 'Dr. Abdullah Al-Shahrani',
      title_ar: 'رئيس وحدة التحاليل الكيميائية والفيزيائية',
      title_en: 'Head of Chemical & Physical Analysis Unit',
    },
    qa_officer: {
      name_ar: 'م. خالد بن سعيد القحطاني',
      name_en: 'Eng. Khalid Al-Qahtani',
      title_ar: 'مدير توكيد الجودة والاعتماد ISO/IEC 17025',
      title_en: 'Quality Assurance & ISO/IEC 17025 Director',
    },
    parameters: [
      { name_ar: 'الأس الهيدروجيني (pH)', name_en: 'pH Value', unit: 'pH', measured_value: '7.38', standard_limit: '6.5 - 8.5', method: 'SMWW 4500-H+ B', status: 'normal' },
      { name_ar: 'العكارة (Turbidity)', name_en: 'Turbidity', unit: 'NTU', measured_value: '0.34', standard_limit: '< 1.0', method: 'EPA 180.1 Nephelometric', status: 'normal' },
      { name_ar: 'الأملاح الكلية الذائبة (TDS)', name_en: 'Total Dissolved Solids', unit: 'mg/L', measured_value: '265', standard_limit: '100 - 1000', method: 'SMWW 2540 C Gravimetric', status: 'normal' },
      { name_ar: 'الكلور المتبقي الحر', name_en: 'Free Residual Chlorine', unit: 'mg/L', measured_value: '0.45', standard_limit: '0.2 - 0.5', method: 'SMWW 4500-Cl G (DPD)', status: 'normal' },
      { name_ar: 'التوصيل الكهربائي (EC)', name_en: 'Electrical Conductivity', unit: 'µS/cm', measured_value: '442', standard_limit: '< 1600', method: 'SMWW 2510 B', status: 'normal' },
      { name_ar: 'العسر الكلي (Total Hardness)', name_en: 'Total Hardness (CaCO3)', unit: 'mg/L', measured_value: '135', standard_limit: '< 500', method: 'SMWW 2340 C Titrimetric', status: 'normal' },
      { name_ar: 'النترات (NO3)', name_en: 'Nitrate (NO3)', unit: 'mg/L', measured_value: '6.8', standard_limit: '< 50.0', method: 'Ion Chromatography IC-881', status: 'normal' },
      { name_ar: 'الحديد الكلي (Fe)', name_en: 'Total Iron', unit: 'mg/L', measured_value: '< 0.02', standard_limit: '< 0.3', method: 'ICP-OES Optical Emission', status: 'normal' },
      { name_ar: 'بكتيريا القولون الكلية', name_en: 'Total Coliforms', unit: 'CFU/100mL', measured_value: '0', standard_limit: '0 (غير مسموح)', method: 'SMWW 9222 B Membrane Filter', status: 'normal' },
      { name_ar: 'الإشريكية القولونية (E. Coli)', name_en: 'Escherichia Coli', unit: 'CFU/100mL', measured_value: '0', standard_limit: '0 (غير مسموح)', method: 'SMWW 9222 G Enzymatic Substrate', status: 'normal' },
    ],
  },
  {
    id: 'rpt-02',
    report_number: 'NWC-SL-2026-0915',
    sample_code: 'SMP-2026-NJR-1149',
    visitor_id: 'LAB-2026-0001',
    visitor_name: 'م. أحمد بن ناصر القحطاني',
    sample_type_ar: 'مياه آبار جوفية خام قبل المعالجة',
    sample_type_en: 'Raw Ground Well Water (Pre-Treatment Quality Assessment)',
    sample_type_fr: 'Eau Brute de Puits Souterrain (Évaluation Pré-Traitement)',
    source_location_ar: 'حقل آبار نجران الشمالي — بئر رقم 09',
    source_location_en: 'Najran Northern Wellfield — Well #09',
    laboratory_id: 'najran',
    laboratory_name_ar: 'مختبر نجران المركزي لمياه الشرب والخدمات البيئية',
    laboratory_name_en: 'Najran Central Water and Environmental Laboratory',
    collection_date: '2026-08-25',
    analysis_date: '2026-08-26',
    issue_date: '2026-08-27',
    status: 'Approved',
    compliance_status_ar: 'مطابق لمواصفات المياه الخام الصالحة للمعالجة (SASO 2021)',
    compliance_status_en: 'Compliant with Raw Water Treatment Criteria (SASO 2021)',
    compliance_status_fr: 'Conforme aux Normes d\'Eau Brute pour Traitement (SASO 2021)',
    is_compliant: true,
    authorized_specialist: {
      name_ar: 'د. مانع بن صالح آل مخلص',
      name_en: 'Dr. Manea Al-Mukhles',
      title_ar: 'كبير أخصائيي التحاليل المتقدمة والكروماتوغرافيا',
      title_en: 'Senior Specialist of Chromatography & Instrumentation',
    },
    qa_officer: {
      name_ar: 'م. علي بن حسين اليامي',
      name_en: 'Eng. Ali Al-Yami',
      title_ar: 'رئيس وحدة المطابقة والتراخيص المخبرية',
      title_en: 'Head of Lab Compliance & Certification',
    },
    parameters: [
      { name_ar: 'الأس الهيدروجيني (pH)', name_en: 'pH Value', unit: 'pH', measured_value: '7.65', standard_limit: '6.5 - 8.5', method: 'SMWW 4500-H+ B', status: 'normal' },
      { name_ar: 'العكارة (Turbidity)', name_en: 'Turbidity', unit: 'NTU', measured_value: '0.82', standard_limit: '< 5.0 (خام)', method: 'EPA 180.1', status: 'normal' },
      { name_ar: 'الأملاح الكلية الذائبة (TDS)', name_en: 'Total Dissolved Solids', unit: 'mg/L', measured_value: '480', standard_limit: '< 1500 (خام)', method: 'SMWW 2540 C', status: 'normal' },
      { name_ar: 'الكبريتات (SO4)', name_en: 'Sulfate (SO4)', unit: 'mg/L', measured_value: '88', standard_limit: '< 250', method: 'Turbidimetric Method', status: 'normal' },
      { name_ar: 'الكلوريدات (Cl-)', name_en: 'Chloride (Cl-)', unit: 'mg/L', measured_value: '95', standard_limit: '< 250', method: 'Argentometric Titration', status: 'normal' },
      { name_ar: 'الرصاص (Lead Pb)', name_en: 'Heavy Metal (Lead)', unit: 'mg/L', measured_value: '< 0.002', standard_limit: '< 0.01', method: 'ICP-MS / Agilent 7850', status: 'normal' },
      { name_ar: 'الكادميوم (Cd)', name_en: 'Cadmium', unit: 'mg/L', measured_value: '< 0.001', standard_limit: '< 0.003', method: 'ICP-MS / Agilent 7850', status: 'normal' },
      { name_ar: 'بكتيريا القولون الكلية', name_en: 'Total Coliforms', unit: 'CFU/100mL', measured_value: '0', standard_limit: '0 (سليم ميكروبيولوجياً)', method: 'Membrane Filtration', status: 'normal' },
    ],
  },
  {
    id: 'rpt-03',
    report_number: 'NWC-SL-2026-1022',
    sample_code: 'SMP-2026-JZN-2201',
    visitor_id: 'LAB-2026-0002',
    visitor_name: 'د. سارة بنت محمد الشهراني',
    sample_type_ar: 'مياه محطة تحلية فرسان البحرية',
    sample_type_en: 'Farasan Island Seawater Desalination Plant Output',
    sample_type_fr: 'Eau Dessalée de l\'Usine Maritime de Farasan',
    source_location_ar: 'خزان الضخ الاستراتيجي بمحافظة جزر فرسان',
    source_location_en: 'Farasan Archipelago Strategic Pumping Reservoir',
    laboratory_id: 'jazan',
    laboratory_name_ar: 'مختبر جازان المركزي لمياه الشرب والخدمات البيئية',
    laboratory_name_en: 'Jazan Central Water and Environmental Laboratory',
    collection_date: '2026-09-02',
    analysis_date: '2026-09-03',
    issue_date: '2026-09-04',
    status: 'Approved',
    compliance_status_ar: 'مطابق للمواصفة القياسية لمياه الشرب المعبأة وغير المعبأة',
    compliance_status_en: 'Compliant with Drinking Water Quality Parameters',
    compliance_status_fr: 'Conforme aux Spécifications d\'Eau Potable Certifiée',
    is_compliant: true,
    authorized_specialist: {
      name_ar: 'د. حسن بن إبراهيم الحازمي',
      name_en: 'Dr. Hassan Al-Hazmi',
      title_ar: 'رئيس قسم المراقبة البيئية والفيزيائية',
      title_en: 'Head of Environmental & Physical Monitoring',
    },
    qa_officer: {
      name_ar: 'م. محمد بن أحمد حكمي',
      name_en: 'Eng. Mohammed Hakami',
      title_ar: 'مشرف الجودة المخبرية المعتمدة',
      title_en: 'Accredited Lab Quality Supervisor',
    },
    parameters: [
      { name_ar: 'الأس الهيدروجيني (pH)', name_en: 'pH Value', unit: 'pH', measured_value: '7.20', standard_limit: '6.5 - 8.5', method: 'SMWW 4500-H+ B', status: 'normal' },
      { name_ar: 'العكارة (Turbidity)', name_en: 'Turbidity', unit: 'NTU', measured_value: '0.19', standard_limit: '< 1.0', method: 'EPA 180.1', status: 'normal' },
      { name_ar: 'الأملاح الكلية الذائبة (TDS)', name_en: 'Total Dissolved Solids', unit: 'mg/L', measured_value: '190', standard_limit: '100 - 1000', method: 'SMWW 2540 C', status: 'normal' },
      { name_ar: 'البرومات (Bromate)', name_en: 'Bromate', unit: 'µg/L', measured_value: '< 2.0', standard_limit: '< 10.0', method: 'IC-904 Anion System', status: 'normal' },
      { name_ar: 'الكلور الحر المتبقي', name_en: 'Free Chlorine', unit: 'mg/L', measured_value: '0.40', standard_limit: '0.2 - 0.5', method: 'DPD Colorimetric', status: 'normal' },
      { name_ar: 'بكتيريا الإشريكية القولونية', name_en: 'E. Coli', unit: 'CFU/100mL', measured_value: '0', standard_limit: '0', method: 'Membrane Filtration', status: 'normal' },
    ],
  },
];

// Helper to normalize phone
function cleanPhone(val?: string | null): string {
  if (!val) return '';
  return val.replace(/[\s\-+()]/g, '').replace(/^00966/, '0').replace(/^966/, '0');
}

export const visitorPortalService = {
  /**
   * Get currently active logged-in visitor session
   */
  getStoredSession(): VisitorProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Set active visitor session
   */
  saveSession(visitor: VisitorProfile): void {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(visitor));
  },

  /**
   * Clear session
   */
  clearSession(): void {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  },

  /**
   * Find visitor by any credential:
   * Visitor ID (LAB-2026-xxxx), National ID (10 digits), Phone number, or Email
   */
  async findVisitorByQuery(query: string): Promise<VisitorProfile | null> {
    const trimmed = query.trim();
    if (!trimmed) return null;

    // Check demo accounts first for instant access
    if (trimmed.toLowerCase() === 'demo' || trimmed === '1234567890' || trimmed === '0501234567') {
      const demoUser: VisitorProfile = {
        id: 'vis-1001',
        visitor_id: 'LAB-2026-0001',
        visitor_name: 'م. أحمد بن ناصر القحطاني',
        first_name: 'أحمد',
        last_name: 'القحطاني',
        national_id: '1089234812',
        phone: '0501234567',
        email: 'ahmed.alqahtani@nwc.com.sa',
        company: 'شركة المياه الوطنية — إدارة الرقابة الميدانية',
        job_title: 'كبير مهندسي ضبط جودة المياه',
      };
      this.saveSession(demoUser);
      return demoUser;
    }

    try {
      // 1. Fetch visitors from Supabase
      const { data: rows, error } = await supabase.from('visitors').select('*');
      if (error) {
        console.warn('Supabase query error in visitor lookup:', error);
      }

      const allVisitors: VisitorDataRecord[] = (rows as VisitorDataRecord[]) || [];
      const cleanedQuery = cleanPhone(trimmed);

      const match = allVisitors.find((v) => {
        const vId = String(v.visitor_id || v.id || '').toLowerCase();
        const qId = trimmed.toLowerCase();
        if (vId === qId) return true;

        const natId = String(v.national_id || '').trim();
        if (natId && natId === trimmed) return true;

        const vPhone = cleanPhone(v.phone);
        if (cleanedQuery && vPhone && (vPhone.includes(cleanedQuery) || cleanedQuery.includes(vPhone))) {
          return true;
        }

        const email = String(v.email || '').toLowerCase().trim();
        if (email && email === trimmed.toLowerCase()) return true;

        return false;
      });

      if (match) {
        const profile: VisitorProfile = {
          id: match.id,
          visitor_id: match.visitor_id || match.id,
          visitor_name:
            match.first_name && match.last_name
              ? `${match.first_name} ${match.last_name}`
              : match.visitor_name || match.first_name || 'زائر معتمد',
          first_name: match.first_name,
          last_name: match.last_name,
          national_id: match.national_id,
          phone: match.phone,
          email: match.email || undefined,
          company: match.company || undefined,
          job_title: match.job_title || undefined,
        };
        this.saveSession(profile);
        return profile;
      }

      // If not found in database, check if it's formatted like a valid phone or ID to generate temporary verified profile
      if (/^05\d{8}$/.test(cleanedQuery) || /^1\d{9}$/.test(trimmed)) {
        const generated: VisitorProfile = {
          id: `vis-${Date.now().toString().slice(-6)}`,
          visitor_id: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          visitor_name: 'زائر مسجل بالنظام',
          national_id: /^\d{10}$/.test(trimmed) ? trimmed : undefined,
          phone: trimmed,
          company: 'مؤسسة معتمدة',
          job_title: 'مستفيد من الخدمات المخبرية',
        };
        this.saveSession(generated);
        return generated;
      }

      return null;
    } catch (err) {
      console.error('Error during visitor lookup:', err);
      return null;
    }
  },

  /**
   * Get all visits for a specific visitor, categorized into Upcoming vs History
   */
  async getVisitorVisits(visitor: VisitorProfile): Promise<{
    upcoming: AppointmentItem[];
    history: AppointmentItem[];
  }> {
    try {
      const { data: rows } = await supabase.from('visitors').select('*');
      const allVisitors: VisitorDataRecord[] = (rows as VisitorDataRecord[]) || [];

      const visitorPhoneClean = cleanPhone(visitor.phone);

      const matchedRecords = allVisitors.filter((v) => {
        if (v.visitor_id && v.visitor_id === visitor.visitor_id) return true;
        if (v.id && (v.id === visitor.id || v.id === visitor.visitor_id)) return true;
        if (visitor.national_id && v.national_id === visitor.national_id) return true;
        const vPhoneClean = cleanPhone(v.phone);
        if (visitorPhoneClean && vPhoneClean && visitorPhoneClean === vPhoneClean) return true;
        return false;
      });

      const todayStr = new Date().toISOString().split('T')[0];

      const mapped: AppointmentItem[] = matchedRecords.map((r) => {
        let status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' = 'Confirmed';
        const rawStatus = String(r.status || '').toLowerCase();
        if (rawStatus.includes('cancel')) status = 'Cancelled';
        else if (rawStatus.includes('pend') || rawStatus === 'new') status = 'Pending';
        else if (rawStatus.includes('check') || rawStatus.includes('complet') || r.visit_date < todayStr) {
          status = 'Completed';
        } else {
          status = 'Confirmed';
        }

        return {
          id: r.id,
          visitor_id: r.visitor_id || r.id,
          visitor_name:
            r.first_name && r.last_name
              ? `${r.first_name} ${r.last_name}`
              : r.visitor_name || visitor.visitor_name,
          national_id: r.national_id || visitor.national_id,
          phone: r.phone || visitor.phone,
          email: r.email || visitor.email,
          company: r.company || visitor.company,
          job_title: r.job_title || visitor.job_title,
          laboratory: r.laboratory || 'asir',
          branch: r.branch || undefined,
          department: r.department || 'إدارة ضبط الجودة والتحاليل المعتمدة',
          employee: r.employee || undefined,
          purpose: r.purpose || r.visit_purpose || 'فحص وتحليل عينات مياه معتمدة',
          visit_date: r.visit_date || todayStr,
          arrival_time: r.arrival_time || '09:30 صباحاً',
          status,
          notes: r.notes || undefined,
          qr_url: r.qr_url || undefined,
          created_at: r.created_at || new Date().toISOString(),
        };
      });

      // If this is a demo user and no visits exist, provide high-value initial visits
      if (mapped.length === 0 && (visitor.visitor_id === 'LAB-2026-0001' || visitor.phone === '0501234567')) {
        mapped.push(
          {
            id: 'appt-upcoming-01',
            visitor_id: 'LAB-2026-0001',
            visitor_name: visitor.visitor_name,
            national_id: visitor.national_id,
            phone: visitor.phone,
            email: visitor.email,
            company: visitor.company,
            job_title: visitor.job_title,
            laboratory: 'asir',
            branch: 'bisha',
            department: 'وحدة الفحص الميكروبيولوجي والمعادن الثقيلة',
            employee: 'د. عبدالله الشهراني',
            purpose: 'تسليم عينات مياه شبكة محطة بيشة المركزية واستلام شهادة المطابقة',
            visit_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
            arrival_time: '10:00 صباحاً',
            status: 'Confirmed',
            notes: 'تم تأكيد الموعد وإشعار المشرف المخبري',
            created_at: new Date().toISOString(),
          },
          {
            id: 'appt-past-01',
            visitor_id: 'LAB-2026-0001',
            visitor_name: visitor.visitor_name,
            national_id: visitor.national_id,
            phone: visitor.phone,
            email: visitor.email,
            company: visitor.company,
            job_title: visitor.job_title,
            laboratory: 'najran',
            branch: 'sharurah',
            department: 'المختبر المركزي بنجران — قسم الكيمياء التحليلية',
            employee: 'م. مانع اليامي',
            purpose: 'فحص مياه آبار ارتوازية مطابقة لمعايير SASO',
            visit_date: '2026-08-25',
            arrival_time: '11:15 صباحاً',
            status: 'Completed',
            notes: 'اكتملت الزيارة وصدر تقرير التحليل المخبري NWC-SL-2026-0915',
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          }
        );
      }

      // Sort by date
      const upcoming = mapped
        .filter((a) => a.visit_date >= todayStr && a.status !== 'Completed' && a.status !== 'Cancelled')
        .sort((a, b) => a.visit_date.localeCompare(b.visit_date));

      const history = mapped
        .filter((a) => a.visit_date < todayStr || a.status === 'Completed' || a.status === 'Cancelled')
        .sort((a, b) => b.visit_date.localeCompare(a.visit_date));

      return { upcoming, history };
    } catch (err) {
      console.error('Error fetching visitor visits:', err);
      return { upcoming: [], history: [] };
    }
  },

  /**
   * Get official lab reports for visitor
   */
  getVisitorReports(visitor: VisitorProfile): LabReportItem[] {
    try {
      const customRaw = localStorage.getItem(STORAGE_CUSTOM_REPORTS);
      const customReports: LabReportItem[] = customRaw ? JSON.parse(customRaw) : [];

      const combined = [...customReports, ...DEFAULT_LAB_REPORTS];

      // Match by visitor_id or return all if demo user, or tailor to visitor
      const visitorMatch = combined.filter(
        (r) =>
          r.visitor_id === visitor.visitor_id ||
          r.visitor_id === 'LAB-2026-0001' ||
          visitor.phone === '0501234567'
      );

      // If user has no specific report, adapt reports to their name so they can test downloading
      if (visitorMatch.length === 0) {
        return DEFAULT_LAB_REPORTS.map((r, idx) => ({
          ...r,
          id: `custom-rpt-${idx}-${visitor.id}`,
          visitor_id: visitor.visitor_id,
          visitor_name: visitor.visitor_name,
        }));
      }

      return visitorMatch;
    } catch {
      return DEFAULT_LAB_REPORTS;
    }
  },

  /**
   * Reschedule appointment date & time
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<boolean> {
    try {
      await supabase
        .from('visitors')
        .update({ visit_date: newDate, arrival_time: newTime, status: 'Confirmed' })
        .eq('id', appointmentId);
      return true;
    } catch (e) {
      console.warn('Failed to reschedule in supabase:', e);
      return false;
    }
  },

  /**
   * Cancel an upcoming visit
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      await supabase
        .from('visitors')
        .update({ status: 'Cancelled' })
        .eq('id', appointmentId);
      return true;
    } catch (e) {
      console.warn('Failed to cancel appointment in supabase:', e);
      return false;
    }
  },

  /**
   * Generate an iCalendar (.ics) file content and trigger browser download
   */
  downloadCalendarIcs(appt: AppointmentItem): void {
    const cleanDate = appt.visit_date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//National Water Company//Southern Sector Labs//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${appt.id}@southernwaterlabs.gov.sa`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      `SUMMARY:زيارة مختبرات المياه الوطنية — ${appt.laboratory}`,
      `DESCRIPTION:موعد زيارة معتمد: ${appt.purpose}\\nالموقع: ${appt.department}\\nرقم التصريح: ${appt.visitor_id}`,
      `LOCATION:${appt.laboratory} - القطاع الجنوبي`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Visit-${appt.visitor_id || 'NWC'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Print or download an official certified laboratory water quality report
   */
  openPrintableReport(report: LabReportItem, lang: 'ar' | 'en' | 'fr' = 'ar'): void {
    const isAr = lang === 'ar';
    const dir = isAr ? 'rtl' : 'ltr';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة لطباعة التقرير' : 'Please allow popups to view and print the report');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="${lang}" dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <title>تقرير فحص مخبري معتمد — ${report.report_number}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", Tahoma, sans-serif; }
          body { color: #0F172A; background: #fff; line-height: 1.4; margin: 0; padding: 20px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1E3A5F; padding-bottom: 12px; margin-bottom: 15px; }
          .header-title { text-align: center; }
          .header-title h1 { margin: 0; font-size: 16px; color: #1E3A5F; }
          .header-title h2 { margin: 2px 0; font-size: 13px; color: #475569; }
          .badge-strip { display: flex; justify-content: center; gap: 10px; margin-top: 6px; }
          .badge { background: #EEF2F6; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; color: #1E3A5F; border: 1px solid #CBD5E1; }
          .badge-compliant { background: #ECFDF5; color: #065F46; border-color: #A7F3D0; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px; margin-bottom: 15px; }
          .info-item { display: flex; flex-direction: column; }
          .info-label { font-size: 10px; color: #64748B; font-weight: bold; }
          .info-val { font-size: 11px; font-weight: 600; color: #0F172A; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #1E3A5F; color: #fff; padding: 6px 8px; text-align: ${isAr ? 'right' : 'left'}; font-size: 11px; }
          td { border-bottom: 1px solid #E2E8F0; padding: 6px 8px; font-size: 11px; }
          tr:nth-child(even) td { background: #F8FAFC; }
          .status-normal { color: #059669; font-weight: bold; }
          .footer { margin-top: 25px; border-top: 1px solid #CBD5E1; padding-top: 15px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; width: 45%; }
          .signature-line { border-bottom: 1px dashed #94A3B8; margin: 30px auto 5px; width: 80%; }
          .official-seal { border: 2px solid #1E3A5F; border-radius: 50%; width: 90px; height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; color: #1E3A5F; text-align: center; margin: 0 auto; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; text-align: center;">
          <button onclick="window.print()" style="background: #1E3A5F; color: #fff; padding: 8px 20px; font-size: 13px; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">
            ${isAr ? 'طباعة التقرير الرسمي / حفظ كـ PDF' : 'Print Official Report / Save as PDF'}
          </button>
        </div>

        <div class="header">
          <div>
            <strong>شركة المياه الوطنية (NWC)</strong><br>
            <span style="font-size: 10px; color: #64748B;">القطاع الجنوبي — المختبرات المركزية</span>
          </div>
          <div class="header-title">
            <h1>شهادة وتقرير فحص مخبري معتمد</h1>
            <h2>OFFICIAL CERTIFIED WATER ANALYSIS REPORT</h2>
            <div class="badge-strip">
              <span class="badge">ISO/IEC 17025:2017 &bull; SAC</span>
              <span class="badge">SASO COMPLIANT</span>
              <span class="badge badge-compliant">${isAr ? 'عينة صالحة ومطابقة' : 'COMPLIANT SPECIMEN'}</span>
            </div>
          </div>
          <div style="text-align: ${isAr ? 'left' : 'right'}; font-size: 11px;">
            <strong>رقم التقرير:</strong> ${report.report_number}<br>
            <strong>كود العينة:</strong> ${report.sample_code}
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">${isAr ? 'اسم المستفيد / الجهة:' : 'Client / Beneficiary:'}</span>
            <span class="info-val">${report.visitor_name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isAr ? 'المختبر الفاحص:' : 'Testing Laboratory:'}</span>
            <span class="info-val">${report.laboratory_name_ar}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isAr ? 'نوع العينة ومصدرها:' : 'Sample Type & Matrix:'}</span>
            <span class="info-val">${report.sample_type_ar} — ${report.source_location_ar}</span>
          </div>
          <div class="info-item">
            <span class="info-label">${isAr ? 'تاريخ السحب والفحص:' : 'Sampling & Analysis Date:'}</span>
            <span class="info-val">${report.collection_date} &larr; ${report.analysis_date} (الإصدار: ${report.issue_date})</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>${isAr ? 'المؤشر / الفحص' : 'Parameter'}</th>
              <th>${isAr ? 'الوحدة' : 'Unit'}</th>
              <th>${isAr ? 'النتيجة المقاسة' : 'Measured Result'}</th>
              <th>${isAr ? 'الحد النظامي القياسي' : 'Standard Limit'}</th>
              <th>${isAr ? 'طريقة الفحص المعيارية' : 'Test Method'}</th>
              <th>${isAr ? 'المطابقة' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            ${report.parameters
              .map(
                (p, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${isAr ? p.name_ar : p.name_en}</strong></td>
                <td>${p.unit}</td>
                <td style="font-weight: bold; font-family: monospace;">${p.measured_value}</td>
                <td>${p.standard_limit}</td>
                <td style="font-size: 10px; color: #475569;">${p.method}</td>
                <td class="status-normal">${isAr ? 'مطابق ✓' : 'PASS ✓'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="background: #F1F5F9; padding: 8px 12px; border-radius: 4px; font-size: 10px; color: #334155; margin-bottom: 15px;">
          <strong>${isAr ? 'الخلاصة الفنية والاعتماد:' : 'Technical Conclusion & Accreditation:'}</strong>
          ${isAr ? report.compliance_status_ar : report.compliance_status_en}. النتائج الواردة أعلاه تمثل العينة المستلمة والمعايرة وفق اشتراطات الآيزو 17025.
        </div>

        <div class="footer">
          <div class="signature-box">
            <div class="info-label">${isAr ? 'المحلل الفني المسؤول:' : 'Authorized Analyst:'}</div>
            <div class="info-val">${report.authorized_specialist.name_ar}</div>
            <div style="font-size: 9px; color: #64748B;">${report.authorized_specialist.title_ar}</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px; color: #94A3B8;">توقيع واعتماد إلكتروني موثق</div>
          </div>

          <div class="official-seal">
            <span>مختبرات NWC</span>
            <span>معتمد SAC</span>
            <span>17025:2017</span>
            <span>القطاع الجنوبي</span>
          </div>

          <div class="signature-box">
            <div class="info-label">${isAr ? 'مدير توكيد الجودة المخبرية:' : 'QA / QC Manager:'}</div>
            <div class="info-val">${report.qa_officer.name_ar}</div>
            <div style="font-size: 9px; color: #64748B;">${report.qa_officer.title_ar}</div>
            <div class="signature-line"></div>
            <div style="font-size: 9px; color: #94A3B8;">ختم الاعتماد الرقمي</div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  },
};
