import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Send, AlertCircle, Loader2, CheckCircle2,
  Building2, MessageSquare, ThumbsUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { LAB_HIERARCHY, APPROVED_SERVICES } from '@/data/labServices';

interface FormData {
  laboratory: string;
  branch: string;
  service_used: string;
  how_heard: string;
  overall_satisfaction: string;
  staff_professionalism: number;
  service_speed: number;
  sample_submission: number;
  report_clarity: number;
  communication: number;
  laboratory_cleanliness: number;
  overall_experience: number;
  results_on_time: string;
  reports_understandable: string;
  recommendation_score: number;
  liked_most: string;
  improvements: string;
  contact_me: string;
  additional_comments: string;
}

export default function Survey() {
  const { lang, t, dir } = useLang();

  const [formData, setFormData] = useState<FormData>({
    laboratory: 'asir',
    branch: '',
    service_used: 'Drinking Water Analysis',
    how_heard: 'Website',
    overall_satisfaction: 'Very Satisfied',
    staff_professionalism: 5,
    service_speed: 5,
    sample_submission: 5,
    report_clarity: 5,
    communication: 5,
    laboratory_cleanliness: 5,
    overall_experience: 5,
    results_on_time: 'Yes',
    reports_understandable: 'Yes',
    recommendation_score: 10,
    liked_most: '',
    improvements: '',
    contact_me: 'No',
    additional_comments: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedLab = LAB_HIERARCHY.find((l) => l.id === formData.laboratory);
  const availableBranches = selectedLab?.branches || [];

  const awarenessOptions = [
    { value: 'Website', label: t('survey.source.website') },
    { value: 'Social Media', label: t('survey.source.social') },
    { value: 'Government Agency', label: t('survey.source.gov') },
    { value: 'Company', label: t('survey.source.company') },
    { value: 'Friend / Colleagues', label: t('survey.source.friend') },
    { value: 'Other', label: t('survey.source.other') },
  ];

  const satisfactionOptions = [
    { value: 'Very Satisfied', label: t('survey.sat.verySatisfied') },
    { value: 'Satisfied', label: t('survey.sat.satisfied') },
    { value: 'Neutral', label: t('survey.sat.neutral') },
    { value: 'Dissatisfied', label: t('survey.sat.dissatisfied') },
    { value: 'Very Dissatisfied', label: t('survey.sat.veryDissatisfied') },
  ];

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.laboratory) e.laboratory = t('register.required');
    if (!formData.service_used) e.service_used = t('register.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
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
      // Real Supabase INSERT ONLY into public.surveys (No SELECT by public)
      const { error } = await supabase.from('surveys').insert([
        {
          laboratory: formData.laboratory,
          branch: formData.branch || null,
          service_used: formData.service_used,
          how_heard: formData.how_heard || null,
          overall_satisfaction: formData.overall_satisfaction || null,
          staff_professionalism: Number(formData.staff_professionalism) || 5,
          service_speed: Number(formData.service_speed) || 5,
          sample_submission: Number(formData.sample_submission) || 5,
          report_clarity: Number(formData.report_clarity) || 5,
          communication: Number(formData.communication) || 5,
          laboratory_cleanliness: Number(formData.laboratory_cleanliness) || 5,
          overall_experience: Number(formData.overall_experience) || 5,
          results_on_time: formData.results_on_time || null,
          reports_understandable: formData.reports_understandable || null,
          recommendation_score: Number(formData.recommendation_score) || 10,
          liked_most: formData.liked_most.trim() || null,
          improvements: formData.improvements.trim() || null,
          contact_me: formData.contact_me || null,
          additional_comments: formData.additional_comments.trim() || null,
        },
      ]);

      if (error) {
        console.error('Survey submission error:', error);
        throw error;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      console.error('Survey submit failed:', err);
      setSubmitError(t('survey.errorMsg'));
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 hover:scale-110 transition-transform focus:outline-none"
            aria-label={`${n} of 5`}
          >
            <Star
              className={`w-5 h-5 ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
            />
          </button>
        ))}
        <span className="text-xs font-semibold text-navy-800 ms-2 w-7 text-center">{value}/5</span>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">{t('survey.successMsg')}</h1>
          <p className="text-slate-500 mb-6">{t('survey.successDesc')}</p>
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
                  service_used: 'Drinking Water Analysis',
                  how_heard: 'Website',
                  overall_satisfaction: 'Very Satisfied',
                  staff_professionalism: 5,
                  service_speed: 5,
                  sample_submission: 5,
                  report_clarity: 5,
                  communication: 5,
                  laboratory_cleanliness: 5,
                  overall_experience: 5,
                  results_on_time: 'Yes',
                  reports_understandable: 'Yes',
                  recommendation_score: 10,
                  liked_most: '',
                  improvements: '',
                  contact_me: 'No',
                  additional_comments: '',
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              {t('survey.submit')}
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
        <Breadcrumb items={[{ label: t('survey.title') }]} />

        <div className="mt-4 mb-8 text-start max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-1.5">{t('survey.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('survey.desc')}</p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" dir={dir}>
          {/* Card 1: Laboratory & Service Context */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('survey.lab')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t('survey.lab')} {req}</label>
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
                <label className={labelClass}>{t('survey.branch')}</label>
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

              <div className="sm:col-span-2">
                <label className={labelClass}>{t('survey.serviceUsed')} {req}</label>
                <select
                  value={formData.service_used}
                  onChange={(e) => handleChange('service_used', e.target.value)}
                  className={inputClass('service_used')}
                >
                  {APPROVED_SERVICES.map((svc) => (
                    <option key={svc.value} value={svc.value}>
                      {svc[lang] || svc.en}
                    </option>
                  ))}
                </select>
                {errors.service_used && <p className="text-red-500 text-xs mt-1">{errors.service_used}</p>}
              </div>

              <div>
                <label className={labelClass}>{t('survey.howHeard')}</label>
                <select
                  value={formData.how_heard}
                  onChange={(e) => handleChange('how_heard', e.target.value)}
                  className={inputClass('how_heard')}
                >
                  {awarenessOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>{t('survey.overallSat')}</label>
                <select
                  value={formData.overall_satisfaction}
                  onChange={(e) => handleChange('overall_satisfaction', e.target.value)}
                  className={inputClass('overall_satisfaction')}
                >
                  {satisfactionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: 1 to 5 Rating Matrix */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-navy-700" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">{t('survey.ratingsTitle')}</h2>
                <p className="text-xs text-slate-400">1 = {t('survey.sat.veryDissatisfied')} | 5 = {t('survey.sat.verySatisfied')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <StarRating
                label={t('survey.staffProf')}
                value={formData.staff_professionalism}
                onChange={(v) => handleChange('staff_professionalism', v)}
              />
              <StarRating
                label={t('survey.serviceSpeed')}
                value={formData.service_speed}
                onChange={(v) => handleChange('service_speed', v)}
              />
              <StarRating
                label={t('survey.sampleSubmission')}
                value={formData.sample_submission}
                onChange={(v) => handleChange('sample_submission', v)}
              />
              <StarRating
                label={t('survey.reportClarity')}
                value={formData.report_clarity}
                onChange={(v) => handleChange('report_clarity', v)}
              />
              <StarRating
                label={t('survey.comm')}
                value={formData.communication}
                onChange={(v) => handleChange('communication', v)}
              />
              <StarRating
                label={t('survey.cleanliness')}
                value={formData.laboratory_cleanliness}
                onChange={(v) => handleChange('laboratory_cleanliness', v)}
              />
              <StarRating
                label={t('survey.overallExp')}
                value={formData.overall_experience}
                onChange={(v) => handleChange('overall_experience', v)}
              />
            </div>
          </div>

          {/* Card 3: Additional Timeliness & Reports Questions */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <ThumbsUp className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('survey.resultsOnTime')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t('survey.resultsOnTime')}</label>
                <div className="flex gap-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  {['Yes', 'Partially', 'No'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="results_on_time"
                        value={val}
                        checked={formData.results_on_time === val}
                        onChange={(e) => handleChange('results_on_time', e.target.value)}
                        className="text-navy-600 focus:ring-navy-500"
                      />
                      <span>
                        {val === 'Yes'
                          ? t('survey.yesPartialNo.yes')
                          : val === 'Partially'
                          ? t('survey.yesPartialNo.partial')
                          : t('survey.yesPartialNo.no')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('survey.reportsEasy')}</label>
                <div className="flex gap-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  {['Yes', 'Somewhat', 'No'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="reports_understandable"
                        value={val}
                        checked={formData.reports_understandable === val}
                        onChange={(e) => handleChange('reports_understandable', e.target.value)}
                        className="text-navy-600 focus:ring-navy-500"
                      />
                      <span>
                        {val === 'Yes'
                          ? t('survey.yesSomeNo.yes')
                          : val === 'Somewhat'
                          ? t('survey.yesSomeNo.somewhat')
                          : t('survey.yesSomeNo.no')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Score Slider (0 to 10) */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  {t('survey.recommendTitle')}
                </label>
                <span className="px-2.5 py-0.5 bg-navy-50 text-navy-800 text-xs font-bold rounded-full">
                  {formData.recommendation_score} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.recommendation_score}
                onChange={(e) => handleChange('recommendation_score', parseInt(e.target.value, 10))}
                className="w-full accent-navy-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{lang === 'ar' ? '0 (غير محتمل)' : '0 (Not likely)'}</span>
                <span>5</span>
                <span>{lang === 'ar' ? '10 (محتمل جداً)' : '10 (Very likely)'}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Qualitative Feedback & Comments */}
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-navy-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-800">{t('survey.comments')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('survey.likedMost')}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'أكثر ما أعجبك في الخدمة أو تعامل الفريق...' : 'What you liked most...'}
                  value={formData.liked_most}
                  onChange={(e) => handleChange('liked_most', e.target.value)}
                  className={inputClass('liked_most')}
                />
              </div>

              <div>
                <label className={labelClass}>{t('survey.improvements')}</label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'أي جانب ترى أنه بحاجة إلى تحسين...' : 'Suggestions for improvement...'}
                  value={formData.improvements}
                  onChange={(e) => handleChange('improvements', e.target.value)}
                  className={inputClass('improvements')}
                />
              </div>

              <div>
                <label className={labelClass}>{t('survey.contactMe')}</label>
                <div className="flex gap-4 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="contact_me"
                      value="Yes"
                      checked={formData.contact_me === 'Yes'}
                      onChange={(e) => handleChange('contact_me', e.target.value)}
                      className="text-navy-600 focus:ring-navy-500"
                    />
                    <span>{t('survey.yes')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="contact_me"
                      value="No"
                      checked={formData.contact_me === 'No'}
                      onChange={(e) => handleChange('contact_me', e.target.value)}
                      className="text-navy-600 focus:ring-navy-500"
                    />
                    <span>{t('survey.no')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('survey.additionalComments')}</label>
                <textarea
                  rows={3}
                  placeholder={lang === 'ar' ? 'أي ملاحظات أو رسائل أخرى تود مشاركتها...' : 'Additional feedback or notes...'}
                  value={formData.additional_comments}
                  onChange={(e) => handleChange('additional_comments', e.target.value)}
                  className={`${inputClass('additional_comments')} resize-none`}
                />
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
                <span>{t('survey.submitting')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 shrink-0" />
                <span>{t('survey.submit')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
