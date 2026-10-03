import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
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
} from 'lucide-react';

import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import AsirLabLogo from '@/components/AsirLabLogo';

// ============================================================
// AUTHENTIC OFFICIAL ASIR CENTRAL LABORATORY ASSETS
// ============================================================

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

// IMPORTANT:
// This image is NOT part of the laboratory photo album.
// It is an institutional poster.
import sloganAsir from '@/assets/images/slogon-assir.jpg';


// ============================================================
// COMPONENT
// ============================================================

export default function AsirLabDetail() {
  const { lang } = useLang();

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // ============================================================
  // TRANSLATIONS
  // ============================================================

  const tText = {
    officialTitle: {
      ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير',
      en: 'Asir Central Laboratory for Drinking Water and Environmental Services',
      fr: "Laboratoire central des eaux potables et des services environnementaux de la région d'Asir",
    }[lang],

    shortTitle: {
      ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بعسير',
      en: 'Asir Central Drinking Water & Environmental Laboratory',
      fr: "Laboratoire central des eaux potables et de l'environnement d'Asir",
    }[lang],

    institutionalAffiliation: {
      ar: 'وزارة البيئة والمياه والزراعة – الإدارة العامة لخدمات المياه بعسير – المختبر المركزي',
      en: 'Ministry of Environment, Water and Agriculture – General Directorate of Water Services in Asir – Central Laboratory',
      fr: "Ministère de l'Environnement, de l'Eau et de l'Agriculture – Direction générale des services de l'eau d'Asir – Laboratoire central",
    }[lang],

    tagline: {
      ar: 'فحص وتحليل جودة مياه الشرب والمصادر المائية والتحقق من مطابقتها للمواصفات والمعايير المعتمدة',
      en: 'Testing and analysis of drinking water quality and water sources to verify compliance with applicable standards',
      fr: "Contrôle et analyse de la qualité des eaux potables et des sources d'eau pour vérifier leur conformité aux normes",
    }[lang],

    mewaBadge: {
      ar: 'وزارة البيئة والمياه والزراعة – خدمات المياه بعسير',
      en: 'Ministry of Environment, Water & Agriculture – Asir Water Services',
      fr: "Ministère de l'Environnement, de l'Eau et de l'Agriculture – Services de l'Eau d'Asir",
    }[lang],

    centralBadge: {
      ar: 'المختبر المركزي – منطقة عسير',
      en: 'Central Laboratory – Asir Region',
      fr: "Laboratoire Central – Région d'Asir",
    }[lang],

    statRegionVal: {
      ar: 'منطقة عسير',
      en: 'Asir Region',
      fr: "Région d'Asir",
    }[lang],

    statRegionSub: {
      ar: 'المقر الرئيسي بأبها',
      en: 'Headquarters in Abha',
      fr: 'Siège à Abha',
    }[lang],

    statRegionDesc: {
      ar: 'المحالة، أبها والمحافظات التابعة',
      en: 'Al-Mahalah, Abha & Provinces',
      fr: 'Al-Mahalah, Abha et provinces',
    }[lang],

    statHoursVal: '8:30 – 15:15',

    statHoursSub: {
      ar: 'أوقات العمل الرسمية',
      en: 'Official Working Hours',
      fr: 'Horaires Officiels',
    }[lang],

    statHoursDesc: {
      ar: 'الأحد إلى الخميس',
      en: 'Sunday to Thursday',
      fr: 'Du dimanche au jeudi',
    }[lang],

    statXVal: '@cen_lab',

    statXSub: {
      ar: 'الحساب الرسمي على X',
      en: 'Official X Account',
      fr: 'Compte Officiel X',
    }[lang],

    statXDesc: {
      ar: 'متابعة التحديثات الميدانية',
      en: 'Follow Official Updates',
      fr: 'Actualités officielles',
    }[lang],

    statAffilVal: {
      ar: 'خدمات المياه',
      en: 'Water Services',
      fr: "Services de l'Eau",
    }[lang],

    statAffilSub: {
      ar: 'الإدارة العامة بعسير',
      en: 'General Directorate in Asir',
      fr: "Direction Générale d'Asir",
    }[lang],

    statAffilDesc: {
      ar: 'وزارة البيئة والمياه والزراعة',
      en: 'Ministry of Environment, Water & Agriculture',
      fr: "Ministère de l'Environnement",
    }[lang],

    registerVisit: {
      ar: 'تسجيل زيارة للمختبر',
      en: 'Register as a Visitor',
      fr: 'Réserver une Visite',
    }[lang],

    takeSurvey: {
      ar: 'استبيان رضا المستفيدين',
      en: 'Beneficiary Survey',
      fr: 'Enquête de Satisfaction',
    }[lang],

    sendEnquiry: {
      ar: 'إرسال استفسار',
      en: 'Send Enquiry',
      fr: 'Envoyer une Demande',
    }[lang],

    aboutHeading: {
      ar: 'عن المختبر المركزي بعسير',
      en: 'About Asir Central Laboratory',
      fr: "À Propos du Laboratoire Central d'Asir",
    }[lang],

    aboutSub: {
      ar: 'المرجع الفني المتخصص لفحص مياه الشرب والرقابة البيئية بمنطقة عسير',
      en: 'Specialized institutional reference for drinking water testing and environmental oversight in Asir',
      fr: "Référence institutionnelle spécialisée pour l'analyse des eaux potables et la veille environnementale en Asir",
    }[lang],

    aboutText: {
      ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير تابع للإدارة العامة لخدمات المياه بعسير بوزارة البيئة والمياه والزراعة، ويختص بفحص وتحليل جودة مياه الشرب والمصادر المائية، وإجراء الفحوصات المخبرية اللازمة للتحقق من مطابقة المياه للمواصفات والمعايير المعتمدة.',
      en: 'The Asir Central Laboratory for Drinking Water and Environmental Services operates under the General Administration of Water Services in Asir at the Ministry of Environment, Water and Agriculture. The laboratory performs testing and analysis of drinking water and water sources and conducts laboratory examinations to verify compliance with applicable standards and requirements.',
      fr: "Le Laboratoire central des eaux potables et des services environnementaux de la région d'Asir relève de l'Administration générale des services de l'eau d'Asir au sein du ministère de l'Environnement, de l'Eau et de l'Agriculture. Il réalise des analyses des eaux potables et des sources d'eau ainsi que les contrôles nécessaires pour vérifier leur conformité aux normes et exigences applicables.",
    }[lang],

    buildingBadge: {
      ar: 'المقر والمبنى الرئيسي للمختبر المركزي – المحالة، أبها',
      en: 'Main Building & Laboratory Facility – Al-Mahalah, Abha',
      fr: 'Bâtiment et Siège Principal du Laboratoire – Al-Mahalah, Abha',
    }[lang],

    facilityBadge: {
      ar: 'بيئة الفحوصات والتحاليل المخبرية – عسير',
      en: 'Laboratory Testing & Quality Analysis Environment – Asir',
      fr: "Environnement d'Analyses et Contrôles – Asir",
    }[lang],

    facilityDesc: {
      ar: 'تجهيزات مخبرية متقدمة لقياس جودة مياه الشرب ومطابقة المعايير والمواصفات القياسية المعتمدة.',
      en: 'Advanced analytical equipment for testing drinking water quality and verifying official standards.',
      fr: "Équipements analytiques de pointe pour le contrôle de la qualité de l'eau et la conformité aux normes.",
    }[lang],

    mobileBadge: {
      ar: 'الوحدة المخبرية المتنقلة والعمليات الميدانية – عسير',
      en: 'Mobile Laboratory Unit & Regional Field Operations – Asir',
      fr: 'Unité Mobile et Opérations Régionales de Terrain – Asir',
    }[lang],

    mobileDesc: {
      ar: 'وحدة مخبرية مجهزة للتحليل الميداني السريع لعينات المياه في المحافظات والمصادر المائية المختلفة بمنطقة عسير.',
      en: 'Equipped mobile unit for rapid on-site water quality analysis across governorates and regional water sources in Asir.',
      fr: "Unité mobile équipée pour les prélèvements et analyses rapides in situ à travers les gouvernorats d'Asir.",
    }[lang],

    clickToEnlarge: {
      ar: 'انقر للتكبير والمعاينة',
      en: 'Click to view full image',
      fr: 'Cliquer pour agrandir',
    }[lang],

    activitiesHeading: {
      ar: 'الأنشطة والمهام المخبرية الرئيسية',
      en: 'Main Laboratory Activities',
      fr: 'Activités et Missions Principales',
    }[lang],

    activitiesSub: {
      ar: 'المهام الأساسية المعتمدة لفحص ومراقبة جودة مياه الشرب والمصادر المائية',
      en: 'Verified core activities for drinking water quality testing and water source surveillance',
      fr: 'Missions fondamentales vérifiées pour le contrôle et la surveillance des eaux potables',
    }[lang],

    branchesHeading: {
      ar: 'الفروع والمراكز التابعة بالمنطقة',
      en: 'Affiliated Regional Branches',
      fr: 'Agences et Centres Affiliés',
    }[lang],

    branchesSub: {
      ar: 'منظومة الفروع التابعة للمختبر المركزي لخدمة محافظات منطقة عسير',
      en: 'Branch network operating under Asir Central Laboratory across regional governorates',
      fr: "Réseau d'agences rattachées au Laboratoire Central pour desservir la région d'Asir",
    }[lang],

    bishaTitle: {
      ar: 'مختبر فرع بيشة',
      en: 'Bisha Branch Laboratory',
      fr: 'Laboratoire de la branche de Bisha',
    }[lang],

    bishaDesc: {
      ar: 'فرع بيشة التابع للمختبر المركزي لعسير، يخدم محافظة بيشة والمناطق المحيطة بها في إجراء فحوصات مياه الشرب والآبار.',
      en: 'Bisha branch operating under Asir Central Laboratory, serving Bisha governorate and neighboring municipal districts.',
      fr: "Agence de Bisha rattachée au Laboratoire Central d'Asir, desservant le gouvernorat de Bisha et les communes limitrophes.",
    }[lang],

    goToBisha: {
      ar: 'صفحة فرع بيشة',
      en: 'View Bisha Branch Page',
      fr: 'Consulter la branche de Bisha',
    }[lang],

    mahayelTitle: {
      ar: 'مختبر فرع محايل',
      en: 'Mahayel Branch Laboratory',
      fr: 'Laboratoire de la branche de Mahayel',
    }[lang],

    mahayelDesc: {
      ar: 'فرع محايل التابع للمختبر المركزي لعسير، يخدم محافظة محايل عسير والمناطق المجاورة في متابعة جودة الإمدادات المائية.',
      en: 'Mahayel branch operating under Asir Central Laboratory, serving Mahayel governorate in water quality monitoring.',
      fr: 'Agence de Mahayel rattachée au Laboratoire Central d\'Asir, desservant le gouvernorat de Mahayel et ses environs.',
    }[lang],

    goToMahayel: {
      ar: 'صفحة فرع محايل',
      en: 'View Mahayel Branch Page',
      fr: 'Consulter la branche de Mahayel',
    }[lang],

    locationHeading: {
      ar: 'الموقع والعنوان المعتمد',
      en: 'Official Location & Address',
      fr: 'Localisation & Adresse Officielle',
    }[lang],

    officialAddress: {
      ar: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
      en: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
      fr: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
    }[lang],

    locationDistrict: {
      ar: 'المحالة، أبها، منطقة عسير، المملكة العربية السعودية',
      en: 'Al-Mahalah, Abha, Asir Region, Saudi Arabia',
      fr: "Al-Mahalah, Abha, région d'Asir, Arabie saoudite",
    }[lang],

    openMapBtn: {
      ar: 'فتح الموقع في Google Maps',
      en: 'Open in Google Maps',
      fr: 'Ouvrir dans Google Maps',
    }[lang],

    interactiveMapHeading: {
      ar: 'خريطة تفاعلية وموقع المختبر عبر Google Maps',
      en: 'Interactive Map & Laboratory Location on Google Maps',
      fr: 'Carte Interactive & Emplacement du Laboratoire sur Google Maps',
    }[lang],

    interactiveMapSub: {
      ar: 'موقع جغرافي موثق بإحداثيات GPS المعتمدة لتسهيل وصول المراجعين وتسليم عينات الفحص',
      en: 'Verified GPS coordinates facilitating visitor access and water sample delivery',
      fr: "Coordonnées GPS vérifiées facilitant l'accès des visiteurs et le dépôt des échantillons",
    }[lang],

    verifiedCoordsLabel: {
      ar: 'الإحداثيات الجغرافية المعتمدة (GPS)',
      en: 'Verified GPS Coordinates',
      fr: 'Coordonnées GPS Vérifiées',
    }[lang],

    copyCoordsBtn: {
      ar: 'نسخ الإحداثيات',
      en: 'Copy Coordinates',
      fr: 'Copier les Coordonnées',
    }[lang],

    copiedSuccess: {
      ar: 'تم النسخ بنجاح!',
      en: 'Copied Successfully!',
      fr: 'Copié avec Succès !',
    }[lang],

    getDirectionsBtn: {
      ar: 'الاتجاهات الملاحية عبر Google Maps',
      en: 'Get Directions (Google Maps)',
      fr: 'Itinéraire (Google Maps)',
    }[lang],

    mapInteractiveNotice: {
      ar: 'خريطة تفاعلية مباشرة: يمكنك التحريك، التكبير، والتصغير أو فتح المسار في تطبيق الخرائط',
      en: 'Live interactive map: pan, zoom, or navigate directly in Google Maps',
      fr: "Carte interactive en direct : déplacez, zoomez ou ouvrez l'itinéraire dans Google Maps",
    }[lang],

    contactHeading: {
      ar: 'معلومات التواصل وساعات العمل',
      en: 'Official Contact & Working Hours',
      fr: 'Contact Officiel & Horaires de Travail',
    }[lang],

    directPhone: '+966 17 224 1018',

    hoursLine1: {
      ar: 'الأحد - الخميس: 8:30 صباحًا - 3:15 مساءً',
      en: 'Sunday - Thursday: 8:30 AM - 3:15 PM',
      fr: 'Dimanche - jeudi : 08h30 - 15h15',
    }[lang],

    hoursClosed: {
      ar: 'الجمعة والسبت: مغلق',
      en: 'Friday - Saturday: Closed',
      fr: 'Vendredi - samedi : Fermé',
    }[lang],

    xAccountHeading: {
      ar: 'حساب المختبر المركزي للمياه بعسير',
      en: 'Asir Central Water Laboratory — Official X Account',
      fr: "Compte X officiel du laboratoire central des eaux d'Asir",
    }[lang],

    xHandle: '@cen_lab',

    openXBtn: {
      ar: 'زيارة الحساب على منصة X',
      en: 'Open Profile on X (@cen_lab)',
      fr: 'Consulter sur X (@cen_lab)',
    }[lang],

    visitorHeading: {
      ar: 'بوابة خدمات الزوار والمستفيدين',
      en: 'Visitor & Beneficiary Services Portal',
      fr: 'Portail des Services aux Visiteurs',
    }[lang],

    visitorSub: {
      ar: 'خدمات رقمية لتسجيل الزيارات وتقديم الاستفسارات ومشاركة التقييمات',
      en: 'Digital services to schedule visits, submit technical enquiries, and provide feedback',
      fr: 'Services numériques pour enregistrer des visites, poser des questions et donner votre avis',
    }[lang],

    officialPoster: {
      ar: 'الملصق المؤسسي',
      en: 'Institutional Poster',
      fr: 'Affiche Institutionnelle',
    }[lang],

    posterTitle: {
      ar: 'طموحنا عنان السماء...',
      en: 'Our Ambition Reaches the Sky...',
      fr: 'Notre ambition atteint les hauteurs du ciel...',
    }[lang],

    posterDescription: {
      ar: 'ملصق مؤسسي يعكس الطموح والرؤية الوطنية، ويتضمن عناصر الهوية الوطنية السعودية والشعارات المؤسسية.',
      en: 'An institutional poster reflecting ambition and the national vision, featuring Saudi national identity elements and institutional logos.',
      fr: "Une affiche institutionnelle illustrant l'ambition et la vision nationale, avec des éléments de l'identité saoudienne et des logos institutionnels.",
    }[lang],

    viewPoster: {
      ar: 'عرض الملصق المؤسسي',
      en: 'View Institutional Poster',
      fr: "Voir l'Affiche Institutionnelle",
    }[lang],
  };

  // ============================================================
  // VERIFIED ASIR LOCATION
  // ============================================================

  const labCoordinates = {
    lat: 18.2501569,
    lng: 42.5996342,
    dms: '18°15\'00.6"N 42°35\'58.7"E',
    decimal: '18.250157, 42.599634',
    plusCode:
      '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
    mapsUrl: 'https://maps.app.goo.gl/s4pP9yp98rcRT3Xv9',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=18.2501569,42.5996342',
    xAccountUrl: 'https://x.com/cen_lab',
  };

  // ============================================================
  // ALBUM — EXACTLY 10 LABORATORY PHOTOS
  // slogon-assir.jpg IS NOT INCLUDED HERE
  // ============================================================

  const asirAlbumImages = [
    {
      src: labAsirBuilding,
      title: tText.buildingBadge,
      description: '',
    },
    {
      src: asirWaterLabFacility,
      title: tText.facilityBadge,
      description: tText.facilityDesc,
    },
    {
      src: asirMobileVan,
      title: tText.mobileBadge,
      description: tText.mobileDesc,
    },
    {
      src: asirWaterLab1,
      title: {
        ar: 'مرافق المختبر المركزي بعسير',
        en: 'Asir Central Laboratory Facilities',
        fr: 'Installations du Laboratoire Central d’Asir',
      }[lang],
      description: '',
    },
    {
      src: asirWaterLab2,
      title: {
        ar: 'التجهيزات والمرافق المخبرية',
        en: 'Laboratory Equipment & Facilities',
        fr: 'Équipements et Installations du Laboratoire',
      }[lang],
      description: '',
    },
    {
      src: asirWaterLab3,
      title: {
        ar: 'بيئة العمل والتحاليل المخبرية',
        en: 'Laboratory Work & Analysis Environment',
        fr: 'Environnement de Travail et d’Analyse',
      }[lang],
      description: '',
    },
    {
      src: asirWaterLab4,
      title: {
        ar: 'المختبر المركزي – منطقة عسير',
        en: 'Asir Central Laboratory',
        fr: 'Laboratoire Central d’Asir',
      }[lang],
      description: '',
    },
    {
      src: cadeauAsir,
      title: {
        ar: 'المختبر المركزي بعسير',
        en: 'Asir Central Laboratory',
        fr: 'Laboratoire Central d’Asir',
      }[lang],
      description: '',
    },
    {
      src: labAsirEnf,
      title: {
        ar: 'المختبر المركزي والخدمات البيئية',
        en: 'Central Laboratory & Environmental Services',
        fr: 'Laboratoire Central et Services Environnementaux',
      }[lang],
      description: '',
    },
    {
      src: laboAsir,
      title: {
        ar: 'مرافق المختبر المركزي',
        en: 'Central Laboratory Facilities',
        fr: 'Installations du Laboratoire Central',
      }[lang],
      description: '',
    },
  ];

  // ============================================================
  // STATES
  // ============================================================

  const [currentImage, setCurrentImage] = useState(0);

  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    description?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // ============================================================
  // AUTO ROTATION — EVERY 5 SECONDS
  // ============================================================

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % asirAlbumImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [asirAlbumImages.length]);

  // ============================================================
  // CAROUSEL CONTROLS
  // ============================================================

  const previousImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? asirAlbumImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImage(
      (prev) => (prev + 1) % asirAlbumImages.length
    );
  };

  // ============================================================
  // COPY COORDINATES
  // ============================================================

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(labCoordinates.decimal);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setCopied(false);
    }
  };

  // ============================================================
  // CURRENT IMAGE
  // ============================================================

  const activeImage = asirAlbumImages[currentImage];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      dir={dir}
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {/* ====================================================== */}
      {/* BREADCRUMB */}
      {/* ====================================================== */}

      <Breadcrumb
        items={[
          {
            label:
              lang === 'ar'
                ? 'المختبرات'
                : lang === 'fr'
                  ? 'Laboratoires'
                  : 'Laboratories',
          },
          {
            label:
              lang === 'ar'
                ? 'المختبر المركزي بعسير'
                : lang === 'fr'
                  ? "Laboratoire Central d'Asir"
                  : 'Asir Central Laboratory',
          },
        ]}
      />

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#063b63] via-[#0f4c81] to-[#0b6b68]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -end-32 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-40 -start-40 h-[28rem] w-[28rem] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* HERO TEXT */}

            <div className="text-white">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                  <ShieldCheck className="h-4 w-4" />
                  {tText.mewaBadge}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                  <Building2 className="h-4 w-4" />
                  {tText.centralBadge}
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                {tText.officialTitle}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
                {tText.tagline}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#0f4c81] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <UserPlus className="h-5 w-5" />
                  {tText.registerVisit}
                </Link>

                <Link
                  to="/survey"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <ClipboardList className="h-5 w-5" />
                  {tText.takeSurvey}
                </Link>

                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <Send className="h-5 w-5" />
                  {tText.sendEnquiry}
                </Link>
              </div>
            </div>

            {/* LOGO */}

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" />

                <div className="relative rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl">
                  <AsirLabLogo className="mx-auto h-48 w-48 sm:h-56 sm:w-56" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* KEY INFORMATION STRIP */}
      {/* ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 sm:px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-8">
          {/* REGION */}

          <div className="flex gap-4 px-4 py-6 lg:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0f4c81]">
              <MapPin className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                {tText.statRegionVal}
              </div>

              <div className="text-sm font-semibold text-slate-600">
                {tText.statRegionSub}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {tText.statRegionDesc}
              </div>
            </div>
          </div>

          {/* HOURS */}

          <div className="flex gap-4 px-4 py-6 lg:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                {tText.statHoursVal}
              </div>

              <div className="text-sm font-semibold text-slate-600">
                {tText.statHoursSub}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {tText.statHoursDesc}
              </div>
            </div>
          </div>

          {/* X ACCOUNT */}

          <div className="flex gap-4 px-4 py-6 lg:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Activity className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                {tText.statXVal}
              </div>

              <div className="text-sm font-semibold text-slate-600">
                {tText.statXSub}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {tText.statXDesc}
              </div>
            </div>
          </div>

          {/* AFFILIATION */}

          <div className="flex gap-4 px-4 py-6 lg:px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <Droplets className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xl font-black text-slate-900">
                {tText.statAffilVal}
              </div>

              <div className="text-sm font-semibold text-slate-600">
                {tText.statAffilSub}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                {tText.statAffilDesc}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ABOUT + ALBUM */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-1 w-10 rounded-full bg-[#0f4c81]" />
            <span className="text-sm font-bold uppercase tracking-wider text-[#0f4c81]">
              {tText.shortTitle}
            </span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
            {tText.aboutHeading}
          </h2>

          <p className="mt-3 text-lg font-medium text-[#0f4c81]">
            {tText.aboutSub}
          </p>

          <p className="mt-5 leading-8 text-slate-600">
            {tText.aboutText}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.55fr]">
          {/* ================================================== */}
          {/* ALBUM CAROUSEL */}
          {/* ================================================== */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <button
                type="button"
                className="group absolute inset-0 z-10 block h-full w-full cursor-zoom-in"
                onClick={() =>
                  setSelectedImage({
                    src: activeImage.src,
                    title: activeImage.title,
                    description: activeImage.description,
                  })
                }
                aria-label={tText.clickToEnlarge}
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="absolute bottom-5 start-5 end-5 text-start text-white">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow">
                    <Camera className="h-4 w-4" />
                    {tText.clickToEnlarge}
                  </div>

                  <h3 className="text-xl font-black drop-shadow-lg sm:text-2xl">
                    {activeImage.title}
                  </h3>

                  {activeImage.description && (
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-white/90">
                      {activeImage.description}
                    </p>
                  )}
                </div>
              </button>

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute start-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* NEXT */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute end-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* COUNTER */}

              <div className="absolute end-4 top-4 z-20 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                {currentImage + 1} / {asirAlbumImages.length}
              </div>
            </div>

            {/* DOTS */}

            <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-5">
              {asirAlbumImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  aria-label={`${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentImage === index
                      ? 'w-8 bg-[#0f4c81]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================================================== */}
          {/* INSTITUTIONAL POSTER — SEPARATE FROM ALBUM */}
          {/* ================================================== */}

          <div
            className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            onClick={() =>
              setSelectedImage({
                src: sloganAsir,
                title: tText.posterTitle,
                description: tText.posterDescription,
              })
            }
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
              <img
                src={sloganAsir}
                alt={tText.posterTitle}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />

              <div className="absolute start-4 top-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-slate-800 shadow-lg">
                  <FileText className="h-4 w-4 text-[#0f4c81]" />
                  {tText.officialPoster}
                </span>
              </div>

              <div className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg">
                <Eye className="h-5 w-5" />
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex items-start gap-3">
                <Layers className="mt-1 h-5 w-5 shrink-0 text-[#0f4c81]" />

                <h3 className="text-xl font-black leading-tight text-slate-900">
                  {tText.posterTitle}
                </h3>
              </div>

              <p className="mb-5 text-sm leading-7 text-slate-600">
                {tText.posterDescription}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectedImage({
                    src: sloganAsir,
                    title: tText.posterTitle,
                    description: tText.posterDescription,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3b64]"
              >
                <Eye className="h-4 w-4" />
                {tText.viewPoster}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* MAIN ACTIVITIES */}
      {/* ====================================================== */}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-3 flex justify-center">
              <span className="h-1 w-12 rounded-full bg-[#0f4c81]" />
            </div>

            <h2 className="text-3xl font-black text-slate-900">
              {tText.activitiesHeading}
            </h2>

            <p className="mx-auto mt-3 max-w-3xl text-slate-500">
              {tText.activitiesSub}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* WATER ANALYSIS */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#0f4c81]">
                <Droplets className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {lang === 'ar'
                  ? 'فحص جودة مياه الشرب'
                  : lang === 'fr'
                    ? "Contrôle de la qualité de l'eau potable"
                    : 'Drinking Water Quality Testing'}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {lang === 'ar'
                  ? 'تحليل العينات والتحقق من الخصائص والمعايير المعتمدة لمياه الشرب.'
                  : lang === 'fr'
                    ? "Analyse des échantillons et vérification des paramètres réglementaires de l'eau potable."
                    : 'Sample analysis and verification of applicable drinking water quality parameters.'}
              </p>
            </div>

            {/* LAB ANALYSIS */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FlaskConical className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {lang === 'ar'
                  ? 'التحاليل المخبرية'
                  : lang === 'fr'
                    ? 'Analyses de laboratoire'
                    : 'Laboratory Analysis'}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {lang === 'ar'
                  ? 'تنفيذ الفحوصات المخبرية اللازمة لتقييم جودة العينات المائية.'
                  : lang === 'fr'
                    ? 'Réalisation des analyses nécessaires à l’évaluation de la qualité des échantillons.'
                    : 'Laboratory examinations required to assess the quality of water samples.'}
              </p>
            </div>

            {/* FIELD OPERATIONS */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Truck className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {lang === 'ar'
                  ? 'العمليات الميدانية'
                  : lang === 'fr'
                    ? 'Opérations de terrain'
                    : 'Field Operations'}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {lang === 'ar'
                  ? 'دعم الفحوصات الميدانية وأخذ العينات من مصادر المياه والمحافظات التابعة.'
                  : lang === 'fr'
                    ? 'Appui aux prélèvements et contrôles sur le terrain dans les différentes zones.'
                    : 'Field sampling and testing support across regional water sources and governorates.'}
              </p>
            </div>

            {/* QUALITY */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                <Microscope className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {lang === 'ar'
                  ? 'الرقابة وضمان الجودة'
                  : lang === 'fr'
                    ? 'Contrôle et assurance qualité'
                    : 'Quality Control & Assurance'}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {lang === 'ar'
                  ? 'المساهمة في التحقق من جودة المياه ومطابقتها للمواصفات والمعايير المعتمدة.'
                  : lang === 'fr'
                    ? 'Contribution au contrôle de la qualité et à la conformité aux normes applicables.'
                    : 'Supporting water quality verification and compliance with applicable standards.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BRANCHES */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-[#0f4c81]" />

              <span className="text-sm font-bold uppercase tracking-wider text-[#0f4c81]">
                {lang === 'ar'
                  ? 'الهيكل الإقليمي'
                  : lang === 'fr'
                    ? 'Réseau régional'
                    : 'Regional Network'}
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900">
              {tText.branchesHeading}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-500">
              {tText.branchesSub}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* BISHA */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0f4c81]">
                  <Building2 className="h-7 w-7" />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0f4c81]">
                  {lang === 'ar'
                    ? 'تابع للمختبر المركزي بعسير'
                    : lang === 'fr'
                      ? "Rattaché au laboratoire central d'Asir"
                      : 'Under Asir Central Laboratory'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                {tText.bishaTitle}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {tText.bishaDesc}
              </p>

              <Link
                to="/laboratories/asir/bisha"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3 font-bold text-white transition hover:bg-[#0b3b64]"
              >
                {tText.goToBisha}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            {/* MAHAYEL */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Building2 className="h-7 w-7" />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {lang === 'ar'
                    ? 'تابع للمختبر المركزي بعسير'
                    : lang === 'fr'
                      ? "Rattaché au laboratoire central d'Asir"
                      : 'Under Asir Central Laboratory'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                {tText.mahayelTitle}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {tText.mahayelDesc}
              </p>

              <Link
                to="/laboratories/asir/mahayel"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3 font-bold text-white transition hover:bg-[#0b3b64]"
              >
                {tText.goToMahayel}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* LOCATION */}
      {/* ====================================================== */}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-[#0f4c81]" />

              <span className="text-sm font-bold uppercase tracking-wider text-[#0f4c81]">
                {tText.locationHeading}
              </span>
            </div>

            <h2 className="text-3xl font-black text-slate-900">
              {tText.interactiveMapHeading}
            </h2>

            <p className="mt-3 max-w-3xl text-slate-500">
              {tText.interactiveMapSub}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            {/* LOCATION INFO */}

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0f4c81]">
                  <MapPin className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {tText.locationHeading}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {tText.locationDistrict}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {tText.verifiedCoordsLabel}
                </div>

                <div className="mt-2 break-all text-lg font-black text-slate-900">
                  {labCoordinates.decimal}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {labCoordinates.dms}
                </div>

                <button
                  type="button"
                  onClick={copyCoordinates}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#0f4c81] hover:text-[#0f4c81]"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}

                  {copied
                    ? tText.copiedSuccess
                    : tText.copyCoordsBtn}
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {lang === 'ar'
                    ? 'العنوان'
                    : lang === 'fr'
                      ? 'Adresse'
                      : 'Address'}
                </div>

                <p className="mt-2 leading-7 text-slate-700">
                  {tText.officialAddress}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={labCoordinates.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f4c81] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0b3b64]"
                >
                  <ExternalLink className="h-4 w-4" />
                  {tText.openMapBtn}
                </a>

                <a
                  href={labCoordinates.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0f4c81] hover:text-[#0f4c81]"
                >
                  <Navigation className="h-4 w-4" />
                  {tText.getDirectionsBtn}
                </a>
              </div>
            </div>

            {/* GOOGLE MAP */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl">
              <div className="relative h-full min-h-[430px]">
                <iframe
                  title={tText.interactiveMapHeading}
                  src={`https://www.google.com/maps?q=${labCoordinates.lat},${labCoordinates.lng}&z=16&output=embed`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="absolute bottom-4 start-4 end-4 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0f4c81]" />

                    <p className="text-sm leading-6 text-slate-600">
                      {tText.mapInteractiveNotice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CONTACT */}
      {/* ====================================================== */}

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900">
              {tText.contactHeading}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* PHONE / HOURS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0f4c81]">
                  <Phone className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'ar'
                      ? 'الهاتف المباشر'
                      : lang === 'fr'
                        ? 'Téléphone direct'
                        : 'Direct Phone'}
                  </h3>

                  <a
                    href={`tel:${tText.directPhone.replace(/\s/g, '')}`}
                    className="mt-2 block text-xl font-black text-[#0f4c81] hover:underline"
                  >
                    {tText.directPhone}
                  </a>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <div className="flex gap-2">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#0f4c81]" />
                      <span>{tText.hoursLine1}</span>
                    </div>

                    <div className="flex gap-2">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span>{tText.hoursClosed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* X */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                  <Activity className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {tText.xAccountHeading}
                  </h3>

                  <p className="mt-2 text-lg font-bold text-[#0f4c81]">
                    {tText.xHandle}
                  </p>

                  <a
                    href={labCoordinates.xAccountUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {tText.openXBtn}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* VISITOR SERVICES */}
      {/* ====================================================== */}

      <section className="bg-[#0f4c81] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center text-white">
            <h2 className="text-3xl font-black">
              {tText.visitorHeading}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              {tText.visitorSub}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* REGISTER */}

            <Link
              to="/register"
              className="group rounded-3xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0f4c81]">
                <UserPlus className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black">
                {tText.registerVisit}
              </h3>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white">
                {lang === 'ar'
                  ? 'ابدأ الآن'
                  : lang === 'fr'
                    ? 'Commencer'
                    : 'Get Started'}

                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </div>
            </Link>

            {/* SURVEY */}

            <Link
              to="/survey"
              className="group rounded-3xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0f4c81]">
                <ClipboardList className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black">
                {tText.takeSurvey}
              </h3>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white">
                {lang === 'ar'
                  ? 'مشاركة التقييم'
                  : lang === 'fr'
                    ? 'Donner votre avis'
                    : 'Share Feedback'}

                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </div>
            </Link>

            {/* ENQUIRY */}

            <Link
              to="/enquiry"
              className="group rounded-3xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#0f4c81]">
                <Send className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black">
                {tText.sendEnquiry}
              </h3>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white">
                {lang === 'ar'
                  ? 'إرسال استفسار'
                  : lang === 'fr'
                    ? 'Envoyer une demande'
                    : 'Send an Enquiry'}

                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FULL SCREEN IMAGE MODAL */}
      {/* ====================================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
        >
          {/* CLOSE */}

          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute end-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-xl transition hover:bg-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* CONTENT */}

          <div
            className="relative flex max-h-[94vh] max-w-7xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[78vh] max-w-[94vw] object-contain"
              />
            </div>

            <div className="mt-4 max-w-3xl rounded-2xl bg-white/95 px-6 py-4 text-center shadow-xl">
              <h3 className="text-lg font-black text-slate-900">
                {selectedImage.title}
              </h3>

              {selectedImage.description && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}