import type { Lang } from '@/lib/i18n';

export type CenterType = 'central' | 'Central_center';

export interface LabAnalysis {
  name: string;
  description: string;
}

export interface LabService {
  name: string;
  description: string;
}

export interface LabCapability {
  name: string;
  description: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  mapUrl: string;
}

export interface Branch {
  id: string;
  name: string;
  type: 'branch';
  region: string;
  about: string;
  location: string;
  address: string;
  contact: ContactInfo;
  services: LabService[];
  capabilities: LabCapability[];
  analyses: LabAnalysis[];
}

export interface LaboratoryCenter {
  id: string;
  name: string;
  type: CenterType;
  region: string;
  about: string;
  capabilities: LabCapability[];
  services: LabService[];
  analyses: LabAnalysis[];
  contact: ContactInfo;
  location: string;
  workingHours: string;
  branches: Branch[];
}

export const laboratoryCenters: LaboratoryCenter[] = [
  {
    id: 'asir',
    name: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير',
    type: 'central',
    region: 'منطقة عسير',
    about:
      'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير تابع للإدارة العامة لخدمات المياه بعسير بوزارة البيئة والمياه والزراعة، ويختص بفحص وتحليل جودة مياه الشرب والمصادر المائية، وإجراء الفحوصات المخبرية اللازمة للتحقق من مطابقة المياه للمواصفات والمعايير المعتمدة.',
    capabilities: [
      {
        name: 'تحليل كيميائي وفيزيائي',
        description: 'تحليل الأملاح المعدنية الذائبة ومكونات المياه',
      },
      {
        name: 'فحص ميكروبيولوجي',
        description: 'الفحص الدوري للشبكات والمصادر المائية لضمان السلامة الصحية',
      },
      {
        name: 'مطابقة المواصفات القياسية',
        description: 'التحقق من مطابقة المياه للمواصفات والمعايير المعتمدة',
      },
    ],
    services: [
      {
        name: 'فحص وتحليل جودة مياه الشرب',
        description: 'فحص وتحليل جودة مياه الشرب والمياه المطابقة للمواصفات القياسية.',
      },
      {
        name: 'تحليل الأملاح المعدنية ومكونات المياه',
        description: 'تحليل الأملاح المعدنية الذائبة وقياس مكونات المياه والعناصر المختلفة.',
      },
      {
        name: 'الفحوصات الدورية للشبكات والمصادر',
        description: 'إجراء الفحوصات المخبرية الدورية للشبكات والمصادر المائية لضمان السلامة البيئية والصحية.',
      },
    ],
    analyses: [
      {
        name: 'فحص جودة مياه الشرب والمطابقة',
        description: 'التحقق من مطابقة عينات المياه للمعايير والاشتراطات المعتمدة',
      },
      {
        name: 'قياس الأملاح المعدنية الذائبة',
        description: 'قياس تراكيز الأملاح الذائبة والعناصر المكونة للمياه',
      },
      {
        name: 'الفحوصات المخبرية الدورية',
        description: 'المتابعة الميدانية والمخبرية الدورية لشبكات التوزيع ومصادر المياه',
      },
    ],
    contact: {
      phone: '+966 17 224 1018',
      email: 'cen_lab@mewa.gov.sa',
      address: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
      workingHours: 'الأحد - الخميس: 8:30 صباحًا - 3:15 مساءً | الجمعة والسبت: مغلق',
      mapUrl: 'https://maps.app.goo.gl/s4pP9yp98rcRT3Xv9',
    },
    location: 'المحالة، أبها، منطقة عسير، المملكة العربية السعودية',
    workingHours: 'الأحد - الخميس: 8:30 صباحًا - 3:15 مساءً',
    branches: [
      {
        id: 'bisha',
        name: 'مختبر فرع بيشة',
        type: 'branch',
        region: 'منطقة عسير',
        about:
          'فرع بيشة التابع للمختبر المركزي لعسير، يخدم محافظة بيشة والمناطق المحيطة بها.',
        location: 'بيشة، منطقة عسير، المملكة العربية السعودية',
        address: 'حي الوسيطاء، بيشة، منطقة عسير، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 345 6789',
          email: 'bisha-branch@waterlab.gov.sa',
          address:
            'حي الوسيطاء، بيشة، منطقة عسير، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Bisha',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه الآبار',
            description: 'فحص مياه الآبار الجوفية',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي أساسي',
            description: 'فحص العناصر الكيميائية الأساسية',
          },
          {
            name: 'تحليل فيزيائي',
            description: 'قياس الخصائص الفيزيائية',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
          {
            name: 'تحليل النترات',
            description: 'قياس النترات',
          },
        ],
      },
      {
        id: 'mahayel',
        name: 'مختبر فرع محايل',
        type: 'branch',
        region: 'منطقة عسير',
        about:
          'فرع محايل التابع للمختبر المركزي لعسير، يخدم محافظة محايل والمناطق المحيطة بها.',
        location: 'محايل، منطقة عسير، المملكة العربية السعودية',
        address: 'محايل، منطقة عسير، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 285 4321',
          email: 'mahayel-branch@waterlab.gov.sa',
          address: 'محايل، منطقة عسير، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Muhayil+Asir',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه الآبار',
            description: 'فحص مياه الآبار الجوفية',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي أساسي',
            description: 'فحص العناصر الكيميائية الأساسية',
          },
          {
            name: 'تحليل فيزيائي',
            description: 'قياس الخصائص الفيزيائية',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
          {
            name: 'تحليل النترات',
            description: 'قياس النترات',
          },
        ],
      },
    ],
  },

  {
    id: 'najran',
    name: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة نجران',
    type: 'central',
    region: 'منطقة نجران',
    about:
      'المختبر المركزي للمياه والخدمات البيئية في منطقة نجران التابع لشركة المياه الوطنية، يوفر خدمات التحليل الشامل لجودة المياه والبيئة في المنطقة الجنوبية.',
    capabilities: [
      {
        name: 'تحليل كيميائي شامل',
        description: 'فحص جميع العناصر الكيميائية',
      },
      {
        name: 'تحليل ميكروبيولوجي',
        description: 'كشف التلوث البكتيري',
      },
      {
        name: 'تحليل المبيدات',
        description: 'كشف بقايا المبيدات في المياه',
      },
    ],
    services: [
      {
        name: 'اختبار مياه الشرب',
        description: 'تحليل شامل لمياه الشرب',
      },
      {
        name: 'اختبار مياه الصرف',
        description: 'تحليل مياه الصرف',
      },
      {
        name: 'اختبار مياه الري',
        description: 'تحليل ملاءمة المياه للري',
      },
    ],
    analyses: [
      {
        name: 'تحليل pH',
        description: 'قياس درجة الحموضة',
      },
      {
        name: 'تحليل TDS',
        description: 'قياس الأملاح الذائبة',
      },
      {
        name: 'تحليل الكلور',
        description: 'قياس نسبة الكلور المتبقي',
      },
      {
        name: 'تحليل العسر',
        description: 'قياس عسر المياه',
      },
    ],
    contact: {
      phone: '+966 56 898 2662',
      email: 'moalsaed.c@new.com.sa',
      address:
        'NJPC9103، 9103 ال منجم 30، 3972، حي الخالدية، نجران 66261، المملكة العربية السعودية (G6WX+7R)',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl:
        'https://www.google.com/maps/place/%D8%A7%D9%84%D9%85%D8%AE%D8%AA%D8%A8%D8%B1+%D8%A7%D9%84%D8%A7%D9%82%D9%84%D9%8A%D9%85%D9%8A+%D9%84%D9%84%D9%85%D9%8A%D8%A7%D9%87+%D9%88%D8%AE%D8%AF%D9%85%D8%A7%D8%AA+%D8%A7%D9%84%D8%A8%D9%8A%D8%A6%D9%8A%D8%A9+%D9%84%D8%B4%D8%B1%D9%83%D8%A9+%D8%A7%D9%84%D9%85%D9%8A%D8%A7%D9%87+%D8%A7%D9%84%D9%88%D8%B7%D9%86%D9%8A%D8%A9%E2%80%AD/@17.5444497,44.1577507,12.75z/data=!4m10!1m2!2m1!1z2KfZhNmF2K7Yqtio2LEg2KfZhNin2YLZhNmK2YXZiiDZhNmE2K7Yr9mF2KfYqiDYp9mE2KjZitim2YrYqSDYqNmF2YbYt9mC2Kkg2YbYrNix2KfZhuKArQ!3m6!1s0x15fedda2e057c387:0xeebd4b566fedbd0e!8m2!3d17.545673!4d44.2495585!15sCljYp9mE2YXYrtiq2KjYsSDYp9mE2KfZgtmE2YrZhdmKINmE2YTYrtiv2YXYp9iqINin2YTYqNmK2KbZitipINio2YXZhti32YLYqSDZhtis2LHYp9mG4oCtkgERZ292ZXJubWVudF9vZmZpY2XgAQA!16s%2Fg%2F11tcbwcrkr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
    },
    location: 'نجران، منطقة نجران، المملكة العربية السعودية',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'sharurah',
        name: 'مختبر فرع شرورة',
        type: 'branch',
        region: 'منطقة نجران',
        about:
          'فرع شرورة التابع للمختبر المركزي لنجران، يخدم محافظة شرورة والمناطق الشرقية من المنطقة.',
        location: 'شرورة، منطقة نجران، المملكة العربية السعودية',
        address: 'حي الشرف، شرورة، منطقة نجران، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 567 8901',
          email: 'sharurah-branch@waterlab.gov.sa',
          address:
            'حي الشرف، شرورة، منطقة نجران، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Sharurah',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه الري',
            description: 'تحليل ملاءمة المياه للري',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي',
            description: 'فحص العناصر الكيميائية',
          },
          {
            name: 'تحليل فيزيائي',
            description: 'قياس الخصائص الفيزيائية',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
          {
            name: 'تحليل الكبريتات',
            description: 'قياس الكبريتات',
          },
        ],
      },
    ],
  },

  {
    id: 'al-baha',
    name: 'المختبر المركزي لمياه الشرب والخدمات البيئية بالباحة',
    type: 'central',
    region: 'الباحة',
    about:
      'المختبر المركزي للمياه والخدمات البيئية في الباحة، يقدم خدمات تحليل جودة المياه للمنطقة الجبلية الجنوبية.',
    capabilities: [
      {
        name: 'تحليل كيميائي',
        description: 'فحص العناصر الكيميائية في المياه',
      },
      {
        name: 'تحليل ميكروبيولوجي',
        description: 'كشف البكتيريا والميكروبات',
      },
      {
        name: 'تحليل فيزيائي',
        description: 'قياس الخصائص الفيزيائية للمياه',
      },
    ],
    services: [
      {
        name: 'اختبار مياه الشرب',
        description: 'تحليل مياه الشرب',
      },
      {
        name: 'اختبار مياه الآبار',
        description: 'فحص مياه الآبار',
      },
      {
        name: 'اختبار مياه الينابيع',
        description: 'تحليل مياه الينابيع الطبيعية',
      },
    ],
    analyses: [
      {
        name: 'تحليل pH',
        description: 'قياس درجة الحموضة',
      },
      {
        name: 'تحليل TDS',
        description: 'قياس الأملاح الذائبة',
      },
      {
        name: 'تحليل الفلورايد',
        description: 'قياس نسبة الفلورايد',
      },
      {
        name: 'تحليل النترات',
        description: 'قياس النترات',
      },
    ],
    contact: {
      phone: '+966 17 678 9012',
      email: 'albaha-lab@waterlab.gov.sa',
      address: 'حي الوادي، الباحة، الباحة، المملكة العربية السعودية',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Al+Baha',
    },
    location: 'الباحة، الباحة، المملكة العربية السعودية',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'qalwah',
        name: 'مختبر فرع قلوة',
        type: 'branch',
        region: 'الباحة',
        about:
          'فرع قلوة التابع للمختبر المركزي للباحة، يخدم محافظة قلوة والمناطق الساحلية التابعة لها.',
        location: 'قلوة، الباحة، المملكة العربية السعودية',
        address: 'حي البلد، قلوة، الباحة، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 789 0123',
          email: 'qalwah-branch@waterlab.gov.sa',
          address:
            'حي البلد، قلوة، الباحة، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Qalwah',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه الآبار',
            description: 'فحص مياه الآبار',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي أساسي',
            description: 'فحص العناصر الكيميائية الأساسية',
          },
          {
            name: 'تحليل فيزيائي',
            description: 'قياس الخصائص الفيزيائية',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
          {
            name: 'تحليل الكلور',
            description: 'قياس الكلور المتبقي',
          },
        ],
      },
    ],
  },

  {
    id: 'jazan',
    name: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة جازان',
    type: 'central',
    region: 'منطقة جازان',
    about:
      'المختبر المركزي للمياه والخدمات البيئية في منطقة جازان، يخدم المنطقة الجنوبية الغربية المطلة على البحر الأحمر ويغطي الساحل والجزر.',
    capabilities: [
      {
        name: 'تحليل كيميائي شامل',
        description: 'فحص شامل للعناصر الكيميائية',
      },
      {
        name: 'تحليل ميكروبيولوجي',
        description: 'كشف التلوث البكتيري والفيروسي',
      },
      {
        name: 'تحليل المياه البحرية',
        description: 'تحليل ملوحة وجودة المياه البحرية',
      },
      {
        name: 'تحليل فيزيائي',
        description: 'قياس الخصائص الفيزيائية للمياه',
      },
    ],
    services: [
      {
        name: 'اختبار مياه الشرب',
        description: 'تحليل مياه الشرب',
      },
      {
        name: 'اختبار مياه الصرف',
        description: 'تحليل مياه الصرف الصحي',
      },
      {
        name: 'اختبار مياه البحر',
        description: 'تحليل جودة المياه البحرية',
      },
      {
        name: 'اختبار مياه الآبار',
        description: 'فحص مياه الآبار',
      },
    ],
    analyses: [
      {
        name: 'تحليل pH',
        description: 'قياس درجة الحموضة',
      },
      {
        name: 'تحليل TDS',
        description: 'قياس الأملاح الذائبة',
      },
      {
        name: 'تحليل الملوحة',
        description: 'قياس نسبة الملوحة',
      },
      {
        name: 'تحليل المعادن الثقيلة',
        description: 'كشف المعادن الثقيلة',
      },
      {
        name: 'تحليل النترات',
        description: 'قياس النترات',
      },
    ],
    contact: {
      phone: '+966 17 890 1234',
      email: 'jazan-lab@waterlab.gov.sa',
      address: 'حي الشاطئ، جازان، منطقة جازان، المملكة العربية السعودية',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Jazan',
    },
    location: 'جازان، منطقة جازان، المملكة العربية السعودية',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'al-darb',
        name: 'مختبر فرع الدرب',
        type: 'branch',
        region: 'منطقة جازان',
        about:
          'فرع الدرب التابع للمختبر المركزي لجازان، يخدم محافظة الدرب والمناطق الشمالية من منطقة جازان.',
        location: 'الدرب، منطقة جازان، المملكة العربية السعودية',
        address: 'حي المحطة، الدرب، منطقة جازان، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 901 2345',
          email: 'aldarb-branch@waterlab.gov.sa',
          address:
            'حي المحطة، الدرب، منطقة جازان، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Al+Darb',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه الآبار',
            description: 'فحص مياه الآبار',
          },
          {
            name: 'اختبار مياه الري',
            description: 'تحليل ملاءمة المياه للري',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي',
            description: 'فحص العناصر الكيميائية',
          },
          {
            name: 'تحليل فيزيائي',
            description: 'قياس الخصائص الفيزيائية',
          },
          {
            name: 'تحليل ميكروبيولوجي',
            description: 'كشف البكتيريا',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
          {
            name: 'تحليل النترات',
            description: 'قياس النترات',
          },
        ],
      },
      {
        id: 'farasan',
        name: 'مختبر فرع فرسان',
        type: 'branch',
        region: 'منطقة جازان',
        about:
          'فرع فرسان التابع للمختبر المركزي لجازان، يخدم أرخبيل فرسان والمناطق الجزرية في البحر الأحمر.',
        location: 'فرسان، منطقة جازان، المملكة العربية السعودية',
        address:
          'حي الميناء، جزيرة فرسان، منطقة جازان، المملكة العربية السعودية',
        contact: {
          phone: '+966 17 012 3456',
          email: 'farasan-branch@waterlab.gov.sa',
          address:
            'حي الميناء، جزيرة فرسان، منطقة جازان، المملكة العربية السعودية',
          workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
          mapUrl: 'https://maps.google.com/?q=Farasan',
        },
        services: [
          {
            name: 'اختبار مياه الشرب',
            description: 'تحليل مياه الشرب',
          },
          {
            name: 'اختبار مياه البحر',
            description: 'تحليل جودة المياه البحرية',
          },
        ],
        capabilities: [
          {
            name: 'تحليل كيميائي',
            description: 'فحص العناصر الكيميائية',
          },
          {
            name: 'تحليل الملوحة',
            description: 'قياس نسبة الملوحة',
          },
        ],
        analyses: [
          {
            name: 'تحليل pH',
            description: 'قياس درجة الحموضة',
          },
          {
            name: 'تحليل الملوحة',
            description: 'قياس الملوحة',
          },
          {
            name: 'تحليل TDS',
            description: 'قياس الأملاح الذائبة',
          },
        ],
      },
    ],
  },
];

// Multilingual translations database for all centers and branches
interface EntityTranslations {
  name: { en: string; fr: string };
  region: { en: string; fr: string };
  about: { en: string; fr: string };
  location: { en: string; fr: string };
  address: { en: string; fr: string };
  workingHours: { en: string; fr: string };
  capabilities?: {
    name: { en: string; fr: string };
    description: { en: string; fr: string };
  }[];
  services?: {
    name: { en: string; fr: string };
    description: { en: string; fr: string };
  }[];
  analyses?: {
    name: { en: string; fr: string };
    description: { en: string; fr: string };
  }[];
}

const labI18n: Record<string, EntityTranslations> = {
  asir: {
    name: {
      en: 'Asir Central Laboratory for Drinking Water and Environmental Services',
      fr: "Laboratoire central des eaux potables et des services environnementaux de la région d'Asir",
    },
    region: {
      en: 'Asir Region',
      fr: "Région d'Asir",
    },
    about: {
      en: 'The Asir Central Laboratory for Drinking Water and Environmental Services operates under the General Administration of Water Services in Asir at the Ministry of Environment, Water and Agriculture. The laboratory performs testing and analysis of drinking water and water sources and conducts laboratory examinations to verify compliance with applicable standards and requirements.',
      fr: "Le Laboratoire central des eaux potables et des services environnementaux de la région d'Asir relève de l'Administration générale des services de l'eau d'Asir au sein du ministère de l'Environnement, de l'Eau et de l'Agriculture. Il réalise des analyses des eaux potables et des sources d'eau ainsi que les contrôles nécessaires pour vérifier leur conformité aux normes et exigences applicables.",
    },
    location: {
      en: 'Al-Mahalah, Abha, Asir Region, Saudi Arabia',
      fr: "Al-Mahalah, Abha, région d'Asir, Arabie saoudite",
    },
    address: {
      en: '7H2X+3V6, طريق, Almahalah, Abha 62562, Saudi Arabia',
      fr: "7H2X+3V6, طريق, Almahalah, Abha 62562, Arabie saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:30 AM - 3:15 PM | Friday - Saturday: Closed',
      fr: 'Dimanche - jeudi : 08h30 - 15h15 | Vendredi - samedi : Fermé',
    },
  },

  bisha: {
    name: {
      en: 'Bisha Branch',
      fr: 'Agence de Bisha',
    },
    region: {
      en: 'Asir Region',
      fr: "Région d'Asir",
    },
    about: {
      en: 'Bisha branch operating under Asir Central Laboratory, serving Bisha governorate and neighboring municipal districts.',
      fr: "Agence de Bisha rattachée au  Laboratoire Central d'Asir, desservant le gouvernorat de Bisha et les communes limitrophes.",
    },
    location: {
      en: 'Bisha, Asir Region, Kingdom of Saudi Arabia',
      fr: "Bisha, Région d'Asir, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Waseeta District, Bisha, Asir Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Waseeta, Bisha, Région d'Asir, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  mahayel: {
    name: {
      en: 'Mahayel Asir Branch',
      fr: 'Agence de Mahayel Asir',
    },
    region: {
      en: 'Asir Region',
      fr: "Région d'Asir",
    },
    about: {
      en: 'Mahayel branch operating under Asir Central Laboratory, providing dedicated water analyses for Mahayel and surrounding valleys.',
      fr: "Agence de Mahayel rattachée au  Laboratoire Central d'Asir, fournissant des analyses d'eau pour Mahayel et ses environs.",
    },
    location: {
      en: 'Mahayel, Asir Region, Kingdom of Saudi Arabia',
      fr: "Mahayel, Région d'Asir, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Mahayel, Asir Region, Kingdom of Saudi Arabia',
      fr: "Mahayel, Région d'Asir, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  najran: {
    name: {
      en: 'Central Laboratory for Drinking Water and Environmental Services - Najran Region',
      fr: "Laboratoire Central de l'Eau Potable et des Services Environnementaux de la Région de Najran",
    },
    region: {
      en: 'Najran Region',
      fr: 'Région de Najran',
    },
    about: {
      en: 'The Central Laboratory for Water and Environmental Services in Najran Region operates under the National Water Company, offering advanced chemical, physical, and pesticide residue testing.',
      fr: "Le Laboratoire Central de l'Eau et des Services Environnementaux de Najran relève de la Compagnie Nationale des Eaux et assure des analyses certifiées de pointe.",
    },
    location: {
      en: 'Najran, Najran Region, Kingdom of Saudi Arabia',
      fr: "Najran, Région de Najran, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'NJPC9103, 9103 Al-Manjam 30, 3972, Al-Khalidiyah, Najran 66261, Saudi Arabia (Plus Code: G6WX+7R)',
      fr: "NJPC9103, 9103 Al-Manjam 30, 3972, Al-Khalidiyah, Najran 66261, Arabie Saoudite (Plus Code : G6WX+7R)",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  sharurah: {
    name: {
      en: 'Sharurah Branch',
      fr: 'Agence de Sharurah',
    },
    region: {
      en: 'Najran Region',
      fr: 'Région de Najran',
    },
    about: {
      en: 'Sharurah branch under Najran Central Lab, serving Sharurah governorate and eastern desert water supply zones.',
      fr: "Agence de Sharurah rattachée au  Laboratoire Central de Najran, couvrant le gouvernorat de Sharurah et les réseaux orientaux.",
    },
    location: {
      en: 'Sharurah, Najran Region, Kingdom of Saudi Arabia',
      fr: "Sharurah, Région de Najran, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Sharaf District, Sharurah, Najran Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Sharaf, Sharurah, Région de Najran, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  'al-baha': {
    name: {
      en: 'Central Laboratory for Drinking Water and Environmental Services - Al-Baha Region',
      fr: "Laboratoire Central de l'Eau Potable et des Services Environnementaux de la Région d'Al-Baha",
    },
    region: {
      en: 'Al-Baha Region',
      fr: "Région d'Al-Baha",
    },
    about: {
      en: 'The Central Laboratory for Water in Al-Baha Region provides certified water analysis for the southern highlands and natural spring waters.',
      fr: "Le Laboratoire Central de l'Eau d'Al-Baha réalise des analyses certifiées pour les zones montagneuses et les sources naturelles.",
    },
    location: {
      en: 'Al-Baha, Al-Baha Region, Kingdom of Saudi Arabia',
      fr: "Al-Baha, Région d'Al-Baha, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Wadi District, Al-Baha, Al-Baha Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Wadi, Al-Baha, Région d'Al-Baha, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  qalwah: {
    name: {
      en: 'Qalwah Branch',
      fr: 'Agence de Qalwah',
    },
    region: {
      en: 'Al-Baha Region',
      fr: "Région d'Al-Baha",
    },
    about: {
      en: 'Qalwah branch operating under Al-Baha Central Laboratory, serving the Tihama lowlands and coastal border regions.',
      fr: "Agence de Qalwah rattachée au  Laboratoire Central d'Al-Baha, desservant la plaine de Tihama et les zones côtières.",
    },
    location: {
      en: 'Qalwah, Al-Baha Region, Kingdom of Saudi Arabia',
      fr: "Qalwah, Région d'Al-Baha, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Balad District, Qalwah, Al-Baha Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Balad, Qalwah, Région d'Al-Baha, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  jazan: {
    name: {
      en: 'Central Laboratory for Drinking Water and Environmental Services - Jazan Region',
      fr: "Laboratoire Central de l'Eau Potable et des Services Environnementaux de la Région de Jazan",
    },
    region: {
      en: 'Jazan Region',
      fr: 'Région de Jazan',
    },
    about: {
      en: 'The Central Laboratory for Water in Jazan Region covers the southern Red Sea coastal belt, desalination systems, and offshore islands.',
      fr: "Le Laboratoire Central de l'Eau de Jazan assure le contrôle des réseaux côtiers de la Mer Rouge, des unités de dessalement et des îles.",
    },
    location: {
      en: 'Jazan, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Jazan, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Shati District, Jazan, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Shati, Jazan, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  'al-darb': {
    name: {
      en: 'Al-Darb Branch',
      fr: "Agence d'Al-Darb",
    },
    region: {
      en: 'Jazan Region',
      fr: 'Région de Jazan',
    },
    about: {
      en: 'Al-Darb branch under Jazan Central Laboratory, serving northern Jazan governorate and coastal desalination corridors.',
      fr: "Agence d'Al-Darb rattachée au  Laboratoire Central de Jazan, desservant le nord de Jazan et les axes de dessalement.",
    },
    location: {
      en: 'Al-Darb, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Al-Darb, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Mahattah District, Al-Darb, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Mahattah, Al-Darb, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },

  farasan: {
    name: {
      en: 'Farasan Islands Branch',
      fr: 'Agence des Îles Farasan',
    },
    region: {
      en: 'Jazan Region',
      fr: 'Région de Jazan',
    },
    about: {
      en: 'Farasan branch under Jazan Central Lab, monitoring water quality across the Farasan Archipelago and maritime protected reserves.',
      fr: "Agence de Farasan rattachée au  Laboratoire Central de Jazan, surveillant l'archipel de Farasan et les réserves maritimes.",
    },
    location: {
      en: 'Farasan, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Farasan, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    address: {
      en: 'Al-Mina District, Farasan Island, Jazan Region, Kingdom of Saudi Arabia',
      fr: "Quartier Al-Mina, Île Farasan, Région de Jazan, Royaume d'Arabie Saoudite",
    },
    workingHours: {
      en: 'Sunday - Thursday: 8:00 AM - 4:00 PM',
      fr: 'Dimanche - Jeudi : 8h00 - 16h00',
    },
  },
};

// Generic items translation dictionary for capabilities, services, and analyses
const commonItemTranslations: Record<
  string,
  {
    en: { name: string; desc: string };
    fr: { name: string; desc: string };
  }
> = {
  'تحليل كيميائي': {
    en: {
      name: 'Chemical Analysis',
      desc: 'Screening chemical minerals and compounds in water',
    },
    fr: {
      name: 'Analyse Chimique',
      desc: "Dosage des minéraux et composés chimiques de l'eau",
    },
  },

  'تحليل كيميائي شامل': {
    en: {
      name: 'Comprehensive Chemical Analysis',
      desc: 'Complete examination of all major and trace chemical elements',
    },
    fr: {
      name: 'Analyse Chimique Complète',
      desc: 'Examen exhaustif des éléments chimiques majeurs et traces',
    },
  },

  'تحليل كيميائي أساسي': {
    en: {
      name: 'Basic Chemical Analysis',
      desc: 'Core chemical parameter screening',
    },
    fr: {
      name: 'Analyse Chimique Fondamentale',
      desc: 'Contrôle des paramètres chimiques essentiels',
    },
  },

  'تحليل ميكروبيولوجي': {
    en: {
      name: 'Microbiological Analysis',
      desc: 'Detection of bacteria, coliforms, and microbial pathogens',
    },
    fr: {
      name: 'Analyse Microbiologique',
      desc: 'Recherche des coliformes, bactéries et agents pathogènes',
    },
  },

  'تحليل فيزيائي': {
    en: {
      name: 'Physical Analysis',
      desc: 'Measurement of physical water characteristics (color, odor, turbidity)',
    },
    fr: {
      name: 'Analyse Physique',
      desc: 'Mesure des paramètres physiques (turbidité, couleur, odeur)',
    },
  },

  'تحليل المبيدات': {
    en: {
      name: 'Pesticide Residue Analysis',
      desc: 'Trace detection of agrochemical and pesticide residues',
    },
    fr: {
      name: 'Recherche de Pesticides',
      desc: 'Détection des traces de pesticides et résidus chimiques',
    },
  },

  'تحليل المياه البحرية': {
    en: {
      name: 'Marine & Seawater Analysis',
      desc: 'Salinity and environmental testing of coastal waters',
    },
    fr: {
      name: "Analyse de l'Eau de Mer",
      desc: 'Mesure de salinité et qualité des eaux marines',
    },
  },

  'تحليل الملوحة': {
    en: {
      name: 'Salinity Analysis',
      desc: 'Measuring dissolved salt concentrations',
    },
    fr: {
      name: 'Mesure de la Salinité',
      desc: 'Mesure précise de la concentration en sels dissous',
    },
  },

  'اختبار مياه الشرب': {
    en: {
      name: 'Drinking Water Testing',
      desc: 'Verification of municipal potable water conformity',
    },
    fr: {
      name: "Contrôle de l'Eau Potable",
      desc: "Vérification de la conformité de l'eau du réseau",
    },
  },

  'اختبار مياه الصرف': {
    en: {
      name: 'Wastewater & Effluent Testing',
      desc: 'Testing municipal and industrial wastewater compliance',
    },
    fr: {
      name: 'Analyse des Eaux Usées',
      desc: 'Contrôle des rejets domestiques et industriels',
    },
  },

  'اختبار مياه الآبار': {
    en: {
      name: 'Well & Groundwater Testing',
      desc: 'Comprehensive examination of underground aquifers',
    },
    fr: {
      name: "Analyse de l'Eau de Puits",
      desc: 'Examen complet des nappes et forages souterrains',
    },
  },

  'اختبار مياه الري': {
    en: {
      name: 'Irrigation Water Testing',
      desc: 'Assessing agricultural suitability and mineral balance',
    },
    fr: {
      name: "Analyse de l'Eau d'Irrigation",
      desc: 'Évaluation de la compatibilité agricole et minérale',
    },
  },

  'اختبار مياه الينابيع': {
    en: {
      name: 'Natural Spring Water Testing',
      desc: 'Assessing virgin spring water quality and purity',
    },
    fr: {
      name: "Analyse de l'Eau de Source",
      desc: 'Vérification de la pureté des sources naturelles',
    },
  },

  'اختبار مياه البحر': {
    en: {
      name: 'Seawater Intake Testing',
      desc: 'Desalination plant feed water and coastal assessment',
    },
    fr: {
      name: "Analyse de l'Eau de Mer Brute",
      desc: "Contrôle des prises d'eau pour usines de dessalement",
    },
  },

  'تحليل الأس الهيدروجيني (pH)': {
    en: {
      name: 'pH Potential Analysis',
      desc: 'Precise measurement of water acidity and alkalinity',
    },
    fr: {
      name: 'Mesure du Potentiel Hydrogène (pH)',
      desc: "Contrôle précis de l'acidité et de l'alcalinité",
    },
  },

  'تحليل pH': {
    en: {
      name: 'pH Analysis',
      desc: 'Measurement of acidity level',
    },
    fr: {
      name: 'Mesure du pH',
      desc: "Mesure du niveau d'acidité",
    },
  },

  'تحليل الأملاح الذائبة (TDS)': {
    en: {
      name: 'Total Dissolved Solids (TDS)',
      desc: 'Quantifying overall dissolved mineral salts',
    },
    fr: {
      name: 'Solides Dissous Totaux (TDS)',
      desc: 'Dosage de la minéralisation totale dissoute',
    },
  },

  'تحليل TDS': {
    en: {
      name: 'TDS Analysis',
      desc: 'Measuring dissolved mineral content',
    },
    fr: {
      name: 'Analyse TDS',
      desc: 'Mesure des sels minéraux dissous',
    },
  },

  'تحليل المعادن الثقيلة': {
    en: {
      name: 'Heavy Metals Analysis',
      desc: 'Spectrometric screening for lead, mercury, and cadmium',
    },
    fr: {
      name: 'Dosage des Métaux Lourds',
      desc: 'Détection spectrométrique du plomb, mercure et cadmium',
    },
  },

  'تحليل النترات': {
    en: {
      name: 'Nitrate (NO3) Testing',
      desc: 'Measuring nitrate concentrations in water sources',
    },
    fr: {
      name: 'Dosage des Nitrates (NO3)',
      desc: 'Mesure de la concentration en nitrates',
    },
  },

  'تحليل الكلور': {
    en: {
      name: 'Residual Chlorine Analysis',
      desc: 'Monitoring active residual disinfectant levels',
    },
    fr: {
      name: 'Analyse du Chlore Résiduel',
      desc: 'Contrôle du niveau de désinfectant résiduel',
    },
  },

  'تحليل العسر': {
    en: {
      name: 'Total Hardness Testing',
      desc: 'Calcium and magnesium hardness evaluation',
    },
    fr: {
      name: 'Titre Hydrotimétrique (Dureté)',
      desc: 'Évaluation de la dureté en calcium et magnésium',
    },
  },

  'تحليل الكبريتات': {
    en: {
      name: 'Sulfate Analysis',
      desc: 'Quantifying sulfate ion concentrations',
    },
    fr: {
      name: 'Dosage des Sulfates',
      desc: 'Mesure des concentrations en ions sulfates',
    },
  },

  'تحليل الفلورايد': {
    en: {
      name: 'Fluoride Concentration Testing',
      desc: 'Monitoring optimal fluoridation standards',
    },
    fr: {
      name: 'Dosage des Fluorures',
      desc: 'Contrôle des concentrations optimales en fluor',
    },
  },
};

function localizeItems(
  items: { name: string; description: string }[],
  lang: Lang
) {
  if (lang === 'ar') return items;

  return items.map((item) => {
    const translation = commonItemTranslations[item.name];

    if (translation && translation[lang]) {
      return {
        name: translation[lang].name,
        description: translation[lang].desc,
      };
    }

    return item;
  });
}

export function getLocalizedBranch(
  branch: Branch,
  lang: Lang
): Branch {
  if (lang === 'ar') return branch;

  const trans = labI18n[branch.id];

  return {
    ...branch,
    name: trans?.name[lang] || branch.name,
    region: trans?.region[lang] || branch.region,
    about: trans?.about[lang] || branch.about,
    location: trans?.location[lang] || branch.location,
    address: trans?.address[lang] || branch.address,
    contact: {
      ...branch.contact,
      address: trans?.address[lang] || branch.contact.address,
      workingHours:
        trans?.workingHours[lang] || branch.contact.workingHours,
    },
    capabilities: localizeItems(branch.capabilities, lang),
    services: localizeItems(branch.services, lang),
    analyses: localizeItems(branch.analyses, lang),
  };
}

export function getLocalizedCenter(
  center: LaboratoryCenter,
  lang: Lang
): LaboratoryCenter {
  if (lang === 'ar') return center;

  const trans = labI18n[center.id];

  return {
    ...center,
    name: trans?.name[lang] || center.name,
    region: trans?.region[lang] || center.region,
    about: trans?.about[lang] || center.about,
    location: trans?.location[lang] || center.location,
    workingHours:
      trans?.workingHours[lang] || center.workingHours,
    contact: {
      ...center.contact,
      address: trans?.address[lang] || center.contact.address,
      workingHours:
        trans?.workingHours[lang] || center.contact.workingHours,
    },
    capabilities: localizeItems(center.capabilities, lang),
    services: localizeItems(center.services, lang),
    analyses: localizeItems(center.analyses, lang),
    branches: center.branches.map((b) =>
      getLocalizedBranch(b, lang)
    ),
  };
}

export function getLocalizedCenters(
  lang: Lang
): LaboratoryCenter[] {
  return laboratoryCenters.map((c) =>
    getLocalizedCenter(c, lang)
  );
}

export function getCenterById(
  id: string,
  lang: Lang = 'ar'
): LaboratoryCenter | undefined {
  const center = laboratoryCenters.find((c) => c.id === id);

  return center
    ? getLocalizedCenter(center, lang)
    : undefined;
}

export function getBranchById(
  centerId: string,
  branchId: string,
  lang: Lang = 'ar'
): Branch | undefined {
  const center = getCenterById(centerId, lang);

  return center?.branches.find(
    (b) => b.id === branchId
  );
}

export function getAllBranches(
  lang: Lang = 'ar'
): {
  center: LaboratoryCenter;
  branch: Branch;
}[] {
  const all: {
    center: LaboratoryCenter;
    branch: Branch;
  }[] = [];

  const localizedCenters = getLocalizedCenters(lang);

  for (const center of localizedCenters) {
    for (const branch of center.branches) {
      all.push({ center, branch });
    }
  }

  return all;
}