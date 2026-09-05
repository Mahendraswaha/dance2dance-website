/**
 * eventHelpers.js
 * Centralized utility functions for localized event handling, routing, and calendar generation.
 */

const FALLBACK_CHAINS = {
  no: ['no', 'en', 'pt'],
  en: ['en', 'no', 'pt'],
  pt: ['pt', 'en', 'no']
};

export function getLocalizedEvent(event, lang = 'en') {
  if (!event) return { title: '', scheduleDetails: '', location: '' };

  const chain = FALLBACK_CHAINS[lang] || ['en', 'no', 'pt'];

  // 1. Resolve Title
  let title = '';
  for (const l of chain) {
    if (event[`title_${l}`] && event[`title_${l}`].trim()) {
      title = event[`title_${l}`].trim();
      break;
    }
  }
  if (!title && event.title) title = event.title;

  // 2. Resolve Schedule / Dates
  let scheduleDetails = '';
  for (const l of chain) {
    if (event[`scheduleDetails_${l}`] && event[`scheduleDetails_${l}`].trim()) {
      scheduleDetails = event[`scheduleDetails_${l}`].trim();
      break;
    }
  }
  if (!scheduleDetails && event.scheduleDetails) scheduleDetails = event.scheduleDetails;

  // 3. Resolve Location
  let location = '';
  for (const l of chain) {
    if (event[`location_${l}`] && event[`location_${l}`].trim()) {
      location = event[`location_${l}`].trim();
      break;
    }
  }
  if (!location && event.location) location = event.location;

  return { title, scheduleDetails, location };
}

export function getEventCategory(event) {
  if (!event) return 'bethedance';
  if (event.category === 'bethedance' || event.category === 'biostretch') {
    return event.category;
  }

  const combinedTitles = [
    event.title_no,
    event.title_en,
    event.title_pt,
    event.title,
    event.workshopId,
    event.slug
  ].filter(Boolean).join(' ');

  const normalized = combinedTitles
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const bioKeywords = [
    'biostretch', 'postura', 'holdning', 'posture', 'relax', 'slappe', 
    'alongar', 'strekk', 'stretching', 'stress', 'estresse', 'foco', 'fokus', 'focus',
    'habito', 'habit', 'vane', 'vaner', 'diario', 'daglig', 'daily',
    'medit', 'breathe', 'pust', 'respirar', 'sessao', 'session', 'okt',
    'faste', 'bedrift', 'regular'
  ];

  if (bioKeywords.some(k => normalized.includes(k))) {
    return 'biostretch';
  }
  return 'bethedance';
}

export function getEventRoute(event) {
  if (!event) return '/be-the-dance';
  if (event.targetPath) return event.targetPath;

  const category = getEventCategory(event);
  const combined = [
    event.title_no,
    event.title_en,
    event.title_pt,
    event.title,
    event.workshopId,
    event.slug
  ].filter(Boolean).join(' ');

  const normalized = combined
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (category === 'biostretch') {
    // 1. Postura: "A Better Posture" / "Uma Melhor Postura" / "En Bedre Holdning"
    if (normalized.includes('postura') || normalized.includes('posture') || normalized.includes('holdning')) {
      return '/biostretch/uma-melhor-postura';
    }
    // 2. Relaxar: "Learning to Relax" / "Aprendendo a Relaxar" / "Lære å Slappe Av"
    if (normalized.includes('relax') || normalized.includes('slappe')) {
      return '/biostretch/aprendendo-a-relaxar';
    }
    // 3. Alongar, Respirar e Meditar: "Stretch, Breathe and Meditate" / "Alongar, Respirar e Meditar" / "Strekk, Pust og Mediter"
    if (
      normalized.includes('alongar') || 
      normalized.includes('respirar') || 
      normalized.includes('breathe') || 
      normalized.includes('medit') || 
      normalized.includes('pust') || 
      normalized.includes('strekk')
    ) {
      return '/biostretch/alongar-respirar-e-meditar';
    }
    // 4. Transformando Hábitos: "Transforming Habits" / "Transformando Hábitos" / "Transformere Vaner"
    if (normalized.includes('habito') || normalized.includes('habit') || normalized.includes('vane')) {
      return '/biostretch/transformando-habitos';
    }
    // 5. Movimentos Diários / Prevenção de Stress: "Daily Movements to Prevent Stress" / "Movimentos Diários para Prevenir o Stress" / "Daglige Bevegelser for å Forhindre Stress"
    if (
      normalized.includes('movimento') || 
      normalized.includes('diario') || 
      normalized.includes('daily') || 
      normalized.includes('daglig') || 
      normalized.includes('stress') || 
      normalized.includes('estresse')
    ) {
      return '/biostretch/movimentos-diarios-para-prevenir-o-stress';
    }
    // 6. Recuperando o Foco: "Regaining Focus" / "Recuperando o Foco" / "Gjenvinne Fokus"
    if (normalized.includes('foco') || normalized.includes('focus') || normalized.includes('fokus')) {
      return '/biostretch/recuperando-o-foco';
    }
    // 7. Aulas Regulares
    if (normalized.includes('regular') || normalized.includes('faste')) {
      return '/biostretch/aulas-regulares';
    }
    // 8. Empresas / Corporate / Bedrift
    if (normalized.includes('empresa') || normalized.includes('corporate') || normalized.includes('bedrift')) {
      return '/biostretch/empresas';
    }
    // 9. Individual / Personal / Individuell
    if (normalized.includes('individual') || normalized.includes('personal') || normalized.includes('individuell')) {
      return '/biostretch/individual';
    }
    // Fallback: se o workshop não existir especificamente, salta para a página da tag Biostretch
    return '/biostretch';
  }

  // Be The Dance
  if (normalized.includes('water') || normalized.includes('vann')) return '/be-the-dance/be-water';
  if (normalized.includes('balance') || normalized.includes('balanse')) return '/be-the-dance/be-balance';
  if (normalized.includes('total')) return '/be-the-dance/be-total';
  if (normalized.includes('pro')) return '/be-the-dance/be-the-dance-pro';
  if (normalized.includes('day') || normalized.includes('dag')) return '/be-the-dance/be-the-dance-day';
  if (normalized.includes('stillness') || /\bro\b/.test(normalized)) return '/be-the-dance/be-stillness';

  // Fallback: se o workshop não existir especificamente, salta para a página da tag Be The Dance
  return '/be-the-dance';
}

export function generateGoogleCalendarUrl(event, lang = 'en') {
  if (!event) return '';
  const { title, scheduleDetails, location } = getLocalizedEvent(event, lang);

  let datesParam = '';
  if (event.startDate) {
    const cleanStartDate = event.startDate.replace(/-/g, '');
    const cleanEndDate = (event.endDate || event.startDate).replace(/-/g, '');
    
    // Format start and end time (default to 18:00 to 20:00 if not specified)
    const startTimeClean = (event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (event.endTime || '20:00').replace(/:/g, '') + '00';
    
    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanEndDate}T${endTimeClean}`;
  }

  const instructorText = event.instructor ? `Instructor: ${event.instructor}` : 'Instructor: Safia';
  const fullDetails = [
    `Dance 2 Dance - ${title}`,
    instructorText,
    event.totalHours ? `Total Workload: ${event.totalHours}h` : '',
    scheduleDetails
  ].filter(Boolean).join('\n');

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', `Dance 2 Dance: ${title}`);
  if (datesParam) url.searchParams.set('dates', datesParam);
  url.searchParams.set('details', fullDetails);
  if (location) url.searchParams.set('location', location);

  return url.toString();
}

export function generateInstructorCalendarUrl(event, lang = 'en', instructorEmail = '') {
  if (!event) return '';
  const { title, scheduleDetails, location } = getLocalizedEvent(event, lang);

  let datesParam = '';
  if (event.startDate) {
    const cleanStartDate = event.startDate.replace(/-/g, '');
    const cleanEndDate = (event.endDate || event.startDate).replace(/-/g, '');
    const startTimeClean = (event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (event.endTime || '20:00').replace(/:/g, '') + '00';
    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanEndDate}T${endTimeClean}`;
  }

  const instructorName = event.instructor || 'Safia';
  const fullDetails = [
    `[Dance 2 Dance] Workshop: ${title}`,
    `Instrutor(a): ${instructorName}`,
    event.totalHours ? `Carga Horária: ${event.totalHours}h` : '',
    `Vagas: ${event.totalSpots || 0} | Inscritos: ${event.enrolledCount || 0}`,
    scheduleDetails ? `Detalhes: ${scheduleDetails}` : ''
  ].filter(Boolean).join('\n');

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', `[Ministrar] ${title} - Dance 2 Dance`);
  if (datesParam) url.searchParams.set('dates', datesParam);
  url.searchParams.set('details', fullDetails);
  if (location) url.searchParams.set('location', location);
  const emailToAdd = instructorEmail || event.instructorEmail;
  if (emailToAdd) url.searchParams.set('add', emailToAdd);

  return url.toString();
}
