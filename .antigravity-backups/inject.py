import io

with io.open(r"C:\Users\rmm99\.gemini\antigravity\brain\5a33816a-31e4-4322-b474-a139436be4f9\dance2dance-growth-strategy.md", "r", encoding="utf-8-sig") as f:
    text = f.read()

target = """### 1.3 Jornada Detalhada \u2014 Financiador / Sponsor"""

replacement = """### 1.3 Jornada Detalhada \u2014 Empresas (Corporate B2B)

| Etapa | Objetivo | Canal | A\u00e7\u00e3o |
|-------|----------|-------|------|
| **Descoberta** | Gerar interesse RH/Lideran\u00e7a | LinkedIn, Networking ativo, SEO (buscas B2B) | Posts sobre produtividade, estresse e team building |
| **Considera\u00e7\u00e3o** | Educar sobre o m\u00e9todo | P\u00e1gina Corporate (dance2dance.no/corporate) | Apresentar os programas Be The Dance e Biostretch In-Company |
| **Abordagem** | Reuni\u00e3o Executiva | E-mail / Call / LinkedIn | Entender a dor da equipe e propor uma solu\u00e7\u00e3o sob medida |
| **Experimenta\u00e7\u00e3o** | Prova de Valor | Escrit\u00f3rio do cliente | Masterclass de 60 min in-company ou evento "Lunch & Learn" |
| **Convers\u00e3o** | Fechamento B2B | Jur\u00eddico / Comercial | Contrato de workshops regulares, pausa ativa ou retiro anual |
| **Expans\u00e3o** | Reten\u00e7\u00e3o | CRM / Account Management | Pesquisas de satisfa\u00e7\u00e3o da equipe (pulse checks) e renova\u00e7\u00e3o |

### 1.4 Jornada Detalhada \u2014 Parcerias Institucionais (Crucial)

> [!NOTE]
> **Contexto Estrat\u00e9gico:** Como a Dance2Dance n\u00e3o possui est\u00fadio pr\u00f3prio, as parcerias institucionais s\u00e3o o cora\u00e7\u00e3o da opera\u00e7\u00e3o f\u00edsica. Elas viabilizam as salas e criam a ponte org\u00e2nica com o p\u00fablico de Gr\u00f8nland e T\u00f8yen, como ilustra o modelo de sucesso do *Interkulturelt Museum*.

| Etapa | Objetivo | Canal | A\u00e7\u00e3o |
|-------|----------|-------|------|
| **Mapeamento** | Identificar locais | Pesquisa de Bairro | Listar museus, centros comunit\u00e1rios, escolas e bibliotecas com salas ociosas |
| **Primeiro Contato** | Vender a vis\u00e3o m\u00fatua | E-mail + Reuni\u00e3o | Mostrar que a parceria traz programa\u00e7\u00e3o cultural de excel\u00eancia e atrai p\u00fablico para o espa\u00e7o parceiro |
| **Piloto** | Teste de conceito | O espa\u00e7o do parceiro | Realizar 1 evento gratuito ou s\u00e9rie curta (ex: "Good Morning Dance") para provar a demanda |
| **Consolida\u00e7\u00e3o** | Calend\u00e1rio Fixo | Contrato de Parceria | Firmar temporadas (ex: projeto aprovado at\u00e9 maio 2027), tornando o espa\u00e7o a "casa" daquele workshop |
| **Expans\u00e3o** | Prova Social Local | Networking | Usar o case de sucesso do Interkulturelt Museum para abrir as portas de outras institui\u00e7\u00f5es no bairro |

### 1.5 Jornada Detalhada \u2014 Financiador / Sponsor"""

# Also fix the 'estúdio' mentions
text = text.replace("Cada aula, cada workshop, cada momento no est\u00fadio \u00e9 mat\u00e9ria-prima", "Cada aula nos espa\u00e7os parceiros e cada momento de troca \u00e9 mat\u00e9ria-prima")
text = text.replace("luz natural do est\u00fadio", "luz natural do est\u00fadio ou espa\u00e7o parceiro")
text = text.replace("Criar perfil com fotos do est\u00fadio, hor\u00e1rios, reviews", "Criar perfil com fotos das aulas em locais parceiros, hor\u00e1rios, reviews")

text = text.replace(target, replacement)

with io.open(r"C:\Users\rmm99\.gemini\antigravity\brain\5a33816a-31e4-4322-b474-a139436be4f9\dance2dance-growth-strategy.md", "w", encoding="utf-8") as f:
    f.write(text)

print("Inject success!")
