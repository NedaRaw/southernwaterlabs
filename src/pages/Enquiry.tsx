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
const MAIN_LAB_VALUE = '__main_lab__';
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
  const initialFormData: FormData = {
    laboratory: '',
    branch: '',
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    location: '',
    service_required: '',
    subject: '',
    message: '',
  };

  const [formData, setFormData] =
    useState<FormData>(initialFormData);


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedLab = LAB_HIERARCHY.find((l) => l.id === formData.laboratory);
  const availableBranches = selectedLab?.branches || [];



  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const requiredMessage = t('register.required');

    if (!formData.laboratory) {
      e.laboratory = requiredMessage;
    }

    if (!formData.branch) {
      e.branch = requiredMessage;
    }

    if (!formData.full_name.trim()) {
      e.full_name = requiredMessage;
    }

    if (!formData.company_name.trim()) {
      e.company_name = requiredMessage;
    }

    if (!formData.email.trim()) {
      e.email = requiredMessage;
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(formData.email.trim())
    ) {
      e.email =
        lang === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صحيح'
          : lang === 'fr'
            ? 'Veuillez saisir une adresse e-mail valide'
            : 'Please enter a valid email address';
    }

    const phone = formData.phone.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!phone) {
      e.phone = requiredMessage;
    } else if (
      !/^\+?[0-9\s()-]+$/.test(phone) ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15
    ) {
      e.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم هاتف صحيح من 8 إلى 15 رقمًا'
          : lang === 'fr'
            ? 'Veuillez saisir un numéro valide de 8 à 15 chiffres'
            : 'Please enter a valid phone number with 8 to 15 digits';
    }

    if (!formData.location.trim()) {
      e.location = requiredMessage;
    }

    if (!formData.service_required.trim()) {
      e.service_required = requiredMessage;
    }

    if (!formData.subject.trim()) {
      e.subject = requiredMessage;
    }

    if (!formData.message.trim()) {
      e.message = requiredMessage;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'laboratory' ? { branch: '' } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
      ...(field === 'laboratory' ? { branch: '' } : {}),
    }));
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
          branch:
            formData.branch === MAIN_LAB_VALUE
              ? null
              : formData.branch || null,
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
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
            >
              <span>{t('success.home')}</span>
            </Link>

            <button
              onClick={() => {
                setSubmitted(false);
                setFormData(initialFormData);
                setErrors({});
                setSubmitError('');
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap cursor-pointer"
            >
              <span>{t('enquiry.submit')}</span>
            </button>

          </div>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-lg bg-white border ${errors[field]
      ? 'border-red-400 bg-red-50/40'
      : 'border-slate-200'
    } text-slate-800 text-sm focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600 transition-all`;

  const labelClass =
    'block text-xs font-semibold text-slate-700 mb-1.5';

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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          dir={dir}
          noValidate
        >
          {/* Card 1: Target Laboratory & Branch */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('enquiry.lab')}</h2>
            </div>



            <div>
              <label className={labelClass}>
                {t('enquiry.lab')} {req}
              </label>
              <select
                value={formData.laboratory}
                onChange={(e) => handleChange('laboratory', e.target.value)}
                className={inputClass('laboratory')}
                required
              >
                <option value="">
                  {lang === 'ar'
                    ? 'اختر المختبر'
                    : lang === 'fr'
                      ? 'Choisir un laboratoire'
                      : 'Choose a laboratory'}
                </option>

                {LAB_HIERARCHY.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name[lang] || lab.name.en}
                  </option>
                ))}
              </select>

              {errors.laboratory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.laboratory}
                </p>
              )}
            </div>



            <div>
              <label className={labelClass}>
                {t('enquiry.branch')} {req}
              </label>

              <select
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
                className={inputClass('branch')}
                required
                disabled={!formData.laboratory}
              >
                <option value="">
                  {t('register.selectBranch')}
                </option>

                {selectedLab && (
                  <option value={MAIN_LAB_VALUE}>
                    {selectedLab.name[lang] || selectedLab.name.en}
                  </option>
                )}

                {availableBranches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name[lang] || br.name.en}
                  </option>
                ))}
              </select>

              {errors.branch && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.branch}
                </p>
              )}
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
                  required
                />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>


              <div>
                <label className={labelClass}>
                  {t('enquiry.company')} {req}
                </label>
                <input
                  type="text"
                  placeholder={t('register.companyPlaceholder')}
                  value={formData.company_name}
                  onChange={(e) =>
                    handleChange('company_name', e.target.value)
                  }
                  className={inputClass('company_name')}
                  required
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company_name}
                  </p>
                )}
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
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>


              <div>
                <label className={labelClass}>
                  {t('enquiry.phone')} {req}
                </label>
                <input
                  type="tel"
                  placeholder="+966 5x xxx xxxx"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange('phone', e.target.value)
                  }
                  className={inputClass('phone')}
                  dir="ltr"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>



              <div className="sm:col-span-2">
                <label className={labelClass}>
                  {t('enquiry.location')} {req}
                </label>
                <select
                  value={formData.location}
                  onChange={(e) =>
                    handleChange('location', e.target.value)
                  }
                  className={inputClass('location')}
                  required
                >
                  <option value="">
                    {lang === 'ar'
                      ? 'اختر الدولة'
                      : lang === 'fr'
                        ? 'Choisir le pays'
                        : 'Select country'}
                  </option>
                  {ENQUIRY_LOCATIONS.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc[lang] || loc.en}
                    </option>
                  ))}
                </select>
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location}
                  </p>
                )}
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
                <label className={labelClass}>
                  {t('enquiry.serviceRequired')} {req}
                </label>
                <select
                  value={formData.service_required}
                  onChange={(e) =>
                    handleChange('service_required', e.target.value)
                  }
                  className={inputClass('service_required')}
                  required
                >
                  <option value="">
                    {lang === 'ar'
                      ? 'اختر الخدمة المطلوبة'
                      : lang === 'fr'
                        ? 'Choisir le service demandé'
                        : 'Select the required service'}
                  </option>
                  {APPROVED_SERVICES.map((svc) => (
                    <option key={svc.value} value={svc.value}>
                      {svc[lang] || svc.en}
                    </option>
                  ))}
                </select>
                {errors.service_required && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.service_required}
                  </p>
                )}
              </div>



              <div>
                <label className={labelClass}>
                  {t('enquiry.subject')} {req}
                </label>
                <input
                  type="text"
                  placeholder={
                    lang === 'ar'
                      ? 'عنوان الموضوع أو التحليل المطلوب'
                      : lang === 'fr'
                        ? 'Objet de votre demande ou analyse'
                        : 'Subject of your request'
                  }
                  value={formData.subject}
                  onChange={(e) =>
                    handleChange('subject', e.target.value)
                  }
                  className={inputClass('subject')}
                  required
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subject}
                  </p>
                )}
              </div>


              <div>
                <label className={labelClass}>{t('enquiry.message')} {req}</label>
                <textarea
                  rows={5}
                  placeholder={lang === 'ar' ? 'اكتب تفاصيل طلبك أو استفسارك هنا...' : lang === 'fr' ? 'Rédigez les détails de votre demande ou message ici...' : 'Write your detailed message here...'}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`${inputClass('message')} resize-none`}
                  required
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span>{t('enquiry.submitting')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 shrink-0" />
                <span>{t('enquiry.submit')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
