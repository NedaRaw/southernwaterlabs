import { useState, type FormEvent } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';

import {
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Info,
  UserPlus,
  ShieldCheck,
  Award,
  CheckCircle2,
  Activity,
  FileText,
  Sparkles,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  Eye,
  Camera,
  FlaskConical,
  Microscope,
  Send,
  CalendarCheck,
  AlertCircle,
  X,
  Network,
} from 'lucide-react';

import { getCenterById } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import NajranLabDetail from '@/pages/NajranLabDetail';
import AsirLabDetail from '@/pages/AsirLabDetail';
import { siteMedia } from '@/data/siteMedia';
import { supabase } from '@/lib/supabase';
import {
  getNextVisitorId,
  buildVisitorQrUrl,
} from '@/lib/visitorId';

// Authentic Laboratory & Equipment Facility Photos
import labGallery1 from '@/assets/images/IMG-20250723-WA0001.jpg';
import labGallery2 from '@/assets/images/IMG-20250723-WA0002.jpg';
import labGallery3 from '@/assets/images/IMG-20250723-WA0003.jpg';
import labGallery4 from '@/assets/images/IMG-20250723-WA0004.jpg';
import labGallery5 from '@/assets/images/IMG-20250723-WA0005.jpg';
import labGallery6 from '@/assets/images/IMG-20250723-WA0006.jpg';
import bahaVan1Img from '@/assets/images/albaha-lab-van1.jpg';
import bahaVan5Img from '@/assets/images/albaha-lab-van5.jpg';
import bahaVan3Img from '@/assets/images/albaha-lab-van3.jpg';
import bahaVan2Img from '@/assets/images/albaha-lab-van2.jpg';
import bahaVan4Img from '@/assets/images/albaha-lab-van4.jpg';
import bahalab1Img from '@/assets/images/albaha-lab1.jpg';
import bahalab2Img from '@/assets/images/albaha-lab2.jpg';
import jazanVanImg from '@/assets/images/jazan-lab-van4.jpg';
import jazanSideImg from '@/assets/images/jazan-lab-van2.jpg';
import jazanRearImg from '@/assets/images/jazan-lab-van5.jpg';
import jazanDeployImg from '@/assets/images/jazan-lab-van1.jpg';
import jazanVan3Img from '@/assets/images/jazan-lab-van3.jpg';
import jazanVan6Img from '@/assets/images/jazan-lab-van6.jpg';

/**
 * Entry component.
 *
 * Najran has its own dedicated page with verified location/contact data.
 * Keeping this decision in a wrapper avoids conditional React Hooks.
 */
export default function CenterDetail() {
  const { centerId } = useParams<{ centerId: string }>();

  if (centerId === 'najran') {
    return <NajranLabDetail />;
  }

  if (centerId === 'asir') {
    return <AsirLabDetail />;
  }

  return <GenericCenterDetail />;
}

/**
 * Generic center detail page.
 *
 * Important:
 * All React Hooks are executed before any conditional return.
 * This prevents React Hook order errors.
 */
function GenericCenterDetail() {
  const { centerId } = useParams<{ centerId: string }>();
  const { lang, dir, t } = useLang();
  const navigate = useNavigate();

  const center = centerId
    ? getCenterById(centerId, lang)
    : undefined;

  const isRtl = dir === 'rtl';
  const Arrow = isRtl ? ChevronLeft : ChevronRight;

  // ============================================================
  // UI State
  // ============================================================

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [selectedImageTitle, setSelectedImageTitle] =
    useState<string>('');

  const [copiedCoords, setCopiedCoords] =
    useState(false);

  const [activeTab, setActiveTab] = useState<
    | 'about'
    | 'capabilities'
    | 'equipment'
    | 'branches'
    | 'gallery'
    | 'location'
    | 'booking'
  >('about');

  // ============================================================
  // Booking Form State
  // ============================================================

  const [bookingName, setBookingName] =
    useState('');

  const [bookingNationalId, setBookingNationalId] =
    useState('');

  const [bookingDepartment, setBookingDepartment] =
    useState('Quality Control');

  const [bookingOrg, setBookingOrg] =
    useState('');

  const [bookingPhone, setBookingPhone] =
    useState('');

  const [bookingEmail, setBookingEmail] =
    useState('');

  const [bookingEmployee, setBookingEmployee] =
    useState('');

  const [bookingJobTitle, setBookingJobTitle] =
    useState('');

  const [bookingNotes, setBookingNotes] =
    useState('');

  const [bookingPurpose, setBookingPurpose] =
    useState('');

  /**
   * Empty value means no destination selected.
   *
   * "central" is a UI-only value.
   * Before insertion into Supabase it becomes NULL.
   */
  const [bookingBranch, setBookingBranch] =
    useState('');

  const [bookingDate, setBookingDate] =
    useState('');

  const [bookingTime, setBookingTime] =
    useState('09:00');

  const [bookingSubmitting, setBookingSubmitting] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState<string | null>(null);

  const [bookingError, setBookingError] =
    useState<string | null>(null);

  // ============================================================
  // IMPORTANT: Conditional return AFTER ALL HOOKS
  // ============================================================

  if (!center) {
    return <Navigate to="/laboratories" replace />;
  }

  // ============================================================
  // Booking Options
  // ============================================================

  const bookingPurposeOptions = [
    {
      value: 'Drinking Water Quality Verification',
      ar: 'التحقق من جودة مياه الشرب',
      en: 'Drinking Water Quality Verification',
      fr: 'Vérification de la qualité de l’eau potable',
    },
    {
      value: 'Sample Submission / Intake',
      ar: 'تسليم / استقبال عينة',
      en: 'Sample Submission / Intake',
      fr: 'Dépôt / réception d’un échantillon',
    },
    {
      value: 'Laboratory Visit',
      ar: 'زيارة المختبر',
      en: 'Laboratory Visit',
      fr: 'Visite du laboratoire',
    },
    {
      value: 'Technical Consultation / Enquiry',
      ar: 'استشارة فنية / استفسار',
      en: 'Technical Consultation / Enquiry',
      fr: 'Consultation technique / demande d’information',
    },
    {
      value: 'Other',
      ar: 'أخرى',
      en: 'Other',
      fr: 'Autre',
    },
  ];

  const getLocalizedPurpose = (
    option: (typeof bookingPurposeOptions)[number]
  ) => {
    if (lang === 'ar') {
      return option.ar;
    }

    if (lang === 'fr') {
      return option.fr;
    }

    return option.en;
  };

  const getCentralOptionLabel = () => {
    if (lang === 'ar') {
      return `المختبر المركزي — ${center.region}`;
    }

    if (lang === 'fr') {
      return `Laboratoire central — ${center.region}`;
    }

    return `Central Laboratory — ${center.region}`;
  };

  const getBranchLabel = () => {
    if (lang === 'ar') {
      return 'المختبر / الفرع';
    }

    if (lang === 'fr') {
      return 'Laboratoire / agence';
    }

    return 'Laboratory / Branch';
  };

  // ============================================================
// Center Coordinates
// ============================================================

const centerCoordinates: Record<
  string,
  {
    lat: number;
    lng: number;
    dms: string;
    decimal: string;
    mapsUrl: string;
    directionsUrl: string;
  }
> = {
  asir: {
    lat: 18.21639,
    lng: 42.50528,
    dms: '18°12\'59.0"N 42°30\'19.0"E',
    decimal: '18.21639, 42.50528',
    mapsUrl:
      'https://maps.google.com/?q=18.21639,42.50528',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=18.21639,42.50528',
  },

  'al-baha': {
    lat: 20.01288,
    lng: 41.46767,
    dms: '20°00\'46.4"N 41°28\'03.6"E',
    decimal: '20.01288, 41.46767',
    mapsUrl:
      'https://maps.google.com/?q=20.01288,41.46767',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=20.01288,41.46767',
  },

  jazan: {
    lat: 16.92810674784785,
    lng: 42.613920575129974,
    dms: '16°55\'41.2"N 42°36\'50.1"E',
    decimal: '16.92810674784785, 42.613920575129974',
    mapsUrl:
      'https://maps.google.com/?q=16.92810674784785,42.613920575129974',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=16.92810674784785,42.613920575129974',
  },
};

const coords =
  centerCoordinates[center.id] || {
    lat: 18.21639,
    lng: 42.50528,
    dms: '18°12\'59.0"N 42°30\'19.0"E',
    decimal: '18.21639, 42.50528',
    mapsUrl: center.contact.mapUrl,
    directionsUrl:
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        center.location
      )}`,
  };
  // ============================================================
  // Copy Coordinates
  // ============================================================

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(
        coords.decimal
      );

      setCopiedCoords(true);

      setTimeout(() => {
        setCopiedCoords(false);
      }, 2500);
    } catch (error) {
      console.error(
        'Failed to copy coordinates:',
        error
      );
    }
  };

  // ============================================================
  // Facility Photo
  // ============================================================

  const facilityPhoto =
    (centerId &&
      siteMedia.facilities[
        centerId as keyof typeof siteMedia.facilities
      ]) ||
    siteMedia.aboutSection;

  // ============================================================
  // Gallery
  // ============================================================

  const galleryItems =
  centerId === 'al-baha'
    ? [
       {
  img: bahalab1Img,
  title:
    lang === 'ar'
      ? 'خدمات المختبر المركزي المتنقل وبوث خدمات العملاء في منتزه رغدان'
      : lang === 'fr'
        ? 'Services du laboratoire central mobile et du point de service client au parc Raghadan'
        : 'Central Mobile Laboratory & Customer Service at Raghadan Park',
  category:
    lang === 'ar'
      ? 'الخدمات الميدانية'
      : lang === 'fr'
        ? 'Services terrain'
        : 'Field Services',
},

{
  img: bahalab2Img,
  title:
    lang === 'ar'
      ? 'الفحص والتحليل الميداني في منتزه رغدان'
      : lang === 'fr'
        ? 'Contrôle et analyse sur le terrain au parc Raghadan'
        : 'Field Testing & Analysis at Raghadan Park',
  category:
    lang === 'ar'
      ? 'الفحص والتحليل الميداني'
      : lang === 'fr'
        ? 'Contrôle et analyse terrain'
        : 'Field Testing & Analysis',
},
        {
          img: bahaVan1Img,
          title:
            lang === 'ar'
              ? 'مختبر مياه الباحة المركزي'
              : lang === 'fr'
                ? 'Laboratoire central des eaux d’Al-Baha'
                : 'Al-Baha Central Water Laboratory',
          category:
            lang === 'ar'
              ? 'مختبر الباحة'
              : lang === 'fr'
                ? 'Laboratoire d’Al-Baha'
                : 'Al-Baha Laboratory',
        },
        {
          img: bahaVan2Img,
          title:
            lang === 'ar'
              ? 'المختبر المتنقل لمختبر الباحة المركزي'
              : lang === 'fr'
                ? 'Laboratoire mobile d’Al-Baha'
                : 'Al-Baha Mobile Laboratory',
          category:
            lang === 'ar'
              ? 'المختبرات المتنقلة'
              : lang === 'fr'
                ? 'Laboratoires mobiles'
                : 'Mobile Laboratories',
        },
        {
          img: bahaVan3Img,
          title:
            lang === 'ar'
              ? 'مرافق مختبر الباحة المركزي'
              : lang === 'fr'
                ? 'Installations du laboratoire central d’Al-Baha'
                : 'Al-Baha Central Laboratory Facilities',
          category:
            lang === 'ar'
              ? 'المرافق'
              : lang === 'fr'
                ? 'Installations'
                : 'Facilities',
        },
        {
          img: bahaVan4Img,
          title:
            lang === 'ar'
              ? 'مركبة المختبر المتنقل بالباحة'
              : lang === 'fr'
                ? 'Véhicule du laboratoire mobile d’Al-Baha'
                : 'Al-Baha Mobile Laboratory Vehicle',
          category:
            lang === 'ar'
              ? 'المختبر المتنقل'
              : lang === 'fr'
                ? 'Laboratoire mobile'
                : 'Mobile Laboratory',
        },
        {
          img: bahaVan5Img,
          title:
            lang === 'ar'
              ? 'عمليات الفحص الميداني بالباحة'
              : lang === 'fr'
                ? 'Opérations d’inspection sur le terrain à Al-Baha'
                : 'Al-Baha Field Inspection Operations',
          category:
            lang === 'ar'
              ? 'الفحص الميداني'
              : lang === 'fr'
                ? 'Inspection terrain'
                : 'Field Inspection',
        },
       
      ]
    : centerId === 'jazan'
      ? [
          {
            img: jazanDeployImg,
            title:
              lang === 'ar'
                ? 'المختبر المتنقل لمختبر جازان المركزي'
                : lang === 'fr'
                  ? 'Laboratoire mobile de Jazan'
                  : 'Jazan Mobile Laboratory',
            category:
              lang === 'ar'
                ? 'المختبرات المتنقلة'
                : lang === 'fr'
                  ? 'Laboratoires mobiles'
                  : 'Mobile Laboratories',
          },
          {
            img: jazanSideImg,
            title:
              lang === 'ar'
                ? 'مرافق مختبر جازان المركزي'
                : lang === 'fr'
                  ? 'Installations du laboratoire central de Jazan'
                  : 'Jazan Central Laboratory Facilities',
            category:
              lang === 'ar'
                ? 'المرافق'
                : lang === 'fr'
                  ? 'Installations'
                  : 'Facilities',
          },
          {
            img: jazanVanImg,
            title:
              lang === 'ar'
                ? 'مركبة المختبر المتنقل بجازان'
                : lang === 'fr'
                  ? 'Véhicule du laboratoire mobile de Jazan'
                  : 'Jazan Mobile Laboratory Vehicle',
            category:
              lang === 'ar'
                ? 'المختبر المتنقل'
                : lang === 'fr'
                  ? 'Laboratoire mobile'
                  : 'Mobile Laboratory',
          },
          {
            img: jazanRearImg,
            title:
              lang === 'ar'
                ? 'عمليات المختبر الميداني بجازان'
                : lang === 'fr'
                  ? 'Opérations du laboratoire mobile de Jazan'
                  : 'Jazan Mobile Laboratory Operations',
            category:
              lang === 'ar'
                ? 'العمليات الميدانية'
                : lang === 'fr'
                  ? 'Opérations terrain'
                  : 'Field Operations',
          },
          {
            img: jazanVan3Img,
            title:
              lang === 'ar'
                ? 'المختبر المتنقل لمختبر جازان المركزي'
                : lang === 'fr'
                  ? 'Laboratoire mobile du laboratoire central de Jazan'
                  : 'Jazan Central Laboratory Mobile Unit',
            category:
              lang === 'ar'
                ? 'المختبرات المتنقلة'
                : lang === 'fr'
                  ? 'Laboratoires mobiles'
                  : 'Mobile Laboratories',
          },
          {
            img: jazanVan6Img,
            title:
              lang === 'ar'
                ? 'معدات وعمليات مختبر جازان'
                : lang === 'fr'
                  ? 'Équipements et opérations du laboratoire de Jazan'
                  : 'Jazan Laboratory Equipment & Operations',
            category:
              lang === 'ar'
                ? 'التجهيزات'
                : lang === 'fr'
                  ? 'Équipements'
                  : 'Equipment',
          },
        ]
      : [
          {
            img: labGallery1,
            title:
              lang === 'ar'
                ? 'صالة الاستقبال وبوابة خدمة العملاء'
                : lang === 'fr'
                  ? "Hall d'accueil et service client"
                  : 'Reception & Customer Service Hall',
            category:
              lang === 'ar'
                ? 'خدمة العملاء'
                : lang === 'fr'
                  ? 'Service Client'
                  : 'Customer Service',
          },
          {
            img: labGallery2,
            title:
              lang === 'ar'
                ? 'معمل التحاليل الكيميائية المتقدمة'
                : lang === 'fr'
                  ? "Laboratoire d'analyses chimiques avancées"
                  : 'Advanced Chemical Analysis Lab',
            category:
              lang === 'ar'
                ? 'التحليل الكيميائي'
                : lang === 'fr'
                  ? 'Chimie'
                  : 'Chemical Analysis',
          },
          {
            img: labGallery3,
            title:
              lang === 'ar'
                ? 'وحدة الفحص الميكروبيولوجي والحضانات'
                : lang === 'fr'
                  ? 'Unité de microbiologie et incubateurs'
                  : 'Microbiology & Incubation Unit',
            category:
              lang === 'ar'
                ? 'الميكروبيولوجي'
                : lang === 'fr'
                  ? 'Microbiologie'
                  : 'Microbiology',
          },
          {
            img: labGallery4,
            title:
              lang === 'ar'
                ? 'محطة استلام وتشفير العينات الميدانية'
                : lang === 'fr'
                  ? 'Réception et étiquetage des échantillons'
                  : 'Sample Intake & Coding Station',
            category:
              lang === 'ar'
                ? 'سلسلة الحيازة'
                : lang === 'fr'
                  ? 'Chaîne de traçabilité'
                  : 'Chain of Custody',
          },
          {
            img: labGallery5,
            title:
              lang === 'ar'
                ? 'أجهزة قياس الطيف الكتلي والامتصاص الذري'
                : lang === 'fr'
                  ? 'Spectrométrie de masse et absorption atomique'
                  : 'Mass Spectrometry & Atomic Absorption',
            category:
              lang === 'ar'
                ? 'أجهزة متقدمة'
                : lang === 'fr'
                  ? 'Équipements de pointe'
                  : 'Advanced Instrumentation',
          },
          {
            img: labGallery6,
            title:
              lang === 'ar'
                ? 'وحدة ضبط وتأكيد الجودة النوعية (QA/QC)'
                : lang === 'fr'
                  ? "Unité d'assurance et contrôle qualité"
                  : 'Quality Assurance & Control Unit',
            category:
              lang === 'ar'
                ? 'إدارة الجودة'
                : lang === 'fr'
                  ? 'Qualité'
                  : 'Quality Management',
          },
        ];

  // ============================================================
  // Instruments & Equipment
  // ============================================================

  const keyInstruments = [
    {
      name:
        lang === 'ar'
          ? 'جهاز مطياف الكتلة البلازمية (ICP-MS)'
          : 'ICP-MS Mass Spectrometer',

      desc:
        lang === 'ar'
          ? 'تحليل العناصر الثقيلة والفلزات النزرة بدقة جزء في البليون (ppb)'
          : 'Ultra-trace heavy metal detection down to parts-per-billion',

      icon: Microscope,
      badge: 'ISO 17025',
    },

    {
      name:
        lang === 'ar'
          ? 'جهاز كروماتوغرافيا الغاز (GC-MS)'
          : 'Gas Chromatograph (GC-MS)',

      desc:
        lang === 'ar'
          ? 'كشف المركبات العضوية المتطايرة والمبيدات الحشرية والهيدروكربونات'
          : 'Detection of volatile organic compounds, pesticides and hydrocarbons',

      icon: FlaskConical,
      badge: 'EPA Approved',
    },

    {
      name:
        lang === 'ar'
          ? 'مطياف الأشعة فوق البنفسجية والمرئية (UV-Vis)'
          : 'UV-Vis Spectrophotometer',

      desc:
        lang === 'ar'
          ? 'فحص النترات والنتريت والكلور المتبقي والفوسفات والأمونيا بدقة قياسية'
          : 'High precision spectrophotometric determination of anions & nutrients',

      icon: Activity,
      badge: 'Automated',
    },

    {
      name:
        lang === 'ar'
          ? 'حاضنات بكتيرية دقيقة التعقيم وأوتوكلاف'
          : 'Digital Incubators & Autoclaves',

      desc:
        lang === 'ar'
          ? 'فحص بكتيريا القولون الكلية والبرازية والمكورات المعوية وضمان السلامة الحيوية'
          : 'Culture, enumeration and confirmation of coliforms & E. coli',

      icon: Sparkles,
      badge: 'Biosafety L2',
    },
  ];

  // ============================================================
  // Booking Submit
  // ============================================================

  const handleBookingSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setBookingSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      // --------------------------------------------------------
      // Basic validation
      // --------------------------------------------------------

      if (!bookingName.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال الاسم الكامل.'
            : lang === 'fr'
              ? 'Veuillez saisir le nom complet.'
              : 'Please enter the full name.'
        );
      }

      if (!bookingNationalId.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال رقم الهوية الوطنية أو الإقامة.'
            : lang === 'fr'
              ? "Veuillez saisir le numéro d'identité ou de résidence."
              : 'Please enter the National ID or Iqama.'
        );
      }

      if (!bookingPhone.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال رقم الجوال.'
            : lang === 'fr'
              ? 'Veuillez saisir le numéro de téléphone.'
              : 'Please enter the phone number.'
        );
      }

      if (!bookingEmail.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال البريد الإلكتروني.'
            : lang === 'fr'
              ? "Veuillez saisir l'adresse e-mail."
              : 'Please enter the email address.'
        );
      }

      if (!bookingDepartment.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى اختيار القسم.'
            : lang === 'fr'
              ? 'Veuillez sélectionner le département.'
              : 'Please select the department.'
        );
      }

      if (!bookingEmployee.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى إدخال اسم الموظف المراد زيارته.'
            : lang === 'fr'
              ? "Veuillez saisir le nom de l'employé à visiter."
              : 'Please enter the employee to visit.'
        );
      }

      if (!bookingPurpose.trim()) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى اختيار الغرض من الزيارة.'
            : lang === 'fr'
              ? "Veuillez sélectionner l'objet de la visite."
              : 'Please select the visit purpose.'
        );
      }

      if (!bookingBranch) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى اختيار المختبر أو الفرع.'
            : lang === 'fr'
              ? "Veuillez sélectionner le laboratoire ou l'agence."
              : 'Please select the laboratory or branch.'
        );
      }

      if (!bookingDate) {
        throw new Error(
          lang === 'ar'
            ? 'يرجى اختيار تاريخ الزيارة.'
            : lang === 'fr'
              ? 'Veuillez sélectionner la date de visite.'
              : 'Please select the visit date.'
        );
      }

      // --------------------------------------------------------
      // Generate visitor ID and QR
      // --------------------------------------------------------

      const visitor_id =
        await getNextVisitorId();

      const qr_url =
        buildVisitorQrUrl(visitor_id);

      // --------------------------------------------------------
      // Convert Full Name -> first_name / last_name
      // --------------------------------------------------------

      const nameParts =
        bookingName
          .trim()
          .split(/\s+/);

      const first_name =
        nameParts[0] || '';

      const last_name =
        nameParts
          .slice(1)
          .join(' ') || '';

      // --------------------------------------------------------
      // Convert UI "central" -> NULL
      // --------------------------------------------------------

      const selectedBranch =
        bookingBranch === 'central'
          ? null
          : bookingBranch || null;

      // --------------------------------------------------------
      // PostgreSQL time format
      // --------------------------------------------------------

      const arrival_time =
        bookingTime &&
        /^\d{1,2}:\d{2}$/.test(
          bookingTime
        )
          ? `${bookingTime}:00`
          : bookingTime ||
            '09:00:00';

      // --------------------------------------------------------
      // EXACT visitors table payload
      // --------------------------------------------------------

      const recordToInsert = {
        visitor_id,

        first_name,

        last_name,

        national_id:
          bookingNationalId.trim(),

        phone:
          bookingPhone.trim(),

        email:
          bookingEmail.trim(),

        company:
          bookingOrg.trim() || null,

        job_title:
          bookingJobTitle.trim() || null,

        laboratory:
          center.id,

        branch:
          selectedBranch,

        department:
          bookingDepartment.trim() ||
          'Quality Control',

        employee:
          bookingEmployee.trim(),

        purpose:
          bookingPurpose.trim(),

        visit_date:
          bookingDate,

        arrival_time,

        notes:
          bookingNotes.trim() || null,

        qr_url,

        status:
          'Pending',

        timestamp:
          new Date().toISOString(),
      };

      console.log(
        'CenterDetail visitor registration payload:',
        recordToInsert
      );

      // --------------------------------------------------------
      // Supabase INSERT
      // --------------------------------------------------------

      let insertResult =
        await supabase
          .from('visitors')
          .insert([
            recordToInsert,
          ])
          .select(
            'id, visitor_id'
          )
          .single();

      // --------------------------------------------------------
      // Retry for temporary PostgREST schema-cache issue
      // --------------------------------------------------------

      if (
        insertResult.error &&
        (
          insertResult.error.code ===
            'PGRST204' ||
          insertResult.error.message?.includes(
            'schema cache'
          )
        )
      ) {
        for (
          let attempt = 1;
          attempt <= 2;
          attempt++
        ) {
          console.warn(
            `PostgREST schema cache retry ${attempt}...`,
            insertResult.error
          );

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                attempt * 1000
              )
          );

          insertResult =
            await supabase
              .from('visitors')
              .insert([
                recordToInsert,
              ])
              .select(
                'id, visitor_id'
              )
              .single();

          if (
            !insertResult.error
          ) {
            break;
          }
        }
      }

      // --------------------------------------------------------
      // Check result
      // --------------------------------------------------------

      const {
        data,
        error,
      } = insertResult;

      if (error) {
        console.error(
          'CenterDetail visitor registration error:',
          error
        );

        throw error;
      }

      if (
        !data ||
        (!data.id &&
          !data.visitor_id)
      ) {
        throw new Error(
          'No record returned from Supabase insert.'
        );
      }

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      const confirmedVisitorId =
        data.visitor_id ||
        visitor_id;

      setBookingSuccess(
        confirmedVisitorId
      );

      setTimeout(() => {
        navigate(
          `/success?id=${encodeURIComponent(
            confirmedVisitorId
          )}`
        );
      }, 1500);
    } catch (
      err: unknown
    ) {
      console.error(
        'Booking submission failed:',
        err
      );

      const msg =
        err &&
        typeof err === 'object' &&
        'message' in err
          ? String(
              (
                err as {
                  message: string;
                }
              ).message
            )
          : '';

      const errorPrefix =
        lang === 'ar'
          ? 'تعذر إتمام التسجيل حالياً: '
          : lang === 'fr'
            ? "Impossible d'effectuer l'inscription pour le moment : "
            : 'Booking failed: ';

      setBookingError(
        `${errorPrefix}${
          msg || 'Unknown error'
        }`
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Breadcrumb
          items={[
            {
              label: t('nav.labs'),
              to: '/laboratories',
            },
            {
              label: center.name,
            },
          ]}
        />

        {/* ======================================================
            Executive Hero Banner
        ====================================================== */}

        <div className="mt-4 relative overflow-hidden rounded-3xl bg-[#071324] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">

          <div className="absolute inset-0 z-0">

            <img
              src={facilityPhoto}
              alt={center.name}
              className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-102 filter brightness-95"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#071324] via-[#071324]/95 sm:via-[#071324]/90 to-[#0e2a4a]/70" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071324] via-transparent to-transparent" />

          </div>

          <div className="relative z-10 max-w-4xl">

            {/* Accreditation & Institutional Badges */}

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-400/30 backdrop-blur-md">

                <ShieldCheck className="w-3.5 h-3.5" />

                {lang === 'ar'
                  ? 'شركة المياه الوطنية — الإدارة العامة للمختبرات بالقطاع الجنوبي'
                  : lang === 'fr'
                    ? 'NWC — Laboratoires des eaux du secteur sud'
                    : 'NWC — Southern Sector Water Laboratories'}

              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 backdrop-blur-md">

                <Award className="w-3.5 h-3.5" />

                {lang === 'ar'
                  ? 'معتمد وفق المواصفة ISO/IEC 17025:2017'
                  : lang === 'fr'
                    ? 'Accrédité selon ISO/IEC 17025:2017'
                    : 'Accredited ISO/IEC 17025:2017'}

              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 backdrop-blur-md">

                <MapPin className="w-3.5 h-3.5 text-blue-400" />

                {center.region}

              </span>

            </div>

            {/* Official Title */}

            <div className="flex items-start sm:items-center gap-3.5 mb-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40 border border-blue-400/30 mt-1 sm:mt-0">

                <Building2 className="w-6 h-6" />

              </div>

              <div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug tracking-tight">
                  {center.name}
                </h1>

                <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-0.5">
                  {lang === 'ar'
                    ? 'خبراء مختصون في أحدث التقنيات والمعايير الدولية في مجال تحليل مياه الشرب والخدمات البيئية'
                    : lang === 'fr'
                      ? "Experts spécialisés dans l'analyse des eaux potables et les services environnementaux"
                      : 'Specialized experts in international standards for drinking water and environmental testing'}
                </p>

              </div>

            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl mb-6 font-normal">
              {center.about}
            </p>

            {/* Action Buttons */}

            <div className="flex flex-wrap items-center gap-3">

              <button
                type="button"
                onClick={() => {
                  setActiveTab(
                    'booking'
                  );

                  document
                    .getElementById(
                      'booking-section'
                    )
                    ?.scrollIntoView({
                      behavior:
                        'smooth',
                    });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="w-4 h-4 shrink-0" />

                <span>
                  {lang === 'ar'
                    ? 'تسجيل زيارة للمختبر'
                    : lang === 'fr'
                      ? 'Réserver une visite'
                      : 'Book a Lab Visit'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab(
                    'location'
                  );

                  document
                    .getElementById(
                      'location-section'
                    )
                    ?.scrollIntoView({
                      behavior:
                        'smooth',
                    });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-all border border-white/25 backdrop-blur-md shadow-xs hover:shadow-md whitespace-nowrap cursor-pointer"
              >
                <Navigation className="w-4 h-4 shrink-0 text-blue-300" />

                <span>
                  {lang === 'ar'
                    ? 'الموقع على الخريطة'
                    : lang === 'fr'
                      ? 'Localisation'
                      : 'Location on Map'}
                </span>
              </button>

              <Link
                to={`/survey?laboratory=${encodeURIComponent(
                  center.id
                )}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-all border border-white/25 backdrop-blur-md shadow-xs hover:shadow-md whitespace-nowrap"
              >
                <FileText className="w-4 h-4 shrink-0 text-emerald-300" />

                <span>
                  {lang === 'ar'
                    ? 'استبيان رضا العملاء'
                    : lang === 'fr'
                      ? 'Enquête de satisfaction'
                      : 'Customer Survey'}
                </span>
              </Link>

              <Link
                to={`/enquiry?laboratory=${encodeURIComponent(
                  center.id
                )}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-all border border-white/25 backdrop-blur-md shadow-xs hover:shadow-md whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0 text-amber-300" />

                <span>
                  {lang === 'ar'
                    ? 'إرسال استفسار'
                    : lang === 'fr'
                      ? 'Envoyer une demande'
                      : 'Submit Enquiry'}
                </span>
              </Link>

            </div>

            {/* Key Stats */}

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">

                <p className="text-lg sm:text-xl font-bold font-mono text-blue-400">
                  ISO/IEC
                </p>

                <p className="text-xs font-semibold text-white">
                  17025:2017
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'اعتماد دولي للكفاءة'
                    : lang === 'fr'
                      ? 'Accréditation internationale'
                      : 'International Accreditation'}
                </p>

              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">

                <p className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  24 / 7
                </p>

                <p className="text-xs font-semibold text-white">
                  {lang === 'ar'
                    ? 'مراقبة مستمرة'
                    : lang === 'fr'
                      ? 'Surveillance continue'
                      : 'Continuous Surveillance'}
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'شبكات مياه الشرب'
                    : lang === 'fr'
                      ? 'Réseaux d’eau potable'
                      : 'Drinking Water Networks'}
                </p>

              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">

                <p className="text-lg sm:text-xl font-bold text-amber-300 truncate">
                  {center.region}
                </p>

                <p className="text-xs font-semibold text-white">
                  {lang === 'ar'
                    ? 'المختبر المركزي'
                    : lang === 'fr'
                      ? 'Laboratoire Central'
                      : 'Central Laboratory'}
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'حاضنة المحافظات'
                    : lang === 'fr'
                      ? 'Couverture régionale'
                      : 'Serving Provinces'}
                </p>

              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">

                <p className="text-lg sm:text-xl font-bold font-mono text-sky-400">
                  SAC
                </p>

                <p className="text-xs font-semibold text-white">
                  {lang === 'ar'
                    ? 'المركز السعودي للاعتماد'
                    : lang === 'fr'
                      ? 'Accréditation saoudienne'
                      : 'Saudi Accreditation'}
                </p>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'المعايير الوطنية'
                    : lang === 'fr'
                      ? 'Normes nationales'
                      : 'National Standards'}
                </p>

              </div>

            </div>

          </div>
        </div>

        {/* ======================================================
            Quick Navigation Tabs
        ====================================================== */}

        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">

          {[
            {
              id: 'about',
              label:
                lang === 'ar'
                  ? 'عن المختبر'
                  : lang === 'fr'
                    ? 'À propos'
                    : 'About Lab',
              icon: Info,
            },
            {
              id: 'capabilities',
              label:
                lang === 'ar'
                  ? 'القدرات والوحدات'
                  : lang === 'fr'
                    ? 'Capacités'
                    : 'Capabilities & Units',
              icon: Microscope,
            },
            {
              id: 'equipment',
              label:
                lang === 'ar'
                  ? 'الأجهزة والتقنيات'
                  : lang === 'fr'
                    ? 'Équipements'
                    : 'Equipment',
              icon: FlaskConical,
            },
            {
              id: 'branches',
              label:
                lang === 'ar'
                  ? 'الفروع والشبكة'
                  : lang === 'fr'
                    ? 'Agences affiliées'
                    : 'Branches',
              icon: Network,
            },
            {
              id: 'gallery',
              label:
                lang === 'ar'
                  ? 'معرض الصور'
                  : lang === 'fr'
                    ? 'Galerie'
                    : 'Photo Gallery',
              icon: Camera,
            },
            {
              id: 'location',
              label:
                lang === 'ar'
                  ? 'الموقع والخريطة'
                  : lang === 'fr'
                    ? 'Localisation'
                    : 'Location & Map',
              icon: MapPin,
            },
            {
              id: 'booking',
              label:
                lang === 'ar'
                  ? 'حجز موعد زيارة'
                  : lang === 'fr'
                    ? 'Réserver une visite'
                    : 'Book Visit',
              icon: CalendarCheck,
            },
          ].map((tab) => {
            const Icon =
              tab.icon;

            const isActive =
              activeTab ===
              tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(
                    tab.id as typeof activeTab
                  );

                  const el =
                    document.getElementById(
                      `${tab.id}-section`
                    );

                  if (el) {
                    el.scrollIntoView({
                      behavior:
                        'smooth',
                    });
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>
                  {tab.label}
                </span>
              </button>
            );
          })}

        </div>

        {/* ======================================================
            Section 1: About
        ====================================================== */}

        <section
          id="about-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? `عن ${center.name}`
                  : lang === 'fr'
                    ? `À propos de ${center.name}`
                    : `About ${center.name}`}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'منظومة رائدة في فحص مياه الشرب والرقابة البيئية وحماية الصحة العامة'
                  : lang === 'fr'
                    ? "Système spécialisé dans le contrôle de la qualité de l'eau potable et la surveillance environnementale"
                    : 'Leading drinking water quality surveillance and environmental protection system'}
              </p>

            </div>

          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            {center.about}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">

              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <FlaskConical className="w-4 h-4" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {lang === 'ar'
                  ? 'التحاليل الكيميائية'
                  : lang === 'fr'
                    ? 'Analyses chimiques'
                    : 'Chemical Testing'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'فحص المعادن الثقيلة، الأملاح الذائبة، المركبات العضوية، والنترات وفق لوائح المواصفات القياسية السعودية (SASO).'
                  : 'Heavy metals, TDS, organic compounds, and nutrients testing compliant with SASO regulations.'}
              </p>

            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">

              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Microscope className="w-4 h-4" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {lang === 'ar'
                  ? 'التحاليل الميكروبيولوجية'
                  : lang === 'fr'
                    ? 'Analyses microbiologiques'
                    : 'Microbiological Testing'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'كشف البكتيريا القولونية الكلية والبرازية، الإشريكية القولونية، والميكروبات الحيوية لضمان سلامة مياه الشرب.'
                  : 'Total coliforms, E. coli, and pathogenic bio-surveillance ensuring drinking water safety.'}
              </p>

            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">

              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {lang === 'ar'
                  ? 'الخصائص الفيزيائية'
                  : lang === 'fr'
                    ? 'Paramètres physiques'
                    : 'Physical Parameters'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'قياس العكورة، الرقم الهيدروجيني (pH)، التوصيل الكهربائي، اللون، والطعم لضمان نقاء واستساغة المياه.'
                  : 'Turbidity, pH, electrical conductivity, color, and aesthetic quality monitoring.'}
              </p>

            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">

              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {lang === 'ar'
                  ? 'توكيد الجودة (QA/QC)'
                  : lang === 'fr'
                    ? 'Assurance qualité'
                    : 'Quality Assurance'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'معايرة دورية للأجهزة، مشاركة في اختبارات الكفاءة الدولية، وتطبيق دقيق لمتطلبات آيزو 17025.'
                  : 'Standardized calibration, proficiency testing, and ISO 17025 quality control.'}
              </p>

            </div>

          </div>
        </section>

        {/* ======================================================
            Section 2: Capabilities
        ====================================================== */}

        <section
          id="capabilities-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Microscope className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'الوحدات والقدرات التحليلية المعتمدة'
                  : lang === 'fr'
                    ? 'Unités et capacités analytiques'
                    : 'Accredited Analytical Units & Capabilities'}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'فحوصات معتمدة مخبرياً وميدانياً بدقة قياسية عالية'
                  : lang === 'fr'
                    ? 'Protocoles analytiques et capacités de laboratoire'
                    : 'Certified testing protocols and analytical suites'}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {center.capabilities.map(
              (cap, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-2xs"
                >

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      ISO 17025
                    </span>

                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />

                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {cap.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cap.description}
                  </p>

                </div>
              )
            )}

            {center.analyses.map(
              (ana, i) => (
                <div
                  key={`ana-${i}`}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-2xs"
                >

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {lang === 'ar'
                        ? 'فحص قياسي'
                        : lang === 'fr'
                          ? 'Analyse standard'
                          : 'Standard Test'}
                    </span>

                    <FlaskConical className="w-4 h-4 text-blue-500" />

                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {ana.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ana.description}
                  </p>

                </div>
              )
            )}

          </div>
        </section>

        {/* ======================================================
            Section 3: Equipment
        ====================================================== */}

        <section
          id="equipment-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'التجهيزات والتقنيات التحليلية المتقدمة'
                  : lang === 'fr'
                    ? 'Équipements et technologies analytiques'
                    : 'Advanced Analytical Instrumentation'}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'منظومة آلية ومؤتمتة لضمان دقة القراءات وسرعة النتائج'
                  : lang === 'fr'
                    ? 'Plateformes analytiques de haute précision'
                    : 'Automated high-precision platforms for rapid and certified data'}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {keyInstruments.map(
              (inst, i) => {
                const Icon =
                  inst.icon;

                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
                  >

                    <div>

                      <div className="flex items-center justify-between mb-3">

                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Icon className="w-4.5 h-4.5" />
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {inst.badge}
                        </span>

                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                        {inst.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {inst.desc}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        </section>

        {/* ======================================================
            Section 4: Branches
        ====================================================== */}

        <section
          id="branches-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Network className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'فروع المختبر وشبكة التغطية بالمحافظات'
                  : lang === 'fr'
                    ? 'Agences affiliées et réseau régional'
                    : 'Affiliated Branches & Central Network'}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'مختبرات تابعة تقدم الفحص المباشر في محافظات المنطقة'
                  : lang === 'fr'
                    ? 'Laboratoires affiliés desservant les gouvernorats de la région'
                    : 'Local laboratory branches servicing provincial governorates'}
              </p>

            </div>

          </div>

          {center.branches &&
          center.branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {center.branches.map(
                (branch) => (
                  <div
                    key={branch.id}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
                  >

                    <div>

                      <div className="flex items-center justify-between gap-2 mb-2">

                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                          {lang === 'ar'
                            ? 'فرع تابع'
                            : lang === 'fr'
                              ? 'Agence affiliée'
                              : 'Affiliated Branch'}
                        </span>

                        <span className="text-xs text-slate-400 font-mono">
                          {branch.workingHours}
                        </span>

                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                        {branch.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        {branch.about}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">

                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />

                        <span>
                          {branch.address}
                        </span>

                      </div>

                    </div>

                    <Link
                      to={`/laboratories/${center.id}/${branch.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                    >

                      <span>
                        {lang === 'ar'
                          ? `زيارة صفحة فرع ${branch.name}`
                          : lang === 'fr'
                            ? `Voir ${branch.name}`
                            : `View ${branch.name} Details`}
                      </span>

                      <Arrow className="w-4 h-4 shrink-0" />

                    </Link>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'ar'
                  ? 'يقدم المختبر المركزي التغطية الشاملة لكافة المحافظات والمراكز التابعة بالمنطقة.'
                  : lang === 'fr'
                    ? 'Le laboratoire central assure une couverture complète des secteurs concernés.'
                    : 'The Central Laboratory provides centralized coverage for the relevant sectors.'}
              </p>

            </div>
          )}

        </section>

        {/* ======================================================
            Section 5: Gallery
        ====================================================== */}

        <section
          id="gallery-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'معرض صور المختبر والبيئة التشغيلية'
                  : lang === 'fr'
                    ? 'Galerie du laboratoire'
                    : 'Facility & Operational Photo Gallery'}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'صور حقيقية لمنشآت وتجهيزات مختبرات مياه الشرب بالقطاع الجنوبي'
                  : lang === 'fr'
                    ? 'Photographies des installations et équipements'
                    : 'Authentic high-resolution facility and laboratory photography'}
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">

            {galleryItems.map(
              (item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedImage(
                      item.img
                    );

                    setSelectedImageTitle(
                      item.title
                    );
                  }}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-4/3 cursor-pointer shadow-xs hover:shadow-lg transition-all"
                >

                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-3 start-3 end-3 text-white">

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white mb-1 inline-block">
                      {item.category}
                    </span>

                    <p className="text-xs font-semibold line-clamp-1">
                      {item.title}
                    </p>

                  </div>

                  <div className="absolute top-3 end-3 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">

                    <Eye className="w-3.5 h-3.5" />

                  </div>

                </div>
              )
            )}

          </div>
        </section>

        {/* ======================================================
            Section 6: Location
        ====================================================== */}

        <section
          id="location-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>

              <div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'الموقع والعنوان على الخريطة'
                    : lang === 'fr'
                      ? 'Localisation et carte'
                      : 'Official Location & Interactive Map'}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {center.contact.address}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

                <span dir="ltr">
                  {coords.dms}
                </span>

              </div>

              <button
                type="button"
                onClick={handleCopyCoords}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                title={
                  lang === 'ar'
                    ? 'نسخ الإحداثيات'
                    : 'Copy Coordinates'
                }
              >

                {copiedCoords ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />

                    <span className="text-emerald-600 dark:text-emerald-400">
                      {lang === 'ar'
                        ? 'تم النسخ!'
                        : 'Copied!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />

                    <span>
                      {lang === 'ar'
                        ? 'نسخ'
                        : 'Copy'}
                    </span>
                  </>
                )}

              </button>

            </div>

          </div>

          {/* Google Map */}

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-900">

            <iframe
              title={`${center.name} Interactive Google Map`}
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=${
                lang === 'ar'
                  ? 'ar'
                  : lang === 'fr'
                    ? 'fr'
                    : 'en'
              }&z=15&output=embed`}
              className="w-full h-80 sm:h-96 border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute top-3 start-3 max-w-sm pointer-events-auto">

              <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-xs">

                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">

                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />

                  <span>
                    {center.name}
                  </span>

                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {center.contact.address}
                </p>

              </div>

            </div>

          </div>

          {/* Navigation Buttons */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <a
              href={coords.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
            >

              <ExternalLink className="w-4 h-4 shrink-0" />

              <span>
                {lang === 'ar'
                  ? 'فتح الموقع في Google Maps'
                  : 'Open in Google Maps'}
              </span>

            </a>

            <a
              href={coords.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
            >

              <Navigation className="w-4 h-4 shrink-0" />

              <span>
                {lang === 'ar'
                  ? 'الاتجاهات الملاحية عبر الخريطة'
                  : 'Get Directions'}
              </span>

            </a>

          </div>

          {/* Contact Details */}

          <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {lang === 'ar'
                      ? 'الهاتف'
                      : 'Phone'}
                  </p>

                  <p
                    className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                    dir="ltr"
                  >
                    {center.contact.phone}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {lang === 'ar'
                      ? 'البريد الإلكتروني'
                      : 'Email'}
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {center.contact.email}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {lang === 'ar'
                      ? 'ساعات العمل'
                      : 'Working Hours'}
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {center.workingHours}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            Section 7: Visitor Booking
        ====================================================== */}

        <section
          id="booking-section"
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>

            <div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">

                {lang === 'ar'
                  ? `حجز موعد زيارة أو تسليم عينات إلى ${center.name}`
                  : lang === 'fr'
                    ? `Réserver une visite ou déposer un échantillon à ${center.name}`
                    : `Book a Visit or Specimen Intake at ${center.name}`}

              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">

                {lang === 'ar'
                  ? 'خدمة إلكترونية فورية مخصصة للعملاء والجهات الحكومية والخاصة'
                  : lang === 'fr'
                    ? "Service électronique d'enregistrement des visiteurs et de dépôt d'échantillons"
                    : 'Instant visitor registration and sample submission request'}

              </p>

            </div>

          </div>

          {bookingSuccess ? (

            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center animate-fade-in">

              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />

              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">

                {lang === 'ar'
                  ? 'تم تأكيد طلب موعد الزيارة بنجاح!'
                  : lang === 'fr'
                    ? 'Votre demande a été enregistrée avec succès !'
                    : 'Visit Registration Confirmed!'}

              </h3>

              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">

                {lang === 'ar'
                  ? `رقم المرجع: ${bookingSuccess}`
                  : lang === 'fr'
                    ? `Référence : ${bookingSuccess}`
                    : `Reference ID: ${bookingSuccess}`}

              </p>

            </div>

          ) : (

            <form
              onSubmit={
                handleBookingSubmit
              }
              className="space-y-4"
            >

              {bookingError && (

                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">

                  <AlertCircle className="w-4 h-4 shrink-0" />

                  <span>
                    {bookingError}
                  </span>

                </div>

              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Full Name */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'الاسم الكامل'
                      : lang === 'fr'
                        ? 'Nom complet'
                        : 'Full Name'}{' '}

                    *

                  </label>

                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) =>
                      setBookingName(
                        e.target.value
                      )
                    }
                    placeholder={
                      lang === 'ar'
                        ? 'مثال: محمد عبدالله'
                        : lang === 'fr'
                          ? 'Ex. Mohamed Abdullah'
                          : 'e.g. John Doe'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* National ID / Iqama */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'رقم الهوية الوطنية / الإقامة'
                      : lang === 'fr'
                        ? 'N° d’identité / résidence'
                        : 'National ID / Iqama'}{' '}

                    *

                  </label>

                  <input
                    type="text"
                    required
                    value={
                      bookingNationalId
                    }
                    onChange={(e) =>
                      setBookingNationalId(
                        e.target.value
                      )
                    }
                    placeholder={
                      lang === 'ar'
                        ? 'أدخل رقم الهوية أو الإقامة'
                        : lang === 'fr'
                          ? "Saisissez le numéro d'identité"
                          : 'Enter National ID or Iqama'
                    }
                    inputMode="numeric"
                    dir="ltr"
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <p className="mt-1 text-[10px] text-slate-400">

                    {lang === 'ar'
                      ? 'هذا الحقل مطلوب لإتمام تسجيل الزائر.'
                      : lang === 'fr'
                        ? "Ce champ est requis pour l'enregistrement."
                        : 'Required for visitor registration.'}

                  </p>

                </div>

                {/* Organization */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'الجهة أو الشركة (اختياري)'
                      : lang === 'fr'
                        ? 'Organisme / société (facultatif)'
                        : 'Organization (Optional)'}

                  </label>

                  <input
                    type="text"
                    value={bookingOrg}
                    onChange={(e) =>
                      setBookingOrg(
                        e.target.value
                      )
                    }
                    placeholder={
                      lang === 'ar'
                        ? 'اسم الجهة أو فردي'
                        : lang === 'fr'
                          ? 'Organisme ou particulier'
                          : 'Company or Individual'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'رقم الجوال'
                      : lang === 'fr'
                        ? 'Numéro de téléphone'
                        : 'Phone Number'}{' '}

                    *

                  </label>

                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) =>
                      setBookingPhone(
                        e.target.value
                      )
                    }
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'البريد الإلكتروني'
                      : lang === 'fr'
                        ? 'Adresse e-mail'
                        : 'Email Address'}{' '}

                    *

                  </label>

                  <input
                    type="email"
                    required
                    value={bookingEmail}
                    onChange={(e) =>
                      setBookingEmail(
                        e.target.value
                      )
                    }
                    placeholder="name@domain.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Department */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'القسم'
                      : lang === 'fr'
                        ? 'Département'
                        : 'Department'}{' '}

                    *

                  </label>

                  <select
                    required
                    value={
                      bookingDepartment
                    }
                    onChange={(e) =>
                      setBookingDepartment(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >

                    <option value="Quality Control">
                      {lang === 'ar'
                        ? 'مراقبة الجودة'
                        : lang === 'fr'
                          ? 'Contrôle Qualité'
                          : 'Quality Control'}
                    </option>

                    <option value="Chemical Analysis">
                      {lang === 'ar'
                        ? 'التحاليل الكيميائية'
                        : lang === 'fr'
                          ? 'Analyses Chimiques'
                          : 'Chemical Analysis'}
                    </option>

                    <option value="Microbiology">
                      {lang === 'ar'
                        ? 'الأحياء الدقيقة (الميكروبيولوجي)'
                        : lang === 'fr'
                          ? 'Microbiologie'
                          : 'Microbiology'}
                    </option>

                    <option value="Sample Reception">
                      {lang === 'ar'
                        ? 'استقبال وتسجيل العينات'
                        : lang === 'fr'
                          ? 'Réception des Échantillons'
                          : 'Sample Reception'}
                    </option>

                    <option value="Calibration">
                      {lang === 'ar'
                        ? 'المعايرة والأجهزة'
                        : lang === 'fr'
                          ? 'Étalonnage et Métrologie'
                          : 'Calibration'}
                    </option>

                    <option value="Administration">
                      {lang === 'ar'
                        ? 'الشؤون الإدارية والفنية'
                        : lang === 'fr'
                          ? 'Administration'
                          : 'Administration'}
                    </option>

                  </select>

                </div>

                {/* Employee to Visit */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'الموظف المراد زيارته'
                      : lang === 'fr'
                        ? 'Employé à visiter'
                        : 'Employee to Visit'}{' '}

                    *

                  </label>

                  <input
                    type="text"
                    required
                    value={
                      bookingEmployee
                    }
                    onChange={(e) =>
                      setBookingEmployee(
                        e.target.value
                      )
                    }
                    placeholder={
                      lang === 'ar'
                        ? 'اسم الموظف أو رئيس القسم'
                        : lang === 'fr'
                          ? "Nom de l'employé ou du responsable"
                          : 'Staff member or department head'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Job Title */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'المسمى الوظيفي'
                      : lang === 'fr'
                        ? 'Fonction'
                        : 'Job Title'}

                  </label>

                  <input
                    type="text"
                    value={
                      bookingJobTitle
                    }
                    onChange={(e) =>
                      setBookingJobTitle(
                        e.target.value
                      )
                    }
                    placeholder={
                      lang === 'ar'
                        ? 'المسمى الوظيفي'
                        : lang === 'fr'
                          ? 'Fonction'
                          : 'Job title'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Laboratory / Branch */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {getBranchLabel()} *

                  </label>

                  <select
                    required
                    value={
                      bookingBranch
                    }
                    onChange={(e) =>
                      setBookingBranch(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >

                    <option
                      value=""
                      disabled
                    >
                      {lang === 'ar'
                        ? 'اختر المختبر أو الفرع'
                        : lang === 'fr'
                          ? 'Sélectionnez le laboratoire ou l’agence'
                          : 'Select laboratory or branch'}
                    </option>

                    <option value="central">
                      {getCentralOptionLabel()}
                    </option>

                    {center.branches?.map(
                      (branch) => (
                        <option
                          key={
                            branch.id
                          }
                          value={
                            branch.id
                          }
                        >
                          {
                            branch.name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Purpose */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'الغرض من الزيارة'
                      : lang === 'fr'
                        ? 'Objet de la visite'
                        : 'Visit Purpose'}{' '}

                    *

                  </label>

                  <select
                    required
                    value={
                      bookingPurpose
                    }
                    onChange={(e) =>
                      setBookingPurpose(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >

                    <option
                      value=""
                      disabled
                    >
                      {lang === 'ar'
                        ? 'اختر الغرض من الزيارة'
                        : lang === 'fr'
                          ? 'Sélectionnez l’objet'
                          : 'Select visit purpose'}
                    </option>

                    {bookingPurposeOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {getLocalizedPurpose(
                            option
                          )}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* Visit Date */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'تاريخ الزيارة'
                      : lang === 'fr'
                        ? 'Date de visite'
                        : 'Visit Date'}{' '}

                    *

                  </label>

                  <input
                    type="date"
                    required
                    value={
                      bookingDate
                    }
                    onChange={(e) =>
                      setBookingDate(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

                {/* Arrival Time */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">

                    {lang === 'ar'
                      ? 'وقت الوصول المتوقع'
                      : lang === 'fr'
                        ? "Heure d'arrivée prévue"
                        : 'Arrival Time'}

                  </label>

                  <input
                    type="time"
                    value={
                      bookingTime
                    }
                    onChange={(e) =>
                      setBookingTime(
                        e.target.value
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                </div>

              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ar'
                    ? 'ملاحظات إضافية (اختياري)'
                    : lang === 'fr'
                      ? 'Remarques complémentaires (facultatif)'
                      : 'Additional Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'أي متطلبات أو استفسارات خاصة بالزيارة...'
                      : lang === 'fr'
                        ? 'Toute exigence particulière concernant la visite...'
                        : 'Any specific requests or requirements for the visit...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Selected Destination Summary */}

              {bookingBranch && (

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">

                  <div className="flex items-start gap-2.5">

                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />

                    <div>

                      <p className="text-xs font-bold text-blue-900 dark:text-blue-200">

                        {lang === 'ar'
                          ? 'وجهة الزيارة'
                          : lang === 'fr'
                            ? 'Destination de la visite'
                            : 'Visit Destination'}

                      </p>

                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">

                        {bookingBranch ===
                        'central'
                          ? getCentralOptionLabel()
                          : center.branches?.find(
                              (
                                branch
                              ) =>
                                branch.id ===
                                bookingBranch
                            )?.name ||
                            bookingBranch}

                      </p>

                    </div>

                  </div>

                </div>

              )}

              {/* Submit */}

              <div className="pt-2 flex justify-end">

                <button
                  type="submit"
                  disabled={
                    bookingSubmitting
                  }
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >

                  <Send className="w-4 h-4 shrink-0" />

                  <span>

                    {bookingSubmitting
                      ? lang === 'ar'
                        ? 'جاري التأكيد...'
                        : lang === 'fr'
                          ? 'Enregistrement...'
                          : 'Confirming...'
                      : lang === 'ar'
                        ? 'تأكيد حجز الموعد'
                        : lang === 'fr'
                          ? 'Confirmer la réservation'
                          : 'Confirm Visit Booking'}

                  </span>

                </button>

              </div>

            </form>
          )}

        </section>

        {/* ======================================================
            Back Link
        ====================================================== */}

        <div className="mt-8">

          <Link
            to="/laboratories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#172033] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs hover:shadow-md whitespace-nowrap"
          >

            <Arrow className="w-4 h-4 shrink-0" />

            <span>
              {t(
                'detail.backToLabs'
              )}
            </span>

          </Link>

        </div>

      </div>

      {/* ========================================================
          Lightbox / Gallery Modal
      ======================================================== */}

      {selectedImage && (

        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
          onClick={() =>
            setSelectedImage(
              null
            )
          }
        >

          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white">

              <span className="text-sm font-bold">
                {
                  selectedImageTitle
                }
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedImage(
                    null
                  )
                }
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label={
                  lang === 'ar'
                    ? 'إغلاق'
                    : lang === 'fr'
                      ? 'Fermer'
                      : 'Close'
                }
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            <div className="p-2 flex items-center justify-center bg-black/60">

              <img
                src={
                  selectedImage
                }
                alt={
                  selectedImageTitle
                }
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
}