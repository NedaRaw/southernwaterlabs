import { useEffect, useRef, type ReactNode } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export interface ConfirmModalDetailItem {
  label: string;
  value: ReactNode;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  details?: ConfirmModalDetailItem[];
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  errorMessage?: string | null;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  details = [],
  confirmText,
  cancelText,
  confirmVariant = 'danger',
  isLoading = false,
  errorMessage = null,
}: ConfirmModalProps) {
  const { lang, dir } = useLang();
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Close on ESC when not loading
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Focus modal when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTitle =
    lang === 'ar'
      ? 'تأكيد الحذف'
      : lang === 'fr'
        ? 'Confirmer la suppression'
        : 'Confirm Deletion';

  const defaultMessage =
    lang === 'ar'
      ? 'هل أنت متأكد من رغبتك في حذف هذا السجل بشكل نهائي؟'
      : lang === 'fr'
        ? 'Êtes-vous sûr de vouloir supprimer définitivement cet enregistrement ?'
        : 'Are you sure you want to permanently delete this record?';

  const defaultConfirmText =
    lang === 'ar' ? 'حذف' : lang === 'fr' ? 'Supprimer' : 'Delete';

  const defaultCancelText =
    lang === 'ar' ? 'إلغاء' : lang === 'fr' ? 'Annuler' : 'Cancel';

  const isDanger = confirmVariant === 'danger';
  const isWarning = confirmVariant === 'warning';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      dir={dir}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header / Close Button */}
        <div className="flex items-start justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isDanger
                  ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  : isWarning
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3
                id="confirm-modal-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                {title || defaultTitle}
              </h3>
              {itemName && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {itemName}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title={defaultCancelText}
            aria-label={defaultCancelText}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 pt-3 space-y-3">
          <p
            id="confirm-modal-description"
            className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {message || defaultMessage}
          </p>

          {/* Details list if provided */}
          {details.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 space-y-1.5 border border-slate-100 dark:border-slate-800 text-xs">
              {details.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {d.label}:
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[220px]">
                    {d.value ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 font-medium flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            {cancelText || defaultCancelText}
          </button>

          <button
            ref={confirmBtnRef}
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-xs transition-all disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                : isWarning
                  ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isLoading
                ? lang === 'ar'
                  ? 'جارٍ التنفيذ...'
                  : lang === 'fr'
                    ? 'En cours...'
                    : 'Processing...'
                : confirmText || defaultConfirmText}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}