import { FlaskConical, ShieldCheck, Microscope, Droplets, Waves, CheckCircle2 } from 'lucide-react';

export const contactConfig = {
  phone: '+966 17 222 0000',
  email: 'info@southernwaterlabs.gov.sa',
  address: 'المملكة العربية السعودية - القطاع الجنوبي',
  workingHours: 'الأحد - الخميس: 7:30 صباحاً - 2:30 مساءً',
};

export const siteStats = {
  centralCenters: '4',
  branches: '18',
  labTests: '+50,000',
  samples: '+25,000',
};

export const newsItems = [
  {
    id: 1,
    title: 'توسعة منظومة الفحوصات الميكروبيولوجية بمختبرات القطاع الجنوبي',
    description: 'تم تدشين أحدث أجهزة التحليل والتقنيات المخبرية لضمان أعلى معايير الجودة والسلامة لمياه الشرب.',
    category: 'تطوير وتحديث',
    date: '2026-09-15',
    image: 'https://images.pexels.com/photos/8533087/pexels-photo-8533087.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 2,
    title: 'حصول مختبرات المياه المركزية على تجديد الاعتماد الدولي للمختبرات',
    description: 'تأكيداً على الالتزام بالمعايير العالمية ودقة القياس والتحاليل الكيميائية والفيزيائية.',
    category: 'إنجازات',
    date: '2026-09-01',
    image: 'https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 3,
    title: 'ورشة عمل حول سلامة مياه الشرب وطرق أخذ العينات الدورية',
    description: 'تنظيم برنامج تدريبي متخصص للكوادر الفنية والميدانية في مختلف فروع ومحطات القطاع الجنوبي.',
    category: 'تدريب وورش عمل',
    date: '2026-08-20',
    image: 'https://images.pexels.com/photos/4033019/pexels-photo-4033019.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export const services = [
  {
    id: 'chemical',
    title: 'التحاليل الكيميائية والفيزيائية',
    description: 'فحص الخواص الكيميائية والفيزيائية لعينات المياه مثل الرقم الهيدروجيني والأملاح الذائبة والعكارة والعناصر الأساسية.',
    icon: FlaskConical,
  },
  {
    id: 'microbiological',
    title: 'الفحوصات الميكروبيولوجية والجرثومية',
    description: 'الكشف عن الملوثات البكتيرية والميكروبية لضمان خلو المياه من الميكروبات ومطابقتها للمواصفات القياسية.',
    icon: Microscope,
  },
  {
    id: 'quality-monitoring',
    title: 'مراقبة الجودة الدورية والامتثال',
    description: 'برامج مراقبة مستمرة لشبكات الإمداد والمحطات والخزانات للتأكد من استدامة سلامة وجودة المياه على مدار الساعة.',
    icon: ShieldCheck,
  },
  {
    id: 'field-sampling',
    title: 'سحب العينات الميدانية المتخصصة',
    description: 'فرق ميدانية متخصصة لجمع العينات وفق بروتوكولات معتمدة لحفظ العينات وضمان دقة النتائج المخبرية.',
    icon: Droplets,
  },
  {
    id: 'water-treatment',
    title: 'تقييم كفاءة محطات التنقية والمعالجة',
    description: 'متابعة مراحل التنقية والكلورة والترشيح للتأكد من الكفاءة التشغيلية لمختلف وحدات المعالجة.',
    icon: Waves,
  },
  {
    id: 'consultation',
    title: 'الاستشارات والتقارير الفنية المعتمدة',
    description: 'إصدار تقارير تحليلية معتمدة وتقديم استشارات فنية وحلول لمراقبة ومعالجة مشكلات جودة المياه.',
    icon: CheckCircle2,
  },
];
