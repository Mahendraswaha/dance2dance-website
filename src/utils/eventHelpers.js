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
  if (event.category === 'bethedance' || event.category === 'biostretch' || event.category === 'kroppsskole') {
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

  if (normalized.includes('kroppsskole') || normalized.includes('kropp')) {
    return 'kroppsskole';
  }

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

  if (category === 'kroppsskole') {
    return '/kroppsskole';
  }

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
  if (normalized.includes('company') || normalized.includes('empresa') || normalized.includes('corporate') || normalized.includes('bedrift')) return '/be-the-dance/empresas';
  if (normalized.includes('water') || normalized.includes('vann')) return '/be-the-dance/be-water';
  if (normalized.includes('balance') || normalized.includes('balanse')) return '/be-the-dance/be-balance';
  if (normalized.includes('total')) return '/be-the-dance/be-total';
  if (normalized.includes('pro')) return '/be-the-dance/be-the-dance-pro';
  if (normalized.includes('day') || normalized.includes('dag')) return '/be-the-dance/be-the-dance-day';
  if (normalized.includes('stillness') || /\bro\b/.test(normalized)) return '/be-the-dance/be-stillness';

  // Fallback: se o workshop não existir especificamente, salta para a página da tag Be The Dance
  return '/be-the-dance';
}

const RRULE_DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function getRruleDay(dateStr) {
  if (!dateStr) return 'MO';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return RRULE_DAYS[dt.getDay()];
}

function escapeIcs(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateGoogleCalendarUrl(event, lang = 'en', sessionInfo = null) {
  if (!event) return '';
  const { title, scheduleDetails, location } = getLocalizedEvent(event, lang);

  let datesParam = '';
  let recurParam = '';
  let eventText = `Dance 2 Dance: ${title}`;

  if (sessionInfo && sessionInfo.date) {
    // Single session specific link
    const cleanDate = sessionInfo.date.replace(/-/g, '');
    const startTimeClean = (sessionInfo.startTime || event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (sessionInfo.endTime || event.endTime || '20:00').replace(/:/g, '') + '00';
    datesParam = `${cleanDate}T${startTimeClean}/${cleanDate}T${endTimeClean}`;
    if (sessionInfo.startTime) {
      eventText = `Dance 2 Dance: ${title} (${sessionInfo.startTime})`;
    }
  } else if (Array.isArray(event.sessions) && event.sessions.length > 0) {
    const sorted = [...event.sessions].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const cleanStartDate = first.date.replace(/-/g, '');
    const startTimeClean = (first.startTime || event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (first.endTime || event.endTime || '20:00').replace(/:/g, '') + '00';

    // OCCURRENCE MUST BE ON THE SAME DAY (not stretching across weeks!)
    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanStartDate}T${endTimeClean}`;

    if (sorted.length > 1 && first.date !== last.date) {
      const uniqueDays = [...new Set(sorted.map(s => getRruleDay(s.date)))].join(',');
      const cleanUntilDate = last.date.replace(/-/g, '');
      recurParam = `RRULE:FREQ=WEEKLY;BYDAY=${uniqueDays};UNTIL=${cleanUntilDate}T235959Z`;
    }
  } else if (event.startDate) {
    const cleanStartDate = event.startDate.replace(/-/g, '');
    const startTimeClean = (event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (event.endTime || '20:00').replace(/:/g, '') + '00';

    // Occurrence on the same day
    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanStartDate}T${endTimeClean}`;

    if (event.endDate && event.endDate !== event.startDate) {
      const cleanUntilDate = event.endDate.replace(/-/g, '');
      const dayCode = getRruleDay(event.startDate);
      recurParam = `RRULE:FREQ=WEEKLY;BYDAY=${dayCode};UNTIL=${cleanUntilDate}T235959Z`;
    }
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
  url.searchParams.set('text', eventText);
  if (datesParam) url.searchParams.set('dates', datesParam);
  if (recurParam) url.searchParams.set('recur', recurParam);
  url.searchParams.set('details', fullDetails);
  if (location) url.searchParams.set('location', location);

  return url.toString();
}

export function generateInstructorCalendarUrl(event, lang = 'en', instructorEmail = '', sessionInfo = null) {
  if (!event) return '';
  const { title, scheduleDetails, location } = getLocalizedEvent(event, lang);

  let datesParam = '';
  let recurParam = '';
  let eventText = `[Ministrar] ${title} - Dance 2 Dance`;

  if (sessionInfo && sessionInfo.date) {
    const cleanDate = sessionInfo.date.replace(/-/g, '');
    const startTimeClean = (sessionInfo.startTime || event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (sessionInfo.endTime || event.endTime || '20:00').replace(/:/g, '') + '00';
    datesParam = `${cleanDate}T${startTimeClean}/${cleanDate}T${endTimeClean}`;
    if (sessionInfo.startTime) {
      eventText = `[Ministrar] ${title} (${sessionInfo.startTime})`;
    }
  } else if (Array.isArray(event.sessions) && event.sessions.length > 0) {
    const sorted = [...event.sessions].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const cleanStartDate = first.date.replace(/-/g, '');
    const startTimeClean = (first.startTime || event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (first.endTime || event.endTime || '20:00').replace(/:/g, '') + '00';

    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanStartDate}T${endTimeClean}`;

    if (sorted.length > 1 && first.date !== last.date) {
      const uniqueDays = [...new Set(sorted.map(s => getRruleDay(s.date)))].join(',');
      const cleanUntilDate = last.date.replace(/-/g, '');
      recurParam = `RRULE:FREQ=WEEKLY;BYDAY=${uniqueDays};UNTIL=${cleanUntilDate}T235959Z`;
    }
  } else if (event.startDate) {
    const cleanStartDate = event.startDate.replace(/-/g, '');
    const startTimeClean = (event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (event.endTime || '20:00').replace(/:/g, '') + '00';

    datesParam = `${cleanStartDate}T${startTimeClean}/${cleanStartDate}T${endTimeClean}`;

    if (event.endDate && event.endDate !== event.startDate) {
      const cleanUntilDate = event.endDate.replace(/-/g, '');
      const dayCode = getRruleDay(event.startDate);
      recurParam = `RRULE:FREQ=WEEKLY;BYDAY=${dayCode};UNTIL=${cleanUntilDate}T235959Z`;
    }
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
  url.searchParams.set('text', eventText);
  if (datesParam) url.searchParams.set('dates', datesParam);
  if (recurParam) url.searchParams.set('recur', recurParam);
  url.searchParams.set('details', fullDetails);
  if (location) url.searchParams.set('location', location);
  const emailToAdd = instructorEmail || event.instructorEmail;
  if (emailToAdd) url.searchParams.set('add', emailToAdd);

  return url.toString();
}

/**
 * Generates an RFC 5545 compliant .ics file content containing all sessions as individual VEVENTs.
 */
export function generateIcsContent(event, lang = 'en') {
  if (!event) return '';
  const { title, scheduleDetails, location } = getLocalizedEvent(event, lang);
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const instructorText = event.instructor ? `Instrutor: ${event.instructor}` : '';
  const description = [
    `Dance 2 Dance - ${title}`,
    instructorText,
    event.totalHours ? `Carga Horaria: ${event.totalHours}h` : '',
    scheduleDetails
  ].filter(Boolean).join('\n');

  let sessions = [];
  if (Array.isArray(event.sessions) && event.sessions.length > 0) {
    sessions = event.sessions;
  } else if (event.startDate) {
    sessions = [{
      date: event.startDate,
      startTime: event.startTime || '18:00',
      endTime: event.endTime || '20:00'
    }];
  }

  const vevents = sessions.map((sess, idx) => {
    const cleanDate = sess.date.replace(/-/g, '');
    const startTimeClean = (sess.startTime || event.startTime || '18:00').replace(/:/g, '') + '00';
    const endTimeClean = (sess.endTime || event.endTime || '20:00').replace(/:/g, '') + '00';
    const uid = `${event.id || 'd2d'}-${sess.date}-${idx}@dance2dance.no`;
    const summary = sessions.length > 1 
      ? `Dance 2 Dance: ${title} (#${idx + 1})`
      : `Dance 2 Dance: ${title}`;

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${cleanDate}T${startTimeClean}`,
      `DTEND:${cleanDate}T${endTimeClean}`,
      `SUMMARY:${escapeIcs(summary)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      location ? `LOCATION:${escapeIcs(location)}` : '',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].filter(Boolean).join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dance 2 Dance//Agenda//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...vevents,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Triggers a client-side download of the event's .ics calendar file.
 */
export function downloadEventIcs(event, lang = 'en') {
  if (!event) return;
  const ics = generateIcsContent(event, lang);
  if (!ics) return;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeTitle = (event.title || 'workshop').toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.href = url;
  link.download = `${safeTitle}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Checks whether an event has already ended.
 * An event is considered past if current time is strictly after its completion timestamp.
 * If endDate is not provided, defaults to startDate.
 * If endTime is not provided, defaults to endTime || startTime || 23:59:59.
 */
export function isEventPast(event) {
  if (!event) return false;
  const finalDate = event.endDate || event.startDate;
  if (!finalDate) return false;

  const finalTime = event.endTime || event.startTime || '23:59';

  try {
    const [year, month, day] = finalDate.split('-').map(Number);
    const [hours, minutes] = finalTime.split(':').map(Number);

    const eventEnd = new Date(year, month - 1, day, hours || 23, minutes || 59, 59, 999);
    return new Date() > eventEnd;
  } catch (err) {
    return false;
  }
}

/**
 * Checks whether an event is currently ongoing.
 */
export function isEventOngoing(event) {
  if (!event || !event.startDate) return false;
  const finalDate = event.endDate || event.startDate;
  const startTime = event.startTime || '00:00';
  const finalTime = event.endTime || event.startTime || '23:59';

  try {
    const [y1, m1, d1] = event.startDate.split('-').map(Number);
    const [h1, min1] = startTime.split(':').map(Number);
    const start = new Date(y1, m1 - 1, d1, h1 || 0, min1 || 0, 0);

    const [y2, m2, d2] = finalDate.split('-').map(Number);
    const [h2, min2] = finalTime.split(':').map(Number);
    const end = new Date(y2, m2 - 1, d2, h2 || 23, min2 || 59, 59, 999);

    const now = new Date();
    return now >= start && now <= end;
  } catch (err) {
    return false;
  }
}

/**
 * Returns abbreviated weekday name for a YYYY-MM-DD date string (e.g. 'Seg', 'Mon', 'Man').
 */
export function getWeekdayAbbrev(dateStr, lang = 'pt') {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const wd = dt.toLocaleDateString(lang || 'pt', { weekday: 'short' });
    return wd.charAt(0).toUpperCase() + wd.slice(1).replace('.', '');
  } catch (e) {
    return '';
  }
}

/**
 * Formats start and optional end date in DD/MM/YYYY format with localized weekday.
 * Single day: "Seg, 07/09/2026"
 * Multi-day/course: "Seg, 07/09/2026 – Seg, 26/10/2026"
 */
export function formatEventDate(startDate, endDate, lang = 'pt', withWeekday = true) {
  if (!startDate) return '';
  const [y1, m1, d1] = startDate.split('-');
  const wd1 = withWeekday ? `${getWeekdayAbbrev(startDate, lang)}, ` : '';
  const startStr = `${wd1}${d1}/${m1}/${y1}`;
  if (!endDate || endDate === startDate) {
    return startStr;
  }
  const [y2, m2, d2] = endDate.split('-');
  const wd2 = withWeekday ? `${getWeekdayAbbrev(endDate, lang)}, ` : '';
  return `${startStr} – ${wd2}${d2}/${m2}/${y2}`;
}

/**
 * Automatically generates a structured readable summary of all sessions.
 */
export function generateScheduleSummary(sessions = [], lang = 'pt') {
  if (!Array.isArray(sessions) || sessions.length === 0) return '';
  
  const labels = {
    pt: { session: 'Encontro', of: 'de', from: 'das', to: 'às' },
    en: { session: 'Session', of: 'of', from: 'from', to: 'to' },
    no: { session: 'Økt', of: 'av', from: 'kl.', to: '–' }
  };
  const l = labels[lang] || labels.pt;

  return sessions.map((s, idx) => {
    const wd = getWeekdayAbbrev(s.date, lang);
    const [y, m, d] = s.date.split('-');
    const dateFormatted = `${d}/${m}/${y}`;
    const timeStr = s.startTime && s.endTime 
      ? (lang === 'no' ? `${l.from} ${s.startTime}–${s.endTime}` : `${l.from} ${s.startTime} ${l.to} ${s.endTime}`)
      : '';
    return `${l.session} ${idx + 1}: ${wd}, ${dateFormatted} ${timeStr}`.trim();
  }).join('\n');
}

/**
 * Computes total hours summed across all individual sessions.
 * Returns a number (e.g. 18 or 14.5).
 */
export function calculateTotalHoursFromSessions(sessions = []) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0;
  
  let totalMinutes = 0;
  for (const s of sessions) {
    if (!s.startTime || !s.endTime) continue;
    const [h1, m1] = s.startTime.split(':').map(Number);
    const [h2, m2] = s.endTime.split(':').map(Number);
    const startMins = h1 * 60 + m1;
    const endMins = h2 * 60 + m2;
    if (endMins > startMins) {
      totalMinutes += (endMins - startMins);
    }
  }
  const hours = totalMinutes / 60;
  return Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
}

/**
 * Returns all individual date occurrences for an event to render in calendar views.
 */
export function getEventAllDates(event) {
  if (!event) return [];
  if (Array.isArray(event.sessions) && event.sessions.length > 0) {
    return event.sessions.map(s => ({
      date: s.date,
      startTime: s.startTime || event.startTime || '',
      endTime: s.endTime || event.endTime || '',
      event
    }));
  }

  // Fallback for events without a sessions array
  if (event.startDate) {
    if (!event.endDate || event.endDate === event.startDate) {
      return [{
        date: event.startDate,
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        event
      }];
    }
    return [
      { date: event.startDate, startTime: event.startTime || '', endTime: event.endTime || '', event },
      { date: event.endDate, startTime: event.startTime || '', endTime: event.endTime || '', event }
    ];
  }
  return [];
}

/**
 * Returns consistent styling tokens for each program category.
 */
export function getCategoryTheme(category) {
  switch (category) {
    case 'kroppsskole':
      return {
        id: 'kroppsskole',
        label: 'KROPPSSKOLE',
        badgeBg: 'bg-[#4A9B8E]/15 text-[#4A9B8E] border border-[#4A9B8E]/30',
        dotColor: 'bg-[#4A9B8E]',
        textColor: 'text-[#4A9B8E]',
        borderHover: 'hover:border-[#4A9B8E]/50',
        glow: 'shadow-[0_0_12px_rgba(74,155,142,0.4)]'
      };
    case 'biostretch':
      return {
        id: 'biostretch',
        label: 'BIOSTRETCH',
        badgeBg: 'bg-white/10 text-[#FAF8F5] border border-white/20',
        dotColor: 'bg-[#FAF8F5]',
        textColor: 'text-[#FAF8F5]',
        borderHover: 'hover:border-white/50',
        glow: 'shadow-[0_0_12px_rgba(250,248,245,0.4)]'
      };
    case 'bethedance':
    default:
      return {
        id: 'bethedance',
        label: 'BE THE DANCE',
        badgeBg: 'bg-accent/15 text-accent border border-accent/30',
        dotColor: 'bg-accent',
        textColor: 'text-accent',
        borderHover: 'hover:border-accent/50',
        glow: 'shadow-[0_0_12px_rgba(201,168,76,0.4)]'
      };
  }
}

