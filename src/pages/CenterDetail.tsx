import { useParams, Link, Navigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Phone, Globe, ArrowLeft, Network, ChevronLeft, Info, UserPlus } from 'lucide-react';
import { getCenterById } from '@/data/laboratories';
import Breadcrumb from '@/components/Breadcrumb';
import InfoSection from '@/components/InfoSection';
import ContactCard from '@/components/ContactCard';

export default function CenterDetail() {
  const { centerId } = useParams<{ centerId: string }>();
  const center = centerId ? getCenterById(centerId) : undefined;
  if (!center) return <Navigate to="/laboratories" replace />;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'المراكز والفروع', to: '/laboratories' }, { label: center.name }]} />

        <div className={`mt-6 relative overflow-hidden rounded-xl ${center.type === 'regional_center' ? 'bg-slate-800' : 'bg-navy-800'} p-8 sm:p-12`}>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded bg-white/15 text-white text-xs font-bold">{center.type === 'regional_center' ? 'مركز إقليمي مستقل' : 'مختبر مركزي'}</span>
              <span className="px-3 py-1 rounded bg-white/15 text-white text-xs font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {center.region}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{center.name}</h1>
            </div>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{center.about}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center"><MapPin className="w-5 h-5 text-navy-600" /></div>
            <div><p className="text-xs text-slate-400">الموقع</p><p className="text-sm font-bold text-slate-700">{center.location}</p></div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center"><Clock className="w-5 h-5 text-navy-600" /></div>
            <div><p className="text-xs text-slate-400">ساعات العمل</p><p className="text-sm font-bold text-slate-700">{center.workingHours}</p></div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center"><Phone className="w-5 h-5 text-navy-600" /></div>
            <div><p className="text-xs text-slate-400">الهاتف</p><p className="text-sm font-bold text-slate-700" dir="ltr">{center.contact.phone}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center"><Info className="w-5 h-5 text-navy-600" /></div>
                <h2 className="text-xl font-bold text-slate-800">عن المركز</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{center.about}</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-100"><InfoSection title="القدرات المخبرية" items={center.capabilities} variant="capability" /></div>
            <div className="p-6 rounded-xl bg-white border border-slate-100"><InfoSection title="الخدمات" items={center.services} variant="service" /></div>
            <div className="p-6 rounded-xl bg-white border border-slate-100"><InfoSection title="التحاليل المتاحة" items={center.analyses} variant="analysis" /></div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center"><Phone className="w-5 h-5 text-navy-600" /></div>
                <h2 className="text-xl font-bold text-slate-800">معلومات التواصل</h2>
              </div>
              <ContactCard contact={center.contact} />
              <a href={center.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors">
                <Globe className="w-4 h-4" />
                عرض الموقع على الخريطة
              </a>
              <Link to="/register" className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-navy-700 font-bold text-sm border-2 border-navy-200 hover:bg-navy-50 transition-colors">
                <UserPlus className="w-4 h-4" />
                تسجيل زيارة
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center"><Network className="w-5 h-5 text-navy-600" /></div>
                <h2 className="text-xl font-bold text-slate-800">الفروع التابعة</h2>
              </div>
              {center.branches.length > 0 ? (
                <div className="space-y-3">
                  {center.branches.map((branch) => (
                    <Link key={branch.id} to={`/laboratories/${center.id}/${branch.id}`} className="group/branch flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-navy-300 hover:bg-navy-50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center"><Network className="w-5 h-5 text-navy-600" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-700 group-hover/branch:text-navy-700">{branch.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{branch.location}</p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-300 group-hover/branch:text-navy-500" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-3"><Building2 className="w-7 h-7 text-slate-400" /></div>
                  <p className="text-sm font-bold text-slate-600">لا توجد فروع حاليًا</p>
                  <p className="text-xs text-slate-400 mt-1">مركز إقليمي مستقل</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/laboratories" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-navy-300 hover:text-navy-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
            العودة إلى جميع المختبرات
          </Link>
        </div>
      </div>
    </div>
  );
}
