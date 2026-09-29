const fs = require('fs');

let code = fs.readFileSync('src/pages/ProfilePage.jsx', 'utf8');

const dangerZoneUI = `</form>

              {/* DANGER ZONE */}
              <div className="mt-16 pt-8 border-t border-red-900/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[2px] bg-red-950/20 border border-red-900/40">
                  <div>
                    <h3 className="text-red-400 font-heading text-sm font-bold tracking-wider uppercase mb-1 flex items-center gap-2">
                      <TriangleAlert className="w-4 h-4" />
                      {t('profile.dangerZone', 'Zona de Perigo')}
                    </h3>
                    <p className="text-zinc-500 font-sans text-xs">
                      {t('profile.dangerZoneDesc', 'Ao excluir sua conta, você perderá acesso permanente a todos os seus dados e inscrições. Esta ação é irreversível.')}
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    className="whitespace-nowrap px-6 py-3 bg-red-950 hover:bg-red-900 text-red-300 hover:text-white border border-red-900 hover:border-red-500 transition-colors rounded-[2px] font-heading text-[10px] uppercase tracking-[2px] font-bold shrink-0 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('profile.deleteAccountBtn', 'Excluir Conta')}
                  </button>
                </div>
              </div>`;

code = code.replace("</form>", dangerZoneUI);

fs.writeFileSync('src/pages/ProfilePage.jsx', code, 'utf8');
console.log('Danger Zone injected globally');
