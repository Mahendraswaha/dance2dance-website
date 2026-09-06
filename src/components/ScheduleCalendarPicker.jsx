import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, Sparkles, Calendar as CalendarIcon, Check } from 'lucide-react';
import { calculateTotalHoursFromSessions, getCategoryTheme, getWeekdayAbbrev } from '../utils/eventHelpers';
import { useTranslation } from 'react-i18next';

export default function ScheduleCalendarPicker({
  sessions = [],
  onChange,
  defaultStartTime = '18:00',
  defaultEndTime = '20:00',
  category = 'bethedance'
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (sessions.length > 0 && sessions[0].date) {
      const [y, m] = sessions[0].date.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });

  // Permite qualquer número customizado de semanas
  const [repeatCount, setRepeatCount] = useState(8);
  const theme = getCategoryTheme(category);

  // Navegação do mês
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Mapeamento de sessões para consulta O(1)
  const sessionMap = useMemo(() => {
    const map = new Map();
    sessions.forEach((s, index) => {
      map.set(s.date, { ...s, index });
    });
    return map;
  }, [sessions]);

  // Cálculo da matriz do calendário
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Segunda-feira como índice 0 no padrão europeu (NO/PT)
    let startDayOfWeek = firstDay.getDay(); // 0(Dom) - 6(Sáb)
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Total de dias no mês atual
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Dias no mês anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Preenchimento do mês anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const iso = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dayNum, iso, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let d = 1; d <= totalDays; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNum: d, iso, isCurrentMonth: true });
    }

    // Preenchimento do próximo mês para fechar o grid em múltiplos de 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let n = 1; n <= remaining; n++) {
      const nextDate = new Date(year, month + 1, n);
      const iso = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({ dayNum: n, iso, isCurrentMonth: false });
    }

    return days;
  }, [currentMonth]);

  // Notifica componente pai sobre atualizações
  const updateSessions = (newSessions) => {
    const sorted = [...newSessions].sort((a, b) => a.date.localeCompare(b.date));
    const totalHours = calculateTotalHoursFromSessions(sorted);
    const startDate = sorted.length > 0 ? sorted[0].date : '';
    const endDate = sorted.length > 0 ? sorted[sorted.length - 1].date : '';
    const startTime = sorted.length > 0 ? sorted[0].startTime : defaultStartTime;
    const endTime = sorted.length > 0 ? sorted[sorted.length - 1].endTime : defaultEndTime;

    if (onChange) {
      onChange(sorted, {
        startDate,
        endDate,
        startTime,
        endTime,
        totalHours,
        totalSessions: sorted.length
      });
    }
  };

  const handleToggleDay = (iso) => {
    if (sessionMap.has(iso)) {
      const next = sessions.filter(s => s.date !== iso);
      updateSessions(next);
    } else {
      const lastSession = sessions[sessions.length - 1];
      const newSession = {
        date: iso,
        startTime: lastSession?.startTime || defaultStartTime || '18:00',
        endTime: lastSession?.endTime || defaultEndTime || '20:00'
      };
      updateSessions([...sessions, newSession]);
    }
  };

  const handleSessionTimeChange = (index, field, value) => {
    const next = [...sessions];
    next[index] = { ...next[index], [field]: value };
    updateSessions(next);
  };

  const handleRemoveSession = (index) => {
    const next = sessions.filter((_, idx) => idx !== index);
    updateSessions(next);
  };

  const handleRepeatWeekly = (baseIso) => {
    if (!baseIso) return;
    const count = Math.max(1, parseInt(repeatCount) || 1);
    const [y, m, d] = baseIso.split('-').map(Number);
    const baseDate = new Date(y, m - 1, d);
    const baseSession = sessionMap.get(baseIso) || {
      startTime: defaultStartTime,
      endTime: defaultEndTime
    };

    const newSessionsMap = new Map(sessions.map(s => [s.date, s]));

    for (let i = 1; i <= count; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i * 7);
      const iso = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
      if (!newSessionsMap.has(iso)) {
        newSessionsMap.set(iso, {
          date: iso,
          startTime: baseSession.startTime,
          endTime: baseSession.endTime
        });
      }
    }

    updateSessions(Array.from(newSessionsMap.values()));
  };

  const handleClearAll = () => {
    if (window.confirm(t("adminPage.schedulePicker.confirmClear", "Deseja remover todas as datas selecionadas?"))) {
      updateSessions([]);
    }
  };

  // Nome do mês sensível ao idioma do site
  const monthName = useMemo(() => {
    const str = currentMonth.toLocaleDateString(currentLang, { month: 'long', year: 'numeric' });
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, [currentMonth, currentLang]);

  // Dias da semana internacionalizados
  const weekDays = useMemo(() => {
    const baseDate = new Date(2026, 0, 5); // 05/01/2026 é Segunda-feira
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const str = d.toLocaleDateString(currentLang, { weekday: 'short' });
      list.push(str.charAt(0).toUpperCase() + str.slice(1).replace('.', ''));
    }
    return list;
  }, [currentLang]);

  const totalCalculatedHours = useMemo(() => calculateTotalHoursFromSessions(sessions), [sessions]);

  return (
    <div className="bg-[#121216] border border-[#2A2A35] rounded-[4px] p-5 text-[#F0EDE8] space-y-5">
      {/* Header do Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#22222A]">
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-accent" />
          <h4 className="font-heading text-xs uppercase tracking-[2px] font-semibold text-[#F0EDE8]">
            {t("adminPage.schedulePicker.title", "Calendário de Sessões e Horários")}
          </h4>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="font-drama text-lg text-[#F0EDE8]">
            {monthName}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-[2px] bg-[#1A1A22] hover:bg-accent hover:text-primary transition-colors text-[#9A9A9A]"
              title={t("adminPage.schedulePicker.prevMonth", "Mês Anterior")}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-[2px] bg-[#1A1A22] hover:bg-accent hover:text-primary transition-colors text-[#9A9A9A]"
              title={t("adminPage.schedulePicker.nextMonth", "Próximo Mês")}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="select-none">
        {/* Dias da semana internacionalizados */}
        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
          {weekDays.map(wd => (
            <span key={wd} className="font-heading text-[10px] uppercase tracking-wider text-[#7A7A85] font-semibold py-1">
              {wd}
            </span>
          ))}
        </div>

        {/* Células dos dias */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((item, idx) => {
            const isSelected = sessionMap.has(item.iso);
            const session = sessionMap.get(item.iso);
            const isToday = new Date().toISOString().split('T')[0] === item.iso;

            return (
              <button
                key={item.iso + idx}
                type="button"
                onClick={() => handleToggleDay(item.iso)}
                className={`min-h-[50px] p-1.5 rounded-[3px] border transition-all flex flex-col justify-between items-start text-left relative group ${
                  isSelected
                    ? `${theme.badgeBg} ${theme.glow} font-semibold scale-[1.02] z-10`
                    : item.isCurrentMonth
                      ? 'bg-[#181820] border-[#262632] hover:border-accent/40 text-[#D4D4D8] hover:bg-[#1E1E28]'
                      : 'bg-[#101014] border-transparent text-[#555562] opacity-40 hover:opacity-80'
                } ${isToday && !isSelected ? 'ring-1 ring-accent/50' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-mono ${isSelected ? theme.textColor : ''}`}>
                    {item.dayNum}
                  </span>
                  {isSelected && (
                    <Check className={`w-3 h-3 ${theme.textColor}`} />
                  )}
                </div>

                {isSelected && (
                  <div className="w-full mt-1">
                    <span className="text-[9px] font-mono leading-tight block truncate opacity-90 text-[#E0E0E6]">
                      {session.startTime}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Atalhos Rápidos & Repetição Customizada com Input Livre e Chips */}
      <div className="bg-[#16161C] border border-[#262630] rounded-[3px] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[#9A9A9A] font-heading text-[11px] uppercase tracking-wider">
            {t("adminPage.schedulePicker.quickRepeat", "Repetir dia selecionado:")}
          </span>
          <div className="flex items-center gap-2">
            {/* Input de número livre para qualquer quantidade de semanas */}
            <div className="flex items-center bg-[#101014] border border-[#33333E] rounded px-2 py-1 focus-within:border-accent">
              <input
                type="number"
                min="1"
                max="52"
                value={repeatCount}
                onChange={(e) => setRepeatCount(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                className="w-10 bg-transparent text-[#F0EDE8] font-mono text-xs text-center focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500 font-heading pl-1">
                {t("adminPage.schedulePicker.weeks", "sem.")}
              </span>
            </div>

            {/* Chips de atalhos rápidos para números frequentes */}
            <div className="hidden sm:flex items-center gap-1">
              {[2, 4, 6, 8, 12].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRepeatCount(n)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    repeatCount === n 
                      ? 'bg-accent text-primary font-bold' 
                      : 'bg-[#181822] text-zinc-400 hover:text-white border border-[#2A2A35]'
                  }`}
                  title={`${n} ${t("adminPage.schedulePicker.weeks", "semanas")}`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={sessions.length === 0}
              onClick={() => handleRepeatWeekly(sessions[sessions.length - 1]?.date)}
              className="px-3 py-1 bg-accent/20 hover:bg-accent text-accent hover:text-primary font-heading uppercase text-[10px] tracking-wider rounded font-semibold transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              {t("adminPage.schedulePicker.applyRepeat", "Repetir")}
            </button>
          </div>
        </div>

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-red-400/70 hover:text-red-400 font-heading text-[11px] uppercase tracking-wider transition-colors"
          >
            {t("adminPage.schedulePicker.clearAll", "Limpar todas")}
          </button>
        )}
      </div>

      {/* Lista de Sessões Marcadas e Ajuste de Horários Individuais */}
      {sessions.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xs uppercase tracking-wider text-[#9A9A9A]">
              {t("adminPage.schedulePicker.selectedDates", "Sessões Agendadas")} ({sessions.length})
            </span>
            <span className="font-heading text-xs text-accent font-semibold">
              {t("adminPage.schedulePicker.totalCalculated", "Carga Horária Total:")} {totalCalculatedHours}h
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {sessions.map((session, idx) => {
              const [y, m, d] = session.date.split('-').map(Number);
              const dateObj = new Date(y, m - 1, d);
              const dayOfWeek = dateObj.toLocaleDateString(currentLang, { weekday: 'short' });
              const dayOfWeekCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).replace('.', '');
              const dateFormatted = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;

              return (
                <div 
                  key={session.date} 
                  className="bg-[#16161E] border border-[#242430] p-2.5 rounded-[2px] flex items-center justify-between gap-3 hover:border-[#3A3A4A] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-[150px]">
                    <span className="font-mono text-accent text-xs font-bold w-5 text-center">
                      #{idx + 1}
                    </span>
                    <span className="font-heading text-xs uppercase text-[#CFCFCF] font-semibold">
                      {dayOfWeekCapitalized}, {dateFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#7A7A85]" />
                      <input
                        type="time"
                        value={session.startTime}
                        onChange={(e) => handleSessionTimeChange(idx, 'startTime', e.target.value)}
                        className="bg-[#101014] border border-[#33333E] text-[#F0EDE8] px-2 py-1 rounded text-xs text-center font-mono focus:outline-none focus:border-accent"
                      />
                      <span className="text-[#666675] text-xs">
                        {t("adminPage.schedulePicker.to", "até")}
                      </span>
                      <input
                        type="time"
                        value={session.endTime}
                        onChange={(e) => handleSessionTimeChange(idx, 'endTime', e.target.value)}
                        className="bg-[#101014] border border-[#33333E] text-[#F0EDE8] px-2 py-1 rounded text-xs text-center font-mono focus:outline-none focus:border-accent"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSession(idx)}
                      className="p-1.5 text-[#7A7A85] hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title={t("adminPage.schedulePicker.removeSession", "Remover sessão")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
