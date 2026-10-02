import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update save logic for Admin Notes
old_save_note = "author: currentUser?.displayName || currentUser?.email || 'Admin',"
new_save_note = "author: currentUser?.profile?.fullName || currentUser?.profile?.nome || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Admin'),"
text = text.replace(old_save_note, new_save_note)

# 2. Update save logic for CRM Evaluations
old_save_eval = "instructorName: currentUser?.displayName || currentUser?.email || 'Admin',"
new_save_eval = "instructorName: currentUser?.profile?.fullName || currentUser?.profile?.nome || currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Admin'),"
text = text.replace(old_save_eval, new_save_eval)

# 3. Update UI rendering for Admin Notes
old_ui_note = "{note.author || 'Admin'}"
new_ui_note = "{note.author?.includes('@') ? note.author.split('@')[0].charAt(0).toUpperCase() + note.author.split('@')[0].slice(1) : (note.author || 'Admin')}"
text = text.replace(old_ui_note, new_ui_note)

# 4. Update UI rendering for CRM Evaluations
old_ui_eval = "({enr.evaluation.instructorName})"
new_ui_eval = "({enr.evaluation.instructorName?.includes('@') ? enr.evaluation.instructorName.split('@')[0].charAt(0).toUpperCase() + enr.evaluation.instructorName.split('@')[0].slice(1) : enr.evaluation.instructorName})"
text = text.replace(old_ui_eval, new_ui_eval)

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Names updated.')
