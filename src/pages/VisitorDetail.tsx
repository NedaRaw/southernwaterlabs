import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, Calendar, Building2, Phone, Mail, FileText,
  Hash, AlertCircle, Loader2, Download, Home, Printer
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
  company: string | null;
  job_title: string | null;
  phone: string;
  email: string | null;
  visit_date: string;
  arrival_time?: string;
  laboratory?: string;
  branch?: string | null;
  department?: string;
  employee?: string;
  purpose?: string;
  visit_purpose?: string;
  notes: string | null;
  qr_url?: string;
  status: string;
  created_at: string;
}

export default function VisitorDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang, t, dir } = useLang();
  const [visitor, setVisitor] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(t('success.notFound'));
      setLoading(false);
      return;
    }
    const fetchVisitor = async () => {
      try {
        let query = supabase.from('visitors').select('*');
        if (id.startsWith('LAB-')) {
          query = query.eq('visitor_id', id);
        } else {
          query = query.or(`visitor_id.eq.${id},id.eq.${id}`);
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
  }, [id, t]);

  const handlePrint = () => {
    window.print();
  };

  const displayName = visitor
    ? visitor.first_name && visitor.last_name
      ? `${visitor.first_name} ${visitor.last_name}`
      : visitor.visitor_name || visitor.first_name || 'Visitor'
    : '';

  const displayRefId = visitor?.visitor_id || visitor?.id || id || '';

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

  const getStatusLabel = (status: string) => {
    if (status === 'pending' || status === 'Pending') return t('status.pending');
    if (status === 'checked_in' || status === 'Approved') return t('status.checked_in');
    if (status === 'checked_out') return t('status.checked_out');
    return status;
  };

  return (
    <div className="pt-28 pb-20" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('visitor.title') }]} />

        <div className="mt-6">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <h1 className="text-xl font-bold text-slate-800">{t('visitor.title')}</h1>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{displayRefId}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  visitor.status === 'pending' || visitor.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : visitor.status === 'checked_in' || visitor.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {getStatusLabel(visitor.status)}
              </span>
            </div>

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
                <FileText className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('visitor.purpose')}</p>
                  <p className="text-sm font-bold text-slate-700">{displayPurpose}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                <Phone className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('contact.phone')}</p>
                  <p className="text-sm font-bold text-slate-700" dir="ltr">{visitor.phone}</p>
                </div>
              </div>

              {visitor.email && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                  <Mail className="w-5 h-5 text-navy-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('contact.email')}</p>
                    <p className="text-sm font-bold text-slate-700" dir="ltr">{visitor.email}</p>
                  </div>
                </div>
              )}

              {visitor.company && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                  <Building2 className="w-5 h-5 text-navy-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('register.company')}</p>
                    <p className="text-sm font-bold text-slate-700">{visitor.company}</p>
                  </div>
                </div>
              )}

              {visitor.job_title && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                  <User className="w-5 h-5 text-navy-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('register.jobTitle')}</p>
                    <p className="text-sm font-bold text-slate-700">{visitor.job_title}</p>
                  </div>
                </div>
              )}

              {visitor.employee && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 sm:col-span-2">
                  <User className="w-5 h-5 text-navy-600 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">{t('register.employee')}</p>
                    <p className="text-sm font-bold text-slate-700">{visitor.employee}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 sm:col-span-2">
                <Hash className="w-5 h-5 text-navy-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">{t('success.ref')}</p>
                  <p className="text-sm font-bold text-navy-700 font-mono break-all">{displayRefId}</p>
                </div>
              </div>
            </div>

            {visitor.notes && (
              <div className="mt-5 p-4 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-400 mb-1">{t('register.notes')}</p>
                <p className="text-sm text-slate-600">{visitor.notes}</p>
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
                    <p className="font-medium text-slate-200">{visitor.company}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-navy-300">{t('visitor.date')}</p>
                    <p className="font-medium text-slate-200">{visitor.visit_date}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
