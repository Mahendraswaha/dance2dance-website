import io
import re

with io.open('src/pages/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the incorrect ternary
old = """) : masterTab === 'wishlists' ? (
          <WishlistManager onScheduleWorkshop={handleScheduleFromWishlist} />
        )}"""

new = """) : masterTab === 'wishlists' ? (
          <WishlistManager onScheduleWorkshop={handleScheduleFromWishlist} />
        ) : null}"""

if old in content:
    content = content.replace(old, new)
    with io.open('src/pages/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed ternary syntax.")
else:
    print("Could not find the target string to replace.")
