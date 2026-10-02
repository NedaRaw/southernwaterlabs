import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, UserPlus, FileText, MessageSquare } from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { contactConfig } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import LabLogo from '@/components/LabLogo';

export default function Footer() {
  const { lang, t } = useLang();
  const centers = getLocalizedCenters(lang);
  const localizedAddress = contactConfig.addressI18n[lang] || contactConfig.address;
  const localizedHours = contactConfig.workingHoursI18n[lang] || contactConfig.workingHours;

  return (
    <footer className="bg-navy-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Institutional Identity & Description (Spacious, clean, no text overlap) */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="mb-4">
              <LabLogo variant="white" size="md" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mt-2 max-w-sm">
              {t('footer.about')}
            </p>
          </div>

          {/* Column 2: Centers & Branches */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-white mb-4 text-base tracking-wide border-b border-white/10 pb-2 inline-block">
              {t('footer.centers')}
            </h3>
            <ul className="space-y-2.5 mt-2">
              {centers.map((center) => (
                <li key={center.id}>
                  <Link
                    to={`/laboratories/${center.id}`}
                    className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{center.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Services */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-white mb-4 text-base tracking-wide border-b border-white/10 pb-2 inline-block">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2.5 mt-2">
              <li>
                <Link to="/register" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <UserPlus className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{t('cs.register')}</span>
                </Link>
              </li>
              <li>
                <Link to="/survey" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{t('cs.survey')}</span>
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="group-hover:translate-x-0.5 transition-transform">{t('cs.enquiry')}</span>
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <Link to="/services" className="text-xs text-slate-400 hover:text-white transition-colors block">{t('nav.services')}</Link>
              <Link to="/mobile-laboratories" className="text-xs text-slate-400 hover:text-white transition-colors block">{t('nav.mobileLabs')}</Link>
              <Link to="/about" className="text-xs text-slate-400 hover:text-white transition-colors block">{t('nav.about')}</Link>
              <Link to="/contact" className="text-xs text-slate-400 hover:text-white transition-colors block">{t('nav.contact')}</Link>
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-white mb-4 text-base tracking-wide border-b border-white/10 pb-2 inline-block">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3 mt-2">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <span dir="ltr" className="font-medium">{contactConfig.phone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <span className="break-all">{contactConfig.email}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <span>{localizedAddress}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                <span>{localizedHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Sub-links */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {t('brand.name')} - {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to="/contact" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
