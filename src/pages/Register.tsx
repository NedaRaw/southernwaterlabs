import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, User, Calendar, Send, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getLocalizedCenters } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

interface FormData {
  visitor_name: string;
  company: string;
  job_title: string;
  phone: string;
  email: string;
  visit_date: string;
  laboratory: string;
  visit_purpose: string;
  notes: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [formData, setFormData] = useState<FormData>({
    visitor_name: '',
    company: '',
    job_title: '',
    phone: '',
    email: '',
    visit_date: '',
    laboratory: '',
    visit_purpose: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.visitor_name.trim()) e.visitor_name = t('register.required');
    if (!formData.phone.trim()) e.phone = t('register.required');
    else if (!/^[0-9+\s-]{8,}$/.test(formData.phone.trim())) e.phone = t('register.required');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = t('register.required');
    if (!formData.visit_date) e.visit_date = t('register.required');
    if (!formData.laboratory) e.laboratory = t('register.required');
    if (!formData.visit_purpose.trim()) e.visit_purpose = t('register.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      const { data, error } = await supabase
        .from('visitors')
        .insert({
          visitor_name: formData.visitor_name.trim(),
          company: formData.company.trim() || null,
          job_title: formData.job_title.trim() || null,
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          visit_date: formData.visit_date,
          laboratory: formData.laboratory,
          visit_purpose: formData.visit_purpose.trim(),
          notes: formData.notes.trim() || null,
        })
        .select()
        .single();
      if (error) throw error;
      if (data) navigate(`/success?id=${data.id}`);
    } catch (err) {
      setSubmitError(t('register.error'));
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const centers = getLocalizedCenters(lang);
  const labOptions = centers.flatMap((c) => [
    { value: c.name, label: c.name },
    ...c.branches.map((b) => ({ value: `${c.name} - ${b.name}`, label: `${c.name} - ${b.name}` })),
  ]);

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
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                <User className="w-5 h-5 text-navy-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{t('register.visitor')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t('register.name')} {req}</label>
                <input
                  type="text"
                  placeholder={t('register.name')}
                  value={formData.visitor_name}
                  onChange={(e) => handleChange('visitor_name', e.target.value)}
                  className={inputClass('visitor_name')}
                />
                {errors.visitor_name && <p className="text-red-500 text-xs mt-1">{errors.visitor_name}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('register.company')}</label>
                <input
                  type="text"
                  placeholder={t('register.company')}
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={inputClass('company')}
                />
              </div>
              <div>
                <label className={labelClass}>{t('register.jobTitle')}</label>
                <input
                  type="text"
                  placeholder={t('register.jobTitle')}
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  className={inputClass('job_title')}
                />
              </div>
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
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.email')}</label>
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
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-navy-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{t('register.visit')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              <div>
                <label className={labelClass}>{t('register.lab')} {req}</label>
                <select
                  value={formData.laboratory}
                  onChange={(e) => handleChange('laboratory', e.target.value)}
                  className={inputClass('laboratory')}
                >
                  <option value="">{t('register.selectLab')}</option>
                  {labOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.laboratory && <p className="text-red-500 text-xs mt-1">{errors.laboratory}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.purpose')} {req}</label>
                <input
                  type="text"
                  placeholder={t('register.purpose')}
                  value={formData.visit_purpose}
                  onChange={(e) => handleChange('visit_purpose', e.target.value)}
                  className={inputClass('visit_purpose')}
                />
                {errors.visit_purpose && <p className="text-red-500 text-xs mt-1">{errors.visit_purpose}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('register.notes')}</label>
                <textarea
                  rows={3}
                  placeholder={t('register.notes')}
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
