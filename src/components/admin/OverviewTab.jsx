import React, { useMemo, useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function OverviewTab({ events, userEnrollments, usersCount }) {
  const [failedEmails, setFailedEmails] = useState([]);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFailedEmails = async () => {
    setIsLoading(true);
    try {
      // Query global para achar falhas no envio (outbox pattern)
      const q = query(
        collection(db, 'enrollments'),
        where('emailSent', '==', false)
      );
      const snapshot = await getDocs(q);
      const failures = [];
      snapshot.forEach(docSnap => {
        failures.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFailedEmails(failures);
    } catch (err) {
      console.error("Erro ao buscar emails falhados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFailedEmails();
  }, []);

  const handleResend = async (enrollment) => {
    if (!window.confirm(`Reenviar e-mail para ${enrollment.userName || enrollment.userEmail}?`)) return;
    setIsResending(true);
    try {
      // Chama a mesma API de agenda-notify que o frontend original chamaria
      const ev = events.find(e => e.id === enrollment.eventId) || {};
      
      const payload = {
        eventId: enrollment.eventId,
        userId: enrollment.userId,
        userEmail: enrollment.userEmail,
        userName: enrollment.userName,
        eventTitleEn: ev.title_en || 'Dance2Dance Event',
        eventTitlePt: ev.title_pt || 'Dance2Dance Event',
        eventTitleNo: ev.title_no || 'Dance2Dance Event',
        eventDate: ev.startDate || '',
        eventTime: ev.startTime || '',
        language: enrollment.language || 'en'
      };

      const response = await fetch('/api/agenda-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Falha no webhook da Vercel');
      }

      // Se sucesso, atualiza o documento removendo a flag de erro
      await updateDoc(doc(db, 'enrollments', enrollment.id), {
        emailSent: true
      });
      
      alert('E-mail reenviado com sucesso!');
      await fetchFailedEmails();

    } catch (err) {
      console.error(err);
      alert('Erro ao reenviar: ' + err.message);
    } finally {
      setIsResending(false);
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date());
  
  const totalRevenue = useMemo(() => {
    return upcomingEvents.reduce((acc, ev) => {
      const price = parseFloat(ev.price) || 0;
      const enrolled = ev.enrolledCount || 0;
      return acc + (price * enrolled);
    }, 0);
  }, [upcomingEvents]);

  const totalWaitlist = upcomingEvents.reduce((acc, ev) => acc + (ev.waitlistCount || 0), 0);
  
  const hasFailures = failedEmails.length > 0;

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

      {/* Alertas Críticos (Red or Green) */}
      <div className={`border rounded-md p-6 ${hasFailures ? 'bg-red-950/20 border-red-900/50' : 'bg-green-950/20 border-green-900/50'}`}>
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full mt-1 border ${hasFailures ? 'bg-red-900/40 border-red-800/50' : 'bg-green-900/40 border-green-800/50'}`}>
            {hasFailures ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
          </div>
          <div className="flex-1">
            <h3 className={`${hasFailures ? 'text-red-300' : 'text-green-300'} font-heading text-sm uppercase tracking-[1px] font-semibold mb-2`}>
              E-mails com Falha de Envio (Outbox)
            </h3>
            
            {!hasFailures ? (
              <p className="text-sm text-green-200/70">
                Nenhuma falha detectada. Todos os sistemas operando normalmente. Se a internet de algum aluno cair durante o cadastro e o servidor não conseguir enviar o e-mail, ele aparecerá aqui para você reenviar manualmente.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-200/70 max-w-3xl">
                  Atenção: A internet de alguns alunos falhou durante a inscrição e o webhook da Vercel não confirmou o envio do e-mail. Reenvie manualmente abaixo:
                </p>
                <div className="bg-[#0A0A0E] border border-red-900/30 rounded overflow-hidden">
                  {failedEmails.map(enr => (
                    <div key={enr.id} className="p-3 border-b border-red-900/20 flex items-center justify-between last:border-0">
                      <div>
                        <div className="text-sm font-medium text-white">{enr.userName || 'Aluno'}</div>
                        <div className="text-xs text-zinc-400">{enr.userEmail}</div>
                      </div>
                      <button
                        onClick={() => handleResend(enr)}
                        disabled={isResending}
                        className="flex items-center gap-2 bg-red-900/40 hover:bg-red-800/60 text-red-100 px-3 py-1.5 rounded text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                        Forçar Reenvio
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
