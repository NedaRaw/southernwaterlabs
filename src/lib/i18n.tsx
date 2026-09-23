import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'ar' | 'en' | 'fr';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations: Record<string, { ar: string; en: string; fr: string }> = {
  // Brand
  'brand.name': { ar: 'مختبرات المياه', en: 'Water Laboratories', fr: 'Laboratoires de l\'Eau' },
  'brand.tagline': { ar: 'دقة التحليل... جودة المياه... سلامة المجتمع', en: 'Precision Analysis... Water Quality... Community Safety', fr: 'Analyse de précision... Qualité de l\'eau... Sécurité de la communauté' },
  'brand.subtitle': { ar: 'Water Laboratories', en: 'Water Laboratories', fr: 'Laboratoires de l\'Eau' },

  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
  'nav.about': { ar: 'عن المختبرات', en: 'About', fr: 'À propos' },
  'nav.labs': { ar: 'المراكز والفروع', en: 'Centers & Branches', fr: 'Centres et Lignes/Filières' },
  'nav.services': { ar: 'الخدمات', en: 'Services', fr: 'Services' },
  'nav.news': { ar: 'الأخبار', en: 'News', fr: 'Actualités' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact', fr: 'Contact' },

  // Customer services
  'cs.title': { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services aux visiteurs' },
  'cs.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Enregistrer une visite' },
  'cs.survey': { ar: 'إرسال استبيان', en: 'Send Survey', fr: 'Envoyer un sondage' },
  'cs.enquiry': { ar: 'إرسال استفسار', en: 'Send Enquiry', fr: 'Envoyer une demande' },

  // Hero
  'hero.badge': { ar: 'مختبرات المياه', en: 'Water Laboratories', fr: 'Laboratoires de l\'Eau' },
  'hero.title': { ar: 'مختبرات المياه', en: 'Water Laboratories', fr: 'Laboratoires de l\'Eau' },
  'hero.subtitle': { ar: 'دقة التحليل... جودة المياه... سلامة المجتمع', en: 'Precision Analysis... Water Quality... Community Safety', fr: 'Analyse de précision... Qualité de l\'eau... Sécurité de la communauté' },
  'hero.desc': { ar: 'نقدم خدمات الفحص والتحليل المخبري لمراقبة جودة المياه وفق أعلى معايير الجودة والدقة.', en: 'We provide laboratory testing and analysis services for water quality monitoring according to the highest standards of quality and accuracy.', fr: 'Nous fournissons des services de contrôle et d\'analyse en laboratoire pour le suivi de la qualité de l\'eau selon les normes de qualité et de précision les plus élevées.' },
  'hero.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Enregistrer une visite' },
  'hero.explore': { ar: 'استكشف مختبراتنا', en: 'Explore Our Labs', fr: 'Explorer nos laboratoires' },

  // Quick access
  'quick.register': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Enregistrer une visite' },
  'quick.register.desc': { ar: 'سجل زيارتك بسهولة', en: 'Register your visit easily', fr: 'Enregistrez votre visite facilement' },
  'quick.survey': { ar: 'الاستبيان', en: 'Survey', fr: 'Sondage' },
  'quick.survey.desc': { ar: 'شاركنا رأيك', en: 'Share your opinion', fr: 'Partagez votre avis' },
  'quick.enquiry': { ar: 'الاستفسارات', en: 'Enquiries', fr: 'Demandes' },
  'quick.enquiry.desc': { ar: 'أرسل استفسارك', en: 'Send your enquiry', fr: 'Envoyez votre demande' },
  'quick.labs': { ar: 'المراكز والفروع', en: 'Centers & Branches', fr: 'Centres et Lignes/Filières' },
  'quick.labs.desc': { ar: 'تعرف على مختبرات المياه', en: 'Explore our Laboratories', fr: 'Découvrez nos laboratoires' },

  // About section
  'about.badge': { ar: 'عن مختبرات المياه', en: 'About', fr: 'À propos' },
  'about.title': { ar: 'عن مختبرات المياه', en: 'About Water Laboratories', fr: 'À propos des Laboratoires de l\'Eau' },
  'about.desc': { ar: 'تعمل مختبرات المياه على دعم منظومة جودة المياه من خلال إجراء الفحوصات والتحاليل المخبرية المتخصصة، ومتابعة مؤشرات الجودة، وتوفير نتائج دقيقة تساعد على اتخاذ القرارات المناسبة.', en: 'Water Laboratories supports the water quality system through specialized laboratory testing and analysis, monitoring quality indicators, and providing accurate results to support decision-making.', fr: 'Les Laboratoires de l\'Eau soutiennent le système de qualité de l\'eau en réalisant des analyses et des tests spécialisés en laboratoire, en suivant les indicateurs de qualité et en fournissant des résultats précis pour faciliter la prise de décision.' },
  'about.readmore': { ar: 'اقرأ المزيد', en: 'Read More', fr: 'En savoir plus' },
  'about.stat.tests': { ar: 'فحص مخبري', en: 'Lab Tests', fr: 'Analyses en laboratoire' },
  'about.stat.samples': { ar: 'عينة', en: 'Samples', fr: 'Échantillons' },
  'about.stat.centers': { ar: 'مختبرات مركزية', en: 'Central Centers', fr: 'Centres centraux' },
  'about.stat.branches': { ar: 'فروع', en: 'Branches', fr: 'Filières / Annexes' },

  // Network section
  'network.badge': { ar: 'الهيكل التنظيمي', en: 'Organizational Structure', fr: 'Organigramme' },
  'network.title': { ar: 'المختبرات المركزية والفروع', en: 'Central Centers & Branches', fr: 'Centres centraux et annexes' },
  'network.desc': { ar: 'تعرف على مختبرات المياه', en: 'Explore our Laboratories', fr: 'Découvrez nos laboratoires' },
  'network.branches': { ar: 'الفروع التابعة', en: 'Affiliated Branches', fr: 'Annexes affiliées' },
  'network.noBranches': { ar: 'لا توجد فروع حاليًا', en: 'No branches currently', fr: 'Aucune annexe actuellement' },
  'network.independent': { ar: 'مركز إقليمي مستقل', en: 'Independent Regional Center', fr: 'Centre régional indépendant' },
  'network.central': { ar: 'مركز مركزي', en: 'Central Center', fr: 'Centre central' },
  'network.details': { ar: 'عرض التفاصيل', en: 'View Details', fr: 'Voir les détails' },

  // Services
  'services.title': { ar: 'خدماتنا', en: 'Our Services', fr: 'Nos services' },
  'services.desc': { ar: 'نقدم مجموعة متكاملة من الخدمات المخبرية لضمان جودة وسلامة المياه', en: 'We provide a comprehensive range of laboratory services to ensure water quality and safety', fr: 'Nous proposons une gamme complète de services de laboratoire pour garantir la qualité et la sécurité de l\'eau' },
  'services.all': { ar: 'جميع الخدمات', en: 'All Services', fr: 'Tous les services' },
  'services.more': { ar: 'المزيد', en: 'More', fr: 'Plus' },

  // News
  'news.title': { ar: 'آخر الأخبار', en: 'Latest News', fr: 'Dernières actualités' },
  'news.desc': { ar: 'تابع آخر مستجدات وأخبار مختبرات المياه', en: 'Follow the latest updates and news from Water Laboratories', fr: 'Suivez les dernières mises à jour et actualités des Laboratoires de l\'Eau' },
  'news.readmore': { ar: 'اقرأ المزيد', en: 'Read More', fr: 'En savoir plus' },

  // Customer services CTA
  'cta.badge': { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services aux visiteurs' },
  'cta.title': { ar: 'خدماتنا للزوار', en: 'Our Visitor Services', fr: 'Nos services pour les visiteurs' },
  'cta.desc': { ar: 'نوفر لك مجموعة من الخدمات الإلكترونية لتسهيل تواصلك معنا', en: 'We provide a range of electronic services to facilitate your communication with us', fr: 'Nous mettons à votre disposition une gamme de services électroniques pour faciliter votre communication avec nous' },
  'cta.register.desc': { ar: 'سجل زيارتك للمختبر بسهولة وسرعة', en: 'Register your lab visit quickly and easily', fr: 'Enregistrez votre visite au laboratoire rapidement et facilement' },
  'cta.survey.desc': { ar: 'رأيك يساعدنا على تطوير وتحسين جودة خدماتنا', en: 'Your feedback helps us improve our services', fr: 'Vos commentaires nous aident à améliorer nos services' },
  'cta.enquiry.desc': { ar: 'يسعدنا استقبال استفساراتكم وملاحظاتكم', en: 'We welcome your enquiries and feedback', fr: 'Nous recevons volontiers vos demandes et remarques' },
  'cta.start': { ar: 'ابدأ الآن', en: 'Get Started', fr: 'Commencer' },

  // Footer
  'footer.about': { ar: 'شبكة متكاملة من المختبرات المركزية والفروع المنتشرة في مناطق المملكة لتقديم خدمات تحليل واختبار جودة المياه.', en: 'An integrated network of central laboratories and branches across the Kingdom providing water quality testing and analysis services.', fr: 'Un réseau intégré de laboratoires centraux et d\'annexes répartis dans le Royaume pour fournir des services d\'analyse et de contrôle de la qualité de l\'eau.' },
  'footer.centers': { ar: 'المراكز والفروع', en: 'Centers & Branches', fr: 'Centres et Annexes' },
  'footer.services': { ar: 'خدمات الزوار', en: 'Visitor Services', fr: 'Services aux visiteurs' },
  'footer.quicklinks': { ar: 'روابط سريعة', en: 'Quick Links', fr: 'Liens rapides' },
  'footer.contact': { ar: 'معلومات التواصل', en: 'Contact Information', fr: 'Informations de contact' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved', fr: 'Tous droits réservés' },
  'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy', fr: 'Politique de confidentialité' },
  'footer.terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions', fr: 'Conditions générales' },
  'footer.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },

  // Breadcrumb
  'breadcrumb.home': { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },

  // Register page
  'register.title': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Enregistrer une visite' },
  'register.desc': { ar: 'سجل زيارتك للمختبر بسهولة وسرعة', en: 'Register your lab visit quickly and easily', fr: 'Enregistrez votre visite au laboratoire rapidement et facilement' },
  'register.visitor': { ar: 'بيانات الزائر', en: 'Visitor Information', fr: 'Informations sur le visiteur' },
  'register.visit': { ar: 'بيانات الزيارة', en: 'Visit Details', fr: 'Détails de la visite' },
  'register.name': { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom complet' },
  'register.company': { ar: 'الجهة / المؤسسة', en: 'Organization', fr: 'Organisation / Entreprise' },
  'register.jobTitle': { ar: 'المسمى الوظيفي', en: 'Job Title', fr: 'Titre du poste' },
  'register.phone': { ar: 'رقم الهاتف', en: 'Phone Number', fr: 'Numéro de téléphone' },
  'register.email': { ar: 'البريد الإلكتروني', en: 'Email', fr: 'E-mail' },
  'register.date': { ar: 'تاريخ الزيارة', en: 'Visit Date', fr: 'Date de la visite' },
  'register.lab': { ar: 'المختبر المطلوب زيارته', en: 'Laboratory to Visit', fr: 'Laboratoire à visiter' },
  'register.purpose': { ar: 'الغرض من الزيارة', en: 'Purpose of Visit', fr: 'Motif de la visite' },
  'register.notes': { ar: 'ملاحظات', en: 'Notes', fr: 'Remarques' },
  'register.submit': { ar: 'تسجيل الزيارة', en: 'Register Visit', fr: 'Valider la visite' },
  'register.submitting': { ar: 'جاري التسجيل...', en: 'Registering...', fr: 'Enregistrement en cours...' },
  'register.required': { ar: 'مطلوب', en: 'Required', fr: 'Obligatoire' },
  'register.selectLab': { ar: 'اختر المختبر', en: 'Select a laboratory', fr: 'Sélectionner un laboratoire' },
  'register.error': { ar: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.', en: 'An error occurred during registration. Please try again.', fr: 'Une erreur s\'est produite lors de l\'enregistrement. Veuillez réessayer.' },

  // Success page
  'success.title': { ar: 'تم تسجيل زيارتك بنجاح', en: 'Your Visit Has Been Registered', fr: 'Votre visite a été enregistrée avec succès' },
  'success.desc': { ar: 'تم تسجيل بياناتك بنجاح. يرجى الاحتفاظ برقم المرجع.', en: 'Your information has been registered successfully. Please keep your reference number.', fr: 'Vos informations ont été enregistrées avec succès. Veuillez conserver votre numéro de référence.' },
  'success.ref': { ar: 'رقم المرجع', en: 'Reference Number', fr: 'Numéro de référence' },
  'success.badge': { ar: 'تحميل بطاقة الزائر', en: 'Download Visitor Badge', fr: 'Télécharger le badge visiteur' },
  'success.home': { ar: 'العودة للرئيسية', en: 'Back to Home', fr: 'Retour à l\'accueil' },
  'success.rate': { ar: 'تقييم الخدمة', en: 'Rate Our Service', fr: 'Évaluer notre service' },
  'success.loading': { ar: 'جاري تحميل البيانات...', en: 'Loading data...', fr: 'Chargement des données...' },
  'success.notFound': { ar: 'لم يتم العثور على بيانات الزيارة', en: 'Visit data not found', fr: 'Données de visite introuvables' },
  'success.back': { ar: 'العودة للتسجيل', en: 'Back to Registration', fr: 'Retour à l\'enregistrement' },

  // Visitor detail
  'visitor.title': { ar: 'بيانات الزائر', en: 'Visitor Details', fr: 'Détails du visiteur' },
  'visitor.name': { ar: 'الاسم', en: 'Name', fr: 'Nom' },
  'visitor.date': { ar: 'تاريخ الزيارة', en: 'Visit Date', fr: 'Date de la visite' },
  'visitor.lab': { ar: 'المختبر', en: 'Laboratory', fr: 'Laboratoire' },
  'visitor.purpose': { ar: 'الغرض', en: 'Purpose', fr: 'Motif' },
  'visitor.phone': { ar: 'الهاتف', en: 'Phone', fr: 'Téléphone' },
  'visitor.org': { ar: 'الجهة', en: 'Organization', fr: 'Organisation' },
  'visitor.title2': { ar: 'المسمى', en: 'Job Title', fr: 'Intitulé du poste' },
  'visitor.ref': { ar: 'رقم المرجع', en: 'Reference Number', fr: 'Numéro de référence' },
  'visitor.notes': { ar: 'ملاحظات', en: 'Notes', fr: 'Remarques' },
  'visitor.notFound': { ar: 'لم يتم العثور على بيانات الزائر', en: 'Visitor not found', fr: 'Visiteur introuvable' },

  // Status
  'status.pending': { ar: 'في الانتظار', en: 'Pending', fr: 'En attente' },
  'status.checked_in': { ar: 'تم الدخول', en: 'Checked In', fr: 'Entré' },
  'status.checked_out': { ar: 'تم المغادرة', en: 'Checked Out', fr: 'Sorti' },
  'status.new': { ar: 'جديد', en: 'New', fr: 'Nouveau' },
  'status.responded': { ar: 'تم الرد', en: 'Responded', fr: 'Répondu' },
  'status.closed': { ar: 'مغلق', en: 'Closed', fr: 'Fermé' },

  // Survey
  'survey.title': { ar: 'شاركنا رأيك', en: 'Share Your Opinion', fr: 'Partagez votre avis' },
  'survey.desc': { ar: 'رأيك يساعدنا على تطوير وتحسين جودة خدماتنا.', en: 'Your feedback helps us develop and improve our services.', fr: 'Vos retours nous aident à améliorer la qualité de nos services.' },
  'survey.name': { ar: 'الاسم (اختياري)', en: 'Name (optional)', fr: 'Nom (facultatif)' },
  'survey.contact': { ar: 'معلومات التواصل (اختياري)', en: 'Contact info (optional)', fr: 'Coordonnées (facultatif)' },
  'survey.quality': { ar: 'جودة الخدمة', en: 'Service Quality', fr: 'Qualité du service' },
  'survey.facility': { ar: 'المعدات والمرافق', en: 'Facilities & Equipment', fr: 'Équipements et installations' },
  'survey.staff': { ar: 'تعامل الموظفين', en: 'Staff Interaction', fr: 'Interactions avec le personnel' },
  'survey.overall': { ar: 'التقييم العام', en: 'Overall Rating', fr: 'Évaluation globale' },
  'survey.recommend': { ar: 'هل تنصح الآخرين بزيارتنا؟', en: 'Would you recommend us?', fr: 'Recommanderiez-vous notre établissement ?' },
  'survey.yes': { ar: 'نعم', en: 'Yes', fr: 'Oui' },
  'survey.no': { ar: 'لا', en: 'No', fr: 'Non' },
  'survey.comments': { ar: 'ملاحظات إضافية', en: 'Additional Comments', fr: 'Commentaires supplémentaires' },
  'survey.submit': { ar: 'إرسال الاستبيان', en: 'Submit Survey', fr: 'Soumettre le sondage' },
  'survey.submitting': { ar: 'جاري الإرسال...', en: 'Submitting...', fr: 'Envoi en cours...' },
  'survey.success': { ar: 'شكراً لك!', en: 'Thank You!', fr: 'Merci !' },
  'survey.successDesc': { ar: 'تم إرسال استبيانك بنجاح. نقدر ملاحظاتك.', en: 'Your survey has been submitted successfully. We appreciate your feedback.', fr: 'Votre sondage a été soumis avec succès. Nous apprécions vos remarques.' },
  'survey.error': { ar: 'حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.', en: 'An error occurred. Please try again.', fr: 'Une erreur s\'est produite. Veuillez réessayer.' },
  'survey.rating': { ar: 'التقييم مطلوب', en: 'Rating is required', fr: 'L\'évaluation est obligatoire' },

  // Enquiry
  'enquiry.title': { ar: 'لديك استفسار؟', en: 'Have an Enquiry?', fr: 'Vous avez une question ?' },
  'enquiry.desc': { ar: 'يسعدنا استقبال استفساراتكم وملاحظاتكم.', en: 'We welcome your enquiries and feedback.', fr: 'Nous accueillons avec plaisir vos demandes et vos remarques.' },
  'enquiry.name': { ar: 'الاسم', en: 'Name', fr: 'Nom' },
  'enquiry.contact': { ar: 'معلومات التواصل', en: 'Contact Information', fr: 'Informations de contact' },
  'enquiry.subject': { ar: 'الموضوع', en: 'Subject', fr: 'Sujet' },
  'enquiry.message': { ar: 'الاستفسار', en: 'Enquiry', fr: 'Message / Demande' },
  'enquiry.submit': { ar: 'إرسال الاستفسار', en: 'Submit Enquiry', fr: 'Envoyer la demande' },
  'enquiry.submitting': { ar: 'جاري الإرسال...', en: 'Submitting...', fr: 'Envoi en cours...' },
  'enquiry.success': { ar: 'تم إرسال استفسارك بنجاح', en: 'Your Enquiry Has Been Sent', fr: 'Votre demande a été envoyée avec succès' },
  'enquiry.successDesc': { ar: 'شكراً لتواصلك معنا. سيتم الرد على استفسارك في أقرب وقت ممكن.', en: 'Thank you for contacting us. We will respond to your enquiry as soon as possible.', fr: 'Merci de nous avoir contactés. Nous répondrons à votre demande dans les plus brefs délais.' },
  'enquiry.error': { ar: 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.', en: 'An error occurred. Please try again.', fr: 'Une erreur s\'est produite. Veuillez réessayer.' },

  // Admin
  'admin.title': { ar: 'لوحة التحكم', en: 'Admin Dashboard', fr: 'Tableau de bord d\'administration' },
  'admin.login': { ar: 'تسجيل الدخول للمسؤولين', en: 'Admin Login', fr: 'Connexion administrateur' },
  'admin.username': { ar: 'اسم المستخدم', en: 'Username', fr: 'Nom d\'utilisateur' },
  'admin.password': { ar: 'كلمة المرور', en: 'Password', fr: 'Mot de passe' },
  'admin.loginBtn': { ar: 'تسجيل الدخول', en: 'Login', fr: 'Se connecter' },
  'admin.welcome': { ar: 'مرحباً', en: 'Welcome', fr: 'Bienvenue' },
  'admin.logout': { ar: 'تسجيل الخروج', en: 'Logout', fr: 'Déconnexion' },
  'admin.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard', fr: 'Tableau de bord' },
  'admin.visitors': { ar: 'الزوار', en: 'Visitors', fr: 'Visiteurs' },
  'admin.surveys': { ar: 'الاستبيانات', en: 'Surveys', fr: 'Sondages' },
  'admin.enquiries': { ar: 'الاستفسارات', en: 'Enquiries', fr: 'Demandes' },
  'admin.users': { ar: 'المستخدمون', en: 'Users', fr: 'Utilisateurs' },
  'admin.totalVisitors': { ar: 'إجمالي الزوار', en: 'Total Visitors', fr: 'Total des visiteurs' },
  'admin.export': { ar: 'تصدير', en: 'Export', fr: 'Exporter' },
  'admin.search': { ar: 'بحث...', en: 'Search...', fr: 'Rechercher...' },
  'admin.noData': { ar: 'لا توجد بيانات', en: 'No data available', fr: 'Aucune donnée disponible' },
  'admin.addUser': { ar: 'إضافة مستخدم', en: 'Add User', fr: 'Ajouter un utilisateur' },
  'admin.editUser': { ar: 'تعديل مستخدم', en: 'Edit User', fr: 'Modifier l\'utilisateur' },
  'admin.fullName': { ar: 'الاسم الكامل', en: 'Full Name', fr: 'Nom complet' },
  'admin.role': { ar: 'الدور', en: 'Role', fr: 'Rôle' },
  'admin.roleUser': { ar: 'مستخدم', en: 'User', fr: 'Utilisateur' },
  'admin.roleAdmin': { ar: 'مدير', en: 'Admin', fr: 'Administrateur' },
  'admin.save': { ar: 'حفظ', en: 'Save', fr: 'Enregistrer' },
  'admin.add': { ar: 'إضافة', en: 'Add', fr: 'Ajouter' },
  'admin.cancel': { ar: 'إلغاء', en: 'Cancel', fr: 'Annuler' },
  'admin.delete': { ar: 'حذف', en: 'Delete', fr: 'Supprimer' },
  'admin.confirmDelete': { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?', fr: 'Êtes-vous sûr de vouloir supprimer ?' },
  'admin.loginError': { ar: 'اسم المستخدم أو كلمة المرور غير صحيحة', en: 'Invalid username or password', fr: 'Nom d\'utilisateur ou mot de passe incorrect' },
  'admin.fillFields': { ar: 'يرجى إدخال اسم المستخدم وكلمة المرور', en: 'Please enter username and password', fr: 'Veuillez saisir le nom d\'utilisateur et le mot de passe' },
  'admin.loginError2': { ar: 'حدث خطأ أثناء تسجيل الدخول', en: 'An error occurred during login', fr: 'Une erreur s\'est produite lors de la connexion' },
  'admin.passwordKeep': { ar: '(اتركها فارغة للإبقاء عليها)', en: '(leave empty to keep current)', fr: '(laisser vide pour conserver le mot de passe actuel)' },
  'admin.unknown': { ar: 'مجهول', en: 'Anonymous', fr: 'Anonyme' },
  'admin.recommend': { ar: 'يوصي بالزيارة', en: 'Recommends visit', fr: 'Recommande la visite' },
  'admin.noSurveys': { ar: 'لا توجد استبيانات', en: 'No surveys', fr: 'Aucun sondage' },
  'admin.noEnquiries': { ar: 'لا توجد استفسارات', en: 'No enquiries', fr: 'Aucune demande' },
  'admin.noUsers': { ar: 'لا يوجد مستخدمون', en: 'No users', fr: 'Aucun utilisateur' },
  'admin.userExists': { ar: 'اسم المستخدم موجود بالفعل', en: 'Username already exists', fr: 'Le nom d\'utilisateur existe déjà' },
  'admin.saveError': { ar: 'حدث خطأ أثناء الحفظ', en: 'An error occurred while saving', fr: 'Une erreur s\'est produite lors de la sauvegarde' },
  'admin.cantDeleteSelf': { ar: 'لا يمكنك حذف حسابك الحالي', en: 'You cannot delete your current account', fr: 'Vous ne pouvez pas supprimer votre compte actuel' },

  // Contact page
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us', fr: 'Contactez-nous' },
  'contact.desc': { ar: 'تواصل معنا لأي استفسار حول خدماتنا المخبرية أو لطلب تحليل مياه.', en: 'Contact us for any enquiry about our laboratory services or water analysis requests.', fr: 'Contactez-nous pour toute question concernant nos services de laboratoire ou pour demander une analyse d\'eau.' },
  'contact.phone': { ar: 'الهاتف', en: 'Phone', fr: 'Téléphone' },
  'contact.email': { ar: 'البريد الإلكتروني', en: 'Email', fr: 'E-mail' },
  'contact.address': { ar: 'العنوان', en: 'Address', fr: 'Adresse' },
  'contact.hours': { ar: 'ساعات العمل', en: 'Working Hours', fr: 'Heures d\'ouverture' },
  'contact.sendMsg': { ar: 'أرسل لنا رسالة', en: 'Send Us a Message', fr: 'Envoyez-nous un message' },
  'contact.toEnquiry': { ar: 'للاستفسارات والطلبات الرسمية، يرجى استخدام صفحة الاستفسارات.', en: 'For official enquiries and requests, please use the enquiry page.', fr: 'Pour les demandes officielles, veuillez utiliser la page de demande.' },
  'contact.gotoEnquiry': { ar: 'الانتقال إلى صفحة الاستفسارات', en: 'Go to Enquiry Page', fr: 'Aller à la page des demandes' },

  // About page
  'aboutPage.title': { ar: 'عن مختبرات المياه', en: 'About Water Laboratories', fr: 'À propos des Laboratoires de l\'Eau' },
  'aboutPage.desc': { ar: 'شبكة متكاملة من المختبرات المركزية والفروع المنتشرة في مناطق المملكة، تعمل على تقديم خدمات تحليل واختبار جودة المياه وفق أعلى المعايير الدولية، لضمان سلامة المياه للمستهلكين في مختلف القطاعات.', en: 'An integrated network of central laboratories and branches across the Kingdom, providing water quality testing and analysis services according to the highest international standards, ensuring water safety for consumers across various sectors.', fr: 'Un réseau intégré de laboratoires centraux et d\'annexes répartis dans le Royaume, fournissant des services d\'analyse et de contrôle de la qualité de l\'eau selon les normes internationales les plus élevées.' },
  'aboutPage.mission': { ar: 'رسالتنا', en: 'Our Mission', fr: 'Notre mission' },
  'aboutPage.missionDesc': { ar: 'تقديم خدمات مخبرية متميزة في مجال تحليل واختبار جودة المياه، وضمان مطابقتها للمعايير والمواصفات، عبر شبكة متكاملة من المختبرات المركزية والفروع.', en: 'Providing distinguished laboratory services in water quality analysis and testing, ensuring compliance with standards and specifications, through an integrated network of central centers and branches.', fr: 'Fournir des services de laboratoire d\'excellence en matière d\'analyse et de contrôle de la qualité de l\'eau, en garantissant la conformité aux normes et spécifications.' },
  'aboutPage.vision': { ar: 'رؤيتنا', en: 'Our Vision', fr: 'Notre vision' },
  'aboutPage.visionDesc': { ar: 'أن نكون الشبكة الرائدة في مجال تحليل جودة المياه على مستوى المملكة، عبر التوسع المستمر في المراكز والفروع وتبني أحدث التقنيات المخبرية.', en: 'To be the leading network in water quality analysis in the Kingdom, through continuous expansion of centers and branches and adoption of the latest laboratory technologies.', fr: 'Être le réseau de référence en analyse de la qualité de l\'eau à l\'échelle nationale, grâce à l\'expansion continue et l\'adoption des technologies les plus récentes.' },
  'aboutPage.values': { ar: 'قيمنا', en: 'Our Values', fr: 'Nos valeurs' },
  'aboutPage.quality': { ar: 'الجودة', en: 'Quality', fr: 'Qualité' },
  'aboutPage.qualityDesc': { ar: 'نتائج دقيقة وموثوقة وفق أعلى المعايير', en: 'Accurate and reliable results according to highest standards', fr: 'Des résultats précis et fiables selon les normes les plus élevées' },
  'aboutPage.excellence': { ar: 'التميز', en: 'Excellence', fr: 'Excellence' },
  'aboutPage.excellenceDesc': { ar: 'كفاءة عالية في جميع العمليات المخبرية', en: 'High efficiency in all laboratory operations', fr: 'Une grande efficacité dans toutes les opérations de laboratoire' },
  'aboutPage.service': { ar: 'الخدمة', en: 'Service', fr: 'Service' },
  'aboutPage.serviceDesc': { ar: 'رضا العملاء أولوية رئيسية لنا', en: 'Customer satisfaction is our top priority', fr: 'La satisfaction du client est notre priorité absolue' },
  'aboutPage.innovation': { ar: 'الابتكار', en: 'Innovation', fr: 'Innovation' },
  'aboutPage.innovationDesc': { ar: 'تبني أحدث التقنيات والأساليب المخبرية', en: 'Adopting the latest laboratory technologies and methods', fr: 'Adopter les technologies et méthodes de laboratoire les plus récentes' },
  'aboutPage.structure': { ar: 'هيكل الشبكة', en: 'Network Structure', fr: 'Structure du réseau' },
  'aboutPage.centralCenters': { ar: 'مختبرات مركزية', en: 'Central & Regional Centers', fr: 'Centres centraux et régionaux' },
  'aboutPage.affiliatedBranches': { ar: 'فروع تابعة', en: 'Affiliated Branches', fr: 'Annexes affiliées' },
  'aboutPage.coveredRegions': { ar: 'مناطق مغطاة', en: 'Covered Regions', fr: 'Régions couvertes' },

  // Labs page
  'labs.badge': { ar: 'شبكة المختبرات', en: 'Laboratory Network', fr: 'Réseau de laboratoires' },
  'labs.title': { ar: 'المختبرات المركزية والفروع', en: 'Central Centers & Branches', fr: 'Centres centraux et annexes' },
  'labs.desc': { ar: 'استعرض جميع المختبرات المركزية والفروع التابعة لها في مناطق المملكة.', en: 'Browse all central centers and their affiliated branches across the Kingdom.', fr: 'Parcourez tous les centres centraux et leurs annexes dans les différentes régions du Royaume.' },
  'labs.viewCenter': { ar: 'عرض صفحة المركز', en: 'View Center Page', fr: 'Voir la page du centre' },

  // Center/branch detail
  'detail.about': { ar: 'عن المركز', en: 'About the Center', fr: 'À propos du centre' },
  'detail.capabilities': { ar: 'القدرات المخبرية', en: 'Laboratory Capabilities', fr: 'Capacités du laboratoire' },
  'detail.services': { ar: 'الخدمات', en: 'Services', fr: 'Services' },
  'detail.analyses': { ar: 'التحاليل المتاحة', en: 'Available Analyses', fr: 'Analyses disponibles' },
  'detail.contact': { ar: 'معلومات التواصل', en: 'Contact Information', fr: 'Informations de contact' },
  'detail.branches': { ar: 'الفروع التابعة', en: 'Affiliated Branches', fr: 'Annexes affiliées' },
  'detail.location': { ar: 'الموقع', en: 'Location', fr: 'Emplacement' },
  'detail.hours': { ar: 'ساعات العمل', en: 'Working Hours', fr: 'Heures d\'ouverture' },
  'detail.phone': { ar: 'الهاتف', en: 'Phone', fr: 'Téléphone' },
  'detail.map': { ar: 'عرض الموقع على الخريطة', en: 'View on Map', fr: 'Voir sur la carte' },
  'detail.registerVisit': { ar: 'تسجيل زيارة', en: 'Register a Visit', fr: 'Enregistrer une visite' },
  'detail.backToLabs': { ar: 'العودة إلى جميع المختبرات', en: 'Back to All Laboratories', fr: 'Retour à tous les laboratoires' },
  'detail.parentCenter': { ar: 'المركز التابع له', en: 'Parent Center', fr: 'Centre rattaché' },
  'detail.backToCenter': { ar: 'العودة إلى', en: 'Back to', fr: 'Retour à' },
  'detail.allLabs': { ar: 'جميع المختبرات', en: 'All Laboratories', fr: 'Tous les laboratoires' },
  'detail.quickActions': { ar: 'إجراءات سريعة', en: 'Quick Actions', fr: 'Actions rapides' },
  'detail.otherBranches': { ar: 'فروع أخرى تابعة للمركز', en: 'Other Branches', fr: 'Autres annexes du centre' },
  'detail.branch': { ar: 'فرع تابع', en: 'Branch', fr: 'Annexe affiliée' },

  // Misc
  'misc.loading': { ar: 'جاري تحميل البيانات...', en: 'Loading data...', fr: 'Chargement des données...' },
  'misc.error': { ar: 'حدث خطأ في جلب البيانات', en: 'An error occurred while fetching data', fr: 'Une erreur s\'est produite lors de la récupération des données' },
  'misc.back': { ar: 'العودة', en: 'Back', fr: 'Retour' },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('site_lang');
    return (stored === 'en' || stored === 'ar' || stored === 'fr') ? stored : 'ar';
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
    return entry[lang] || entry['ar'] || key;
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