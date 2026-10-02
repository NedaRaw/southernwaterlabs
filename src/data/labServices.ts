import type { Lang } from '@/lib/i18n';

export interface ServiceOption {
  value: string;
  en: string;
  ar: string;
  fr: string;
}

export const APPROVED_SERVICES: ServiceOption[] = [
  {
    value: 'Water Quality Testing',
    en: 'Water Quality Testing',
    ar: 'تحليل جودة المياه',
    fr: "Analyse de la qualité de l'eau",
  },
  {
    value: 'Drinking Water Analysis',
    en: 'Drinking Water Analysis',
    ar: 'تحليل مياه الشرب',
    fr: "Analyse de l'eau potable",
  },
  {
    value: 'Wastewater Testing',
    en: 'Wastewater Testing',
    ar: 'تحليل مياه الصرف الصحي',
    fr: 'Analyse des eaux usées',
  },
  {
    value: 'Groundwater Testing',
    en: 'Groundwater Testing',
    ar: 'تحليل المياه الجوفية',
    fr: 'Analyse des eaux souterraines',
  },
  {
    value: 'Surface Water Testing',
    en: 'Surface Water Testing',
    ar: 'تحليل المياه السطحية',
    fr: 'Analyse des eaux de surface',
  },
  {
    value: 'Microbiological Analysis',
    en: 'Microbiological Analysis',
    ar: 'التحاليل الميكروبيولوجية',
    fr: 'Analyse microbiologique',
  },
  {
    value: 'Chemical Analysis',
    en: 'Chemical Analysis',
    ar: 'التحاليل الكيميائية',
    fr: 'Analyse chimique',
  },
  {
    value: 'Physical Analysis',
    en: 'Physical Analysis',
    ar: 'التحاليل الفيزيائية',
    fr: 'Analyse physique',
  },
  {
    value: 'Environmental Analysis',
    en: 'Environmental Analysis',
    ar: 'التحاليل البيئية',
    fr: 'Analyse environnementale',
  },
  {
    value: 'Sample Collection',
    en: 'Sample Collection',
    ar: 'جمع العينات',
    fr: "Prélèvement d'échantillons",
  },
  {
    value: 'Laboratory Testing',
    en: 'Laboratory Testing',
    ar: 'الفحوصات المخبرية',
    fr: 'Analyses de laboratoire',
  },
  {
    value: 'Technical Consultation',
    en: 'Technical Consultation',
    ar: 'الاستشارات الفنية',
    fr: 'Consultation technique',
  },
  {
    value: 'Calibration & Quality Assurance',
    en: 'Calibration & Quality Assurance',
    ar: 'المعايرة وضمان الجودة',
    fr: 'Étalonnage et assurance qualité',
  },
  {
    value: 'Test Results / Reports',
    en: 'Test Results / Reports',
    ar: 'نتائج التحاليل / التقارير',
    fr: "Résultats d'analyses / Rapports",
  },
  {
    value: 'Other',
    en: 'Other',
    ar: 'أخرى',
    fr: 'Autre',
  },
];

export interface LocationOption {
  value: string;
  en: string;
  ar: string;
  fr: string;
}

export const ENQUIRY_LOCATIONS: LocationOption[] = [
  {
    value: 'Saudi Arabia',
    en: 'Saudi Arabia',
    ar: 'المملكة العربية السعودية',
    fr: 'Arabie saoudite',
  },
  {
    value: 'United Arab Emirates',
    en: 'United Arab Emirates',
    ar: 'الإمارات العربية المتحدة',
    fr: 'Émirats arabes unis',
  },
  {
    value: 'Oman',
    en: 'Oman',
    ar: 'سلطنة عُمان',
    fr: 'Oman',
  },
  {
    value: 'Qatar',
    en: 'Qatar',
    ar: 'قطر',
    fr: 'Qatar',
  },
  {
    value: 'Bahrain',
    en: 'Bahrain',
    ar: 'البحرين',
    fr: 'Bahreïn',
  },
  {
    value: 'Kuwait',
    en: 'Kuwait',
    ar: 'الكويت',
    fr: 'Koweït',
  },
  {
    value: 'Egypt',
    en: 'Egypt',
    ar: 'مصر',
    fr: 'Égypte',
  },
  {
    value: 'India',
    en: 'India',
    ar: 'الهند',
    fr: 'Inde',
  },
  {
    value: 'Other GCC',
    en: 'Other GCC',
    ar: 'دول الخليج الأخرى',
    fr: 'Autres pays du CCG',
  },
  {
    value: 'Other Middle East',
    en: 'Other Middle East',
    ar: 'دول الشرق الأوسط الأخرى',
    fr: 'Autres pays du Moyen-Orient',
  },
  {
    value: 'International',
    en: 'International',
    ar: 'دولي',
    fr: 'International',
  },
];

export interface LabHierarchyItem {
  id: string; // e.g. 'asir'
  name: {
    en: string;
    ar: string;
    fr: string;
  };
  branches: {
    id: string; // e.g. 'bisha'
    name: {
      en: string;
      ar: string;
      fr: string;
    };
  }[];
}

export const LAB_HIERARCHY: LabHierarchyItem[] = [
  {
    id: 'asir',
name: {
  ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة عسير',
  en: 'Asir Central Laboratory for Drinking Water and Environmental Services',
  fr: 'Laboratoire Central d’Asir pour les Eaux Potables et les Services Environnementaux',
},
    branches: [
      {
        id: 'bisha',
        name: {
          en: 'Bisha Branch',
          ar: 'فرع بيشة',
          fr: 'Agence de Bisha',
        },
      },
      {
        id: 'mahayel',
        name: {
          en: 'Mahayel Branch',
          ar: 'فرع محايل',
          fr: 'Agence de Mahayel',
        },
      },
    ],
  },
  {
    id: 'najran',
name: {
  ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة نجران',
  en: 'Najran Central Laboratory for Drinking Water and Environmental Services',
  fr: 'Laboratoire Central de Najran pour les Eaux Potables et les Services Environnementaux',
},
    branches: [
      {
        id: 'sharurah',
        name: {
          en: 'Sharurah Branch',
          ar: 'فرع شرورة',
          fr: 'Agence de Sharurah',
        },
      },
    ],
  },
  {
    id: 'al-baha',
name: {
  ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة الباحة',
  en: 'Al-Baha Central Laboratory for Drinking Water and Environmental Services',
  fr: 'Laboratoire Central d’Al-Baha pour les Eaux Potables et les Services Environnementaux',
},
    branches: [
      {
        id: 'qalwah',
        name: {
          en: 'Qalwah Branch',
          ar: 'فرع قلوة',
          fr: 'Agence de Qalwah',
        },
      },
    ],
  },
  {
    id: 'jazan',
name: {
  ar: 'المختبر المركزي لمياه الشرب والخدمات البيئية بمنطقة جازان',
  en: 'Jazan Central Laboratory for Drinking Water and Environmental Services',
  fr: 'Laboratoire Central de Jazan pour les Eaux Potables et les Services Environnementaux',
},
    branches: [
      {
        id: 'al-darb',
        name: {
          en: 'Al-Darb Branch',
          ar: 'فرع الدرب',
          fr: "Agence d'Al-Darb",
        },
      },
      {
        id: 'farasan',
        name: {
          en: 'Farasan Branch',
          ar: 'فرع فرسان',
          fr: 'Agence de Farasan',
        },
      },
    ],
  },
];

export function getServiceLabel(serviceValue: string, lang: Lang): string {
  const item = APPROVED_SERVICES.find((s) => s.value === serviceValue);
  return item ? item[lang] || item.en : serviceValue;
}

export function getLocationLabel(locationValue: string, lang: Lang): string {
  const item = ENQUIRY_LOCATIONS.find((l) => l.value === locationValue);
  return item ? item[lang] || item.en : locationValue;
}

export function getLabLabel(labId: string, lang: Lang): string {
  const lab = LAB_HIERARCHY.find((l) => l.id === labId);
  return lab ? lab.name[lang] || lab.name.en : labId;
}

export function getBranchLabel(labId: string, branchId: string, lang: Lang): string {
  const lab = LAB_HIERARCHY.find((l) => l.id === labId);
  if (!lab) return branchId;
  const branch = lab.branches.find((b) => b.id === branchId);
  return branch ? branch.name[lang] || branch.name.en : branchId;
}
