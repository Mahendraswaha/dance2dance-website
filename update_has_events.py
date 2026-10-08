import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

content = content.replace(
'''    // Track if there are events to change the section subtitle
    const [hasEvents, setHasEvents] = useState(false);
    const handleEventsLoaded = useCallback((state) => {
      setHasEvents(state.hasDates);
    }, []);''',
'''    // Track if there are events to change the section subtitle
    const [hasEvents, setHasEvents] = useState(false);
    const handleEventsLoaded = useCallback((events) => {
      setHasEvents(events && events.length > 0);
    }, []);'''
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("GoodMorningDancePage.jsx updated.")
