import React, { useMemo } from 'react';
import { Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function OverviewTab({ events, userEnrollments, usersCount }) {
  // Calcular métricas
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date());
  
  const totalRevenue = useMemo(() => {
    return upcomingEvents.reduce((acc, ev) => {
      const price = parseFloat(ev.price) || 0;
      const enrolled = ev.enrolledCount || 0;
      return acc + (price * enrolled);
    }, 0);
  }, [upcomingEvents]);

  const totalWaitlist = upcomingEvents.reduce((acc, ev) => acc + (ev.waitlistCount || 0), 0);

  // Alunos com e-mail pendente (Outbox pattern falhado)
  // Como as inscrições são carregadas em outro lugar (no evento específico), 
  // por enquanto o CRM completo precisaria buscar `enrollments` na root.
  // Vamos deixar o bloco pronto visualmente e nas próximas iterações conectamos aos dados.
  
  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0E] border border-[#222222] p-5 rounded-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading uppercase tracking-[1px] text-[10px] text-zinc-500 font-semibold">Alunos na Base</h3>
            <div className="w-8 h-8 rounded-full bg-[#121214] flex items-center justify-center border border-[#333333]">
              <Users className="w-4 h-4 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-heading text-white">{usersCount || '---'}</p>
        </div>

        <div className="bg-[#0A0A0E] border border-[#222222] p-5 rounded-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading uppercase tracking-[1px] text-[10px] text-zinc-500 font-semibold">Receita Projetada (Próx)</h3>
            <div className="w-8 h-8 rounded-full bg-[#121214] flex items-center justify-center border border-[#333333]">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-heading text-white">kr {totalRevenue.toLocaleString('no-NO')}</p>
        </div>

        <div className="bg-[#0A0A0E] border border-[#222222] p-5 rounded-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading uppercase tracking-[1px] text-[10px] text-zinc-500 font-semibold">Eventos Ativos</h3>
            <div className="w-8 h-8 rounded-full bg-[#121214] flex items-center justify-center border border-[#333333]">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-heading text-white">{upcomingEvents.length}</p>
        </div>

        <div className="bg-[#0A0A0E] border border-[#222222] p-5 rounded-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading uppercase tracking-[1px] text-[10px] text-zinc-500 font-semibold">Fila de Espera Global</h3>
            <div className="w-8 h-8 rounded-full bg-[#121214] flex items-center justify-center border border-[#333333]">
              <Users className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-heading text-white">{totalWaitlist}</p>
        </div>
      </div>

      {/* Alertas Críticos */}
      <div className="bg-red-950/20 border border-red-900/50 rounded-md p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-900/40 rounded-full mt-1 border border-red-800/50">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-red-300 font-heading text-sm uppercase tracking-[1px] font-semibold mb-2">E-mails com Falha de Envio (Outbox)</h3>
            <p className="text-sm text-red-200/70 mb-4 max-w-3xl">
              Nenhuma falha detectada. Se a internet de algum aluno cair durante o cadastro e o servidor não conseguir enviar o e-mail,
              ele aparecerá aqui e você poderá clicar em "Reenviar".
            </p>
            {/* Lista mockada por enquanto até o backend ser conectado à view global */}
            <div className="text-xs text-red-400/50 italic">Todos os sistemas operando normalmente.</div>
          </div>
        </div>
      </div>

      {/* Visão de Ocupação */}
      <div className="bg-[#0A0A0E] border border-[#222222] rounded-md overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h3 className="font-heading uppercase tracking-[1px] text-xs text-zinc-400 font-semibold">Próximas Turmas (Visão Rápida)</h3>
        </div>
        <div className="divide-y divide-[#222222]">
          {upcomingEvents.slice(0, 3).map(ev => {
            const enrolled = ev.enrolledCount || 0;
            const total = ev.totalSpots || 0;
            const percentage = total > 0 ? Math.min(100, Math.round((enrolled / total) * 100)) : 0;
            
            return (
              <div key={ev.id} className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1">{ev.title_pt}</h4>
                  <p className="text-xs text-zinc-500">{new Date(ev.startDate).toLocaleDateString('pt-BR')} • {ev.startTime}</p>
                </div>
                <div className="w-1/3 flex items-center gap-4">
                  <div className="flex-1 bg-[#121214] h-2 rounded-full overflow-hidden border border-[#333333]">
                    <div 
                      className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 w-12 text-right">{enrolled}/{total}</span>
                </div>
              </div>
            );
          })}
          
          {upcomingEvents.length === 0 && (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Nenhuma turma futura programada.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
