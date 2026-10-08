import { useMemo, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  MessageSquare,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Layers,
} from 'lucide-react';
import { services, getLocalizedService } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';

interface ServiceSpec {
  features: { ar: string; en: string; fr: string }[];
  parameters: { ar: string; en: string; fr: string }[];
  turnaroundTime: { ar: string; en: string; fr: string };
  accreditation: string;
}

const SERVICE_SPECS: Record<string, ServiceSpec> = {
  chemical: {
    features: [
      {
        ar: 'فحص الخواص الكيميائية والفيزيائية الشاملة لعينات مياه الشرب والمصادر السطحية والجوفية',
        en: 'Comprehensive physical and chemical profiling for potable, surface, and groundwater samples',
        fr: 'Caractérisation physico-chimique complète pour eau potable, nappes et eaux de surface',
      },
      {
        ar: 'قياس المعادن الثقيلة بدقة أجزاء في البليون عبر تقنية مطيافية البلازما (ICP-MS)',
        en: 'Heavy metal quantification down to parts-per-billion via ICP-MS spectrometry',
        fr: 'Dosage des métaux lourds à l\'échelle du ppb par spectrométrie ICP-MS',
      },
      {
        ar: 'تحديد مستويات الرقم الهيدروجيني والأملاح الذائبة الكلية والعكارة والتوصيلية الكهربائية',
        en: 'High-precision determination of pH, Total Dissolved Solids (TDS), Turbidity, and Conductivity',
        fr: 'Mesure haute précision du pH, solides dissous totaux (TDS), turbidité et conductivité',
      },
      {
        ar: 'تحليل الأيونات الذائبة الرئيسية: الكالسيوم، المغنيسيوم، الصوديوم، الكلوريد، الكبريتات والنترات',
        en: 'Major ion balance: Calcium, Magnesium, Sodium, Chloride, Sulfate, and Nitrate concentrations',
        fr: 'Équilibre ionique majeur : Calcium, Magnésium, Sodium, Chlorures, Sulfates et Nitrates',
      },
    ],
    parameters: [
      { ar: 'الرقم الهيدروجيني (pH) والأملاح الذائبة (TDS)', en: 'pH & Total Dissolved Solids (TDS)', fr: 'pH & Solides Dissous Totaux (TDS)' },
      { ar: 'العكارة (Turbidity - NTU)', en: 'Turbidity (NTU)', fr: 'Turbidité (NTU)' },
      { ar: 'المعادن الثقيلة (الرصاص، الزرنيخ، الكادميوم)', en: 'Heavy Metals (Lead, Arsenic, Cadmium)', fr: 'Métaux Lourds (Plomb, Arsenic, Cadmium)' },
      { ar: 'الأيونات المغذية (النترات، النتريت، الفلورايد)', en: 'Nutrients (Nitrates, Nitrites, Fluoride)', fr: 'Nutriments (Nitrates, Nitrites, Fluorure)' },
      { ar: 'العسرة الكلية (Total Hardness)', en: 'Total Hardness (CaCO3)', fr: 'Dureté Totale (CaCO3)' },
      { ar: 'القلويّة والكلوريدات (Alkalinity & Chlorides)', en: 'Alkalinity & Chlorides', fr: 'Alcalinité & Chlorures' },
    ],
    turnaroundTime: { ar: '24 - 48 ساعة عمل', en: '24 - 48 business hours', fr: '24 - 48 heures ouvrées' },
    accreditation: 'ISO/IEC 17025:2017 & SASO / GSO 149',
  },
  microbiological: {
    features: [
      {
        ar: 'الكشف عن بكتيريا القولون الكلية والبرازية والإشريكية القولونية (E. coli) وفق المعايير الدولية',
        en: 'Screening for Total Coliforms, Fecal Coliforms, and E. coli following WHO/SASO standards',
        fr: 'Dépistage des coliformes totaux, coliformes fécaux et E. coli selon les normes OMS/SASO',
      },
      {
        ar: 'استخدام تقنيات الترشيح الغشائي المعتمدة دولياً والمزارع التخصصية لضمان دقة الكشف',
        en: 'Standard membrane filtration and chromogenic substrate assays ensuring certified diagnostic accuracy',
        fr: 'Méthodes de filtration sur membrane et substrats chromogènes certifiés haute sensibilité',
      },
      {
        ar: 'فحص ميكروبات الزائفة الزنجارية (Pseudomonas aeruginosa) والمكورات المعوية البرازية',
        en: 'Targeted pathogen screening for Pseudomonas aeruginosa and Intestinal Enterococci',
        fr: 'Recherche ciblée de Pseudomonas aeruginosa et d\'Entérocoques intestinaux',
      },
      {
        ar: 'العد الكلي للبكتيريا الهوائية الحية (HPC) لتقييم كفاءة التطهير وجودة شبكات الإمداد',
        en: 'Heterotrophic Plate Count (HPC) monitoring to verify distribution grid sanitation',
        fr: 'Dénombrement des germes totaux (HPC) pour évaluer l\'hygiène des réseaux de distribution',
      },
    ],
    parameters: [
      { ar: 'بكتيريا الإشريكية القولونية (E. coli)', en: 'Escherichia coli (E. coli)', fr: 'Escherichia coli (E. coli)' },
      { ar: 'بكتيريا القولون الكلية (Total Coliforms)', en: 'Total Coliform Bacteria', fr: 'Bactéries Coliformes Totales' },
      { ar: 'المكورات المعوية (Intestinal Enterococci)', en: 'Intestinal Enterococci', fr: 'Entérocoques Intestinaux' },
      { ar: 'العد الهوائي الحي (HPC at 22°C & 37°C)', en: 'Heterotrophic Count (HPC at 22°C/37°C)', fr: 'Germes Totaux (HPC à 22°C et 37°C)' },
      { ar: 'الزوائف الزنجارية (Pseudomonas)', en: 'Pseudomonas aeruginosa', fr: 'Pseudomonas aeruginosa' },
      { ar: 'اختبارات السلامة الجرثومية للطوارئ', en: 'Emergency Potability Clearance', fr: 'Test de Potabilité d\'Urgence' },
    ],
    turnaroundTime: { ar: '24 - 72 ساعة عمل', en: '24 - 72 business hours', fr: '24 - 72 heures ouvrées' },
    accreditation: 'ISO/IEC 17025:2017 & WHO Guidelines for Drinking-water Quality',
  },
  'quality-monitoring': {
    features: [
      {
        ar: 'برامج مسح ميداني ورقابة مستمرة على محطات الضخ والخزانات العامة وشبكات التوزيع',
        en: 'Comprehensive field surveillance across pumping stations, public reservoirs, and municipal distribution grids',
        fr: 'Surveillance continue des stations de pompage, réservoirs publics et réseaux de distribution',
      },
      {
        ar: 'التحقق الدوري من نسب الكلور الحر المتبقي لضمان استدامة التطهير والوقاية من التلوث',
        en: 'Routine tracking of free residual chlorine to guarantee ongoing disinfection barrier integrity',
        fr: 'Suivi régulier du chlore résiduel libre pour garantir l\'efficacité de la désinfection',
      },
      {
        ar: 'نظام رقمي موحد للإبلاغ عن أي انحرافات وإصدار تنبيهات السلامة المائية الفورية',
        en: 'Integrated digital early-warning system for rapid incident reporting and immediate containment',
        fr: 'Système numérique d\'alerte précoce pour le signalement instantané des écarts de potabilité',
      },
      {
        ar: 'إصدار تقارير دورية ولوحات مؤشرات الامتثال للمواصفات الوطنية والعالمية',
        en: 'Periodic compliance certificates and executive dashboards for regulatory authorities',
        fr: 'Certificats de conformité périodiques et tableaux de bord pour les autorités de régulation',
      },
    ],
    parameters: [
      { ar: 'الكلور الحر المتبقي (Free Residual Chlorine)', en: 'Free Residual Chlorine', fr: 'Chlore Résiduel Libre' },
      { ar: 'مؤشر جودة المياه الكلي (Overall Water Quality Index)', en: 'Overall Water Quality Index (WQI)', fr: 'Indice Global de Qualité de l\'Eau' },
      { ar: 'سلامة الخزانات والشبكات (Reservoir Integrity)', en: 'Reservoir & Network Integrity', fr: 'Intégrité des Réservoirs et Réseaux' },
      { ar: 'المطابقة للمواصفة القياسية (SASO Compliance %)', en: 'Regulatory Compliance Rate (%)', fr: 'Taux de Conformité Réglementaire (%)' },
      { ar: 'الفحوصات العشوائية الدورية (Spot Audits)', en: 'Scheduled Spot Audits', fr: 'Audits Aléatoires Programmés' },
      { ar: 'تقييم المخاطر البيئية (Environmental Risk Screening)', en: 'Environmental Risk Screening', fr: 'Évaluation des Risques Environnementaux' },
    ],
    turnaroundTime: { ar: 'مراقبة مستمرة على مدار الساعة 24/7', en: 'Continuous 24/7 Monitoring', fr: 'Surveillance continue 24h/24 et 7j/7' },
    accreditation: 'National Drinking Water Surveillance Standards',
  },
  'field-sampling': {
    features: [
      {
        ar: 'سحب العينات المائية الميدانية وفق بروتوكولات المواصفة القياسية الدولية ISO 5667',
        en: 'Certified water collection adhering strictly to ISO 5667 international sampling protocols',
        fr: 'Prélèvements sur le terrain conformes aux protocoles internationaux ISO 5667',
      },
      {
        ar: 'سلسلة حيازة موثقة رقمياً تضمن سلامة العينات وتتبعها من موقع الجمع إلى المختبر المركزي',
        en: 'Tamper-proof digital chain of custody ensuring sample integrity from source to laboratory bench',
        fr: 'Chaîne de garde numérique infalsifiable garantissant l\'intégrité de l\'échantillon',
      },
      {
        ar: 'قياس المؤشرات الميدانية الفورية (درجة الحرارة، الأكسجين الذائب، التوصيل الكهربائي، الرقم الهيدروجيني)',
        en: 'Immediate in-situ determination of temperature, dissolved oxygen, conductivity, and pH',
        fr: 'Mesures in situ immédiates : température, oxygène dissous, conductivité et pH',
      },
      {
        ar: 'أسطول سيارات ميدانية مجهزة بثلاجات حفظ معقمة وحافظات حرارية مخصصة لكل نوع من الفحوصات',
        en: 'Dedicated fleet of climate-controlled vehicles with sterile preservation units for all test classes',
        fr: 'Véhicules d\'intervention équipés d\'unités de conservation stériles thermo-régulées',
      },
    ],
    parameters: [
      { ar: 'سلسلة الحيازة الرقمية (Digital Chain of Custody)', en: 'Digital Chain of Custody Tracking', fr: 'Traçabilité de Chaîne de Garde' },
      { ar: 'القياسات الحقلية الفورية (In-situ Measurements)', en: 'In-situ Field Determinations', fr: 'Mesures Physico-Chimiques In Situ' },
      { ar: 'حفظ وتثبيت العينات (Sample Preservation Protocols)', en: 'Sample Preservation Protocols', fr: 'Protocoles de Conservation Réfrigérée' },
      { ar: 'التغطية الميدانية الشاملة لكافة محافظات القطاع الجنوبي', en: 'Southern Sector Geographic Coverage', fr: 'Couverture Intégrale du Secteur Sud' },
      { ar: 'التعقيم والمطابقة المعيارية للأوعية', en: 'Sterile Certified Sampling Vessels', fr: 'Flaconnage Stérile Certifié' },
      { ar: 'تحديد الإحداثيات الجغرافية لمواقع الجمع (GPS Tagging)', en: 'Geotagged GPS Sample Locating', fr: 'Géolocalisation GPS des Prélèvements' },
    ],
    turnaroundTime: { ar: 'استجابة ميدانية خلال ساعات', en: 'Rapid Field Dispatch within Hours', fr: 'Intervention sur site en quelques heures' },
    accreditation: 'ISO 5667 Series & ISO/IEC 17025 Sampling Scope',
  },
  'water-treatment': {
    features: [
      {
        ar: 'تقييم كفاءة محطات التناضح العكسي (RO) ووحدات التحلية وإزالة الأملاح المفرطة',
        en: 'Performance evaluations for Reverse Osmosis (RO), desalination, and ultrafiltration trains',
        fr: 'Évaluation des performances des filières d\'osmose inverse (RO) et de dessalement',
      },
      {
        ar: 'مراقبة كفاءة عمليات الترويب والترسيب والفلترة الرملية والكربونية لإزالة العكارة',
        en: 'Audit of coagulation, flocculation, sedimentation, and granular filtration stages',
        fr: 'Contrôle des étapes de coagulation, décantation et filtration sur sable et charbon',
      },
      {
        ar: 'ضبط وتدقيق جرعات التطهير والكلورة والحد من تكوّن نواتج التعقيم الثانوية (THMs)',
        en: 'Disinfection dosing optimization and strict control of Trihalomethanes (THMs) byproducts',
        fr: 'Optimisation du dosage de désinfection et contrôle des sous-produits (THM)',
      },
      {
        ar: 'حساب مؤشرات التوازن الكيميائي والترسيب والتآكل (Langelier & Ryznar Saturation Indices)',
        en: 'Corrosivity and scaling potential monitoring using Langelier and Ryznar saturation indices',
        fr: 'Calcul du potentiel d\'entartrage et de corrosivité (indices de Langelier et Ryznar)',
      },
    ],
    parameters: [
      { ar: 'كفاءة إزالة الأملاح (Salt Rejection Rate %)', en: 'Salt Rejection Rate (%)', fr: 'Taux de Rejet des Sels (%)' },
      { ar: 'مؤشر لانجلير للتشبع (Langelier Saturation Index - LSI)', en: 'Langelier Saturation Index (LSI)', fr: 'Indice de Saturation de Langelier (LSI)' },
      { ar: 'نواتج التعقيم الثانوية (Trihalomethanes - THMs)', en: 'Disinfection Byproducts (THMs)', fr: 'Sous-produits de Désinfection (THM)' },
      { ar: 'كفاءة إزالة العكارة والمواد العالقة (Turbidity Reduction)', en: 'Turbidity Reduction Efficiency (%)', fr: 'Efficacité d\'Élimination de la Turbidité (%)' },
      { ar: 'فحص كفاءة الأغشية والضغط التفاضلي (Membrane Flux)', en: 'Membrane Flux & Differential Pressure', fr: 'Flux Membranaire & Pression Différentielle' },
      { ar: 'تقييم استهلاك الكيماويات التشغيلية', en: 'Chemical Dosing Optimization', fr: 'Optimisation des Dosages Chimiques' },
    ],
    turnaroundTime: { ar: '48 - 72 ساعة عمل', en: '48 - 72 business hours', fr: '48 - 72 heures ouvrées' },
    accreditation: 'AWWA Standards & SASO Treatment Guidelines',
  },
  consultation: {
    features: [
      {
        ar: 'إصدار تقارير وشهادات فحص مخبري رسمية معتمدة وموثقة برمز الاستجابة السريع (QR Code)',
        en: 'Issuance of official accredited analytical certificates with digital verification and QR seals',
        fr: 'Émission de certificats officiels d\'analyses avec vérification numérique par QR code',
      },
      {
        ar: 'تقديم استشارات هندسية وعلمية لمعالجة ملوحة المياه والملوثات الكيميائية والميكروبيولوجية',
        en: 'Specialized scientific advisory for treating salinity anomalies, scaling, and microbial contamination',
        fr: 'Conseil scientifique spécialisé pour le traitement de la salinité et des pollutions complexes',
      },
      {
        ar: 'إعداد ومراجعة خطط إدارة سلامة المياه (Water Safety Plans - WSP) للمنشآت والمشاريع الكبرى',
        en: 'Formulation of comprehensive Water Safety Plans (WSP) aligned with WHO frameworks',
        fr: 'Élaboration de Plans de Sécurité Sanitaire de l\'Eau (PSSE) conformes aux directives OMS',
      },
      {
        ar: 'برامج تدريبية وتأهيلية للكوادر الوطنية في مجالات التحليل المخبري وضبط الجودة',
        en: 'Accreditation readiness programs and certified training seminars on laboratory quality assurance',
        fr: 'Formations certifiantes aux méthodologies d\'analyses et d\'assurance qualité de laboratoire',
      },
    ],
    parameters: [
      { ar: 'شهادات الفحص المخبري المعتمدة (ISO 17025 Certificates)', en: 'Certified ISO/IEC 17025 Test Reports', fr: 'Rapports d\'Analyses Certifiés ISO 17025' },
      { ar: 'خطط سلامة المياه المعتمدة (Water Safety Plans - WSP)', en: 'Water Safety Plans Formulation (WSP)', fr: 'Plans de Sécurité Sanitaire de l\'Eau (PSSE)' },
      { ar: 'دراسات معالجة الملوحة والملوثات (Remediation Studies)', en: 'Water Remediation Feasibility Studies', fr: 'Études de Traitement et Décontamination' },
      { ar: 'التحكيم الفني والامتثال البيئي (Regulatory Compliance)', en: 'Technical Advisory & Regulatory Review', fr: 'Expertise Technique & Conformité Environnementale' },
      { ar: 'برامج التدريب المخبري المتخصص (Lab Training)', en: 'Specialized Laboratory Training Programs', fr: 'Formations Techniques de Laboratoire' },
      { ar: 'تدقيق أنظمة الجودة المخبرية (Quality Audit Services)', en: 'Internal Quality Audits & Gap Analysis', fr: 'Audits Qualité & Analyse d\'Écarts' },
    ],
    turnaroundTime: { ar: 'وفق نطاق الاستشارة المطلوب', en: 'Custom timeline based on project scope', fr: 'Délai sur mesure selon le périmètre' },
    accreditation: 'ISO/IEC 17025:2017 & Saudi Accreditation Center (SAC)',
  },
};

/**
 * Normalizes input parameters (from URL paths or query params)
 * and resolves them safely to an existing service ID.
 */
function resolveServiceId(paramId?: string | null): string {
  if (!paramId) return services[0].id;
  const clean = paramId.trim().toLowerCase();

  // 1. Exact match on service id
  const exact = services.find((s) => s.id.toLowerCase() === clean);
  if (exact) return exact.id;

  // 2. Common aliases & human-readable variations
  const aliasMap: Record<string, string> = {
    microbiology: 'microbiological',
    'microbiological-analysis': 'microbiological',
    'microbiological-testing': 'microbiological',
    chemical: 'chemical',
    'chemical-analysis': 'chemical',
    physical: 'chemical',
    'physical-analysis': 'chemical',
    'water-quality': 'quality-monitoring',
    'water-quality-monitoring': 'quality-monitoring',
    monitoring: 'quality-monitoring',
    quality: 'quality-monitoring',
    drinking: 'water-treatment',
    'drinking-water': 'water-treatment',
    'water-treatment': 'water-treatment',
    'water-treatment-plant': 'water-treatment',
    treatment: 'water-treatment',
    sampling: 'field-sampling',
    samples: 'field-sampling',
    'sample-testing': 'field-sampling',
    'field-sampling': 'field-sampling',
    specialized: 'consultation',
    consultation: 'consultation',
    consultations: 'consultation',
    'environmental-analysis': 'quality-monitoring',
  };

  if (aliasMap[clean]) {
    return aliasMap[clean];
  }

  // 3. Partial substring match
  const partial = services.find(
    (s) => s.id.toLowerCase().includes(clean) || clean.includes(s.id.toLowerCase())
  );
  if (partial) return partial.id;

  return services[0].id;
}

export default function Services() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const { serviceId } = useParams<{ serviceId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailSectionRef = useRef<HTMLDivElement>(null);

  // Retrieve service identifier from either /services/:serviceId OR /services?service=:id
  const currentParam = serviceId || searchParams.get('service');

  // Authoritative selected service ID from project's single source of truth
  const activeServiceId = useMemo(() => {
    return resolveServiceId(currentParam);
  }, [currentParam]);

  // Find the selected service in the data array
  const rawSelectedService = useMemo(() => {
    return services.find((s) => s.id === activeServiceId) || services[0];
  }, [activeServiceId]);

  const selectedService = useMemo(() => {
    return getLocalizedService(rawSelectedService, lang);
  }, [rawSelectedService, lang]);

  const selectedSpec = useMemo(() => {
    return SERVICE_SPECS[activeServiceId] || SERVICE_SPECS.chemical;
  }, [activeServiceId]);

  const SelectedIcon = selectedService.icon;

  // Smoothly scroll to the detail section when navigating between services
  useEffect(() => {
    if (currentParam && detailSectionRef.current) {
      const topOffset = detailSectionRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
    }
  }, [activeServiceId, currentParam]);

  const handleSelectService = (id: string) => {
    navigate(`/services/${id}`);
  };

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Breadcrumb reflecting currently selected service */}
        <Breadcrumb
          items={
            currentParam
              ? [
                  { label: t('nav.services'), to: '/services' },
                  { label: selectedService.title },
                ]
              : [{ label: t('nav.services') }]
          }
        />

        {/* Hero Visual Banner - Clean Institutional Style */}
        <div className="mt-4 mb-8 relative rounded-2xl overflow-hidden bg-[#0A1324] text-white shadow-lg border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={siteMedia.panoramicBand || siteMedia.waterTestingPan}
              alt="Laboratory Services"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-3 border border-blue-400/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'منظومة الفحص المعتمدة' : lang === 'fr' ? 'Cadre d\'analyse accrédité' : 'Accredited Testing Framework'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-2">
              {t('services.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
              {t('services.desc')}
            </p>
          </div>
        </div>

        {/* ============================================================
            Service Selector Tabs Bar (Synchronized with URL)
        ============================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {lang === 'ar'
                  ? 'اختر الخدمة أو التحليل المخبري'
                  : lang === 'fr'
                    ? 'Sélectionnez un service ou une analyse'
                    : 'Select a Laboratory Service'}
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              {services.length} {lang === 'ar' ? 'خدمات معتمدة' : lang === 'fr' ? 'services accrédités' : 'Accredited Services'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {services.map((rawService) => {
              const item = getLocalizedService(rawService, lang);
              const ItemIcon = item.icon;
              const isSelected = item.id === activeServiceId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectService(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-white dark:bg-[#172033] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs'
                  }`}
                >
                  <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            FEATURED SELECTED SERVICE CONTENT ZONE
            Displays directly the active service with all details & specs
        ============================================================= */}
        <div
          ref={detailSectionRef}
          className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-white dark:bg-[#172033] border border-blue-500/30 dark:border-blue-500/20 shadow-sm mb-12 transition-all duration-300"
        >
          {/* Top Header of the Selected Service */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-2xs">
                <SelectedIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {lang === 'ar'
                        ? 'الخدمة المحددة حالياً'
                        : lang === 'fr'
                          ? 'Service Actuellement Affiché'
                          : 'Currently Selected Service'}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>{selectedSpec.accreditation}</span>
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedService.title}
                </h2>
              </div>
            </div>

            {/* Turnaround Time Pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs shrink-0 self-start">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {lang === 'ar' ? 'مدة إصدار النتائج' : lang === 'fr' ? 'Délai d\'analyse' : 'Turnaround Time'}
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedSpec.turnaroundTime[lang] || selectedSpec.turnaroundTime.en}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'نطاق الخدمة والفحص' : lang === 'fr' ? 'Périmètre & Description' : 'Service Scope & Overview'}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {selectedService.description}
            </p>
          </div>

          {/* Key Characteristics & Associated Analyses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
            {/* Characteristics / Features */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {lang === 'ar'
                    ? 'الخصائص والمعايير المعتمدة'
                    : lang === 'fr'
                      ? 'Caractéristiques & Méthodologies'
                      : 'Key Features & Standards'}
                </span>
              </h3>

              <div className="space-y-2.5">
                {selectedSpec.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat[lang] || feat.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analyzed Parameters List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {lang === 'ar'
                    ? 'أبرز المؤشرات والتحاليل المرتبطة'
                    : lang === 'fr'
                      ? 'Analyses & Paramètres Associés'
                      : 'Associated Analytes & Tests'}
                </span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedSpec.parameters.map((param, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                    <span>{param[lang] || param.en}</span>
                  </span>
                ))}
              </div>

              {/* Standard Compliance Note */}
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <Award className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <p className="leading-relaxed">
                  {lang === 'ar'
                    ? 'جميع الفحوصات تُجرى وفقاً لمتطلبات الآيزو ISO/IEC 17025 والمواصفات القياسية السعودية والخليجية لضمان دقة النتائج وقبولها رسمياً.'
                    : lang === 'fr'
                      ? 'Toutes les analyses sont menées sous accréditation ISO/IEC 17025 et conformes aux réglementations sanitaires officielles.'
                      : 'All laboratory procedures operate strictly under ISO/IEC 17025 accreditation and certified national regulatory frameworks.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs for the Selected Service */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'طلب فحص العينات لهذه الخدمة'
                    : lang === 'fr'
                      ? 'Demander cette analyse'
                      : 'Request Sample Testing for this Service'}
                </span>
              </Link>

              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'استفسار فني عن الخدمة'
                    : lang === 'fr'
                      ? 'Poser une question technique'
                      : 'Technical Inquiry'}
                </span>
              </Link>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'معرّف الخدمة:' : lang === 'fr' ? 'Identifiant :' : 'Service ID:'}</span>
              <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-blue-600 dark:text-blue-400">
                {selectedService.id}
              </code>
            </div>
          </div>
        </div>

        {/* ============================================================
            Overview Grid of All Services (Interactive Switching)
        ============================================================= */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'دليل كافة الخدمات المخبرية'
                  : lang === 'fr'
                    ? 'Catalogue de Tous les Services'
                    : 'All Laboratory Services Directory'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'انقر على أي خدمة لعرض تفاصيلها وفحوصاتها مباشرة أعلاه'
                  : lang === 'fr'
                    ? 'Cliquez sur n\'importe quel service pour afficher ses détails et analyses associés ci-dessus'
                    : 'Click any service below to view its specific scope and analysis parameters above'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {services.map((rawService) => {
              const service = getLocalizedService(rawService, lang);
              const Icon = service.icon;
              const isSelected = service.id === activeServiceId;

              return (
                <div
                  key={service.id}
                  onClick={() => handleSelectService(service.id)}
                  className={`p-6 rounded-2xl bg-white dark:bg-[#172033] border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md bg-blue-50/20 dark:bg-blue-950/20'
                      : 'border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'معروض حالياً' : lang === 'fr' ? 'Sélectionné' : 'Active'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <Link
                      to={`/services/${service.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectService(service.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:gap-2 transition-all cursor-pointer"
                    >
                      <span>
                        {isSelected
                          ? lang === 'ar'
                            ? 'معروض بالأعلى'
                            : lang === 'fr'
                              ? 'Affiché en haut'
                              : 'Viewing Above'
                          : t('services.more')}
                      </span>
                      <Arrow className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[10px] text-slate-400 font-mono">ISO 17025</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split Mobile Field Laboratory Feature Section (Preserved) */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 mb-12 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'المختبرات الميدانية المتنقلة' : lang === 'fr' ? 'Laboratoires Mobiles de Terrain' : 'Mobile Field Laboratories'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
                {lang === 'ar'
                  ? 'أسطول التدخل السريع والفحص الميداني الفوري لمصادر المياه'
                  : lang === 'fr'
                    ? 'Flotte d’intervention rapide et contrôle immédiat sur site'
                    : 'Rapid Response Fleet & Immediate On-Site Potability Verification'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'مركبات مجهزة بأحدث أدوات القياس الفوري للطوارئ والمواسم، قادرة على الانتقال السريع إلى السدود ومحطات الضخ وخزانات التوزيع لتقييم جودة المياه وإجراء الفحوصات العاجلة.'
                  : lang === 'fr'
                    ? 'Unités mobiles équipées des instruments de pointe pour les urgences et interventions saisonnières, capables de se déployer rapidement vers les barrages, stations de pompage et réservoirs.'
                    : 'Custom-fitted specialized mobile units equipped with real-time test instrumentation for emergency response, field monitoring, and rapid potability screening across Southern sector facilities.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('cs.register')}</span>
                </Link>
                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('cs.enquiry')}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-900">
                <img
                  src={siteMedia.mobileLabCar || siteMedia.fieldAction}
                  alt="Mobile Laboratory Vehicle"
                  className="w-full h-64 sm:h-72 object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
