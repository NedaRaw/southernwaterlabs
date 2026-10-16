# Southern Water Labs | مختبرات المياه الجنوبية | Laboratoires des eaux du Sud

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-ktiqtvbq)

---

## 🇸🇦 العربية

### نبذة عن المشروع
تطبيق ويب لإدارة مختبرات القطاع الجنوبي للمياه والخدمات البيئية، يهدف إلى تنظيم بيانات الزوار والاستبيانات والاستفسارات، وتوفير واجهة إدارية تراعي صلاحيات المستخدمين ونطاق عمل المختبرات والفروع.

### التقنيات المستخدمة
- React
- Vite
- TypeScript
- Supabase
- HTML وCSS

### المختبرات والفروع
- مختبر عسير المركزي: فرعا بيشة ومحايل.
- مختبر نجران المركزي: فرع شرورة.
- مختبر الباحة المركزي: فرع قلوة.
- مختبر جازان المركزي: فرعا الدرب وفرسان.

### الوظائف الرئيسية
- تسجيل الزوار.
- الاستبيانات واستطلاعات الرأي.
- إرسال الاستفسارات.
- بوابة المستخدمين.
- لوحة الإدارة وإدارة الحسابات وفق الصلاحيات.
- دعم العربية والإنجليزية والفرنسية، مع مراعاة اتجاه الكتابة RTL للعربية.

### التشغيل محليًا
1. تثبيت Node.js وnpm.
2. تثبيت اعتماديات المشروع:

   ```bash
   npm install
   ```

3. إنشاء ملف `.env` في جذر المشروع وإضافة إعدادات Supabase عند الحاجة:

   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. تشغيل التطبيق:

   ```bash
   npm run dev
   ```

5. إنشاء نسخة الإنتاج:

   ```bash
   npm run build
   ```

### الأمان
- عدم نشر كلمات المرور أو مفاتيح الخدمة السرية.
- استخدام سياسات RLS والتحقق من الصلاحيات على الخادم.
- عدم إجراء تغييرات على قاعدة البيانات دون مراجعة وموافقة صريحة.

---

## 🇬🇧 English

### Project Overview
A web application for managing the Southern Sector Central Laboratories for Drinking Water and Environmental Services. It helps organize visitor records, surveys, enquiries, and administrative access according to laboratory and branch scopes.

### Technology Stack
- React
- Vite
- TypeScript
- Supabase
- HTML and CSS

### Laboratories and Branches
- Asir Central Laboratory: Bisha and Muhayil branches.
- Najran Central Laboratory: Sharurah branch.
- Al-Baha Central Laboratory: Qalwa branch.
- Jazan Central Laboratory: Al-Darb and Farasan branches.

### Main Features
- Visitor registration.
- Surveys and feedback collection.
- Enquiry submission.
- User portal.
- Administrative dashboard and role-based account management.
- Arabic, English, and French language support, including RTL layout for Arabic.

### Local Setup
1. Install Node.js and npm.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure Supabase if required:

   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

### Security
- Never expose passwords or secret service-role keys.
- Enforce authorization through server-side checks and Supabase RLS policies.
- Review and explicitly approve database changes before applying them.

---

## 🇫🇷 Français

### Présentation du projet
Une application web destinée à la gestion des laboratoires centraux du secteur Sud pour l’eau potable et les services environnementaux. Elle permet d’organiser les dossiers des visiteurs, les enquêtes, les demandes de renseignements et les accès administratifs selon le périmètre de chaque laboratoire et de ses antennes.

### Technologies utilisées
- React
- Vite
- TypeScript
- Supabase
- HTML et CSS

### Laboratoires et antennes
- Laboratoire central d’Asir : antennes de Bisha et Muhayil.
- Laboratoire central de Najran : antenne de Sharurah.
- Laboratoire central d’Al-Baha : antenne de Qalwa.
- Laboratoire central de Jazan : antennes d’Al-Darb et de Farasan.

### Fonctionnalités principales
- Enregistrement des visiteurs.
- Enquêtes et collecte des avis.
- Envoi de demandes de renseignements.
- Portail utilisateur.
- Tableau de bord administratif et gestion des comptes selon les rôles.
- Prise en charge de l’arabe, de l’anglais et du français, avec mise en page RTL pour l’arabe.

### Installation locale
1. Installer Node.js et npm.
2. Installer les dépendances :

   ```bash
   npm install
   ```

3. Créer un fichier `.env` à la racine du projet et configurer Supabase si nécessaire :

   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

5. Générer la version de production :

   ```bash
   npm run build
   ```

### Sécurité
- Ne jamais publier de mots de passe ni de clés secrètes de service.
- Appliquer les contrôles d’accès côté serveur et les politiques RLS de Supabase.
- Examiner et approuver explicitement toute modification de la base de données avant son application.

---

## License | الترخيص | Licence

A license has not yet been specified. Add a license section once the project's distribution terms have been decided.
