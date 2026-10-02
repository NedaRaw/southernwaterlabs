import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Activity,
  MapPin,
  Clock,
  Phone,
  Mail,
  Truck,
  Building2,
  FileText,
  UserPlus,
  Send,
  ClipboardList,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  X,
  Droplets,
  Microscope,
  Layers,
  Sparkles,
  Search,
  Users,
  Navigation,
  Copy,
  Check,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

// Official Najran Images
import najranLogo from '@/assets/images/najran_logo_lab.png';
import najranBuilding from '@/assets/images/lab_najran_central_1790236956545.jpg';
import najranChemist from '@/assets/images/najran_male_chemist_lab_1790161204485.jpg';
import najranFlyer from '@/assets/images/najran_flyer_labo.png';
import mobileLabCar from '@/assets/images/lab-car-najran.png';
import mobileFieldWork from '@/assets/images/6fdca855-cb45-4652-b741-9d63923fe79e.jpg';
import orgStructureImg from '@/assets/images/Position-structure.png';

// Authentic Lab & Equipment Photos
import labGallery1 from '@/assets/images/IMG-20250723-WA0001.jpg';
import labGallery2 from '@/assets/images/IMG-20250723-WA0002.jpg';
import labGallery3 from '@/assets/images/IMG-20250723-WA0003.jpg';
import labGallery4 from '@/assets/images/IMG-20250723-WA0004.jpg';
import labGallery5 from '@/assets/images/IMG-20250723-WA0005.jpg';
import labGallery6 from '@/assets/images/IMG-20250723-WA0006.jpg';

export default function NajranLabDetail() {
  const { lang, dir } = useLang();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Verified official coordinates for Najran Central Laboratory
  // Located at King Abdulaziz Road, Al-Manjam, behind Al-Dhafir Hospital, Najran
  const labCoordinates = {
    lat: 17.545673,
    lng: 44.2495585,
    dms: '17°32\'44.4"N 44°14\'58.4"E',
    decimal: '17.545673, 44.2495585',
    mapsUrl:
      'https://www.google.com/maps/place/%D8%A7%D9%84%D9%85%D8%AE%D8%AA%D8%A8%D8%B1+%D8%A7%D9%84%D8%A7%D9%82%D9%84%D9%8A%D9%85%D9%8A+%D9%84%D9%84%D9%85%D9%8A%D8%A7%D9%87+%D9%88%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D8%A8%D9%8A%D8%A6%D9%8A%D8%A9+%D9%84%D8%B4%D8%B1%D9%83%D8%A9+%D8%A7%D9%84%D9%85%D9%8A%D8%A7%D9%87+%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9%E2%80%AD/@17.5444497,44.1577507,12.75z/data=!4m10!1m2!2m1!1z2KfZhNmF2K7Yqtio2LEg2KfZhNin2YLZhNmK2YXZiiDZhNmE2K7Yr9mF2KfYqiDYp9mE2KjZitim2YrYqSDYqNmF2YbYt9mC2Kkg2YbYrNix2KfZhuKArQ!3m6!1s0x15fedda2e057c387:0xeebd4b566fedbd0e!8m2!3d17.545673!4d44.2495585!15sCljYp9mE2YXYrtiq2KjYsSDYp9mE2KfZgtmE2YrZhdmKINmE2YTYrtiv2YXYp9iqINin2YTYqNmK2KbZitipINio2YXZhti32YLYqSDZhtis2LHYp9mG4oCtkgERZ292ZXJubWVudF9vZmZpY2XgAQA!16s%2Fg%2F11tcbwcrkr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=17.545673,44.2495585',
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(labCoordinates.decimal);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const isRtl = dir === 'rtl';
  const Arrow = isRtl ? ChevronLeft : ChevronRight;

  const tText = {
    // Official Names
    officialTitle: {
      ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة نجران',
      en: 'Central Laboratory for Drinking Water and Environmental Services - Najran Region',
      fr: 'Laboratoire Central de l\'Eau Potable et des Services Environnementaux de la Région de Najran',
    }[lang],
    shortTitle: {
      ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بنجران',
      en: 'Najran Central Drinking Water & Environmental Laboratory',
      fr: 'Laboratoire Central de l\'Eau Potable et de l\'Environnement de Najran',
    }[lang],
    sectorTitle: {
      ar: 'شركة المياه الوطنية — الإدارة العامة للمختبرات والخدمات البيئية بالقطاع الجنوبي',
      en: 'National Water Company — Southern Sector Environmental & Water Laboratories',
      fr: 'Compagnie Nationale des Eaux — Laboratoires Environnementaux du Secteur Sud',
    }[lang],
    tagline: {
      ar: 'خبراء مختصون في أحدث التقنيات والمعايير الدولية في مجال تحليل مياه الشرب والخدمات البيئية',
      en: 'Specialized experts in the latest technologies and international standards in drinking water and environmental analysis',
      fr: 'Experts spécialisés dans les technologies de pointe et les normes internationales d\'analyse de l\'eau potable et de l\'environnement',
    }[lang],
    accreditationBadge: {
      ar: 'معتمد وفق المواصفة القياسية ISO/IEC 17025:2017',
      en: 'Accredited ISO/IEC 17025:2017',
      fr: 'Accrédité selon la norme ISO/IEC 17025:2017',
    }[lang],
    nwcBadge: {
      ar: 'شركة المياه الوطنية — الإدارة العامة للمختبرات بالقطاع الجنوبي',
      en: 'National Water Company — Southern Sector Laboratories Administration',
      fr: 'Compagnie Nationale des Eaux — Administration des Laboratoires du Secteur Sud',
    }[lang],
    heroDesc: {
      ar: 'مختبر إقليمي معتمد يقدم خدمات الفحص والتحليل المخبري الدقيق، الرقابة البيئية، وجمع العينات الميدانية لمصادر وشبكات مياه الشرب والخدمات البيئية بمنطقة نجران والمحافظات التابعة وفق أعلى المعايير القياسية.',
      en: 'A Central accredited laboratory providing high-precision testing, certified field sampling, and rigorous quality assurance for drinking water and environmental sources serving Najran and surrounding provinces.',
      fr: 'Un laboratoire Central accrédité offrant des analyses de haute précision, des prélèvements conformes et une assurance qualité certifiée pour les eaux potables et l\'environnement dans la région de Najran.',
    }[lang],

    // Quick Stats
    statIsoVal: 'ISO/IEC',
    statIsoSub: '17025:2017',
    statIsoDesc: { ar: 'اعتماد دولي للكفاءة الفنية', en: 'International Accreditation', fr: 'Accréditation Internationale' }[lang],
    statMonVal: '24 / 7',
    statMonSub: { ar: 'مراقبة مستمرة', en: 'Continuous Monitoring', fr: 'Surveillance Continue' }[lang],
    statMonDesc: { ar: 'فحص دوري وشبكات مياه الشرب', en: 'Drinking Water Networks', fr: 'Réseaux d\'Eau Potable' }[lang],
    statHubVal: { ar: 'منطقة نجران', en: 'Najran Hub', fr: 'Pôle Najran' }[lang],
    statHubSub: { ar: 'المختبر المركزي', en: 'Central Laboratory', fr: 'Laboratoire Central' }[lang],
    statHubDesc: { ar: 'يغطي مدينة نجران والمحافظات', en: 'Serving Najran & Provinces', fr: 'Couvre la ville et provinces' }[lang],
    statSacVal: 'SAC',
    statSacSub: { ar: 'المركز السعودي للاعتماد', en: 'Saudi Accreditation Center', fr: 'Centre Saoudien d\'Accréditation' }[lang],
    statSacDesc: { ar: 'مطابقة المعايير الوطنية القياسية', en: 'National Standards Compliance', fr: 'Conformité aux Normes' }[lang],

    // CTA buttons
    registerVisit: { ar: 'تسجيل زيارة للمختبر', en: 'Register as a Visitor', fr: 'Réserver une Visite' }[lang],
    takeSurvey: { ar: 'استبيان رضا العملاء', en: 'Customer Survey', fr: 'Enquête de Satisfaction' }[lang],
    sendEnquiry: { ar: 'إرسال استفسار', en: 'Send Enquiry', fr: 'Envoyer une Demande' }[lang],

    // About Section
    aboutHeading: { ar: 'عن المختبر المركزي لمياه الشرب والخدمات البيئية بنجران', en: 'About Najran Central Drinking Water & Environmental Laboratory', fr: 'À Propos du Laboratoire Central de l\'Eau Potable et de l\'Environnement de Najran' }[lang],
    aboutSub: {
      ar: 'منظومة رائدة في فحص مياه الشرب والرقابة البيئية وحماية الصحة العامة',
      en: 'A leading system in drinking water testing, environmental oversight, and public health protection',
      fr: 'Un système de référence en analyse de l\'eau potable, contrôle environnemental et protection de la santé publique',
    }[lang],
    aboutP1: {
      ar: 'يُعد المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة نجران التابع لشركة المياه الوطنية أحد الركائز الاستراتيجية لمنظومة مختبرات القطاع الجنوبي. يتميز المختبر بحصوله على الاعتماد الدولي ISO/IEC 17025:2017، مما يضمن دقة وموثوقية النتائج الصادرة عنه في كافة مراحل الفحص والتحليل.',
      en: 'The Central Laboratory for Drinking Water and Environmental Services in Najran Region operates under the National Water Company (NWC) as a cornerstone of the Southern Sector Laboratory System. Accredited under ISO/IEC 17025:2017, it guarantees world-class accuracy and reliability across all testing and analytical stages.',
      fr: 'Le Laboratoire Central de l\'Eau Potable et des Services Environnementaux de la Région de Najran constitue un pilier stratégique du réseau des laboratoires du Secteur Sud de la National Water Company (NWC). Certifié ISO/IEC 17025:2017, il assure une précision d\'analyse et une conformité rigoureuse aux standards mondiaux.',
    }[lang],
    aboutP2: {
      ar: 'يقوم المختبر بإجراء الفحوصات الفيزيائية والكيميائية والميكروبيولوجية والإشعاعية لعينات مياه الشرب، ومحطات التنقية، والآبار الجوفية، وشبكات التوزيع العامة، بالإضافة إلى الدعم الميداني السريع عبر وحدة المختبر المتنقل المجهزة بأحدث الأجهزة والتقنيات القياسية.',
      en: 'The laboratory conducts extensive physical, chemical, microbiological, and radiological analyses of drinking water samples, purification plants, underground wells, and municipal distribution networks, complemented by rapid field operations via its fully equipped Mobile Laboratory.',
      fr: 'Le laboratoire réalise des tests physiques, chimiques, microbiologiques et radiologiques sur les eaux potables, les usines de traitement, les forages et les réseaux de distribution, appuyé par une unité mobile pour les interventions de terrain rapides.',
    }[lang],

    // Facilities Section
    facilitiesHeading: { ar: 'المرافق والتجهيزات المخبرية', en: 'Facilities & Laboratory Environment', fr: 'Installations & Équipements de Pointe' }[lang],
    facilitiesSub: {
      ar: 'بيئة مخبرية متكاملة مجهزة بأحدث أدوات القياس والتحليل وأجهزة التحليل الطيفي والكروماتوغرافي',
      en: 'Comprehensive laboratory environments equipped with high-precision spectroscopy, chromatography, and microbiological incubators',
      fr: 'Environnements de laboratoire complets équipés d\'instruments de haute précision, spectrophotomètres et incubateurs microbiologiques',
    }[lang],
    buildingBadge: { ar: 'مبنى المختبر المركزي بنجران', en: 'Najran Central Laboratory Facility', fr: 'Bâtiment du Laboratoire Central de Najran' }[lang],
    chemistBadge: { ar: 'كوادر وطنية متخصصة في الكيمياء والبيولوجيا', en: 'Specialized Analytical Chemists & Technicians', fr: 'Chimistes et Spécialistes Analytiques' }[lang],

    // Accredited Services Section
    servicesHeading: { ar: 'مجالات الخدمات والتحاليل المعتمدة', en: 'Accredited Services & Testing Scopes', fr: 'Domaines d\'Analyses et Services Agréés' }[lang],
    servicesSub: {
      ar: 'المجالات المخبرية الثمانية المعتمدة رسمياً وفق وثيقة ومطوية المختبر',
      en: 'The eight officially accredited testing scopes confirmed by official laboratory documentation',
      fr: 'Les huit domaines d\'analyse accrédités confirmés par la documentation officielle',
    }[lang],
    viewFlyerBtn: { ar: 'عرض المطوية الرسمية للمختبر', en: 'View Official Laboratory Flyer', fr: 'Consulter le Dépliant Officiel' }[lang],

    // Mobile Lab Section
    mobileHeading: { ar: 'المختبر المتنقل والعمليات الميدانية', en: 'Mobile Laboratory & Field Operations', fr: 'Laboratoire Mobile & Opérations de Terrain' }[lang],
    mobileSub: {
      ar: 'وحدة ميدانية متنقلة لإجراء الفحوصات العاجلة وجمع العينات وفق اشتراطات SAC وسلسلة الحيازة المعتمدة',
      en: 'A mobile analytical unit for rapid on-site water quality assessment and field sampling following SAC protocols',
      fr: 'Une unité mobile d\'analyse rapide sur le terrain et de prélèvement conforme aux exigences SAC',
    }[lang],
    mobileDesc1: {
      ar: 'تم تجهيز وحدة المختبر المتنقل الرسمية (مركبة مجهزة بالكامل) لتوفير خدمات الكشف الميداني السريع عن جودة مياه الشرب في المواقع النائية، محطات المعالجة، وشبكات التوزيع عبر منطقة نجران.',
      en: 'The official Mobile Laboratory unit (fully customized Peugeot vehicle) is deployed for immediate on-site water testing across remote sites, treatment plants, and distribution networks in Najran.',
      fr: 'L\'unité de laboratoire mobile officielle (véhicule entièrement équipé) intervient pour des analyses immédiates de l\'eau potable sur les sites éloignés, stations et réseaux de la région de Najran.',
    }[lang],
    mobileDesc2: {
      ar: 'تحتوي الوحدة على أجهزة قياس العكارة، مقاييس الطيف الضوئي المحمولة، أجهزة قياس الأس الهيدروجيني والتوصيل الكهربائي، ومجموعات الفحص الميكروبيولوجي الفوري، تحت إشراف إدارة مختبرات القطاع الجنوبي ومعايير المركز السعودي للاعتماد (SAC).',
      en: 'The vehicle is equipped with portable spectrophotometers, turbidimeters, pH/conductivity meters, and rapid microbial detection kits under the Southern Sector Laboratories oversight and SAC accreditation standards.',
      fr: 'Le véhicule intègre des spectrophotomètres portables, turbidimètres, conductimètres et kits microbiologiques rapides sous la supervision de l\'administration du Secteur Sud et les normes SAC.',
    }[lang],

    // Organizational Structure Section
    orgHeading: { ar: 'الهيكل التنظيمي للمختبر', en: 'Organizational Structure', fr: 'Structure Organisationnelle' }[lang],
    orgSub: {
      ar: 'المخطط الإداري والتسلسل التنظيمي المعتمد لإدارة المختبر المركزي بنجران وأقسامه التخصصية',
      en: 'The official administrative organizational chart of Najran Central Laboratory and specialized departments',
      fr: 'L\'organigramme officiel et la hiérarchie organisationnelle du Laboratoire Central de Najran',
    }[lang],
    viewChartBtn: { ar: 'تكبير المخطط التنظيمي', en: 'Enlarge Organization Chart', fr: 'Agrandir l\'Organigramme' }[lang],

    // Sharurah Branch Link
    sharurahTitle: { ar: 'مختبر فرع شرورة ', en: 'Sharurah Branch', fr: 'Branche de Sharurah' }[lang],
    sharurahDesc: {
      ar: 'يقدم فرع شرورة خدمات فحص ومراقبة جودة مياه الشرب في محافظة شرورة والمناطق المجاورة بالتنسيق الكامل مع المختبر المركزي بنجران.',
      en: 'The Sharurah Branch provides water quality testing and monitoring for Sharurah governorate in coordination with Najran Central Lab.',
      fr: 'La branche de Sharurah assure le contrôle et l\'analyse de la qualité de l\'eau pour la province de Sharurah en coordination étroite avec le laboratoire Central.',
    }[lang],
    goToSharurah: { ar: 'الانتقال إلى صفحة فرع شرورة', en: 'Go to Sharurah Branch Page', fr: 'Accéder à la page de Sharurah' }[lang],

    // Location & Contact
    locationHeading: { ar: 'الموقع والعنوان المعتمد', en: 'Location & Official Address', fr: 'Localisation & Adresse Officielle' }[lang],
    officialAddress: {
      ar: 'NJPC9103، 9103 ال منجم 30، 3972، حي الخالدية، نجران 66261، المملكة العربية السعودية (رمز بلس: G6WX+7R)',
      en: 'NJPC9103, 9103 Al-Manjam 30, 3972, Al-Khalidiyah, Najran 66261, Saudi Arabia (Plus Code: G6WX+7R)',
      fr: 'NJPC9103, 9103 Al-Manjam 30, 3972, Al-Khalidiyah, Najran 66261, Arabie Saoudite (Plus Code : G6WX+7R)',
    }[lang],
    openMapBtn: { ar: 'فتح الموقع في Google Maps', en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps' }[lang],
    interactiveMapHeading: {
      ar: 'خريطة تفاعلية وموقع المختبر عبر Google Maps',
      en: 'Interactive Map & Laboratory Location on Google Maps',
      fr: 'Carte Interactive & Emplacement du Laboratoire sur Google Maps',
    }[lang],
    interactiveMapSub: {
      ar: 'موقع دقيق ومثبت بالإحداثيات الجغرافية المعتمدة لتسهيل وصول المراجعين واستلام العينات المخبرية',
      en: 'Precise geo-verified coordinates to facilitate visitor access and specimen deliveries',
      fr: 'Coordonnées géo-vérifiées pour faciliter l\'accès des visiteurs et des échantillons',
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
      ar: 'خريطة تفاعلية مباشرة: يمكنك التحريك، التكبير، والتصغير أو التبديل إلى العرض عبر الأقمار الصناعية',
      en: 'Live interactive map: pan, zoom, or switch to satellite imagery',
      fr: 'Carte interactive en direct : déplacez, zoomez ou basculez en vue satellite',
    }[lang],
    contactHeading: { ar: 'معلومات التواصل وساعات العمل', en: 'Official Contact & Working Hours', fr: 'Contact Officiel & Horaires de Travail' }[lang],
    hoursVal: { ar: 'الأحد – الخميس: 8:00 ص – 4:00 م', en: 'Sun – Thu: 8:00 AM – 4:00 PM', fr: 'Dim – Jeu : 8h00 – 16h00' }[lang],
    closedVal: { ar: 'الجمعة والسبت: عطلة أسبوعية', en: 'Fri & Sat: Weekend Closed', fr: 'Ven & Sam : Fermé' }[lang],
    directPhone: '+966568982662',
    nwcPhone: '8004411110',
    labEmail: 'moalsaed.c@new.com.sa',

    // Visitor Actions
    visitorHeading: { ar: 'بوابة خدمات الزوار والمراجعين', en: 'Visitor & Customer Services Portal', fr: 'Portail des Services aux Visiteurs' }[lang],
    visitorSub: {
      ar: 'خدمات إلكترونية ميسرة لحجز المواعيد، تقديم الاستفسارات ومتابعة مؤشرات الرضا',
      en: 'Digital services to schedule visits, submit technical inquiries, and share feedback',
      fr: 'Services numériques pour planifier vos visites, soumettre vos demandes et évaluer la satisfaction',
    }[lang],
  };

  // 8 Accredited services verified from the flyer
  const accreditedServices = [
    {
      num: '01',
      title: { ar: 'التحاليل الفيزيائية', en: 'Physical Analysis', fr: 'Analyses Physiques' }[lang],
      desc: {
        ar: 'قياس درجات العكارة، اللون، الرائحة، التوصيل الكهربائي، ومجموع الأملاح الذائبة (TDS).',
        en: 'Measurement of turbidity, color, odor, electrical conductivity, and total dissolved solids (TDS).',
        fr: 'Mesure de la turbidité, de la couleur, de l\'odeur, de la conductivité électrique et des solides dissous totaux (TDS).',
      }[lang],
      icon: Droplets,
    },
    {
      num: '02',
      title: { ar: 'التحاليل الكيميائية', en: 'Chemical Analysis', fr: 'Analyses Chimiques' }[lang],
      desc: {
        ar: 'فحص العناصر الكيميائية، الأيونات الذائبة، العسرة الكلية، والكلور الحر والمتبقي بدقة متناهية.',
        en: 'High-precision testing of chemical elements, dissolved ions, total hardness, and residual chlorine.',
        fr: 'Dosage de haute précision des éléments chimiques, ions dissous, dureté totale et chlore résiduel.',
      }[lang],
      icon: Activity,
    },
    {
      num: '03',
      title: { ar: 'التحاليل الميكروبيولوجية', en: 'Microbiological Analysis', fr: 'Analyses Microbiologiques' }[lang],
      desc: {
        ar: 'الكشف عن بكتيريا القولون، الإشريكية القولونية (E. coli)، والعدد الكلي للبكتيريا الحية لضمان سلامة مياه الشرب.',
        en: 'Detection of total coliforms, E. coli, and aerobic plate counts ensuring microbiological drinking water safety.',
        fr: 'Dépistage des coliformes totaux, d\'E. coli et numération bactérienne assurant la sécurité biologique.',
      }[lang],
      icon: Microscope,
    },
    {
      num: '04',
      title: { ar: 'التحاليل الإشعاعية', en: 'Radiological Analysis', fr: 'Analyses Radiologiques' }[lang],
      desc: {
        ar: 'الفحص الإشعاعي لمصادر المياه لرصد مستويات ألفا وبيتا وضمان خلو المياه من أي شوائب إشعاعية.',
        en: 'Radiological screening of water sources to monitor gross alpha and beta activities within national thresholds.',
        fr: 'Dépistage radiologique des sources d\'eau pour surveiller les activités alpha et bêta globales.',
      }[lang],
      icon: Sparkles,
    },
    {
      num: '05',
      title: { ar: 'تحليل متبقيات المبيدات', en: 'Pesticide Residue Analysis', fr: 'Analyse des Résidus de Pesticides' }[lang],
      desc: {
        ar: 'فحص أدق التراكيز لمتبقيات المبيدات الحشرية والمركبات الزراعية في مصادر المياه والآبار الجوفية.',
        en: 'Trace-level detection of pesticide residues and agricultural chemicals in water supplies and wells.',
        fr: 'Détection à l\'état de traces des résidus de pesticides et composés agricoles dans les puits et réseaux.',
      }[lang],
      icon: ShieldCheck,
    },
    {
      num: '06',
      title: { ar: 'تحليل الخواص العضوية', en: 'Organic Properties Analysis', fr: 'Analyse des Propriétés Organiques' }[lang],
      desc: {
        ar: 'قياس الكربون العضوي الكلي (TOC)، ونواتج التطهير الثانوية (THMs)، والمواد الهيدروكربونية.',
        en: 'Quantification of Total Organic Carbon (TOC), disinfection by-products (DBPs/THMs), and hydrocarbons.',
        fr: 'Quantification du Carbone Organique Total (COT), sous-produits de désinfection et hydrocarbures.',
      }[lang],
      icon: Layers,
    },
    {
      num: '07',
      title: { ar: 'الطرق القياسية في جمع العينات', en: 'Standard Sampling Methods', fr: 'Méthodes de Prélèvement Normalisées' }[lang],
      desc: {
        ar: 'تطبيق البروتوكولات المعتمدة وسلسلة الحيازة لجمع العينات الميدانية وحفظها ونقلها تحت شروط ضبط الجودة.',
        en: 'Standard operating protocols and strict chain-of-custody for field sample collection, preservation, and transport.',
        fr: 'Protocoles normalisés et chaîne de traçabilité stricte pour le prélèvement, la conservation et le transport.',
      }[lang],
      icon: FileText,
    },
    {
      num: '08',
      title: { ar: 'الاستشارات والحلول العلمية', en: 'Scientific Solutions & Consultation', fr: 'Solutions et Consultations Scientifiques' }[lang],
      desc: {
        ar: 'تقديم استشارات فنية متقدمة لمعالجة المياه، تفسير النتائج المخبرية، وحلول ضبط كفاءة محطات التنقية.',
        en: 'Expert technical consultation on water treatment, laboratory result interpretation, and purification plant optimization.',
        fr: 'Conseil technique spécialisé sur le traitement de l\'eau, l\'interprétation des résultats et l\'audit des stations.',
      }[lang],
      icon: Award,
    },
  ];

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: { ar: 'المختبرات', en: 'Laboratories', fr: 'Laboratoires' }[lang], to: '/laboratories' },
            { label: tText.shortTitle },
          ]}
        />

        {/* 01: Institutional Hero Section */}
        <section className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] via-[#152B47] to-[#0A1324] p-6 sm:p-10 lg:p-12 text-white shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left/Right Text Content */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/25">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {tText.accreditationBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/25">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  {tText.nwcBadge}
                </span>
              </div>

              {/* Main Official Title */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  {tText.sectorTitle}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {tText.officialTitle}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-emerald-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {tText.tagline}
                </p>
              </div>

              {/* Institutional description */}
              <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {tText.heroDesc}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{tText.registerVisit}</span>
                </Link>
                <Link
                  to="/survey"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{tText.takeSurvey}</span>
                </Link>
                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{tText.sendEnquiry}</span>
                </Link>
              </div>
            </div>

            {/* Logo Emblem Container */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 shadow-2xl ring-1 ring-white/30 backdrop-blur-md max-w-xs w-full text-center">
                <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center p-2">
                  <img
                    src={najranLogo}
                    alt={tText.officialTitle}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                    {tText.shortTitle}
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                    ISO/IEC 17025:2017
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02: Key Accreditation & Verification Strip */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {tText.statIsoVal} <span className="text-blue-600 dark:text-blue-400">{tText.statIsoSub}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tText.statIsoDesc}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {tText.statMonVal}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tText.statMonSub}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {tText.statHubVal}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tText.statHubDesc}</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                {tText.statSacVal}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tText.statSacSub}</div>
            </div>
          </div>
        </section>

        {/* 03: About Najran Central Laboratory */}
        <section className="mt-10 bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <Building2 className="w-3.5 h-3.5" />
                <span>{tText.aboutHeading}</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                {tText.aboutSub}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {tText.aboutP1}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {tText.aboutP2}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {lang === 'ar' ? 'اعتماد متكامل ISO/IEC 17025:2017 للكفاءة الفنية للمختبرات' : 'Fully accredited under ISO/IEC 17025:2017 for technical competence'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {lang === 'ar' ? 'سلسلة حيازة مشددة لجمع العينات وحفظها ونقلها المبرد' : 'Strict chain of custody for field sampling, preservation, and cold transport'}
                  </div>
                </div>
              </div>
            </div>

            {/* Building Photo */}
            <div className="lg:col-span-5">
              <div
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                onClick={() => {
                  setSelectedImage(najranBuilding);
                  setSelectedImageTitle(tText.buildingBadge);
                }}
              >
                <img
                  src={najranBuilding}
                  alt={tText.buildingBadge}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-xs font-semibold bg-blue-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                      <Eye className="w-3 h-3" />
                      {tText.buildingBadge}
                    </span>
                    <p className="text-xs text-slate-200">
                      {lang === 'ar' ? 'المقر الإداري والمخبري الرئيسي - نجران' : 'Main Laboratory Facility - Najran'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04: Facilities & Laboratory Environment Gallery */}
        <section className="mt-10">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-1.5">
              <Microscope className="w-3.5 h-3.5" />
              <span>{tText.facilitiesHeading}</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
              {tText.facilitiesSub}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Chemist Work Photo */}
            <div
              className="md:col-span-2 group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 cursor-pointer h-72 sm:h-80"
              onClick={() => {
                setSelectedImage(najranChemist);
                setSelectedImageTitle(tText.chemistBadge);
              }}
            >
              <img
                src={najranChemist}
                alt={tText.chemistBadge}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {tText.chemistBadge}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-md">
                    {lang === 'ar'
                      ? 'إجراء التحاليل الفيزيائية والكيميائية الدقيقة لعينات مياه الشرب باستخدام مقاييس الطيف الضوئي وأجهزة الكروماتوغرافيا'
                      : 'Conducting high-precision physical and chemical tests on drinking water samples using spectrophotometers'}
                  </p>
                </div>
              </div>
            </div>

            {/* Flyer Preview Card */}
            <div
              className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 to-blue-950 p-6 flex flex-col justify-between cursor-pointer"
              onClick={() => {
                setSelectedImage(najranFlyer);
                setSelectedImageTitle(tText.viewFlyerBtn);
              }}
            >
              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold ring-1 ring-white/20">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  {lang === 'ar' ? 'الوثيقة والمطوية الرسمية' : 'Official Laboratory Document'}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {lang === 'ar'
                    ? 'مطوية الخدمات والتحاليل المعتمدة للمختبر المركزي للخدمات البيئية بنجران'
                    : 'Najran Central Environmental Laboratory Official Services & Accreditations Flyer'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'تتضمن كافة اشتراطات الفحص ونطاق التحاليل المعتمدة تحت إشراف شركة المياه الوطنية والمركز السعودي للاعتماد.'
                    : 'Includes all accredited scopes and analytical requirements under NWC and Saudi Accreditation Center.'}
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{tText.viewFlyerBtn}</span>
                </button>
              </div>

              {/* Decorative background image blur */}
              <img
                src={najranFlyer}
                alt="Flyer Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Authentic Real Lab Photos Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { img: labGallery1, label: lang === 'ar' ? 'تجهيزات التحليل الطيفي' : 'Spectrophotometry Unit' },
              { img: labGallery2, label: lang === 'ar' ? 'محطة فحص العكارة والأس الهيدروجيني' : 'Turbidity & pH Station' },
              { img: labGallery3, label: lang === 'ar' ? 'وحدة الفحص الميكروبيولوجي' : 'Microbiology Section' },
              { img: labGallery4, label: lang === 'ar' ? 'حواضن ومستلزمات الزراعة البكتيرية' : 'Bacterial Incubators' },
              { img: labGallery5, label: lang === 'ar' ? 'غرفة الكواشف والأوساط المعقمة' : 'Reagents & Sterile Media' },
              { img: labGallery6, label: lang === 'ar' ? 'استلام العينات وسلسلة الحيازة' : 'Sample Reception Area' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-square cursor-pointer shadow-xs"
                onClick={() => {
                  setSelectedImage(item.img);
                  setSelectedImageTitle(item.label);
                }}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <div className="text-white text-[11px] font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 05: Accredited Testing Scopes (8 Scopes from Flyer) */}
        <section className="mt-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{tText.servicesHeading}</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
              {tText.servicesSub}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accreditedServices.map((svc, index) => {
              const IconComp = svc.icon;
              return (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">
                        {svc.num}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ISO/IEC 17025:2017</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 06: Mobile Laboratory & Field Operations */}
        <section className="mt-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 lg:p-10 text-white shadow-lg ring-1 ring-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/25">
                <Truck className="w-3.5 h-3.5" />
                <span>{tText.mobileHeading}</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                {tText.mobileSub}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {tText.mobileDesc1}
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {tText.mobileDesc2}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium ring-1 ring-white/20">
                  {lang === 'ar' ? 'فحص عكارة فوري' : 'Instant Turbidity Testing'}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium ring-1 ring-white/20">
                  {lang === 'ar' ? 'فحص الكلور المتبقي' : 'Residual Chlorine Testing'}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium ring-1 ring-white/20">
                  {lang === 'ar' ? 'حفظ بارد وسلسلة حيازة SAC' : 'SAC Compliant Cold Custody'}
                </span>
              </div>
            </div>

            {/* Vehicle & Fieldwork Images */}
            <div className="lg:col-span-5 space-y-4">
              {/* Mobile Lab Car */}
              <div
                className="group relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 cursor-pointer"
                onClick={() => {
                  setSelectedImage(mobileLabCar);
                  setSelectedImageTitle(lang === 'ar' ? 'المختبر المتنقل - نجران' : 'Mobile Laboratory Vehicle - Najran');
                }}
              >
                <img
                  src={mobileLabCar}
                  alt="Mobile Laboratory Car"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-xs font-bold bg-blue-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                      <Truck className="w-3 h-3" />
                      {lang === 'ar' ? 'مركبة المختبر المتنقل الرسمية' : 'Official Mobile Lab Vehicle'}
                    </span>
                    <p className="text-xs text-slate-300">
                      {lang === 'ar' ? 'الإدارة العامة للمختبرات - القطاع الجنوبي' : 'Southern Sector Laboratories Administration'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inside Field Operations */}
              <div
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-black/40 cursor-pointer"
                onClick={() => {
                  setSelectedImage(mobileFieldWork);
                  setSelectedImageTitle(lang === 'ar' ? 'التحليل الميداني داخل وحدة المختبر المتنقل' : 'Field Operations Inside Mobile Unit');
                }}
              >
                <img
                  src={mobileFieldWork}
                  alt="Field Operations"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5">
                  <div className="text-white flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-slate-200">
                      {lang === 'ar' ? 'فحوصات مياه الشرب الميدانية العاجلة' : 'On-site Rapid Water Testing'}
                    </span>
                    <Eye className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07: Organizational Structure */}
        <section className="mt-12 bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{tText.orgHeading}</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                {tText.orgSub}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(orgStructureImg);
                setSelectedImageTitle(tText.orgHeading);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{tText.viewChartBtn}</span>
            </button>
          </div>

          <div
            className="group relative rounded-xl overflow-x-auto scrollbar-thin border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 cursor-pointer"
            onClick={() => {
              setSelectedImage(orgStructureImg);
              setSelectedImageTitle(tText.orgHeading);
            }}
          >
            <div className="min-w-[600px] flex justify-center">
              <img
                src={orgStructureImg}
                alt="Organizational Structure"
                className="w-full max-h-96 object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-200"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow-md flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{tText.viewChartBtn}</span>
              </span>
            </div>
          </div>
        </section>

        {/* 08: Sharurah Branch Link */}
        <section className="mt-8">
          <Link
            to="/laboratories/najran/sharurah"
            className="group block p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/10 via-slate-100 to-blue-900/10 dark:from-blue-950/40 dark:via-slate-800/40 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/50 hover:border-blue-500 transition-all duration-200 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">
                    {lang === 'ar' ? 'الشبكة المخبرية لمنطقة نجران' : 'Najran Laboratory Network'}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {tText.sharurahTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                    {tText.sharurahDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>{tText.goToSharurah}</span>
                <Arrow className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </section>

        {/* 09: Location, Interactive Map & Official Contact */}
        <section className="mt-12 bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{tText.locationHeading}</span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                {tText.interactiveMapHeading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl">
                {tText.interactiveMapSub}
              </p>
            </div>

            {/* GPS Coordinates Badge & One-click Copy */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span dir="ltr">{labCoordinates.dms}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors"
                title={tText.copyCoordsBtn}
              >
                {copiedCoords ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">{tText.copiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{tText.copyCoordsBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Google Map Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-900">
            <iframe
              title="Najran Central Laboratory Interactive Google Map"
              src={`https://maps.google.com/maps?q=${labCoordinates.lat},${labCoordinates.lng}&hl=${lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en'}&z=16&output=embed`}
              className="w-full h-80 sm:h-96 md:h-[420px] border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Top map info overlay */}
            <div className="absolute top-3 start-3 max-w-sm pointer-events-auto">
              <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{tText.shortTitle}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {tText.officialAddress}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
            * {tText.mapInteractiveNotice}
          </p>

          {/* Action Cards Grid below map */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coordinates & Actions Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{tText.verifiedCoordsLabel}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {tText.officialAddress}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {lang === 'ar' ? 'خط العرض (Latitude):' : 'Latitude:'}
                    </span>
                    <span dir="ltr" className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      17.545673° N
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {lang === 'ar' ? 'خط الطول (Longitude):' : 'Longitude:'}
                    </span>
                    <span dir="ltr" className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      44.2495585° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct navigation buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={labCoordinates.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{tText.openMapBtn}</span>
                </a>
                <a
                  href={labCoordinates.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>{tText.getDirectionsBtn}</span>
                </a>
              </div>
            </div>

            {/* Official Contact & Hours Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{tText.contactHeading}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {lang === 'ar'
                    ? 'يمكنكم التواصل المباشر مع إدارة المختبر أو خدمة عملاء شركة المياه الوطنية'
                    : 'Direct contact with laboratory management and NWC customer service'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      {lang === 'ar' ? 'الهاتف المباشر:' : 'Direct Phone:'}
                    </span>
                    <a
                      href={`tel:${tText.directPhone}`}
                      dir="ltr"
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {tText.directPhone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      {lang === 'ar' ? 'خدمة العملاء (شركة المياه):' : 'NWC Care:'}
                    </span>
                    <a
                      href={`tel:${tText.nwcPhone}`}
                      dir="ltr"
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      {tText.nwcPhone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      {lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                    </span>
                    <a
                      href={`mailto:${tText.labEmail}`}
                      dir="ltr"
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {tText.labEmail}
                    </a>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900/70 text-xs border border-slate-200 dark:border-slate-700/80">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {lang === 'ar' ? 'أوقات العمل:' : 'Hours:'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tText.hoursVal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                {tText.closedVal}
              </div>
            </div>
          </div>
        </section>

        {/* 10: Visitor Services Hub */}
        <section className="mt-12 bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
              {tText.visitorHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5">
              {tText.visitorSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/register"
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 hover:border-blue-500 transition-all duration-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-sm">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {tText.registerVisit}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'تسجيل موعد مسبق والحصول على تصريح وبطاقة QR لدخول المختبر واستلام العينات'
                    : 'Schedule an appointment and generate an official QR badge for lab entry'}
                </p>
              </div>
              <div className="mt-4 pt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>{lang === 'ar' ? 'بدء التسجيل' : 'Start Registration'}</span>
                <Arrow className="w-4 h-4" />
              </div>
            </Link>

            <Link
              to="/survey"
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-emerald-100 dark:border-slate-700 hover:border-emerald-500 transition-all duration-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {tText.takeSurvey}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'شاركنا تقييمك لسرعة ودقة التحاليل وجودة الخدمة المقدمة في المختبر'
                    : 'Share your feedback on analysis speed, accuracy, and customer experience'}
                </p>
              </div>
              <div className="mt-4 pt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>{lang === 'ar' ? 'تعبئة الاستبيان' : 'Complete Survey'}</span>
                <Arrow className="w-4 h-4" />
              </div>
            </Link>

            <Link
              to="/enquiry"
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all duration-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center mb-4 shadow-sm">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {tText.sendEnquiry}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'إرسال استفسار فني أو طلب فحص مخصص لعينات الآبار وشبكات المياه'
                    : 'Submit technical inquiries or testing requests for wells and water networks'}
                </p>
              </div>
              <div className="mt-4 pt-3 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</span>
                <Arrow className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Lightbox / Image Enlarge Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-slate-950/80 border-b border-white/10 text-white">
              <span className="text-sm font-bold">{selectedImageTitle}</span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 sm:p-4 max-h-[calc(90vh-70px)] overflow-auto flex items-center justify-center">
              <img
                src={selectedImage}
                alt={selectedImageTitle}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
