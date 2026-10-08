import asirVanImg from '@/assets/images/asir-lab-van5.jpg';
import asirSideImg from '@/assets/images/asir-lab-van2.jpg';
import asirRearImg from '@/assets/images/asir-lab-van8.jpg';
import asirDeployImg from '@/assets/images/asir-lab-van3.jpg';
import asirActionImg from '@/assets/images/asir-lab-van7.jpg';
import asirVan1Img from '@/assets/images/asir-lab-van1.jpg';
import asirVan4Img from '@/assets/images/asir-lab-van4.jpg';
import asirVan6Img from '@/assets/images/asir-lab-van6.jpg';
import asirVan9Img from '@/assets/images/asir-lab-van9.jpg';

import jazanVanImg from '@/assets/images/jazan-lab-van4.jpg';
import jazanSideImg from '@/assets/images/jazan-lab-van2.jpg';
import jazanRearImg from '@/assets/images/jazan-lab-van5.jpg';
import jazanDeployImg from '@/assets/images/jazan-lab-van1.jpg';
import jazanVan3Img from '@/assets/images/jazan-lab-van3.jpg';
import jazanVan6Img from '@/assets/images/jazan-lab-van6.jpg';

import bahaVanImg from '@/assets/images/albaha-lab-van1.jpg';
import bahaSideImg from '@/assets/images/albaha-lab-van5.jpg';
import bahaRearImg from '@/assets/images/albaha-lab-van3.jpg';
import bahaDeployImg from '@/assets/images/albaha-lab-van2.jpg';
import albahaVan4Img from '@/assets/images/albaha-lab-van4.jpg';

import najranVanImg from '@/assets/images/lab-car-najran.jpg';
import najranRealDoorsImg from '@/assets/images/Najran-lab-van-01.jpg';
import najranRealBenchImg from '@/assets/images/Najran-lab-van-02.jpg';
import najranRealTechImg from '@/assets/images/Najran-lab-van-03.jpg';
import najranRealSideImg from '@/assets/images/Najran-lab-van-04.jpg';
import najranRealKitsImg from '@/assets/images/Najran-lab-van-05.jpg';
import najranRealPurityImg from '@/assets/images/Najran-lab-van-06.jpg';

export interface MobileLabGalleryImage {
  id: string;
  role: 'exterior' | 'side' | 'rear' | 'interior' | 'workbench' | 'equipment' | 'sampling' | 'deployment';
  roleTitle: { ar: string; en: string; fr: string };
  image: string;
  caption: { ar: string; en: string; fr: string };
  isRealPhoto: boolean;
  isTechnicalReference: boolean;
  statusBadge: { ar: string; en: string; fr: string };
}

export interface MobileLaboratorySection {
  id: string;
  anchorId: string;
  titleArabic: string;
  titleEnglish: string;
  titleFrench: string;
  region: { ar: string; en: string; fr: string };
  introText: {
    ar: string;
    en: string;
    fr: string;
  };
  roles: {
    sampling: { ar: string; en: string; fr: string };
    monitoring: { ar: string; en: string; fr: string };
    environmental: { ar: string; en: string; fr: string };
    measurements: { ar: string; en: string; fr: string };
    support: { ar: string; en: string; fr: string };
  };
  coveredBranches: { ar: string; en: string; fr: string };
  technicalSpecs: { ar: string; en: string; fr: string }[];
  equipment: { ar: string; en: string; fr: string }[];
  images: MobileLabGalleryImage[];
}

export const mobileLaboratoriesData: Record<'asir' | 'jazan' | 'alBaha' | 'najran', MobileLaboratorySection> = {
  asir: {
    id: 'asir',
    anchorId: 'mobile-asir',
    titleArabic: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير',
    titleEnglish: 'Asir Central Laboratory for Drinking Water and Environmental Services',
    titleFrench: 'Laboratoire Central d\'Eau Potable et de Services Environnementaux de la Région d\'Asir',
    region: { ar: 'منطقة عسير', en: 'Asir Region', fr: 'Région d\'Asir' },
    introText: {
      ar: 'يقوم المختبر الميداني المتنقل التابع للمختبر المركزي بعسير بدور حيوي في سحب العينات الميدانية، ومراقبة جودة مياه الشرب، وإجراء التحاليل البيئية والقياسات الفورية بمواقع الإنتاج والضخ، فضلاً عن إسناد وتشغيل منظومة المختبرات الفرعية بكافة محافظات المنطقة.',
      en: 'The mobile field testing unit of Asir Central Laboratory plays a vital operational role in field sampling, drinking water quality monitoring, on-site environmental analysis, rapid physical-chemical measurements, and technical support across all regional branch laboratories.',
      fr: 'L\'unité mobile rattachée au Laboratoire Central d\'Asir assure un rôle opérationnel clé : prélèvements sur le terrain, veille continue sur la potabilité, analyses physico-chimiques directes et soutien technique permanent auprès des laboratoires de gouvernorats.',
    },
    roles: {
      sampling: {
        ar: 'سحب العينات الميدانية وفق بروتوكولات الآيزو المعتمدة من السدود ومحطات التنقية وشبكات التوزيع الجبلية.',
        en: 'Certified field sampling adhering to ISO protocols across dams, purification plants, and highland networks.',
        fr: 'Prélèvement d\'échantillons selon les normes ISO certifiées sur barrages, stations et réseaux.',
      },
      monitoring: {
        ar: 'مراقبة جودة المياه المعالجة والسطحية والجوفية على مدار الساعة لضمان مطابقة المواصفات السعودية SASO.',
        en: 'Continuous 24/7 quality monitoring of treated, surface, and groundwater to guarantee SASO compliance.',
        fr: 'Surveillance 24/7 de la qualité de l\'eau potable pour garantir la conformité aux normes SASO.',
      },
      environmental: {
        ar: 'التحاليل والخدمات البيئية الفورية لتقييم المصادر المائية ومحطات معالجة الصرف الصحي والمسطحات المائية.',
        en: 'On-site environmental analysis assessing raw water reservoirs, wastewater treatment, and catchment basins.',
        fr: 'Analyses environnementales de terrain sur bassins de retenue et stations d\'épuration.',
      },
      measurements: {
        ar: 'القياسات والتحاليل الفورية للكلور المتبقي، العكارة، الأس الهيدروجيني، والأملاح الذائبة خلال 3 دقائق.',
        en: 'Immediate on-site measurements of free chlorine, turbidity, pH, and conductivity within 3 minutes.',
        fr: 'Mesures instantanées du chlore résiduel, de la turbidité, du pH et des sels dissous en 3 minutes.',
      },
      support: {
        ar: 'إسناد وتشغيل مختبرات فروع بيشة ومحايل عسير وخميس مشيط والنماص وسراة عبيدة في الطوارئ والمواسم.',
        en: 'Rapid operational reinforcement for Bisha, Muhayil, Khamis Mushait, and highland branch laboratories.',
        fr: 'Appui d\'urgence et renfort direct pour les branches de Bisha, Muhayil, Khamis Mushait et gouvernorats.',
      },
    },
    coveredBranches: {
      ar: 'فرع بيشة، فرع محايل عسير، خميس مشيط، النماص، سراة عبيدة، تنومة، رجال ألمع، تثليث، أحد رفيدة، محطات سد بيشة',
      en: 'Bisha Branch, Muhayil Asir Branch, Khamis Mushait, Al-Namas, Sarat Abida, Tanomah, Rijal Almaa, Tathlith, Ahad Rufaidah, Bisha Dam',
      fr: 'Branche de Bisha, branche de Muhayil Asir, Khamis Mushait, Al-Namas, Sarat Abida, Tanomah, Rijal Almaa, Tathlith, Ahad Rufaidah',
    },
    technicalSpecs: [
      { ar: 'مركبة دفع رباعي 4WD مجهزة للتضاريس الجبلية الوعرة ومرتفعات عسير', en: 'Heavy-duty 4WD chassis tailored for Asir highlands and steep terrain', fr: 'Châssis 4x4 renforcé tout-terrain pour les reliefs montagneux d\'Asir' },
      { ar: 'محطة طاقة مستقلة بمولد صامت وأنظمة بطاريات ليثيوم 220V', en: 'Independent power station with silent generator & 220V lithium battery bank', fr: 'Centrale d\'énergie autonome avec générateur insonorisé et batteries 220V' },
      { ar: 'نظام تكييف معزول وتطهير بالأشعة فوق البنفسجية UV-C للحفاظ على العينات', en: 'Thermal climate-isolation with integrated UV-C sterilization chambers', fr: 'Climatisation étanche avec stérilisation UV-C pour conservation d\'échantillons' },
      { ar: 'وحدة اتصال فضائي ورقمي لنقل نتائج الفحوصات الفورية لقاعدة البيانات المركزية', en: 'Digital telemetry & satellite uplink for instant central database sync', fr: 'Transmission télémétrique satellite directe vers la base de données centrale' },
    ],
    equipment: [
      { ar: 'مقياس طيف ضوئي محمول متعدد المعاملات (Spectrophotometer)', en: 'Multi-parameter portable spectrophotometer with field reagent kits', fr: 'Spectrophotomètre portable multi-paramètres avec réactifs étalonnés' },
      { ar: 'أجهزة قياس العكارة الميدانية المعتمدة (Turbidimeter ISO 7027)', en: 'Certified ISO 7027 digital field turbidimeters with calibration vials', fr: 'Turbidimètre numérique de terrain certifié ISO 7027' },
      { ar: 'مقياس إلكتروني مركب للرقم الهيدروجيني والتوصيل الكهربائي (pH / EC Meter)', en: 'Digital composite pH / electrical conductivity / TDS field meter', fr: 'Appareil combiné pH / conductivité électrique / TDS numérique' },
      { ar: 'حاضنة ميكروبيولوجية محمولة ومجهر فحص للبكتيريا القولونية', en: 'Portable field microbiological incubator & coliform testing system', fr: 'Incubateur microbiologique portable et kit coliformes fécaux' },
    ],
    images: [
      {
        id: 'asir-img-1',
        role: 'exterior',
        roleTitle: { ar: 'الهيكل الخارجي للمختبر المتنقل', en: 'Mobile laboratory exterior', fr: 'Extérieur du laboratoire mobile' },
        image: asirVanImg,
        caption: {
          ar: 'مركبة المختبر المركزي المتنقل بعسير بكامل الهوية الرسمية لشركة المياه الوطنية وإدارة مختبرات القطاع الجنوبي.',
          en: 'Asir Central Mobile Laboratory vehicle in official National Water Company and Southern Cluster livery.',
          fr: 'Véhicule du laboratoire mobile central d\'Asir aux couleurs officielles de la NWC et du Cluster Sud.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'asir-img-2',
        role: 'side',
        roleTitle: { ar: 'المنظر الجانبي للمختبر المتنقل', en: 'Mobile laboratory side view', fr: 'Vue latérale du laboratoire mobile' },
        image: asirSideImg,
        caption: {
          ar: 'المنظر الجانبي لمركبة عسير يوضح كتابات الهوية الرسمية: المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير.',
          en: 'Side profile showing official inscriptions: Asir Central Laboratory for Drinking Water & Environmental Services.',
          fr: 'Vue latérale avec inscriptions officielles : Laboratoire Central d\'Asir pour l\'eau potable et les services environnementaux.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'asir-img-3',
        role: 'rear',
        roleTitle: { ar: 'منطقة الوصول الخلفية والمقصورة', en: 'Mobile laboratory rear/access area', fr: 'Accès arrière et compartiment technique' },
        image: asirRearImg,
        caption: {
          ar: 'الواجهة الخلفية للمركبة المزودة بأبواب مزدوجة ونظام إنارة ميدانية لعمليات التدخل الليلي والطارئ.',
          en: 'Rear dual-access doors with integrated floodlights engineered for night interventions and emergency field access.',
          fr: 'Portes arrière doubles et éclairage de secours pour interventions nocturnes et urgences.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'asir-img-4',
        role: 'interior',
        roleTitle: { ar: 'المختبر الداخلي المتنقل وكيميائي الفحص', en: 'Interior laboratory', fr: 'Laboratoire intérieur' },
        image: asirVan4Img,
        caption: {
          ar: 'صورة حقيقية للمختبر الداخلي المتنقل وكيميائي فحص معتمد أثناء فحص العينات (المرجع الفني المعتمد لأسطول القطاع الجنوبي).',
          en: 'Real photograph inside the mobile laboratory: certified chemist performing analytical procedures (Certified Technical Reference - Southern Fleet).',
          fr: 'Photographie réelle de l\'intérieur du laboratoire mobile : chimiste certifié en action (Référence technique certifiée - Flotte Sud).',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
      {
        id: 'asir-img-5',
        role: 'workbench',
        roleTitle: { ar: 'منضدة العمل والتحاليل المخبرية', en: 'Laboratory workbench', fr: 'Paillasse de laboratoire' },
        image: asirVan6Img,
        caption: {
          ar: 'منضدة التحليل الميدانية المعتمدة لأسطول القطاع الجنوبي: أجهزة القياس الرقمية والمحاليل القياسية وحوافظ العينات المعقمة.',
          en: 'Certified field analytical workbench layout of the Southern Cluster fleet: digital meters, calibrated reagents, and sterile sample coolers.',
          fr: 'Plan de travail analytique de référence de la flotte du Cluster Sud : appareils numériques, réactifs et glacières stériles.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
      {
        id: 'asir-img-6',
        role: 'equipment',
        roleTitle: { ar: 'الأجهزة والحقائب التحليلية المعتمدة', en: 'Equipment', fr: 'Équipements et instrumentation' },
        image: asirVan9Img,
        caption: {
          ar: 'حقائب الفحص الميداني المحمولة: مقاييس الطيف الضوئي المحمولة، مقاييس العكارة الرقمية، وأنابيب المعايرة الميدانية.',
          en: 'Portable field testing kits: handheld spectrophotometers, digital turbidimeters, and ISO-calibrated reagents.',
          fr: 'Kits d\'analyse portables : spectrophotomètres de terrain, turbidimètres et étalons certifiés.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
      {
        id: 'asir-img-7',
        role: 'sampling',
        roleTitle: { ar: 'منطقة سحب العينات والفحص الميداني', en: 'Sampling area', fr: 'Zone de prélèvement' },
        image: asirActionImg,
        caption: {
          ar: 'إجراء الفحوصات الفيزيائية والكيميائية الفورية لمياه الآبار وشبكات التغذية بمحافظات عسير.',
          en: 'Real-time physical and chemical testing conducted on wellheads and supply lines across Asir sectors.',
          fr: 'Analyses physico-chimiques immédiates sur forages et conduites d\'alimentation dans les gouvernorats d\'Asir.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'asir-img-8',
        role: 'deployment',
        roleTitle: { ar: 'الانتشار الميداني بمرتفعات وسدود عسير', en: 'Field deployment', fr: 'Déploiement sur le terrain' },
        image: asirDeployImg,
        caption: {
          ar: 'انتشار الوحدة المتنقلة بمرتفعات عسير لتفقد مصادر مياه السدود والشبكات الحيوية في المناطق الجبلية.',
          en: 'Mobile unit deployed in Asir mountainous terrain inspecting reservoir water quality and distribution networks.',
          fr: 'Déploiement de l\'unité mobile dans les reliefs d\'Asir pour le contrôle des barrages et réservoirs.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'asir-img-9',
        role: 'exterior',
        roleTitle: {
          ar: 'الواجهة الأمامية والجانبية للمركبة المتنقلة',
          en: 'Mobile Lab Front Three-Quarter View',
          fr: 'Vue trois-quarts avant du véhicule mobile',
        },
        image: asirVan1Img,
        caption: {
          ar: 'مركبة المختبر المركزي المتنقل بعسير من منظور أمامي يبرز هيكل الدفع الرباعي المجهز للمناطق الجبلية وهوية شركة المياه الوطنية.',
          en: 'Front three-quarter view of the Asir Central Mobile Laboratory showcasing all-terrain 4WD specifications and official livery.',
          fr: 'Vue trois-quarts avant du laboratoire mobile d’Asir mettant en valeur le châssis 4x4 tout-terrain et la livrée officielle NWC.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: {
          ar: 'تصور توضيحي مؤسسي',
          en: 'Institutional illustrative visualization',
          fr: 'Visualisation illustrative institutionnelle',
        },
      },
    ],
  },

  jazan: {
    id: 'jazan',
    anchorId: 'mobile-jazan',
    titleArabic: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة جازان',
    titleEnglish: 'Jazan Central Laboratory for Drinking Water and Environmental Services',
    titleFrench: 'Laboratoire Central d\'Eau Potable et de Services Environnementaux de la Région de Jazan',
    region: { ar: 'منطقة جازان', en: 'Jazan Region', fr: 'Région de Jazan' },
    introText: {
      ar: 'يغطي المختبر الميداني المتنقل التابع للمختبر المركزي بجازان السواحل والجزر ومحطات تحلية مياه البحر وسدود وادي بيش وجازان، مع قدرات متقدمة للتحاليل الكيميائية ومراقبة الملوحة وإسناد فروع الدرب، الشقيق وجزر فرسان.',
      en: 'The mobile testing unit of Jazan Central Laboratory covers coastal plains, offshore islands, desalination plants, and water transmission corridors, featuring high-accuracy salinity profiling and field support for Al-Darb, Al-Shaqiq, and Farasan sectors.',
      fr: 'L\'unité mobile du Laboratoire Central de Jazan assure le suivi des zones côtières, îles, usines de dessalement et barrages, avec une expertise avancée en salinité et appui aux branches d\'Al-Darb, Al-Shaqiq et Farasan.',
    },
    roles: {
      sampling: {
        ar: 'سحب العينات من محطات التحلية الساحلية ومشاريع مياه جزر فرسان وشبكات التغذية العامة.',
        en: 'Field sampling across coastal desalination facilities, Farasan Island supply, and urban networks.',
        fr: 'Prélèvements sur les usines de dessalement côtières, les îles Farasan et les réseaux de distribution.',
      },
      monitoring: {
        ar: 'مراقبة جودة مياه الشرب المنقولة وضبط معدلات المعالجة والكلورة بمحطات الضخ الساحلية.',
        en: 'Continuous potability and chlorination monitoring along major coastal transmission aqueducts.',
        fr: 'Contrôle continu de potabilité et de chloration sur les grands aqueducs côtiers.',
      },
      environmental: {
        ar: 'الفحوصات البيئية للشواطئ ومصبات الأودية ومصادر المياه السطحية في بيش وصامطة وأبو عريش.',
        en: 'Environmental surveillance of littoral areas, coastal wadi estuaries, and surface intakes.',
        fr: 'Surveillance environnementale des estuaires côtiers et des réserves de surface.',
      },
      measurements: {
        ar: 'القياس الفوري للأملاح الذائبة الكلية TDS، الملوحة، التوصيل الكهربائي، والعكارة.',
        en: 'Instantaneous on-site measurements of TDS, salinity, electrical conductivity, and turbidity.',
        fr: 'Mesures instantanées du TDS, de la salinité, de la conductivité et de la turbidité.',
      },
      support: {
        ar: 'التدخل السريع لدعم فروع الدرب والشقيق وجزر فرسان وصبيا وبيش في الحالات الطارئة.',
        en: 'Rapid emergency response supporting Al-Darb, Al-Shaqiq, Farasan, Sabya, and Baish branches.',
        fr: 'Intervention d\'urgence pour Al-Darb, Al-Shaqiq, Farasan, Sabya et Baish.',
      },
    },
    coveredBranches: {
      ar: 'فرع الدرب والشقيق، فرع جزر فرسان، صبيا، أبو عريش، صامطة، بيش، محطات التحلية، سد وادي جازان، سد وادي بيش',
      en: 'Al-Darb & Al-Shaqiq Branch, Farasan Islands Branch, Sabya, Abu Arish, Samtah, Baish, Desalination Plants, Wadi Jazan Dam, Wadi Baish Dam',
      fr: 'Branche Al-Darb & Al-Shaqiq, îles Farasan, Sabya, Abu Arish, Samtah, Baish, usines de dessalement',
    },
    technicalSpecs: [
      { ar: 'مركبة معالجة ضد الرطوبة والأملاح الساحلية ومجهزة للمناطق الرطبة والحارة', en: 'Anti-corrosion marine coated chassis optimized for coastal humidity and saline environments', fr: 'Châssis traité anti-corrosion adapté à l\'humidité saline côtière' },
      { ar: 'نظام تبريد فائق الكفاءة لحماية الكواشف والمستشعرات الكيميائية من درجات الحرارة العالية', en: 'Ultra-efficient climate regulation safeguarding chemical reagents against high ambient heat', fr: 'Climatisation renforcée protégeant les réactifs des températures élevées' },
      { ar: 'حاويات مفرغة من الهواء لنقل عينات الجزر والمحطات البحرية بأمان قياسي', en: 'Pressurized vacuum transport cases ensuring integrity for offshore island sampling', fr: 'Conteneurs étanches sous vide pour le transport maritime des échantillons' },
      { ar: 'أجهزة قياس إلكترونية عالية الحساسية للأملاح العالية ومياه التحلية المنتجة', en: 'High-precision salinity and wide-range conductivity meters calibrated for desalinated water', fr: 'Conductimètres haute précision étalonnés pour eau dessalée' },
    ],
    equipment: [
      { ar: 'مقياس ملوحة وأملاح ذائبة رقمي عالي الدقة (High-Range Salinometer / TDS)', en: 'High-precision digital salinometer & wide-range TDS conductivity meter', fr: 'Salinomètre numérique et conductimètre TDS large gamme' },
      { ar: 'مقياس عكارة محمول للبيئات الساحلية (Field Turbidimeter)', en: 'Field-ruggedized turbidimeter with marine-grade calibration vials', fr: 'Turbidimètre de terrain renforcé avec étalons marins' },
      { ar: 'جهاز فحص الكلور والتعقيم الفوري (Colorimeter for Free & Total Chlorine)', en: 'Digital colorimeter for free and total chlorine verification', fr: 'Colorimètre numérique pour chlore libre et total' },
      { ar: 'وحدة استخلاص وفلترة غشائية ميكروبيولوجية ميدانية (Membrane Filtration Unit)', en: 'Portable microbiological membrane filtration unit for rapid water safety confirmation', fr: 'Système de filtration membranaire microbiologique portable' },
    ],
    images: [
      {
        id: 'jazan-img-1',
        role: 'exterior',
        roleTitle: { ar: 'الهيكل الخارجي للمركبة', en: 'Mobile Lab Exterior', fr: 'Extérieur de l\'unité mobile' },
        image: jazanVanImg,
        caption: {
          ar: 'مركبة المختبر المركزي المتنقل بجازان بهوية شركة المياه الوطنية وإدارة مختبرات القطاع الجنوبي.',
          en: 'Jazan Central Mobile Laboratory in official livery ready for coastal and regional deployment.',
          fr: 'Véhicule du laboratoire mobile central de Jazan prêt pour les interventions côtières.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'jazan-img-2',
        role: 'side',
        roleTitle: { ar: 'المنظر الجانبي والهوية الرسمية', en: 'Side Profile & Livery', fr: 'Profil latéral et livrée officielle' },
        image: jazanSideImg,
        caption: {
          ar: 'المنظر الجانبي لمركبة جازان يوضح كتابات الهوية: المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة جازان.',
          en: 'Side profile showing official inscriptions: Jazan Central Laboratory for Drinking Water & Environmental Services.',
          fr: 'Profil latéral affichant l\'inscription officielle du Laboratoire Central de Jazan.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'jazan-img-3',
        role: 'rear',
        roleTitle: { ar: 'منطقة الوصول الخلفية والمقصورة', en: 'Rear Access & Loading Bay', fr: 'Accès arrière et équipement' },
        image: jazanRearImg,
        caption: {
          ar: 'المقصورة الخلفية مزودة بمحطة غسيل كيميائي سريعة وأنظمة عزل مخصصة للبيئة الساحلية.',
          en: 'Rear compartment equipped with rapid eye/eyewash safety stations and marine climate seals.',
          fr: 'Compartiment arrière avec station de sécurité et joints étanches marins.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'jazan-img-4',
        role: 'deployment',
        roleTitle: { ar: 'الانتشار الميداني بمحطات التحلية والسواحل', en: 'Coastal & Desalination Deployment', fr: 'Déploiement littoral et usines de dessalement' },
        image: jazanDeployImg,
        caption: {
          ar: 'انتشار الوحدة المتنقلة قرب المنشآت المائية الساحلية لمراقبة مياه الشرب ومحطات الإمداد بجازان.',
          en: 'Deployment near coastal water utilities verifying potability and salinity compliance in Jazan.',
          fr: 'Déploiement près des installations côtières pour le contrôle de conformité à Jazan.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'jazan-img-5',
        role: 'interior',
        roleTitle: { ar: 'الفحص الميكروبيولوجي بالمختبر المتنقل', en: 'Onboard Microbiological Testing', fr: 'Analyse microbiologique embarquée' },
        image: jazanVan6Img,
        caption: {
          ar: 'كيميائي معتمد يجري الفحص الميكروبيولوجي الميداني بالمختبر المتنقل لأسطول القطاع الجنوبي.',
          en: 'Certified chemist performing on-site microbiological verification inside the Southern fleet mobile unit.',
          fr: 'Chimiste certifié réalisant un test microbiologique à bord de l\'unité mobile du Cluster Sud.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
      {
        id: 'jazan-img-6',
        role: 'sampling',
        roleTitle: { ar: 'منطقة سحب العينات وقياس النقاوة', en: 'Water Purity & Sampling Inspection', fr: 'Contrôle de pureté et flacons de mesure' },
        image: jazanVan3Img,
        caption: {
          ar: 'فحص فوري لنقاء عينات المياه والتأكد من خلوها من أي شوائب أو ملوثات كيميائية.',
          en: 'Direct field purity verification ensuring water samples meet pristine institutional benchmarks.',
          fr: 'Contrôle direct de pureté et d\'absence de contaminants chimiques sur le terrain.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
    ],
  },

  alBaha: {
    id: 'alBaha',
    anchorId: 'mobile-baha',
    titleArabic: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة الباحة',
    titleEnglish: 'Al-Baha Central Laboratory for Drinking Water and Environmental Services',
    titleFrench: 'Laboratoire Central d\'Eau Potable et de Services Environnementaux de la Région d\'Al-Baha',
    region: { ar: 'منطقة الباحة', en: 'Al-Baha Region', fr: 'Région d\'Al-Baha' },
    introText: {
      ar: 'يقوم المختبر الميداني المتنقل التابع للمختبر المركزي بالباحة بتغطية التضاريس الجبلية الوعرة لسراة الباحة وسهول تهامة، متكفلاً بسحب العينات ومراقبة جودة مياه السدود والشبكات والتدخل السريع لفروع قلوة، المخواة وبلجرشي.',
      en: 'The mobile testing unit of Al-Baha Central Laboratory navigates the steep elevation drops between the Sarawat mountain range and Tihama plains, monitoring reservoir waters and providing fast-response support for Qalwah, Al-Mikhwah, and Baljurashi.',
      fr: 'L\'unité mobile du Laboratoire Central d\'Al-Baha franchit les dénivelés abrupts entre le plateau des Sarawat et la plaine de Tihama, contrôlant la qualité de l\'eau des barrages et appuyant Qalwah, Al-Mikhwah et Baljurashi.',
    },
    roles: {
      sampling: {
        ar: 'سحب العينات المباشرة من سد وادي العقيق، سد ثراد، سد الجنابين ومحطات الضخ بسراة الباحة وتهامة.',
        en: 'Direct field sampling from Al-Aqiq, Tharad, and Janabayn dams and distribution stations.',
        fr: 'Prélèvements directs sur les barrages Al-Aqiq, Tharad, Janabayn et les stations de pompage.',
      },
      monitoring: {
        ar: 'المتابعة اليومية لجودة مياه الشرب وشبكات التغذية في القرى والمرتفعات الجبلية الوعرة.',
        en: 'Daily quality audits on village water networks across difficult mountain terrains.',
        fr: 'Suivi quotidien de l\'eau potable dans les villages et zones montagneuses isolées.',
      },
      environmental: {
        ar: 'تقييم الآثار البيئية وتدفقات السيول على أحواض تجميع المياه ومصادر التغذية الجوفية.',
        en: 'Environmental surveillance of runoff impact on catchment basins and recharge aquifers.',
        fr: 'Évaluation environnementale de l\'impact des crues sur les bassins versants.',
      },
      measurements: {
        ar: 'القياس الفوري للعكارة والتعقيم ومؤشرات الطمي الناتجة عن الأمطار والسيول بالسدود.',
        en: 'Instantaneous field measurements of turbidity, silt indexes, and disinfection efficacy after rainfalls.',
        fr: 'Mesures immédiates de turbidité et d\'efficacité de désinfection après les pluies.',
      },
      support: {
        ar: 'إسناد وتشغيل فروع قلوة، المخواة، بلجرشي، العقيق والمندق والتواجد السريع بمواسم السياحة.',
        en: 'Operational backing for Qalwah, Al-Mikhwah, Baljurashi, Al-Aqiq, and seasonal tourist influx.',
        fr: 'Soutien aux branches de Qalwah, Al-Mikhwah, Baljurashi, Al-Aqiq et lors des saisons touristiques.',
      },
    },
    coveredBranches: {
      ar: 'فرع قلوة، فرع المخواة (تهامة)، بلجرشي، العقيق، المندق، الحجرة، غامد الزناد، سد العقيق، سد ثراد، سد الجنابين',
      en: 'Qalwah Branch, Al-Mikhwah (Tihama) Branch, Baljurashi, Al-Aqiq, Al-Mandaq, Al-Hajrah, Ghamid Al-Zinad, Al-Aqiq Dam, Tharad Dam, Janabayn Dam',
      fr: 'Branche de Qalwah, branche d\'Al-Mikhwah (Tihama), Baljurashi, Al-Aqiq, Al-Mandaq, Al-Hajrah, Ghamid Al-Zinad',
    },
    technicalSpecs: [
      { ar: 'مركبة معززة بنظام تعليق للطرق الصخرية الحادة ونظام مكابح هيدروليكي للمنحدرات', en: 'Reinforced heavy-duty suspension and hydraulic braking engineered for steep escarpment descents', fr: 'Suspension renforcée et freinage hydraulique pour descentes d\'escarpements raides' },
      { ar: 'نظام تثبيت مغناطيسي وهيدروليكي لمنضدة الأجهزة لمنع الاهتزاز أثناء التحرك في الطرق الوعرة', en: 'Hydraulic & magnetic stabilization bench preventing vibration shock to precision analyzers', fr: 'Plan de travail stabilisé hydrauliquement contre les vibrations sur pistes escarpées' },
      { ar: 'إضاءة محيطية LED عالية الشدة للعمل في الأودية والأنفاق المائية ومواقع السدود المعتمة', en: 'High-lumen 360-degree LED floodlights for safe nighttime work in wadis and dam tunnels', fr: 'Projecteurs LED 360° haute intensité pour interventions nocturnes dans les vallées' },
      { ar: 'محطة غسيل وتطهير محمولة متوافقة مع متطلبات السلامة الكيميائية الميدانية', en: 'Self-contained decontamination & chemical eye-wash station meeting rigorous field safety standards', fr: 'Station autonome de décontamination et de sécurité chimique de terrain' },
    ],
    equipment: [
      { ar: 'مقياس عكارة متقدم مزود بخاصية إزالة الفقاعات الهوائية (Turbidimeter with De-bubbler)', en: 'High-precision turbidimeter with de-bubbling feature for aeration-rich dam waters', fr: 'Turbidimètre de haute précision avec système de dégazage pour eaux de barrage' },
      { ar: 'محلل كيميائي ضوئي متعدد القنوات للحديد والمنغنيز والكلور (Photometric Analyzer)', en: 'Multi-channel field photometer testing iron, manganese, and residual chlorine', fr: 'Photomètre de terrain multi-canaux pour le fer, manganèse et chlore résiduel' },
      { ar: 'مجسات قياس الأس الهيدروجيني والأكسجين المذاب (pH & Dissolved Oxygen DO Probes)', en: 'Digital submersible probes for pH, temperature, and dissolved oxygen (DO)', fr: 'Sondes numériques submersibles pour pH, température et oxygène dissous' },
      { ar: 'حقيبة اختبارات بيولوجية سريعة ومزارع بكتيرية ميدانية (Rapid Bio-Detection Kit)', en: 'Rapid field bio-detection incubation kit for potable water verification', fr: 'Kit de bio-détection rapide et d\'incubation bactériologique sur le terrain' },
    ],
    images: [
      {
        id: 'baha-img-1',
        role: 'exterior',
        roleTitle: { ar: 'الهيكل الخارجي للمركبة', en: 'Mobile Lab Exterior', fr: 'Extérieur de l\'unité mobile' },
        image: bahaVanImg,
        caption: {
          ar: 'مركبة المختبر المركزي المتنقل بالباحة المجهزة لمرتفعات السراة وسهول تهامة الوعرة.',
          en: 'Al-Baha Central Mobile Laboratory vehicle engineered for the Sarawat summits and Tihama plains.',
          fr: 'Véhicule du laboratoire mobile central d\'Al-Baha adapté aux reliefs de Sarawat et de Tihama.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'baha-img-2',
        role: 'side',
        roleTitle: { ar: 'المنظر الجانبي والهوية الرسمية', en: 'Side Profile & Livery', fr: 'Profil latéral et livrée officielle' },
        image: bahaSideImg,
        caption: {
          ar: 'المنظر الجانبي لمركبة الباحة يوضح كتابات الهوية: المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة الباحة.',
          en: 'Side profile showing official inscriptions: Al-Baha Central Laboratory for Drinking Water & Environmental Services.',
          fr: 'Profil latéral affichant l\'inscription officielle du Laboratoire Central d\'Al-Baha.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'baha-img-3',
        role: 'rear',
        roleTitle: { ar: 'منطقة الوصول الخلفية والمقصورة', en: 'Rear Access & Loading Bay', fr: 'Accès arrière et équipement' },
        image: bahaRearImg,
        caption: {
          ar: 'المقصورة الخلفية مزودة بمدرج تحميل معزول لتفريغ ونقل حاويات العينات الكبيرة من السدود.',
          en: 'Rear compartment with reinforced loading ramp for heavy dam sample collection cases.',
          fr: 'Compartiment arrière avec rampe de chargement pour grands bacs d\'échantillonnage de barrages.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'baha-img-4',
        role: 'deployment',
        roleTitle: { ar: 'الانتشار الميداني بسدود وأودية الباحة', en: 'Dam & Mountain Valley Deployment', fr: 'Déploiement sur barrages et vallées d\'Al-Baha' },
        image: bahaDeployImg,
        caption: {
          ar: 'انتشار الوحدة المتنقلة قرب السدود ومحطات التنقية لفحص المياه بعد الأمطار ومواسم السيول.',
          en: 'Field deployment near reservoir dams and treatment plants inspecting water quality after rainfalls.',
          fr: 'Déploiement près des barrages et stations pour contrôle de la qualité de l\'eau après les pluies.',
        },
        isRealPhoto: false,
        isTechnicalReference: false,
        statusBadge: { ar: 'تصور توضيحي مؤسسي', en: 'Institutional illustrative visualization', fr: 'Visualisation illustrative institutionnelle' },
      },
      {
        id: 'baha-img-5',
        role: 'workbench',
        roleTitle: { ar: 'منضدة التحاليل الميدانية المعتمدة', en: 'Certified Analytical Workbench', fr: 'Plan de travail analytique certifié' },
        image: albahaVan4Img,
        caption: {
          ar: 'منضدة الفحص الميداني المعتمدة بأسطول القطاع الجنوبي مجهزة بمقاييس العكارة ومحطات المعايرة السريعة.',
          en: 'Standardized field analytical workbench of the Southern fleet featuring turbidimeters and calibration stations.',
          fr: 'Plan de travail analytique standard de la flotte du Cluster Sud avec turbidimètres et étalons.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'مرجع فني معتمد (أسطول القطاع الجنوبي)', en: 'Certified Technical Reference (Southern Fleet)', fr: 'Référence technique certifiée (Flotte Sud)' },
      },
      
    ],
  },

  najran: {
    id: 'najran',
    anchorId: 'mobile-najran',
    titleArabic: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة نجران (المرجع الفني والتقني)',
    titleEnglish: 'Najran Central Laboratory for Drinking Water and Environmental Services (Technical Benchmark)',
    titleFrench: 'Laboratoire Central de Najran pour l\'Eau Potable et l\'Environnement (Référence Technique)',
    region: { ar: 'منطقة نجران', en: 'Najran Region', fr: 'Région de Najran' },
    introText: {
      ar: 'يمثل مختبر نجران المركزي المتنقل النموذج المرجعي والأساس الهندسي المعتمد لمركبات أسطول القطاع الجنوبي، موثقاً بالأرشيف الفوتوغرافي الحقيقي المعتمد الذي يوضح التجهيزات المعملية، الهيكل الخارجي، منضدة العمل، وأجهزة التحليل الفوري المعتمدة.',
      en: 'The Najran Central Mobile Laboratory serves as the physical benchmark and technical foundation for the Southern Cluster fleet, documented with certified real photographic records showcasing interior workbenches, certified instrumentation, and official livery.',
      fr: 'Le laboratoire mobile central de Najran constitue la référence physique et technique certifiée de la flotte du Cluster Sud, documentée par des photographies réelles illustrant l\'aménagement intérieur, la paillasse et les instruments.',
    },
    roles: {
      sampling: {
        ar: 'سحب العينات المباشرة من حقول الآبار بمحاذاة الربع الخالي وشبكات المياه بمحافظات نجران وشرورة.',
        en: 'Direct wellhead sampling along the Rub al-Khali perimeter and supply networks across Najran and Sharurah.',
        fr: 'Prélèvements directs sur les champs de captage en bordure du Rub al-Khali et les réseaux de Najran et Sharurah.',
      },
      monitoring: {
        ar: 'المراقبة المستمرة لمصادر المياه الجوفية والسطحية ومعالجة المياه في محطات وادي نجران.',
        en: 'Continuous quality surveillance of deep aquifers and treated surface waters in Wadi Najran.',
        fr: 'Surveillance continue des aquifères profonds et des eaux traitées de l\'Oued Najran.',
      },
      environmental: {
        ar: 'الرصد البيئي لمصادر المياه وحماية المنظومة المائية بالحد الجنوبي والمنافذ الحدودية (منفذ الوديعة).',
        en: 'Environmental surveillance protecting water security across border crossings (Al-Wadiah port).',
        fr: 'Surveillance environnementale et sécurisation hydrique au poste frontalier d\'Al-Wadiah.',
      },
      measurements: {
        ar: 'القياسات الفورية للعكارة، الملوحة، الكلور المتبقي، والخواص الكيميائية والبيولوجية.',
        en: 'Instantaneous on-site measurements of turbidity, salinity, free chlorine, and microbial safety.',
        fr: 'Mesures instantanées de turbidité, salinité, chlore libre et sécurité microbiologique.',
      },
      support: {
        ar: 'إسناد وتشغيل فروع شرورة، حبونا، يدمة، بدر الجنوب، خباش، ثار ومنفذ الوديعة في كافة الظروف.',
        en: 'Full operational support for Sharurah, Habouna, Yadmah, Badr Al-Janoub, and Al-Wadiah border outpost.',
        fr: 'Appui opérationnel pour Sharurah, Habouna, Yadmah, Badr Al-Janoub et le poste frontière d\'Al-Wadiah.',
      },
    },
    coveredBranches: {
      ar: 'فرع شرورة، حبونا، يدمة، بدر الجنوب، خباش، ثار، منفذ الوديعة، سد وادي نجران، حقول آبار الشلالة وحمى',
      en: 'Sharurah Branch, Habouna, Yadmah, Badr Al-Janoub, Khubash, Thar, Al-Wadiah border post, Wadi Najran Dam, Shallalah & Hima wellfields',
      fr: 'Branche de Sharurah, Habouna, Yadmah, Badr Al-Janoub, Khubash, Thar, poste d\'Al-Wadiah, barrage de Najran',
    },
    technicalSpecs: [
      { ar: 'مركبة دفع رباعي معززة للأراضي الصحراوية المفتوحة ودرجات الحرارة المرتفعة', en: 'Heavy-duty 4WD vehicle conditioned for desert terrain and extreme thermal fluctuations', fr: 'Véhicule 4x4 tropicalisé adapté aux chaleurs extrêmes et aux pistes désertiques' },
      { ar: 'منظومة طاقة هجينة وتبريد فائق الكفاءة يحافظ على العينات المعقمة في الصحراء', en: 'Hybrid generator-battery power system maintaining sterile cold-chain storage in desert heat', fr: 'Système d\'alimentation hybride garantissant la chaîne du froid stérile en milieu désertique' },
      { ar: 'منضدة عمل معملية مصنعة من مواد مقاومة للأحماض والمواد الكيميائية الفورية', en: 'Acid-resistant lab benchtop engineered for harsh chemical and biological field testing', fr: 'Plan de travail en résine résistante aux acides et réactifs chimiques' },
      { ar: 'محطة ربط فضائي فوري لإرسال نتائج التحاليل مباشرة للمركز الوطني لجودة المياه', en: 'Direct satellite uplink transmitting field analysis results to the national water quality center', fr: 'Liaison satellite directe transmettant les analyses au centre national de qualité de l\'eau' },
    ],
    equipment: [
      { ar: 'مقياس الطيف الضوئي الميداني المحمول (Field Spectrophotometer)', en: 'Field spectrophotometer for comprehensive chemical parameters', fr: 'Spectrophotomètre de terrain pour paramètres chimiques' },
      { ar: 'مقياس العكارة الرقمي عالي الدقة (Digital Turbidimeter)', en: 'High-precision digital turbidimeter with sealed calibration standards', fr: 'Turbidimètre numérique de haute précision' },
      { ar: 'أجهزة قياس الرقم الهيدروجيني والتوصيل الكهربائي المركبة (pH / EC Meter)', en: 'Combined digital pH and conductivity meter with temperature compensation', fr: 'pH-mètre et conductimètre combinés avec compensation thermique' },
      { ar: 'حقيبة متكاملة للفحص الميكروبيولوجي السريع للكشف عن بكتيريا القولونيات', en: 'Comprehensive microbiological test kit for coliform detection in remote wells', fr: 'Kit microbiologique complet pour la détection des coliformes' },
    ],
    images: [
      {
        id: 'najran-img-1',
        role: 'equipment',
        roleTitle: {
          ar: 'صورة حقيقية: لوحة تصنيف المخاطر الكيميائية (NFPA)',
          en: 'Real Photo: Chemical Hazard Classification Chart (NFPA)',
          fr: 'Photo réelle : Tableau de classification des risques chimiques (NFPA)',
        },
        image: najranRealDoorsImg,
        caption: {
          ar: 'صورة حقيقية من داخل المختبر توضح لوحة تصنيف وتحديد المخاطر الكيميائية ومعايير السلامة المهنية (NFPA 704) لحماية الفنيين أثناء التعامل مع المواد والكواشف.',
          en: 'Real photograph from inside the laboratory showing the NFPA 704 chemical hazard identification chart and occupational safety protocols for handling reagents.',
          fr: 'Photographie réelle de l’intérieur du laboratoire illustrant le tableau de classification des risques chimiques (NFPA 704) et les règles de sécurité relatives aux réactifs.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-2',
        role: 'workbench',
        roleTitle: {
          ar: 'صورة حقيقية: لوحة الجداول والإرشادات الفنية المخبرية',
          en: 'Real Photo: Laboratory Technical Reference Chart',
          fr: 'Photo réelle : Tableau d’instructions et références de laboratoire',
        },
        image: najranRealSideImg,
        caption: {
          ar: 'صورة حقيقية من داخل المعمل توضح لوحة التعليمات الفنية والجداول المرجعية لضبط جودة الفحوصات والتحاليل المخبرية.',
          en: 'Real photograph from the laboratory showing technical instructions and analytical reference tables for testing quality control.',
          fr: 'Photographie réelle du laboratoire montrant le panneau d’instructions techniques et les tables d’analyse pour le contrôle qualité.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-3',
        role: 'workbench',
        roleTitle: {
          ar: 'صورة حقيقية: منضدة التحاليل المخبرية والأدوات الزجاجية',
          en: 'Real Photo: Analytical Workbench & Calibrated Glassware',
          fr: 'Photo réelle : Paillasse d’analyse et verrerie étalonnée',
        },
        image: najranRealBenchImg,
        caption: {
          ar: 'صورة حقيقية لمنضدة التحليل داخل المختبر مجهزة بالأدوات الزجاجية المعايرة ومحاليل الفحص لمراقبة جودة المياه.',
          en: 'Real photograph of the analytical workbench inside the laboratory equipped with calibrated glassware and testing solutions for water quality verification.',
          fr: 'Photographie réelle de la paillasse d’analyse équipée de verrerie étalonnée et de solutions de contrôle de la qualité de l’eau.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-4',
        role: 'interior',
        roleTitle: {
          ar: 'صورة حقيقية: أخصائي المختبر أثناء فحص العينات',
          en: 'Real Photo: Certified Chemist Conducting Tests',
          fr: 'Photo réelle : Chimiste certifié effectuant les analyses',
        },
        image: najranRealTechImg,
        caption: {
          ar: 'صورة حقيقية توثق عمل أخصائي المختبر أثناء فحص عينات المياه وتطبيق بروتوكولات الفحص المعتمدة.',
          en: 'Real photograph showing certified laboratory technician performing water sample testing in accordance with standard testing protocols.',
          fr: 'Photographie réelle montrant un technicien qualifié effectuant des analyses sur des échantillons d’eau selon les protocoles établis.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-5',
        role: 'equipment',
        roleTitle: {
          ar: 'صورة حقيقية: لوحة مهمات الوقاية الشخصية والسلامة (PPE)',
          en: 'Real Photo: Personal Protective Equipment (PPE) Safety Poster',
          fr: 'Photo réelle : Affiche de sécurité des équipements de protection (EPI)',
        },
        image: najranRealKitsImg,
        caption: {
          ar: 'صورة حقيقية لملصق السلامة المهنية داخل المختبر يوضح التزام الكادر بارتداء مهمات الوقاية الشخصية (نظارات واقية، قفازات، معطف المختبر).',
          en: 'Real photograph of the laboratory occupational safety poster displaying mandatory Personal Protective Equipment protocols (goggles, gloves, lab coat).',
          fr: 'Photographie réelle de l’affiche de sécurité au laboratoire rappelant le port obligatoire des équipements de protection individuelle (lunettes, gants, blouse).',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-6',
        role: 'sampling',
        roleTitle: {
          ar: 'صورة حقيقية: الجدول الدوري للعناصر الكيميائية بالمعمل',
          en: 'Real Photo: Periodic Table of the Elements in Laboratory',
          fr: 'Photo réelle : Tableau périodique des éléments au laboratoire',
        },
        image: najranRealPurityImg,
        caption: {
          ar: 'صورة حقيقية للجدول الدوري للعناصر الكيميائية المعروض في معمل التحاليل كمرجع علمي معتمد لفحوصات العناصر والمعادن بمياه الشرب.',
          en: 'Real photograph of the Periodic Table of the Elements displayed in the laboratory as an authoritative scientific reference for elemental water testing.',
          fr: 'Photographie réelle du tableau périodique des éléments affiché au laboratoire comme référence scientifique pour le dosage des minéraux de l’eau.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
      {
        id: 'najran-img-7',
        role: 'exterior',
        roleTitle: {
          ar: 'مركبة المختبر المركزي المتنقل بنجران',
          en: 'Najran Central Mobile Laboratory Vehicle',
          fr: 'Véhicule du laboratoire mobile central de Najran',
        },
        image: najranVanImg,
        caption: {
          ar: 'مركبة المختبر المتنقل لمختبر نجران المركزي بكامل التجهيزات الميدانية وأنظمة الفحص المتنقلة وهوية شركة المياه الوطنية.',
          en: 'Najran Central Mobile Laboratory vehicle equipped with on-site testing systems and official National Water Company livery.',
          fr: 'Véhicule du laboratoire mobile central de Najran doté de systèmes d’analyse sur site et de la livrée officielle de la National Water Company.',
        },
        isRealPhoto: true,
        isTechnicalReference: true,
        statusBadge: { ar: 'صورة حقيقية موثقة (المرجع الفني)', en: 'Certified Real Photo (Technical Benchmark)', fr: 'Photo réelle certifiée (Référence technique)' },
      },
    ],
  },
};
