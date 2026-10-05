import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Building2,
  Network,
  FlaskConical,
  Truck,
  Newspaper,
  UserPlus,
  FileText,
  ArrowRight,
  ArrowLeft,
  CornerDownLeft,
  Search as SearchIcon,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import {
  searchResults,
  getPopularSearches,
  searchCategories,
  type SearchResult,
} from '@/lib/searchIndex';

const categoryIcons: Record<string, typeof Building2> = {
  page: FileText,
  lab: Building2,
  branch: Network,
  service: FlaskConical,
  mobile: Truck,
  news: Newspaper,
  action: UserPlus,
};

const categoryColors: Record<string, string> = {
  page: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
  lab: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50',
  branch: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50',
  service: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50',
  mobile: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
  news: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
  action: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({
  isOpen,
  onClose,
}: SearchModalProps) {
  const { lang, t, dir } = useLang();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    return searchResults(query, lang);
  }, [query, lang]);

  const popularSearches = useMemo(
    () => getPopularSearches(lang),
    [lang]
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);

      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleNavigate = useCallback(
    (path: string) => {
      if (path.includes('#')) {
        const [route, hash] = path.split('#');

        navigate(route);

        window.setTimeout(() => {
          const el = document.getElementById(hash);

          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 300);
      } else {
        navigate(path);
      }

      onClose();
    },
    [navigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (results.length > 0) {
        setSelectedIndex((prev) =>
          Math.min(prev + 1, results.length - 1)
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (results.length > 0) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (results[selectedIndex]) {
        handleNavigate(results[selectedIndex].path);
      }
    }
  };

  useEffect(() => {
    if (!resultsRef.current) return;

    const activeEl = resultsRef.current.querySelector(
      `[data-index="${selectedIndex}"]`
    );

    if (activeEl) {
      activeEl.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const groupedResults = results.reduce<
    Record<string, SearchResult[]>
  >((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }

    acc[result.category].push(result);

    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('search.title')}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#172033] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
            aria-label={t('search.placeholder')}
          />

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('search.close')}
          >
            <span className="hidden sm:inline">ESC</span>
            <X className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 12rem)' }}
        >
          {query.trim() === '' ? (
            <div className="p-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Search className="w-3 h-3" />
                {t('search.popular')}
              </p>

              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <Search className="w-3 h-3 opacity-50" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {searchCategories.map((category) => {
                    const Icon =
                      categoryIcons[category.key] || FileText;

                    return (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() => {
                          const categoryLabel =
                            category.label[lang] ||
                            category.label.en;

                          const categoryResults = searchResults(
                            categoryLabel,
                            lang
                          );

                          if (categoryResults.length > 0) {
                            setQuery(categoryLabel);
                          }
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-colors cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            categoryColors[category.key] ||
                            categoryColors.page
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 text-center">
                          {category.label[lang] ||
                            category.label.en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {t('search.noResults')}
              </p>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t('search.tryDifferent')}
              </p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 pb-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {results.length} {t('search.results')}
              </div>

              {Object.entries(groupedResults).map(
                ([categoryKey, categoryResults]) => {
                  const category = searchCategories.find(
                    (item) => item.key === categoryKey
                  );

                  if (!category) return null;

                  const CategoryIcon =
                    categoryIcons[categoryKey] || FileText;

                  return (
                    <div key={categoryKey} className="mb-1">
                      <div className="px-4 py-1.5 flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <CategoryIcon className="w-3 h-3" />

                        <span>
                          {category.label[lang] ||
                            category.label.en}
                        </span>

                        <span className="text-slate-300 dark:text-slate-600">
                          ·
                        </span>

                        <span className="font-mono">
                          {categoryResults.length}
                        </span>
                      </div>

                      {categoryResults.map((result) => {
                        flatIndex++;

                        const index = flatIndex;
                        const isActive =
                          index === selectedIndex;

                        const Icon =
                          categoryIcons[result.category] ||
                          FileText;

                        return (
                          <button
                            key={result.id}
                            type="button"
                            data-index={index}
                            onClick={() =>
                              handleNavigate(result.path)
                            }
                            onMouseEnter={() =>
                              setSelectedIndex(index)
                            }
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-start transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-950/30'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                categoryColors[
                                  result.category
                                ] || categoryColors.page
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  isActive
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {result.title}
                              </p>

                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                {result.description}
                              </p>
                            </div>

                            <Arrow
                              className={`w-4 h-4 shrink-0 transition-opacity ${
                                isActive
                                  ? 'text-blue-500 opacity-100'
                                  : 'text-slate-300 opacity-0'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Keyboard shortcuts */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                  ↑↓
                </kbd>

                <span>{t('search.navigate')}</span>
              </span>

              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                  <CornerDownLeft className="w-2.5 h-2.5 inline" />
                </kbd>

                <span>{t('search.select')}</span>
              </span>
            </div>

            <span>
              {results.length} {t('search.results')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}