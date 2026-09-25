import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2, Download, Home, Star, User, Calendar,
  Building2, Hash, AlertCircle, Loader2, Printer, ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { getLabLabel, getBranchLabel } from '@/data/labServices';

interface VisitorData {
  id: string;
  visitor_id?: string;
  first_name?: string;
  last_name?: string;
  visitor_name?: string;
  visit_date: string;
  arrival_time?: string;
  laboratory?: string;
  branch?: string | null;
  department?: string;
  employee?: string;
  purpose?: string;
  visit_purpose?: string;
  phone: string;
  company?: string | null;
  job_title?: string | null;
  email?: string | null;
  notes?: string | null;
  qr_url?: string;
  status: string;
  created_at: string;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const rawId = searchParams.get('id');
  const { lang, t, dir } = useLang();
  const [visitor, setVisitor] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (!rawId) {
      setError(t('success.notFound'));
      setLoading(false);
      return;
    }
    const fetchVisitor = async () => {
      try {
        // Query by visitor_id first, then by uuid id
        let query = supabase.from('visitors').select('*');
        if (rawId.startsWith('LAB-')) {
          query = query.eq('visitor_id', rawId);
        } else {
          query = query.or(`visitor_id.eq.${rawId},id.eq.${rawId}`);
        }

        const { data, error: queryError } = await query.single();
        if (queryError || !data) {
          setError(t('success.notFound'));
          return;
        }
        setVisitor(data as VisitorData);
      } catch {
        setError(t('misc.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchVisitor();
  }, [rawId, t]);

  const handlePrint = () => {
    window.print();
  };

  const displayName = visitor
    ? visitor.first_name && visitor.last_name
      ? `${visitor.first_name} ${visitor.last_name}`
      : visitor.visitor_name || visitor.first_name || 'Visitor'
    : '';

  const displayRefId = visitor?.visitor_id || visitor?.id || rawId || '';

  const displayLab = visitor?.laboratory
    ? getLabLabel(visitor.laboratory, lang) +
      (visitor.branch ? ` - ${getBranchLabel(visitor.laboratory, visitor.branch, lang)}` : '')
    : visitor?.department || 'Southern Sector Water Laboratories';

  const displayPurpose = visitor?.purpose || visitor?.visit_purpose || '';

  if (loading) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-navy-600 animate-spin mb-4" />
          <p className="text-slate-500">{t('misc.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-6">{error || t('success.notFound')}</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors shadow-sm"
          >
            {t('success.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('register.title'), to: '/register' }, { label: t('success.title') }]} />

        <div className="mt-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-fade-in shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">{t('success.title')}</h1>
            <p className="text-slate-500 max-w-lg mx-auto">{t('success.desc')}</p>
          </div>

          {/* Reference badge highlight */}
          <div className="mb-6 p-4 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-navy-700" />
              <div>
                <p className="text-xs font-semibold text-navy-600">{t('success.ref')}</p>
                <p className="text-base font-extrabold text-navy-900 tracking-wider font-mono">{displayRefId}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
              {visitor.status || 'Pending'}
            </span>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <User className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('visitor.name')}</p>
                  <p className="text-sm font-bold text-slate-700">{displayName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <Calendar className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('visitor.date')}</p>
                  <p className="text-sm font-bold text-slate-700">
                    {visitor.visit_date} {visitor.arrival_time ? `(${visitor.arrival_time})` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <Building2 className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('visitor.lab')}</p>
                  <p className="text-sm font-bold text-slate-700">{displayLab}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <Hash className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('register.purpose')}</p>
                  <p className="text-sm font-bold text-slate-700">{displayPurpose || '-'}</p>
                </div>
              </div>
            </div>

            {visitor.employee && (
              <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{t('register.employee')}:</span>
                <span className="font-bold text-slate-800">{visitor.employee}</span>
              </div>
            )}
          </div>

          {/* Printable Visitor Badge Card */}
          {showBadge && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-xl border border-navy-700 animate-fade-in print:block">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h3 className="font-extrabold text-base">{t('brand.name')}</h3>
                  <p className="text-xs text-navy-200">{t('success.badge')}</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-navy-300">{t('visitor.name')}</p>
                  <p className="text-lg font-bold text-white">{displayName}</p>
                </div>

                {visitor.company && (
                  <div>
                    <p className="text-xs text-navy-300">{t('register.company')}</p>
                    <p className="font-medium text-slate-200">
                      {visitor.company} {visitor.job_title ? `(${visitor.job_title})` : ''}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-navy-300">{t('visitor.date')}</p>
                    <p className="font-medium text-slate-200">
                      {visitor.visit_date} {visitor.arrival_time ? `- ${visitor.arrival_time}` : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-300">{t('visitor.lab')}</p>
                    <p className="font-medium text-slate-200">{displayLab}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-navy-300">{t('visitor.purpose')}</p>
                  <p className="font-medium text-slate-200">{displayPurpose}</p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-navy-300">{t('success.ref')}</p>
                  <p className="text-xs font-mono text-navy-200 break-all">{displayRefId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowBadge(!showBadge)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors flex-1 shadow-sm"
            >
              <Download className="w-4 h-4" />
              {t('success.badge')}
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:border-navy-300 hover:text-navy-600 transition-colors flex-1"
            >
              <Home className="w-4 h-4" />
              {t('success.home')}
            </Link>
            <Link
              to="/survey"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:border-navy-300 hover:text-navy-600 transition-colors flex-1"
            >
              <Star className="w-4 h-4" />
              {t('success.rate')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
