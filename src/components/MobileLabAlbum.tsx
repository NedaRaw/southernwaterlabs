import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  CheckCircle2,
  Info,
  Camera,
  Layers,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import type { MobileLabGalleryImage } from '@/data/mobileLaboratoriesGallery';

interface MobileLabAlbumProps {
  images: MobileLabGalleryImage[];
  labTitle: {
    ar: string;
    en: string;
    fr: string;
  };
  regionName: {
    ar: string;
    en: string;
    fr: string;
  };
  albumId?: string;
}

export const MobileLabAlbum: React.FC<MobileLabAlbumProps> = ({
  images,
  labTitle,
  regionName,
}) => {
  const { lang, dir } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const openLightbox = (index?: number) => {
    if (typeof index === 'number') {
      setCurrentIndex(index);
    }
    setZoomLevel(1);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#161f31] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
      {/* Album Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/40">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'ألبوم صور المختبر الميداني المتنقل' : lang === 'fr' ? 'Album Photos du Laboratoire Mobile' : 'Mobile Laboratory Image Album'}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                {images.length} {lang === 'ar' ? 'صور' : 'Photos'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {labTitle[lang] || labTitle.en}
            </p>
          </div>
        </div>

        {/* Counter and Fullscreen Trigger */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => openLightbox()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={lang === 'ar' ? 'عرض مكبر بملء الشاشة' : lang === 'fr' ? 'Plein écran' : 'Fullscreen viewer'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تكبير الألبوم' : lang === 'fr' ? 'Plein écran' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Image Frame */}
      <div className="relative group rounded-2xl overflow-hidden bg-slate-950 shadow-md">
        <div
          onClick={() => openLightbox()}
          className="relative h-72 sm:h-96 md:h-[440px] w-full overflow-hidden cursor-zoom-in flex items-center justify-center"
        >
          <img
            src={currentImage.image}
            alt={currentImage.roleTitle[lang] || currentImage.roleTitle.en}
            className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-102 select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-black/30 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-3.5 start-3.5 end-3.5 flex items-center justify-between gap-2 pointer-events-none">
            {/* Authenticity Badge */}
            <div className="flex flex-wrap items-center gap-2">
              {currentImage.isRealPhoto ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-md border border-emerald-400/40 backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
                  <span>{currentImage.statusBadge[lang] || currentImage.statusBadge.en}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentImage.statusBadge[lang] || currentImage.statusBadge.en}</span>
                </span>
              )}
            </div>

            {/* Role Chip */}
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-md backdrop-blur-md shrink-0">
              {currentImage.roleTitle[lang] || currentImage.roleTitle.en}
            </span>
          </div>

          {/* Hover Zoom Prompt */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="px-4 py-2 rounded-full bg-slate-950/80 text-white text-xs font-bold shadow-xl border border-white/20 backdrop-blur-md flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <ZoomIn className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ar' ? 'انقر لتكبير الصورة وفحص التفاصيل' : lang === 'fr' ? 'Cliquer pour agrandir' : 'Click to inspect in fullscreen'}</span>
            </span>
          </div>

          {/* Bottom In-Image Caption & Livery */}
          <div className="absolute bottom-3.5 start-3.5 end-3.5 text-white pointer-events-none">
            <div className="p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>{currentImage.roleTitle[lang] || currentImage.roleTitle.en}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {regionName[lang] || regionName.en}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {currentImage.caption[lang] || currentImage.caption.en}
              </p>
            </div>
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className={`absolute top-1/2 -translate-y-1/2 ${
            dir === 'rtl' ? 'right-3' : 'left-3'
          } w-10 h-10 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-105 shadow-lg cursor-pointer z-10`}
          title={lang === 'ar' ? 'الصورة السابقة' : lang === 'fr' ? 'Photo précédente' : 'Previous image'}
          aria-label="Previous image"
        >
          {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`absolute top-1/2 -translate-y-1/2 ${
            dir === 'rtl' ? 'left-3' : 'right-3'
          } w-10 h-10 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-105 shadow-lg cursor-pointer z-10`}
          title={lang === 'ar' ? 'الصورة التالية' : lang === 'fr' ? 'Photo suivante' : 'Next image'}
          aria-label="Next image"
        >
          {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Thumbnails Navigation Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === 'ar' ? 'معرض مصغرات الألبوم (اختر للتصفح):' : lang === 'fr' ? 'Miniatures de l\'album :' : 'Album Thumbnails (click to view):'}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {lang === 'ar' ? 'يمكن استخدام الأسهم للتبديل' : lang === 'fr' ? 'Utilisez les flèches ou cliquez sur une miniature' : 'Use arrows or click thumbnails'}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                }}
                className={`group relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer bg-slate-900 ${
                  isActive
                    ? 'border-blue-600 ring-2 ring-blue-500/40 scale-102 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 opacity-75 hover:opacity-100'
                }`}
                title={img.roleTitle[lang] || img.roleTitle.en}
              >
                <img
                  src={img.image}
                  alt={img.roleTitle[lang] || img.roleTitle.en}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div
                  className={`absolute inset-0 bg-black/30 transition-opacity ${
                    isActive ? 'opacity-0' : 'group-hover:opacity-0'
                  }`}
                />

                {/* Thumbnail role pill */}
                <div className="absolute bottom-1 inset-x-1">
                  <span className="block truncate text-[9px] font-bold text-white px-1 py-0.5 rounded bg-black/70 backdrop-blur-xs text-center">
                    {img.roleTitle[lang] || img.roleTitle.en}
                  </span>
                </div>

                {/* Indicator dot */}
                {isActive && (
                  <div className="absolute top-1 end-1 w-2 h-2 rounded-full bg-blue-500 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Lightbox Top Header Bar */}
          <div
            className="flex items-center justify-between gap-4 text-white pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {regionName[lang] || regionName.en}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentIndex + 1} / {images.length}
                </span>
                {currentImage.isRealPhoto ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{currentImage.statusBadge[lang] || currentImage.statusBadge.en}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-amber-300 border border-amber-500/40">
                    <Info className="w-3 h-3" />
                    <span>{currentImage.statusBadge[lang] || currentImage.statusBadge.en}</span>
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                {currentImage.roleTitle[lang] || currentImage.roleTitle.en} — {labTitle[lang] || labTitle.en}
              </h3>
            </div>

            {/* Zoom Controls & Close Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 1}
                  className={`p-1.5 rounded-lg transition-colors ${
                    zoomLevel <= 1 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20 cursor-pointer'
                  }`}
                  title="Zoom Out (-)"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-bold font-mono text-white">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 3}
                  className={`p-1.5 rounded-lg transition-colors ${
                    zoomLevel >= 3 ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20 cursor-pointer'
                  }`}
                  title="Zoom In (+)"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
                title={lang === 'ar' ? 'إغلاق (Esc)' : lang === 'fr' ? 'Fermer (Échap)' : 'Close'}
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image View */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative max-h-full max-w-full transition-transform duration-300 flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={currentImage.image}
                alt={currentImage.roleTitle[lang] || currentImage.roleTitle.en}
                className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-[90vw] object-contain rounded-xl shadow-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Nav Arrows inside Lightbox */}
            <button
              type="button"
              onClick={handlePrev}
              className={`absolute top-1/2 -translate-y-1/2 ${
                dir === 'rtl' ? 'right-4' : 'left-4'
              } w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-all border border-white/20 shadow-xl cursor-pointer`}
              title="Previous"
              aria-label="Previous"
            >
              {dir === 'rtl' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className={`absolute top-1/2 -translate-y-1/2 ${
                dir === 'rtl' ? 'left-4' : 'right-4'
              } w-12 h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white flex items-center justify-center transition-all border border-white/20 shadow-xl cursor-pointer`}
              title="Next"
              aria-label="Next"
            >
              {dir === 'rtl' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>

          {/* Lightbox Bottom Caption & Thumbnails Strip */}
          <div
            className="space-y-3 pt-3 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {currentImage.caption[lang] || currentImage.caption.en}
            </p>

            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-full">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    idx === currentIndex
                      ? 'border-blue-500 scale-105 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image}
                    alt={img.roleTitle[lang] || img.roleTitle.en}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
