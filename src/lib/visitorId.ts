import { supabase } from '@/lib/supabase';

/**
 * Computes the next sequential visitor_id in format LAB-YYYY-XXXXXX
 * (e.g. LAB-2026-000005) by querying the highest existing visitor_id.
 */
export async function getNextVisitorId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `LAB-${currentYear}-`;

  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('visitor_id')
      .like('visitor_id', `${prefix}%`)
      .order('visitor_id', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0 && data[0].visitor_id) {
      const match = data[0].visitor_id.match(/LAB-\d{4}-(\d+)/);
      if (match && match[1]) {
        const nextNum = parseInt(match[1], 10) + 1;
        return `${prefix}${String(nextNum).padStart(6, '0')}`;
      }
    }
  } catch (err) {
    console.warn('Could not query highest visitor_id, using fallback count:', err);
  }

  // Fallback to counting rows
  try {
    const { count } = await supabase.from('visitors').select('*', { count: 'exact', head: true });
    const nextSeq = (count || 4) + 1;
    return `${prefix}${String(nextSeq).padStart(6, '0')}`;
  } catch {
    return `${prefix}000005`;
  }
}

/**
 * Builds the canonical QR verification URL for a given visitor_id.
 */
export function buildVisitorQrUrl(visitorId: string): string {
  const base = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://southern-water-labs.gov.sa';
  return `${base}/visitor/${encodeURIComponent(visitorId)}`;
}
