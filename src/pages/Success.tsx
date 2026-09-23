import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Home, Star, User, Calendar, Building2, Hash, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

interface VisitorData {
  id: string;
  visitor_name: string;
  visit_date: string;
  laboratory: string;
  visit_purpose: string;
  phone: string;
  company: string | null;
  job_title: string | null;
  email: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const visitorId = searchParams.get('id');
  const { t } = useLang();
  const [visitor, setVisitor] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visitorId) { setError(t('success.notFound')); setLoading(false); return; }
    const fetchVisitor = async () => {
      try {
        const { data, error } = await supabase.from('visitors').select('*').eq('id', visitorId).single();
        if (error || !data) { setError(t('success.notFound')); return; }
        setVisitor(data as VisitorData);
      } catch { setError(t('misc.error')); }
      finally { setLoading(false); }
    };
    fetchVisitor();
  }, [visitorId, t]);

  const generateVisitorBadge = () => {
    if (!visitor) return;
    const badgeContent = `
      <div style="width:350px;padding:30px;font-family:Tajawal,sans-serif;border:2px solid #1e3a5f;border-radius:12px;text-align:center;direction:rtl">
        <div style="background:#1e3a5f;color:white;padding:15px;border-radius:8px;margin-bottom:20px">
          <h2 style="margin:0;font-size:18px">${t('brand.name')}</h2>
          <p style="margin:5px 0 0;font-size:12px;opacity:0.8">${t('register.title')}</p>
        </div>
        <p style="font-size:20px;font-weight:bold;margin:0 0 15px">${visitor.visitor_name}</p>
        ${visitor.company ? `<p style="font-size:14px;color:#666;margin:0 0 5px">${visitor.company}</p>` : ''}
        ${visitor.job_title ? `<p style="font-size:14px;color:#666;margin:0 0 15px">${visitor.job_title}</p>` : ''}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:15px 0">
        <p style="font-size:14px;margin:5px 0"><strong>${t('visitor.date')}:</strong> ${visitor.visit_date}</p>
        <p style="font-size:14px;margin:5px 0"><strong>${t('visitor.lab')}:</strong> ${visitor.laboratory}</p>
        <p style="font-size:14px;margin:5px 0"><strong>${t('visitor.purpose')}:</strong> ${visitor.visit_purpose}</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:15px 0">
        <p style="font-size:12px;color:#94a3b8;margin:5px 0">${t('success.ref')}</p>
        <p style="font-size:16px;font-weight:bold;color:#1e3a5f;word-break:break-all">${visitor.id}</p>
      </div>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>${t('success.badge')}</title><link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet"></head><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0">${badgeContent}<script>window.onload=function(){window.print()}</script></body></html>`);
      printWindow.document.close();
    }
  };

  if (loading) return (
    <div className="pt-28 pb-20"><div className="max-w-2xl mx-auto px-4 flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 text-navy-600 animate-spin mb-4" /><p className="text-slate-500">{t('misc.loading')}</p></div></div>
  );

  if (error || !visitor) return (
    <div className="pt-28 pb-20"><div className="max-w-2xl mx-auto px-4 text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <p className="text-slate-600 mb-6">{error || t('success.notFound')}</p>
      <Link to="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors">{t('success.back')}</Link>
    </div></div>
  );

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('register.title'), to: '/register' }, { label: t('success.title') }]} />

        <div className="mt-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">{t('success.title')}</h1>
            <p className="text-slate-500">{t('success.desc')}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><User className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">{t('visitor.name')}</p><p className="text-sm font-bold text-slate-700">{visitor.visitor_name}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Calendar className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">{t('visitor.date')}</p><p className="text-sm font-bold text-slate-700">{visitor.visit_date}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Building2 className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">{t('visitor.lab')}</p><p className="text-sm font-bold text-slate-700">{visitor.laboratory}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Hash className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">{t('success.ref')}</p><p className="text-sm font-bold text-navy-700 break-all">{visitor.id}</p></div></div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={generateVisitorBadge} className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors flex-1"><Download className="w-4 h-4" />{t('success.badge')}</button>
            <Link to="/" className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:border-navy-300 hover:text-navy-600 transition-colors flex-1"><Home className="w-4 h-4" />{t('success.home')}</Link>
            <Link to="/survey" className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:border-navy-300 hover:text-navy-600 transition-colors flex-1"><Star className="w-4 h-4" />{t('success.rate')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
