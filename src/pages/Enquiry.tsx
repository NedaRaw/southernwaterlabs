import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, AlertCircle, Loader2, CheckCircle2,
  Building2, Mail, MessageSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import {
  LAB_HIERARCHY, APPROVED_SERVICES, ENQUIRY_LOCATIONS
} from '@/data/labServices';

interface FormData {
  laboratory: string;
  branch: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  location: string;
  service_required: string;
  subject: string;
  message: string;
}

export default function Enquiry() {
  const { lang, t, dir } = useLang();

  const [formData, setFormData] = useState<FormData>({
    laboratory: 'asir',
    branch: '',
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    location: 'Saudi Arabia',
    service_required: 'Drinking Water Analysis',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedLab = LAB_HIERARCHY.find((l) => l.id === formData.laboratory);
  const availableBranches = selectedLab?.branches || [];

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.laboratory) e.laboratory = t('register.required');
    if (!formData.full_name.trim()) e.full_name = t('register.required');
    if (!formData.email.trim()) e.email = t('register.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = t('register.required');
    if (!formData.message.trim()) e.message = t('register.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'laboratory') {
        next.branch = '';
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
      // Real Supabase insertion into public.enquiries
      const { error } = await supabase.from('enquiries').insert([
        {
          laboratory: formData.laboratory,
          branch: formData.branch || null,
          full_name: formData.full_name.trim(),
          company_name: formData.company_name.trim() || null,
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          location: formData.location || null,
          service_required: formData.service_required || null,
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
          status: 'new',
        },
      ]).select();

      if (error) {
        console.error('Enquiry insert error:', error);
        throw error;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Enquiry submission failed:', err);
      setSubmitError(t('enquiry.errorMsg'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{t('enquiry.successMsg')}</h1>
          <p className="text-slate-500 mb-6">{t('enquiry.successDesc')}</p>
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors shadow-sm"
            >
              {t('success.home')}
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  laboratory: 'asir',
                  branch: '',
                  full_name: '',
                  company_name: '',
                  email: '',
                  phone: '',
                  location: 'Saudi Arabia',
                  service_required: 'Drinking Water Analysis',
                  subject: '',
                  message: '',
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              {t('enquiry.submit')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-lg bg-white border ${
      errors[field] ? 'border-red-400 bg-red-50/40' : 'border-slate-200'
    } text-slate-800 text-sm focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600 transition-all`;
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('enquiry.title') }]} />

        <div className="mt-4 mb-8 text-start max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-1.5">{t('enquiry.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('enquiry.desc')}</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" dir={dir}>
          {/* Card 1: Target Laboratory & Branch */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('enquiry.lab')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t('enquiry.lab')} {req}</label>
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

              <div>
                <label className={labelClass}>{t('enquiry.branch')}</label>
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
            </div>
          </div>

          {/* Card 2: Contact Information */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('enquiry.contact')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t('enquiry.fullName')} {req}</label>
                <input
                  type="text"
                  placeholder={t('enquiry.fullName')}
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className={inputClass('full_name')}
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className={labelClass}>{t('enquiry.company')}</label>
                <input
                  type="text"
                  placeholder={t('register.companyPlaceholder')}
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className={inputClass('company_name')}
                />
              </div>

              <div>
                <label className={labelClass}>{t('enquiry.email')} {req}</label>
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

              <div>
                <label className={labelClass}>{t('enquiry.phone')}</label>
                <input
                  type="tel"
                  placeholder="+966 5x xxx xxxx"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass('phone')}
                  dir="ltr"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>{t('enquiry.location')}</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={inputClass('location')}
                >
                  {ENQUIRY_LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc[lang] || loc.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Request & Message */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('enquiry.message')}</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t('enquiry.serviceRequired')}</label>
                <select
                  value={formData.service_required}
                  onChange={(e) => handleChange('service_required', e.target.value)}
                  className={inputClass('service_required')}
                >
                  {APPROVED_SERVICES.map((svc) => (
                    <option key={svc.value} value={svc.value}>
                      {svc[lang] || svc.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t('enquiry.subject')}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'عنوان الموضوع أو التحليل المطلوب' : 'Subject of your request'}
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className={inputClass('subject')}
                />
              </div>

              <div>
                <label className={labelClass}>{t('enquiry.message')} {req}</label>
                <textarea
                  rows={5}
                  placeholder={lang === 'ar' ? 'اكتب تفاصيل طلبك أو استفسارك هنا...' : 'Write your detailed message here...'}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`${inputClass('message')} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-navy-800 text-white font-semibold text-sm hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('enquiry.submitting')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('enquiry.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
