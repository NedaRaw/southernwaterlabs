import { Loader2 } from 'lucide-react';
import LabLogo from '@/components/LabLogo';

export default function PageLoading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 animate-fade-in"
      aria-label="Loading page content"
    >
      <div className="relative flex flex-col items-center">
        {/* Subtle Ambient Pulse Ring */}
        <div className="absolute -inset-4 rounded-3xl bg-cyan-500/10 blur-xl animate-pulse" />

        <div className="relative mb-6">
          <LabLogo variant="mark" />
        </div>

        <div className="flex items-center gap-2.5 text-cyan-700 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-600" />
          <span className="tracking-wide">جاري تحميل الصفحة...</span>
        </div>

        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          Southern Region Water Laboratories
        </p>
      </div>
    </div>
  );
}
