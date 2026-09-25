import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets, User, Calendar, Send, AlertCircle, Loader2,
  Building2, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { LAB_HIERARCHY } from '@/data/labServices';
import { getNextVisitorId, buildVisitorQrUrl } from '@/lib/visitorId';

interface FormData {
  first_name: string;
  last_name: string;
  national_id: string;
  company: string;
  job_title: string;
  phone: string;
  email: string;
  laboratory: string;
  branch: string;
  department: string;
  employee: string;
  purpose: string;
  visit_date: string;
  arrival_time: string;
  notes: string;
}

function formatPostgresTime(rawTime: string): string {
  if (!rawTime) return '09:00:00';
  // Normalize Arabic-Indic digits to ASCII digits
  const normalized = rawTime
    .trim()
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  // If already in HH:MM:SS format
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(normalized)) {
    const parts = normalized.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1]}:${parts[2]}`;
  }

  // If in HH:MM format
  if (/^\d{1,2}:\d{2}$/.test(normalized)) {
    const parts = normalized.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1]}:00`;
  }

  // If in 12h format like 9:30 AM / 09:30 PM
  const ampm = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = ampm[2];
    const s = ampm[3] || '00';
    const isPM = ampm[4].toUpperCase() === 'PM';
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}:${s}`;
  }

  return normalized;
}

export default function Register() {
  const navigate = useNavigate();
  const { lang, t, dir } = useLang();

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    national_id: '',
    company: '',
    job_title: '',
    phone: '',
    email: '',
    laboratory: 'asir',
    branch: '',
    department: 'Quality Control',
    employee: '',
    purpose: 'Business Meeting',
    visit_date: '',
    arrival_time: '09:00',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedLab = LAB_HIERARCHY.find((l) => l.id === formData.laboratory);
  const availableBranches = selectedLab?.branches || [];

  const purposeOptions = [
    { value: 'Business Meeting', label: t('purpose.meeting') },
    { value: 'Equipment Service / Maintenance', label: t('purpose.maintenance') },
    { value: 'Sample Delivery', label: t('purpose.samples') },
    { value: 'Audit / Inspection', label: t('purpose.audit') },
    { value: 'Training', label: t('purpose.training') },
    { value: 'Job Interview', label: t('purpose.interview') },
    { value: 'Vendor Presentation', label: t('purpose.vendor') },
    { value: 'Research Collaboration', label: t('purpose.research') },
    { value: 'Other', label: t('purpose.other') },
  ];

  const departmentOptions = [
    { value: 'Quality Control', label: lang === 'ar' ? 'مراقبة الجودة' : lang === 'fr' ? 'Contrôle Qualité' : 'Quality Control' },
    { value: 'Chemical Analysis', label: lang === 'ar' ? 'التحاليل الكيميائية' : lang === 'fr' ? 'Analyses Chimiques' : 'Chemical Analysis' },
    { value: 'Microbiology', label: lang === 'ar' ? 'الأحياء الدقيقة (الميكروبيولوجي)' : lang === 'fr' ? 'Microbiologie' : 'Microbiology' },
    { value: 'Sample Reception', label: lang === 'ar' ? 'استقبال وتسجيل العينات' : lang === 'fr' ? 'Réception des Échantillons' : 'Sample Reception' },
    { value: 'Calibration', label: lang === 'ar' ? 'المعايرة والأجهزة' : lang === 'fr' ? 'Étalonnage et Métrologie' : 'Calibration' },
    { value: 'Administration', label: lang === 'ar' ? 'الشؤون الإدارية والفنية' : lang === 'fr' ? 'Administration' : 'Administration' },
  ];

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.first_name.trim()) e.first_name = t('register.required');
    if (!formData.last_name.trim()) e.last_name = t('register.required');
    if (!formData.national_id.trim()) e.national_id = t('register.required');
    if (!formData.phone.trim()) e.phone = t('register.required');
    else if (!/^[0-9+\s-]{8,}$/.test(formData.phone.trim())) e.phone = t('register.required');
    if (!formData.email.trim()) e.email = t('register.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = t('register.required');
    if (!formData.laboratory) e.laboratory = t('register.required');
    if (!formData.employee.trim()) e.employee = t('register.required');
    if (!formData.purpose.trim()) e.purpose = t('register.required');
    if (!formData.visit_date) e.visit_date = t('register.required');
    if (!formData.arrival_time) e.arrival_time = t('register.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'laboratory') {
        next.branch = ''; // reset branch when lab changes
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      // 1. Generate real sequential visitor_id (LAB-YYYY-XXXXXX)
      const visitor_id = await getNextVisitorId();
      // 2. Generate real verification QR URL
      const qr_url = buildVisitorQrUrl(visitor_id);
      // 3. Format arrival time with strictly valid PostgreSQL time format
      const arrival_time = formatPostgresTime(formData.arrival_time);

      // 4. Real Supabase insertion into public.visitors
      const recordToInsert = {
        visitor_id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        national_id: formData.national_id.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        job_title: formData.job_title.trim() || null,
        laboratory: formData.laboratory,
        branch: formData.branch || null,
        department: formData.department || 'Quality Control',
        employee: formData.employee.trim(),
        purpose: formData.purpose,
        visit_date: formData.visit_date,
        arrival_time,
        notes: formData.notes.trim() || null,
        qr_url,
        status: 'Pending',
        timestamp: new Date().toISOString(),
      };

      // Execute insert with automatic retry if schema cache or transient error occurs
      let insertResult = await supabase
        .from('visitors')
        .insert([recordToInsert])
        .select('id, visitor_id')
        .single();

      // If PostgREST schema cache was momentarily stale/reloading, retry up to 2 additional times with backoff
      if (
        insertResult.error &&
        (insertResult.error.code === 'PGRST204' ||
          insertResult.error.message?.includes('schema cache'))
      ) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          console.warn(`PostgREST schema cache refreshing (attempt ${attempt}), retrying insert in ${attempt * 1000}ms...`, insertResult.error);
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          insertResult = await supabase
            .from('visitors')
            .insert([recordToInsert])
            .select('id, visitor_id')
            .single();

          if (!insertResult.error) {
            break;
          }
        }
      }

      const { data, error } = insertResult;

      if (error) {
        console.error('Supabase visitor insert error:', error);
        throw error;
      }

      if (data && (data.id || data.visitor_id)) {
        // Direct navigation to success only after confirmed insertion
        navigate(`/success?id=${encodeURIComponent(data.visitor_id || data.id)}`);
      } else {
        throw new Error('No record returned from Supabase insert');
      }
    } catch (err: unknown) {
      const errMsg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : '';
      console.error('Visitor registration failed:', err);
      setSubmitError(t('register.error') + (errMsg ? ` (${errMsg})` : ''));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg bg-slate-50 border ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    } text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all`;
  const labelClass = 'block text-sm font-bold text-slate-600 mb-2';
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('register.title') }]} />

        <div className="mt-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />
            {t('register.title')}
          </div>
          <h1 className="section-title mb-2">{t('register.title')}</h1>
          <p className="section-subtitle">{t('register.desc')}</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" dir={dir}>
          {/* Card 1: Personal & Professional Information */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                <User className="w-5 h-5 text-navy-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{t('register.visitor')}</h2>
                <p className="text-xs text-slate-400">{t('register.namePlaceholder')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className={labelClass}>{t('register.firstName')} {req}</label>
                <input
                  type="text"
                  placeholder={t('register.firstName')}
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={inputClass('first_name')}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className={labelClass}>{t('register.lastName')} {req}</label>
                <input
                  type="text"
                  placeholder={t('register.lastName')}
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={inputClass('last_name')}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>

              {/* National ID / Passport */}
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.nationalId')} {req}</label>
                <input
                  type="text"
                  placeholder={t('register.nationalId')}
                  value={formData.national_id}
                  onChange={(e) => handleChange('national_id', e.target.value)}
                  className={inputClass('national_id')}
                />
                {errors.national_id && <p className="text-red-500 text-xs mt-1">{errors.national_id}</p>}
              </div>

              {/* Mobile Phone */}
              <div>
                <label className={labelClass}>{t('register.phone')} {req}</label>
                <input
                  type="tel"
                  placeholder="+966 5x xxx xxxx"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass('phone')}
                  dir="ltr"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className={labelClass}>{t('register.email')} {req}</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={inputClass('email')}
                  dir="ltr"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Organization / Company */}
              <div>
                <label className={labelClass}>{t('register.company')}</label>
                <input
                  type="text"
                  placeholder={t('register.companyPlaceholder')}
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={inputClass('company')}
                />
              </div>

              {/* Job Title */}
              <div>
                <label className={labelClass}>{t('register.jobTitle')}</label>
                <input
                  type="text"
                  placeholder={t('register.jobTitlePlaceholder')}
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  className={inputClass('job_title')}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Laboratory & Department Information */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-navy-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{t('register.lab')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Laboratory Selection */}
              <div>
                <label className={labelClass}>{t('register.lab')} {req}</label>
                <select
                  value={formData.laboratory}
                  onChange={(e) => handleChange('laboratory', e.target.value)}
                  className={inputClass('laboratory')}
                >
                  {LAB_HIERARCHY.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name[lang] || lab.name.en}
                    </option>
                  ))}
                </select>
                {errors.laboratory && <p className="text-red-500 text-xs mt-1">{errors.laboratory}</p>}
              </div>

              {/* Branch Selection */}
              <div>
                <label className={labelClass}>{t('register.branch')}</label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className={inputClass('branch')}
                >
                  <option value="">{t('register.selectBranch')}</option>
                  {availableBranches.map((br) => (
                    <option key={br.id} value={br.id}>
                      {br.name[lang] || br.name.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className={labelClass}>{t('register.department')} {req}</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className={inputClass('department')}
                >
                  {departmentOptions.map((dep) => (
                    <option key={dep.value} value={dep.value}>
                      {dep.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee to Visit */}
              <div>
                <label className={labelClass}>{t('register.employee')} {req}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'اسم الموظف أو رئيس القسم' : 'Staff or department head'}
                  value={formData.employee}
                  onChange={(e) => handleChange('employee', e.target.value)}
                  className={inputClass('employee')}
                />
                {errors.employee && <p className="text-red-500 text-xs mt-1">{errors.employee}</p>}
              </div>
            </div>
          </div>

          {/* Card 3: Visit Specifications */}
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-navy-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{t('register.visit')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Purpose */}
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.purpose')} {req}</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className={inputClass('purpose')}
                >
                  {purposeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
              </div>

              {/* Visit Date */}
              <div>
                <label className={labelClass}>{t('register.date')} {req}</label>
                <input
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) => handleChange('visit_date', e.target.value)}
                  className={inputClass('visit_date')}
                />
                {errors.visit_date && <p className="text-red-500 text-xs mt-1">{errors.visit_date}</p>}
              </div>

              {/* Expected Arrival Time */}
              <div>
                <label className={labelClass}>{t('register.arrivalTime')} {req}</label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.arrival_time}
                    onChange={(e) => handleChange('arrival_time', e.target.value)}
                    className={inputClass('arrival_time')}
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.arrival_time && <p className="text-red-500 text-xs mt-1">{errors.arrival_time}</p>}
              </div>

              {/* Additional Notes */}
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.notes')}</label>
                <textarea
                  rows={3}
                  placeholder={t('register.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className={`${inputClass('notes')} resize-none`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('register.submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('register.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
