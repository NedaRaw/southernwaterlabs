import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { t, dir } = useLang();
  const ArrowIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex items-center gap-1.5 text-sm flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 text-navy-600 hover:text-navy-700 transition-colors font-medium">
        <Home className="w-4 h-4" />
        <span>{t('breadcrumb.home')}</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ArrowIcon className="w-4 h-4 text-slate-400" />
          {item.to ? (
            <Link to={item.to} className="text-navy-600 hover:text-navy-700 transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-500 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
