import {
  FlaskConical,
  Beaker,
  Droplets,
  Microscope,
  TestTube,
  ShieldCheck,
  Gauge,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { Lang } from '@/lib/i18n';

export interface LocalizedString {
  ar: string;
  en: string;
  fr: string;
}

export interface ServiceItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: LocalizedString;
  description: LocalizedString;
}

export const services: ServiceItem[] = [
  {
    id: 'water-quality',
    icon: Droplets,
    title: {
      ar: 'تحليل جودة المياه',
      en: 'Water Quality Analysis',
      fr: 'Analyse de la qualité de l\'eau',
    },
    description: {
      ar: 'فحص شامل لجودة مياه الشرب والاستخدام المنزلي والصناعي وفق المعايير المعتمدة.',
      en: 'Comprehensive testing for drinking, domestic, and industrial water quality according to certified standards.',
      fr: 'Contrôle complet de la qualité de l\'eau potable, domestique et industrielle selon les normes certifiées.',
    },
  },
  {
    id: 'chemical',
    icon: FlaskConical,
    title: {
      ar: 'الفحوصات الكيميائية',
      en: 'Chemical Testing',
      fr: 'Analyses chimiques',
    },
    description: {
      ar: 'تحليل العناصر الكيميائية والمعادن الثقيلة والمركبات في عينات المياه.',
      en: 'Analysis of chemical elements, heavy metals, and compounds in water samples.',
      fr: 'Analyse des éléments chimiques, métaux lourds et composés dans les échantillons d\'eau.',
    },
  },
  {
    id: 'physical',
    icon: Gauge,
    title: {
      ar: 'الفحوصات الفيزيائية',
      en: 'Physical Testing',
      fr: 'Analyses physiques',
    },
    description: {
      ar: 'قياس الخصائص الفيزيائية للمياه من حيث درجة الحرارة والعكارة والناقلية.',
      en: 'Measurement of physical properties of water, including temperature, turbidity, and conductivity.',
      fr: 'Mesure des propriétés physiques de l\'eau, notamment la température, la turbidité et la conductivité.',
    },
  },
  {
    id: 'microbiological',
    icon: Microscope,
    title: {
      ar: 'الفحوصات الميكروبيولوجية',
      en: 'Microbiological Testing',
      fr: 'Analyses microbiologiques',
    },
    description: {
      ar: 'كشف البكتيريا والكائنات الدقيقة والتحاليل البيولوجية لضمان سلامة المياه.',
      en: 'Detection of bacteria, microorganisms, and biological analysis to ensure water safety.',
      fr: 'Détection des bactéries, micro-organismes et analyses biologiques pour garantir la sécurité de l\'eau.',
    },
  },
  {
    id: 'sampling',
    icon: TestTube,
    title: {
      ar: 'تحليل العينات',
      en: 'Sample Analysis',
      fr: 'Analyse d\'échantillons',
    },
    description: {
      ar: 'استقبال وتحضير وتحليل العينات المخبرية وفق بروتوكولات الجودة المعتمدة.',
      en: 'Receiving, preparing, and analyzing laboratory samples in accordance with approved quality protocols.',
      fr: 'Réception, préparation et analyse d\'échantillons de laboratoire selon des protocoles de qualité approuvés.',
    },
  },
  {
    id: 'monitoring',
    icon: ShieldCheck,
    title: {
      ar: 'مراقبة جودة المياه',
      en: 'Water Quality Monitoring',
      fr: 'Surveillance de la qualité de l\'eau',
    },
    description: {
      ar: 'برامج مراقبة مستمرة لمؤشرات جودة المياه في المصادر والشبكات.',
      en: 'Continuous monitoring programs for water quality indicators in sources and networks.',
      fr: 'Programmes de surveillance continue des indicateurs de qualité de l\'eau dans les sources et les réseaux.',
    },
  },
  {
    id: 'specialized',
    icon: Beaker,
    title: {
      ar: 'الخدمات المخبرية المتخصصة',
      en: 'Specialized Laboratory Services',
      fr: 'Services de laboratoire spécialisés',
    },
    description: {
      ar: 'تحاليل متخصصة حسب طلب الجهات والمؤسسات لتقييم جودة المياه.',
      en: 'Specialized analysis requested by entities and institutions to evaluate water quality.',
      fr: 'Analyses spécialisées à la demande des organismes et institutions pour évaluer la qualité de l\'eau.',
    },
  },
];

export interface NewsItem {
  id: string;
  category: LocalizedString;
  date: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 'news-1',
    category: {
      ar: 'إعلان',
      en: 'Announcement',
      fr: 'Annonce',
    },
    date: '2026-09-10',
    title: {
      ar: 'انطلاق خدمات التسجيل الإلكتروني للزوار',
      en: 'Launch of Online Visitor Registration Services',
      fr: 'Lancement du service d\'enregistrement en ligne des visiteurs',
    },
    description: {
      ar: 'أعلنت مختبرات المياه عن إطلاق خدمة التسجيل الإلكتروني للزوار، لتسهيل عملية حجز المواعيد وتسجيل الزيارات.',
      en: 'Water Laboratories announced the launch of an online visitor registration service to facilitate appointment booking and visit registration.',
      fr: 'Les Laboratoires de l\'Eau ont annoncé le lancement du service d\'enregistrement en ligne des visiteurs afin de faciliter la prise de rendez-vous.',
    },
    image: '',
  },
  {
    id: 'news-2',
    category: {
      ar: 'تحديث',
      en: 'Update',
      fr: 'Mise à jour',
    },
    date: '2026-08-28',
    title: {
      ar: 'تطوير منظومة الفحوصات المخبرية',
      en: 'Upgrading the Laboratory Testing System',
      fr: 'Modernisation du système d\'analyses en laboratoire',
    },
    description: {
      ar: 'تواصل مختبرات المياه تطوير منظومتها المخبرية بإضافة أحدث الأجهزة والتقنيات لضمان دقة النتائج.',
      en: 'Water Laboratories continues to upgrade its lab system by adding state-of-the-art equipment to ensure accuracy.',
      fr: 'Les Laboratoires de l\'Eau continuent de moderniser leurs équipements pour garantir une précision maximale des résultats.',
    },
    image: '',
  },
  {
    id: 'news-3',
    category: {
      ar: 'فعالية',
      en: 'Event',
      fr: 'Événement',
    },
    date: '2026-08-15',
    title: {
      ar: 'ورشة عمل حول جودة المياه',
      en: 'Workshop on Water Quality',
      fr: 'Atelier sur la qualité de l\'eau',
    },
    description: {
      ar: 'نظمت مختبرات المياه ورشة عمل توعوية حول أهمية مراقبة جودة المياه وطرق الفحص المخبري.',
      en: 'Water Laboratories organized an awareness workshop on the importance of water quality monitoring and testing methods.',
      fr: 'Les Laboratoires de l\'Eau ont organisé un atelier de sensibilisation sur l\'importance de la surveillance de la qualité de l\'eau.',
    },
    image: '',
  },
];

export interface SiteStats {
  labTests: string;
  samples: string;
  centralCenters: string;
  branches: string;
}

export const siteStats: SiteStats = {
  labTests: '+XX',
  samples: '+XX',
  centralCenters: '5',
  branches: '5',
};

export interface ContactConfig {
  phone: string;
  email: string;
  address: LocalizedString;
  workingHours: LocalizedString;
}

export const contactConfig: ContactConfig = {
  phone: '[رقم التواصل]',
  email: '[البريد الإلكتروني]',
  address: {
    ar: '[العنوان - المملكة العربية السعودية]',
    en: '[Address - Kingdom of Saudi Arabia]',
    fr: '[Adresse - Royaume d\'Arabie Saoudite]',
  },
  workingHours: {
    ar: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
    fr: 'Dimanche - Jeudi : 8h00 - 16h00',
  },
};

// Exemple de fonction utilitaire pour extraire la bonne chaîne selon la langue active dans vos composants React :
export function getLocalizedText(text: LocalizedString, lang: Lang): string {
  return text[lang] || text.ar || '';
}