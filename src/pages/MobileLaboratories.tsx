import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Droplets,
  FlaskConical,
  Award,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  MessageSquare,
  Building2,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ExternalLink,
  Layers,
  MapPin,
  Compass,
  FileCheck,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';

/* -------------------------------------------------------------------------- */
/* Types & Interfaces                                                         */
/* -------------------------------------------------------------------------- */

type VisualCategory = 'all' | 'exterior' | 'rear' | 'interior' | 'sampling' | 'equipment';

interface GalleryItem {
  id: string;
  category: 'exterior' | 'rear' | 'interior' | 'sampling' | 'equipment';
  labId: 'asir' | 'baha' | 'jazan' | 'najran';
  title: { ar: string; en: string; fr: string };
  desc: { ar: string; en: string; fr: string };
  image: string;
  isReal: boolean;
}

interface MobileLabData {
  id: 'asir' | 'baha' | 'jazan' | 'najran';
  name: { ar: string; en: string; fr: string };
  region: { ar: string; en: string; fr: string };
  environment: { ar: string; en: string; fr: string };
  heroImage: string;
  isRealPhoto: boolean;
  vehicleLabel: {
    clusterAr: string;
    clusterEn: string;
    labAr: string;
    labEn: string;
    badgeAr: string;
    badgeEn: string;
  };
  coverage: { ar: string; en: string; fr: string };
  keyMission: { ar: string; en: string; fr: string };
  specs: { ar: string; en: string; fr: string }[];
  equipment: { ar: string; en: string; fr: string }[];
  labPath: string;
}

/* -------------------------------------------------------------------------- */
/* Regional Mobile Laboratories Data                                          */
/* -------------------------------------------------------------------------- */

const MOBILE_LABS: MobileLabData[] = [
  {
    id: 'asir',
    name: {
      ar: 'المختبر المتنقل لمختبر عسير المركزي',
      en: 'Asir Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central d\'Asir',
    },
    region: { ar: 'منطقة عسير', en: 'Asir Region', fr: 'Région d\'Asir' },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر عسير المركزي',
      labEn: 'Asir Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'المرتفعات الصخرية الجبلية الداكنة، الجروف الوعرة، السدود المائية وممرات الأودية الجبلية شديدة الانحدار في جنوب غرب المملكة.',
      en: 'Rugged dark rocky mountain ridges, steep granite cliffs, dam reservoirs, and winding mountain valley passes of southwestern Saudi Arabia.',
      fr: 'Massifs rocheux sombres, falaises escarpées, barrages hydrographiques et défilés montagneux du sud-ouest saoudien.',
    },
    heroImage: siteMedia.mobileLaboratories.asir,
    isRealPhoto: false,
    coverage: {
      ar: 'أبها، خميس مشيط، أحد رفيدة، محايل عسير، النماص، تنومة، رجال ألمع، بلقرن، تثليث، بيشة، سراة عبيدة، ظهران الجنوب',
      en: 'Abha, Khamis Mushait, Ahad Rafidah, Muhayil, Al-Namas, Tanomah, Rijal Almaa, Balqarn, Tathlith, Bisha, Sarat Abidah, Dhahran Al-Janub',
      fr: 'Abha, Khamis Mushait, Ahad Rafidah, Muhayil, Al-Namas, Tanomah, Rijal Almaa, Balqarn, Tathlith, Bicha, Sarat Abidah',
    },
    keyMission: {
      ar: 'الفحص الميداني الفوري لمصادر السدود، محطات الضخ الجبلية، مراقبة شبكات القرى النائية والتدخل السريع خلال فترات الطوارئ والمواسم السياحية.',
      en: 'Immediate potability audits at dam reservoirs, mountain pumping stations, rural networks, and swift response during seasonal surges.',
      fr: 'Contrôle immédiat des barrages, stations de pompage en altitude, réseaux isolés et surveillance renforcée durant les saisons d\'affluence.',
    },
    specs: [
      { ar: 'هيكل فان بيجو بوكسر / فيات مخصص للتضاريس الجبلية الصخرية الوعرة', en: 'Heavy-duty laboratory chassis engineered for rugged mountain gradients', fr: 'Châssis renforcé pour routes et pistes de montagne' },
      { ar: 'محطة طاقة هجينة مستقلة مع بطاريات ليثيوم 24 ساعة ومولد صامت', en: 'Hybrid silent power station with 24h continuous lithium-ion storage', fr: 'Station d\'énergie hybride insonorisée avec autonomie lithium 24h' },
      { ar: 'نظام تكييف حراري دقيق لحماية كواشف الفحص والأجهزة الحساسة', en: 'Precision dual climate control safeguarding analytical sensors', fr: 'Double climatisation régulée protégeant les instruments analytiques' },
      { ar: 'منظومة اتصال مشفرة بالأقمار الصناعية لنقل تقارير الفحص فورياً', en: 'Encrypted satellite telemetry uploading real-time certified reports', fr: 'Télétransmission satellite sécurisée des résultats d\'analyses' },
    ],
    equipment: [
      { ar: 'مقياس الطيف الضوئي المحمول متعدد المؤشرات (Spectrophotometer)', en: 'Multi-parameter portable field spectrophotometer', fr: 'Spectrophotomètre de terrain multi-paramètres' },
      { ar: 'جهاز رقمي معتمد لقياس العكارة (Turbidimeter NTU)', en: 'High-precision certified nephelometric turbidimeter', fr: 'Turbidimètre néphélométrique certifié de haute précision' },
      { ar: 'حقيبة قياس الرقم الهيدروجيني (pH)، التوصيلية، والكلور المتبقي', en: 'Integrated pH, conductivity (EC), and free chlorine electrochemical kit', fr: 'Kit combiné pH, conductivité (EC) et chlore résiduel libre' },
      { ar: 'حاضنة ميكروبيولوجية معقمة مدمجة للفحص الجرثومي السريع', en: 'Compact sterile onboard incubator for fast bacteriological screening', fr: 'Incubateur microbiologique stérile pour dépistage bactérien rapide' },
    ],
    labPath: '/laboratories/asir',
  },
  {
    id: 'baha',
    name: {
      ar: 'المختبر المتنقل لمختبر الباحة المركزي',
      en: 'Al-Baha Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central d\'Al-Baha',
    },
    region: { ar: 'منطقة الباحة', en: 'Al-Baha Region', fr: 'Région d\'Al-Baha' },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر الباحة المركزي',
      labEn: 'Al-Baha Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'جبال السراة الصخرية، جروف تهامة الوعرة، الوديان والمنحدرات التضاريسية الطبيعية وحقول الآبار الجوفية للقطاع الجنوبي الغربي.',
      en: 'Rocky Sarat mountain escarpments, Tihama descent corridors, arid rocky valleys, and deep rural wellfields.',
      fr: 'Escarpements rocheux de la Sarate, descentes vers la Tihama, vallées pierreuses et forages hydrogéologiques.',
    },
    heroImage: siteMedia.mobileLaboratories.baha,
    isRealPhoto: false,
    coverage: {
      ar: 'مدينة الباحة، بلجرشي، المندق، المخواة، قلوة، العقيق، الحجرة، غامد الزناد، بني حسن',
      en: 'Al-Baha City, Baljurashi, Al-Mandaq, Al-Mikhwah, Qilwah, Al-Aqiq, Al-Hajrah, Ghamid Al-Zinad, Bani Hassan',
      fr: 'Ville d\'Al-Baha, Baljurachi, Al-Mandaq, Al-Mikhwah, Qilwah, Al-Aqiq, Al-Hajrah, Ghamid Al-Zinad, Bani Hassan',
    },
    keyMission: {
      ar: 'مراقبة جودة مياه الآبار الجوفية والسدود بمحافظات السراة وتهامة، والتحقق الدوري من كفاءة محطات التنقية والخزانات التجميعية.',
      en: 'Groundwater wellhead potability audits, surface dam surveillance, and treatment plant verification across Sarat and Tihama.',
      fr: 'Contrôle de la potabilité des puits, barrages et suivi régulier des stations d\'épuration entre la Sarate et la Tihama.',
    },
    specs: [
      { ar: 'تجهيزات داخلية مقاومة للمواد الكيميائية من الفولاذ المقاوم للصدأ 316L', en: 'Full chemical-resistant 316L stainless steel counters and casework', fr: 'Plans de travail et mobilier en inox 316L résistant aux acides' },
      { ar: 'وحدة غسيل وتعقيم ميدانية متكاملة مع خزان مياه مقطرة فائق النقاوة', en: 'Integrated sterile wash station with high-purity deionized water tank', fr: 'Poste de lavage stérile et réserve d\'eau déminéralisée haute pureté' },
      { ar: 'ثلاجة عينات مدمجة مع نظام توثيق رقمي لدرجات الحرارة (+4°C)', en: 'Digital temperature-logged sample preservation cooler (+4°C standard)', fr: 'Réfrigérateur d\'échantillons avec traçabilité thermique en continu (+4°C)' },
      { ar: 'منصة استقرار هيدروليكية لضمان اتزان الأجهزة الدقيقة أثناء الفحص الميداني', en: 'Hydraulic leveling pads ensuring benchtop measurement stability', fr: 'Vérins de stabilisation hydraulique assurant la planéité des mesures' },
    ],
    equipment: [
      { ar: 'جهاز التحليل الضوئي الميداني المباشر للأيونات والعناصر', en: 'Field-rugged direct-reading photometer for chemical ions', fr: 'Photomètre de terrain à lecture directe pour ions chimiques' },
      { ar: 'أقطاب قياس الأكسجين الذائب وجهد الأكسدة والاختزال (DO & ORP)', en: 'Dissolved oxygen (DO) and oxidation-reduction potential probes', fr: 'Sondes d\'oxygène dissous (OD) et de potentiel redox' },
      { ar: 'نظام الترشيح الغشائي المعقم المحمول للكشف عن البكتيريا القولونية', en: 'Sterile portable vacuum filtration manifold for fecal coliform testing', fr: 'Rampe de filtration sous vide stérile pour coliformes fécaux' },
      { ar: 'محلل سريع للمواد العضوية والمؤشرات الفيزيوكيميائية', en: 'Rapid organic index and water quality physicochemical meter', fr: 'Analyseur rapide d\'indicateurs organiques et physico-chimiques' },
    ],
    labPath: '/laboratories/al-baha',
  },
  {
    id: 'jazan',
    name: {
      ar: 'المختبر المتنقل لمختبر جازان المركزي',
      en: 'Jazan Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central de Jazan',
    },
    region: { ar: 'منطقة جازان', en: 'Jazan Region', fr: 'Région de Jazan' },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر جازان المركزي',
      labEn: 'Jazan Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'السهول الساحلية الجنوبية، الأراضي شبه القاحلة، التضاريس البركانية الصخرية الداكنة، وممرات خطوط نقل مياه التحلية والشبكات.',
      en: 'Southern coastal plains, semi-arid mineral terrain, distant volcanic rocky ridges, and coastal desalination pipeline corridors.',
      fr: 'Plaines côtières méridionales, terrains semi-arides, reliefs volcaniques sombres et conduites d\'eau dessalée.',
    },
    heroImage: siteMedia.mobileLaboratories.jazan,
    isRealPhoto: false,
    coverage: {
      ar: 'مدينة جازان، صبيا، أبو عريش، صامطة، بيش، الدرب، ضمد، الريث، فرسان، فيفاء، العارضة، الدائر',
      en: 'Jazan City, Sabya, Abu Arish, Samtah, Baish, Al-Darb, Damad, Al-Reeth, Farasan Islands, Fayfa, Al-Aridah, Al-Dair',
      fr: 'Ville de Jazan, Sabya, Abou Arich, Samtah, Baish, Al-Darb, Damad, Al-Reeth, Îles Farasan, Fayfa, Al-Aridah',
    },
    keyMission: {
      ar: 'مراقبة خطوط النقل الساحلية، جودة مياه محطات التحلية، فحص التوصيلية والملوحة بمصادر المياه، والاستجابة الميدانية السريعة لجزر فرسان والمحافظات الجبلية.',
      en: 'Continuous audit of coastal transmission lines, desalination potability, salinity (TDS), and field support for Farasan and inland areas.',
      fr: 'Surveillance des conduites côtières, dessalement, salinité/conductivité et intervention rapide vers les îles Farasan et les zones amont.',
    },
    specs: [
      { ar: 'طلاء خارجي مقاوم للتآكل المالح والرطوبة الساحلية العالية (Marine Grade)', en: 'Marine-grade anti-corrosive exterior coating and thermal insulation', fr: 'Revêtement extérieur anti-corrosion marine et isolation étanche' },
      { ar: 'نظام تكييف هواء فائق القوة للعمل بكفاءة حتى 52 درجة مئوية', en: 'Heavy-duty ambient cooling operating reliably up to 52°C heat', fr: 'Climatisation renforcée opérant sans interruption jusqu\'à 52°C' },
      { ar: 'تغذية كهربائية مزدوجة مع مقبس مباشر بالمحطات ومحول طاقة نقي', en: 'Dual shore-power hookup and pure sine inverter backup system', fr: 'Alimentation double : raccordement direct sur site et onduleur' },
      { ar: 'مستودع آمن ومحكم للمحاليل الحساسة لدرجات الحرارة المرتفعة', en: 'Thermally insulated lockable storage for temperature-sensitive reagents', fr: 'Compartiments sécurisés et isolés pour réactifs thermo-sensibles' },
    ],
    equipment: [
      { ar: 'جهاز قياس الملوحة والتوصيلية فائق الدقة لمياه التحلية والآبار', en: 'High-precision salinity, TDS, and electrical conductivity analyzer', fr: 'Analyseur haute précision de salinité, TDS et conductivité' },
      { ar: 'محلل الكلور الكهروكيميائي الفوري (Free & Total Chlorine)', en: 'Real-time electrochemical free and total residual chlorine meter', fr: 'Analyseur électrochimique instantané du chlore résiduel total et libre' },
      { ar: 'أقطاب قياس الأيونات الانتقائية (فلوريد، نترات، وكلوريد)', en: 'Ion-selective electrode (ISE) probe kit for fluoride, nitrate, chloride', fr: 'Électrodes spécifiques pour fluorures, nitrates et chlorures' },
      { ar: 'غرفة قراءة ميكروبيولوجية مزودة بالأشعة فوق البنفسجية (UV Cabinet)', en: 'Rapid UV fluorometric cabinet for confirmed E. coli verification', fr: 'Chambre de lecture fluorométrique UV pour confirmation rapide d\'E. coli' },
    ],
    labPath: '/laboratories/jazan',
  },
  {
    id: 'najran',
    name: {
      ar: 'المختبر المتنقل لمختبر نجران المركزي',
      en: 'Najran Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central de Najran',
    },
    region: { ar: 'منطقة نجران', en: 'Najran Region', fr: 'Région de Najran' },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر نجران المركزي',
      labEn: 'Najran Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'سهول ووديان نجران، البيئات الصحراوية المفتوحة، وحقول آبار المياه الجوفية العميقة على امتداد القطاع الجنوبي.',
      en: 'Najran valleys, expansive arid plains, and deep sandstone aquifer wellfield corridors across the southern frontier.',
      fr: 'Oasis et vallées de Najran, plaines désertiques et forages hydrogéologiques profonds du sud saoudien.',
    },
    heroImage: siteMedia.mobileLaboratories.najran,
    isRealPhoto: true,
    coverage: {
      ar: 'مدينة نجران، حبونا، شرورة، بدر الجنوب، يدمة، خباش، ثار',
      en: 'Najran City, Habouna, Sharurah, Badr Al-Janub, Yadmah, Khubash, Thar',
      fr: 'Ville de Najran, Habouna, Charurah, Badr Al-Janoub, Yadmah, Khubash, Thar',
    },
    keyMission: {
      ar: 'الفحص الميداني لحقول آبار المياه العميقة، محطات المعالجة والتنقية، مراقبة خزانات التوزيع الاستراتيجية، ومسح جودة المياه بالشبكات الحدودية والصحراوية.',
      en: 'On-site verification of deep aquifer wellheads, treatment facilities, strategic storage reservoirs, and expansive desert transmission corridors.',
      fr: 'Vérification sur site des forages profonds, réservoirs stratégiques, usines de potabilisation et réseaux d\'alimentation désertiques.',
    },
    specs: [
      { ar: 'أسطول معتمد رسمياً تابع لإدارة مختبرات القطاع الجنوبي (شركة المياه الوطنية)', en: 'Official accredited operational fleet unit under Southern Sector Laboratories', fr: 'Véhicules officiels opérationnels de la direction des laboratoires du Secteur Sud' },
      { ar: 'مركبات بيجو بوكسر / فيات مجهزة بأعلى المواصفات القياسية للمختبرات الميدانية', en: 'Custom-engineered mobile analytical platform with ISO 17025 configuration', fr: 'Véhicules aménagés selon les normes rigoureuses de laboratoire de terrain' },
      { ar: 'نظام حفظ وتبريد متكامل للعينات مع كواشف التحاليل السريعة', en: 'Dual cold-chain sample preservation and rapid reagents storage chamber', fr: 'Système complet de chaîne du froid et conservation des réactifs d\'urgence' },
      { ar: 'طاقم فني متخصص معتمد من أخصائيي الكيمياء والأحياء الدقيقة', en: 'Staffed by certified senior chemists and microbiologists for field audits', fr: 'Équipage de chimistes et microbiologistes certifiés pour audits de terrain' },
    ],
    equipment: [
      { ar: 'أجهزة القياس الطيفي المحمولة لمعايرة العناصر الكيميائية', en: 'Field-rugged spectrophotometers for chemical trace calibration', fr: 'Spectrophotomètres portables pour analyse chimique des traces' },
      { ar: 'أجهزة قياس العكارة والرقم الهيدروجيني والأملاح الذائبة الكلية', en: 'Certified digital turbidimeters, precision pH, and TDS meters', fr: 'Turbidimètres certifiés, pH-mètres et conductimètres TDS numériques' },
      { ar: 'معدات أخذ العينات الميدانية المعقمة وسلسلة الحيازة الرقمية', en: 'Sterile sampling apparatus with digital chain of custody logging', fr: 'Matériel de prélèvement stérile avec traçabilité de chaîne de garde' },
      { ar: 'حقائب التحليل الميكروبيولوجي الفوري للطوارئ والمواسم', en: 'Emergency field microbiological kits with rapid enzymatic confirmation', fr: 'Valises d\'analyses microbiologiques d\'urgence à lecture enzymatique rapide' },
    ],
    labPath: '/laboratories/najran',
  },
];

/* -------------------------------------------------------------------------- */
/* Gallery Dataset (5 Visual Categories per Lab)                              */
/* -------------------------------------------------------------------------- */

const GALLERY_ITEMS: GalleryItem[] = [
  /* NAJRAN - 100% REAL PHOTOGRAPHS */
  {
    id: 'najran-exterior-1',
    category: 'exterior',
    labId: 'najran',
    title: {
      ar: 'المركبة التشغيلية لمختبر نجران المركزي (منظر خارجي كامل)',
      en: 'Najran Central Laboratory Mobile Unit (Exterior View)',
      fr: 'Unité Mobile du Laboratoire Central de Najran (Vue Extérieure)',
    },
    desc: {
      ar: 'صورة حقيقية لمركبة فيات دوكاتو المجهزة رسمياً والمزودة بالهوية المؤسسية لمختبرات مياه الشرب بالقطاع الجنوبي.',
      en: 'Real photograph of the official Fiat Ducato mobile unit with Southern Sector water laboratories livery.',
      fr: 'Photographie réelle du véhicule officiel Fiat Ducato arborant la livrée des laboratoires du Secteur Sud.',
    },
    image: siteMedia.mobileLaboratories.najran,
    isReal: true,
  },
  {
    id: 'najran-rear-official',
    category: 'rear',
    labId: 'najran',
    title: {
      ar: 'الهيكل الخلفي والأبواب لمركبة نجران الرسمية',
      en: 'Official Rear View & Livery of Najran Mobile Unit',
      fr: 'Vue Arrière Officielle & Livrée de l\'Unité Mobile de Najran',
    },
    desc: {
      ar: 'صورة مطابقة للواجهة الخلفية للمركبة توضح شعار شركة المياه الوطنية وبيانات إدارة مختبرات القطاع الجنوبي ومختبر نجران المركزي.',
      en: 'Official rear view showing National Water Company emblem, Southern Cluster Laboratories Management, and Najran Central Lab livery.',
      fr: 'Vue arrière officielle montrant l\'emblème NWC, la direction des laboratoires du Secteur Sud et le marquage de Najran.',
    },
    image: siteMedia.mobileLaboratories.najranRear,
    isReal: true,
  },
  {
    id: 'najran-rear-1',
    category: 'rear',
    labId: 'najran',
    title: {
      ar: 'الأبواب الخلفية المفتوحة ومنصة العمل الميداني (مختبر نجران)',
      en: 'Rear Double Doors Open & Field Working Bay (Najran)',
      fr: 'Portes Arrière Ouvertes & Baie de Travail de Terrain (Najran)',
    },
    desc: {
      ar: 'صورة حقيقية للأبواب الخلفية المزدوجة تظهر منظومة التثبيت وخزانات العينات والمساحة الداخلية المخصصة للتحاليل.',
      en: 'Real photograph showing the rear dual-entry doors, sample retention bays, and analytical workspace.',
      fr: 'Photographie réelle montrant les doubles portes arrière et l\'agencement intérieur du laboratoire.',
    },
    image: siteMedia.mobileLaboratories.najranRealPhotos.doors,
    isReal: true,
  },
  {
    id: 'najran-interior-1',
    category: 'interior',
    labId: 'najran',
    title: {
      ar: 'المختبر الداخلي ومقاعد العمل من الفولاذ المقاوم للصدأ (نجران)',
      en: 'Interior Laboratory Bench & Stainless Steel Workstations (Najran)',
      fr: 'Laboratoire Intérieur & Paillasses en Acier Inoxydable (Najran)',
    },
    desc: {
      ar: 'صورة حقيقية لداخل الوحدة المتنقلة توضح أسطح الفولاذ المقاوم للصدأ، أحواض الغسيل المعقمة، ومواقع الأجهزة التحليلية.',
      en: 'Real photograph of the mobile lab interior showing stainless steel countertops, washbasin, and test stations.',
      fr: 'Photographie réelle de l\'intérieur du laboratoire mobile : paillasses inox, évier stérile et postes d\'analyse.',
    },
    image: siteMedia.mobileLaboratories.najranRealPhotos.bench,
    isReal: true,
  },
  {
    id: 'najran-sampling-1',
    category: 'sampling',
    labId: 'najran',
    title: {
      ar: 'أخصائي المختبر أثناء فحص العينات الميدانية (نجران)',
      en: 'Certified Chemist Conducting On-Site Field Testing (Najran)',
      fr: 'Chimiste Certifié Réalisant les Analyses In Situ (Najran)',
    },
    desc: {
      ar: 'صورة حقيقية للكوادر الوطنية المتخصصة أثناء إجراء قياسات الجودة المباشرة بجوار الوحدة المتنقلة.',
      en: 'Real photograph of certified national laboratory personnel executing immediate water quality tests.',
      fr: 'Photographie réelle des spécialistes nationaux réalisant les mesures directes de qualité d\'eau.',
    },
    image: siteMedia.mobileLaboratories.najranRealPhotos.tech,
    isReal: true,
  },
  {
    id: 'najran-sampling-2',
    category: 'exterior',
    labId: 'najran',
    title: {
      ar: 'الهيكل الجانبي والهوية المؤسسية المعتمدة للمركبة (مختبر نجران)',
      en: 'Official Side Livery & Vehicle Markings (Najran)',
      fr: 'Marquage Latéral Officiel & Identité Institutionnelle (Najran)',
    },
    desc: {
      ar: 'صورة حقيقية لمركبة نجران توضح كتابات الهوية الرسمية: إدارة مختبرات القطاع الجنوبي (Southern Cluster laboratories management) ومختبر نجران المركزي (Najran Central Laboratory).',
      en: 'Real photograph showing official inscriptions: Southern Cluster laboratories management and Najran Central Laboratory.',
      fr: 'Photographie réelle montrant les inscriptions officielles : Southern Cluster laboratories management et Najran Central Laboratory.',
    },
    image: siteMedia.mobileLaboratories.najranRealPhotos.side,
    isReal: true,
  },
  {
    id: 'najran-equipment-1',
    category: 'equipment',
    labId: 'najran',
    title: {
      ar: 'حقائب وأجهزة الفحص الميداني المحمولة (مختبر نجران)',
      en: 'Portable Field Inspection Kits & Electrochemistry Sensors (Najran)',
      fr: 'Mallettes de Contrôle Portable & Capteurs Électrochimiques (Najran)',
    },
    desc: {
      ar: 'صورة حقيقية لمعدات الفحص الميداني السريع وكواشف القياس المحمولة المعتمدة داخل مركبة نجران.',
      en: 'Real photograph of calibrated field inspection kits, turbidimeters, and electrochemical meters onboard.',
      fr: 'Photographie réelle des kits d\'inspection portables étalonnés et appareils électrochimiques embarqués.',
    },
    image: siteMedia.mobileLaboratories.najranRealPhotos.kits,
    isReal: true,
  },

  /* ASIR - ILLUSTRATIVE VISUALIZATIONS */
  {
    id: 'asir-exterior-1',
    category: 'exterior',
    labId: 'asir',
    title: {
      ar: 'الوحدة المتنقلة لمختبر عسير في المرتفعات الجبلية الصخرية',
      en: 'Asir Mobile Laboratory Unit in Rugged Mountain Pass',
      fr: 'Unité Mobile d\'Asir en Reliefs Montagneux Rocheux',
    },
    desc: {
      ar: 'تصور توضيحي للمركبة في بيئة جبال عسير الصخرية الداكنة والجروف الوعرة بجوار السدود ومحطات الضخ.',
      en: 'Illustrative visualization of the Asir unit in southwest Saudi rocky mountain terrain near reservoir dams.',
      fr: 'Visualisation illustrative de l\'unité d\'Asir dans les massifs rocheux et abords de retenues collinaires.',
    },
    image: siteMedia.mobileLaboratories.asir,
    isReal: false,
  },
  {
    id: 'asir-interior-1',
    category: 'interior',
    labId: 'asir',
    title: {
      ar: 'تجهيزات المختبر الداخلي للوحدة الجبلية (عسير)',
      en: 'Interior Analytical Station for Asir Mobile Unit',
      fr: 'Poste Analytique Intérieur de l\'Unité d\'Asir',
    },
    desc: {
      ar: 'تصور توضيحي لمنطقة الفحص المخبري الداخلي المجهزة بأسطح الفولاذ 316L ومحطات التحليل الطيفي.',
      en: 'Illustrative visualization of internal stainless steel workstations and spectrophotometric instruments.',
      fr: 'Visualisation illustrative des paillasses inox et appareils de spectrophotométrie embarqués.',
    },
    image: siteMedia.facilities.asir,
    isReal: false,
  },
  {
    id: 'asir-sampling-1',
    category: 'sampling',
    labId: 'asir',
    title: {
      ar: 'سحب العينات الميدانية من السدود والشبكات (عسير)',
      en: 'Field Sampling from Mountain Dams & Networks (Asir)',
      fr: 'Échantillonnage de Terrain sur Barrages & Réseaux (Asir)',
    },
    desc: {
      ar: 'سحب عينات المياه الجبلية وفق معيار ISO 5667 بحاويات معقمة وتوثيق رقمي لسلسلة الحيازة.',
      en: 'Standardized field sampling under ISO 5667 with sterile collection and tamper-proof chain of custody.',
      fr: 'Prélèvement d\'eau conforme à l\'ISO 5667 avec flaconnage stérile et chaîne de garde numérique.',
    },
    image: siteMedia.fieldAction,
    isReal: false,
  },
  {
    id: 'asir-equipment-1',
    category: 'equipment',
    labId: 'asir',
    title: {
      ar: 'أجهزة قياس الطيف الضوئي والعكارة المعتمدة (عسير)',
      en: 'Calibrated Spectrophotometers & Turbidimeters (Asir)',
      fr: 'Spectrophotomètres & Turbidimètres Calibrés (Asir)',
    },
    desc: {
      ar: 'أجهزة مخبرية رقمية لمعايرة العناصر الكيميائية والمؤشرات الفيزيائية لمياه الشرب.',
      en: 'Digital analytical meters calibrating chemical traces and physical indicators for potability.',
      fr: 'Appareils numériques mesurant les traces chimiques et indicateurs physiques de potabilité.',
    },
    image: siteMedia.waterTestingPan,
    isReal: false,
  },

  /* AL-BAHA - ILLUSTRATIVE VISUALIZATIONS */
  {
    id: 'baha-exterior-1',
    category: 'exterior',
    labId: 'baha',
    title: {
      ar: 'الوحدة المتنقلة لمختبر الباحة في مرتفعات السراة وتهامة',
      en: 'Al-Baha Mobile Unit along Sarat & Tihama Escarpments',
      fr: 'Unité Mobile d\'Al-Baha sur les Escarpements de la Sarate',
    },
    desc: {
      ar: 'تصور توضيحي للمركبة في جبال الباحة الصخرية الوعرة على مسار مراقبة حقول الآبار والخزانات.',
      en: 'Illustrative visualization of the Al-Baha unit along rugged Sarat passes auditing rural wellfields.',
      fr: 'Visualisation illustrative du véhicule d\'Al-Baha sur les routes rocheuses de la Sarate et Tihama.',
    },
    image: siteMedia.mobileLaboratories.baha,
    isReal: false,
  },
  {
    id: 'baha-interior-1',
    category: 'interior',
    labId: 'baha',
    title: {
      ar: 'البيئة المخبرية الداخلية المعقمة (الباحة)',
      en: 'Sterile Interior Working Environment (Al-Baha)',
      fr: 'Environnement de Travail Intérieur Stérile (Al-Baha)',
    },
    desc: {
      ar: 'تصور توضيحي للبيئة الداخلية المزودة بنظام تنقية الهواء والتكييف المعياري لحماية العينات.',
      en: 'Illustrative visualization of internal climate-controlled air purification and sample preservation.',
      fr: 'Visualisation illustrative de l\'espace intérieur régulé protégeant les échantillons d\'eau.',
    },
    image: siteMedia.facilities.baha,
    isReal: false,
  },

  /* JAZAN - ILLUSTRATIVE VISUALIZATIONS */
  {
    id: 'jazan-exterior-1',
    category: 'exterior',
    labId: 'jazan',
    title: {
      ar: 'الوحدة المتنقلة لمختبر جازان بالسهول الساحلية والشبكات',
      en: 'Jazan Mobile Laboratory Unit in Coastal Transmission Plain',
      fr: 'Unité Mobile de Jazan en Plaine Côtière et Réseaux',
    },
    desc: {
      ar: 'تصور توضيحي لمركبة جازان في الأراضي الساحلية شبه القاحلة بجوار مسارات خطوط مياه التحلية.',
      en: 'Illustrative visualization of the Jazan unit in southern coastal plain auditing desalinated lines.',
      fr: 'Visualisation illustrative de l\'unité de Jazan dans les plaines côtières et conduites d\'eau dessalée.',
    },
    image: siteMedia.mobileLaboratories.jazan,
    isReal: false,
  },
  {
    id: 'jazan-interior-1',
    category: 'interior',
    labId: 'jazan',
    title: {
      ar: 'محطة قياس التوصيلية والملوحة بمختبر جازان المتنقل',
      en: 'Conductivity & Salinity Bench Station (Jazan)',
      fr: 'Poste de Conductivité & Salinité Mobile (Jazan)',
    },
    desc: {
      ar: 'أجهزة قياس الأيونات والتوصيلية الكهربائية فائقة الحساسية للتحقق من جودة مياه التحلية والآبار.',
      en: 'Ultra-sensitive wide-range bench conductivity and ion meters monitoring desalination potability.',
      fr: 'Appareils de conductivité et sondes spécifiques pour le contrôle de l\'eau dessalée.',
    },
    image: siteMedia.facilities.jazan,
    isReal: false,
  },
  {
    id: 'jazan-sampling-1',
    category: 'sampling',
    labId: 'jazan',
    title: {
      ar: 'المسح الميداني لشبكات التوزيع والخطوط الساحلية (جازان)',
      en: 'Field Survey of Coastal Distribution Networks (Jazan)',
      fr: 'Contrôle In Situ des Réseaux Côtiers de Distribution (Jazan)',
    },
    desc: {
      ar: 'فرق الفحص الميداني أثناء سحب العينات الدورية من شبكات جازان ومحافظات الساحل والجزر.',
      en: 'Field survey team collecting scheduled audit samples across Jazan coastal and island grids.',
      fr: 'Équipe de terrain réalisant les prélèvements programmés sur les réseaux de Jazan.',
    },
    image: siteMedia.news.fieldSurvey,
    isReal: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Operational Workflow Steps                                                 */
/* -------------------------------------------------------------------------- */

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: Compass,
    title: {
      ar: 'تخطيط المهمة وتحديد المسار',
      en: 'Mission Planning & Dispatch',
      fr: 'Planification de la Mission',
    },
    desc: {
      ar: 'جدولة البلاغ أو المسح الدوري عبر نظام إدارة المختبرات وتحديد النقاط الجغرافية وخطة التحليل.',
      en: 'Assignment scheduling through LIMS, geospatial route mapping, and analytical parameter definition.',
      fr: 'Planification via le système LIMS, cartographie de l\'itinéraire et paramétrage des analyses requises.',
    },
  },
  {
    step: '02',
    icon: Truck,
    title: {
      ar: 'الانتقال الميداني والتمركز السريع',
      en: 'Rapid Field Deployment',
      fr: 'Déploiement Rapide sur le Terrain',
    },
    desc: {
      ar: 'انتقال الوحدة المتنقلة بكامل تجهيزاتها وطاقمها المتخصص إلى موقع المصدر أو المحطة أو الشبكة.',
      en: 'Immediate mobilization of the self-contained mobile lab and certified technical crew to the water site.',
      fr: 'Mobilisation immédiate de l\'unité autonome et de son équipage certifié sur le site d\'intervention.',
    },
  },
  {
    step: '03',
    icon: FlaskConical,
    title: {
      ar: 'سحب العينات وإجراء الفحوصات الفورية',
      en: 'Sampling & On-Site Testing',
      fr: 'Échantillonnage & Analyses Immédiates',
    },
    desc: {
      ar: 'أخذ العينات المعقمة طبقاً لـ ISO 5667 وإجراء القياسات الفيزيوكيميائية والميكروبيولوجية على الفور.',
      en: 'Sterile ISO 5667 sample collection and instant execution of physicochemical and bacterial tests.',
      fr: 'Prélèvement stérile conforme ISO 5667 et exécution instantanée des examens physico-chimiques et bactériologiques.',
    },
  },
  {
    step: '04',
    icon: FileCheck,
    title: {
      ar: 'إصدار التقارير المعتمدة وضبط الجودة',
      en: 'Certified Reporting & QA Sync',
      fr: 'Rapport Certifié & Synchronisation',
    },
    desc: {
      ar: 'توثيق النتائج رقمياً وإصدار مؤشر المطابقة الفوري وربطه بقاعدة بيانات المختبرات المركزية.',
      en: 'Digital result certification, immediate conformity verification, and telemetry sync with central labs.',
      fr: 'Certification numérique immédiate de conformité et synchronisation directe avec la base centrale.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Mobile Services Catalog                                                    */
/* -------------------------------------------------------------------------- */

const SERVICES_CATALOG = [
  {
    icon: Activity,
    title: { ar: 'التحاليل السريعة لمياه الشرب', en: 'Rapid Drinking-Water Potability Testing', fr: 'Analyses Rapides de Potabilité' },
    desc: {
      ar: 'إجراء الفحوصات الفورية لمصادر المياه والشبكات في دقائق معدودة وإصدار مؤشرات المطابقة للمواصفات السعودية SASO.',
      en: 'Instantaneous testing of water sources and municipal grids with rapid compliance indicators under SASO standards.',
      fr: 'Analyses immédiates des sources et réseaux en quelques minutes avec conformité aux normes saoudiennes SASO.',
    },
  },
  {
    icon: Droplets,
    title: { ar: 'سحب العينات الميدانية المعقمة', en: 'Certified Sterile Field Water Sampling', fr: 'Prélèvement d\'Échantillons Stériles' },
    desc: {
      ar: 'سحب العينات طبقاً لمعايير ISO 5667 الدولية مع الحفظ بالتبريد الآمن وتوثيق سلسلة الحيازة الرقمية المشفرة.',
      en: 'Standardized sample collection under ISO 5667 with certified cold-chain preservation and digital custody tracking.',
      fr: 'Prélèvements conformes à l\'ISO 5667 avec maintien rigoureux de la chaîne du froid et traçabilité numérique.',
    },
  },
  {
    icon: FlaskConical,
    title: { ar: 'القياسات الفيزيائية والكيميائية الفورية', en: 'In-Situ Physicochemical Analysis', fr: 'Mesures Physico-Chimiques In Situ' },
    desc: {
      ar: 'تحديد مستويات الرقم الهيدروجيني (pH)، العكارة (NTU)، الأملاح الذائبة (TDS)، التوصيلية الكهربائية، والكلور المتبقي.',
      en: 'Direct field quantification of pH, turbidity (NTU), Total Dissolved Solids, conductivity, and residual chlorine.',
      fr: 'Mesures en direct du pH, turbidité (NTU), solides dissous (TDS), conductivité et chlore résiduel.',
    },
  },
  {
    icon: ShieldCheck,
    title: { ar: 'الكشف الميكروبيولوجي السريع', en: 'Rapid Field Microbiological Screening', fr: 'Dépistage Microbiologique Rapide' },
    desc: {
      ar: 'الكشف الميداني الأولي عن البكتيريا القولونية والإشريكية القولونية باستخدام تقنيات الحضانة المدمجة والأشعة فوق البنفسجية.',
      en: 'Onboard screening for total coliforms and E. coli utilizing portable incubators and UV fluorescence confirmation.',
      fr: 'Recherche in situ des coliformes totaux et d\'E. coli par incubateur embarqué et lecture sous rayonnement UV.',
    },
  },
  {
    icon: Award,
    title: { ar: 'مراقبة السدود والخزانات التجميعية', en: 'Surface Dams & Strategic Storage Auditing', fr: 'Surveillance des Barrages et Réservoirs' },
    desc: {
      ar: 'إجراء المسوحات الدورية لخزانات التوزيع الاستراتيجية ومحطات الضخ وخطوط النقل للتأكد من سلامة المياه المعالجة.',
      en: 'Routine audits of strategic storage reservoirs, pumping stations, and bulk transmission lines.',
      fr: 'Audits programmés des réservoirs de distribution, stations de pompage et conduites maîtresses.',
    },
  },
  {
    icon: Building2,
    title: { ar: 'دعم الطوارئ والمواسم السياحية', en: 'Emergency & Peak Demand Field Support', fr: 'Support d\'Urgence et Périodes de Pointe' },
    desc: {
      ar: 'التدخل السريع أثناء حالات الأمطار ومواسم السيول والذروة السياحية بمرتفعات القطاع الجنوبي لدعم أمن الإمدادات.',
      en: 'Rapid deployment during rainfall seasons, emergency incidents, and tourist peaks across the southern highlands.',
      fr: 'Intervention d\'urgence lors des épisodes pluvieux et pics touristiques sur les hauteurs du Secteur Sud.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Component Implementation                                                   */
/* -------------------------------------------------------------------------- */

const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

        {/* ============================================================
            3. GALERIE MULTI-CATÉGORIES & LIGHTBOX
        ============================================================= */}
        <section id="mobile-gallery" className="mb-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'معرض التوثيق الميداني والمخبري' : lang === 'fr' ? 'Galerie de Documentation' : 'Field Documentation Gallery'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'معرض صور الوحدات المتنقلة والبيئة التشغيلية'
                  : lang === 'fr'
                    ? 'Galerie des Unités Mobiles et de l\'Environnement de Terrain'
                    : 'Mobile Units & Field Environment Gallery'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'استعرض تفاصيل الهيكل الخارجي، الأبواب المفتوحة، التجهيزات الداخلية ومعدات الفحص الميداني مع تمييز دقيق بين الصور الحقيقية والتصورات التوضيحية.'
                  : lang === 'fr'
                    ? 'Explorez l\'extérieur, les portes ouvertes, l\'intérieur du laboratoire et les équipements avec distinction claire des photos réelles.'
                    : 'Browse exterior views, open-bay access, interior laboratory, and analytical kits with clear real vs illustrative labeling.'}
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              {[
                { key: 'all', label: { ar: 'الكل', en: 'All', fr: 'Tous' } },
                { key: 'exterior', label: { ar: 'الهيكل الخارجي', en: 'Exterior', fr: 'Extérieur' } },
                { key: 'rear', label: { ar: 'الأبواب الخلفية', en: 'Rear Doors', fr: 'Portes Arrière' } },
                { key: 'interior', label: { ar: 'المختبر الداخلي', en: 'Interior Lab', fr: 'Intérieur' } },
                { key: 'sampling', label: { ar: 'سحب العينات', en: 'Sampling', fr: 'Prélèvement' } },
                { key: 'equipment', label: { ar: 'الأجهزة المخبرية', en: 'Equipment', fr: 'Équipements' } },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setGalleryFilter(tab.key as VisualCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    galleryFilter === tab.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label[lang] || tab.label.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Authenticity Key / Distinction Bar */}
          <div className="mb-6 p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{lang === 'ar' ? 'تصنيف موثوقية الصور والمعروضات:' : lang === 'fr' ? 'Distinction d\'authenticité des visuels :' : 'Visual Authenticity Distinction:'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'صور حقيقية للوحدة المتنقلة لمختبر نجران المركزي'
                    : lang === 'fr'
                      ? 'Photographies réelles de l’unité mobile du laboratoire central de Najran'
                      : 'Real photographs of the Najran Mobile Laboratory Unit'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-2xs">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'تصور توضيحي'
                    : lang === 'fr'
                      ? 'Visualisation illustrative'
                      : 'Illustrative visualization'}
                </span>
              </span>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title[lang] || item.title.en}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Authenticity Badge - Real Najran vs Illustrative */}
                  <div className="absolute top-3 start-3 end-3 flex items-center justify-between gap-2">
                    {item.isReal ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/95 text-white shadow-md border border-emerald-400/40 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                        <span className="truncate max-w-[210px]">
                          {lang === 'ar'
                            ? 'صور حقيقية للوحدة المتنقلة لمختبر نجران المركزي'
                            : lang === 'fr'
                              ? 'Photographies réelles de l’unité mobile du laboratoire central de Najran'
                              : 'Real photographs of the Najran Mobile Laboratory Unit'}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'ar'
                            ? 'تصور توضيحي'
                            : lang === 'fr'
                              ? 'Visualisation illustrative'
                              : 'Illustrative visualization'}
                        </span>
                      </span>
                    )}

                    <span
                      className="w-7 h-7 rounded-lg bg-black/60 group-hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-xs"
                      title={lang === 'ar' ? 'انقر لتكبير الصورة وفحص التفاصيل' : lang === 'fr' ? 'Cliquer pour zoomer et examiner les détails' : 'Click to zoom and inspect details'}
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 start-3 end-3 text-white">
                    <p className="text-[10px] font-medium text-cyan-300 uppercase tracking-wider mb-0.5">
                      {item.category.toUpperCase()}
                    </p>
                    <h3 className="font-bold text-sm leading-snug line-clamp-2">
                      {item.title[lang] || item.title.en}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.labId === 'najran'
                        ? (lang === 'ar' ? 'مختبر نجران المركزي' : lang === 'fr' ? 'Laboratoire Central de Najran' : 'Najran Central Laboratory')
                        : item.labId === 'asir'
                          ? (lang === 'ar' ? 'مختبر عسير المركزي' : lang === 'fr' ? 'Laboratoire Central d\'Asir' : 'Asir Central Laboratory')
                          : item.labId === 'baha'
                            ? (lang === 'ar' ? 'مختبر الباحة المركزي' : lang === 'fr' ? 'Laboratoire Central d\'Al-Baha' : 'Al-Baha Central Laboratory')
                            : (lang === 'ar' ? 'مختبر جازان المركزي' : lang === 'fr' ? 'Laboratoire Central de Jazan' : 'Jazan Central Laboratory')}
                    </span>
                    {item.isReal ? (
                      <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'صورة حقيقية' : lang === 'fr' ? 'Photo réelle' : 'Real Photo'}</span>
                      </span>
                    ) : (
                      <span className="shrink-0 text-amber-600 dark:text-amber-400 font-medium text-[10px] flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'تصور توضيحي' : lang === 'fr' ? 'Illustratif' : 'Illustrative'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {item.desc[lang] || item.desc.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            4. WORKFLOW DE TERRAIN EN 4 ÉTAPES DU SITE DE RÉFÉRENCE
        ============================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'آلية العمل والتشغيل الميداني' : lang === 'fr' ? 'Méthodologie Opérationnelle' : 'Field Operational Workflow'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'مراحل التدخل والفحص الميداني للوحدات المتنقلة'
                : lang === 'fr'
                  ? 'Étapes d\'Intervention et de Contrôle sur le Terrain'
                  : 'Field Deployment & Quality Assurance Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'مسار معياري موثق يضمن سرعة الاستجابة الميدانية ومطابقة النتائج لأعلى اشتراطات الجودة'
                : lang === 'fr'
                  ? 'Un processus standardisé garantissant réactivité et conformité absolue aux normes de qualité'
                  : 'A rigorous four-stage procedure ensuring rapid mobilization and reliable compliance verification'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-200 dark:text-slate-800 font-mono">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {step.title[lang] || step.title.en}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {step.desc[lang] || step.desc.en}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>{lang === 'ar' ? `المرحلة ${step.step}` : `Stage ${step.step}`}</span>
                    <Arrow className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            5. SERVICES MOBILES DU SITE DE RÉFÉRENCE
        ============================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'القدرات والخدمات الميدانية' : lang === 'fr' ? 'Services de Terrain' : 'Mobile Analytical Services'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'خدمات التحليل الميداني والمراقبة الفورية لمياه الشرب'
                : lang === 'fr'
                  ? 'Services d\'Analyse Immédiate & Surveillance de Terrain'
                  : 'On-Site Water Analysis & Field Surveillance Services'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'حزمة متكاملة من الفحوصات الفيزيوكيميائية والجرثومية المعايرة مخبرياً'
                : lang === 'fr'
                  ? 'Gamme complète d\'examens physico-chimiques et bactériologiques étalonnés'
                  : 'A comprehensive suite of certified in-situ water testing and quality auditing'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES_CATALOG.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
                      {svc.title[lang] || svc.title.en}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {svc.desc[lang] || svc.desc.en}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'فحص فوري' : 'Real-time test'}</span>
                    </span>
                    <span>ISO/IEC 17025</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            6. CALL TO ACTION INSTITUTIONNEL
        ============================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold mb-3">
              {lang === 'ar'
                ? 'هل تحتاج إلى فحص ميداني فوري أو سحب عينات معتمدة؟'
                : lang === 'fr'
                  ? 'Besoin d\'un contrôle immédiat ou de prélèvements certifiés ?'
                  : 'Need Immediate On-Site Inspection or Certified Sampling?'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6">
              {lang === 'ar'
                ? 'يمكن للجهات الحكومية والخاصة والمحطات المائية حجز زيارة المختبر المتنقل أو الاستعلام عن خدمات الفحص الميداني وجودة مياه الشرب بالقطاع الجنوبي.'
                : lang === 'fr'
                  ? 'Les entités publiques, privées et exploitants de réseaux peuvent réserver l\'intervention d\'une unité mobile ou adresser une demande d\'audit.'
                  : 'Government bodies, private operators, and water plants can schedule a mobile unit field audit or submit an immediate technical enquiry.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-blue-900" />
                <span>{lang === 'ar' ? 'طلب فحص ميداني / حجز زيارة' : 'Book Mobile Field Audit'}</span>
              </Link>
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all border border-blue-400/30 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('cs.enquiry')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            7. LIGHTBOX MODAL WITH FULL NAVIGATION & AUTHENTICITY PILL
        ============================================================= */}
        {activeLightboxIndex !== null && filteredGallery[activeLightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 text-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base truncate">
                      {filteredGallery[activeLightboxIndex].title[lang] || filteredGallery[activeLightboxIndex].title.en}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-cyan-400 font-mono">
                        {activeLightboxIndex + 1} / {filteredGallery.length}
                      </span>
                      <span className="text-slate-600">•</span>
                      {filteredGallery[activeLightboxIndex].isReal ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            {lang === 'ar'
                              ? 'صور حقيقية للوحدة المتنقلة لمختبر نجران المركزي'
                              : lang === 'fr'
                                ? 'Photographies réelles de l’unité mobile du laboratoire central de Najran'
                                : 'Real photographs of the Najran Mobile Laboratory Unit'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-200 border border-amber-400/40">
                          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            {lang === 'ar'
                              ? 'تصور توضيحي'
                              : lang === 'fr'
                                ? 'Visualisation illustrative'
                                : 'Illustrative visualization'}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Interactive Zoom Controls */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                    <button
  type="button"
  onClick={zoomOut}
  disabled={zoomLevel <= 1}
  className={`p-1.5 rounded-lg transition-colors ${
    zoomLevel <= 1
      ? 'text-white/30 cursor-not-allowed'
      : 'text-white hover:bg-white/15 cursor-pointer'
  }`}
  title={lang === 'ar' ? 'تصغير (-)' : 'Zoom out (-)'}
  aria-label="Zoom out"
>
  <ZoomOut className="w-4 h-4" />
</button>
                    
                    <button
                      type="button"
                      onClick={() => (zoomLevel === 1 ? setZoomLevel(2.25) : resetZoom())}
                      className="px-2 py-1 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-colors cursor-pointer rounded-md hover:bg-white/10"
                      title={lang === 'ar' ? 'إعادة ضبط التكبير (0)' : 'Reset zoom (0)'}
                    >
                      {Math.round(zoomLevel * 100)}%
                    </button>

                    <button
                      type="button"
                      onClick={zoomIn}
                      disabled={zoomLevel >= 3.5}
                      className={`p-1.5 rounded-lg transition-colors ${
                        zoomLevel >= 3.5
                          ? 'text-white/30 cursor-not-allowed'
                          : 'text-white hover:bg-white/15 cursor-pointer'
                      }`}
                      title={lang === 'ar' ? 'تكبير (+)' : 'Zoom in (+)'}
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {zoomLevel > 1 && (
                      <button
                        type="button"
                        onClick={resetZoom}
                        className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                        title={lang === 'ar' ? 'إعادة التعيين' : 'Reset view'}
                        aria-label="Reset view"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={closeLightbox}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
                    title={lang === 'ar' ? 'إغلاق (Esc)' : 'Close (Esc)'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Viewport with Click-to-Zoom & Pan Support */}
              <div
                className="relative flex-1 bg-black flex items-center justify-center min-h-[340px] max-h-[68vh] p-2 overflow-hidden select-none"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Click-to-zoom interactive wrapper */}
                <div
                  onClick={toggleClickZoom}
                  className={`relative max-h-full max-w-full flex items-center justify-center transition-transform ${
                    zoomLevel > 1
                      ? isDragging
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                      : 'cursor-zoom-in'
                  }`}
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    transition: isDragging ? 'none' : 'transform 200ms ease-out',
                  }}
                  title={
                    zoomLevel > 1
                      ? lang === 'ar'
                        ? 'انقر للتصغير، أو اسحب للتنقل'
                        : 'Click to zoom out, or drag to pan'
                      : lang === 'ar'
                        ? 'انقر على الصورة للتكبير وفحص التفاصيل'
                        : 'Click on image to zoom in and inspect details'
                  }
                >
                  <img
                    src={filteredGallery[activeLightboxIndex].image}
                    alt={filteredGallery[activeLightboxIndex].title[lang] || filteredGallery[activeLightboxIndex].title.en}
                    className="max-h-[64vh] max-w-full object-contain mx-auto rounded-lg shadow-2xl pointer-events-none"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                </div>

                {/* Left Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dir === 'rtl') nextLightboxImage();
                    else prevLightboxImage();
                  }}
                  className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm z-20 shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                </button>

                {/* Right Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dir === 'rtl') prevLightboxImage();
                    else nextLightboxImage();
                  }}
                  className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm z-20 shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                </button>

                {/* Floating Click-to-Zoom Instruction Indicator */}
                <div className="absolute bottom-3 start-1/2 -translate-x-1/2 pointer-events-none z-10">
                  <div className="px-3.5 py-1 rounded-full bg-black/75 border border-white/20 text-[11px] text-white/95 backdrop-blur-md shadow-xl flex items-center gap-1.5 font-medium">
                    {zoomLevel === 1 ? (
                      <>
                        <ZoomIn className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>
                          {lang === 'ar'
                            ? 'انقر للتكبير والتنقل في تفاصيل الوحدة'
                            : lang === 'fr'
                              ? 'Cliquez pour zoomer et examiner les détails'
                              : 'Click image to zoom in and examine details'}
                        </span>
                      </>
                    ) : (
                      <>
                        <ZoomOut className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {lang === 'ar'
                            ? 'انقر لإعادة الضبط أو اسحب للاستكشاف'
                            : lang === 'fr'
                              ? 'Cliquez pour réinitialiser ou glissez pour explorer'
                              : 'Click to reset zoom or drag to explore'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer description & caption */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-slate-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="leading-relaxed">
                  {filteredGallery[activeLightboxIndex].desc[lang] || filteredGallery[activeLightboxIndex].desc.en}
                </p>
                <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-400 font-mono">
                  <span>{filteredGallery[activeLightboxIndex].category.toUpperCase()}</span>
                  <span>•</span>
                  <span>{filteredGallery[activeLightboxIndex].labId.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
