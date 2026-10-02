import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the broken line first
broken_target = '''                              className={\w-3 h-3 \\} 
                            />'''
fixed_target = '''                              className={`w-3 h-3 ${s <= enr.userFeedback.rating ? 'fill-accent text-accent' : 'text-zinc-700'}`} 
                            />'''

text = text.replace(broken_target, fixed_target)

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed JSX syntax')
