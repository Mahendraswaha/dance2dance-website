import codecs
import re

filepath = 'C:/Renas/Antigravity/Website-builder/src/components/admin/UserDetailModal.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# Add props
content = content.replace(
    'export default function UserDetailModal({ user, userEnrollments = [], onClose, onRoleChange, onEvaluationUpdated }) {',
    'export default function UserDetailModal({ user, userEnrollments = [], onClose, onRoleChange, onEvaluationUpdated, onUserDeleted, onUserUpdated }) {'
)

# Add edit state and handlers
state_injection = '''  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditing && user) {
      setEditData({
        phone: user.phone || '',
        birthDate: user.birthDate || user.birthdate || user.dataNascimento || user.nascimento || '',
        city: user.city || '',
        country: user.country || '',
        address: user.address || user.endereco || '',
        zip: user.zip || user.cep || '',
        experiencia: user.experiencia || user.experience || '',
        restricoes: user.restricoes || user.restrictions || ''
      });
    }
  }, [isEditing, user]);

  const handleEditChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    setIsSavingEdit(true);
    try {
      const uid = user.id || user.uid;
      await updateDoc(doc(db, 'users', uid), editData);
      if (onUserUpdated) onUserUpdated(uid, editData);
      setIsEditing(false);
      toast.success(t('adminPage.usersManager.updateSuccess', 'Cadastro atualizado com sucesso.'));
    } catch (error) {
      console.error(error);
      toast.error(t('adminPage.usersManager.updateError', 'Erro ao atualizar cadastro.'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(t('adminPage.usersManager.confirmDelete', 'Tem certeza que deseja excluir permanentemente este cadastro? Esta ação não pode ser desfeita.'))) return;
    
    setIsDeleting(true);
    try {
      const uid = user.id || user.uid;
      await deleteDoc(doc(db, 'users', uid));
      if (onUserDeleted) onUserDeleted(uid);
      toast.success(t('adminPage.usersManager.deleteSuccess', 'Cadastro excluído com sucesso.'));
    } catch (error) {
      console.error(error);
      toast.error(t('adminPage.usersManager.deleteError', 'Erro ao excluir cadastro.'));
    } finally {
      setIsDeleting(false);
    }
  };'''

content = content.replace('  const [isAddingNote, setIsAddingNote] = useState(false);', state_injection)

# Modify fields to show inputs when isEditing
content = re.sub(
    r'<span className="text-\[#E0DDD5\] font-mono">\s*\{birthInfo\?\.display \|\| birthDate \|\| \x27-\x27\}\s*</span>',
    '''{isEditing ? (
                      <input type="date" name="birthDate" value={editData.birthDate} onChange={handleEditChange} className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />
                    ) : (
                      <span className="text-[#E0DDD5] font-mono">{birthInfo?.display || birthDate || '-'}</span>
                    )}''',
    content
)

content = re.sub(
    r'<span className="text-\[#E0DDD5\] font-mono">\s*\{phone \|\| \x27-\x27\}\s*</span>',
    '''{isEditing ? (
                      <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-40" />
                    ) : (
                      <span className="text-[#E0DDD5] font-mono">{phone || '-'}</span>
                    )}''',
    content
)

content = re.sub(
    r'<span className="text-\[#E0DDD5\]">\{\[city, country\]\.filter\(Boolean\)\.join\(\x27 \x80\xa2 \x27\) \|\| \x27-\x27\}</span>',
    '''{isEditing ? (
                      <div className="flex gap-2">
                        <input type="text" name="city" value={editData.city} onChange={handleEditChange} placeholder="Cidade" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-24" />
                        <input type="text" name="country" value={editData.country} onChange={handleEditChange} placeholder="País" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-24" />
                      </div>
                    ) : (
                      <span className="text-[#E0DDD5]">{[city, country].filter(Boolean).join(' • ') || '-'}</span>
                    )}''',
    content
)

content = re.sub(
    r'<p className="text-\[#CFCFCF\] text-sm whitespace-pre-line">\s*\{address\} <br />\s*\{zip\} \{neighborhood\} \{city\} - \{country\}\s*</p>',
    '''{isEditing ? (
                      <div className="flex flex-col gap-2 mt-2">
                        <input type="text" name="address" value={editData.address} onChange={handleEditChange} placeholder="Endereço" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-full" />
                        <input type="text" name="zip" value={editData.zip} onChange={handleEditChange} placeholder="CEP" className="bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded w-32" />
                      </div>
                    ) : (
                      <p className="text-[#CFCFCF] text-sm whitespace-pre-line">
                        {address} <br />
                        {zip} {neighborhood} {city} - {country}
                      </p>
                    )}''',
    content
)

content = re.sub(
    r'<p className="font-light leading-relaxed whitespace-pre-line">\s*\{restricoes \|\| <span className="text-\[#555555\] italic">\{t\(\x27adminPage\.usersManager\.none\x27, \x27Nenhuma\x27\)\}</span>\}\s*</p>',
    '''{isEditing ? (
                          <textarea name="restricoes" value={editData.restricoes} onChange={handleEditChange} className="w-full bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded mt-2 h-20 resize-none"></textarea>
                        ) : (
                          <p className="font-light leading-relaxed whitespace-pre-line">
                            {restricoes || <span className="text-[#555555] italic">{t('adminPage.usersManager.none', 'Nenhuma')}</span>}
                          </p>
                        )}''',
    content
)

content = re.sub(
    r'<p className="font-light leading-relaxed whitespace-pre-line">\s*\{experiencia \|\| <span className="text-\[#555555\] italic">\{t\(\x27adminPage\.usersManager\.none\x27, \x27Nenhuma\x27\)\}</span>\}\s*</p>',
    '''{isEditing ? (
                          <textarea name="experiencia" value={editData.experiencia} onChange={handleEditChange} className="w-full bg-[#14141A] border border-[#333] text-sm text-[#E0DDD5] px-2 py-1 rounded mt-2 h-20 resize-none"></textarea>
                        ) : (
                          <p className="font-light leading-relaxed whitespace-pre-line">
                            {experiencia || <span className="text-[#555555] italic">{t('adminPage.usersManager.none', 'Nenhuma')}</span>}
                          </p>
                        )}''',
    content
)

# Footer Buttons
footer_code = '''          {/* Footer do Modal */}
          <div className="p-4 sm:p-6 bg-[#0D0D12] border-t border-[#1A1A24] flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-500 font-heading">
              ID: <span className="font-mono text-zinc-400">{user.id || user.uid}</span>
            </span>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-[2px] bg-red-950/20 hover:bg-red-900/40 border border-red-900/40 text-xs font-heading font-semibold uppercase tracking-wider text-red-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>

              {isEditing ? (
                <>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-zinc-400 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className="px-4 py-2 rounded-[2px] bg-accent/20 hover:bg-accent/30 border border-accent/40 text-xs font-heading font-semibold uppercase tracking-wider text-accent transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingEdit ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-zinc-300 transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-6 py-2 rounded-[2px] bg-[#14141C] hover:bg-[#1E1E28] border border-[#2A2A38] text-xs font-heading font-semibold uppercase tracking-wider text-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    {t('adminPage.usersManager.close', 'Fechar')}
                  </button>
                </>
              )}
            </div>
          </div>'''

content = re.sub(
    r'\{\/\* Footer do Modal \*\/}.*?</button>\s*</div>',
    footer_code,
    content,
    flags=re.DOTALL
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("UserDetailModal updated with Edit and Delete functionality.")
