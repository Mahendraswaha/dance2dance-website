import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/AdminDashboard.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

content = content.replace(
'''      "Be Stillness",
      "Be the Dance Pro",
      "Be the Dance Day",
      "Be the Dance: Bedrift"''',
'''      "Be Stillness",
      "Be the Dance Pro",
      "Be the Dance Day",
      "Be the Dance: Bedrift",
      "Good Morning Dance"'''
)

content = content.replace(
'''      "Be Stillness",
      "Be the Dance Pro",
      "Be the Dance Day",
      "Be the Dance: Corporate"''',
'''      "Be Stillness",
      "Be the Dance Pro",
      "Be the Dance Day",
      "Be the Dance: Corporate",
      "Good Morning Dance"'''
)

content = content.replace(
'''      "/be-the-dance/be-the-dance-pro",
      "/be-the-dance/be-the-dance-day",
      "/be-the-dance/empresas"''',
'''      "/be-the-dance/be-the-dance-pro",
      "/be-the-dance/be-the-dance-day",
      "/be-the-dance/empresas",
      "/be-the-dance/good-morning-dance"'''
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("AdminDashboard updated.")
