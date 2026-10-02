import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix outer wrapper padding to push the modal down
text = text.replace(
    'className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"',
    'className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-28 md:pt-36"'
)

# Fix max-height so it doesn't overflow at the bottom due to the top padding
text = text.replace(
    'max-h-[90vh]',
    'max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-10rem)]'
)

with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Modal padding and max-height adjusted.')
