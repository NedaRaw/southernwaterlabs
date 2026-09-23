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

export interface ServiceItem {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const services: ServiceItem[] = [
  {
    id: 'water-quality',
    icon: Droplets,
    title: 'تحليل جودة المياه',
    description: 'فحص شامل لجودة مياه الشرب والاستخدام المنزلي والصناعي وفق المعايير المعتمدة.',
  },
  {
    id: 'chemical',
    icon: FlaskConical,
    title: 'الفحوصات الكيميائية',
    description: 'تحليل العناصر الكيميائية والمعادن الثقيلة والمركبات في عينات المياه.',
  },
  {
    id: 'physical',
    icon: Gauge,
    title: 'الفحوصات الفيزيائية',
    description: 'قياس الخصائص الفيزيائية للمياه من حيث درجة الحرارة والعكارة والناقلية.',
  },
  {
    id: 'microbiological',
    icon: Microscope,
    title: 'الفحوصات الميكروبيولوجية',
    description: 'كشف البكتيريا والكائنات الدقيقة والتحاليل البيولوجية لضمان سلامة المياه.',
  },
  {
    id: 'sampling',
    icon: TestTube,
    title: 'تحليل العينات',
    description: 'استقبال وتحضير وتحليل العينات المخبرية وفق بروتوكولات الجودة المعتمدة.',
  },
  {
    id: 'monitoring',
    icon: ShieldCheck,
    title: 'مراقبة جودة المياه',
    description: 'برامج مراقبة مستمرة لمؤشرات جودة المياه في المصادر والشبكات.',
  },
  {
    id: 'specialized',
    icon: Beaker,
    title: 'الخدمات المخبرية المتخصصة',
    description: 'تحاليل متخصصة حسب طلب الجهات والمؤسسات لتقييم جودة المياه.',
  },
];

export interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 'news-1',
    category: 'إعلان',
    date: '2026-09-10',
    title: 'انطلاق خدمات التسجيل الإلكتروني للزوار',
    description: 'أعلنت مختبرات المياه عن إطلاق خدمة التسجيل الإلكتروني للزوار، لتسهيل عملية حجز المواعيد وتسجيل الزيارات.',
    image: '',
  },
  {
    id: 'news-2',
    category: 'تحديث',
    date: '2026-08-28',
    title: 'تطوير منظومة الفحوصات المخبرية',
    description: 'تواصل مختبرات المياه تطوير منظومتها المخبرية بإضافة أحدث الأجهزة والتقنيات لضمان دقة النتائج.',
    image: '',
  },
  {
    id: 'news-3',
    category: 'فعالية',
    date: '2026-08-15',
    title: 'ورشة عمل حول جودة المياه',
    description: 'نظمت مختبرات المياه ورشة عمل توعوية حول أهمية مراقبة جودة المياه وطرق الفحص المخبري.',
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
  address: string;
  workingHours: string;
}

export const contactConfig: ContactConfig = {
  phone: '[رقم التواصل]',
  email: '[البريد الإلكتروني]',
  address: '[العنوان - المملكة العربية السعودية]',
  workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
};

export interface NavItem {
  label: string;
  to: string;
  children?: { label: string; to: string }[];
}

export const navItems: NavItem[] = [
  { label: 'الرئيسية', to: '/' },
  { label: 'عن المختبرات', to: '/about' },
  {
    label: 'المراكز والفروع',
    to: '/laboratories',
  },
  { label: 'الخدمات', to: '/services' },
  { label: 'الأخبار', to: '/news' },
  { label: 'تواصل معنا', to: '/contact' },
];
