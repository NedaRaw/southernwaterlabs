export type CenterType = 'central' | 'regional_center';

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
    name: 'مختبر عسير المركزي',
    type: 'central',
    region: 'منطقة عسير',
    about:
      'المختبر المركزي للمياه و الخدمات البيئية في منطقة عسير، يقدم خدمات تحليل واختبار جودة المياه لكامل المنطقة الجنوبية الغربية.',
    capabilities: [
      {
        name: 'تحليل كيميائي',
        description: 'فحص العناصر الكيميائية في المياه',
      },
      {
        name: 'تحليل ميكروبيولوجي',
        description: 'كشف البكتيريا والكائنات الدقيقة',
      },
      {
        name: 'تحليل فيزيائي',
        description: 'قياس خصائص المياه الفيزيائية',
      },
    ],
    services: [
      {
        name: 'اختبار مياه الشرب',
        description: 'تحليل مياه الشرب للتأكد من مطابقتها للمعايير',
      },
      {
        name: 'اختبار مياه الصرف',
        description: 'تحليل مياه الصرف الصحي والصناعي',
      },
      {
        name: 'اختبار مياه الآبار',
        description: 'فحص مياه الآبار الجوفية',
      },
    ],
    analyses: [
      {
        name: 'تحليل الأس الهيدروجيني (pH)',
        description: 'قياس درجة حموضة المياه',
      },
      {
        name: 'تحليل الأملاح الذائبة (TDS)',
        description: 'قيام إجمالي الأملاح الذائبة',
      },
      {
        name: 'تحليل المعادن الثقيلة',
        description: 'كشف الرصاص والزئبق والكادميوم',
      },
      {
        name: 'تحليل النترات',
        description: 'قياس تركيز النترات في المياه',
      },
    ],
    contact: {
      phone: '+966 17 234 5678',
      email: 'asir-lab@waterlab.gov.sa',
      address: 'حي المروج، أبها، منطقة عسير',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Abha+Asir',
    },
    location: 'أبها، منطقة عسير',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'bisha',
        name: 'بيشة',
        type: 'branch',
        region: 'منطقة عسير',
        about:
          'فرع بيشة التابع للمركز المركزي لعسير، يخدم محافظة بيشة والمناطق المحيطة بها.',
        location: 'بيشة، منطقة عسير',
        address: 'حي الوسيطاء، بيشة، منطقة عسير',
        contact: {
          phone: '+966 17 345 6789',
          email: 'bisha-branch@waterlab.gov.sa',
          address: 'حي الوسيطاء، بيشة، منطقة عسير',
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
        name: 'محايل',
        type: 'branch',
        region: 'منطقة عسير',
        about:
          'فرع محايل التابع للمركز المركزي لعسير، يخدم محافظة محايل والمناطق المحيطة بها.',
        location: 'محايل، منطقة عسير',
        address: 'محايل، منطقة عسير',
        contact: {
          phone: '',
          email: '',
          address: 'محايل، منطقة عسير',
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
    name: 'مختبر نجران المركزي',
    type: 'central',
    region: 'منطقة نجران',
    about:
      'المختبر المركزي للمياه و الخدمات البيئية في منطقة نجران، يوفر خدمات التحليل الشامل لجودة المياه في المنطقة الجنوبية.',
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
      phone: '+966 17 456 7890',
      email: 'najran-lab@waterlab.gov.sa',
      address: 'حي الفهد، نجران، منطقة نجران',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Najran',
    },
    location: 'نجران، منطقة نجران',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'sharurah',
        name: 'شرورة',
        type: 'branch',
        region: 'منطقة نجران',
        about:
          'فرع شرورة التابع للمركز المركزي لنجران، يخدم محافظة شرورة والمناطق الشرقية من المنطقة.',
        location: 'شرورة، منطقة نجران',
        address: 'حي الشرف، شرورة، منطقة نجران',
        contact: {
          phone: '+966 17 567 8901',
          email: 'sharurah-branch@waterlab.gov.sa',
          address: 'حي الشرف، شرورة، منطقة نجران',
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
    name: 'مختبر الباحة المركزي',
    type: 'central',
    region: 'منطقة الباحة',
    about:
      'المختبر المركزي للمياه في منطقة الباحة، يقدم خدمات تحليل جودة المياه للمنطقة الجبلية الجنوبية.',
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
      address: 'حي الوادي، الباحة، منطقة الباحة',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Al+Baha',
    },
    location: 'الباحة، منطقة الباحة',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'qalwah',
        name: 'قلوة',
        type: 'branch',
        region: 'منطقة الباحة',
        about:
          'فرع قلوة التابع للمركز المركزي للباحة، يخدم محافظة قلوة والمناطق الساحلية التابعة لها.',
        location: 'قلوة، منطقة الباحة',
        address: 'حي البلد، قلوة، منطقة الباحة',
        contact: {
          phone: '+966 17 789 0123',
          email: 'qalwah-branch@waterlab.gov.sa',
          address: 'حي البلد، قلوة، منطقة الباحة',
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
    name: 'مختبر جازان المركزي',
    type: 'central',
    region: 'منطقة جازان',
    about:
      'المختبر المركزي للمياه في منطقة جازان، يخدم المنطقة الجنوبية الغربية المطلة على البحر الأحمر ويغطي الساحل والجزر.',
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
      address: 'حي الشاطئ، جازان، منطقة جازان',
      workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
      mapUrl: 'https://maps.google.com/?q=Jazan',
    },
    location: 'جازان، منطقة جازان',
    workingHours: 'الأحد - الخميس: 8:00 ص - 4:00 م',
    branches: [
      {
        id: 'al-darb',
        name: 'الدرب',
        type: 'branch',
        region: 'منطقة جازان',
        about:
          'فرع الدرب التابع للمركز المركزي لجازان، يخدم محافظة الدرب والمناطق الشمالية من منطقة جازان.',
        location: 'الدرب، منطقة جازان',
        address: 'حي المحطة، الدرب، منطقة جازان',
        contact: {
          phone: '+966 17 901 2345',
          email: 'aldarb-branch@waterlab.gov.sa',
          address: 'حي المحطة، الدرب، منطقة جازان',
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
        name: 'فرسان',
        type: 'branch',
        region: 'منطقة جازان',
        about:
          'فرع فرسان التابع للمركز المركزي لجازان، يخدم أرخبيل فرسان والمناطق الجزرية في البحر الأحمر.',
        location: 'فرسان، منطقة جازان',
        address: 'حي الميناء، جزيرة فرسان، منطقة جازان',
        contact: {
          phone: '+966 17 012 3456',
          email: 'farasan-branch@waterlab.gov.sa',
          address: 'حي الميناء، جزيرة فرسان، منطقة جازان',
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

export function getCenterById(
  id: string
): LaboratoryCenter | undefined {
  return laboratoryCenters.find((c) => c.id === id);
}

export function getBranchById(
  centerId: string,
  branchId: string
): Branch | undefined {
  const center = getCenterById(centerId);
  return center?.branches.find((b) => b.id === branchId);
}

export function getAllBranches(): {
  center: LaboratoryCenter;
  branch: Branch;
}[] {
  const all: { center: LaboratoryCenter; branch: Branch }[] = [];

  for (const center of laboratoryCenters) {
    for (const branch of center.branches) {
      all.push({ center, branch });
    }
  }

  return all;
}