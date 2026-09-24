import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, AlertCircle, Loader2, CheckCircle2, Droplets } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

interface FormData {
  name: string;
  contact_info: string;
  subject: string;
  message: string;
}

export default function Enquiry() {
  const { t } = useLang();
  const [formData, setFormData] = useState<FormData>({ name: '', contact_info: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = t('register.required');
    if (!formData.contact_info.trim()) e.contact_info = t('register.required');
    if (!formData.subject.trim()) e.subject = t('register.required');
    if (!formData.message.trim()) e.message = t('register.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('enquiries').insert({
        name: formData.name.trim(),
        contact_info: formData.contact_info.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setSubmitError(t('enquiry.error'));
      console.error('Enquiry error:', err);
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
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{t('enquiry.success')}</h1>
          <p className="text-slate-500 mb-6">{t('enquiry.successDesc')}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors shadow-sm"
          >
            {t('success.home')}
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg bg-slate-50 border ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-slate-200'
    } text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all`;
  const labelClass = 'block text-sm font-bold text-slate-600 mb-2';
  const req = <span className="text-red-500">*</span>;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('enquiry.title') }]} />

        <div className="mt-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />
            {t('enquiry.title')}
          </div>
          <h1 className="section-title mb-2">{t('enquiry.title')}</h1>
          <p className="section-subtitle">{t('enquiry.desc')}</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t('enquiry.name')} {req}</label>
                <input
                  type="text"
                  placeholder={t('enquiry.name')}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.name;
                      return n;
                    });
                  }}
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('enquiry.contact')} {req}</label>
                <input
                  type="text"
                  placeholder={t('enquiry.contact')}
                  value={formData.contact_info}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, contact_info: e.target.value }));
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.contact_info;
                      return n;
                    });
                  }}
                  className={inputClass('contact_info')}
                />
                {errors.contact_info && <p className="text-red-500 text-xs mt-1">{errors.contact_info}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('enquiry.subject')} {req}</label>
                <input
                  type="text"
                  placeholder={t('enquiry.subject')}
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, subject: e.target.value }));
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.subject;
                      return n;
                    });
                  }}
                  className={inputClass('subject')}
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className={labelClass}>{t('enquiry.message')} {req}</label>
                <textarea
                  rows={5}
                  placeholder={t('enquiry.message')}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, message: e.target.value }));
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.message;
                      return n;
                    });
                  }}
                  className={`${inputClass('message')} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
                {t('enquiry.submitting')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('enquiry.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
