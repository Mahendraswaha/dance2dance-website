import json
import openpyxl

texts = {
    "pt": {
        "kicker": "BE THE DANCE",
        "title": "Good Morning Dance",
        "subtitle": "Dance antes que o dia te absorva.",
        "hook": "Esta aula de dança matinal é para quem quer começar o dia com música, movimento e um tempinho só para si.",
        "block1": {
            "p1": "Que tal começar sua manhã com movimento, em vez de pressa? Antes de checar seu celular, e-mails e listas de tarefas, reserve um tempinho só para você.",
            "p2": "Good Morning Dance oferece uma maneira única de começar o seu dia. Usamos música e movimento para energizar seu corpo, dar o pontapé inicial e curtir um pouco de diversão antes que o dia tome conta de tudo. Você não precisa ser dançarino, saber os passos nem se apresentar. Basta vir como você é e se deixar levar pelo movimento.",
            "p3": "Fazemos alongamentos, chacoalhamos, balançamos e exploramos o ritmo e a dança. Às vezes, há uma sequência simples para seguir; outras vezes, há espaço para improvisar. Tudo o que você precisa é deixar a música te levar.",
            "pullQuote": "O importante não é acertar os movimentos. Trata-se de se conectar com seu corpo e aproveitar a sensação do movimento."
        },
        "session": {
            "title": "A sessão",
            "items": [
                {
                    "title": "Acorde",
                    "desc": "Começamos suavemente com um aquecimento para dar o pontapé inicial."
                },
                {
                    "title": "Mova-se",
                    "desc": "A música nos leva de movimentos simples ao ritmo, à dança e à exploração lúdica."
                },
                {
                    "title": "Brinque",
                    "desc": "Não precisa se levar muito a sério. Você pode rir, suar um pouco e se surpreender."
                },
                {
                    "title": "Sinta-se bem",
                    "desc": "Você vai sair se sentindo mais desperto e com a sensação de que já aproveitou ao máximo a manhã."
                }
            ]
        },
        "experience": {
            "title": "A experiência",
            "p1": "Só você, seu corpo, a música e a liberdade de se mover.",
            "p2": "Cada aula é diferente, mas sempre começamos devagar, dando tempo para você entrar no clima. Depois, a música vai ganhando força e a dança acontece. Podem haver sequências guiadas, exercícios simples, improvisação e momentos em que você pode esquecer os passos e seguir o que lhe fizer bem.",
            "p3": "Se você está pensando: “Não sou bailarino”, essa aula é exatamente para você.",
            "p4": "Não há coreografia para dominar nem ninguém para impressionar. Você pode fazer movimentos tão amplos ou tão pequenos quanto quiser. Pode acompanhar, imitar, brincar, dançar livremente, ou simplesmente se mover da maneira que parecer mais natural naquela manhã. Essa é a dança sem a pressão de ter que ser bom nisso."
        },
        "different_way": {
            "title": "Uma maneira diferente de começar o dia",
            "p1": "Você não precisa começar todas as manhãs da mesma forma. De vez em quando, você pode reservar uma hora para si mesmo antes que o dia passe a girar em torno de todo mundo e de tudo o mais. Dance. E lembre-se:",
            "pullQuote": "Seu corpo não é algo que você precisa consertar. É algo que você tem a oportunidade de vivenciar.",
            "closingQuote": "Quero que “Good Morning Dance” seja um presente que você dá a si mesmo antes do dia começar. Não mais uma coisa que você precisa realizar. Apenas um pouco de música, alguns movimentos e uma oportunidade de se sentir bem no seu próprio corpo.",
            "signoff": "— Safia"
        }
    },
    "en": {
        "kicker": "BE THE DANCE",
        "title": "Good Morning Dance",
        "subtitle": "Dance before the day takes over",
        "hook": "This morning dance class is for those who want to start the day with music, movement and some time for themselves.",
        "block1": {
            "p1": "How would you like to start your morning with movement instead of rushing? Before you check your phone, emails and to-do lists, take a little time for yourself.",
            "p2": "Good Morning Dance offers a unique way to start your day. We use music and movement to energise your body, get things moving, and enjoy some fun before the day takes over. You don't need to be a dancer, know the steps or perform. Just come as you are and let yourself move.",
            "p3": "We stretch, groove, shake and explore rhythm and dance. Sometimes there's a simple sequence to follow, and sometimes there's space to improvise. All you need is to let the music take you away.",
            "pullQuote": "This isn't about getting the movements right. It's about connecting with your body and enjoying the sensation of movement."
        },
        "session": {
            "title": "The session",
            "items": [
                {
                    "title": "Wake up",
                    "desc": "We start gently with a warm-up to get things moving."
                },
                {
                    "title": "Move",
                    "desc": "Music takes us from simple movement into rhythm, dance and playful exploration."
                },
                {
                    "title": "Play",
                    "desc": "There's no need to take yourself too seriously. You might laugh, sweat a little, and surprise yourself."
                },
                {
                    "title": "Feel good",
                    "desc": "You will leave feeling more awake and with a sense that you have already made the most of the morning."
                }
            ]
        },
        "experience": {
            "title": "The experience",
            "p1": "Just you, your body, the music and the freedom to move.",
            "p2": "Every class is different, but we always start gently, giving you time to arrive. Then the music builds and we dance. There may be guided sequences, simple exercises, improvisation and moments when you can forget about the steps and follow what feels good.",
            "p3": "If you're thinking, 'I'm not a dancer', this class is exactly for you.",
            "p4": "There is no choreography to master and no one to impress. You can make your movements as big or as small as you like. You can follow, copy, play or freestyle, or simply move in whatever way feels natural that morning. This is dance without the pressure to be good at it."
        },
        "different_way": {
            "title": "A different way to start the day",
            "p1": "You don't have to start every morning in the same way. Eventually, you could allow yourself an hour before the day becomes all about everyone and everything else. Dance! And remember:",
            "pullQuote": "Your body isn't something you have to fix. It's something you get to experience!",
            "closingQuote": "I want Good Morning Dance to be a little gift that you give yourself before the day begins. Not another thing you have to achieve. Just some music, some movement, and an opportunity to feel good in your own body.",
            "signoff": "— Safia"
        }
    },
    "no": {
        "kicker": "BE THE DANCE",
        "title": "Good Morning Dance",
        "subtitle": "Dans før dagen tar over",
        "hook": "This morning dance class is for those who want to start the day with music, movement and some time for themselves.",
        "block1": {
            "p1": "How would you like to start your morning with movement instead of rushing? Before you check your phone, emails and to-do lists, take a little time for yourself.",
            "p2": "Good Morning Dance offers a unique way to start your day. We use music and movement to energise your body, get things moving, and enjoy some fun before the day takes over. You don't need to be a dancer, know the steps or perform. Just come as you are and let yourself move.",
            "p3": "We stretch, groove, shake and explore rhythm and dance. Sometimes there's a simple sequence to follow, and sometimes there's space to improvise. All you need is to let the music take you away.",
            "pullQuote": "This isn't about getting the movements right. It's about connecting with your body and enjoying the sensation of movement."
        },
        "session": {
            "title": "The session",
            "items": [
                {
                    "title": "Wake up",
                    "desc": "We start gently with a warm-up to get things moving."
                },
                {
                    "title": "Move",
                    "desc": "Music takes us from simple movement into rhythm, dance and playful exploration."
                },
                {
                    "title": "Play",
                    "desc": "There's no need to take yourself too seriously. You might laugh, sweat a little, and surprise yourself."
                },
                {
                    "title": "Feel good",
                    "desc": "You will leave feeling more awake and with a sense that you have already made the most of the morning."
                }
            ]
        },
        "experience": {
            "title": "The experience",
            "p1": "Just you, your body, the music and the freedom to move.",
            "p2": "Every class is different, but we always start gently, giving you time to arrive. Then the music builds and we dance. There may be guided sequences, simple exercises, improvisation and moments when you can forget about the steps and follow what feels good.",
            "p3": "If you're thinking, 'I'm not a dancer', this class is exactly for you.",
            "p4": "There is no choreography to master and no one to impress. You can make your movements as big or as small as you like. You can follow, copy, play or freestyle, or simply move in whatever way feels natural that morning. This is dance without the pressure to be good at it."
        },
        "different_way": {
            "title": "A different way to start the day",
            "p1": "You don't have to start every morning in the same way. Eventually, you could allow yourself an hour before the day becomes all about everyone and everything else. Dance! And remember:",
            "pullQuote": "Your body isn't something you have to fix. It's something you get to experience!",
            "closingQuote": "I want Good Morning Dance to be a little gift that you give yourself before the day begins. Not another thing you have to achieve. Just some music, some movement, and an opportunity to feel good in your own body.",
            "signoff": "— Safia"
        }
    }
}

# Update JSON files
for lang in ['pt', 'en', 'no']:
    filepath = f"C:/Renas/Antigravity/Website-builder/src/i18n/locales/{lang}.json"
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "good_morning_dance" not in data:
        data["good_morning_dance"] = {}
    
    # Merge the dict
    data["good_morning_dance"] = texts[lang]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("JSON files updated")

# Update Excel file
wb = openpyxl.load_workbook(r'C:\Renas\Antigravity\Dance2Dance_Traducoes_Revisao.xlsx')
ws = wb.active

def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        elif isinstance(v, list):
            for i, val in enumerate(v):
                if isinstance(val, dict):
                    items.extend(flatten_dict(val, f"{new_key}[{i}]", sep=sep).items())
                else:
                    items.append((f"{new_key}[{i}]", val))
        else:
            items.append((new_key, v))
    return dict(items)

flat_pt = flatten_dict(texts['pt'], 'good_morning_dance')
flat_en = flatten_dict(texts['en'], 'good_morning_dance')
flat_no = flatten_dict(texts['no'], 'good_morning_dance')

max_row = ws.max_row
key_col_idx = 3

for key, pt_val in flat_pt.items():
    en_val = flat_en.get(key, "")
    no_val = flat_no.get(key, "")
    
    found = False
    for row in range(2, max_row + 1):
        if ws.cell(row=row, column=key_col_idx).value == key:
            ws.cell(row=row, column=4).value = pt_val
            ws.cell(row=row, column=5).value = en_val
            ws.cell(row=row, column=6).value = no_val
            ws.cell(row=row, column=7).value = 'Revisado'
            found = True
            break
            
    if not found:
        max_row += 1
        ws.cell(row=max_row, column=1).value = max_row - 1
        ws.cell(row=max_row, column=2).value = 'Good Morning Dance'
        ws.cell(row=max_row, column=3).value = key
        ws.cell(row=max_row, column=4).value = pt_val
        ws.cell(row=max_row, column=5).value = en_val
        ws.cell(row=max_row, column=6).value = no_val
        ws.cell(row=max_row, column=7).value = 'Revisado'
        ws.cell(row=max_row, column=8).value = 'Added via script'

wb.save(r'C:\Renas\Antigravity\Dance2Dance_Traducoes_Revisao.xlsx')
print("Excel updated")
