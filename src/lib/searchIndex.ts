import { laboratoryCenters, getLocalizedCenters } from '@/data/laboratories';
import { services, getLocalizedService } from '@/data/siteConfig';
import { ALL_MOBILE_UNITS } from '@/data/mobileUnits';
import { newsItems, getLocalizedNews } from '@/data/siteConfig';
import type { Lang } from '@/lib/i18n';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'page' | 'lab' | 'branch' | 'service' | 'mobile' | 'news' | 'action';
  path: string;
  keywords: string;
}

export interface SearchCategory {
  key: string;
  label: { ar: string; en: string; fr: string };
  icon: string;
}

export const searchCategories: SearchCategory[] = [
  { key: 'page', label: { ar: 'الصفحات', en: 'Pages', fr: 'Pages' }, icon: 'FileText' },
  { key: 'lab', label: { ar: 'المختبرات', en: 'Laboratories', fr: 'Laboratoires' }, icon: 'Building2' },
  { key: 'branch', label: { ar: 'الفروع', en: 'Branches', fr: 'Agences' }, icon: 'Network' },
  { key: 'service', label: { ar: 'الخدمات', en: 'Services', fr: 'Services' }, icon: 'FlaskConical' },
  { key: 'mobile', label: { ar: 'الوحدات المتنقلة', en: 'Mobile Units', fr: 'Unités Mobiles' }, icon: 'Truck' },
  { key: 'news', label: { ar: 'الأخبار', en: 'News', fr: 'Actualités' }, icon: 'Newspaper' },
  { key: 'action', label: { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services Visiteurs' }, icon: 'UserPlus' },
];

function buildSearchIndex(lang: Lang): SearchResult[] {
  const results: SearchResult[] = [];

  // Static pages
  const pages: { id: string; title: { ar: string; en: string; fr: string }; desc: { ar: string; en: string; fr: string }; path: string; kw: string }[] = [
    { id: 'page-home', title: { ar: 'الصفحة الرئيسية', en: 'Home', fr: 'Accueil' }, desc: { ar: 'الصفحة الرئيسية للمختبرات', en: 'Laboratories home page', fr: 'Page d\'accueil' }, path: '/', kw: 'home main الرئيسية accueil' },
    { id: 'page-about', title: { ar: 'عن المختبرات', en: 'About Us', fr: 'À Propos' }, desc: { ar: 'تعرف على منظومتنا المخبرية', en: 'Learn about our laboratory system', fr: 'Découvrez notre système' }, path: '/about', kw: 'about عن propos mission vision رسالة رؤية' },
    { id: 'page-labs', title: { ar: 'المختبرات المركزية', en: 'Central Laboratories', fr: 'Laboratoires Centraux' }, desc: { ar: 'جميع المختبرات المركزية والفروع', en: 'All central laboratories and branches', fr: 'Tous les laboratoires centraux' }, path: '/laboratories', kw: 'laboratories labs مختبرات laboratoires network شبكة' },
    { id: 'page-services', title: { ar: 'الخدمات المخبرية', en: 'Laboratory Services', fr: 'Services de Laboratoire' }, desc: { ar: 'جميع خدمات الفحص والتحليل', en: 'All testing and analysis services', fr: 'Tous les services d\'analyse' }, path: '/services', kw: 'services خدمات service analysis تحليل' },
    { id: 'page-mobile', title: { ar: 'الوحدات المتنقلة', en: 'Mobile Laboratory Units', fr: 'Unités Mobiles' }, desc: { ar: 'المختبرات الميدانية المتنقلة', en: 'Mobile field laboratory units', fr: 'Unités mobiles de terrain' }, path: '/mobile-laboratories', kw: 'mobile units van متنقلة mobiles field ميدانية' },
    { id: 'page-news', title: { ar: 'الأخبار والمستجدات', en: 'News & Updates', fr: 'Actualités' }, desc: { ar: 'آخر الأخبار والإعلانات', en: 'Latest news and announcements', fr: 'Dernières actualités' }, path: '/news', kw: 'news أخبار actualités media إعلام' },
    { id: 'page-contact', title: { ar: 'تواصل معنا', en: 'Contact', fr: 'Contact' }, desc: { ar: 'معلومات التواصل والعنوان', en: 'Contact information and address', fr: 'Coordonnées de contact' }, path: '/contact', kw: 'contact تواصل contact phone email هاتف بريد' },
  ];

  pages.forEach((p) => {
    results.push({
      id: p.id,
      title: p.title[lang] || p.title.en,
      description: p.desc[lang] || p.desc.en,
      category: 'page',
      path: p.path,
      keywords: p.kw,
    });
  });

  // Visitor services / actions
  const actions: { id: string; title: { ar: string; en: string; fr: string }; desc: { ar: string; en: string; fr: string }; path: string; kw: string }[] = [
    { id: 'action-register', title: { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Réserver une Visite' }, desc: { ar: 'سجل موعد زيارتك إلكترونياً', en: 'Register your visit online', fr: 'Réservez votre visite en ligne' }, path: '/register', kw: 'register visit تسجيل زيارة visitor زائر' },
    { id: 'action-survey', title: { ar: 'استبيان الرضا', en: 'Satisfaction Survey', fr: 'Enquête de Satisfaction' }, desc: { ar: 'شاركنا تقييمك وملاحظاتك', en: 'Share your feedback', fr: 'Partagez votre avis' }, path: '/survey', kw: 'survey استبيان enquête feedback تقييم satisfaction رضا' },
    { id: 'action-enquiry', title: { ar: 'إرسال استفسار', en: 'Submit Enquiry', fr: 'Envoyer une Demande' }, desc: { ar: 'أرسل استفسارك للفريق الفني', en: 'Submit your technical questions', fr: 'Envoyez vos questions' }, path: '/enquiry', kw: 'enquiry استفسار demande inquiry question سؤال' },
    { id: 'action-admin', title: { ar: 'بوابة الموظفين', en: 'Employee Portal', fr: 'Portail Employés' }, desc: { ar: 'تسجيل دخول الموظفين', en: 'Staff login portal', fr: 'Connexion personnel' }, path: '/admin', kw: 'admin portal بوابة موظفين employee login دخول' },
  ];

  actions.forEach((a) => {
    results.push({
      id: a.id,
      title: a.title[lang] || a.title.en,
      description: a.desc[lang] || a.desc.en,
      category: 'action',
      path: a.path,
      keywords: a.kw,
    });
  });

  // Laboratories + branches
  const centers = getLocalizedCenters(lang);
  centers.forEach((center) => {
    const transName = laboratoryCenters.find((c) => c.id === center.id);
    results.push({
      id: `lab-${center.id}`,
      title: center.name,
      description: center.region,
      category: 'lab',
      path: `/laboratories/${center.id}`,
      keywords: `${center.id} ${center.name} ${center.region} ${transName?.region || ''} lab laboratory مختبر laboratoire ${center.id}`,
    });

    center.branches.forEach((branch) => {
      results.push({
        id: `branch-${center.id}-${branch.id}`,
        title: branch.name,
        description: `${center.name} — ${branch.location}`,
        category: 'branch',
        path: `/laboratories/${center.id}/${branch.id}`,
        keywords: `${branch.id} ${branch.name} ${branch.location} branch فرع agence ${center.id}`,
      });
    });
  });

  // Services
  services.forEach((svc) => {
    const loc = getLocalizedService(svc, lang);
    results.push({
      id: `service-${svc.id}`,
      title: loc.title,
      description: loc.description,
      category: 'service',
      path: `/services/${svc.id}`,
      keywords: `${svc.id} ${loc.title} ${loc.description} service خدمة analyse`,
    });
  });

  // Mobile units
  ALL_MOBILE_UNITS.forEach((unit) => {
    results.push({
      id: `mobile-${unit.id}`,
      title: unit.name[lang] || unit.name.en,
      description: unit.region[lang] || unit.region.en,
      category: 'mobile',
      path: `/mobile-laboratories#${unit.anchorId}`,
      keywords: `${unit.id} ${unit.name.en} ${unit.name.ar} ${unit.name.fr} ${unit.region.en} mobile van متنقلة mobiles ${unit.anchorId}`,
    });
  });

  // News
  newsItems.forEach((item) => {
    const loc = getLocalizedNews(item, lang);
    results.push({
      id: `news-${item.id}`,
      title: loc.title,
      description: loc.description,
      category: 'news',
      path: '/news',
      keywords: `${item.id} ${loc.title} ${loc.category} news خبر actualité`,
    });
  });

  return results;
}

export function searchResults(
  query: string,
  lang: Lang
): SearchResult[] {
  if (!query.trim()) return [];

  const index = buildSearchIndex(lang);

  const normalize = (value: string) =>
    value
      .toLocaleLowerCase(
        lang === 'ar'
          ? 'ar'
          : lang === 'fr'
            ? 'fr'
            : 'en'
      )
      // Remove French accents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Normalize common Arabic letter variants
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ـ/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return [];

  const terms = normalizedQuery
    .split(/\s+/)
    .filter(Boolean);

  const scored = index
    .map((result) => {
      const title = normalize(result.title);
      const description = normalize(result.description);
      const keywords = normalize(result.keywords);

      const haystack =
        `${title} ${description} ${keywords}`;

      let score = 0;

      for (const term of terms) {
        // Exact title match
        if (title === term) {
          score += 30;
        }

        // Title starts with the searched term
        if (title.startsWith(term)) {
          score += 20;
        }

        // Term appears in title
        if (title.includes(term)) {
          score += 12;
        }

        // Term appears in description
        if (description.includes(term)) {
          score += 5;
        }

        // Term appears in keywords
        if (keywords.includes(term)) {
          score += 4;
        }

        // General match
        if (haystack.includes(term)) {
          score += 2;
        }
      }

      // Bonus when ALL searched terms are found
      if (
        terms.length > 1 &&
        terms.every((term) => haystack.includes(term))
      ) {
        score += 10;
      }

      return {
        result,
        score,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24);

  return scored.map(({ result }) => result);
}

export function getPopularSearches(lang: Lang): { label: string; path: string }[] {
  return [
    { label: lang === 'ar' ? 'مختبر عسير' : lang === 'fr' ? 'Laboratoire d\'Asir' : 'Asir Laboratory', path: '/laboratories/asir' },
    { label: lang === 'ar' ? 'تسجيل زيارة' : lang === 'fr' ? 'Réserver une visite' : 'Register a Visit', path: '/register' },
    { label: lang === 'ar' ? 'الوحدات المتنقلة' : lang === 'fr' ? 'Unités Mobiles' : 'Mobile Units', path: '/mobile-laboratories' },
    { label: lang === 'ar' ? 'استبيان الرضا' : lang === 'fr' ? 'Enquête de satisfaction' : 'Satisfaction Survey', path: '/survey' },
  ];
}
