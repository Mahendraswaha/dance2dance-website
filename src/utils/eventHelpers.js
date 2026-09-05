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
    event.title
  ].filter(Boolean).join(' ').toLowerCase();

  const bioKeywords = ['biostretch', 'postura', 'holdning', 'posture', 'relax', 'slappe', 'alongar', 'strekk', 'stretching', 'stress', 'foco', 'fokus', 'focus'];
  if (bioKeywords.some(k => combinedTitles.includes(k))) {
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
    event.title
  ].filter(Boolean).join(' ').toLowerCase();

  if (category === 'biostretch') {
    if (combined.includes('regular') || combined.includes('regulares') || combined.includes('faste')) {
      return '/biostretch/aulas-regulares';
    }
    if (combined.includes('empresa') || combined.includes('corporate') || combined.includes('bedrift')) {
      return '/biostretch/empresas';
    }
    if (combined.includes('individual') || combined.includes('personal') || combined.includes('individuell')) {
      return '/biostretch/individual';
    }
    return '/biostretch/aulas-regulares';
  }

  if (combined.includes('water') || combined.includes('vann')) return '/be-the-dance/be-water';
  if (combined.includes('balance') || combined.includes('balanse')) return '/be-the-dance/be-balance';
  if (combined.includes('total')) return '/be-the-dance/be-total';
  if (combined.includes('stillness') || combined.includes('ro')) return '/be-the-dance/be-stillness';
  if (combined.includes('pro')) return '/be-the-dance/be-the-dance-pro';
  if (combined.includes('day') || combined.includes('dag')) return '/be-the-dance/be-the-dance-day';

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
