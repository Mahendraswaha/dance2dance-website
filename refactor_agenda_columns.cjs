const fs = require('fs');

let content = fs.readFileSync('src/pages/AgendaPage.jsx', 'utf8');

const targetOld = `                    {/* Bloco Central e Direito */}
                    <div className="flex-1 flex flex-col w-full">
                      
                      {/* Topo: Badge (ocupa exatos 32px de altura para empurrar o Titulo) */}
                      <div className="h-[32px] flex items-center justify-start">
                        <div className="inline-flex items-center justify-center bg-[#1E1E24] px-2 py-1 rounded-[2px] pr-[calc(0.5rem-2px)]">
                          <span className="font-heading text-[9px] uppercase tracking-[2px] text-[#9A9A9A] font-bold ml-[2px]">
                            {badgeText}
                          </span>
                        </div>
                      </div>

                      {/* Linha do Meio: Titulo (Esq) + Botao (Dir) */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
                        <Link to={getDetailsLink(event)} className="block group-hover:text-accent transition-colors">
                          <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8] group-hover:text-accent transition-colors">
                            {dispTitle}
                          </h2>
                        </Link>
                        
                        <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center">
                          {event.instructor && (
                            <span className="font-heading text-[9px] text-[#7A7A7A] uppercase tracking-wider mb-2 text-center w-full block">
                              {t("agendaPage.instructor", "Instrutor")}: <span className="text-[#CFCFCF] font-semibold">{event.instructor}</span>
                            </span>
                          )}
                          {userStatus === 'enrolled' ? (
                            <div className="py-2.5 px-6 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">{t("agendaPage.enrolled")}</div>
                          ) : userStatus === 'waitlist' ? (
                            <div className="py-2.5 px-6 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">{t("agendaPage.waitlist")}</div>
                          ) : (
                            <button 
                              onClick={() => handleEnroll(event.id, isFull)}
                              disabled={actionLoading === event.id}
                              className={\`w-full btn-magnetic font-heading text-[10px] uppercase tracking-[2px] font-semibold py-3 px-8 transition-colors duration-300 rounded-full \${
                                isFull 
                                  ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                                  : 'bg-accent text-primary hover:bg-[#F0EDE8]'
                              }\`}
                            >
                              <span className="relative z-10 block text-center ml-[2px]">
                                {actionLoading === event.id 
                                  ? t('agendaPage.loading') 
                                  : isFull ? t('agendaPage.joinWaitlist') : t('agendaPage.subscribe')}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Linha Inferior: Local (Esq) + Infos extras (Dir) */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full mt-2">
                        <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm">
                          <MapPin className="w-4 h-4 text-accent shrink-0" />
                          <span>{dispLocation}</span>
                        </div>
                        
                        <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center">
                          {(userStatus === 'enrolled' || userStatus === 'waitlist') && (
                            <button onClick={() => handleCancelEnrollment(event.id)} disabled={actionLoading === event.id} className="text-[#9A9A9A] hover:text-red-400 text-[9px] uppercase tracking-wider font-heading transition-colors mt-1">
                              {actionLoading === event.id ? t('agendaPage.loading') : t('agendaPage.cancel')}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>`;

const targetNew = `                    {/* Coluna Central: Informações do Evento */}
                    <div className="flex-1 flex flex-col justify-center min-w-0 w-full space-y-2">
                      <div className="inline-flex items-center justify-center bg-[#1E1E24] px-2 py-1 rounded-[2px] w-fit">
                        <span className="font-heading text-[9px] uppercase tracking-[2px] text-[#9A9A9A] font-bold">
                          {badgeText}
                        </span>
                      </div>

                      <Link to={getDetailsLink(event)} className="block group-hover:text-accent transition-colors">
                        <h2 className="font-drama text-2xl md:text-3xl text-[#F0EDE8] group-hover:text-accent transition-colors">
                          {dispTitle}
                        </h2>
                      </Link>

                      <div className="flex items-center gap-2 text-[#9A9A9A] font-heading text-sm pt-1">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span>{dispLocation}</span>
                      </div>
                    </div>

                    {/* Coluna Direita: Instrutor + Ações (Perfeitamente Centralizados na Vertical) */}
                    <div className="shrink-0 w-full md:w-auto md:min-w-[180px] flex flex-col items-center justify-center">
                      {event.instructor && (
                        <span className="font-heading text-[9px] text-[#7A7A7A] uppercase tracking-wider mb-2 text-center w-full block">
                          {t("agendaPage.instructor", "Instrutor")}: <span className="text-[#CFCFCF] font-semibold">{event.instructor}</span>
                        </span>
                      )}

                      {userStatus === 'enrolled' ? (
                        <div className="py-2.5 px-6 border border-green-500/30 bg-green-900/10 text-green-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
                          {t("agendaPage.enrolled")}
                        </div>
                      ) : userStatus === 'waitlist' ? (
                        <div className="py-2.5 px-6 border border-yellow-500/30 bg-yellow-900/10 text-yellow-400 rounded-full font-heading text-xs font-bold uppercase tracking-[1px] text-center w-full">
                          {t("agendaPage.waitlist")}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEnroll(event.id, isFull)}
                          disabled={actionLoading === event.id}
                          className={\`w-full btn-magnetic font-heading text-[10px] uppercase tracking-[2px] font-semibold py-3 px-8 transition-colors duration-300 rounded-full \${
                            isFull 
                              ? 'border border-[#333333] text-[#F0EDE8] hover:border-accent hover:text-accent' 
                              : 'bg-accent text-primary hover:bg-[#F0EDE8]'
                          }\`}
                        >
                          <span className="relative z-10 block text-center ml-[2px]">
                            {actionLoading === event.id 
                              ? t('agendaPage.loading') 
                              : isFull ? t('agendaPage.joinWaitlist') : t('agendaPage.subscribe')}
                          </span>
                        </button>
                      )}

                      {(userStatus === 'enrolled' || userStatus === 'waitlist') && (
                        <button 
                          onClick={() => handleCancelEnrollment(event.id)} 
                          disabled={actionLoading === event.id} 
                          className="text-[#9A9A9A] hover:text-red-400 text-[9px] uppercase tracking-wider font-heading transition-colors mt-2 text-center block"
                        >
                          {actionLoading === event.id ? t('agendaPage.loading') : t('agendaPage.cancel')}
                        </button>
                      )}
                    </div>`;

if (!content.includes('Linha Inferior: Local')) {
  console.log("Error: old block not matched");
  process.exit(1);
}

content = content.replace(targetOld, targetNew);
fs.writeFileSync('src/pages/AgendaPage.jsx', content, 'utf8');
console.log('Successfully refactored card into 3 clean vertical-centered columns!');
