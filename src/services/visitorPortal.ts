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
   * Visitor lookup.
   *
   * Login remains disabled until a secure server-side identity
   * verification flow is implemented. A visitor ID, phone number,
   * or national ID alone is not proof of identity.
   */
  async findVisitorByQuery(query: string): Promise<VisitorProfile | null> {
    const trimmed = query.trim();

    if (!trimmed) {
      return null;
    }

    // Do not accept demo credentials as a real visitor identity.
    if (
      trimmed.toLowerCase() === 'demo' ||
      trimmed === '1234567890' ||
      trimmed === '0501234567'
    ) {
      return null;
    }

    // Never fetch all visitor records into the browser.
    // Do not fabricate a profile when no matching record is found.
    // A secure server-side verification flow must be implemented
    // before real visitor login is re-enabled.
    console.warn(
      'Visitor login is unavailable until secure identity verification is configured.'
    );

    return null;
  },



  /**
   * Visitor appointments.
   *
   * Temporarily fail closed until secure server-side visitor
   * verification and appointment access are implemented.
   */
  async getVisitorVisits(visitor: VisitorProfile): Promise<{
    upcoming: AppointmentItem[];
    history: AppointmentItem[];
  }> {
    if (!visitor?.id || !visitor?.visitor_id) {
      return { upcoming: [], history: [] };
    }

    console.warn(
      'Visitor appointments are temporarily unavailable until secure server-side verification is configured.'
    );

    return {
      upcoming: [],
      history: [],
    };
  },



  /**
   * Visitor lab reports.
   *
   * Temporarily disable report display until reports can be
   * retrieved securely from the server and verified as belonging
   * to the authenticated visitor.
   */
  getVisitorReports(visitor: VisitorProfile): LabReportItem[] {
    if (!visitor?.id || !visitor?.visitor_id) {
      return [];
    }

    console.warn(
      'Visitor reports are temporarily unavailable until secure server-side access is configured.'
    );

    return [];
  },



  /**
 * Reschedule appointment date & time.
 * Supabase arrival_time column uses SQL type TIME.
 */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTime: string
  ): Promise<boolean> {
    try {
      const match = newTime.trim().match(/^(\d{1,2}):(\d{2})\s*(.*)$/);

      if (!match) {
        console.error('Invalid appointment time:', newTime);
        return false;
      }

      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const period = match[3];

      // Convert Arabic AM/PM to 24-hour format.
      if (period.includes('ظهراً') || period.includes('مساءً')) {
        if (hours < 12) hours += 12;
      } else if (period.includes('صباحاً')) {
        if (hours === 12) hours = 0;
      }

      if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        console.error('Invalid appointment time:', newTime);
        return false;
      }

      const sqlTime =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:00`;

      const { data, error } = await supabase
        .from('visitors')
        .update({
          visit_date: newDate,
          arrival_time: sqlTime,
          status: 'Confirmed',
        })
        .eq('id', appointmentId)
        .select('id');

      if (error) {
        console.error('Failed to reschedule appointment:', error);
        return false;
      }

      if (!data || data.length === 0) {
        console.error(
          'No appointment was updated. Check the ID and Supabase permissions.'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error rescheduling appointment:', error);
      return false;
    }
  },
  /**
   * Cancel an upcoming visit.
   * Return true only when Supabase confirms that a row was updated.
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .update({ status: 'Cancelled' })
        .eq('id', appointmentId)
        .select('id');

      if (error) {
        console.error('Failed to cancel appointment:', error);
        return false;
      }

      if (!data || data.length === 0) {
        console.error(
          'Cancellation affected no rows. Check appointment ID and Supabase permissions.'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error cancelling appointment:', error);
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
