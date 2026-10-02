import { FlaskConical, ShieldCheck, Microscope, Droplets, Waves, CheckCircle2 } from 'lucide-react';
import type { Lang } from '@/lib/i18n';
import { siteMedia } from '@/data/siteMedia';

export interface LocalizedString {
  ar: string;
  en: string;
  fr: string;
}

export const contactConfig = {
  phone: '+966 17 222 0000',
  email: 'info@southernwaterlabs.gov.sa',
  address: 'المملكة العربية السعودية - القطاع الجنوبي',
  workingHours: 'الأحد - الخميس: 7:30 صباحاً - 2:30 مساءً',
  addressI18n: {
    ar: 'المملكة العربية السعودية - القطاع الجنوبي',
    en: 'Kingdom of Saudi Arabia - Southern Sector',
    fr: 'Royaume d\'Arabie Saoudite - Secteur Sud',
  },
  workingHoursI18n: {
    ar: 'الأحد - الخميس: 7:30 صباحاً - 2:30 مساءً',
    en: 'Sunday - Thursday: 7:30 AM - 2:30 PM',
    fr: 'Dimanche - Jeudi : 7h30 - 14h30',
  },
};

export const siteStats = {
  centralCenters: '4',
  branches: '18',
  regions: '4',
  labTests: '+50,000',
  samples: '+25,000',
};

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  titleI18n: LocalizedString;
  descriptionI18n: LocalizedString;
  categoryI18n: LocalizedString;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'توسعة منظومة الفحوصات الميكروبيولوجية بمختبرات مياه المنطقة الجنوبية',
    description: 'تدشين أحدث أجهزة التحليل والتقنيات المخبرية فائقة الدقة لضمان أعلى معايير الجودة والسلامة لمياه الشرب ومطابقتها للمواصفات القياسية.',
    category: 'تطوير وتحديث',
    date: '2026-09-15',
    image: siteMedia.news.microbiology,
    titleI18n: {
      ar: 'توسعة منظومة الفحوصات الميكروبيولوجية بمختبرات مياه المنطقة الجنوبية',
      en: 'Expansion of Microbiological Testing Facilities Across Southern Laboratories',
      fr: 'Expansion du Dispositif d\'Analyses Microbiologiques dans les Laboratoires du Sud',
    },
    descriptionI18n: {
      ar: 'تدشين أحدث أجهزة التحليل والتقنيات المخبرية فائقة الدقة لضمان أعلى معايير الجودة والسلامة لمياه الشرب ومطابقتها للمواصفات القياسية.',
      en: 'Inauguration of advanced analytical equipment and high-precision testing technologies to guarantee strict drinking water safety standards.',
      fr: 'Inauguration d\'équipements d\'analyse de pointe et de technologies de haute précision pour garantir la qualité de l\'eau potable.',
    },
    categoryI18n: {
      ar: 'تطوير وتحديث',
      en: 'Development & Tech',
      fr: 'Développement & Tech',
    },
  },
  {
    id: 2,
    title: 'حصول مختبرات المياه المركزية على تجديد الاعتماد الدولي للمختبرات ISO/IEC 17025',
    description: 'تأكيداً على الالتزام بالمعايير العالمية ودقة القياس والتحاليل الكيميائية والفيزيائية المعتمدة.',
    category: 'اعتمادات وإنجازات',
    date: '2026-09-01',
    image: siteMedia.news.isoAccreditation,
    titleI18n: {
      ar: 'حصول مختبرات المياه المركزية على تجديد الاعتماد الدولي للمختبرات ISO/IEC 17025',
      en: 'Central Water Laboratories Renew ISO/IEC 17025 International Accreditation',
      fr: 'Renouvellement de l\'Accréditation Internationale ISO/IEC 17025 des Laboratoires Centraux',
    },
    descriptionI18n: {
      ar: 'تأكيداً على الالتزام بالمعايير العالمية ودقة القياس والتحاليل الكيميائية والفيزيائية المعتمدة.',
      en: 'Reaffirming strict compliance with international standards, testing precision, and certified chemical and physical analysis.',
      fr: 'Confirmation de la conformité aux normes internationales les plus exigeantes et de la précision des analyses chimiques et physiques.',
    },
    categoryI18n: {
      ar: 'اعتمادات وإنجازات',
      en: 'Accreditations',
      fr: 'Accréditations',
    },
  },
  {
    id: 3,
    title: 'تدشين تقنيات التحليل الكروماتوغرافي المتقدم للكشف عن العناصر والمعادن النزرة',
    description: 'تزويد مختبرات عسير وجازان والباحة ونجران بأحدث أنظمة قياس المعادن الثقيلة والأيونات الذائبة بدقة أجزاء في المليار (ppb).',
    category: 'تجهيزات مخبرية',
    date: '2026-08-28',
    image: siteMedia.news.chromatography,
    titleI18n: {
      ar: 'تدشين تقنيات التحليل الكروماتوغرافي المتقدم للكشف عن العناصر والمعادن النزرة',
      en: 'Deployment of Advanced Chromatography for Trace Elemental & Heavy Metal Detection',
      fr: 'Déploiement de Chromatographes Avancés pour la Détection des Métaux Lourds et Traces',
    },
    descriptionI18n: {
      ar: 'تزويد مختبرات عسير وجازان والباحة ونجران بأحدث أنظمة قياس المعادن الثقيلة والأيونات الذائبة بدقة أجزاء في المليار (ppb).',
      en: 'Equipping Central laboratories in Asir, Jazan, Al-Baha, and Najran with trace mineral analytical spectrometry down to parts-per-billion.',
      fr: 'Équipement des laboratoires d\'Asir, Jazan, Al-Baha et Najran en spectrométrie de pointe pour détecter les métaux jusqu\'au ppb.',
    },
    categoryI18n: {
      ar: 'تجهيزات مخبرية',
      en: 'Laboratory Equipment',
      fr: 'Équipements de Pointe',
    },
  },
  {
    id: 4,
    title: 'إطلاق برنامج المسح الميداني الموسع لمراقبة جودة مياه الآبار والخزانات الاستراتيجية',
    description: 'تسيير فرق مسح ميداني متنقلة مزودة بأجهزة قياس فورية لفحص ومراقبة شبكات الإمداد والخزانات العامة في القطاع الجنوبي.',
    category: 'مراقبة ميدانية',
    date: '2026-08-15',
    image: siteMedia.news.fieldSurvey,
    titleI18n: {
      ar: 'إطلاق برنامج المسح الميداني الموسع لمراقبة جودة مياه الآبار والخزانات الاستراتيجية',
      en: 'Launch of Central Field Surveillance for Well Water & Strategic Reservoirs',
      fr: 'Lancement d\'une Campagne Centrale de Contrôle des Puits et Réservoirs Stratégiques',
    },
    descriptionI18n: {
      ar: 'تسيير فرق مسح ميداني متنقلة مزودة بأجهزة قياس فورية لفحص ومراقبة شبكات الإمداد والخزانات العامة في القطاع الجنوبي.',
      en: 'Deploying mobile field teams equipped with instant monitoring instruments to inspect water distribution networks and central reservoirs.',
      fr: 'Déploiement d\'unités mobiles dotées d\'instruments de mesure instantanée pour inspecter les réseaux et réservoirs d\'eau.',
    },
    categoryI18n: {
      ar: 'مراقبة ميدانية',
      en: 'Field Surveillance',
      fr: 'Surveillance de Terrain',
    },
  },
  {
    id: 5,
    title: 'ورشة عمل متقدمة حول سلامة مياه الشرب وطرق أخذ العينات المعتمدة',
    description: 'برنامج تدريبي مكثف للكوادر الفنية والميدانية لتعزيز كفاءة إجراءات سحب وحفظ ونقل العينات وفق معايير الجودة العالمية.',
    category: 'تدريب وبناء قدرات',
    date: '2026-08-05',
    image: siteMedia.news.trainingWorkshop,
    titleI18n: {
      ar: 'ورشة عمل متقدمة حول سلامة مياه الشرب وطرق أخذ العينات المعتمدة',
      en: 'Advanced Workshop on Drinking Water Safety Protocols & Standardized Sampling',
      fr: 'Atelier Approfondi sur les Protocoles de Sécurité de l\'Eau Potable et l\'Échantillonnage',
    },
    descriptionI18n: {
      ar: 'برنامج تدريبي مكثف للكوادر الفنية والميدانية لتعزيز كفاءة إجراءات سحب وحفظ ونقل العينات وفق معايير الجودة العالمية.',
      en: 'An intensive training seminar for technical specialists on standardized sample collection, chain-of-custody, and quality assurance.',
      fr: 'Formation intensive des équipes techniques sur les protocoles certifiés de prélèvement, transport et conservation des échantillons.',
    },
    categoryI18n: {
      ar: 'تدريب وبناء قدرات',
      en: 'Workshops & Training',
      fr: 'Formations & Ateliers',
    },
  },
];

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: typeof FlaskConical;
  titleI18n: LocalizedString;
  descriptionI18n: LocalizedString;
}

export const services: ServiceItem[] = [
  {
    id: 'chemical',
    title: 'التحاليل الكيميائية والفيزيائية',
    description: 'فحص الخواص الكيميائية والفيزيائية لعينات المياه مثل الرقم الهيدروجيني والأملاح الذائبة والعكارة والعناصر الأساسية.',
    icon: FlaskConical,
    titleI18n: {
      ar: 'التحاليل الكيميائية والفيزيائية',
      en: 'Physical & Chemical Analysis',
      fr: 'Analyses Physico-Chimiques',
    },
    descriptionI18n: {
      ar: 'فحص الخواص الكيميائية والفيزيائية لعينات المياه مثل الرقم الهيدروجيني والأملاح الذائبة والعكارة والعناصر الأساسية.',
      en: 'Testing physical and chemical water properties including pH levels, total dissolved solids (TDS), turbidity, and key ionic minerals.',
      fr: 'Examen des propriétés physico-chimiques de l\'eau : potentiel hydrogène (pH), solides dissous totaux (TDS), turbidité et minéraux.',
    },
  },
  {
    id: 'microbiological',
    title: 'الفحوصات الميكروبيولوجية والجرثومية',
    description: 'الكشف عن الملوثات البكتيرية والميكروبية لضمان خلو المياه من الميكروبات ومطابقتها للمواصفات القياسية.',
    icon: Microscope,
    titleI18n: {
      ar: 'الفحوصات الميكروبيولوجية والجرثومية',
      en: 'Microbiological & Bacterial Testing',
      fr: 'Analyses Microbiologiques et Bactériologiques',
    },
    descriptionI18n: {
      ar: 'الكشف عن الملوثات البكتيرية والميكروبية لضمان خلو المياه من الميكروبات ومطابقتها للمواصفات القياسية.',
      en: 'Screening for bacterial and microbial contaminants to guarantee water is pathogen-free and meets health regulations.',
      fr: 'Dépistage des contaminants microbiens et bactériens pour garantir une eau exempte de pathogènes conforme aux normes sanitaires.',
    },
  },
  {
    id: 'quality-monitoring',
    title: 'مراقبة الجودة الدورية والامتثال',
    description: 'برامج مراقبة مستمرة لشبكات الإمداد والمحطات والخزانات للتأكد من استدامة سلامة وجودة المياه على مدار الساعة.',
    icon: ShieldCheck,
    titleI18n: {
      ar: 'مراقبة الجودة الدورية والامتثال',
      en: 'Continuous Quality Monitoring & Compliance',
      fr: 'Contrôle Qualité Continu et Conformité',
    },
    descriptionI18n: {
      ar: 'برامج مراقبة مستمرة لشبكات الإمداد والمحطات والخزانات للتأكد من استدامة سلامة وجودة المياه على مدار الساعة.',
      en: 'Ongoing monitoring surveillance programs for municipal networks, reservoirs, and stations to ensure water safety 24/7.',
      fr: 'Surveillance continue des réseaux de distribution, réservoirs et usines pour assurer la potabilité de l\'eau 24h/24.',
    },
  },
  {
    id: 'field-sampling',
    title: 'سحب العينات الميدانية المتخصصة',
    description: 'فرق ميدانية متخصصة لجمع العينات وفق بروتوكولات معتمدة لحفظ العينات وضمان دقة النتائج المخبرية.',
    icon: Droplets,
    titleI18n: {
      ar: 'سحب العينات الميدانية المتخصصة',
      en: 'Specialized Field Sampling',
      fr: 'Échantillonnage de Terrain Spécialisé',
    },
    descriptionI18n: {
      ar: 'فرق ميدانية متخصصة لجمع العينات وفق بروتوكولات معتمدة لحفظ العينات وضمان دقة النتائج المخبرية.',
      en: 'Certified field teams collecting samples following strict preservation chains of custody to ensure lab result validity.',
      fr: 'Équipes de terrain certifiées collectant les prélèvements selon des protocoles rigoureux de conservation.',
    },
  },
  {
    id: 'water-treatment',
    title: 'تقييم كفاءة محطات التنقية والمعالجة',
    description: 'متابعة مراحل التنقية والكلورة والترشيح للتأكد من الكفاءة التشغيلية لمختلف وحدات المعالجة.',
    icon: Waves,
    titleI18n: {
      ar: 'تقييم كفاءة محطات التنقية والمعالجة',
      en: 'Water Treatment Plant Efficiency Assessment',
      fr: 'Évaluation des Stations de Traitement d\'Eau',
    },
    descriptionI18n: {
      ar: 'متابعة مراحل التنقية والكلورة والترشيح للتأكد من الكفاءة التشغيلية لمختلف وحدات المعالجة.',
      en: 'Evaluating purification phases, chlorination, and filtration steps to ensure high operational plant performance.',
      fr: 'Suivi des étapes de purification, chloration et filtration pour évaluer l\'efficacité opérationnelle des installations.',
    },
  },
  {
    id: 'consultation',
    title: 'الاستشارات والتقارير الفنية المعتمدة',
    description: 'إصدار تقارير تحليلية معتمدة وتقديم استشارات فنية وحلول لمراقبة ومعالجة مشكلات جودة المياه.',
    icon: CheckCircle2,
    titleI18n: {
      ar: 'الاستشارات والتقارير الفنية المعتمدة',
      en: 'Accredited Technical Reports & Consultations',
      fr: 'Rapports Techniques Agréés & Consultations',
    },
    descriptionI18n: {
      ar: 'إصدار تقارير تحليلية معتمدة وتقديم استشارات فنية وحلول لمراقبة ومعالجة مشكلات جودة المياه.',
      en: 'Issuing accredited analytical certificates and delivering expert technical advisory for water quality management.',
      fr: 'Délivrance de certificats d\'analyses certifiés et fourniture d\'expertises techniques pour la gestion de l\'eau.',
    },
  },
];

export function getLocalizedNews(item: NewsItem, lang: Lang) {
  return {
    ...item,
    title: item.titleI18n[lang] || item.titleI18n.en || item.title,
    description: item.descriptionI18n[lang] || item.descriptionI18n.en || item.description,
    category: item.categoryI18n[lang] || item.categoryI18n.en || item.category,
  };
}

export function getLocalizedService(service: ServiceItem, lang: Lang) {
  return {
    ...service,
    title: service.titleI18n[lang] || service.titleI18n.en || service.title,
    description: service.descriptionI18n[lang] || service.descriptionI18n.en || service.description,
  };
}
