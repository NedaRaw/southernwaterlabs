import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Download,
  Printer,
  Search,
  Filter,
  Building2,
  FileText,
  GitBranch,
  Star,
  Layers,
  Sparkles,
} from 'lucide-react';
import { QR_REGISTRY, QrCodeEntry } from '@/data/qrRegistry';
import { useLang } from '@/lib/i18n';

interface QrCodesModuleProps {
  currentLabId?: string | null;
}

export const QrCodesModule: React.FC<QrCodesModuleProps> = ({ currentLabId }) => {
  const { lang, dir } = useLang();
  const isRtl = dir === 'rtl';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedLab, setSelectedLab] = useState<string>(currentLabId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Store data URLs for each QR code
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  const baseUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://southern-water-labs.gov.sa';

  // Generate QR data URLs on mount or URL change
  useEffect(() => {
    let isMounted = true;

    async function generateAllQrs() {
      const generated: Record<string, string> = {};
      for (const item of QR_REGISTRY) {
        const fullUrl = `${baseUrl}${item.path}`;
        try {
          const dataUrl = await QRCode.toDataURL(fullUrl, {
            width: 320,
            margin: 2,
            color: {
              dark: '#0F172A',
              light: '#FFFFFF',
            },
            errorCorrectionLevel: 'M',
          });
          generated[item.id] = dataUrl;
        } catch (err) {
          console.error(`Failed to generate QR for ${item.id}:`, err);
        }
      }
      if (isMounted) {
        setQrImages(generated);
      }
    }

    generateAllQrs();
    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  const handleCopy = async (id: string, path: string) => {
    const fullUrl = `${baseUrl}${path}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    } catch {
      const input = document.createElement('input');
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleDownload = (item: QrCodeEntry) => {
    const dataUrl = qrImages[item.id];
    if (!dataUrl) return;

    // Create branded canvas for high-quality export
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative top bar
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(0, 0, canvas.width, 16);

    // Header Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    const displayTitle = lang === 'ar' ? item.titleAr : lang === 'fr' ? item.titleFr : item.titleEn;
    ctx.fillText(displayTitle, canvas.width / 2, 70);

    // Subtitle / category badge
    ctx.fillStyle = '#64748B';
    ctx.font = '16px sans-serif';
    const displayBadge = lang === 'ar' ? item.badgeAr : lang === 'fr' ? item.badgeFr : item.badgeEn;
    ctx.fillText(`• ${displayBadge} •`, canvas.width / 2, 102);

    // QR Image
    const img = new Image();
    img.onload = () => {
      // Draw white card for QR
      ctx.fillStyle = '#F8FAFC';
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(50, 130, 500, 500, 24);
      } else {
        ctx.fillRect(50, 130, 500, 500);
      }
      ctx.fill();

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.drawImage(img, 75, 155, 450, 450);

      // URL text at bottom
      ctx.fillStyle = '#334155';
      ctx.font = '14px monospace';
      const fullUrl = `${baseUrl}${item.path}`;
      ctx.fillText(fullUrl, canvas.width / 2, 670);

      // Footer brand
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        lang === 'ar'
          ? 'المختبرات الإقليمية المركزية لمياه الشرب والخدمات البيئية'
          : 'Central Water & Environmental Laboratories - Southern Sector',
        canvas.width / 2,
        715
      );

      // Trigger download
      const link = document.createElement('a');
      link.download = `QR-${item.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = dataUrl;
  };

  const handlePrint = (item: QrCodeEntry) => {
    const dataUrl = qrImages[item.id];
    if (!dataUrl) return;

    const fullUrl = `${baseUrl}${item.path}`;
    const displayTitle = lang === 'ar' ? item.titleAr : lang === 'fr' ? item.titleFr : item.titleEn;
    const displayDesc = lang === 'ar' ? item.descAr : lang === 'fr' ? item.descFr : item.descEn;
    const displayBadge = lang === 'ar' ? item.badgeAr : lang === 'fr' ? item.badgeFr : item.badgeEn;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${isRtl ? 'rtl' : 'ltr'}">
      <head>
        <title>QR Code - ${displayTitle}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #fff;
            color: #0f172a;
          }
          .card {
            border: 2px solid #0284c7;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 480px;
            width: 100%;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 8px;
            color: #0f172a;
          }
          .badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .qr {
            width: 300px;
            height: 300px;
            margin: 0 auto 20px;
            display: block;
          }
          .url {
            font-family: monospace;
            font-size: 13px;
            color: #475569;
            word-break: break-all;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 16px;
          }
          .desc {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
          }
          @media print {
            body { padding: 0; }
            .card { border-width: 2px; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">${displayBadge}</div>
          <div class="title">${displayTitle}</div>
          <div class="desc">${displayDesc}</div>
          <img class="qr" src="${dataUrl}" alt="QR Code" />
          <div class="url">${fullUrl}</div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter items
  const filteredItems = QR_REGISTRY.filter((item) => {
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }

    // Lab filter
    if (selectedLab !== 'all') {
      if (item.category === 'forms') {
        // keep forms or filter out if lab selected
        return false;
      }
      if (item.labId !== selectedLab) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchAr = item.titleAr.toLowerCase().includes(q) || item.descAr.toLowerCase().includes(q);
      const matchEn = item.titleEn.toLowerCase().includes(q) || item.descEn.toLowerCase().includes(q);
      const matchFr = item.titleFr.toLowerCase().includes(q) || item.descFr.toLowerCase().includes(q);
      const matchPath = item.path.toLowerCase().includes(q);
      if (!matchAr && !matchEn && !matchFr && !matchPath) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar'
                  ? 'سجل الروابط ونظام رموز الاستجابة السريعة'
                  : lang === 'fr'
                  ? 'Registre officiel des URLs & QR Codes'
                  : 'Official URL Registry & QR Code System'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'ar'
                ? 'إدارة وطباعة رموز QR للمختبرات والفروع'
                : lang === 'fr'
                ? 'Gestion & Impression des QR Codes des Laboratoires'
                : 'Laboratory & Branch QR Code Management'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'جميع الروابط المستخدمة مطابقة تماماً للمسارات الرسمية المعتمدة في النظام. يمكنك نسخ الرابط، معاينة الرمز، تنزيله بدقة عالية، أو طباعته كلوحة إرشادية.'
                : lang === 'fr'
                ? 'Toutes les URLs correspondent aux routes exactes du projet. Téléchargez, imprimez ou copiez les liens officiels des formulaires, laboratoires centraux et branches.'
                : 'All URLs match project routes accurately. Download, print, or copy official links for public forms, central laboratories, and affiliated branches.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl font-extrabold text-blue-400">{QR_REGISTRY.length}</div>
              <div className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'رمز مسجل' : lang === 'fr' ? 'QR Enregistrés' : 'Registered QRs'}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl font-extrabold text-emerald-400">4</div>
              <div className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'مختبرات مركزية' : lang === 'fr' ? 'Labos Centraux' : 'Central Labs'}
              </div>
            </div>
            <div className="px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl font-extrabold text-indigo-400">6</div>
              <div className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'فروع إقليمية' : lang === 'fr' ? 'Branches' : 'Branches'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Filters, Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All', labelFr: 'Tous', icon: Layers },
              { id: 'forms', labelAr: 'النماذج العامة', labelEn: 'Public Forms', labelFr: 'Formulaires', icon: FileText },
              { id: 'labs', labelAr: 'المختبرات المركزية', labelEn: 'Central Labs', labelFr: 'Labos Centraux', icon: Building2 },
              { id: 'branches', labelAr: 'الفروع', labelEn: 'Branches', labelFr: 'Branches', icon: GitBranch },
              { id: 'surveys', labelAr: 'استبيانات مخصصة', labelEn: 'Direct Surveys', labelFr: 'Enquêtes Dediées', icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeCategory === tab.id;
              const label = lang === 'ar' ? tab.labelAr : lang === 'fr' ? tab.labelFr : tab.labelEn;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] lg:max-w-xs">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'بحث بالاسم أو المسار...'
                  : lang === 'fr'
                  ? 'Rechercher par nom ou URL...'
                  : 'Search by name or URL...'
              }
              className={`w-full py-2 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition ${
                isRtl ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
          </div>
        </div>

        {/* Lab Region Sub-Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs overflow-x-auto">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            {lang === 'ar' ? 'تصفية حسب المنطقة:' : lang === 'fr' ? 'Filtrer par région :' : 'Filter by Region:'}
          </span>
          {[
            { id: 'all', labelAr: 'كافة المناطق', labelEn: 'All Regions', labelFr: 'Toutes les régions' },
            { id: 'asir', labelAr: 'منطقة عسير (3)', labelEn: 'Asir Region (3)', labelFr: 'Région Asir (3)' },
            { id: 'najran', labelAr: 'منطقة نجران (2)', labelEn: 'Najran Region (2)', labelFr: 'Région Najran (2)' },
            { id: 'al-baha', labelAr: 'منطقة الباحة (2)', labelEn: 'Al-Baha Region (2)', labelFr: 'Région Al-Baha (2)' },
            { id: 'jazan', labelAr: 'منطقة جازان (3)', labelEn: 'Jazan Region (3)', labelFr: 'Région Jazan (3)' },
          ].map((lab) => {
            const active = selectedLab === lab.id;
            const label = lang === 'ar' ? lab.labelAr : lang === 'fr' ? lab.labelFr : lab.labelEn;
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => setSelectedLab(lab.id)}
                className={`px-2.5 py-1 rounded-md transition text-xs font-medium cursor-pointer shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of QR Code Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-400">
          <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {lang === 'ar' ? 'لا توجد نتائج مطابقة' : lang === 'fr' ? 'Aucun résultat trouvé' : 'No matching results'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const fullUrl = `${baseUrl}${item.path}`;
            const qrDataUrl = qrImages[item.id];
            const isCopied = copiedId === item.id;
            const displayTitle = lang === 'ar' ? item.titleAr : lang === 'fr' ? item.titleFr : item.titleEn;
            const displayDesc = lang === 'ar' ? item.descAr : lang === 'fr' ? item.descFr : item.descEn;
            const displayBadge = lang === 'ar' ? item.badgeAr : lang === 'fr' ? item.badgeFr : item.badgeEn;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {displayBadge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]" dir="ltr">
                      {item.path}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {displayDesc}
                  </p>
                </div>

                {/* QR Code Display Card */}
                <div className="p-5 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50/70">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200/90 group-hover:scale-105 transition-transform">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR - ${displayTitle}`}
                        className="w-36 h-36 object-contain block"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center bg-slate-50 rounded-lg">
                        <QrCode className="w-8 h-8 text-slate-300 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Absolute Canonical URL pill */}
                  <div className="mt-3.5 w-full bg-slate-100/90 rounded-lg p-2 flex items-center justify-between gap-2 text-[11px] font-mono text-slate-600 border border-slate-200">
                    <span className="truncate" dir="ltr" title={fullUrl}>
                      {fullUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.path)}
                      className="shrink-0 p-1 text-slate-500 hover:text-blue-600 transition cursor-pointer"
                      title={lang === 'ar' ? 'نسخ الرابط' : 'Copy link'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.path)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title={lang === 'ar' ? 'نسخ الرابط' : 'Copy URL'}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 mb-0.5" />
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {lang === 'ar' ? 'تم النسخ' : 'Copied'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500 mb-0.5" />
                        <span className="text-[10px]">
                          {lang === 'ar' ? 'نسخ' : lang === 'fr' ? 'Copier' : 'Copy'}
                        </span>
                      </>
                    )}
                  </button>

                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title={lang === 'ar' ? 'فتح وتجربة الرابط' : 'Open Link'}
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 mb-0.5" />
                    <span className="text-[10px]">
                      {lang === 'ar' ? 'فتح' : lang === 'fr' ? 'Ouvrir' : 'Open'}
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title={lang === 'ar' ? 'تحميل صورة عالية الدقة' : 'Download PNG'}
                  >
                    <Download className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-[10px] text-blue-600 font-semibold">
                      {lang === 'ar' ? 'تنزيل' : lang === 'fr' ? 'PNG' : 'PNG'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePrint(item)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title={lang === 'ar' ? 'طباعة لوحة الرمز' : 'Print placard'}
                  >
                    <Printer className="w-4 h-4 text-slate-600 mb-0.5" />
                    <span className="text-[10px]">
                      {lang === 'ar' ? 'طباعة' : lang === 'fr' ? 'Imprimer' : 'Print'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
