import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'ar' | 'en' | 'fr';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const translations: Record<string, { ar: string; en: string; fr: string }> = {
  // Brand
  'brand.name': {
    ar: 'المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي',
    en: 'Southern Sector Central Water and Environmental Laboratories',
    fr: 'Laboratoire Central des Eaux et des Services Environnementaux',
  },
  'brand.tagline': {
    ar: 'دقة التحليل... جودة المياه... سلامة المجتمع',
    en: 'Analytical Precision... Water Quality... Community Safety',
    fr: 'Précision d\'Analyse... Qualité de l\'Eau... Sécurité de la Communauté',
  },
  'brand.subtitle': {
    ar: 'المختبرات المركزية والفروع',
    en: 'Central Laboratories & Branches',
    fr: 'Laboratoires Centraux et Agences',
  },

  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
  'nav.about': { ar: 'عن المختبرات', en: 'About Us', fr: 'À Propos' },
  'nav.labs': { ar: 'المختبرات', en: 'Laboratories', fr: 'Laboratoires' },
  'nav.services': { ar: 'الخدمات', en: 'Services', fr: 'Services' },
  'nav.news': { ar: 'الأخبار', en: 'News', fr: 'Actualités' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact', fr: 'Contact' },
  'nav.admin': { ar: 'بوابة الموظفين', en: 'Employee Portal', fr: 'Portail Employés' },
  'nav.allLabs': { ar: 'كافة المختبرات والفروع', en: 'All Laboratories & Branches', fr: 'Tous les Laboratoires et Agences' },
  'nav.allServices': { ar: 'استعراض كافة الخدمات', en: 'View All Services', fr: 'Voir Tous les Services' },
  'nav.asir': { ar: 'مختبر عسير المركزي', en: 'Asir Central Laboratory', fr: 'Laboratoire Central d\'Asir' },
  'nav.najran': { ar: 'مختبر نجران المركزي', en: 'Najran Central Laboratory', fr: 'Laboratoire Central de Najran' },
  'nav.baha': { ar: 'مختبر الباحة المركزي', en: 'Al-Baha Central Laboratory', fr: 'Laboratoire Central d\'Al-Baha' },
  'nav.jazan': { ar: 'مختبر جازان المركزي', en: 'Jazan Central Laboratory', fr: 'Laboratoire Central de Jazan' },
  'svc.drinking': { ar: 'تحليل مياه الشرب', en: 'Drinking Water Testing', fr: 'Analyse de l\'Eau Potable' },
  'svc.chemical': { ar: 'التحاليل الكيميائية', en: 'Chemical Analysis', fr: 'Analyses Chimiques' },
  'svc.physical': { ar: 'التحاليل الفيزيائية', en: 'Physical Analysis', fr: 'Analyses Physiques' },
  'svc.microbiological': { ar: 'التحاليل الميكروبيولوجية', en: 'Microbiological Analysis', fr: 'Analyses Microbiologiques' },
  'svc.samples': { ar: 'تحليل العينات', en: 'Sample Testing', fr: 'Test d\'Échantillons' },
  'svc.specialized': { ar: 'الفحوصات المتخصصة', en: 'Specialized Laboratory Services', fr: 'Examens Spécialisés' },
  'svc.monitoring': { ar: 'مراقبة جودة المياه', en: 'Water Quality Monitoring', fr: 'Contrôle de la Qualité de l\'Eau' },

  // Customer services
  'cs.title': { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services aux Visiteurs' },
  'cs.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Réserver une Visite' },
  'cs.survey': { ar: 'استبيان الرضا', en: 'Satisfaction Survey', fr: 'Enquête de Satisfaction' },
  'cs.enquiry': { ar: 'إرسال استفسار', en: 'Submit Enquiry', fr: 'Envoyer une Demande' },

  // Hero
  'hero.badge': {
    ar: 'المنظومة المخبرية المعتمدة لمراقبة جودة المياه',
    en: 'Accredited Water Quality Laboratory Network',
    fr: 'Réseau Agréé de Contrôle de la Qualité de l\'Eau',
  },
  'hero.title': {
    ar: 'المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي',
    en: 'Southern Sector Laboratory for Drinking Water and Environmental Services',
    fr: 'Laboratoires Centraux des Eaux du Secteur Sud',
  },
  'hero.subtitle': {
    ar: 'دقة التحليل... جودة المياه... سلامة المجتمع',
    en: 'Analytical Precision... Water Quality... Community Safety',
    fr: 'Précision d\'Analyse... Qualité de l\'Eau... Sécurité de la Communauté',
  },
  'hero.desc': {
    ar: 'نظام مخبري مؤسسي متكامل يضم المختبرات المركزية وفروعها الميدانية في عسير، نجران، الباحة، وجازان، لإجراء أدق الفحوصات الكيميائية والفيزيائية والميكروبيولوجية وضمان أعلى معايير السلامة البيئية.',
    en: 'An integrated institutional laboratory network comprising central laboratories and field branches across Asir, Najran, Al-Baha, and Jazan, conducting precision chemical, physical, and microbiological water testing under international standards.',
    fr: 'Un réseau institutionnel intégré comprenant les laboratoires centraux et leurs agences en Asir, Najran, Al-Baha et Jazan, réalisant des analyses chimiques, physiques et microbiologiques de pointe.',
  },
  'hero.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Réserver une Visite' },
  'hero.explore': { ar: 'استكشف مختبراتنا', en: 'Explore Our Laboratories', fr: 'Explorer Nos Laboratoires' },
  'hero.metric.iso': { ar: 'مطابقة المعايير والمواصفات الوطنية', en: 'SASO & National Standards Compliant', fr: 'Conforme aux Normes Nationales SASO' },
  'hero.metric.monitoring': { ar: 'مراقبة مستمرة وجودة موثوقة', en: 'Continuous Quality Monitoring', fr: 'Surveillance Continue de la Qualité' },
  'hero.metric.regions': { ar: 'تغطية شاملة للمنطقة الجنوبية', en: 'Comprehensive Southern Coverage', fr: 'Couverture Intégrale du Sud' },
  'hero.metric.sampleTested': { ar: 'فحص عينات مياه الشرب والآبار', en: 'Drinking & Well Water Analysis', fr: 'Analyses d\'Eau Potable et de Puits' },

  // Quick access
  'quick.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Planifier une Visite' },
  'quick.register.desc': { ar: 'سجل موعد زيارتك لأي فرع إلكترونياً وبكل سهولة', en: 'Register your lab visit easily online for any branch', fr: 'Réservez votre visite en laboratoire en ligne facilement' },
  'quick.survey': { ar: 'استبيان الرضا', en: 'Satisfaction Survey', fr: 'Enquête de Satisfaction' },
  'quick.survey.desc': { ar: 'شاركنا تقييمك وملاحظاتك لتطوير الخدمة', en: 'Share your feedback to help us enhance our services', fr: 'Partagez votre avis pour nous aider à nous améliorer' },
  'quick.enquiry': { ar: 'الاستفسارات', en: 'Enquiries', fr: 'Demandes & Renseignements' },
  'quick.enquiry.desc': { ar: 'أرسل استفسارك وسيقوم فريقنا بالرد السريع', en: 'Submit your questions and our technical team will respond', fr: 'Envoyez votre question, notre équipe vous répondra rapidement' },
  'quick.labs': { ar: 'المراكز والفروع', en: 'Centers & Branches', fr: 'Centres & Filiales' },
  'quick.labs.desc': { ar: 'تعرف على مواقع وقدرات كافة المختبرات بالمنطقة', en: 'Browse locations and analytical capabilities across all labs', fr: 'Découvrez les implantations et capacités de nos laboratoires' },

  // About section
  'about.badge': { ar: 'عن مختبرات المياه', en: 'About Water Laboratories', fr: 'À Propos des Laboratoires' },
  'about.title': { ar: 'منظومة مخبرية رائدة لحماية جودة المياه', en: 'A Leading Laboratory System for Water Quality Protection', fr: 'Un Système de Laboratoires de Référence pour la Qualité de l\'Eau' },
  'about.desc': {
    ar: 'تعمل مختبرات المياه بالقطاع الجنوبي على تعزيز منظومة الأمن المائي عبر إجراء كافة الفحوصات الفيزيائية والكيميائية والميكروبيولوجية لمياه الشرب ومصادر الإمداد، مدعومة بكوادر فنية مؤهلة وأحدث التجهيزات والتقنيات التحليلية العالمية.',
    en: 'Southern Sector Water Laboratories reinforces water security by conducting comprehensive physical, chemical, and microbiological analyses of drinking water and supply sources, powered by certified technical experts and state-of-the-art analytical technologies.',
    fr: 'Les Laboratoires de l\'Eau du Secteur Sud renforcent la sécurité hydrique en effectuant des analyses physiques, chimiques et microbiologiques complètes de l\'eau potable et des sources d\'approvisionnement, appuyés par des spécialistes qualifiés et des équipements de pointe.',
  },
  'about.readmore': { ar: 'اقرأ المزيد عنا', en: 'Read More About Us', fr: 'En Savoir Plus' },
  'about.stat.tests': { ar: 'فحص مخبري سنوياً', en: 'Annual Lab Tests', fr: 'Analyses Annuelles' },
  'about.stat.samples': { ar: 'عينة مفحوصة', en: 'Samples Tested', fr: 'Échantillons Testés' },
  'about.stat.centers': { ar: 'مختبرات مركزية', en: 'Central Laboratories', fr: 'Laboratoires Centraux' },
  'about.stat.branches': { ar: 'فروع ومحطات تابعة', en: 'Branches & Sub-Stations', fr: 'Filiales & Stations' },

  // Network section
  'network.badge': { ar: 'الهيكل والانتشار الجغرافي', en: 'Network & Coverage', fr: 'Réseau et Couverture' },
  'network.title': { ar: 'المختبرات المركزية والفروع التابعة', en: 'Central Centers & Affiliated Branches', fr: 'Centres Centraux et Agences Régionales' },
  'network.desc': {
    ar: 'شبكة مترابطة تغطي كافة محافظات ومناطق القطاع الجنوبي (عسير، نجران، الباحة، جازان) لضمان الفحص السريع والدقيق.',
    en: 'An interconnected network covering all southern governorates and regions (Asir, Najran, Al-Baha, Jazan) ensuring rapid and reliable testing.',
    fr: 'Un réseau interconnecté couvrant toutes les régions du secteur sud (Asir, Najran, Al-Baha, Jazan) assurant des analyses rapides et fiables.',
  },
  'network.branches': { ar: 'الفروع التابعة', en: 'Affiliated Branches', fr: 'Filiales Rattachées' },
  'network.noBranches': { ar: 'لا توجد فروع تابعة حالياً', en: 'No affiliated branches currently', fr: 'Aucune agence rattachée actuellement' },
  'network.independent': { ar: 'مركز إقليمي مستقل', en: 'Independent Regional Center', fr: 'Centre Régional Autonome' },
  'network.central': { ar: 'مختبر مركزي', en: 'Central Laboratory', fr: 'Laboratoire Central' },
  'network.details': { ar: 'عرض تفاصيل المختبر', en: 'View Center Details', fr: 'Voir les Détails du Centre' },
  'network.branch': { ar: 'فرع تابع', en: 'Branch', fr: 'Filiale' },

  // Services
  'services.title': { ar: 'خدمات الفحص والتحليل المخبري', en: 'Laboratory Testing & Analysis Services', fr: 'Services d\'Analyses et d\'Essais en Laboratoire' },
  'services.desc': {
    ar: 'نقدم حزمة شاملة من الفحوصات والتحاليل المعتمدة لمراقبة جودة مياه الشرب والمياه المعالجة والسطحية والجوفية.',
    en: 'We offer a comprehensive suite of accredited testing services to monitor drinking, treated, surface, and groundwater quality.',
    fr: 'Nous proposons une gamme complète d\'analyses accréditées pour surveiller l\'eau potable, traitée, de surface et souterraine.',
  },
  'services.all': { ar: 'عرض جميع الخدمات', en: 'Explore All Services', fr: 'Voir Tous les Services' },
  'services.more': { ar: 'تفاصيل الخدمة', en: 'Service Details', fr: 'Détails du Service' },

  // News
  'news.badge': { ar: 'المركز الإعلامي والمستجدات', en: 'Media Center & Updates', fr: 'Centre Média & Actualités' },
  'news.title': { ar: 'آخر المستجدات والأخبار', en: 'Latest News & Updates', fr: 'Dernières Actualités' },
  'news.desc': {
    ar: 'تابع الإعلانات، وأحدث التطورات التقنية والاعتمادات الدولية لمختبرات المياه.',
    en: 'Stay informed on the latest announcements, technical advances, and certifications across our laboratories.',
    fr: 'Restez informé des annonces, innovations techniques et accréditations de nos laboratoires.',
  },
  'news.readmore': { ar: 'قراءة الخبر', en: 'Read Article', fr: 'Lire l\'Article' },
  'news.allNews': { ar: 'استعراض كافة الأخبار', en: 'Browse All Updates', fr: 'Toutes les Actualités' },
  'news.pause': { ar: 'إيقاف التبديل التلقائي', en: 'Pause Auto-slide', fr: 'Pause Défilement' },
  'news.play': { ar: 'تشغيل التبديل التلقائي', en: 'Play Auto-slide', fr: 'Reprendre Défilement' },
  'news.next': { ar: 'الخبر التالي', en: 'Next Update', fr: 'Actualité Suivante' },
  'news.prev': { ar: 'الخبر السابق', en: 'Previous Update', fr: 'Actualité Précédente' },
  'news.featured': { ar: 'مستجد مميز', en: 'Featured Update', fr: 'À la Une' },

  // Customer services CTA
  'cta.badge': { ar: 'الخدمات الإلكترونية', en: 'Online Services', fr: 'Services en Ligne' },
  'cta.title': { ar: 'خدمات متكاملة لراحة الزوار والعملاء', en: 'Integrated Services for Visitors and Clients', fr: 'Services Intégrés pour Visiteurs et Clients' },
  'cta.desc': {
    ar: 'يمكنك إنجاز كافة معاملاتك وتنسيق زيارتك أو تقديم استفسارك وملاحظاتك عبر منصتنا الموحدة.',
    en: 'Conveniently schedule visits, submit enquiries, and share valuable feedback through our unified portal.',
    fr: 'Planifiez vos visites, soumettez vos demandes et partagez vos avis via notre plateforme unique.',
  },
  'cta.register.desc': { ar: 'احجز موعد زيارة للمختبر المركزي أو أي فرع ترغب به', en: 'Schedule a visit to any central lab or regional branch easily', fr: 'Réservez un créneau de visite dans nos laboratoires' },
  'cta.survey.desc': { ar: 'تقييمك لجودة الخدمة وسرعة الاستجابة يساهم في التحسين المستمر', en: 'Your evaluation helps us continually elevate service quality and response speed', fr: 'Vos retours nous aident à améliorer constamment nos prestations' },
  'cta.enquiry.desc': { ar: 'استفسر عن الفحوصات الفنية والمتطلبات وإصدار النتائج', en: 'Ask questions regarding testing protocols, sample submission, or reports', fr: 'Posez vos questions sur les analyses, échantillons ou résultats' },
  'cta.start': { ar: 'البدء الآن', en: 'Get Started', fr: 'Commencer' },

  // Footer
  'footer.about': {
    ar: 'منظومة مختبرات المياه بالقطاع الجنوبي بالمملكة العربية السعودية، المتخصصة في مراقبة جودة مياه الشرب وتحليل العينات وفق أعلى المواصفات والمعايير العالمية.',
    en: 'Southern Sector Water Laboratories in the Kingdom of Saudi Arabia, dedicated to water quality assurance and sample testing under the highest global standards.',
    fr: 'Réseau des laboratoires de l\'eau du secteur sud en Arabie Saoudite, spécialisé dans le contrôle de la qualité de l\'eau potable selon les normes internationales les plus exigeantes.',
  },
  'footer.centers': { ar: 'المراكز والفروع', en: 'Centers & Branches', fr: 'Centres & Filiales' },
  'footer.services': { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services Visiteurs' },
  'footer.quicklinks': { ar: 'روابط هامة', en: 'Quick Links', fr: 'Liens Utiles' },
  'footer.contact': { ar: 'معلومات التواصل', en: 'Contact Details', fr: 'Coordonnées' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved', fr: 'Tous droits réservés' },
  'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy', fr: 'Politique de Confidentialité' },
  'footer.terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions', fr: 'Conditions Générales' },
  'footer.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },

  // Breadcrumb
  'breadcrumb.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },

  // Register page
  'register.title': { ar: 'تسجيل زيارة للمختبر', en: 'Register a Lab Visit', fr: 'Enregistrer une Visite' },
  'register.desc': {
    ar: 'قم بملء النموذج التالي لتسجيل زيارتك الميدانية أو الفنية إلى أي من مختبرات القطاع الجنوبي.',
    en: 'Fill in the form below to register your technical or field visit to any Southern Sector laboratory.',
    fr: 'Remplissez le formulaire ci-dessous pour enregistrer votre visite technique auprès de nos laboratoires.',
  },
  'register.visitor': { ar: 'بيانات الزائر الشخصية', en: 'Visitor Information', fr: 'Informations sur le Visiteur' },
  'register.visit': { ar: 'تفاصيل الزيارة المطلوبة', en: 'Visit Specifications', fr: 'Détails de la Visite' },
  'register.firstName': { ar: 'الاسم الأول', en: 'First Name', fr: 'Prénom' },
  'register.lastName': { ar: 'اسم العائلة / اللقب', en: 'Last Name', fr: 'Nom de famille' },
  'register.nationalId': { ar: 'رقم الهوية الوطنية / الإقامة / جواز السفر', en: 'National ID / Passport', fr: 'N° Carte Nationale / Passeport' },
  'register.employee': { ar: 'الموظف / المسؤول المطلوب مقابلته', en: 'Employee / Official to Visit', fr: 'Personne / Employé à Rencontrer' },
  'register.arrivalTime': { ar: 'وقت الوصول المتوقع', en: 'Expected Arrival Time', fr: 'Heure d\'Arrivée Prévue' },
  'register.branch': { ar: 'الفرع المستهدف (اختياري)', en: 'Branch (optional)', fr: 'Agence (facultatif)' },
  'register.department': { ar: 'القسم أو الإدارة المستهدفة', en: 'Department / Unit', fr: 'Département / Service' },
  'register.name': { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom Complet' },
  'register.namePlaceholder': { ar: 'مثال: م. فهد القحطاني', en: 'e.g. Eng. Fahad Al-Qahtani', fr: 'ex: Ing. Fahad Al-Qahtani' },
  'register.company': { ar: 'الجهة / المنظمة (اختياري)', en: 'Organization / Company (optional)', fr: 'Organisme / Société (facultatif)' },
  'register.companyPlaceholder': { ar: 'مثال: شركة المياه الوطنية', en: 'e.g. National Water Company', fr: 'ex: Compagnie Nationale des Eaux' },
  'register.jobTitle': { ar: 'المسمى الوظيفي (اختياري)', en: 'Job Title (optional)', fr: 'Poste / Titre (facultatif)' },
  'register.jobTitlePlaceholder': { ar: 'مثال: أخصائي رقابة جودة', en: 'e.g. Quality Control Specialist', fr: 'ex: Spécialiste Contrôle Qualité' },
  'register.phone': { ar: 'رقم الهاتف المحمول', en: 'Mobile Phone', fr: 'Téléphone Mobile' },
  'register.phonePlaceholder': { ar: '05xxxxxxxx', en: '+966 5x xxx xxxx', fr: '+966 5x xxx xxxx' },
  'register.email': { ar: 'البريد الإلكتروني', en: 'Email Address', fr: 'Adresse Email' },
  'register.emailPlaceholder': { ar: 'name@example.com', en: 'name@example.com', fr: 'nom@exemple.com' },
  'register.date': { ar: 'تاريخ الزيارة المقترح', en: 'Proposed Visit Date', fr: 'Date Prévue de Visite' },
  'register.lab': { ar: 'المختبر المستهدف', en: 'Target Laboratory', fr: 'Laboratoire Choisi' },
  'register.selectBranch': { ar: '-- المختبر الرئيسي (بدون فرع) --', en: '-- Central Laboratory (Main) --', fr: '-- Laboratoire Central (Sans agence) --' },
  'register.purpose': { ar: 'الغرض من الزيارة', en: 'Purpose of Visit', fr: 'Motif de la Visite' },
  'register.purposePlaceholder': { ar: 'مثال: تسليم عينات مياه، فحص مشترك، تدريب، جولة تفقدية...', en: 'e.g. Sample delivery, joint inspection, training, inspection tour...', fr: 'ex: Dépôt d\'échantillons, contrôle conjoint, formation, audit...' },
  'register.notes': { ar: 'ملاحظات أو متطلبات إضافية (اختياري)', en: 'Additional Notes or Requirements (optional)', fr: 'Remarques ou Besoins Particuliers (facultatif)' },
  'register.notesPlaceholder': { ar: 'أي تفاصيل تود إبلاغ المختبر بها مسبقاً...', en: 'Any details you wish to communicate in advance...', fr: 'Précisions utiles à transmettre au laboratoire...' },
  'register.submit': { ar: 'تأكيد وحفظ الزيارة', en: 'Confirm & Submit Visit', fr: 'Confirmer et Enregistrer' },
  'register.submitting': { ar: 'جاري تسجيل الزيارة...', en: 'Registering visit...', fr: 'Enregistrement en cours...' },
  'register.required': { ar: 'هذا الحقل مطلوب', en: 'This field is required', fr: 'Ce champ est obligatoire' },
  'register.selectLab': { ar: '-- اختر المختبر المطلوب زيارته --', en: '-- Select target laboratory --', fr: '-- Sélectionnez le laboratoire --' },
  'register.error': { ar: 'حدث خطأ أثناء تسجيل الزيارة. يرجى التحقق من البيانات والمحاولة مجدداً.', en: 'An error occurred during registration. Please review the details and try again.', fr: 'Une erreur s\'est produite. Veuillez vérifier vos informations et réessayer.' },

  // Purposes
  'purpose.meeting': { ar: 'اجتماع عمل رسمي', en: 'Business Meeting', fr: 'Réunion de travail' },
  'purpose.maintenance': { ar: 'صيانة ومعايرة الأجهزة', en: 'Equipment Service / Maintenance', fr: 'Maintenance et entretien' },
  'purpose.samples': { ar: 'تسليم واستلام عينات مياه', en: 'Sample Delivery', fr: 'Dépôt d\'échantillons' },
  'purpose.audit': { ar: 'تدقيق وتفتيش بيئي / جودة', en: 'Audit / Inspection', fr: 'Audit et inspection' },
  'purpose.training': { ar: 'تدريب وتأهيل فني', en: 'Training', fr: 'Formation technique' },
  'purpose.interview': { ar: 'مقابلة توظيف', en: 'Job Interview', fr: 'Entretien d\'embauche' },
  'purpose.vendor': { ar: 'عرض شركات وموردين', en: 'Vendor Presentation', fr: 'Présentation fournisseur' },
  'purpose.research': { ar: 'تعاون بحثي وأكاديمي', en: 'Research Collaboration', fr: 'Collaboration de recherche' },
  'purpose.other': { ar: 'أخرى (حدد في الملاحظات)', en: 'Other', fr: 'Autre' },

  // Survey Questions & Options
  'survey.lab': { ar: 'المختبر الذي تعاملت معه', en: 'Laboratory Visited / Contacted', fr: 'Laboratoire concerné' },
  'survey.branch': { ar: 'الفرع التابع (اختياري)', en: 'Branch (optional)', fr: 'Agence (facultatif)' },
  'survey.serviceUsed': { ar: 'ما هي الخدمة التي استفدت منها اليوم؟', en: 'What service did you use today?', fr: 'Quel service avez-vous utilisé aujourd\'hui ?' },
  'survey.selectService': { ar: '-- اختر الخدمة المستخدمة --', en: '-- Select service used --', fr: '-- Sélectionnez le service --' },
  'survey.howHeard': { ar: 'كيف تعرفت على خدماتنا؟', en: 'How did you hear about us?', fr: 'Comment avez-vous connu nos services ?' },
  'survey.source.website': { ar: 'الموقع الإلكتروني', en: 'Website', fr: 'Site Web' },
  'survey.source.social': { ar: 'شبكات التواصل الاجتماعي', en: 'Social Media', fr: 'Réseaux sociaux' },
  'survey.source.gov': { ar: 'جهة حكومية', en: 'Government Agency', fr: 'Organisme public' },
  'survey.source.company': { ar: 'الشركة / جهة العمل', en: 'Company / Employer', fr: 'Entreprise' },
  'survey.source.friend': { ar: 'صديق أو زميل عمل', en: 'Friend / Colleagues', fr: 'Ami / Collègues' },
  'survey.source.other': { ar: 'مصدر آخر', en: 'Other', fr: 'Autre' },
  'survey.overallSat': { ar: 'مستوى الرضا العام عن التجربة', en: 'Overall Satisfaction', fr: 'Satisfaction Globale' },
  'survey.sat.veryDissatisfied': { ar: 'غير راضٍ تماماً', en: 'Very Dissatisfied', fr: 'Très insatisfait' },
  'survey.sat.dissatisfied': { ar: 'غير راضٍ', en: 'Dissatisfied', fr: 'Insatisfait' },
  'survey.sat.neutral': { ar: 'محايد', en: 'Neutral', fr: 'Neutre' },
  'survey.sat.satisfied': { ar: 'راضٍ', en: 'Satisfied', fr: 'Satisfait' },
  'survey.sat.verySatisfied': { ar: 'راضٍ تماماً', en: 'Very Satisfied', fr: 'Très satisfait' },
  'survey.ratingsTitle': { ar: 'تقييم معايير الخدمة (من 1 إلى 5)', en: 'Service Criteria Ratings (1 to 5)', fr: 'Évaluation des Critères (de 1 à 5)' },
  'survey.staffProf': { ar: 'مهنية وتعامل فريق العمل', en: 'Staff professionalism', fr: 'Professionnalisme du personnel' },
  'survey.serviceSpeed': { ar: 'سرعة إنجاز الخدمة', en: 'Speed of service', fr: 'Rapidité de prise en charge' },
  'survey.sampleSubmission': { ar: 'سهولة وإجراءات تسليم العينات', en: 'Ease of submitting samples', fr: 'Facilité de dépôt des échantillons' },
  'survey.reportClarity': { ar: 'وضوح ودقة تقارير الفحص المخبري', en: 'Clarity of test reports', fr: 'Clarté des rapports d\'analyse' },
  'survey.comm': { ar: 'التواصل والتحديثات الدورية', en: 'Communication and updates', fr: 'Communication et suivi' },
  'survey.cleanliness': { ar: 'نظافة وتنظيم مرافق المختبر', en: 'Laboratory cleanliness', fr: 'Propreté et organisation du laboratoire' },
  'survey.overallExp': { ar: 'التجربة الإجمالية للزيارة / الخدمة', en: 'Overall experience', fr: 'Expérience globale' },
  'survey.resultsOnTime': { ar: 'هل تم استلام نتائج التحاليل ضمن الوقت المتوقع؟', en: 'Results received within expected time?', fr: 'Les résultats ont-ils été reçus dans les délais prévus ?' },
  'survey.yesPartialNo.yes': { ar: 'نعم', en: 'Yes', fr: 'Oui' },
  'survey.yesPartialNo.partial': { ar: 'جزئياً', en: 'Partially', fr: 'Partiellement' },
  'survey.yesPartialNo.no': { ar: 'لا', en: 'No', fr: 'Non' },
  'survey.reportsEasy': { ar: 'هل كانت تقارير التحاليل سهلة الفهم ومفصلة؟', en: 'Were the reports easy to understand?', fr: 'Les rapports étaient-ils faciles à comprendre ?' },
  'survey.yesSomeNo.yes': { ar: 'نعم', en: 'Yes', fr: 'Oui' },
  'survey.yesSomeNo.somewhat': { ar: 'إلى حد ما', en: 'Somewhat', fr: 'Moyennement' },
  'survey.yesSomeNo.no': { ar: 'لا', en: 'No', fr: 'Non' },
  'survey.recommendTitle': { ar: 'ما مدى احتمالية ترشيحك لمختبراتنا لزملائك؟ (0 = غير محتمل، 10 = محتمل جداً)', en: 'How likely are you to recommend our laboratories? (0 = Not likely, 10 = Very likely)', fr: 'Recommanderiez-vous nos laboratoires ? (0 = Peu probable, 10 = Très probable)' },
  'survey.likedMost': { ar: 'ما أكثر ما نال إعجابك في خدماتنا؟', en: 'What did you like most?', fr: 'Qu\'avez-vous le plus apprécié ?' },
  'survey.improvements': { ar: 'ما هي المقترحات أو الجوانب التي يمكننا تحسينها؟', en: 'What can we improve?', fr: 'Quels points pourrions-nous améliorer ?' },
  'survey.contactMe': { ar: 'هل ترغب في أن يتواصل معك فريق المختبر لمناقشة ملاحظاتك؟', en: 'Would you like us to contact you?', fr: 'Souhaitez-vous être recontacté ?' },
  'survey.additionalComments': { ar: 'أي تعليقات أو ملاحظات إضافية تود مشاركتها؟', en: 'Additional comments', fr: 'Commentaires supplémentaires' },
  'survey.successMsg': { ar: 'تم إرسال الاستبيان بنجاح.', en: 'Your survey has been submitted successfully.', fr: 'Votre questionnaire a été envoyé avec succès.' },
  'survey.errorMsg': { ar: 'تعذر إرسال الاستبيان. يرجى المحاولة مرة أخرى.', en: 'We could not submit the survey. Please try again.', fr: 'Nous n\'avons pas pu envoyer le questionnaire. Veuillez réessayer.' },

  // Enquiry Specific
  'enquiry.lab': { ar: 'المختبر الموجه له الاستفسار', en: 'Laboratory', fr: 'Laboratoire destinataire' },
  'enquiry.branch': { ar: 'الفرع المستهدف (اختياري)', en: 'Branch (optional)', fr: 'Agence (facultatif)' },
  'enquiry.fullName': { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom Complet' },
  'enquiry.company': { ar: 'اسم الجهة / الشركة (اختياري)', en: 'Company Name (optional)', fr: 'Société / Organisme (facultatif)' },
  'enquiry.email': { ar: 'البريد الإلكتروني للتواصل', en: 'Email Address', fr: 'Adresse Email' },
  'enquiry.phone': { ar: 'رقم الهاتف (اختياري)', en: 'Phone Number (optional)', fr: 'Numéro de Téléphone (facultatif)' },
  'enquiry.location': { ar: 'الدولة / السوق', en: 'Location / Market', fr: 'Pays / Marché' },
  'enquiry.serviceRequired': { ar: 'الخدمة المطلوبة', en: 'Service Required', fr: 'Service Requis' },
  'enquiry.selectService': { ar: '-- اختر الخدمة المطلوبة --', en: '-- Select required service --', fr: '-- Sélectionnez le service --' },
  'enquiry.subject': { ar: 'موضوع الاستفسار', en: 'Subject', fr: 'Objet de la demande' },
  'enquiry.message': { ar: 'نص الرسالة أو الاستفسار بالتفصيل', en: 'Message', fr: 'Message détaillé' },
  'enquiry.successMsg': { ar: 'تم إرسال استفسارك بنجاح.', en: 'Your enquiry has been submitted successfully.', fr: 'Votre demande a été envoyée avec succès.' },
  'enquiry.errorMsg': { ar: 'تعذر إرسال الاستفسار. يرجى المحاولة مرة أخرى.', en: 'We could not submit your enquiry. Please try again.', fr: 'Nous n\'avons pas pu envoyer votre demande. Veuillez réessayer.' },

  // Success page
  'success.title': { ar: 'تم تسجيل زيارتك بنجاح!', en: 'Visit Registered Successfully!', fr: 'Visite Enregistrée avec Succès !' },
  'success.desc': {
    ar: 'تم حفظ بيانات زيارتك في النظام بنجاح. يرجى الاحتفاظ برقم المرجع أو تحميل بطاقة الزائر لإبرازها عند الوصول.',
    en: 'Your visit has been registered. Please keep your reference number or download your badge to present upon arrival.',
    fr: 'Votre visite est bien enregistrée. Veuillez conserver votre numéro de référence ou télécharger votre badge à présenter à l\'arrivée.',
  },
  'success.ref': { ar: 'الرقم المرجعي للزيارة', en: 'Visit Reference ID', fr: 'Numéro de Référence' },
  'success.badge': { ar: 'تحميل / طباعة بطاقة الزائر', en: 'Download / Print Visitor Badge', fr: 'Télécharger / Imprimer le Badge' },
  'success.home': { ar: 'العودة للصفحة الرئيسية', en: 'Return to Home', fr: 'Retour à l\'Accueil' },
  'success.rate': { ar: 'تقييم تجربة الاستخدام', en: 'Rate Service Experience', fr: 'Évaluer notre Service' },
  'success.loading': { ar: 'جاري استرجاع بيانات الزيارة...', en: 'Retrieving visit records...', fr: 'Chargement des données de visite...' },
  'success.notFound': { ar: 'تعذر العثور على سجل الزيارة المطلوب.', en: 'Requested visit record not found.', fr: 'Dossier de visite introuvable.' },
  'success.back': { ar: 'الرجوع لصفحة التسجيل', en: 'Back to Registration', fr: 'Retour au Formulaire' },

  // Visitor detail
  'visitor.title': { ar: 'تفاصيل بطاقة الزائر', en: 'Visitor Badge Details', fr: 'Détails du Badge Visiteur' },
  'visitor.badgeTitle': { ar: 'بطاقة زائر معتمدة', en: 'Official Visitor Pass', fr: 'Pass Visiteur Officiel' },
  'visitor.name': { ar: 'اسم الزائر', en: 'Visitor Name', fr: 'Nom du Visiteur' },
  'visitor.date': { ar: 'تاريخ الزيارة', en: 'Visit Date', fr: 'Date de Visite' },
  'visitor.lab': { ar: 'المختبر المستهدف', en: 'Target Laboratory', fr: 'Laboratoire Visé' },
  'visitor.purpose': { ar: 'الغرض من الزيارة', en: 'Purpose of Visit', fr: 'Motif de Visite' },
  'visitor.phone': { ar: 'رقم الهاتف', en: 'Phone', fr: 'Téléphone' },
  'visitor.email': { ar: 'البريد الإلكتروني', en: 'Email', fr: 'Email' },
  'visitor.org': { ar: 'الجهة / المنظمة', en: 'Organization', fr: 'Organisation' },
  'visitor.title2': { ar: 'المسمى الوظيفي', en: 'Job Title', fr: 'Fonction' },
  'visitor.ref': { ar: 'الرقم المرجعي', en: 'Reference ID', fr: 'Identifiant' },
  'visitor.notes': { ar: 'ملاحظات إضافية', en: 'Additional Notes', fr: 'Remarques' },
  'visitor.notFound': { ar: 'لم يتم العثور على بيانات الزائر', en: 'Visitor record not found', fr: 'Dossier visiteur introuvable' },
  'visitor.backHome': { ar: 'العودة للرئيسية', en: 'Back to Home', fr: 'Retour à l\'Accueil' },
  'visitor.downloadBadge': { ar: 'تحميل بطاقة الزائر', en: 'Download Visitor Pass', fr: 'Télécharger le Pass' },

  // Status
  'status.pending': { ar: 'قيد الانتظار', en: 'Pending', fr: 'En Attente' },
  'status.checked_in': { ar: 'تم الدخول', en: 'Checked In', fr: 'Enregistré / Présent' },
  'status.checked_out': { ar: 'تمت المغادرة', en: 'Checked Out', fr: 'Visite Clôturée' },
  'status.new': { ar: 'جديد', en: 'New', fr: 'Nouveau' },
  'status.responded': { ar: 'تم الرد', en: 'Responded', fr: 'Répondu' },
  'status.closed': { ar: 'مغلق', en: 'Closed', fr: 'Fermé' },

  // Survey
  'survey.title': { ar: 'استبيان قياس رضا المستفيدين', en: 'Beneficiary Satisfaction Survey', fr: 'Enquête de Satisfaction des Usagers' },
  'survey.desc': {
    ar: 'ملاحظاتكم وتقييماتكم تسهم بشكل مباشر في رفع كفاءة الخدمات وتطوير آليات العمل بمختبرات المياه.',
    en: 'Your feedback and ratings directly contribute to enhancing service efficiency and laboratory operations.',
    fr: 'Vos remarques et évaluations contribuent directement à améliorer la qualité et l\'efficacité de nos laboratoires.',
  },
  'survey.name': { ar: 'الاسم (اختياري)', en: 'Name (optional)', fr: 'Nom (facultatif)' },
  'survey.contact': { ar: 'معلومات التواصل (هاتف أو بريد اختياري)', en: 'Contact info (phone or email, optional)', fr: 'Coordonnées (téléphone ou email, facultatif)' },
  'survey.quality': { ar: 'تقييم جودة ودقة الفحوصات والخدمات', en: 'Service & Analysis Quality Rating', fr: 'Qualité et Précision des Prestations' },
  'survey.facility': { ar: 'تقييم التجهيزات ومرافق المختبر', en: 'Lab Facilities & Equipment', fr: 'Équipements et Locaux du Laboratoire' },
  'survey.staff': { ar: 'تعامل الكادر الفني والإداري وسرعة الاستجابة', en: 'Staff Professionalism & Responsiveness', fr: 'Professionnalisme et Réactivité du Personnel' },
  'survey.overall': { ar: 'التقييم العام للمختبر', en: 'Overall Experience Rating', fr: 'Évaluation Globale' },
  'survey.recommend': { ar: 'هل توصي بالتعامل مع مختبرات القطاع الجنوبي؟', en: 'Would you recommend Southern Sector Labs to others?', fr: 'Recommanderiez-vous les laboratoires du secteur sud ?' },
  'survey.yes': { ar: 'نعم، بكل تأكيد', en: 'Yes, definitely', fr: 'Oui, tout à fait' },
  'survey.no': { ar: 'لا', en: 'No', fr: 'Non' },
  'survey.comments': { ar: 'مقترحات أو ملاحظات للتطوير والتحسين', en: 'Suggestions or Comments for Improvement', fr: 'Suggestions ou Remarques d\'Amélioration' },
  'survey.submit': { ar: 'إرسال الاستبيان', en: 'Submit Survey', fr: 'Envoyer l\'Enquête' },
  'survey.submitting': { ar: 'جاري إرسال الاستبيان...', en: 'Submitting survey...', fr: 'Envoi en cours...' },
  'survey.success': { ar: 'شكراً جزيلاً لتقييمك!', en: 'Thank You for Your Feedback!', fr: 'Merci pour Votre Évaluation !' },
  'survey.successDesc': {
    ar: 'تم استلام استبيانك بنجاح. نقدر وقتك وملاحظاتك القيمة لتطوير مستوى خدماتنا.',
    en: 'Your response has been recorded. We value your insights to help us continuously enhance our services.',
    fr: 'Votre retour a bien été enregistré. Nous vous remercions pour vos précieuses contributions.',
  },
  'survey.error': { ar: 'حدث خطأ أثناء حفظ الاستبيان. يرجى المحاولة مرة أخرى.', en: 'An error occurred while submitting your survey. Please try again.', fr: 'Une erreur s\'est produite. Veuillez réessayer.' },
  'survey.rating': { ar: 'يرجى تحديد التقييم بالنجوم', en: 'Please select a star rating', fr: 'Veuillez attribuer une note' },

  // Enquiry
  'enquiry.title': { ar: 'طلب استفسار أو استشارة مخبرية', en: 'Submit Enquiry or Consultation', fr: 'Demande de Renseignement ou d\'Analyse' },
  'enquiry.desc': {
    ar: 'يسعدنا الرد على استفساراتكم الفنية والتشغيلية وتقديم الدعم بخصوص تحاليل جودة المياه.',
    en: 'We are delighted to answer your technical questions and assist you with all water quality testing needs.',
    fr: 'Nous répondons avec plaisir à vos questions techniques et vous accompagnons pour vos besoins d\'analyse de l\'eau.',
  },
  'enquiry.name': { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom Complet' },
  'enquiry.contact': { ar: 'معلومات التواصل (رقم الهاتف أو البريد)', en: 'Contact Details (phone or email)', fr: 'Coordonnées (téléphone ou email)' },
  'enquiry.subject': { ar: 'موضوع الاستفسار', en: 'Subject', fr: 'Objet de la Demande' },
  'enquiry.message': { ar: 'تفاصيل الاستفسار أو الرسالة', en: 'Enquiry Message / Description', fr: 'Message / Précisions' },
  'enquiry.submit': { ar: 'إرسال الاستفسار', en: 'Send Enquiry', fr: 'Envoyer la Demande' },
  'enquiry.submitting': { ar: 'جاري الإرسال...', en: 'Sending...', fr: 'Envoi en cours...' },
  'enquiry.success': { ar: 'تم إرسال استفسارك بنجاح!', en: 'Your Enquiry Was Sent Successfully!', fr: 'Votre Demande a été Envoyée avec Succès !' },
  'enquiry.successDesc': {
    ar: 'شكراً لتواصلك مع مختبرات المياه. تم تحويل استفسارك إلى الفريق الفني وسنتواصل معك قريباً.',
    en: 'Thank you for contacting Water Laboratories. Your request has been routed to our technical team and we will respond promptly.',
    fr: 'Merci d\'avoir contacté nos laboratoires. Votre demande est transmise à l\'équipe technique et nous vous répondrons dans les plus brefs délais.',
  },
  'enquiry.error': { ar: 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة لاحقاً.', en: 'An error occurred while sending your enquiry. Please try again later.', fr: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' },

  // Admin
  'admin.title': { ar: 'لوحة التحكم المركزية', en: 'Central Management Dashboard', fr: 'Tableau de Bord Central' },
  'admin.login': { ar: 'تسجيل دخول المسؤولين', en: 'Admin Portal Login', fr: 'Connexion Espace Administrateur' },
  'admin.username': { ar: 'اسم المستخدم', en: 'Username', fr: 'Nom d\'Utilisateur' },
  'admin.password': { ar: 'كلمة المرور', en: 'Password', fr: 'Mot de Passe' },
  'admin.loginBtn': { ar: 'دخول النظام', en: 'Sign In', fr: 'Se Connecter' },
  'admin.welcome': { ar: 'مرحباً بك', en: 'Welcome', fr: 'Bienvenue' },
  'admin.logout': { ar: 'تسجيل الخروج', en: 'Log Out', fr: 'Déconnexion' },
  'admin.dashboard': { ar: 'لوحة الإحصائيات', en: 'Overview', fr: 'Vue d\'Ensemble' },
  'admin.visitors': { ar: 'سجل الزوار', en: 'Visitors Log', fr: 'Registre des Visiteurs' },
  'admin.surveys': { ar: 'استبيانات الرضا', en: 'Surveys', fr: 'Enquêtes' },
  'admin.enquiries': { ar: 'الاستفسارات والرسائل', en: 'Enquiries & Messages', fr: 'Demandes & Messages' },
  'admin.users': { ar: 'إدارة المستخدمين', en: 'User Management', fr: 'Gestion des Utilisateurs' },
  'admin.totalVisitors': { ar: 'إجمالي الزيارات المسجلة', en: 'Total Registered Visits', fr: 'Total des Visites' },
  'admin.export': { ar: 'تصدير البيانات (CSV)', en: 'Export (CSV)', fr: 'Exporter (CSV)' },
  'admin.search': { ar: 'بحث سريع بالاسم، الهاتف، الجهة...', en: 'Quick search by name, phone, lab...', fr: 'Recherche par nom, tél, labo...' },
  'admin.noData': { ar: 'لا توجد بيانات مسجلة حالياً', en: 'No data records found', fr: 'Aucune donnée enregistrée' },
  'admin.addUser': { ar: 'إضافة مسؤول جديد', en: 'Add New Admin', fr: 'Ajouter un Utilisateur' },
  'admin.editUser': { ar: 'تعديل بيانات المستخدم', en: 'Edit User Account', fr: 'Modifier l\'Utilisateur' },
  'admin.fullName': { ar: 'الاسم الكامل للمسؤول', en: 'Full Name', fr: 'Nom Complet' },
  'admin.role': { ar: 'الصلاحية / الدور', en: 'Role / Permission', fr: 'Rôle / Permissions' },
  'admin.roleUser': { ar: 'مشغل / مستخدم', en: 'Operator / Staff', fr: 'Opérateur / Agent' },
  'admin.roleAdmin': { ar: 'مدير نظام', en: 'System Administrator', fr: 'Administrateur Système' },
  'admin.save': { ar: 'حفظ التغييرات', en: 'Save Changes', fr: 'Enregistrer' },
  'admin.add': { ar: 'إضافة الحساب', en: 'Create Account', fr: 'Créer le Compte' },
  'admin.cancel': { ar: 'إلغاء', en: 'Cancel', fr: 'Annuler' },
  'admin.delete': { ar: 'حذف', en: 'Delete', fr: 'Supprimer' },
  'admin.confirmDelete': { ar: 'هل أنت متأكد من رغبتك في حذف هذا العنصر؟', en: 'Are you sure you want to delete this record?', fr: 'Êtes-vous sûr de vouloir supprimer cet élément ?' },
  'admin.confirmDeleteVisitor': { ar: 'هل أنت متأكد من حذف هذا الزائر؟', en: 'Are you sure you want to delete this visitor?', fr: 'Êtes-vous sûr de vouloir supprimer ce visiteur ?' },
  'admin.confirmDeleteSurvey': { ar: 'هل أنت متأكد من حذف هذا الاستبيان؟', en: 'Are you sure you want to delete this survey?', fr: 'Êtes-vous sûr de vouloir supprimer cette enquête ?' },
  'admin.confirmDeleteEnquiry': { ar: 'هل أنت متأكد من حذف هذا الاستفسار؟', en: 'Are you sure you want to delete this enquiry?', fr: 'Êtes-vous sûr de vouloir supprimer cette demande ?' },
  'admin.confirmDeleteUser': { ar: 'هل أنت متأكد من حذف هذا المستخدم؟', en: 'Are you sure you want to delete this user?', fr: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' },
  'admin.cannotDeleteSelf': { ar: 'لا يمكنك حذف حسابك الحالي', en: 'You cannot delete your own account', fr: 'Vous ne pouvez pas supprimer votre propre compte' },
  'admin.requiredFields': { ar: 'يرجى ملء جميع الحقول المطلوبة', en: 'Please fill in all required fields', fr: 'Veuillez remplir tous les champs obligatoires' },
  'admin.passwordRequired': { ar: 'كلمة المرور مطلوبة للمستخدم الجديد', en: 'Password is required for new users', fr: 'Le mot de passe est obligatoire pour un nouvel utilisateur' },
  'admin.leaveBlank': { ar: 'اتركها فارغة للإبقاء عليها', en: 'leave blank to keep current', fr: 'laisser vide pour conserver' },
  'admin.invalidCredentials': { ar: 'اسم المستخدم أو كلمة المرور غير صحيحة', en: 'Invalid username or password', fr: 'Nom d\'utilisateur ou mot de passe incorrect' },
  'admin.totalSurveys': { ar: 'إجمالي الاستبيانات', en: 'Total Surveys', fr: 'Total des Enquêtes' },
  'admin.totalEnquiries': { ar: 'إجمالي الاستفسارات', en: 'Total Enquiries', fr: 'Total des Demandes' },
  'admin.totalUsers': { ar: 'المستخدمون والمسؤولون', en: 'Users & Admins', fr: 'Utilisateurs & Admins' },
  'admin.pending': { ar: 'في الانتظار', en: 'Pending', fr: 'En Attente' },
  'admin.checkedIn': { ar: 'تم الدخول', en: 'Checked In', fr: 'Enregistré' },
  'admin.checkedOut': { ar: 'تم المغادرة', en: 'Checked Out', fr: 'Visite Terminée' },
  'admin.new': { ar: 'جديد', en: 'New', fr: 'Nouveau' },
  'admin.responded': { ar: 'تم الرد', en: 'Responded', fr: 'Répondu' },
  'admin.closed': { ar: 'مغلق', en: 'Closed', fr: 'Fermé' },
  'admin.status': { ar: 'الحالة', en: 'Status', fr: 'Statut' },
  'admin.loginError': { ar: 'اسم المستخدم أو كلمة المرور غير صحيحة', en: 'Invalid username or password', fr: 'Nom d\'utilisateur ou mot de passe incorrect' },
  'admin.fillFields': { ar: 'يرجى تعبئة اسم المستخدم وكلمة المرور', en: 'Please enter both username and password', fr: 'Veuillez saisir votre identifiant et mot de passe' },
  'admin.loginError2': { ar: 'تعذر الاتصال بالخادم للتحقق من الصلاحيات', en: 'Failed to verify admin credentials', fr: 'Impossible de vérifier vos identifiants' },
  'admin.passwordKeep': { ar: '(اتركها فارغة إذا كنت لا ترغب بتغييرها)', en: '(leave empty to keep current password)', fr: '(laisser vide pour conserver le mot de passe)' },
  'admin.unknown': { ar: 'مجهول', en: 'Anonymous', fr: 'Anonyme' },
  'admin.recommend': { ar: 'يوصي بالمختبر', en: 'Recommends Lab', fr: 'Recommande le Labo' },
  'admin.noSurveys': { ar: 'لا توجد استبيانات مسجلة بعد', en: 'No surveys submitted yet', fr: 'Aucune enquête pour le moment' },
  'admin.noEnquiries': { ar: 'لا توجد استفسارات واردة حالياً', en: 'No enquiries received yet', fr: 'Aucune demande pour le moment' },
  'admin.noUsers': { ar: 'لا يوجد حسابات مسؤولين', en: 'No user accounts found', fr: 'Aucun compte utilisateur trouvé' },
  'admin.userExists': { ar: 'اسم المستخدم محجوز لحساب آخر', en: 'Username already taken', fr: 'Ce nom d\'utilisateur est déjà utilisé' },
  'admin.saveError': { ar: 'حدث خطأ أثناء عملية الحفظ', en: 'An error occurred while saving', fr: 'Une erreur est survenue lors de l\'enregistrement' },
  'admin.cantDeleteSelf': { ar: 'لا يمكنك حذف حسابك الذي قمت بتسجيل الدخول به', en: 'You cannot delete your own logged-in account', fr: 'Vous ne pouvez pas supprimer votre propre compte actif' },
  'admin.statusUpdate': { ar: 'تحديث الحالة', en: 'Update Status', fr: 'Modifier le Statut' },
  'admin.actions': { ar: 'الإجراءات', en: 'Actions', fr: 'Actions' },
  'admin.date': { ar: 'التاريخ', en: 'Date', fr: 'Date' },
  'admin.details': { ar: 'التفاصيل', en: 'Details', fr: 'Détails' },

  // Branch
  'branch.subBranch': { ar: 'فرع تابع', en: 'Affiliated Branch', fr: 'Agence Rattachée' },
  'branch.parentCenter': { ar: 'المركز الرئيسي التابع له', en: 'Parent Center', fr: 'Centre Principal de Rattachement' },
  'branch.quickActions': { ar: 'إجراءات سريعة', en: 'Quick Actions', fr: 'Actions Rapides' },
  'branch.otherBranches': { ar: 'فروع أخرى تابعة للمركز', en: 'Other Branches Under This Center', fr: 'Autres Agences de ce Centre' },
  'branch.backToCenter': { ar: 'العودة إلى', en: 'Back to', fr: 'Retour à' },
  'visitor.details': { ar: 'بيانات الزائر', en: 'Visitor Details', fr: 'Détails du Visiteur' },

  // Contact page
  'contact.title': { ar: 'تواصل مع مختبرات المياه', en: 'Contact Southern Water Laboratories', fr: 'Contacter les Laboratoires d\'Eau' },
  'contact.desc': {
    ar: 'يسعدنا استقبال استفساراتكم الميدانية والفنية وتقديم الدعم المباشر حول فحص وتحليل جودة المياه عبر قنوات الاتصال الرسمية.',
    en: 'We are pleased to answer your field and technical inquiries and provide direct support regarding water quality testing through our official channels.',
    fr: 'Nous sommes à votre disposition pour toute demande technique et vous accompagnons pour vos besoins d\'analyse de l\'eau par nos canaux officiels.',
  },
  'contact.phone': { ar: 'رقم الهاتف الموحد', en: 'Central Telephone', fr: 'Téléphone Central' },
  'contact.email': { ar: 'البريد الإلكتروني الرسمي', en: 'Official Email', fr: 'Email Officiel' },
  'contact.address': { ar: 'المقر والإدارة', en: 'Headquarters & Address', fr: 'Siège & Adresse' },
  'contact.hours': { ar: 'ساعات العمل الرسمية', en: 'Official Working Hours', fr: 'Horaires d\'Ouverture' },
  'contact.sendMsg': { ar: 'راسلنا مباشرة عبر المنصة', en: 'Send an Official Request Online', fr: 'Envoyez-nous un Message Direct' },
  'contact.toEnquiry': {
    ar: 'لطلبات الفحص والاستشارات المخبرية والاستفسارات، يرجى الانتقال إلى نموذج الاستفسار المخصص للمتابعة والرد الفوري.',
    en: 'For lab analysis requests, technical consultations, and general inquiries, please use our dedicated enquiry portal for fast follow-up.',
    fr: 'Pour toute demande d\'analyse, consultation ou renseignement, utilisez notre formulaire de demande pour un traitement rapide.',
  },
  'contact.gotoEnquiry': { ar: 'الانتقال إلى نموذج الاستفسار', en: 'Go to Enquiry Portal', fr: 'Accéder au Formulaire de Demande' },

  // About page
  'aboutPage.title': { ar: 'عن منظومة المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي', en: 'About Southern Sector Water Laboratories', fr: 'À Propos des Laboratoires de l\'Eau du Secteur Sud' },
  'aboutPage.desc': {
    ar: 'شبكة متطورة تضم 4 مختبرات مركزية كبرى و18 فرعاً ومحطة مراقبة منتشرة في مناطق عسير ونجران والباحة وجازان، تعمل على فحص وضمان سلامة وجودة مياه الشرب والمياه الموزعة وفق أحدث المعايير الدولية والوطنية.',
    en: 'An advanced network comprising 4 central laboratory hubs and 18 branches and monitoring stations across Asir, Najran, Al-Baha, and Jazan, ensuring drinking water safety and compliance with top international and national standards.',
    fr: 'Un réseau moderne comprenant 4 grands pôles de laboratoires centraux et 18 agences et stations de surveillance en Asir, Najran, Al-Baha et Jazan, garantissant la salubrité de l\'eau potable selon les normes internationales.',
  },
  'aboutPage.mission': { ar: 'رسالتنا', en: 'Our Mission', fr: 'Notre Mission' },
  'aboutPage.missionDesc': {
    ar: 'تقديم خدمات تحاليل واختبارات مخبرية موثوقة وعالية الدقة لحماية الصحة العامة وضمان سلامة إمدادات المياه لكافة المجتمعات بالقطاع الجنوبي.',
    en: 'Delivering reliable, high-precision laboratory testing and analytical services to protect public health and guarantee safe water supplies across all southern communities.',
    fr: 'Fournir des services d\'analyses fiables et de haute précision pour préserver la santé publique et garantir une eau saine à l\'ensemble des usagers du secteur sud.',
  },
  'aboutPage.vision': { ar: 'رؤيتنا', en: 'Our Vision', fr: 'Notre Vision' },
  'aboutPage.visionDesc': {
    ar: 'أن نكون المرجع الرائد والموثوق إقليمياً في مجال تحاليل المياه وتقييم الجودة وتطبيق أعلى معايير الاعتماد المخبري العالمي.',
    en: 'To stand as the leading and most trusted regional authority in water analysis, quality assessment, and internationally recognized accreditation.',
    fr: 'Être l\'autorité de référence régionale la plus fiable en matière d\'analyses de l\'eau, de contrôle qualité et de conformité aux standards internationaux.',
  },
  'aboutPage.values': { ar: 'قيمنا ومبادئنا الأساسية', en: 'Our Core Values', fr: 'Nos Valeurs Fondamentales' },
  'aboutPage.quality': { ar: 'الدقة والجودة', en: 'Accuracy & Quality', fr: 'Précision & Qualité' },
  'aboutPage.qualityDesc': { ar: 'الالتزام التام بالمواصفات القياسية وضبط الجودة الداخلي والخارجي.', en: 'Total adherence to strict quality control and international testing protocols.', fr: 'Respect rigoureux des protocoles d\'essais et du contrôle qualité.' },
  'aboutPage.excellence': { ar: 'التميز المؤسسي', en: 'Operational Excellence', fr: 'Excellence Opérationnelle' },
  'aboutPage.excellenceDesc': { ar: 'سرعة استخراج النتائج والمحافظة على أعلى معايير الكفاءة التشغيلية.', en: 'Prompt turnaround times while sustaining top operational efficiency.', fr: 'Délais rapides d\'analyse et maintien d\'une efficacité optimale.' },
  'aboutPage.service': { ar: 'خدمة المستفيدين', en: 'Beneficiary Focus', fr: 'Orientation Usagers' },
  'aboutPage.serviceDesc': { ar: 'تسهيل الوصول للخدمات المخبرية والاستجابة الفورية لاحتياجات العملاء.', en: 'Seamless access to laboratory services with dedicated customer support.', fr: 'Accès simplifié aux services et assistance dédiée aux besoins des usagers.' },
  'aboutPage.innovation': { ar: 'الابتكار والتقنية', en: 'Innovation & Technology', fr: 'Innovation & Technologie' },
  'aboutPage.innovationDesc': { ar: 'استخدام أحدث أجهزة الكروماتوغرافيا ومطياف الكتلة والتحاليل الجينية.', en: 'Deploying advanced chromatography, mass spectrometry, and molecular testing.', fr: 'Utilisation d\'équipements modernes de chromatographie et spectrométrie.' },
  'aboutPage.structure': { ar: 'الهيكل الجغرافي للشبكة', en: 'Geographic Network Structure', fr: 'Structure Géographique du Réseau' },
  'aboutPage.centralCenters': { ar: 'مختبرات مركزية كبرى', en: 'Major Central Hubs', fr: 'Centres Centraux Majeurs' },
  'aboutPage.affiliatedBranches': { ar: 'فرعاً ومحطة ميدانية', en: 'Branches & Field Stations', fr: 'Agences & Stations Locales' },
  'aboutPage.coveredRegions': { ar: 'مناطق إدارية مغطاة', en: 'Administrative Regions Covered', fr: 'Régions Administratives Couvertes' },

  // Labs page
  'labs.badge': { ar: 'شبكة المختبرات', en: 'Laboratory Network', fr: 'Réseau de Laboratoires' },
  'labs.title': { ar: 'المختبرات المركزية والفروع', en: 'Central Centers & Branches', fr: 'Centres Centraux et Agences' },
  'labs.desc': {
    ar: 'استعرض كافة المختبرات المركزية والفروع التابعة لها في مناطق عسير، نجران، الباحة، وجازان مع تفاصيل القدرات وأرقام الاتصال.',
    en: 'Browse all central laboratories and affiliated branches across Asir, Najran, Al-Baha, and Jazan with capabilities and contact details.',
    fr: 'Consultez l\'ensemble des laboratoires centraux et agences en Asir, Najran, Al-Baha et Jazan avec leurs capacités et coordonnées.',
  },
  'labs.viewCenter': { ar: 'عرض صفحة المختبر', en: 'View Center Page', fr: 'Consulter la Fiche du Centre' },

  // Center/branch detail
  'detail.about': { ar: 'نبذة عن المختبر', en: 'About the Laboratory', fr: 'À Propos du Laboratoire' },
  'detail.capabilities': { ar: 'القدرات والتجهيزات المخبرية', en: 'Laboratory Capabilities & Equipment', fr: 'Capacités et Équipements de Laboratoire' },
  'detail.services': { ar: 'الخدمات المتاحة', en: 'Available Services', fr: 'Services Disponibles' },
  'detail.analyses': { ar: 'التحاليل والفحوصات المعتمدة', en: 'Certified Analyses & Tests', fr: 'Analyses et Essais Agréés' },
  'detail.contact': { ar: 'معلومات التواصل والعنوان', en: 'Contact & Location Details', fr: 'Coordonnées & Emplacement' },
  'detail.branches': { ar: 'الفروع ومحطات الفحص التابعة', en: 'Affiliated Branches & Field Units', fr: 'Agences et Postes Déconcentrés' },
  'detail.location': { ar: 'الموقع الجغرافي', en: 'Geographic Location', fr: 'Emplacement' },
  'detail.hours': { ar: 'ساعات العمل', en: 'Working Hours', fr: 'Horaires d\'Ouverture' },
  'detail.phone': { ar: 'الهاتف', en: 'Phone', fr: 'Téléphone' },
  'detail.map': { ar: 'عرض الموقع على الخريطة', en: 'View Location on Map', fr: 'Voir sur Google Maps' },
  'detail.registerVisit': { ar: 'حجز زيارة للمختبر', en: 'Book a Lab Visit', fr: 'Réserver une Visite' },
  'detail.backToLabs': { ar: 'العودة إلى قائمة المختبرات', en: 'Back to All Laboratories', fr: 'Retour à la Liste des Laboratoires' },
  'detail.parentCenter': { ar: 'المختبر المركزي التابع له', en: 'Parent Central Laboratory', fr: 'Laboratoire Central de Rattachement' },
  'detail.backToCenter': { ar: 'العودة إلى المركز الرئيسي', en: 'Back to Central Center', fr: 'Retour au Centre Principal' },
  'detail.allLabs': { ar: 'كافة المختبرات', en: 'All Laboratories', fr: 'Tous les Laboratoires' },
  'detail.quickActions': { ar: 'روابط وإجراءات سريعة', en: 'Quick Actions', fr: 'Actions Rapides' },
  'detail.otherBranches': { ar: 'فروع أخرى تابعة لهذا المركز', en: 'Other Branches Under This Center', fr: 'Autres Agences de ce Centre' },
  'detail.branch': { ar: 'فرع تابع', en: 'Branch', fr: 'Agence Rattachée' },

  // Misc
  'misc.loading': { ar: 'جاري تحميل البيانات...', en: 'Loading data...', fr: 'Chargement des données...' },
  'misc.error': { ar: 'حدث خطأ في جلب البيانات', en: 'An error occurred while loading data', fr: 'Erreur lors du chargement des données' },
  'misc.back': { ar: 'العودة', en: 'Back', fr: 'Retour' },
  'misc.accuracyTitle': { ar: 'دقة وموثوقية عالية', en: 'High Precision & Reliability', fr: 'Haute Précision et Fiabilité' },
  'misc.accuracyDesc': { ar: 'فريق متخصص وأجهزة متطورة تضمن أعلى درجات الدقة والامتثال.', en: 'Specialized team and cutting-edge devices guaranteeing strict compliance.', fr: 'Équipe spécialisée et appareils de pointe garantissant une conformité absolue.' },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('site_lang');
    return stored === 'en' || stored === 'fr' || stored === 'ar' ? (stored as Lang) : 'ar';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('site_lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || entry.ar || key;
  };

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
