import { Link } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin, Clock, UserPlus, FileText, MessageSquare } from 'lucide-react';
import { laboratoryCenters } from '@/data/laboratories';
import { contactConfig } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-navy-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-navy-700 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">{t('brand.name')}</h2>
                <p className="text-xs text-slate-400">{t('brand.subtitle')}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{t('footer.about')}</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-base">{t('footer.centers')}</h3>
            <ul className="space-y-3">
              {laboratoryCenters.map((center) => (
                <li key={center.id}>
                  <Link to={`/laboratories/${center.id}`} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-400" />
                    {center.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-base">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><UserPlus className="w-4 h-4 text-navy-400" />{t('cs.register')}</Link></li>
              <li><Link to="/survey" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><FileText className="w-4 h-4 text-navy-400" />{t('footer.services') === 'Visitor Services' ? 'Survey' : 'الاستبيان'}</Link></li>
              <li><Link to="/enquiry" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"><MessageSquare className="w-4 h-4 text-navy-400" />{t('footer.services') === 'Visitor Services' ? 'Enquiries' : 'الاستفسارات'}</Link></li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors block mb-2">{t('nav.home')}</Link>
              <Link to="/services" className="text-sm text-slate-400 hover:text-white transition-colors block mb-2">{t('nav.services')}</Link>
              <Link to="/about" className="text-sm text-slate-400 hover:text-white transition-colors block mb-2">{t('nav.about')}</Link>
              <Link to="/contact" className="text-sm text-slate-400 hover:text-white transition-colors block">{t('nav.contact')}</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-5 text-base">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400"><Phone className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" /><span>{contactConfig.phone}</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-400"><Mail className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" /><span>{contactConfig.email}</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-400"><MapPin className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" /><span>{contactConfig.address}</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-400"><Clock className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" /><span>{contactConfig.workingHours}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} {t('brand.name')} - {t('footer.rights')}</p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
