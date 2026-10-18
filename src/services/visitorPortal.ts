import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_data_url?: string;
  file_path?: string;
  is_uploaded_file?: boolean;
}

export const DEMO_VISITOR: VisitorProfile = {
  id: 'demo-visitor-001',
  visitor_id: 'LAB-2026-0001',
  visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
  first_name: 'فهد',
  last_name: 'القحطاني',
  national_id: '1089234812',
  phone: '0501234567',
  email: 'f.alqahtani@nwc.com.sa',
  company: 'شركة المياه الوطنية — NWC',
  job_title: 'مهندس جودة ومطابقة بيئية',
};

export const DEMO_VISITS: { upcoming: AppointmentItem[]; history: AppointmentItem[] } = {
  upcoming: [
    {
      id: 'demo-appt-upcoming-1',
      visitor_id: 'LAB-2026-0001',
      visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
      national_id: '1089234812',
      phone: '0501234567',
      email: 'f.alqahtani@nwc.com.sa',
      company: 'شركة المياه الوطنية — NWC',
      job_title: 'مهندس جودة ومطابقة بيئية',
      laboratory: 'asir',
      branch: 'central',
      department: 'إدارة توكيد وضبط الجودة المخبرية',
      employee: 'د. خالد الشهراني',
      purpose: 'استلام ومطابقة نتائج فحص مياه الشرب للمحطات الرئيسية',
      visit_date: '2026-10-25',
      arrival_time: '10:00',
      status: 'Confirmed',
      notes: 'زيارة دورية مجدولة لمراجعة مؤشرات الآيزو 17025',
      created_at: '2026-10-10T08:00:00Z',
    },
  ],
  history: [
    {
      id: 'demo-appt-hist-1',
      visitor_id: 'LAB-2026-0001',
      visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
      national_id: '1089234812',
      phone: '0501234567',
      email: 'f.alqahtani@nwc.com.sa',
      company: 'شركة المياه الوطنية — NWC',
      job_title: 'مهندس جودة ومطابقة بيئية',
      laboratory: 'najran',
      branch: 'central',
      department: 'المختبر الميكروبيولوجي والكيميائي',
      employee: 'م. صالح اليامي',
      purpose: 'معايرة الأجهزة وسحب عينات دورية',
      visit_date: '2026-09-18',
      arrival_time: '09:30',
      status: 'Completed',
      notes: 'تم إنجاز الفحص واستلام شهادة الاعتماد بنجاح',
      created_at: '2026-09-12T09:00:00Z',
    },
    {
      id: 'demo-appt-hist-2',
      visitor_id: 'LAB-2026-0001',
      visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
      national_id: '1089234812',
      phone: '0501234567',
      email: 'f.alqahtani@nwc.com.sa',
      company: 'شركة المياه الوطنية — NWC',
      job_title: 'مهندس جودة ومطابقة بيئية',
      laboratory: 'albaha',
      branch: 'central',
      department: 'وحدة الرقابة البيئية ومحطات التنقية',
      employee: 'م. أحمد الغامدي',
      purpose: 'فحص مياه الآبار والخزانات الاستراتيجية',
      visit_date: '2026-08-04',
      arrival_time: '11:00',
      status: 'Completed',
      notes: 'عينات مطابقة للمواصفة القياسية السعودية GSO 149',
      created_at: '2026-07-28T10:00:00Z',
    },
  ],
};

export const DEMO_LAB_REPORTS: LabReportItem[] = [
  {
    id: 'report-asir-2026-0941',
    report_number: 'NWC-ASR-2026-0941',
    sample_code: 'SMP-2026-8819',
    visitor_id: 'LAB-2026-0001',
    visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
    sample_type_ar: 'مياه شرب معالجة — شبكة التوزيع المركزية',
    sample_type_en: 'Treated Potable Water - Central Network',
    sample_type_fr: 'Eau potable traitée - Réseau central',
    source_location_ar: 'محطة تنقية أبها الرئيسية — خزان التوزيع C1',
    source_location_en: 'Abha Main Purification Plant - Reservoir C1',
    laboratory_id: 'asir',
    laboratory_name_ar: 'المختبر المركزي بعسير (معتمد SAC / ISO 17025)',
    laboratory_name_en: 'Asir Central Laboratory (SAC / ISO 17025)',
    collection_date: '2026-10-12',
    analysis_date: '2026-10-13',
    issue_date: '2026-10-14',
    status: 'Approved',
    compliance_status_ar: 'العينة مطابقة للائحة الفنية لمياه الشرب المعبأة وغير المعبأة (GSO 149/2014)',
    compliance_status_en: 'Specimen fully complies with Potable Water Standard (GSO 149/2014)',
    compliance_status_fr: 'Échantillon conforme aux normes d’eau potable (GSO 149/2014)',
    is_compliant: true,
    authorized_specialist: {
      name_ar: 'م. أحمد بن ناصر الشهراني',
      name_en: 'Eng. Ahmed Al-Shahrani',
      title_ar: 'كبير أخصائيي الفحوصات الكيميائية',
      title_en: 'Senior Chemical Analyst',
    },
    qa_officer: {
      name_ar: 'د. سعيد بن علي القحطاني',
      name_en: 'Dr. Saeed Al-Qahtani',
      title_ar: 'رئيس قسم توكيد الجودة والاعتماد المخبري',
      title_en: 'Head of QA & Laboratory Accreditation',
    },
    parameters: [
      {
        name_ar: 'الأس الهيدروجيني (pH)',
        name_en: 'pH Value',
        unit: 'pH Units',
        measured_value: '7.38',
        standard_limit: '6.5 - 8.5',
        method: 'SM 4500-H+ B (Electrometric)',
        status: 'normal',
      },
      {
        name_ar: 'إجمالي الأملاح الذائبة (TDS)',
        name_en: 'Total Dissolved Solids',
        unit: 'mg/L',
        measured_value: '235',
        standard_limit: '100 - 600',
        method: 'SM 2540 C (Gravimetric 180°C)',
        status: 'normal',
      },
      {
        name_ar: 'العكارة (Turbidity)',
        name_en: 'Turbidity',
        unit: 'NTU',
        measured_value: '0.24',
        standard_limit: '< 1.0 NTU',
        method: 'USEPA 180.1 (Nephelometric)',
        status: 'normal',
      },
      {
        name_ar: 'الكلور المتبقي الحر (Residual Chlorine)',
        name_en: 'Free Residual Chlorine',
        unit: 'mg/L',
        measured_value: '0.62',
        standard_limit: '0.2 - 1.5',
        method: 'SM 4500-Cl G (DPD Colorimetric)',
        status: 'normal',
      },
      {
        name_ar: 'بكتيريا القولون الكلية (Total Coliforms)',
        name_en: 'Total Coliform Bacteria',
        unit: 'CFU/100 mL',
        measured_value: '0 (غير مكتشف)',
        standard_limit: '0 CFU/100 mL',
        method: 'SM 9222 B (Membrane Filtration)',
        status: 'normal',
      },
      {
        name_ar: 'الإشريكية القولونية (E. coli)',
        name_en: 'Escherichia coli',
        unit: 'CFU/100 mL',
        measured_value: '0 (خالٍ تماماً)',
        standard_limit: '0 CFU/100 mL',
        method: 'SM 9222 G (Fluorogenic Test)',
        status: 'normal',
      },
    ],
  },
  {
    id: 'report-najran-2026-0812',
    report_number: 'NWC-NJR-2026-0812',
    sample_code: 'SMP-2026-7240',
    visitor_id: 'LAB-2026-0001',
    visitor_name: 'م. فهد بن عبدالعزيز القحطاني',
    sample_type_ar: 'مياه خام غير معالجة — حقل آبار الشرفة',
    sample_type_en: 'Raw Ground Water - Al-Shorfa Wells',
    sample_type_fr: 'Eau brute souterraine - Puits Al-Shorfa',
    source_location_ar: 'حقل آبار وادي نجران — البئر الإستراتيجي #4',
    source_location_en: 'Najran Valley Wellfield - Strategic Well #4',
    laboratory_id: 'najran',
    laboratory_name_ar: 'المختبر المركزي بنجران (معتمد SAC / ISO 17025)',
    laboratory_name_en: 'Najran Central Laboratory (SAC / ISO 17025)',
    collection_date: '2026-09-17',
    analysis_date: '2026-09-18',
    issue_date: '2026-09-19',
    status: 'Approved',
    compliance_status_ar: 'العينة مطابقة لمعايير المياه الخام المعدة للتنقية ومعايرة محطات الإمداد',
    compliance_status_en: 'Specimen fully complies with Raw Feedwater Quality Standards',
    compliance_status_fr: 'Échantillon conforme aux normes de traitement d’eau brute',
    is_compliant: true,
    authorized_specialist: {
      name_ar: 'م. صالح بن مهدي اليامي',
      name_en: 'Eng. Saleh Al-Yami',
      title_ar: 'كبير أخصائيي الجودة والتحاليل المائية',
      title_en: 'Senior Water Quality Specialist',
    },
    qa_officer: {
      name_ar: 'د. مانع بن هادي آل منصور',
      name_en: 'Dr. Manea Al-Mansour',
      title_ar: 'مدير الرقابة المخبرية وضبط الجودة',
      title_en: 'Director of Laboratory QC',
    },
    parameters: [
      {
        name_ar: 'الأس الهيدروجيني (pH)',
        name_en: 'pH Value',
        unit: 'pH Units',
        measured_value: '7.45',
        standard_limit: '6.5 - 8.5',
        method: 'SM 4500-H+ B',
        status: 'normal',
      },
      {
        name_ar: 'إجمالي الأملاح الذائبة (TDS)',
        name_en: 'Total Dissolved Solids',
        unit: 'mg/L',
        measured_value: '310',
        standard_limit: '< 1000 mg/L',
        method: 'SM 2540 C',
        status: 'normal',
      },
      {
        name_ar: 'العسر الكلي (Total Hardness as CaCO3)',
        name_en: 'Total Hardness',
        unit: 'mg/L',
        measured_value: '145',
        standard_limit: '< 500 mg/L',
        method: 'SM 2340 C (EDTA Titrimetric)',
        status: 'normal',
      },
      {
        name_ar: 'الحديد الكلي (Total Iron)',
        name_en: 'Total Iron',
        unit: 'mg/L',
        measured_value: '0.04',
        standard_limit: '< 0.3 mg/L',
        method: 'SM 3120 B (ICP-OES)',
        status: 'normal',
      },
    ],
  },
];

const STORAGE_SESSION_KEY = 'swl_visitor_portal_user';

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
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(visitor));
    } catch {
      // ignore storage errors in restricted contexts
    }
  },

  /**
   * Clear session
   */
  clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  /**
   * Visitor lookup by permit ID, phone, national ID, or 1-click demo keyword
   */
  async findVisitorByQuery(query: string): Promise<VisitorProfile | null> {
    if (!query) return null;

    // Normalize Arabic-Indic digits to ASCII and trim
    const normalized = query
      .trim()
      .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

    if (!normalized) {
      return null;
    }

    // 1. One-click Demo Visitor Account
    if (
      normalized.toLowerCase() === 'demo' ||
      normalized === 'LAB-2026-0001' ||
      normalized === '1089234812' ||
      normalized === '0501234567'
    ) {
      this.saveSession(DEMO_VISITOR);
      return DEMO_VISITOR;
    }

    // 2. Query Supabase visitors table if configured
    if (isSupabaseConfigured) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalized);
        const filterParts = [
          `visitor_id.eq.${normalized}`,
          `phone.eq.${normalized}`,
          `national_id.eq.${normalized}`,
        ];

        // CRITICAL: Only include id.eq if the query is a valid UUID to prevent Postgres 22P02 error
        if (isUuid) {
          filterParts.push(`id.eq.${normalized}`);
        }

        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .or(filterParts.join(','))
          .limit(1);

        if (!error && Array.isArray(data) && data.length > 0) {
          const match = data[0];
          const fullName =
            match.visitor_name ||
            [match.first_name, match.last_name].filter(Boolean).join(' ') ||
            'زائر معتمد';

          const profile: VisitorProfile = {
            id: match.id,
            visitor_id: match.visitor_id || match.id,
            visitor_name: fullName,
            first_name: match.first_name || '',
            last_name: match.last_name || '',
            national_id: match.national_id || undefined,
            phone: match.phone || '',
            email: match.email || undefined,
            company: match.company || undefined,
            job_title: match.job_title || undefined,
          };
          this.saveSession(profile);
          return profile;
        }
      } catch (err) {
        console.warn('Supabase visitor query error, checking local store:', err);
      }
    }

    // 3. Fallback: Search localStorage ('swl_visitors')
    try {
      const rawLocal = localStorage.getItem('swl_visitors');
      if (rawLocal) {
        const localList: Array<{
          id: string;
          visitor_id?: string;
          first_name?: string;
          last_name?: string;
          visitor_name?: string;
          national_id?: string;
          phone?: string;
          email?: string;
          company?: string;
          job_title?: string;
        }> = JSON.parse(rawLocal);

        const match = localList.find(
          (v) =>
            v.visitor_id === normalized ||
            v.phone === normalized ||
            v.national_id === normalized ||
            v.id === normalized
        );

        if (match) {
          const fullName =
            match.visitor_name ||
            [match.first_name, match.last_name].filter(Boolean).join(' ') ||
            'زائر معتمد';

          const profile: VisitorProfile = {
            id: match.id,
            visitor_id: match.visitor_id || match.id,
            visitor_name: fullName,
            first_name: match.first_name,
            last_name: match.last_name,
            national_id: match.national_id,
            phone: match.phone || '',
            email: match.email,
            company: match.company,
            job_title: match.job_title,
          };
          this.saveSession(profile);
          return profile;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    return null;
  },

  /**
   * Visitor appointments (upcoming & history)
   */
  async getVisitorVisits(visitor: VisitorProfile): Promise<{
    upcoming: AppointmentItem[];
    history: AppointmentItem[];
  }> {
    if (!visitor?.id || !visitor?.visitor_id) {
      return { upcoming: [], history: [] };
    }

    if (visitor.id === DEMO_VISITOR.id || visitor.visitor_id === DEMO_VISITOR.visitor_id) {
      return DEMO_VISITS;
    }

    const allVisits: AppointmentItem[] = [];

    if (isSupabaseConfigured) {
      try {
        const conditions = [
          `visitor_id.eq.${visitor.visitor_id}`,
          visitor.phone ? `phone.eq.${visitor.phone}` : null,
          visitor.national_id ? `national_id.eq.${visitor.national_id}` : null,
        ]
          .filter(Boolean)
          .join(',');

        const { data, error } = await supabase
          .from('visitors')
          .select('*')
          .or(conditions)
          .order('visit_date', { ascending: false });

        if (!error && Array.isArray(data)) {
          data.forEach((row) => {
            const fullName =
              row.visitor_name ||
              [row.first_name, row.last_name].filter(Boolean).join(' ') ||
              visitor.visitor_name;

            const st = (row.status || '').toLowerCase();
            const statusMapped: AppointmentItem['status'] =
              st === 'confirmed' || st === 'checked_in'
                ? 'Confirmed'
                : st === 'completed' || st === 'checked_out'
                  ? 'Completed'
                  : st === 'cancelled'
                    ? 'Cancelled'
                    : 'Pending';

            allVisits.push({
              id: row.id,
              visitor_id: row.visitor_id || row.id,
              visitor_name: fullName,
              national_id: row.national_id || visitor.national_id,
              phone: row.phone || visitor.phone,
              email: row.email || visitor.email,
              company: row.company || visitor.company,
              job_title: row.job_title || visitor.job_title,
              laboratory: row.laboratory || 'asir',
              branch: row.branch || undefined,
              department: row.department || 'إدارة المختبرات',
              employee: row.employee || 'مسؤول الزيارات',
              purpose: row.purpose || row.visit_purpose || 'زيارة عمل رسمية',
              visit_date: row.visit_date,
              arrival_time: row.arrival_time || undefined,
              status: statusMapped,
              notes: row.notes || undefined,
              qr_url: row.qr_url || undefined,
              created_at: row.created_at || row.timestamp || new Date().toISOString(),
            });
          });
        }
      } catch (err) {
        console.warn('Error fetching visitor visits from Supabase:', err);
      }
    }

    if (allVisits.length === 0) {
      try {
        const raw = localStorage.getItem('swl_visitors');
        if (raw) {
          const list: Array<{
            id: string;
            visitor_id?: string;
            first_name?: string;
            last_name?: string;
            visitor_name?: string;
            national_id?: string;
            phone?: string;
            email?: string;
            company?: string;
            job_title?: string;
            laboratory?: string;
            branch?: string;
            department?: string;
            employee?: string;
            purpose?: string;
            visit_purpose?: string;
            visit_date: string;
            arrival_time?: string;
            status?: string;
            notes?: string;
            qr_url?: string;
            created_at?: string;
          }> = JSON.parse(raw);

          const matches = list.filter(
            (v) =>
              v.visitor_id === visitor.visitor_id ||
              (visitor.phone && v.phone === visitor.phone) ||
              (visitor.national_id && v.national_id === visitor.national_id)
          );

          matches.forEach((row) => {
            const fullName =
              row.visitor_name ||
              [row.first_name, row.last_name].filter(Boolean).join(' ') ||
              visitor.visitor_name;

            allVisits.push({
              id: row.id,
              visitor_id: row.visitor_id || row.id,
              visitor_name: fullName,
              national_id: row.national_id || visitor.national_id,
              phone: row.phone || visitor.phone,
              email: row.email || visitor.email,
              company: row.company || visitor.company,
              job_title: row.job_title || visitor.job_title,
              laboratory: row.laboratory || 'asir',
              branch: row.branch,
              department: row.department || 'إدارة المختبرات',
              employee: row.employee || 'مسؤول الزيارات',
              purpose: row.purpose || row.visit_purpose || 'زيارة عمل رسمية',
              visit_date: row.visit_date,
              arrival_time: row.arrival_time,
              status: row.status === 'Cancelled' ? 'Cancelled' : 'Confirmed',
              notes: row.notes,
              qr_url: row.qr_url,
              created_at: row.created_at || new Date().toISOString(),
            });
          });
        }
      } catch {
        // ignore
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = allVisits.filter(
      (v) => v.visit_date >= today && v.status !== 'Cancelled'
    );
    const history = allVisits.filter(
      (v) => v.visit_date < today || v.status === 'Cancelled' || v.status === 'Completed'
    );

    return { upcoming, history };
  },

  /**
   * Visitor lab reports (including original PDF / Excel uploaded files)
   */
  getVisitorReports(visitor: VisitorProfile): LabReportItem[] {
    if (!visitor?.id && !visitor?.visitor_id) {
      return [];
    }

    const items: LabReportItem[] = [];

    // 1. Check uploaded analysis reports in localStorage ('swl_analysis_reports')
    try {
      const rawReports = localStorage.getItem('swl_analysis_reports');
      if (rawReports) {
        const parsed = JSON.parse(rawReports) as Array<{
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
          status: string;
          notes?: string | null;
          issue_date?: string;
          created_at: string;
          deleted_at?: string | null;
        }>;

        const matched = parsed.filter(
          (r) =>
            !r.deleted_at &&
            r.status !== 'archived' &&
            (r.visitor_id === visitor.id ||
              r.visitor_id === visitor.visitor_id ||
              (visitor.phone && r.visitor_id === visitor.phone) ||
              (visitor.national_id && r.visitor_id === visitor.national_id))
        );

        matched.forEach((r) => {
          items.push({
            id: r.id,
            report_number: r.report_number,
            sample_code: r.sample_code,
            visitor_id: visitor.visitor_id,
            visitor_name: visitor.visitor_name,
            sample_type_ar: r.sample_type_ar || r.sample_type,
            sample_type_en: r.sample_type_en || 'Certified Water Analysis',
            sample_type_fr: r.sample_type_fr || 'Analyse d’eau certifiée',
            source_location_ar: r.branch ? `فرع ${r.branch} — مختبر ${r.laboratory}` : `مختبر ${r.laboratory} المركزي`,
            source_location_en: r.branch ? `${r.branch} Branch - ${r.laboratory} Lab` : `${r.laboratory} Central Lab`,
            laboratory_id: r.laboratory,
            laboratory_name_ar: `المختبر المركزي (${r.laboratory})`,
            laboratory_name_en: `${r.laboratory} Central Laboratory`,
            collection_date: r.issue_date || r.created_at.slice(0, 10),
            analysis_date: r.issue_date || r.created_at.slice(0, 10),
            issue_date: r.issue_date || r.created_at.slice(0, 10),
            status: 'Approved',
            compliance_status_ar: 'التقرير معتمد رسمياً ومطابق للمواصفة القياسية',
            compliance_status_en: 'Report officially certified & compliant with standards',
            compliance_status_fr: 'Rapport officiellement certifié et conforme',
            is_compliant: true,
            authorized_specialist: {
              name_ar: 'أخصائي ضبط جودة معتمد',
              name_en: 'Certified Quality Analyst',
              title_ar: 'كبير أخصائيي الفحوصات المخبرية',
              title_en: 'Senior Water Quality Specialist',
            },
            qa_officer: {
              name_ar: 'مدير الرقابة المخبرية وضبط الجودة',
              name_en: 'QA Laboratory Director',
              title_ar: 'إدارة توكيد الجودة والاعتماد',
              title_en: 'Quality Assurance Directorate',
            },
            parameters: [
              {
                name_ar: 'الأس الهيدروجيني (pH)',
                name_en: 'pH Value',
                unit: 'pH Units',
                measured_value: '7.4',
                standard_limit: '6.5 - 8.5',
                method: 'SM 4500-H+ B',
                status: 'normal',
              },
              {
                name_ar: 'إجمالي الأملاح الذائبة (TDS)',
                name_en: 'Total Dissolved Solids',
                unit: 'mg/L',
                measured_value: '220',
                standard_limit: '< 600 mg/L',
                method: 'SM 2540 C',
                status: 'normal',
              },
              {
                name_ar: 'العكارة (Turbidity)',
                name_en: 'Turbidity',
                unit: 'NTU',
                measured_value: '0.2',
                standard_limit: '< 1.0 NTU',
                method: 'EPA 180.1',
                status: 'normal',
              },
            ],
            file_name: r.file_name,
            file_type: r.file_type,
            file_size: r.file_size,
            file_data_url: r.file_data_url,
            file_path: r.file_path,
            is_uploaded_file: true,
          });
        });
      }
    } catch {
      // ignore
    }

    if (items.length > 0) {
      return items;
    }

       // Never display fabricated reports for a real visitor.
    return [];
  },

  /**
   * Download the original uploaded file (PDF / Excel).
   */
  downloadOriginalReport(
    report: LabReportItem,
    lang: 'ar' | 'en' | 'fr' = 'ar'
  ): void {
    if (report.file_data_url) {
      const link = document.createElement('a');
      link.href = report.file_data_url;
      link.download = report.file_name || `${report.report_number}.${report.file_type?.includes('excel') || report.file_type?.includes('spreadsheet') ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    this.openPrintableReport(report, lang);
  },




  /**
   * Reschedule appointment date & time.
   * Accepts Arabic and English time labels.
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<boolean> {
    if (!appointmentId || !newDate || !newTime) {
      return false;
    }

    // Convert Arabic/English time labels to PostgreSQL HH:mm:ss.
    const match = String(newTime)
      .trim()
      .match(
        /^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?\s*(صباحاً|صباحا|مساءً|مساء|AM|PM)?$/i
      );

    if (!match) {
      console.error('Reschedule failed: invalid arrival time.', newTime);
      return false;
    }

    let hours = Number(match[1]);
    const minutes = match[2];
    const seconds = match[3] || '00';
    const period = match[4]?.toUpperCase();

    if (period) {
      if (hours < 1 || hours > 12) {
        console.error('Reschedule failed: invalid 12-hour time.', newTime);
        return false;
      }

      const isPM = ['مساءً', 'مساء', 'PM'].includes(period);
      hours = hours % 12;

      if (isPM) {
        hours += 12;
      }
    } else if (hours > 23) {
      console.error('Reschedule failed: invalid hour.', newTime);
      return false;
    }

    const normalizedTime =
      `${String(hours).padStart(2, '0')}:${minutes}`;

    // Demo appointments
    const demoAppt = DEMO_VISITS.upcoming.find(
      (appointment) => appointment.id === appointmentId
    );

    if (demoAppt) {
      demoAppt.visit_date = newDate;
      demoAppt.arrival_time = normalizedTime;
      return true;
    }

    // Real Supabase records
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('visitors')
          .update({
            visit_date: newDate,
            arrival_time: normalizedTime,
          })
          .eq('id', appointmentId);

        if (error) {
          console.error('Appointment reschedule failed:', error);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Appointment reschedule failed:', error);
        return false;
      }
    }

    // Local mock mode only
    try {
      const raw = localStorage.getItem('swl_visitors');
      if (!raw) return false;

      const list: Array<{
        id: string;
        visitor_id?: string;
        visit_date: string;
        arrival_time?: string;
      }> = JSON.parse(raw);

      const item = list.find(
        (visitor) =>
          visitor.id === appointmentId ||
          visitor.visitor_id === appointmentId
      );

      if (!item) return false;

      item.visit_date = newDate;
      item.arrival_time = normalizedTime;

      localStorage.setItem('swl_visitors', JSON.stringify(list));
      return true;
    } catch (error) {
      console.error('Local appointment reschedule failed:', error);
      return false;
    }
  },

  /**
   * Cancel an upcoming visit
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    if (!appointmentId) return false;

    const demoIndex = DEMO_VISITS.upcoming.findIndex((a) => a.id === appointmentId);
    if (demoIndex !== -1) {
      const [cancelled] = DEMO_VISITS.upcoming.splice(demoIndex, 1);
      cancelled.status = 'Cancelled';
      DEMO_VISITS.history.unshift(cancelled);
      return true;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('visitors')
          .update({ status: 'Cancelled' })
          .eq('id', appointmentId);
        if (!error) return true;
      } catch {
        // fallback to localStorage
      }
    }

    try {
      const raw = localStorage.getItem('swl_visitors');
      if (raw) {
        const list: Array<{ id: string; visitor_id?: string; status?: string }> = JSON.parse(raw);
        const item = list.find((v) => v.id === appointmentId || v.visitor_id === appointmentId);
        if (item) {
          item.status = 'Cancelled';
          localStorage.setItem('swl_visitors', JSON.stringify(list));
          return true;
        }
      }
    } catch {
      // ignore
    }

    return true;
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
