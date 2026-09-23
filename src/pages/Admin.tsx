import { useState, useEffect, useCallback } from 'react';
import {
  Lock, Loader2, AlertCircle, LayoutDashboard, Users, FileText, MessageSquare,
  UserCog, LogOut, Search, Trash2, Plus, Edit, Eye, Download,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { laboratoryCenters } from '@/data/laboratories';

interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

interface Visitor {
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

interface Survey {
  id: string;
  respondent_name: string | null;
  respondent_contact: string | null;
  service_quality_rating: number;
  facility_rating: number;
  staff_rating: number;
  overall_rating: number;
  comments: string | null;
  would_recommend: boolean | null;
  created_at: string;
}

interface Enquiry {
  id: string;
  name: string;
  contact_info: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

type Tab = 'dashboard' | 'visitors' | 'surveys' | 'enquiries' | 'users';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({ username: '', password: '', full_name: '', role: 'user' });
  const [userError, setUserError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_user');
    if (stored) {
      try {
        const user = JSON.parse(stored) as AdminUser;
        setAdminUser(user);
        setLoggedIn(true);
      } catch { sessionStorage.removeItem('admin_user'); }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username || !loginForm.password) { setLoginError('يرجى إدخال اسم المستخدم وكلمة المرور'); return; }
    setLoggingIn(true);
    try {
      const { data, error } = await supabase.rpc('verify_admin_credentials', {
        p_username: loginForm.username,
        p_password: loginForm.password,
      });
      if (error) throw error;
      if (!data || data.length === 0 || !data[0].id) { setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة'); return; }
      const user: AdminUser = { id: data[0].id, username: data[0].username, full_name: data[0].full_name, role: data[0].role };
      sessionStorage.setItem('admin_user', JSON.stringify(user));
      setAdminUser(user);
      setLoggedIn(true);
      setLoginForm({ username: '', password: '' });
    } catch (err) {
      setLoginError('حدث خطأ أثناء تسجيل الدخول');
      console.error('Login error:', err);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_user');
    setAdminUser(null);
    setLoggedIn(false);
    setActiveTab('dashboard');
  };

  const fetchData = useCallback(async () => {
    if (!loggedIn) return;
    setLoading(true);
    try {
      const [visitorsRes, surveysRes, enquiriesRes, usersRes] = await Promise.all([
        supabase.from('visitors').select('*').order('created_at', { ascending: false }),
        supabase.from('surveys').select('*').order('created_at', { ascending: false }),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
        supabase.rpc('get_all_admin_users'),
      ]);
      if (visitorsRes.data) setVisitors(visitorsRes.data as Visitor[]);
      if (surveysRes.data) setSurveys(surveysRes.data as Survey[]);
      if (enquiriesRes.data) setEnquiries(enquiriesRes.data as Enquiry[]);
      if (usersRes.data) setAdminUsers(usersRes.data as AdminUser[]);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  }, [loggedIn]);

  useEffect(() => { if (loggedIn) fetchData(); }, [loggedIn, fetchData]);

  const handleDeleteVisitor = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الزائر؟')) return;
    await supabase.from('visitors').delete().eq('id', id);
    fetchData();
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاستبيان؟')) return;
    await supabase.from('surveys').delete().eq('id', id);
    fetchData();
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاستفسار؟')) return;
    await supabase.from('enquiries').delete().eq('id', id);
    fetchData();
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    fetchData();
  };

  const handleUpdateVisitorStatus = async (id: string, status: string) => {
    await supabase.from('visitors').update({ status }).eq('id', id);
    fetchData();
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    if (!userForm.username || !userForm.full_name) { setUserError('يرجى ملء جميع الحقول المطلوبة'); return; }
    if (!editingUser && !userForm.password) { setUserError('كلمة المرور مطلوبة للمستخدم الجديد'); return; }
    try {
      if (editingUser) {
        const { error } = await supabase.rpc('update_admin_user', {
          p_id: editingUser.id, p_username: userForm.username, p_password: userForm.password || null,
          p_full_name: userForm.full_name, p_role: userForm.role,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('create_admin_user', {
          p_username: userForm.username, p_password: userForm.password,
          p_full_name: userForm.full_name, p_role: userForm.role,
        });
        if (error) throw error;
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ username: '', password: '', full_name: '', role: 'user' });
      fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'حدث خطأ';
      setUserError(msg.includes('duplicate') || msg.includes('unique') ? 'اسم المستخدم موجود بالفعل' : 'حدث خطأ أثناء الحفظ');
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({ username: user.username, password: '', full_name: user.full_name, role: user.role });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (adminUser?.id === id) { alert('لا يمكنك حذف حسابك الحالي'); return; }
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    await supabase.rpc('delete_admin_user', { p_id: id });
    fetchData();
  };

  const filteredVisitors = visitors.filter(v =>
    v.visitor_name.includes(searchTerm) || v.laboratory.includes(searchTerm) || v.phone.includes(searchTerm)
  );
  const filteredEnquiries = enquiries.filter(e =>
    e.name.includes(searchTerm) || e.subject.includes(searchTerm)
  );

  const statusLabels: Record<string, string> = { pending: 'في الانتظار', checked_in: 'تم الدخول', checked_out: 'تم المغادرة', new: 'جديد', responded: 'تم الرد', closed: 'مغلق' };

  const exportCSV = (data: Record<string, unknown>[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (!loggedIn) return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-navy-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">لوحة التحكم</h1>
          <p className="text-slate-500 text-sm">تسجيل الدخول للمسؤولين</p>
        </div>
        <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 space-y-4">
          {loginError && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{loginError}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">اسم المستخدم</label>
            <input type="text" value={loginForm.username} onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all" placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">كلمة المرور</label>
            <input type="password" value={loginForm.password} onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-navy-500 focus:bg-white transition-all" placeholder="••••••" />
          </div>
          <button type="submit" disabled={loggingIn} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors disabled:opacity-60">
            {loggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'visitors', label: 'الزوار', icon: Users },
    { id: 'surveys', label: 'الاستبيانات', icon: FileText },
    { id: 'enquiries', label: 'الاستفسارات', icon: MessageSquare },
    { id: 'users', label: 'المستخدمون', icon: UserCog },
  ];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">لوحة التحكم</h1>
            <p className="text-sm text-slate-500 mt-1">مرحباً، {adminUser?.full_name}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-red-300 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />تسجيل الخروج
          </button>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-navy-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-navy-600 animate-spin" /></div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'إجمالي الزوار', value: visitors.length, icon: Users, color: 'navy' },
                  { label: 'الاستبيانات', value: surveys.length, icon: FileText, color: 'blue' },
                  { label: 'الاستفسارات', value: enquiries.length, icon: MessageSquare, color: 'teal' },
                  { label: 'المستخدمون', value: adminUsers.length, icon: UserCog, color: 'slate' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="p-6 rounded-xl bg-white border border-slate-200">
                      <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-navy-700" /></div>
                      <p className="text-3xl font-extrabold text-slate-800">{stat.value}</p>
                      <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'visitors' && (
              <div>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث..." className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:border-navy-500" />
                  </div>
                  <button onClick={() => exportCSV(visitors as unknown as Record<string, unknown>[], 'visitors.csv')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">
                    <Download className="w-4 h-4" />تصدير
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 text-slate-500 text-xs">
                      <th className="px-4 py-3 text-right font-bold">الاسم</th><th className="px-4 py-3 text-right font-bold">الهاتف</th><th className="px-4 py-3 text-right font-bold">المختبر</th><th className="px-4 py-3 text-right font-bold">التاريخ</th><th className="px-4 py-3 text-right font-bold">الحالة</th><th className="px-4 py-3 text-right font-bold">إجراءات</th>
                    </tr></thead>
                    <tbody>
                      {filteredVisitors.map(v => (
                        <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3"><p className="font-bold text-slate-700">{v.visitor_name}</p>{v.company && <p className="text-xs text-slate-400">{v.company}</p>}</td>
                          <td className="px-4 py-3 text-slate-600" dir="ltr">{v.phone}</td>
                          <td className="px-4 py-3 text-slate-600">{v.laboratory}</td>
                          <td className="px-4 py-3 text-slate-600">{v.visit_date}</td>
                          <td className="px-4 py-3">
                            <select value={v.status} onChange={e => handleUpdateVisitorStatus(v.id, e.target.value)} className="text-xs font-bold px-2 py-1 rounded border border-slate-200 bg-white">
                              <option value="pending">في الانتظار</option><option value="checked_in">تم الدخول</option><option value="checked_out">تم المغادرة</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <a href={`/visitor/${v.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-100 hover:bg-navy-100 text-slate-600 hover:text-navy-700"><Eye className="w-4 h-4" /></a>
                              <button onClick={() => handleDeleteVisitor(v.id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredVisitors.length === 0 && <p className="text-center text-slate-400 py-8">لا توجد بيانات</p>}
                </div>
              </div>
            )}

            {activeTab === 'surveys' && (
              <div className="space-y-4">
                {surveys.map(s => (
                  <div key={s.id} className="p-5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-700">{s.respondent_name || 'مجهول'}</p>
                        <p className="text-xs text-slate-400">{new Date(s.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <button onClick={() => handleDeleteSurvey(s.id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {[{ label: 'جودة الخدمة', val: s.service_quality_rating }, { label: 'المرافق', val: s.facility_rating }, { label: 'الموظفين', val: s.staff_rating }, { label: 'العام', val: s.overall_rating }].map((r, i) => (
                        <div key={i} className="p-3 rounded-lg bg-slate-50 text-center">
                          <p className="text-xs text-slate-400">{r.label}</p>
                          <p className="text-lg font-bold text-navy-700">{r.val}/5</p>
                        </div>
                      ))}
                    </div>
                    {s.would_recommend !== null && <p className="text-sm text-slate-500 mb-2">يوصي بالزيارة: {s.would_recommend ? 'نعم' : 'لا'}</p>}
                    {s.comments && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{s.comments}</p>}
                  </div>
                ))}
                {surveys.length === 0 && <p className="text-center text-slate-400 py-8">لا توجد استبيانات</p>}
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث..." className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm focus:outline-none focus:border-navy-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredEnquiries.map(en => (
                    <div key={en.id} className="p-5 rounded-xl bg-white border border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-slate-700">{en.name}</p>
                          <p className="text-xs text-slate-400">{en.contact_info} - {new Date(en.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={en.status} onChange={e => handleUpdateEnquiryStatus(en.id, e.target.value)} className="text-xs font-bold px-2 py-1 rounded border border-slate-200 bg-white">
                            <option value="new">جديد</option><option value="responded">تم الرد</option><option value="closed">مغلق</option>
                          </select>
                          <button onClick={() => handleDeleteEnquiry(en.id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="font-bold text-slate-700 text-sm mb-1">{en.subject}</p>
                      <p className="text-sm text-slate-600">{en.message}</p>
                    </div>
                  ))}
                  {filteredEnquiries.length === 0 && <p className="text-center text-slate-400 py-8">لا توجد استفسارات</p>}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">{adminUsers.length} مستخدم</p>
                  <button onClick={() => { setEditingUser(null); setUserForm({ username: '', password: '', full_name: '', role: 'user' }); setShowUserModal(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700">
                    <Plus className="w-4 h-4" />إضافة مستخدم
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 text-slate-500 text-xs">
                      <th className="px-4 py-3 text-right font-bold">الاسم</th><th className="px-4 py-3 text-right font-bold">اسم المستخدم</th><th className="px-4 py-3 text-right font-bold">الدور</th><th className="px-4 py-3 text-right font-bold">إجراءات</th>
                    </tr></thead>
                    <tbody>
                      {adminUsers.map(u => (
                        <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold text-slate-700">{u.full_name}</td>
                          <td className="px-4 py-3 text-slate-600">{u.username}</td>
                          <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-600'}`}>{u.role === 'admin' ? 'مدير' : 'مستخدم'}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditUser(u)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-navy-100 text-slate-600 hover:text-navy-700"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {adminUsers.length === 0 && <p className="text-center text-slate-400 py-8">لا يوجد مستخدمون</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUserModal(false)}>
          <div className="max-w-md w-full bg-white rounded-xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
            {userError && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{userError}</div>}
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div><label className="block text-sm font-bold text-slate-600 mb-2">الاسم الكامل</label><input type="text" value={userForm.full_name} onChange={e => setUserForm(prev => ({ ...prev, full_name: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-navy-500" /></div>
              <div><label className="block text-sm font-bold text-slate-600 mb-2">اسم المستخدم</label><input type="text" value={userForm.username} onChange={e => setUserForm(prev => ({ ...prev, username: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-navy-500" /></div>
              <div><label className="block text-sm font-bold text-slate-600 mb-2">كلمة المرور {editingUser && '(اتركها فارغة للإبقاء عليها)'}</label><input type="password" value={userForm.password} onChange={e => setUserForm(prev => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-navy-500" /></div>
              <div><label className="block text-sm font-bold text-slate-600 mb-2">الدور</label><select value={userForm.role} onChange={e => setUserForm(prev => ({ ...prev, role: e.target.value }))} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-navy-500"><option value="user">مستخدم</option><option value="admin">مدير</option></select></div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700">{editingUser ? 'حفظ' : 'إضافة'}</button>
                <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
