import { useState } from 'react';
import { Star, Send, AlertCircle, Loader2, CheckCircle2, Droplets } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

interface FormData {
  respondent_name: string;
  respondent_contact: string;
  service_quality_rating: number;
  facility_rating: number;
  staff_rating: number;
  overall_rating: number;
  comments: string;
  would_recommend: boolean | null;
}

export default function Survey() {
  const { t } = useLang();
  const [formData, setFormData] = useState<FormData>({
    respondent_name: '', respondent_contact: '',
    service_quality_rating: 0, facility_rating: 0, staff_rating: 0, overall_rating: 0,
    comments: '', would_recommend: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (formData.service_quality_rating === 0) e.service_quality_rating = t('survey.rating');
    if (formData.facility_rating === 0) e.facility_rating = t('survey.rating');
    if (formData.staff_rating === 0) e.staff_rating = t('survey.rating');
    if (formData.overall_rating === 0) e.overall_rating = t('survey.rating');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('surveys').insert({
        respondent_name: formData.respondent_name.trim() || null,
        respondent_contact: formData.respondent_contact.trim() || null,
        service_quality_rating: formData.service_quality_rating,
        facility_rating: formData.facility_rating,
        staff_rating: formData.staff_rating,
        overall_rating: formData.overall_rating,
        comments: formData.comments.trim() || null,
        would_recommend: formData.would_recommend,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      setSubmitError(t('survey.error'));
      console.error('Survey error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) => (
    <div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)} className={`transition-transform hover:scale-110 ${n <= value ? 'text-amber-400' : 'text-slate-300'} ${error ? 'ring-2 ring-red-200 rounded' : ''}`}>
            <Star className="w-7 h-7" fill={n <= value ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  if (submitted) return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center py-20">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{t('survey.success')}</h1>
        <p className="text-slate-500 mb-6">{t('survey.successDesc')}</p>
        <a href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors">{t('success.home')}</a>
      </div>
    </div>
  );

  const ratingFields = [
    { key: 'service_quality_rating' as const, label: t('survey.quality') },
    { key: 'facility_rating' as const, label: t('survey.facility') },
    { key: 'staff_rating' as const, label: t('survey.staff') },
    { key: 'overall_rating' as const, label: t('survey.overall') },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('survey.title') }]} />

        <div className="mt-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />{t('survey.title')}
          </div>
          <h1 className="section-title mb-2">{t('survey.title')}</h1>
          <p className="section-subtitle">{t('survey.desc')}</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />{submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">{t('survey.name')}</label>
                <input type="text" value={formData.respondent_name} onChange={e => setFormData(prev => ({ ...prev, respondent_name: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">{t('survey.contact')}</label>
                <input type="text" value={formData.respondent_contact} onChange={e => setFormData(prev => ({ ...prev, respondent_contact: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all" />
              </div>
            </div>

            <div className="space-y-5">
              {ratingFields.map(field => (
                <div key={field.key} className="p-4 rounded-lg bg-slate-50">
                  <label className="block text-sm font-bold text-slate-600 mb-2">{field.label} <span className="text-red-500">*</span></label>
                  <StarRating value={formData[field.key]} onChange={v => { setFormData(prev => ({ ...prev, [field.key]: v })); setErrors(prev => { const n = { ...prev }; delete n[field.key]; return n; }); }} error={errors[field.key]} />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('survey.recommend')}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, would_recommend: true }))} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${formData.would_recommend === true ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-slate-50 text-slate-500 border-2 border-slate-200'}`}>{t('survey.yes')}</button>
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, would_recommend: false }))} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${formData.would_recommend === false ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-slate-50 text-slate-500 border-2 border-slate-200'}`}>{t('survey.no')}</button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-600 mb-2">{t('survey.comments')}</label>
              <textarea rows={4} value={formData.comments} onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all resize-none" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />{t('survey.submitting')}</> : <><Send className="w-5 h-5" />{t('survey.submit')}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
