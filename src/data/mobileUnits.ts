import { siteMedia } from '@/data/siteMedia';

export interface MobileUnitSpec {
  ar: string;
  en: string;
  fr: string;
}

export interface MobileUnitData {
  id: string;
  anchorId: string; // The exact anchor: mobile-najran, mobile-asir, mobile-baha, mobile-jazan
  aliasAnchorIds?: string[]; // Branch anchor aliases: mobile-sharurah, mobile-bisha, mobile-muhayil, mobile-qalwa, mobile-al-darb, mobile-farasan
  name: { ar: string; en: string; fr: string };
  region: { ar: string; en: string; fr: string };
  categoryBadge: { ar: string; en: string; fr: string };
  centralLabBadge: { ar: string; en: string; fr: string };
  image: string;
  isRealPhoto: boolean;
  realPhotoLabel?: { ar: string; en: string; fr: string };
  vehicleLabel: {
    clusterAr: string;
    clusterEn: string;
    labAr: string;
    labEn: string;
    badgeAr: string;
    badgeEn: string;
  };
  environment: { ar: string; en: string; fr: string };
  coverage: { ar: string; en: string; fr: string };
  coveredBranches: { ar: string; en: string; fr: string };
  keyMission: { ar: string; en: string; fr: string };
  specs: MobileUnitSpec[];
  equipment: MobileUnitSpec[];
  parentRegionId: 'asir' | 'baha' | 'jazan' | 'najran';
}

export const ALL_MOBILE_UNITS: MobileUnitData[] = [
  // 1. NAJRAN CENTRAL LABORATORY MOBILE UNIT
  {
    id: 'najran-central',
    anchorId: 'mobile-najran',
    aliasAnchorIds: ['mobile-sharurah'],
    name: {
      ar: 'المختبر المتنقل لمختبر نجران المركزي',
      en: 'Najran Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central de Najran',
    },
    region: { ar: 'منطقة نجران', en: 'Najran Region', fr: 'Région de Najran' },
    categoryBadge: { ar: 'الوحدة المرجعية الرسمية', en: 'Official Reference Unit', fr: 'Unité de Référence Officielle' },
    centralLabBadge: {
      ar: 'تابعة لمختبر نجران المركزي',
      en: 'Attached to Najran Central Laboratory',
      fr: 'Rattachée au Laboratoire Central de Najran',
    },
    image: siteMedia.mobileLaboratories.najran,
    isRealPhoto: true,
    realPhotoLabel: {
      ar: 'صور حقيقية للوحدة المتنقلة لمختبر نجران المركزي',
      en: 'Real photographs of the Najran Mobile Laboratory Unit',
      fr: 'Photographies réelles de l’unité mobile du laboratoire central de Najran',
    },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر نجران المركزي',
      labEn: 'Najran Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'أودية وسهول نجران المفتوحة، البيئات الصحراوية المحاذية للربع الخالي، وحقول آبار مياه الشرب الجوفية العميقة على امتداد القطاع الجنوبي.',
      en: 'Najran alluvial valleys, expansive arid border plains, Empty Quarter margins, and deep sandstone aquifer wellfield corridors.',
      fr: 'Oasis et vallées alluviales de Najran, plaines désertiques en bordure du Quart Vide et forages hydrogéologiques profonds.',
    },
    coverage: {
      ar: 'مدينة نجران، محافظة شرورة، حبونا، بدر الجنوب، يدمة، خباش، ثار، منفذ الوديعة، ومحطات تنقية آبار مياه الشرب.',
      en: 'Najran City, Sharurah governorate, Habouna, Badr Al-Janub, Yadmah, Khubash, Thar, Al-Wadiah border corridor, and well purification plants.',
      fr: 'Ville de Najran, gouvernorat de Sharurah, Habouna, Badr Al-Janoub, Yadmah, Khubash, Thar, frontière d\'Al-Wadiah et usines de potabilisation.',
    },
    coveredBranches: {
      ar: 'تغطي المركز الرئيسي بنجران، فرع شرورة، ومنفذ الوديعة الحدودي وكافة حقول الآبار التابعة.',
      en: 'Servicing Najran Headquarters, Sharurah Branch, Al-Wadiah border crossing, and deep aquifer wellfields.',
      fr: 'Desserte du siège de Najran, de la branche de Sharurah, du poste frontalier d\'Al-Wadiah et des forages.',
    },
    keyMission: {
      ar: 'الفحص الميداني الفوري لمصادر مياه الآبار الجوفية، مراقبة شبكات التوزيع ومحطات الضخ، والتحقق المباشر من مطابقة عينات المياه للمواصفات القياسية السعودية SASO.',
      en: 'Direct in-situ potability testing of deep aquifer wellheads, monitoring distribution networks, and instant SASO compliance verification.',
      fr: 'Contrôle immédiat sur site de la potabilité des forages profonds, suivi des réseaux et certification instantanée SASO.',
    },
    specs: [
      { ar: 'مركبة فيات دوكاتو مجهزة رسمياً ومزودة بالهوية المؤسسية لمختبرات مياه الشرب', en: 'Official Fiat Ducato mobile unit with full Southern Sector water laboratory livery', fr: 'Véhicule officiel Fiat Ducato aménagé avec livrée des laboratoires du Secteur Sud' },
      { ar: 'مقاعد عمل داخلية متكاملة من الفولاذ المقاوم للصدأ 316L وأحواض غسيل معقمة', en: 'Full chemical-resistant 316L stainless steel casework and sterile wash sinks', fr: 'Paillasses en inox 316L résistant aux produits chimiques et évier stérile' },
      { ar: 'منظومة تبريد وتخزين معتمدة لحفظ العينات والكواشف الحساسة (+4°C)', en: 'Dual temperature-logged cold chain sample preservation chamber (+4°C)', fr: 'Système certifié de maintien de la chaîne du froid pour échantillons (+4°C)' },
      { ar: 'طاقم كيميائي وبيولوجي وطني معتمد لإجراء التحاليل الميدانية الفورية', en: 'Crew of certified senior national chemists and microbiologists for field audits', fr: 'Équipage de chimistes et microbiologistes certifiés pour audits de terrain' },
    ],
    equipment: [
      { ar: 'جهاز القياس الطيفي الضوئي المحمول لمعايرة العناصر الكيميائية (Spectrophotometer)', en: 'Multi-parameter portable field spectrophotometer for ion calibration', fr: 'Spectrophotomètre portable pour analyse chimique multi-paramètres' },
      { ar: 'جهاز رقمي معتمد لقياس العكارة فائق الدقة (Turbidimeter NTU)', en: 'High-precision certified nephelometric turbidimeter', fr: 'Turbidimètre néphélométrique certifié de haute précision' },
      { ar: 'حقيبة قياس الرقم الهيدروجيني (pH)، التوصيلية الكهربائية، والكلور المتبقي', en: 'Electrochemistry analytical kit for pH, conductivity, and free/total chlorine', fr: 'Kit combiné pH-mètre, conductimètre et chlore résiduel libre/total' },
      { ar: 'حاضنة ميكروبيولوجية معقمة مدمجة للكشف الجرثومي السريع والقولونيات', en: 'Compact sterile onboard incubator for fast coliform and bacteriological screening', fr: 'Incubateur microbiologique stérile pour dépistage bactérien rapide' },
    ],
    parentRegionId: 'najran',
  },

  // 2. ASIR CENTRAL LABORATORY MOBILE UNIT
  {
    id: 'asir-central',
    anchorId: 'mobile-asir',
    aliasAnchorIds: ['mobile-bisha', 'mobile-muhayil'],
    name: {
      ar: 'المختبر المتنقل لمختبر عسير المركزي',
      en: 'Asir Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central d\'Asir',
    },
    region: { ar: 'منطقة عسير', en: 'Asir Region', fr: 'Région d\'Asir' },
    categoryBadge: { ar: 'وحدة المرتفعات الجبلية والسدود', en: 'Highland Mountain & Dams Unit', fr: 'Unité des Hauts Plateaux et Barrages' },
    centralLabBadge: {
      ar: 'تابعة لمختبر عسير المركزي',
      en: 'Attached to Asir Central Laboratory',
      fr: 'Rattachée au Laboratoire Central d\'Asir',
    },
    image: siteMedia.mobileLaboratories.asir,
    isRealPhoto: false,
    realPhotoLabel: {
      ar: 'تصور توضيحي للمختبر المتنقل لمختبر عسير المركزي',
      en: 'Illustrative visualization of Asir Central Laboratory Mobile Unit',
      fr: 'Visualisation illustrative de l\'unité mobile du laboratoire central d\'Asir',
    },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر عسير المركزي',
      labEn: 'Asir Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'المرتفعات الصخرية الجبلية الشاهقة، السدود المائية الكبرى، الجروف الصخرية، وممرات الأودية الجبلية وسهول تهامة عسير.',
      en: 'High-altitude rocky ridges, major dam reservoirs, steep granite escarpments, mountain passes, and Tihama foothills.',
      fr: 'Massifs montagneux escarpés, grands barrages hydrographiques, défilés rocheux de la Sarate et contreforts de Tihama.',
    },
    coverage: {
      ar: 'أبها، خميس مشيط، محافظة بيشة، محافظة محايل عسير، أحد رفيدة، النماص، تنومة، رجال ألمع، سراة عبيدة، ظهران الجنوب، وسدود عسير الكبرى.',
      en: 'Abha, Khamis Mushait, Bisha governorate, Muhayil Asir governorate, Ahad Rafidah, Al-Namas, Tanomah, Rijal Almaa, Sarat Abidah, Dhahran Al-Janub, and Asir dams.',
      fr: 'Abha, Khamis Mushait, gouvernorats de Bisha et Muhayil Asir, Ahad Rafidah, Al-Namas, Tanomah, Rijal Almaa, Sarat Abidah et barrages d\'Asir.',
    },
    coveredBranches: {
      ar: 'تغطي المركز الرئيسي بأبها وخميس مشيط، فرع بيشة وسد الملك فهد، وفرع محايل عسير وتهامة.',
      en: 'Servicing Abha/Khamis Central Hub, Bisha Branch (King Fahd Dam), and Muhayil Asir Branch.',
      fr: 'Desserte du pôle central d\'Abha/Khamis, de la branche de Bisha (Barrage Roi Fahd) et de la branche de Muhayil Asir.',
    },
    keyMission: {
      ar: 'الفحص الميداني لمياه بحيرات السدود ومحطات الضخ على السفوح الجبلية، مراقبة شبكات القرى السياحية، والاستجابة الفورية لحالات الأمطار والسيول.',
      en: 'Direct testing of reservoir dam waters, mountain pumping lifts, tourist village networks, and flash flood emergency response.',
      fr: 'Contrôle des retenues de barrages, stations de pompage de montagne, réseaux touristiques et veille crue.',
    },
    specs: [
      { ar: 'هيكل مخصص للدفع الرباعي والمنحدرات الجبلية الوعرة والمنعطفات الحادة', en: 'All-wheel drive laboratory platform engineered for steep mountain gradients', fr: 'Châssis 4x4 tout-terrain optimisé pour fortes déclivités et lacets de montagne' },
      { ar: 'محطة طاقة هجينة ببطاريات ليثيوم 24 ساعة ونظام شحن ذكي من محرك المركبة', en: 'Hybrid silent power station with 24h lithium-ion capacity and alternator charging', fr: 'Station d\'énergie hybride lithium 24h et recharge alternateur renforcé' },
      { ar: 'تكييف حراري مزدوج لحماية الكواشف ومقاييس الطيف من البرودة والحرارة', en: 'Dual precision climate control shielding reagents and spectrophotometers', fr: 'Double climatisation régulée protégeant réactifs et spectrophotomètres' },
      { ar: 'نظام تثبيت وتوازن هيدروليكي للمركبة لضمان دقة الأوزان والأجهزة المعملية', en: 'Hydraulic stabilization system ensuring level surface for analytical balances', fr: 'Stabilisateurs hydrauliques assurant la planéité des balances analytiques' },
    ],
    equipment: [
      { ar: 'مقياس الطيف الضوئي المحمول متعدد المؤشرات لفحص مياه السدود والشبكات', en: 'Multi-parameter portable spectrophotometer for surface water and network testing', fr: 'Spectrophotomètre portable multi-paramètres pour eaux de surface et réseaux' },
      { ar: 'جهاز رقمي معتمد لقياس العكارة (Turbidimeter NTU) لمراقبة مياه الأمطار', en: 'Certified digital nephelometric turbidimeter for runoff turbidity analysis', fr: 'Turbidimètre néphélométrique numérique pour suivi des eaux de ruissellement' },
      { ar: 'حقيبة قياس الرقم الهيدروجيني pH، التوصيلية EC، والأكسجين الذائب DO', en: 'Electrochemical suite measuring pH, electrical conductivity, and dissolved oxygen', fr: 'Valise électrochimique pH, conductivité et oxygène dissous' },
      { ar: 'حاضنة ميكروبيولوجية معقمة مدمجة مع جهاز قراءة الفلورسنت للأشعة فوق البنفسجية', en: 'Compact sterile incubator with UV fluorescence reader for rapid E. coli detection', fr: 'Incubateur stérile avec lecture fluorométrique UV pour confirmation rapide d\'E. coli' },
    ],
    parentRegionId: 'asir',
  },

  // 3. AL-BAHA CENTRAL LABORATORY MOBILE UNIT
  {
    id: 'baha-central',
    anchorId: 'mobile-baha',
    aliasAnchorIds: ['mobile-qalwa'],
    name: {
      ar: 'المختبر المتنقل لمختبر الباحة المركزي',
      en: 'Al-Baha Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central d\'Al-Baha',
    },
    region: { ar: 'منطقة الباحة', en: 'Al-Baha Region', fr: 'Région d\'Al-Baha' },
    categoryBadge: { ar: 'وحدة جبال السراة وتهامة', en: 'Sarat Mountain & Tihama Unit', fr: 'Unité de la Sarate et Tihama' },
    centralLabBadge: {
      ar: 'تابعة لمختبر الباحة المركزي',
      en: 'Attached to Al-Baha Central Laboratory',
      fr: 'Rattachée au Laboratoire Central d\'Al-Baha',
    },
    image: siteMedia.mobileLaboratories.baha,
    isRealPhoto: false,
    realPhotoLabel: {
      ar: 'تصور توضيحي للمختبر المتنقل لمختبر الباحة المركزي',
      en: 'Illustrative visualization of Al-Baha Central Laboratory Mobile Unit',
      fr: 'Visualisation illustrative de l\'unité mobile du laboratoire central d\'Al-Baha',
    },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر الباحة المركزي',
      labEn: 'Al-Baha Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'مرتفعات جبال السراة الصخرية، عقبات الباحة الوعرة (عقبة الباحة وعقبة حزنة)، سهول تهامة الباحة، وبحيرات السدود الجبلية.',
      en: 'Granite Sarat mountain peaks, precipitous mountain pass descents, Tihama Al-Baha plains, and mountain dam reservoirs.',
      fr: 'Hauts sommets granitiques de la Sarate, descentes abruptes des cols d\'Aqabah, plaines de Tihama et barrages d\'altitude.',
    },
    coverage: {
      ar: 'مدينة الباحة، بلجرشي، المندق، العقيق، محافظة قلوة، المخواة، الحجرة، غامد الزناد، بني حسن، ومحطات سدود عردة والعقيق وثريبان.',
      en: 'Al-Baha City, Baljurashi, Al-Mandaq, Al-Aqiq, Qalwah governorate, Al-Mikhwah, Al-Hajrah, Ghamid Al-Zinad, Bani Hassan, and dam treatment plants.',
      fr: 'Ville d\'Al-Baha, Baljurachi, Al-Mandaq, Al-Aqiq, gouvernorat de Qalwah, Al-Mikhwah, Al-Hajrah, Ghamid Al-Zinad et usines de barrages.',
    },
    coveredBranches: {
      ar: 'تغطي المركز الرئيسي بالباحة والسراة، وفرع قلوة والمخواة وقطاع تهامة بالكامل.',
      en: 'Servicing Al-Baha Sarat Headquarters and Qalwah & Tihama Branch across all lowland corridors.',
      fr: 'Desserte du siège d\'Al-Baha/Sarate et de la branche de Qalwah & Tihama.',
    },
    keyMission: {
      ar: 'مراقبة جودة مياه الشرب بمحطات التنقية والسدود الجبلية، فحص شبكات الإمداد بالمواقع السياحية ومواسم الاصطياف، وسحب العينات المعتمدة.',
      en: 'Water quality audits at mountain dam plants, summer resort distribution monitoring, and certified sampling.',
      fr: 'Contrôle des stations de barrages de montagne, surveillance des réseaux de villégiature estivale et prélèvements.',
    },
    specs: [
      { ar: 'هيكل ميكانيكي معزز مع فرامل مساعدة للمنحدرات الجبلية الشديدة', en: 'Reinforced mechanical chassis with auxiliary braking for steep mountain descents', fr: 'Châssis mécanique renforcé avec freinage auxiliaire pour fortes descentes' },
      { ar: 'مقاعد عمل داخلية متكاملة مقاومة للمواد الكيميائية ومصنوعة من الإينوكس', en: 'Integrated chemical-resistant 316L stainless steel casework and wash station', fr: 'Mobilier inox 316L étanche et résistant aux réactifs chimiques de laboratoire' },
      { ar: 'ثلاجة عينات مدمجة مع نظام توثيق رقمي مستمر لدرجات الحرارة (+4°C)', en: 'Onboard sample refrigerator with continuous digital temperature recording (+4°C)', fr: 'Réfrigérateur d\'échantillons avec traçabilité thermique continue (+4°C)' },
      { ar: 'منصة استقرار هيدروليكية لضمان اتزان الأجهزة الدقيقة أثناء الفحص', en: 'Hydraulic leveling pads ensuring benchtop stability on inclined terrain', fr: 'Vérins de nivellement hydrauliques assurant la stabilité sur sols inclinés' },
    ],
    equipment: [
      { ar: 'مقياس الطيف الضوئي الميداني المباشر للأيونات والعناصر الكيميائية', en: 'Field spectrophotometer for direct ion and mineral calibration', fr: 'Photomètre de terrain pour étalonnage direct des ions et minéraux' },
      { ar: 'أقطاب قياس الأكسجين الذائب DO والـ pH والتوصيلية الكهربائية', en: 'Electrochemical sensor kit for dissolved oxygen, pH, and conductivity', fr: 'Kit de capteurs électrochimiques pour oxygène dissous, pH et conductivité' },
      { ar: 'جهاز قياس العكارة المحمول المعتمد لفحص مياه السدود والشبكات', en: 'Certified portable turbidimeter for reservoir and potable network verification', fr: 'Turbidimètre portable certifié pour vérification des réseaux d\'eau potable' },
      { ar: 'نظام الترشيح الغشائي المعقم المحمول للكشف عن البكتيريا القولونية', en: 'Sterile portable vacuum filtration manifold for microbiological coliform isolation', fr: 'Rampe de filtration stérile sous vide pour isolement des coliformes' },
    ],
    parentRegionId: 'baha',
  },

  // 4. JAZAN CENTRAL LABORATORY MOBILE UNIT
  {
    id: 'jazan-central',
    anchorId: 'mobile-jazan',
    aliasAnchorIds: ['mobile-al-darb', 'mobile-farasan'],
    name: {
      ar: 'المختبر المتنقل لمختبر جازان المركزي',
      en: 'Jazan Central Laboratory Mobile Unit',
      fr: 'Unité Mobile du Laboratoire Central de Jazan',
    },
    region: { ar: 'منطقة جازان', en: 'Jazan Region', fr: 'Région de Jazan' },
    categoryBadge: { ar: 'وحدة الساحل والتحلية والجزر', en: 'Coastal, Desalination & Islands Unit', fr: 'Unité Littorale, Dessalement & Îles' },
    centralLabBadge: {
      ar: 'تابعة لمختبر جازان المركزي',
      en: 'Attached to Jazan Central Laboratory',
      fr: 'Rattachée au Laboratoire Central de Jazan',
    },
    image: siteMedia.mobileLaboratories.jazan,
    isRealPhoto: false,
    realPhotoLabel: {
      ar: 'تصور توضيحي للمختبر المتنقل لمختبر جازان المركزي',
      en: 'Illustrative visualization of Jazan Central Laboratory Mobile Unit',
      fr: 'Visualisation illustrative de l\'unité mobile du laboratoire central de Jazan',
    },
    vehicleLabel: {
      clusterAr: 'إدارة مختبرات القطاع الجنوبي',
      clusterEn: 'Southern Cluster Laboratories Management',
      labAr: 'مختبر جازان المركزي',
      labEn: 'Jazan Central Laboratory',
      badgeAr: 'المختبر المتنقل',
      badgeEn: 'Mobile Laboratory',
    },
    environment: {
      ar: 'السهول الساحلية الجنوبية على البحر الأحمر، الرطوبة الملحية العالية، خطوط نقل مياه التحلية الكبرى، وسد وادي بيش وجزر فرسان.',
      en: 'Southern Red Sea coastal plains, high saline humidity, bulk desalination corridors, Baish/Jazan dam reservoirs, and Farasan archipelago.',
      fr: 'Plaines littorales de la Mer Rouge, forte humidité saline, grandes conduites d\'eau dessalée, barrages de Baish et archipel de Farasan.',
    },
    coverage: {
      ar: 'مدينة جازان، صبيا، أبو عريش، صامطة، بيش، محافظة الدرب، الشقيق، جزر فرسان، ضمد، الريث، فيفاء، العارضة، الدائر، ومحطات التحلية الساحلية.',
      en: 'Jazan City, Sabya, Abu Arish, Samtah, Baish, Al-Darb, Al-Shuqaiq, Farasan Islands, Damad, Al-Reeth, Fayfa, and coastal desalination plants.',
      fr: 'Ville de Jazan, Sabya, Abou Arich, Samtah, Baish, Al-Darb, Al-Shuqaiq, Îles Farasan, Damad, Al-Reeth, Fayfa et stations de dessalement.',
    },
    coveredBranches: {
      ar: 'تغطي المركز الرئيسي بجازان، فرع الدرب والشقيق ومحطات التحلية، وفرع جزر فرسان البحري.',
      en: 'Servicing Jazan Central Hub, Al-Darb & Al-Shuqaiq Branch (Desalination), and Farasan Islands Maritime Sector.',
      fr: 'Desserte du pôle de Jazan, de la branche d\'Al-Darb/Al-Shuqaiq et du secteur maritime des Îles Farasan.',
    },
    keyMission: {
      ar: 'المراقبة الميدانية المستمرة لجودة مياه محطات التحلية وخطوط النقل الساحلية، قياس الملوحة والتوصيلية، وفحص مياه السدود والشبكات الحضرية.',
      en: 'Real-time auditing of desalination output, coastal pipelines, salinity/TDS levels, and inland network verification.',
      fr: 'Contrôle en direct de l\'eau dessalée, des conduites côtières, de la salinité/TDS et des réseaux urbains.',
    },
    specs: [
      { ar: 'طلاء خارجي مقاوم للتآكل المالح والرطوبة الساحلية العالية (Marine Grade)', en: 'Marine-grade anti-corrosive exterior coating and hermetic thermal insulation', fr: 'Revêtement extérieur anti-corrosion marine et isolation hermétique' },
      { ar: 'نظام تكييف هواء فائق القوة للعمل بكفاءة حتى 52 درجة مئوية', en: 'Heavy-duty ambient cooling operating reliably up to 52°C ambient heat', fr: 'Climatisation renforcée opérant sans interruption jusqu\'à 52°C' },
      { ar: 'تغذية كهربائية مزدوجة مع مقبس مباشر بالمحطات ومحول طاقة نقي', en: 'Dual shore-power hookup and pure sine inverter backup system', fr: 'Alimentation double : raccordement direct sur site et onduleur régulé' },
      { ar: 'مستودع آمن ومحكم للمحاليل الحساسة لدرجات الحرارة المرتفعة', en: 'Thermally insulated lockable storage for temperature-sensitive reagents', fr: 'Compartiments sécurisés et isolés pour réactifs thermo-sensibles' },
    ],
    equipment: [
      { ar: 'جهاز قياس الملوحة والتوصيلية فائق الدقة لمياه التحلية والآبار', en: 'High-precision salinity, TDS, and electrical conductivity analyzer', fr: 'Analyseur haute précision de salinité, TDS et conductivité' },
      { ar: 'محلل الكلور الكهروكيميائي الفوري (Free & Total Chlorine)', en: 'Real-time electrochemical free and total residual chlorine meter', fr: 'Analyseur électrochimique instantané du chlore résiduel total et libre' },
      { ar: 'أقطاب قياس الأيونات الانتقائية (فلوريد، نترات، وكلوريد)', en: 'Ion-selective electrode (ISE) probe kit for fluoride, nitrate, chloride', fr: 'Électrodes spécifiques pour fluorures, nitrates et chlorures' },
      { ar: 'غرفة قراءة ميكروبيولوجية مزودة بالأشعة فوق البنفسجية (UV Cabinet)', en: 'Rapid UV fluorometric cabinet for confirmed E. coli verification', fr: 'Chambre de lecture fluorométrique UV pour confirmation rapide d\'E. coli' },
    ],
    parentRegionId: 'jazan',
  },
];
