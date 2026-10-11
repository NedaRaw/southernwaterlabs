import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Building2,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Phone,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  LogIn,
  LogOut,
  CalendarDays,
  History,
  FileCheck2,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Edit3,
  Trash2,
  Check,
  Copy,
  Loader2,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import nwcLogo from '@/assets/images/nwc-logo.png';
import {
  visitorPortalService,
  VisitorProfile,
  AppointmentItem,
  LabReportItem,
} from '@/services/visitorPortal';
import { getLabLabel, getBranchLabel } from '@/data/labServices';

export default function VisitorDashboard() {
  const { lang, t, dir } = useLang();
  const [searchParams] = useSearchParams();
  const { id: routeVisitorId } = useParams<{ id: string }>();

  // Active visitor state
  const [currentVisitor, setCurrentVisitor] = useState<VisitorProfile | null>(null);
  const [loginQuery, setLoginQuery] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard data
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'reports'>('upcoming');
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentItem[]>([]);
  const [visitHistory, setVisitHistory] = useState<AppointmentItem[]>([]);
  const [labReports, setLabReports] = useState<LabReportItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Modals state
  const [badgeModalAppt, setBadgeModalAppt] = useState<AppointmentItem | null>(null);
  const [rescheduleModalAppt, setRescheduleModalAppt] = useState<AppointmentItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LabReportItem | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Filter for history
  const [historyLabFilter, setHistoryLabFilter] = useState<string>('all');
  const [reportsSearch, setReportsSearch] = useState<string>('');

  const Arrow = dir === 'rtl' ? ChevronLeft : ChevronRight;
  // Translate visitor purpose according to the selected website language
  const getLocalizedPurpose = (
    purpose: string | null | undefined
  ): string => {
    const purposeTranslations: Record<string, { ar: string; en: string; fr: string }> = {
      'Business Meeting': {
        ar: 'اجتماع عمل رسمي',
        en: 'Business Meeting',
        fr: 'Réunion de travail',
      },
      'Equipment Service / Maintenance': {
        ar: 'صيانة ومعايرة الأجهزة',
        en: 'Equipment Service / Maintenance',
        fr: 'Maintenance et entretien',
      },
      'Sample Delivery': {
        ar: 'تسليم واستلام عينات مياه',
        en: 'Sample Delivery',
        fr: "Dépôt d'échantillons",
      },
      'Audit / Inspection': {
        ar: 'تدقيق وتفتيش بيئي / جودة',
        en: 'Audit / Inspection',
        fr: 'Audit et inspection',
      },
      Training: {
        ar: 'تدريب وتأهيل فني',
        en: 'Training',
        fr: 'Formation technique',
      },
      'Job Interview': {
        ar: 'مقابلة توظيف',
        en: 'Job Interview',
        fr: "Entretien d'embauche",
      },
      'Vendor Presentation': {
        ar: 'عرض شركات وموردين',
        en: 'Vendor Presentation',
        fr: 'Présentation fournisseur',
      },
      'Research Collaboration': {
        ar: 'تعاون بحثي وأكاديمي',
        en: 'Research Collaboration',
        fr: 'Collaboration de recherche',
      },
      Other: {
        ar: 'أخرى (حدد في الملاحظات)',
        en: 'Other',
        fr: 'Autre',
      },
    };

    if (!purpose) return '—';

    const translation = purposeTranslations[purpose];

    if (!translation) return purpose;

    return translation[lang] || translation.en;
  };
  // Load visits and reports for active visitor
  const loadVisitorData = useCallback(async (visitor: VisitorProfile) => {
    setDataLoading(true);
    try {
      const { upcoming, history } = await visitorPortalService.getVisitorVisits(visitor);
      setUpcomingAppointments(upcoming);
      setVisitHistory(history);

      const reports = visitorPortalService.getVisitorReports(visitor);
      setLabReports(reports);
    } catch (err) {
      console.error('Error loading visitor dashboard data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Check URL params or saved session on mount
  useEffect(() => {
    const queryId =
      routeVisitorId ||
      searchParams.get('id') ||
      searchParams.get('visitor_id');
    const init = async () => {
      if (queryId) {
        setLoginLoading(true);
        const found = await visitorPortalService.findVisitorByQuery(queryId);
        setLoginLoading(false);
        if (found) {
          setCurrentVisitor(found);
          loadVisitorData(found);
          return;
        }
      }

      // Check stored session
      const stored = visitorPortalService.getStoredSession();
      if (stored) {
        setCurrentVisitor(stored);
        loadVisitorData(stored);
      }
    };
    init();
  }, [searchParams, loadVisitorData, routeVisitorId]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginQuery.trim()) {
      setLoginError(
        lang === 'ar'
          ? 'يرجى إدخال رقم التصريح أو الهوية أو رقم الجوال'
          : 'Please enter Visitor ID, National ID, or Mobile number'
      );
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    const found = await visitorPortalService.findVisitorByQuery(loginQuery.trim());
    setLoginLoading(false);

    if (found) {
      setCurrentVisitor(found);
      loadVisitorData(found);
      setLoginQuery('');
    } else {
      setLoginError(
        lang === 'ar'
          ? 'لم يتم العثور على سجل بالبيانات المدخلة. يرجى التحقق أو تجربة الحساب التجريبي أدناه.'
          : 'No visitor record found matching criteria. Please check or try the demo account below.'
      );
    }
  };

  // Demo Login quick action
  const handleDemoLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    const demo = await visitorPortalService.findVisitorByQuery('demo');
    setLoginLoading(false);
    if (demo) {
      setCurrentVisitor(demo);
      loadVisitorData(demo);
    }
  };

  // Logout
  const handleLogout = () => {
    visitorPortalService.clearSession();
    setCurrentVisitor(null);
    setUpcomingAppointments([]);
    setVisitHistory([]);
    setLabReports([]);
  };

  // Copy visitor ID
  const handleCopyId = () => {
    if (!currentVisitor) return;
    navigator.clipboard.writeText(currentVisitor.visitor_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };


  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rescheduleModalAppt || !rescheduleDate || rescheduleSubmitting) {
      return;
    }

    setRescheduleSubmitting(true);

    try {
      const success = await visitorPortalService.rescheduleAppointment(
        rescheduleModalAppt.id,
        rescheduleDate,
        rescheduleTime || '09:00 صباحاً'
      );

      if (!success) {
        window.alert(
          lang === 'ar'
            ? 'تعذر حفظ الموعد. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
            : lang === 'fr'
              ? 'Impossible d’enregistrer le rendez-vous. Vérifiez les données et réessayez.'
              : 'Could not save the appointment. Please check the details and try again.'
        );
        return;
      }

      if (currentVisitor) {
        setRescheduleModalAppt(null);
        await loadVisitorData(currentVisitor);
      }
    } catch (error) {
      console.error('Reschedule submit failed:', error);

      window.alert(
        lang === 'ar'
          ? 'حدث خطأ أثناء حفظ الموعد.'
          : lang === 'fr'
            ? 'Une erreur est survenue lors de l’enregistrement.'
            : 'An error occurred while saving the appointment.'
      );
    } finally {
      setRescheduleSubmitting(false);
    }
  };


  // Cancel appointment
  const handleCancelAppt = async (apptId: string) => {
    const confirmMsg =
      lang === 'ar'
        ? 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد المجدول؟'
        : 'Are you sure you want to cancel this scheduled appointment?';

    if (!window.confirm(confirmMsg)) return;

    const success = await visitorPortalService.cancelAppointment(apptId);
    if (success && currentVisitor) {
      loadVisitorData(currentVisitor);
    }
  };

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (historyLabFilter === 'all') return visitHistory;
    return visitHistory.filter((h) => h.laboratory.toLowerCase().includes(historyLabFilter.toLowerCase()));
  }, [visitHistory, historyLabFilter]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    if (!reportsSearch.trim()) return labReports;
    const q = reportsSearch.toLowerCase().trim();
    return labReports.filter(
      (r) =>
        r.report_number.toLowerCase().includes(q) ||
        r.sample_code.toLowerCase().includes(q) ||
        r.sample_type_ar.includes(q) ||
        r.sample_type_en.toLowerCase().includes(q) ||
        r.laboratory_name_ar.includes(q)
    );
  }, [labReports, reportsSearch]);

  return (
    <div
      dir={dir}
      className="min-h-screen pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('nav.home'), to: '/' },
            {
              label:
                lang === 'ar'
                  ? 'بوابة الزوار وتقارير الفحص'
                  : lang === 'fr'
                    ? 'Espace Visiteur & Rapports'
                    : 'Visitor Portal & Lab Reports',
            },
          ]}
        />

        {/* ============================================================
            01: INSTITUTIONAL HERO SECTION (MATCHING NAJRAN & ABOUT)
        ============================================================= */}
        <section className="mt-4 mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] via-[#152B47] to-[#0A1324] p-6 sm:p-10 lg:p-12 text-white shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left/Right Text Content (Child 1: on Right in RTL, on Left in LTR) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/25">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'البوابة المعتمدة للزوار والعملاء'
                      : lang === 'fr'
                        ? 'Portail Certifié Visiteurs & Clients'
                        : 'Accredited Visitor & Client Portal'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-400/25">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>ISO/IEC 17025:2017 &bull; SASO</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/25">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية — NWC'
                      : lang === 'fr'
                        ? 'Compagnie Nationale des Eaux'
                        : 'National Water Company'}
                  </span>
                </span>
              </div>

              {/* Main Official Title */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  {lang === 'ar'
                    ? 'منظومة مختبرات القطاع الجنوبي — الخدمات الرقمية للمستفيدين'
                    : lang === 'fr'
                      ? 'Réseau des Laboratoires du Secteur Sud — Services Numériques'
                      : 'Southern Sector Laboratories Network — Digital Beneficiary Services'}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {lang === 'ar'
                    ? 'لوحة تحكم الزوار وتقارير الفحص المخبري المعتمدة'
                    : lang === 'fr'
                      ? 'Espace Privé des Visiteurs & Rapports d’Analyses d’Eau'
                      : 'Private Visitor Dashboard & Certified Water Analysis Reports'}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-emerald-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'متابعة المواعيد المجدولة، استعراض سجل الزيارات، وتحميل التقارير المخبرية المعتمدة'
                      : lang === 'fr'
                        ? 'Gestion des rendez-vous, historique des visites et téléchargement des rapports'
                        : 'Manage appointments, review visit history, and download certified laboratory reports'}
                  </span>
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {lang === 'ar'
                  ? 'منصة رقمية موحدة تتيح للزوار والجهات والمستفيدين تتبع تصاريح الدخول للمختبرات المركزية وفروعها (عسير، نجران، الباحة، جازان)، إعادة جدولة المواعيد، وتحميل تقارير فحص ومطابقة جودة مياه الشرب والمياه المعالجة المعتمدة.'
                  : lang === 'fr'
                    ? 'Plateforme officielle unifiée permettant aux visiteurs de gérer leurs accès aux laboratoires centraux (Asir, Najran, Al-Baha, Jazan), de modifier leurs rendez-vous et d’accéder directement à leurs certificats d’analyse de potabilité.'
                    : 'Unified institutional platform enabling registered visitors to manage security permits across central water laboratories (Asir, Najran, Al-Baha, Jazan), reschedule appointments, and download certified water quality certificates.'}
              </p>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'حجز موعد زيارة جديد'
                      : lang === 'fr'
                        ? 'Planifier une nouvelle visite'
                        : 'Book New Appointment'}
                  </span>
                </Link>
                <Link
                  to="/survey"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'استبيان تقييم الخدمة'
                      : lang === 'fr'
                        ? 'Évaluation du service'
                        : 'Customer Survey'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Logo Emblem Container (Child 2: on Left in RTL, on Right in LTR) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-lg max-w-xs w-full text-center">
                {/* Institutional circular emblem frame */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-blue-700/25 dark:border-blue-400/25" />
                  <div className="absolute inset-2 rounded-full border border-amber-500/35 dark:border-amber-400/30" />
                  <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900 shadow-sm" />
                  <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center p-2">
                    <img
                      src={nwcLogo}
                      alt="National Water Company"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Institutional identification below logo */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block tracking-wide leading-snug">
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية'
                      : lang === 'fr'
                        ? 'Compagnie Nationale des Eaux'
                        : 'National Water Company'}
                  </span>

                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block mt-1">
                    {lang === 'ar'
                      ? 'بوابة الزوار — المختبرات المركزية'
                      : lang === 'fr'
                        ? 'Portail Visiteurs — Laboratoires Centraux'
                        : 'Visitor Portal — Central Laboratories'}
                  </span>

                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="h-px w-5 bg-amber-500/50" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-[0.12em]">
                      ISO/IEC 17025:2017 &bull; SAC
                    </span>
                    <span className="h-px w-5 bg-amber-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            02: VISITOR AUTHENTICATION & LOGIN FORM (IF NOT LOGGED IN)
        ============================================================= */}
        {!currentVisitor ? (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {lang === 'ar'
                      ? 'تسجيل الدخول إلى لوحة الزائر'
                      : lang === 'fr'
                        ? 'Accès à l’Espace Visiteur'
                        : 'Access Visitor Dashboard'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'ar'
                      ? 'أدخل رقم تصريح الزيارة (LAB-2026-xxxx) أو رقم الهوية أو رقم الجوال المسجل'
                      : lang === 'fr'
                        ? 'Saisissez votre code de visite (LAB-2026-xxxx), numéro d\'identité ou téléphone'
                        : 'Enter your Visit Permit ID (LAB-2026-xxxx), National ID, or mobile number'}
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'ar'
                      ? 'معرف الزائر / رقم الهوية / رقم الجوال'
                      : lang === 'fr'
                        ? 'Identifiant visiteur / ID / Téléphone'
                        : 'Visitor ID / National ID / Mobile Phone'}
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={loginQuery}
                      onChange={(e) => setLoginQuery(e.target.value)}
                      placeholder={
                        lang === 'ar'
                          ? 'مثال: LAB-2026-0001 أو 0501234567 أو 1089234812'
                          : 'e.g. LAB-2026-0001 or 0501234567'
                      }
                      className="w-full ps-10 pe-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>
                      {loginLoading
                        ? lang === 'ar'
                          ? 'جاري التحقق...'
                          : 'Verifying...'
                        : lang === 'ar'
                          ? 'الدخول إلى حسابي'
                          : 'Sign In to Dashboard'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loginLoading}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200 font-semibold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {lang === 'ar'
                        ? 'تجربة حساب زائر معتمد (نقرة واحدة)'
                        : 'Quick Demo Visitor Login'}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {lang === 'ar'
                    ? 'ليس لديك موعد مسجل بعد؟'
                    : 'Haven\'t booked a visit yet?'}
                </span>
                <Link
                  to="/register"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'تسجيل زيارة جديدة الآن' : 'Register New Visit'}</span>
                  <Arrow className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
              03: LOGGED IN VISITOR PROFILE & STATS BAR
          ============================================================= */
          <div className="space-y-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
                  {currentVisitor.visitor_name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {currentVisitor.visitor_name}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-semibold border border-blue-200 dark:border-blue-800">
                      <span>{currentVisitor.visitor_id}</span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        title="Copy ID"
                        className="p-0.5 hover:text-blue-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'حساب موثق' : 'Verified'}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {currentVisitor.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentVisitor.company}</span>
                      </span>
                    )}
                    {currentVisitor.phone && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span dir="ltr">{currentVisitor.phone}</span>
                      </span>
                    )}
                    {currentVisitor.national_id && (
                      <span className="text-[11px] text-slate-400">
                        {lang === 'ar' ? 'الهوية:' : 'ID:'} {currentVisitor.national_id.slice(0, 3)}****
                        {currentVisitor.national_id.slice(-3)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'موعد جديد' : 'New Visit'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تبديل الحساب' : 'Switch'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div
                onClick={() => setActiveTab('upcoming')}
                className={`p-4 rounded-2xl bg-white dark:bg-[#172033] border transition-all cursor-pointer shadow-2xs ${activeTab === 'upcoming'
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'ar' ? 'المواعيد القادمة' : 'Upcoming'}
                  </span>
                  <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {upcomingAppointments.length}
                </div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                  {lang === 'ar' ? 'مواعيد مؤكدة ونشطة' : 'Active Appointments'}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('history')}
                className={`p-4 rounded-2xl bg-white dark:bg-[#172033] border transition-all cursor-pointer shadow-2xs ${activeTab === 'history'
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'ar' ? 'سجل الزيارات' : 'Visit History'}
                  </span>
                  <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {visitHistory.length}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {lang === 'ar' ? 'زيارات مكتملة وسابقة' : 'Past Completed Visits'}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('reports')}
                className={`p-4 rounded-2xl bg-white dark:bg-[#172033] border transition-all cursor-pointer shadow-2xs ${activeTab === 'reports'
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'ar' ? 'تقارير الفحص المخبري' : 'Lab Reports'}
                  </span>
                  <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {labReports.length}
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {lang === 'ar' ? 'شهادات مطابقة جاهزة للتحميل' : 'Ready for Download'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'ar' ? 'حالة الاعتماد' : 'Accreditation'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white leading-tight mt-1">
                  ISO 17025
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'ar' ? 'معتمد مركزياً • SAC' : 'SAC Accredited'}
                </div>
              </div>
            </div>

            {/* ============================================================
                04: TABS NAVIGATION
            ============================================================= */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'upcoming'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'المواعيد القادمة' : 'Upcoming Appointments'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  {upcomingAppointments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <History className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'سجل الزيارات السابقة' : 'Visit History'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {visitHistory.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'تقارير الفحص والتحاليل' : 'Laboratory Reports'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                  {labReports.length}
                </span>
              </button>
            </div>

            {dataLoading ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-xs text-slate-500">
                  {lang === 'ar' ? 'جاري تحميل بيانات المواعيد والتقارير...' : 'Loading appointments & lab reports...'}
                </span>
              </div>
            ) : (
              <>
                {/* ============================================================
                    TAB 1: UPCOMING APPOINTMENTS
                ============================================================= */}
                {activeTab === 'upcoming' && (
                  <div className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800">
                        <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {lang === 'ar' ? 'لا توجد مواعيد قادمة مجدولة' : 'No upcoming appointments'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
                          {lang === 'ar'
                            ? 'يمكنك حجز موعد جديد لزيارة أي من المختبرات المركزية وفروعها بالقطاع الجنوبي لتسليم العينات أو المتابعة الفنية.'
                            : 'You can book a new visit appointment to submit water samples or meet our technical specialists.'}
                        </p>
                        <Link
                          to="/register"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'حجز موعد زيارة جديد' : 'Schedule a Visit'}</span>
                        </Link>
                      </div>
                    ) : (
                      upcomingAppointments.map((appt) => (
                        <div
                          key={appt.id}
                          className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                        >
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                                {appt.visitor_id}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {appt.status === 'Confirmed'
                                    ? lang === 'ar'
                                      ? 'موعد مؤكد ومصرح'
                                      : 'Confirmed & Approved'
                                    : lang === 'ar'
                                      ? 'قيد المعالجة'
                                      : 'Pending'}
                                </span>
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {getLabLabel(appt.laboratory, lang)}
                                {appt.branch ? ` — ${getBranchLabel(appt.laboratory, appt.branch, lang)}` : ''}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                                {getLocalizedPurpose(appt.purpose)}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-400">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{appt.visit_date}</span>
                                </span>
                                {appt.arrival_time && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{appt.arrival_time}</span>
                                  </span>
                                )}
                                {appt.department && (
                                  <span className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{appt.department}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {appt.notes && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                                <strong>{lang === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> {appt.notes}
                              </p>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                            <button
                              type="button"
                              onClick={() => setBadgeModalAppt(appt)}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'بطاقة وتصريح الزيارة' : 'Visitor Pass'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => visitorPortalService.downloadCalendarIcs(appt)}
                              title="Add to Calendar (.ics)"
                              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>{lang === 'ar' ? 'حفظ بالتقويم' : 'Calendar'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleModalAppt(appt);
                                setRescheduleDate(appt.visit_date);
                                setRescheduleTime(appt.arrival_time || '09:30 صباحاً');
                              }}
                              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'تعديل الموعد' : 'Reschedule'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCancelAppt(appt.id)}
                              className="px-2.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 font-semibold text-xs transition-colors cursor-pointer"
                              title="Cancel appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ============================================================
                TAB 2: VISIT HISTORY
            ============================================================= */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {lang === 'ar' ? 'تصفية حسب المختبر:' : 'Filter by Laboratory:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'all', label: lang === 'ar' ? 'الكل' : 'All' },
                          { key: 'asir', label: lang === 'ar' ? 'عسير' : 'Asir' },
                          { key: 'najran', label: lang === 'ar' ? 'نجران' : 'Najran' },
                          { key: 'baha', label: lang === 'ar' ? 'الباحة' : 'Al-Baha' },
                          { key: 'jazan', label: lang === 'ar' ? 'جازان' : 'Jazan' },
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setHistoryLabFilter(tab.key)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${historyLabFilter === tab.key
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredHistory.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800">
                        <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {lang === 'ar' ? 'لا يوجد سجل زيارات سابق' : 'No past visits recorded'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {lang === 'ar'
                            ? 'ستظهر هنا كافة زياراتك المكتملة وتاريخ الحضور وتقارير الفحص الصادرة.'
                            : 'Your attended visits and completed audits will appear here.'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
                        {filteredHistory.map((visit) => (
                          <div
                            key={visit.id}
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold font-mono text-slate-500">
                                  {visit.visitor_id}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${visit.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    }`}
                                >
                                  {visit.status === 'Cancelled'
                                    ? lang === 'ar'
                                      ? 'ملغي'
                                      : 'Cancelled'
                                    : lang === 'ar'
                                      ? 'مكتملة وموثقة'
                                      : 'Completed'}
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  {getLabLabel(visit.laboratory, lang)}
                                </span>
                              </div>

                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {getLocalizedPurpose(visit.purpose)}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{visit.visit_date}</span>
                                </span>
                                {visit.department && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{visit.department}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/visitor/${visit.visitor_id}`}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                              >
                                <span>{lang === 'ar' ? 'عرض السجل' : 'View Pass'}</span>
                              </Link>
                              <Link
                                to={`/survey?laboratory=${encodeURIComponent(visit.laboratory)}`}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1"
                              >
                                <Award className="w-3.5 h-3.5 text-amber-600" />
                                <span>{lang === 'ar' ? 'تقييم الزيارة' : 'Rate'}</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================
                TAB 3: CERTIFIED LAB REPORTS & SAMPLE TEST RESULTS
            ============================================================= */}
                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={reportsSearch}
                          onChange={(e) => setReportsSearch(e.target.value)}
                          placeholder={
                            lang === 'ar'
                              ? 'البحث برقم التقرير (NWC-SL-...) أو كود العينة أو نوع المياه...'
                              : 'Search by report number, sample code, or water type...'
                          }
                          className="w-full ps-10 pe-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {filteredReports.length === 0 ? (
                      <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800">
                        <FileCheck2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {lang === 'ar' ? 'لا توجد تقارير تطابق البحث' : 'No matching reports found'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {lang === 'ar'
                            ? 'تظهر هنا تقارير الفحص الكيميائي والميكروبيولوجي المعتمدة فور انتهاء الفحوصات المخبرية.'
                            : 'Official certified chemical & microbiological reports will appear here upon completion.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredReports.map((report) => (
                          <div
                            key={report.id}
                            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/30 transition-all flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Report header */}
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                                    {lang === 'ar' ? 'شهادة فحص معتمدة' : 'Certified Test Report'}
                                  </span>
                                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                    {report.report_number}
                                  </h4>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                  <span>{lang === 'ar' ? 'مطابق SASO' : 'Compliant'}</span>
                                </span>
                              </div>

                              {/* Matrix & Location */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                                <div className="font-semibold text-slate-900 dark:text-white">
                                  {lang === 'ar' ? report.sample_type_ar : report.sample_type_en}
                                </div>
                                <div className="text-slate-500 text-[11px]">
                                  {lang === 'ar' ? report.source_location_ar : report.source_location_en}
                                </div>
                              </div>

                              {/* Details strip */}
                              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                                <div>
                                  <span className="text-slate-400 block">{lang === 'ar' ? 'كود العينة:' : 'Sample Code:'}</span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    {report.sample_code}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">{lang === 'ar' ? 'المختبر الفاحص:' : 'Laboratory:'}</span>
                                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                                    {report.laboratory_name_ar}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">{lang === 'ar' ? 'تاريخ السحب:' : 'Sampling Date:'}</span>
                                  <span>{report.collection_date}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block">{lang === 'ar' ? 'تاريخ الاعتماد:' : 'Issue Date:'}</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    {report.issue_date}
                                  </span>
                                </div>
                              </div>

                              {/* Micro-preview of parameters */}
                              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">
                                  {lang === 'ar' ? 'أبرز المؤشرات المفحوصة:' : 'Key Parameters Analyzed:'}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {report.parameters.slice(0, 4).map((p, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono"
                                    >
                                      {lang === 'ar' ? p.name_ar : p.name_en}: <strong>{p.measured_value} {p.unit}</strong>
                                    </span>
                                  ))}
                                  {report.parameters.length > 4 && (
                                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                                      +{report.parameters.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedReport(report)}
                                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>{lang === 'ar' ? 'استعراض المؤشرات' : 'View Parameters'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => visitorPortalService.openPrintableReport(report, lang as 'ar' | 'en' | 'fr')}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'تحميل التقرير (PDF)' : 'Download (PDF)'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ============================================================
            MODAL 1: VISITOR BADGE & QR PASS
        ============================================================= */}
        {badgeModalAppt && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#172033] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 relative">
              <button
                type="button"
                onClick={() => setBadgeModalAppt(null)}
                className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <img src={nwcLogo} alt="NWC" className="max-h-full max-w-full object-contain" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'تصريح وبطاقة دخول الزائر' : 'Official Visitor Security Pass'}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold mt-0.5">
                  {badgeModalAppt.visitor_id}
                </p>
              </div>

              {/* QR Code Container */}
              <div className="py-6 text-center">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-inner inline-block mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `${window.location.origin}/visitor/${encodeURIComponent(
                        badgeModalAppt.visitor_id
                      )}`
                    )}`}
                    alt="QR Pass"
                    className="w-36 h-36 mx-auto"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {lang === 'ar'
                    ? 'أبرز هذا الرمز عند البوابة الأمنية بالمختبر للتحقق الفوري'
                    : 'Present this QR pass at the security gate for immediate verification'}
                </p>
              </div>

              {/* Summary Details */}
              <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'اسم الزائر:' : 'Visitor:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {badgeModalAppt.visitor_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'المختبر المستهدف:' : 'Target Lab:'}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {getLabLabel(badgeModalAppt.laboratory, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'تاريخ وموعد الزيارة:' : 'Date & Time:'}</span>
                  <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                    {badgeModalAppt.visit_date} ({badgeModalAppt.arrival_time})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'الغرض:' : 'Purpose:'}</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {getLocalizedPurpose(badgeModalAppt.purpose)}
                  </span>
                </div>
              </div>

              {/* Print and Close buttons */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'طباعة البطاقة' : 'Print Pass'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBadgeModalAppt(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            MODAL 2: RESCHEDULE APPOINTMENT
        ============================================================= */}
        {rescheduleModalAppt && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#172033] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setRescheduleModalAppt(null)}
                className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'ar' ? 'إعادة جدولة موعد الزيارة' : 'Reschedule Appointment'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'ar' ? 'التصريح:' : 'Permit:'} {rescheduleModalAppt.visitor_id} —{' '}
                  {getLabLabel(rescheduleModalAppt.laboratory, lang)}
                </p>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'ar' ? 'التاريخ الجديد المطلوب:' : 'New Desired Date:'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'ar' ? 'الوقت المفضل للوصول:' : 'Preferred Arrival Time:'}
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="08:00 صباحاً">08:00 صباحاً (08:00 AM)</option>
                    <option value="09:00 صباحاً">09:00 صباحاً (09:00 AM)</option>
                    <option value="10:00 صباحاً">10:00 صباحاً (10:00 AM)</option>
                    <option value="11:30 صباحاً">11:30 صباحاً (11:30 AM)</option>
                    <option value="01:00 ظهراً">01:00 ظهراً (01:00 PM)</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={rescheduleSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {rescheduleSubmitting
                      ? lang === 'ar'
                        ? 'جاري الحفظ...'
                        : 'Saving...'
                      : lang === 'ar'
                        ? 'تأكيد الموعد الجديد'
                        : 'Confirm Reschedule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleModalAppt(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            MODAL 3: LAB REPORT PARAMETERS PREVIEW
        ============================================================= */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#172033] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {selectedReport.report_number}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-0.5">
                  {lang === 'ar' ? selectedReport.sample_type_ar : selectedReport.sample_type_en}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedReport.laboratory_name_ar} &bull;{' '}
                  {lang === 'ar' ? 'تاريخ الإصدار:' : 'Issue Date:'} {selectedReport.issue_date}
                </p>
              </div>

              {/* Parameters Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-5">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 text-start">{lang === 'ar' ? 'المؤشر الفاحص' : 'Parameter'}</th>
                      <th className="p-2.5 text-start">{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                      <th className="p-2.5 text-start">{lang === 'ar' ? 'النتيجة المقاسة' : 'Measured'}</th>
                      <th className="p-2.5 text-start">{lang === 'ar' ? 'الحد النظامي' : 'Standard'}</th>
                      <th className="p-2.5 text-start">{lang === 'ar' ? 'المطابقة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedReport.parameters.map((param, pIdx) => (
                      <tr key={pIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                          {lang === 'ar' ? param.name_ar : param.name_en}
                        </td>
                        <td className="p-2.5 text-slate-500">{param.unit}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                          {param.measured_value}
                        </td>
                        <td className="p-2.5 text-slate-500 font-mono">{param.standard_limit}</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'مطابق' : 'Pass'}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => visitorPortalService.openPrintableReport(selectedReport, lang as 'ar' | 'en' | 'fr')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحميل التقرير الرسمي (PDF)' : 'Download Official PDF Report'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
