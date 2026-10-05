import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Star, CheckCircle2, Trash2, ShieldCheck, Clock, Award, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function ReviewsManager() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'approved' | 'all'

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      toast.error('Erro ao carregar avaliações.');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status: newStatus, updatedAt: new Date().toISOString() });
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este depoimento?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      toast.success('Depoimento apagado.');
    } catch (err) {
      toast.error('Erro ao apagar.');
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus || (!r.status && filterStatus === 'pending');
  });

  // Calculate metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#121214] border border-[#222222] p-4 rounded-[2px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-heading tracking-widest text-[#9A9A9A]">Média Geral</div>
            <div className="text-xl font-mono text-white flex items-center gap-2">
              {avgRating} <Star className="w-4 h-4 fill-accent text-accent" />
            </div>
          </div>
        </div>
        <div className="bg-[#121214] border border-[#222222] p-4 rounded-[2px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-950/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-heading tracking-widest text-[#9A9A9A]">Pendentes</div>
            <div className="text-xl font-mono text-white">
              {reviews.filter(r => !r.status || r.status === 'pending').length}
            </div>
          </div>
        </div>
        <div className="bg-[#121214] border border-[#222222] p-4 rounded-[2px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-950/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-heading tracking-widest text-[#9A9A9A]">Aprovados</div>
            <div className="text-xl font-mono text-white">
              {reviews.filter(r => r.status === 'approved').length}
            </div>
          </div>
        </div>
        <div className="bg-[#121214] border border-[#222222] p-4 rounded-[2px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-950/30 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-heading tracking-widest text-[#9A9A9A]">Rejeitados</div>
            <div className="text-xl font-mono text-white">
              {reviews.filter(r => r.status === 'rejected').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-[#222222] pb-2 overflow-x-auto">
        <button 
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-colors shrink-0 ${filterStatus === 'pending' ? 'text-accent border-b-2 border-accent' : 'text-[#9A9A9A] hover:text-white'}`}
        >
          Pendentes
        </button>
        <button 
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-colors shrink-0 ${filterStatus === 'approved' ? 'text-accent border-b-2 border-accent' : 'text-[#9A9A9A] hover:text-white'}`}
        >
          Aprovados (Site)
        </button>
        <button 
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-colors shrink-0 ${filterStatus === 'rejected' ? 'text-accent border-b-2 border-accent' : 'text-[#9A9A9A] hover:text-white'}`}
        >
          Rejeitados
        </button>
        <button 
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 text-xs font-heading uppercase tracking-wider transition-colors shrink-0 ${filterStatus === 'all' ? 'text-accent border-b-2 border-accent' : 'text-[#9A9A9A] hover:text-white'}`}
        >
          Todos
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-zinc-500 font-heading text-sm text-center py-10">Carregando avaliações...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-zinc-500 font-heading text-sm text-center py-10">Nenhuma avaliação encontrada.</div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-[#121214] border border-[#222222] p-5 rounded-[2px] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-semibold text-white">{review.userName || review.rawName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[11px] font-heading text-accent/80 uppercase tracking-wider mb-2">
                    {review.eventTitle}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= (review.rating||5) ? 'fill-accent text-accent' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-sm font-sans text-[#E0E0E0] italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex sm:flex-col gap-2 shrink-0 border-t sm:border-t-0 border-[#222222] pt-3 sm:pt-0">
                  {(!review.status || review.status === 'pending') && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                        className="px-3 py-1.5 bg-green-950/30 text-green-400 border border-green-900/50 hover:bg-green-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                        className="px-3 py-1.5 bg-orange-950/30 text-orange-400 border border-orange-900/50 hover:bg-orange-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'pending')}
                        className="px-3 py-1.5 bg-amber-950/30 text-amber-400 border border-amber-900/50 hover:bg-amber-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" /> Para Fila
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                        className="px-3 py-1.5 bg-orange-950/30 text-orange-400 border border-orange-900/50 hover:bg-orange-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    </>
                  )}
                  {review.status === 'rejected' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                        className="px-3 py-1.5 bg-green-950/30 text-green-400 border border-green-900/50 hover:bg-green-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(review.id, 'pending')}
                        className="px-3 py-1.5 bg-amber-950/30 text-amber-400 border border-amber-900/50 hover:bg-amber-900/50 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" /> Para Fila
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-1.5 bg-[#1A1A22] text-red-400 border border-[#2A2A35] hover:bg-red-950/30 rounded-[2px] text-[10px] font-heading uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
