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

  // Moradores de Gamle Oslo (bydel oficial que abrange Toyen e Gronland)
  const matchesGamleOslo = 
    rawLower.includes('gamle oslo') || 
    normalized.includes('gamle oslo');

  return matchesToyen || matchesGronland || matchesGamleOslo;
}

/**
 * Inspeciona todos os campos cadastrais relevantes do usuario
 * (bairro, endereco, cidade) para determinar elegibilidade a bolsa integral.
 */
export function checkUserScholarshipEligibility(userProfile) {
  if (!userProfile) return { isEligible: false, neighborhood: '' };

  const candidateFields = [
    userProfile.neighborhood,
    userProfile.bairro,
    userProfile.bydel,
    userProfile.address,
    userProfile.endereco,
    userProfile.city,
    userProfile.cidade
  ];

  for (const val of candidateFields) {
    if (isScholarshipEligibleNeighborhood(val)) {
      const displayNeighborhood = userProfile.neighborhood || userProfile.bairro || userProfile.bydel || 'Tøyen / Grønland';
      return { isEligible: true, neighborhood: displayNeighborhood };
    }
  }

  return { isEligible: false, neighborhood: '' };
}