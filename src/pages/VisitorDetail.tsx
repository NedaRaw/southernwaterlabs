import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, Building2, Phone, Mail, FileText, Hash, AlertCircle, Loader2, Download, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Breadcrumb from '@/components/Breadcrumb';

interface VisitorData {
  id: string;
  visitor_name: string;
  company: string | null;
  job_title: string | null;
  phone: string;
  email: string | null;
  visit_date: string;
  laboratory: string;
  visit_purpose: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function VisitorDetail() {
  const { id } = useParams<{ id: string }>();
  const [visitor, setVisitor] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setError('لم يتم العثور على الزائر'); setLoading(false); return; }
    const fetchVisitor = async () => {
      try {
        const { data, error } = await supabase.from('visitors').select('*').eq('id', id).single();
        if (error || !data) { setError('لم يتم العثور على بيانات الزائر'); return; }
        setVisitor(data as VisitorData);
      } catch { setError('حدث خطأ في جلب البيانات'); }
      finally { setLoading(false); }
    };
    fetchVisitor();
  }, [id]);

  const generateBadge = () => {
    if (!visitor) return;
    const badgeContent = `
      <div style="width:350px;padding:30px;font-family:Tajawal,sans-serif;border:2px solid #1e3a5f;border-radius:12px;text-align:center;direction:rtl">
        <div style="background:#1e3a5f;color:white;padding:15px;border-radius:8px;margin-bottom:20px">
          <h2 style="margin:0;font-size:18px">مختبرات المياه</h2>
          <p style="margin:5px 0 0;font-size:12px;opacity:0.8">بطاقة الزائر</p>
        </div>
        <p style="font-size:20px;font-weight:bold;margin:0 0 15px">${visitor.visitor_name}</p>
        ${visitor.company ? `<p style="font-size:14px;color:#666;margin:0 0 5px">${visitor.company}</p>` : ''}
        ${visitor.job_title ? `<p style="font-size:14px;color:#666;margin:0 0 15px">${visitor.job_title}</p>` : ''}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:15px 0">
        <p style="font-size:14px;margin:5px 0"><strong>التاريخ:</strong> ${visitor.visit_date}</p>
        <p style="font-size:14px;margin:5px 0"><strong>المختبر:</strong> ${visitor.laboratory}</p>
        <p style="font-size:14px;margin:5px 0"><strong>الغرض:</strong> ${visitor.visit_purpose}</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:15px 0">
        <p style="font-size:12px;color:#94a3b8;margin:5px 0">رقم المرجع</p>
        <p style="font-size:16px;font-weight:bold;color:#1e3a5f;word-break:break-all">${visitor.id}</p>
      </div>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>بطاقة الزائر</title><link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet"></head><body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0">${badgeContent}<script>window.onload=function(){window.print()}</script></body></html>`);
      printWindow.document.close();
    }
  };

  if (loading) return (
    <div className="pt-28 pb-20"><div className="max-w-2xl mx-auto px-4 flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 text-navy-600 animate-spin mb-4" /><p className="text-slate-500">جاري تحميل البيانات...</p></div></div>
  );

  if (error || !visitor) return (
    <div className="pt-28 pb-20"><div className="max-w-2xl mx-auto px-4 text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <p className="text-slate-600 mb-6">{error || 'لم يتم العثور على بيانات الزائر'}</p>
      <Link to="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors">العودة للتسجيل</Link>
    </div></div>
  );

  const statusLabels: Record<string, string> = { pending: 'في الانتظار', checked_in: 'تم الدخول', checked_out: 'تم المغادرة' };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'بيانات الزائر' }]} />

        <div className="mt-6">
          <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-slate-800">بيانات الزائر</h1>
              <span className={`px-3 py-1 rounded text-xs font-bold ${visitor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : visitor.status === 'checked_in' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{statusLabels[visitor.status] || visitor.status}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><User className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">الاسم</p><p className="text-sm font-bold text-slate-700">{visitor.visitor_name}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Calendar className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">تاريخ الزيارة</p><p className="text-sm font-bold text-slate-700">{visitor.visit_date}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Building2 className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">المختبر</p><p className="text-sm font-bold text-slate-700">{visitor.laboratory}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><FileText className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">الغرض</p><p className="text-sm font-bold text-slate-700">{visitor.visit_purpose}</p></div></div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Phone className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">الهاتف</p><p className="text-sm font-bold text-slate-700" dir="ltr">{visitor.phone}</p></div></div>
              {visitor.email && <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Mail className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">البريد</p><p className="text-sm font-bold text-slate-700" dir="ltr">{visitor.email}</p></div></div>}
              {visitor.company && <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Building2 className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">الجهة</p><p className="text-sm font-bold text-slate-700">{visitor.company}</p></div></div>}
              {visitor.job_title && <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><User className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">المسمى</p><p className="text-sm font-bold text-slate-700">{visitor.job_title}</p></div></div>}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"><Hash className="w-5 h-5 text-navy-600" /><div><p className="text-xs text-slate-400">رقم المرجع</p><p className="text-sm font-bold text-navy-700 break-all">{visitor.id}</p></div></div>
            </div>

            {visitor.notes && <div className="mt-5 p-4 rounded-lg bg-slate-50"><p className="text-xs text-slate-400 mb-1">ملاحظات</p><p className="text-sm text-slate-600">{visitor.notes}</p></div>}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={generateBadge} className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors flex-1">
              <Download className="w-4 h-4" />تحميل بطاقة الزائر
            </button>
            <Link to="/" className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-600 font-bold text-sm border border-slate-200 hover:border-navy-300 hover:text-navy-600 transition-colors flex-1">
              <ArrowRight className="w-4 h-4" />العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
