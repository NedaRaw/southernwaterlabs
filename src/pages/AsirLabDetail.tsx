import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  MapPin,
  Clock,
  Phone,
  Building2,
  UserPlus,
  Send,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Droplets,
  FlaskConical,
  Layers,
  Navigation,
  Copy,
  Check,
  Eye,
  X,
  Truck,
  Microscope,
  Camera,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import nwcLogo from '@/assets/images/nwc-logo.png';

import labAsirBuilding from '@/assets/images/lab_asir_central_1790236943444.jpg';
import asirWaterLabFacility from '@/assets/images/asir_water_lab_facility_1790161189942.jpg';
import asirMobileVan from '@/assets/images/asir-lab-van5.jpg';

import asirWaterLab1 from '@/assets/images/asir-waterlab1.jpg';
import asirWaterLab2 from '@/assets/images/asir-waterlab2.jpg';
import asirWaterLab3 from '@/assets/images/asir-waterlab3.jpg';
import asirWaterLab4 from '@/assets/images/asir-waterlab4.jpg';

import cadeauAsir from '@/assets/images/cadeau-asir.jpg';
import labAsirEnf from '@/assets/images/lab-asir-enf.jpg';
import laboAsir from '@/assets/images/labo-asir.jpg';

import sloganAsir from '@/assets/images/slogon-assir.jpg';

type Lang = 'ar' | 'en' | 'fr';

type ImageItem = {
  src: string;
  title: Record<Lang, string>;
  description?: Record<Lang, string>;
};

const labCoordinates = {
  lat: 18.2501569,
  lng: 42.5996342,
  dms: `18°15'00.6"N 42°35'58.7"E`,
  decimal: '18.250157, 42.599634',
  plusCode: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
  mapsUrl: 'https://maps.app.goo.gl/s4pP9yp98rcRT3Xv9',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=18.2501569,42.5996342',
  xAccountUrl: 'https://x.com/cen_lab',
};

const translations: Record<Lang, Record<string, string>> = {
  ar: {
    officialTitle:
      'المختبر المركزي للمياه بالمنطقة الجنوبية - منطقة عسير',
    shortTitle: 'المختبر المركزي لعسير',
    institutionalAffiliation:
      'القطاع الجنوبي للمختبرات البيئية ومختبرات المياه',
    tagline:
      'التميز في الفحوصات والتحاليل المخبرية لجودة المياه والبيئة',
    mewaBadge: 'وزارة البيئة والمياه والزراعة',
    centralBadge: 'مختبر مركزي',
    region: 'منطقة عسير',
    hours: 'الأحد – الخميس | 8:30 ص – 3:15 م',
    affiliation: 'القطاع الجنوبي',

    registerVisit: 'تسجيل زيارة',
    takeSurvey: 'المشاركة في الاستبيان',
    sendEnquiry: 'إرسال استفسار',

    aboutHeading: 'عن المختبر',
    aboutSub: 'المختبر المركزي للمياه بالمنطقة الجنوبية - عسير',
    aboutText:
      'يقدم المختبر المركزي بعسير خدمات متخصصة في فحص وتحليل عينات المياه والبيئة، وفق منهجيات علمية ومعايير جودة معتمدة، لدعم موثوقية النتائج وسلامة الموارد المائية وحماية البيئة.',

    buildingBadge: 'المبنى الرئيسي',
    facilityBadge: 'منشأة مخبرية متخصصة',
    facilityDesc:
      'بيئة مخبرية متكاملة مجهزة بأحدث أدوات القياس والتحليل وأجهزة التحليل الطيفي والكروماتوغرافي.',
    mobileBadge: 'الوحدة الميدانية المتنقلة',
    mobileDesc:
      'وحدة ميدانية متنقلة لإجراء الفحوصات العاجلة وجمع العينات وفق الاشتراطات المعتمدة وسلسلة الحيازة.',

    clickToEnlarge: 'اضغط على الصورة للتكبير',

    activitiesHeading: 'أهم الأنشطة والخدمات',
    activitiesSub:
      'قدرات مخبرية وميدانية لدعم جودة المياه والرقابة البيئية',

    waterTesting: 'فحوصات جودة مياه الشرب',
    waterTestingDesc:
      'تحليل العينات والتحقق من مؤشرات جودة وسلامة مياه الشرب.',
    labAnalysis: 'التحاليل المخبرية',
    labAnalysisDesc:
      'إجراء التحاليل الكيميائية والفيزيائية والميكروبيولوجية وفق الإجراءات المعتمدة.',
    fieldOperations: 'العمليات والفحوصات الميدانية',
    fieldOperationsDesc:
      'جمع العينات وتنفيذ الفحوصات الميدانية باستخدام التجهيزات المتخصصة.',
    quality: 'ضمان ومراقبة الجودة',
    qualityDesc:
      'تطبيق أنظمة الجودة والتحقق من موثوقية النتائج ودقة القياسات.',

    branchesHeading: 'الفروع التابعة للمختبر',
    branchesSub:
      'تغطية مخبرية وميدانية لخدمة مناطق مختلفة ضمن منطقة عسير',

    bishaTitle: 'فرع بيشة',
    bishaDesc:
      'فرع تابع للمختبر المركزي بعسير لدعم أعمال الفحص والتحليل وخدمات العينات في محافظة بيشة.',
    goToBisha: 'زيارة صفحة فرع بيشة',

    mahayelTitle: 'فرع محايل',
    mahayelDesc:
      'فرع تابع للمختبر المركزي بعسير لتقديم خدمات الفحص والتحليل ودعم العمليات الميدانية في محايل.',
    goToMahayel: 'زيارة صفحة فرع محايل',

    locationHeading: 'الموقع',
    address: 'العنوان',
    district: 'حي المحالة، أبها، منطقة عسير، المملكة العربية السعودية',
    mapHeading: 'الموقع على الخريطة',
    interactiveMapHeading: 'الموقع الجغرافي للمختبر المركزي بعسير',
    coordinates: 'الإحداثيات',
    copyCoordinates: 'نسخ الإحداثيات',
    copied: 'تم النسخ',
    directions: 'الحصول على الاتجاهات',
    openMaps: 'فتح في خرائط Google',
    locationNotice:
      'الإحداثيات المعروضة تشير إلى الموقع الرسمي للمختبر المركزي بعسير.',

    contactHeading: 'التواصل',
    directPhone: 'الهاتف المباشر',
    workingHours: 'أوقات العمل',
    xAccount: 'الحساب الرسمي على X',

    visitorServices: 'خدمات الزوار',
    visitorServicesSub:
      'يمكنكم استخدام الخدمات الإلكترونية التالية للتواصل مع المختبر',

    posterHeading: 'المعلومة المؤسسية',
    posterDescription:
      'مواد وصور مؤسسية مرتبطة بالمختبر المركزي لمنطقة عسير.',

    previous: 'الصورة السابقة',
    next: 'الصورة التالية',
    close: 'إغلاق',
    image: 'صورة',
    of: 'من',

    iso: 'ISO/IEC 17025:2017',
    sac: 'اعتماد SAC',
  },

  en: {
    officialTitle:
      'Central Water Laboratory - Southern Sector - Asir Region',
    shortTitle: 'Asir Central Laboratory',
    institutionalAffiliation:
      'Southern Sector Environmental & Water Laboratories',
    tagline:
      'Excellence in laboratory testing and analysis of water and environmental quality',
    mewaBadge: 'Ministry of Environment, Water and Agriculture',
    centralBadge: 'Central Laboratory',
    region: 'Asir Region',
    hours: 'Sunday – Thursday | 8:30 AM – 3:15 PM',
    affiliation: 'Southern Sector',

    registerVisit: 'Register as a Visitor',
    takeSurvey: 'Take Survey',
    sendEnquiry: 'Send Enquiry',

    aboutHeading: 'About the Laboratory',
    aboutSub: 'Central Water Laboratory - Asir Region',
    aboutText:
      'The Asir Central Laboratory provides specialized testing and analysis services for water and environmental samples using scientific methodologies and recognized quality standards to support reliable results, water safety and environmental protection.',

    buildingBadge: 'Main Building',
    facilityBadge: 'Specialized Laboratory Facility',
    facilityDesc:
      'An integrated laboratory environment equipped with advanced measurement and analytical instruments, including spectroscopic and chromatographic systems.',
    mobileBadge: 'Mobile Field Unit',
    mobileDesc:
      'A mobile field unit for urgent testing and sample collection in accordance with approved requirements and chain-of-custody procedures.',

    clickToEnlarge: 'Click the image to enlarge',

    activitiesHeading: 'Main Activities & Services',
    activitiesSub:
      'Laboratory and field capabilities supporting water quality and environmental monitoring',

    waterTesting: 'Drinking Water Quality Testing',
    waterTestingDesc:
      'Sample analysis and verification of drinking-water quality and safety indicators.',
    labAnalysis: 'Laboratory Analysis',
    labAnalysisDesc:
      'Chemical, physical and microbiological analyses using approved procedures.',
    fieldOperations: 'Field Operations & Testing',
    fieldOperationsDesc:
      'Sample collection and field testing using specialized equipment.',
    quality: 'Quality Assurance & Control',
    qualityDesc:
      'Implementation of quality systems and verification of measurement accuracy and result reliability.',

    branchesHeading: 'Laboratory Branches',
    branchesSub:
      'Laboratory and field coverage supporting different areas of Asir Region',

    bishaTitle: 'Bisha Branch',
    bishaDesc:
      'A branch of the Asir Central Laboratory supporting testing, analysis and sample services in Bisha Governorate.',
    goToBisha: 'Visit Bisha Branch',

    mahayelTitle: 'Mahayel Branch',
    mahayelDesc:
      'A branch of the Asir Central Laboratory providing testing, analysis and field-operation support in Mahayel.',
    goToMahayel: 'Visit Mahayel Branch',

    locationHeading: 'Location',
    address: 'Address',
    district:
      'Al-Mahalah District, Abha, Asir Region, Saudi Arabia',
    mapHeading: 'Location on Map',
    interactiveMapHeading:
      'Geographical location of Asir Central Laboratory',
    coordinates: 'Coordinates',
    copyCoordinates: 'Copy coordinates',
    copied: 'Copied',
    directions: 'Get Directions',
    openMaps: 'Open in Google Maps',
    locationNotice:
      'The displayed coordinates indicate the official location of the Asir Central Laboratory.',

    contactHeading: 'Contact',
    directPhone: 'Direct Phone',
    workingHours: 'Working Hours',
    xAccount: 'Official X Account',

    visitorServices: 'Visitor Services',
    visitorServicesSub:
      'Use the following electronic services to communicate with the laboratory',

    posterHeading: 'Institutional Information',
    posterDescription:
      'Institutional material and imagery related to the Asir Central Laboratory.',

    previous: 'Previous image',
    next: 'Next image',
    close: 'Close',
    image: 'Image',
    of: 'of',

    iso: 'ISO/IEC 17025:2017',
    sac: 'SAC Accreditation',
  },

  fr: {
    officialTitle:
      'Laboratoire central de l’eau - Secteur Sud - Région d’Asir',
    shortTitle: 'Laboratoire central d’Asir',
    institutionalAffiliation:
      'Laboratoires environnementaux et de l’eau du secteur Sud',
    tagline:
      'Excellence dans les analyses et les essais de la qualité de l’eau et de l’environnement',
    mewaBadge:
      'Ministère de l’Environnement, de l’Eau et de l’Agriculture',
    centralBadge: 'Laboratoire central',
    region: 'Région d’Asir',
    hours: 'Dimanche – jeudi | 08h30 – 15h15',
    affiliation: 'Secteur Sud',

    registerVisit: 'Enregistrer une visite',
    takeSurvey: 'Répondre au sondage',
    sendEnquiry: 'Envoyer une demande',

    aboutHeading: 'À propos du laboratoire',
    aboutSub: 'Laboratoire central de l’eau - Région d’Asir',
    aboutText:
      'Le Laboratoire central d’Asir fournit des services spécialisés d’essais et d’analyse des échantillons d’eau et d’environnement selon des méthodologies scientifiques et des normes de qualité reconnues.',

    buildingBadge: 'Bâtiment principal',
    facilityBadge: 'Installation de laboratoire spécialisée',
    facilityDesc:
      'Un environnement de laboratoire intégré équipé d’instruments modernes de mesure et d’analyse, notamment des systèmes spectroscopiques et chromatographiques.',
    mobileBadge: 'Unité mobile de terrain',
    mobileDesc:
      'Une unité mobile destinée aux analyses urgentes et au prélèvement d’échantillons conformément aux exigences approuvées et à la chaîne de traçabilité.',

    clickToEnlarge: 'Cliquer sur l’image pour l’agrandir',

    activitiesHeading: 'Principales activités et services',
    activitiesSub:
      'Capacités de laboratoire et de terrain pour le contrôle de la qualité de l’eau et de l’environnement',

    waterTesting: 'Analyses de la qualité de l’eau potable',
    waterTestingDesc:
      'Analyse des échantillons et vérification des indicateurs de qualité et de sécurité de l’eau potable.',
    labAnalysis: 'Analyses de laboratoire',
    labAnalysisDesc:
      'Analyses chimiques, physiques et microbiologiques selon les procédures approuvées.',
    fieldOperations: 'Opérations et essais sur le terrain',
    fieldOperationsDesc:
      'Prélèvement des échantillons et réalisation des essais sur le terrain avec des équipements spécialisés.',
    quality: 'Assurance et contrôle qualité',
    qualityDesc:
      'Application des systèmes qualité et vérification de la précision des mesures et de la fiabilité des résultats.',

    branchesHeading: 'Branches du laboratoire',
    branchesSub:
      'Couverture des services de laboratoire et de terrain dans différentes zones d’Asir',

    bishaTitle: 'Branche de Bisha',
    bishaDesc:
      'Branche du Laboratoire central d’Asir assurant les analyses, essais et services liés aux échantillons à Bisha.',
    goToBisha: 'Voir la branche de Bisha',

    mahayelTitle: 'Branche de Mahayel',
    mahayelDesc:
      'Branche du Laboratoire central d’Asir assurant les analyses et le soutien aux opérations de terrain à Mahayel.',
    goToMahayel: 'Voir la branche de Mahayel',

    locationHeading: 'Localisation',
    address: 'Adresse',
    district:
      'Quartier Al-Mahalah, Abha, région d’Asir, Arabie saoudite',
    mapHeading: 'Localisation sur la carte',
    interactiveMapHeading:
      'Localisation géographique du Laboratoire central d’Asir',
    coordinates: 'Coordonnées',
    copyCoordinates: 'Copier les coordonnées',
    copied: 'Copié',
    directions: 'Itinéraire',
    openMaps: 'Ouvrir dans Google Maps',
    locationNotice:
      'Les coordonnées affichées correspondent à l’emplacement officiel du Laboratoire central d’Asir.',

    contactHeading: 'Contact',
    directPhone: 'Téléphone direct',
    workingHours: 'Heures de travail',
    xAccount: 'Compte officiel sur X',

    visitorServices: 'Services visiteurs',
    visitorServicesSub:
      'Utilisez les services électroniques suivants pour contacter le laboratoire',

    posterHeading: 'Informations institutionnelles',
    posterDescription:
      'Supports et images institutionnels liés au Laboratoire central d’Asir.',

    previous: 'Image précédente',
    next: 'Image suivante',
    close: 'Fermer',
    image: 'Image',
    of: 'sur',

    iso: 'ISO/IEC 17025:2017',
    sac: 'Accréditation SAC',
  },
};

const album: ImageItem[] = [
  {
    src: labAsirBuilding,
    title: {
      ar: 'المبنى الرئيسي للمختبر المركزي بعسير',
      en: 'Asir Central Laboratory Main Building',
      fr: 'Bâtiment principal du Laboratoire central d’Asir',
    },
  },
  {
    src: asirWaterLabFacility,
    title: {
      ar: 'المنشأة المخبرية',
      en: 'Laboratory Facility',
      fr: 'Installation du laboratoire',
    },
  },
  {
    src: asirMobileVan,
    title: {
      ar: 'الوحدة الميدانية المتنقلة',
      en: 'Mobile Field Unit',
      fr: 'Unité mobile de terrain',
    },
  },
  {
    src: asirWaterLab1,
    title: {
      ar: 'منشآت وتجهيزات المختبر',
      en: 'Laboratory Facilities and Equipment',
      fr: 'Installations et équipements',
    },
  },
  {
    src: asirWaterLab2,
    title: {
      ar: 'بيئة العمل المخبرية',
      en: 'Laboratory Working Environment',
      fr: 'Environnement de travail du laboratoire',
    },
  },
  {
    src: asirWaterLab3,
    title: {
      ar: 'التجهيزات والتحاليل',
      en: 'Laboratory Equipment and Analysis',
      fr: 'Équipements et analyses',
    },
  },
  {
    src: asirWaterLab4,
    title: {
      ar: 'المرافق المخبرية',
      en: 'Laboratory Facilities',
      fr: 'Installations du laboratoire',
    },
  },
  {
    src: cadeauAsir,
    title: {
      ar: 'المختبر المركزي بعسير',
      en: 'Asir Central Laboratory',
      fr: 'Laboratoire central d’Asir',
    },
  },
  {
    src: labAsirEnf,
    title: {
      ar: 'المختبر والبيئة المحيطة',
      en: 'Laboratory and Surroundings',
      fr: 'Laboratoire et environnement',
    },
  },
  {
    src: laboAsir,
    title: {
      ar: 'منشأة المختبر',
      en: 'Laboratory Facility',
      fr: 'Installation du laboratoire',
    },
  },
];

export default function AsirLabDetail() {
  const { lang } = useLang();

  const currentLang: Lang =
    lang === 'ar' || lang === 'fr' ? lang : 'en';

  const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  const t = translations[currentLang];

  const [currentImage, setCurrentImage] = useState(0);

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(
    null,
  );

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % album.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }

      if (event.key === 'ArrowLeft') {
        setCurrentImage((prev) =>
          currentLang === 'ar'
            ? (prev + 1) % album.length
            : (prev - 1 + album.length) % album.length,
        );
      }

      if (event.key === 'ArrowRight') {
        setCurrentImage((prev) =>
          currentLang === 'ar'
            ? (prev - 1 + album.length) % album.length
            : (prev + 1) % album.length,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, currentLang]);

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + album.length) % album.length);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % album.length);
  };

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(labCoordinates.decimal);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const currentAlbumImage = album[currentImage];

  return (
    <div
      dir={dir}
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      <Breadcrumb
        items={[
          {
            label:
              currentLang === 'ar'
                ? 'المختبرات'
                : currentLang === 'fr'
                  ? 'Laboratoires'
                  : 'Laboratories',
            href: '/laboratories',
          },
          {
            label: t.shortTitle,
          },
        ]}
      />
      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-12">

            {/* Hero text */}
            <div className="text-white lg:col-span-8">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  {t.iso}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  {t.sac}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
                  <Building2 className="h-4 w-4" />
                  {t.centralBadge}
                </span>
              </div>

              <p className="mb-3 text-sm font-semibold tracking-wide text-cyan-300">
                {t.institutionalAffiliation}
              </p>

              {/* Smaller title */}
              <h1 className="max-w-3xl text-xl font-black leading-[1.35] sm:text-2xl lg:text-3xl">
                {t.officialTitle}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-blue-100 sm:text-lg">
                {t.tagline}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4" />
                  {t.registerVisit}
                </Link>

                <Link
                  to="/survey"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ClipboardList className="h-4 w-4" />
                  {t.takeSurvey}
                </Link>

                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Send className="h-4 w-4" />
                  {t.sendEnquiry}
                </Link>
              </div>
            </div>

            {/* Logo Emblem Container */}
            <div className="flex justify-center lg:col-span-4">
              <div className="flex w-full max-w-sm items-center justify-center rounded-3xl bg-white/95 p-5 shadow-2xl ring-1 ring-white/30 backdrop-blur-md dark:bg-slate-900/90 sm:p-6">
                
                <div className="flex h-60 w-60 items-center justify-center sm:h-64 sm:w-64">
                  <img
                    src={nwcLogo}
                    alt={t.officialTitle}
                    className="block h-full w-full object-contain"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ====================================================== */}
      {/* KEY INFORMATION STRIP */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-4 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8 dark:divide-slate-800">
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.region}
              </p>
              <p className="font-bold">{t.shortTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.workingHours}
              </p>
              <p className="text-sm font-bold">{t.hours}</p>
            </div>
          </div>

          <a
            href={labCoordinates.xAccountUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <ExternalLink className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.xAccount}
              </p>
              <p className="font-bold">@cen_lab</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.institutionalAffiliation}
              </p>
              <p className="font-bold">{t.affiliation}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ABOUT + ALBUM */}
      {/* ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              {t.centralBadge}
            </span>

            <h2 className="text-3xl font-black sm:text-4xl">
              {t.aboutHeading}
            </h2>

            <p className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-400">
              {t.aboutSub}
            </p>

            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
              {t.aboutText}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Album */}
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(currentAlbumImage)}
                    className="group absolute inset-0 z-10 h-full w-full cursor-zoom-in"
                    aria-label={t.clickToEnlarge}
                  >
                    <img
                      src={currentAlbumImage.src}
                      alt={currentAlbumImage.title[currentLang]}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-start text-white">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                        <Camera className="h-4 w-4" />
                        {t.clickToEnlarge}
                      </div>

                      <h3 className="mt-1 text-lg font-black">
                        {currentAlbumImage.title[currentLang]}
                      </h3>
                    </div>
                  </button>

                  {/* Previous */}
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label={t.previous}
                    className="absolute start-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    {currentLang === 'ar' ? (
                      <ChevronRight className="h-5 w-5" />
                    ) : (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>

                  {/* Next */}
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label={t.next}
                    className="absolute end-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    {currentLang === 'ar' ? (
                      <ChevronLeft className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>

                  <div className="absolute end-4 top-4 z-20 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    {currentImage + 1} {t.of} {album.length}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto p-4">
                  {album.map((item, index) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setCurrentImage(index)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ${
                        index === currentImage
                          ? 'ring-2 ring-blue-600'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.title[currentLang]}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Poster */}
            <div className="lg:col-span-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={sloganAsir}
                    alt={t.posterHeading}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase">
                      {t.posterHeading}
                    </span>
                  </div>

                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {t.posterDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ACTIVITIES */}
      {/* ====================================================== */}

      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-black sm:text-4xl">
              {t.activitiesHeading}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
              {t.activitiesSub}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-5 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Droplets className="h-6 w-6" />
              </div>

              <h3 className="font-black">{t.waterTesting}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t.waterTestingDesc}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-5 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <FlaskConical className="h-6 w-6" />
              </div>

              <h3 className="font-black">{t.labAnalysis}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t.labAnalysisDesc}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-5 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Truck className="h-6 w-6" />
              </div>

              <h3 className="font-black">{t.fieldOperations}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t.fieldOperationsDesc}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-5 inline-flex rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Microscope className="h-6 w-6" />
              </div>

              <h3 className="font-black">{t.quality}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t.qualityDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BRANCHES */}
      {/* ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-black sm:text-4xl">
              {t.branchesHeading}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
              {t.branchesSub}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bisha */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-black">{t.bishaTitle}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t.bishaDesc}
              </p>

              <Link
                to="/laboratories/asir/bisha"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400"
              >
                {t.goToBisha}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            {/* Mahayel */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <Layers className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-black">{t.mahayelTitle}</h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t.mahayelDesc}
              </p>

              <Link
                to="/laboratories/asir/mahayel"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-400"
              >
                {t.goToMahayel}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* LOCATION */}
      {/* ====================================================== */}

      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-black sm:text-4xl">
              {t.locationHeading}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Map */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
              <div className="relative aspect-video">
                <iframe
                  title={t.interactiveMapHeading}
                  src={`https://www.google.com/maps?q=${labCoordinates.lat},${labCoordinates.lng}&z=16&output=embed`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Location info */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-black">{t.address}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {t.district}
                  </p>
                </div>
              </div>

              <div className="my-7 h-px bg-slate-200 dark:bg-slate-800" />

              <h3 className="font-black">{t.coordinates}</h3>

              <div className="mt-4 rounded-2xl bg-white p-4 dark:bg-slate-900">
                <p className="font-mono text-sm text-slate-700 dark:text-slate-200">
                  {labCoordinates.decimal}
                </p>

                <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {labCoordinates.dms}
                </p>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {labCoordinates.plusCode}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}

                  {copied ? t.copied : t.copyCoordinates}
                </button>

                <a
                  href={labCoordinates.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  <Navigation className="h-4 w-4" />
                  {t.directions}
                </a>

                <a
                  href={labCoordinates.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.openMaps}
                </a>
              </div>

              <p className="mt-6 text-xs leading-6 text-slate-500 dark:text-slate-400">
                {t.locationNotice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CONTACT */}
      {/* ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-black sm:text-4xl">
              {t.contactHeading}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <a
              href="tel:+966172241018"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <Phone className="h-6 w-6 text-blue-700 dark:text-blue-400" />

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                {t.directPhone}
              </p>

              <p className="mt-1 font-bold" dir="ltr">
                +966 17 224 1018
              </p>
            </a>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Clock className="h-6 w-6 text-blue-700 dark:text-blue-400" />

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                {t.workingHours}
              </p>

              <p className="mt-1 font-bold">{t.hours}</p>
            </div>

            <a
              href={labCoordinates.xAccountUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <ExternalLink className="h-6 w-6 text-blue-700 dark:text-blue-400" />

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                {t.xAccount}
              </p>

              <p className="mt-1 font-bold">@cen_lab</p>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* VISITOR SERVICES */}
      {/* ====================================================== */}

      <section className="bg-gradient-to-br from-blue-950 to-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black sm:text-4xl">
              {t.visitorServices}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-blue-100">
              {t.visitorServicesSub}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              to="/register"
              className="group rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <UserPlus className="h-7 w-7 text-cyan-300" />

              <h3 className="mt-5 text-lg font-black">
                {t.registerVisit}
              </h3>

              <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            <Link
              to="/survey"
              className="group rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <ClipboardList className="h-7 w-7 text-cyan-300" />

              <h3 className="mt-5 text-lg font-black">
                {t.takeSurvey}
              </h3>

              <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>

            <Link
              to="/enquiry"
              className="group rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <Send className="h-7 w-7 text-cyan-300" />

              <h3 className="mt-5 text-lg font-black">
                {t.sendEnquiry}
              </h3>

              <ArrowRight className="mt-5 h-5 w-5 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* IMAGE MODAL */}
      {/* ====================================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title[currentLang]}
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label={t.close}
            className="absolute end-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title[currentLang]}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <div className="mt-4 flex items-center justify-center gap-2 text-center text-white">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-semibold">
                {selectedImage.title[currentLang]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}