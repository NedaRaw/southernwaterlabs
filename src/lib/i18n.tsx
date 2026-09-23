import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'ar' | 'en';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations: Record<string, { ar: string; en: string }> = {
  // Brand
  'brand.name': { ar: 'مختبرات المياه', en: 'Water Laboratories' },
  'brand.tagline': { ar: 'دقة التحليل... جودة المياه... سلامة المجتمع', en: 'Precision Analysis... Water Quality... Community Safety' },
  'brand.subtitle': { ar: 'Water Laboratories', en: 'مختبرات المياه' },

  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.about': { ar: 'عن المختبرات', en: 'About' },
  'nav.labs': { ar: 'المراكز والفروع', en: 'Centers & Branches' },
  'nav.services': { ar: 'الخدمات', en: 'Services' },
  'nav.news': { ar: 'الأخبار', en: 'News' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact' },

  // Customer services
  'cs.title': { ar: 'خدمات الزوار', en: 'Visitor Services' },
  'cs.register': { ar: 'تسجيل زيارة', en: 'Register a Visit' },
  'cs.survey': { ar: 'إرسال استبيان', en: 'Send Survey' },
  'cs.enquiry': { ar: 'إرسال استفسار', en: 'Send Enquiry' },

  // Hero
  'hero.badge': { ar: 'مختبرات المياه', en: 'Water Laboratories' },
  'hero.title': { ar: 'مختبرات المياه', en: 'Water Laboratories' },
  'hero.subtitle': { ar: 'دقة التحليل... جودة المياه... سلامة المجتمع', en: 'Precision Analysis... Water Quality... Community Safety' },
  'hero.desc': { ar: 'نقدم خدمات الفحص والتحليل المخبري لمراقبة جودة المياه وفق أعلى معايير الجودة والدقة.', en: 'We provide laboratory testing and analysis services for water quality monitoring according to the highest standards of quality and accuracy.' },
  'hero.register': { ar: 'تسجيل زيارة', en: 'Register a Visit' },
  'hero.explore': { ar: 'استكشف مختبراتنا', en: 'Explore Our Labs' },

  // Quick access
  'quick.register': { ar: 'تسجيل زيارة', en: 'Register a Visit' },
  'quick.register.desc': { ar: 'سجل زيارتك بسهولة', en: 'Register your visit easily' },
  'quick.survey': { ar: 'الاستبيان', en: 'Survey' },
  'quick.survey.desc': { ar: 'شاركنا رأيك', en: 'Share your opinion' },
  'quick.enquiry': { ar: 'الاستفسارات', en: 'Enquiries' },
  'quick.enquiry.desc': { ar: 'أرسل استفسارك', en: 'Send your enquiry' },
  'quick.labs': { ar: 'المراكز والفروع', en: 'Centers & Branches' },
  'quick.labs.desc': { ar: 'تعرف على مختبرات المياه', en: 'Explore our Laboratories' },

  // About section
  'about.badge': { ar: 'عن مختبرات المياه', en: 'About' },
  'about.title': { ar: 'عن مختبرات المياه', en: 'About Water Laboratories' },
  'about.desc': { ar: 'تعمل مختبرات المياه على دعم منظومة جودة المياه من خلال إجراء الفحوصات والتحاليل المخبرية المتخصصة، ومتابعة مؤشرات الجودة، وتوفير نتائج دقيقة تساعد على اتخاذ القرارات المناسبة.', en: 'Water Laboratories supports the water quality system through specialized laboratory testing and analysis, monitoring quality indicators, and providing accurate results to support decision-making.' },
  'about.readmore': { ar: 'اقرأ المزيد', en: 'Read More' },
  'about.stat.tests': { ar: 'فحص مخبري', en: 'Lab Tests' },
  'about.stat.samples': { ar: 'عينة', en: 'Samples' },
  'about.stat.centers': { ar: 'مختبرات مركزية', en: 'Central Centers' },
  'about.stat.branches': { ar: 'فروع', en: 'Branches' },

  // Network section
  'network.badge': { ar: 'الهيكل التنظيمي', en: 'Organizational Structure' },
  'network.title': { ar: 'المختبرات المركزية والفروع', en: 'Central Centers & Branches' },
  'network.desc': { ar: 'تعرف على مختبرات المياه', en: 'Explore our Laboratories' },
  'network.branches': { ar: 'الفروع التابعة', en: 'Affiliated Branches' },
  'network.noBranches': { ar: 'لا توجد فروع حاليًا', en: 'No branches currently' },
  'network.independent': { ar: 'مركز إقليمي مستقل', en: 'Independent Regional Center' },
  'network.central': { ar: 'مركز مركزي', en: 'Central Center' },
  'network.details': { ar: 'عرض التفاصيل', en: 'View Details' },

  // Services
  'services.title': { ar: 'خدماتنا', en: 'Our Services' },
  'services.desc': { ar: 'نقدم مجموعة متكاملة من الخدمات المخبرية لضمان جودة وسلامة المياه', en: 'We provide a comprehensive range of laboratory services to ensure water quality and safety' },
  'services.all': { ar: 'جميع الخدمات', en: 'All Services' },
  'services.more': { ar: 'المزيد', en: 'More' },

  // News
  'news.title': { ar: 'آخر الأخبار', en: 'Latest News' },
  'news.desc': { ar: 'تابع آخر مستجدات وأخبار مختبرات المياه', en: 'Follow the latest updates and news from Water Laboratories' },
  'news.readmore': { ar: 'اقرأ المزيد', en: 'Read More' },

  // Customer services CTA
  'cta.badge': { ar: 'خدمات الزوار', en: 'Visitor Services' },
  'cta.title': { ar: 'خدماتنا للزوار', en: 'Our Visitor Services' },
  'cta.desc': { ar: 'نوفر لك مجموعة من الخدمات الإلكترونية لتسهيل تواصلك معنا', en: 'We provide a range of electronic services to facilitate your communication with us' },
  'cta.register.desc': { ar: 'سجل زيارتك للمختبر بسهولة وسرعة', en: 'Register your lab visit quickly and easily' },
  'cta.survey.desc': { ar: 'رأيك يساعدنا على تطوير وتحسين جودة خدماتنا', en: 'Your feedback helps us improve our services' },
  'cta.enquiry.desc': { ar: 'يسعدنا استقبال استفساراتكم وملاحظاتكم', en: 'We welcome your enquiries and feedback' },
  'cta.start': { ar: 'ابدأ الآن', en: 'Get Started' },

  // Footer
  'footer.about': { ar: 'شبكة متكاملة من المختبرات المركزية والفروع المنتشرة في مناطق المملكة لتقديم خدمات تحليل واختبار جودة المياه.', en: 'An integrated network of central laboratories and branches across the Kingdom providing water quality testing and analysis services.' },
  'footer.centers': { ar: 'المراكز والفروع', en: 'Centers & Branches' },
  'footer.services': { ar: 'خدمات الزوار', en: 'Visitor Services' },
  'footer.quicklinks': { ar: 'روابط سريعة', en: 'Quick Links' },
  'footer.contact': { ar: 'معلومات التواصل', en: 'Contact Information' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  'footer.terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  'footer.home': { ar: 'الرئيسية', en: 'Home' },

  // Breadcrumb
  'breadcrumb.home': { ar: 'الرئيسية', en: 'Home' },

  // Register page
  'register.title': { ar: 'تسجيل زيارة', en: 'Register a Visit' },
  'register.desc': { ar: 'سجل زيارتك للمختبر بسهولة وسرعة', en: 'Register your lab visit quickly and easily' },
  'register.visitor': { ar: 'بيانات الزائر', en: 'Visitor Information' },
  'register.visit': { ar: 'بيانات الزيارة', en: 'Visit Details' },
  'register.name': { ar: 'الاسم الكامل', en: 'Full Name' },
  'register.company': { ar: 'الجهة / المؤسسة', en: 'Organization' },
  'register.jobTitle': { ar: 'المسمى الوظيفي', en: 'Job Title' },
  'register.phone': { ar: 'رقم الهاتف', en: 'Phone Number' },
  'register.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'register.date': { ar: 'تاريخ الزيارة', en: 'Visit Date' },
  'register.lab': { ar: 'المختبر المطلوب زيارته', en: 'Laboratory to Visit' },
  'register.purpose': { ar: 'الغرض من الزيارة', en: 'Purpose of Visit' },
  'register.notes': { ar: 'ملاحظات', en: 'Notes' },
  'register.submit': { ar: 'تسجيل الزيارة', en: 'Register Visit' },
  'register.submitting': { ar: 'جاري التسجيل...', en: 'Registering...' },
  'register.required': { ar: 'مطلوب', en: 'Required' },
  'register.selectLab': { ar: 'اختر المختبر', en: 'Select a laboratory' },
  'register.error': { ar: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.', en: 'An error occurred during registration. Please try again.' },

  // Success page
  'success.title': { ar: 'تم تسجيل زيارتك بنجاح', en: 'Your Visit Has Been Registered' },
  'success.desc': { ar: 'تم تسجيل بياناتك بنجاح. يرجى الاحتفاظ برقم المرجع.', en: 'Your information has been registered successfully. Please keep your reference number.' },
  'success.ref': { ar: 'رقم المرجع', en: 'Reference Number' },
  'success.badge': { ar: 'تحميل بطاقة الزائر', en: 'Download Visitor Badge' },
  'success.home': { ar: 'العودة للرئيسية', en: 'Back to Home' },
  'success.rate': { ar: 'تقييم الخدمة', en: 'Rate Our Service' },
  'success.loading': { ar: 'جاري تحميل البيانات...', en: 'Loading data...' },
  'success.notFound': { ar: 'لم يتم العثور على بيانات الزيارة', en: 'Visit data not found' },
  'success.back': { ar: 'العودة للتسجيل', en: 'Back to Registration' },

  // Visitor detail
  'visitor.title': { ar: 'بيانات الزائر', en: 'Visitor Details' },
  'visitor.name': { ar: 'الاسم', en: 'Name' },
  'visitor.date': { ar: 'تاريخ الزيارة', en: 'Visit Date' },
  'visitor.lab': { ar: 'المختبر', en: 'Laboratory' },
  'visitor.purpose': { ar: 'الغرض', en: 'Purpose' },
  'visitor.phone': { ar: 'الهاتف', en: 'Phone' },
  'visitor.org': { ar: 'الجهة', en: 'Organization' },
  'visitor.title2': { ar: 'المسمى', en: 'Job Title' },
  'visitor.ref': { ar: 'رقم المرجع', en: 'Reference Number' },
  'visitor.notes': { ar: 'ملاحظات', en: 'Notes' },
  'visitor.notFound': { ar: 'لم يتم العثور على بيانات الزائر', en: 'Visitor not found' },

  // Status
  'status.pending': { ar: 'في الانتظار', en: 'Pending' },
  'status.checked_in': { ar: 'تم الدخول', en: 'Checked In' },
  'status.checked_out': { ar: 'تم المغادرة', en: 'Checked Out' },
  'status.new': { ar: 'جديد', en: 'New' },
  'status.responded': { ar: 'تم الرد', en: 'Responded' },
  'status.closed': { ar: 'مغلق', en: 'Closed' },

  // Survey
  'survey.title': { ar: 'شاركنا رأيك', en: 'Share Your Opinion' },
  'survey.desc': { ar: 'رأيك يساعدنا على تطوير وتحسين جودة خدماتنا.', en: 'Your feedback helps us develop and improve our services.' },
  'survey.name': { ar: 'الاسم (اختياري)', en: 'Name (optional)' },
  'survey.contact': { ar: 'معلومات التواصل (اختياري)', en: 'Contact info (optional)' },
  'survey.quality': { ar: 'جودة الخدمة', en: 'Service Quality' },
  'survey.facility': { ar: 'المعدات والمرافق', en: 'Facilities & Equipment' },
  'survey.staff': { ar: 'تعامل الموظفين', en: 'Staff Interaction' },
  'survey.overall': { ar: 'التقييم العام', en: 'Overall Rating' },
  'survey.recommend': { ar: 'هل تنصح الآخرين بزيارتنا؟', en: 'Would you recommend us?' },
  'survey.yes': { ar: 'نعم', en: 'Yes' },
  'survey.no': { ar: 'لا', en: 'No' },
  'survey.comments': { ar: 'ملاحظات إضافية', en: 'Additional Comments' },
  'survey.submit': { ar: 'إرسال الاستبيان', en: 'Submit Survey' },
  'survey.submitting': { ar: 'جاري الإرسال...', en: 'Submitting...' },
  'survey.success': { ar: 'شكراً لك!', en: 'Thank You!' },
  'survey.successDesc': { ar: 'تم إرسال استبيانك بنجاح. نقدر ملاحظاتك.', en: 'Your survey has been submitted successfully. We appreciate your feedback.' },
  'survey.error': { ar: 'حدث خطأ أثناء إرسال الاستبيان. يرجى المحاولة مرة أخرى.', en: 'An error occurred. Please try again.' },
  'survey.rating': { ar: 'التقييم مطلوب', en: 'Rating is required' },

  // Enquiry
  'enquiry.title': { ar: 'لديك استفسار؟', en: 'Have an Enquiry?' },
  'enquiry.desc': { ar: 'يسعدنا استقبال استفساراتكم وملاحظاتكم.', en: 'We welcome your enquiries and feedback.' },
  'enquiry.name': { ar: 'الاسم', en: 'Name' },
  'enquiry.contact': { ar: 'معلومات التواصل', en: 'Contact Information' },
  'enquiry.subject': { ar: 'الموضوع', en: 'Subject' },
  'enquiry.message': { ar: 'الاستفسار', en: 'Enquiry' },
  'enquiry.submit': { ar: 'إرسال الاستفسار', en: 'Submit Enquiry' },
  'enquiry.submitting': { ar: 'جاري الإرسال...', en: 'Submitting...' },
  'enquiry.success': { ar: 'تم إرسال استفسارك بنجاح', en: 'Your Enquiry Has Been Sent' },
  'enquiry.successDesc': { ar: 'شكراً لتواصلك معنا. سيتم الرد على استفسارك في أقرب وقت ممكن.', en: 'Thank you for contacting us. We will respond to your enquiry as soon as possible.' },
  'enquiry.error': { ar: 'حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.', en: 'An error occurred. Please try again.' },

  // Admin
  'admin.title': { ar: 'لوحة التحكم', en: 'Admin Dashboard' },
  'admin.login': { ar: 'تسجيل الدخول للمسؤولين', en: 'Admin Login' },
  'admin.username': { ar: 'اسم المستخدم', en: 'Username' },
  'admin.password': { ar: 'كلمة المرور', en: 'Password' },
  'admin.loginBtn': { ar: 'تسجيل الدخول', en: 'Login' },
  'admin.welcome': { ar: 'مرحباً', en: 'Welcome' },
  'admin.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'admin.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'admin.visitors': { ar: 'الزوار', en: 'Visitors' },
  'admin.surveys': { ar: 'الاستبيانات', en: 'Surveys' },
  'admin.enquiries': { ar: 'الاستفسارات', en: 'Enquiries' },
  'admin.users': { ar: 'المستخدمون', en: 'Users' },
  'admin.totalVisitors': { ar: 'إجمالي الزوار', en: 'Total Visitors' },
  'admin.export': { ar: 'تصدير', en: 'Export' },
  'admin.search': { ar: 'بحث...', en: 'Search...' },
  'admin.noData': { ar: 'لا توجد بيانات', en: 'No data available' },
  'admin.addUser': { ar: 'إضافة مستخدم', en: 'Add User' },
  'admin.editUser': { ar: 'تعديل مستخدم', en: 'Edit User' },
  'admin.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
  'admin.role': { ar: 'الدور', en: 'Role' },
  'admin.roleUser': { ar: 'مستخدم', en: 'User' },
  'admin.roleAdmin': { ar: 'مدير', en: 'Admin' },
  'admin.save': { ar: 'حفظ', en: 'Save' },
  'admin.add': { ar: 'إضافة', en: 'Add' },
  'admin.cancel': { ar: 'إلغاء', en: 'Cancel' },
  'admin.delete': { ar: 'حذف', en: 'Delete' },
  'admin.confirmDelete': { ar: 'هل أنت متأكد من الحذف؟', en: 'Are you sure you want to delete?' },
  'admin.loginError': { ar: 'اسم المستخدم أو كلمة المرور غير صحيحة', en: 'Invalid username or password' },
  'admin.fillFields': { ar: 'يرجى إدخال اسم المستخدم وكلمة المرور', en: 'Please enter username and password' },
  'admin.loginError2': { ar: 'حدث خطأ أثناء تسجيل الدخول', en: 'An error occurred during login' },
  'admin.passwordKeep': { ar: '(اتركها فارغة للإبقاء عليها)', en: '(leave empty to keep current)' },
  'admin.unknown': { ar: 'مجهول', en: 'Anonymous' },
  'admin.recommend': { ar: 'يوصي بالزيارة', en: 'Recommends visit' },
  'admin.noSurveys': { ar: 'لا توجد استبيانات', en: 'No surveys' },
  'admin.noEnquiries': { ar: 'لا توجد استفسارات', en: 'No enquiries' },
  'admin.noUsers': { ar: 'لا يوجد مستخدمون', en: 'No users' },
  'admin.userExists': { ar: 'اسم المستخدم موجود بالفعل', en: 'Username already exists' },
  'admin.saveError': { ar: 'حدث خطأ أثناء الحفظ', en: 'An error occurred while saving' },
  'admin.cantDeleteSelf': { ar: 'لا يمكنك حذف حسابك الحالي', en: 'You cannot delete your current account' },

  // Contact page
  'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  'contact.desc': { ar: 'تواصل معنا لأي استفسار حول خدماتنا المخبرية أو لطلب تحليل مياه.', en: 'Contact us for any enquiry about our laboratory services or water analysis requests.' },
  'contact.phone': { ar: 'الهاتف', en: 'Phone' },
  'contact.email': { ar: 'البريد الإلكتروني', en: 'Email' },
  'contact.address': { ar: 'العنوان', en: 'Address' },
  'contact.hours': { ar: 'ساعات العمل', en: 'Working Hours' },
  'contact.sendMsg': { ar: 'أرسل لنا رسالة', en: 'Send Us a Message' },
  'contact.toEnquiry': { ar: 'للاستفسارات والطلبات الرسمية، يرجى استخدام صفحة الاستفسارات.', en: 'For official enquiries and requests, please use the enquiry page.' },
  'contact.gotoEnquiry': { ar: 'الانتقال إلى صفحة الاستفسارات', en: 'Go to Enquiry Page' },

  // About page
  'aboutPage.title': { ar: 'عن مختبرات المياه', en: 'About Water Laboratories' },
  'aboutPage.desc': { ar: 'شبكة متكاملة من المختبرات المركزية والفروع المنتشرة في مناطق المملكة، تعمل على تقديم خدمات تحليل واختبار جودة المياه وفق أعلى المعايير الدولية، لضمان سلامة المياه للمستهلكين في مختلف القطاعات.', en: 'An integrated network of central laboratories and branches across the Kingdom, providing water quality testing and analysis services according to the highest international standards, ensuring water safety for consumers across various sectors.' },
  'aboutPage.mission': { ar: 'رسالتنا', en: 'Our Mission' },
  'aboutPage.missionDesc': { ar: 'تقديم خدمات مخبرية متميزة في مجال تحليل واختبار جودة المياه، وضمان مطابقتها للمعايير والمواصفات، عبر شبكة متكاملة من المختبرات المركزية والفروع.', en: 'Providing distinguished laboratory services in water quality analysis and testing, ensuring compliance with standards and specifications, through an integrated network of central centers and branches.' },
  'aboutPage.vision': { ar: 'رؤيتنا', en: 'Our Vision' },
  'aboutPage.visionDesc': { ar: 'أن نكون الشبكة الرائدة في مجال تحليل جودة المياه على مستوى المملكة، عبر التوسع المستمر في المراكز والفروع وتبني أحدث التقنيات المخبرية.', en: 'To be the leading network in water quality analysis in the Kingdom, through continuous expansion of centers and branches and adoption of the latest laboratory technologies.' },
  'aboutPage.values': { ar: 'قيمنا', en: 'Our Values' },
  'aboutPage.quality': { ar: 'الجودة', en: 'Quality' },
  'aboutPage.qualityDesc': { ar: 'نتائج دقيقة وموثوقة وفق أعلى المعايير', en: 'Accurate and reliable results according to highest standards' },
  'aboutPage.excellence': { ar: 'التميز', en: 'Excellence' },
  'aboutPage.excellenceDesc': { ar: 'كفاءة عالية في جميع العمليات المخبرية', en: 'High efficiency in all laboratory operations' },
  'aboutPage.service': { ar: 'الخدمة', en: 'Service' },
  'aboutPage.serviceDesc': { ar: 'رضا العملاء أولوية رئيسية لنا', en: 'Customer satisfaction is our top priority' },
  'aboutPage.innovation': { ar: 'الابتكار', en: 'Innovation' },
  'aboutPage.innovationDesc': { ar: 'تبني أحدث التقنيات والأساليب المخبرية', en: 'Adopting the latest laboratory technologies and methods' },
  'aboutPage.structure': { ar: 'هيكل الشبكة', en: 'Network Structure' },
  'aboutPage.centralCenters': { ar: 'مختبرات مركزية', en: 'Central & Regional Centers' },
  'aboutPage.affiliatedBranches': { ar: 'فروع تابعة', en: 'Affiliated Branches' },
  'aboutPage.coveredRegions': { ar: 'مناطق مغطاة', en: 'Covered Regions' },

  // Labs page
  'labs.badge': { ar: 'شبكة المختبرات', en: 'Laboratory Network' },
  'labs.title': { ar: 'المختبرات المركزية والفروع', en: 'Central Centers & Branches' },
  'labs.desc': { ar: 'استعرض جميع المختبرات المركزية والفروع التابعة لها في مناطق المملكة.', en: 'Browse all central centers and their affiliated branches across the Kingdom.' },
  'labs.viewCenter': { ar: 'عرض صفحة المركز', en: 'View Center Page' },

  // Center/branch detail
  'detail.about': { ar: 'عن المركز', en: 'About the Center' },
  'detail.capabilities': { ar: 'القدرات المخبرية', en: 'Laboratory Capabilities' },
  'detail.services': { ar: 'الخدمات', en: 'Services' },
  'detail.analyses': { ar: 'التحاليل المتاحة', en: 'Available Analyses' },
  'detail.contact': { ar: 'معلومات التواصل', en: 'Contact Information' },
  'detail.branches': { ar: 'الفروع التابعة', en: 'Affiliated Branches' },
  'detail.location': { ar: 'الموقع', en: 'Location' },
  'detail.hours': { ar: 'ساعات العمل', en: 'Working Hours' },
  'detail.phone': { ar: 'الهاتف', en: 'Phone' },
  'detail.map': { ar: 'عرض الموقع على الخريطة', en: 'View on Map' },
  'detail.registerVisit': { ar: 'تسجيل زيارة', en: 'Register a Visit' },
  'detail.backToLabs': { ar: 'العودة إلى جميع المختبرات', en: 'Back to All Laboratories' },
  'detail.parentCenter': { ar: 'المركز التابع له', en: 'Parent Center' },
  'detail.backToCenter': { ar: 'العودة إلى', en: 'Back to' },
  'detail.allLabs': { ar: 'جميع المختبرات', en: 'All Laboratories' },
  'detail.quickActions': { ar: 'إجراءات سريعة', en: 'Quick Actions' },
  'detail.otherBranches': { ar: 'فروع أخرى تابعة للمركز', en: 'Other Branches' },
  'detail.branch': { ar: 'فرع تابع', en: 'Branch' },

  // Misc
  'misc.loading': { ar: 'جاري تحميل البيانات...', en: 'Loading data...' },
  'misc.error': { ar: 'حدث خطأ في جلب البيانات', en: 'An error occurred while fetching data' },
  'misc.back': { ar: 'العودة', en: 'Back' },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('site_lang');
    return (stored === 'en' || stored === 'ar') ? stored : 'ar';
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
    return entry[lang];
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
