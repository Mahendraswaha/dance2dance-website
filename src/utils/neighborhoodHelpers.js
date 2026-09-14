/**
 * Helper para verificar elegibilidade de bolsa integral comunitaria
 * para moradores das areas de impacto prioritario: Toyen e Gronland (Oslo).
 */

export function isScholarshipEligibleNeighborhood(neighborhood) {
  if (!neighborhood || typeof neighborhood !== 'string') return false;

  const rawLower = neighborhood.toLowerCase().trim();
  if (!rawLower) return false;

  // Normalizacao de caracteres acentuados (incluindo ø / Ø e diacriticos)
  const normalized = rawLower
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/å/g, 'a');

  const matchesToyen = 
    rawLower.includes('tøyen') || 
    normalized.includes('toyen');

  const matchesGronland = 
    rawLower.includes('grønland') || 
    normalized.includes('gronland');

  return matchesToyen || matchesGronland;
}