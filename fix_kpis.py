import io

with io.open('src/components/admin/OverviewTab.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix KPI arrays
text = text.replace(
    "const upcomingEvents = events.filter(e => !isEventPast(e) && !isEventOngoing(e));\n    const ongoingEvents = events.filter(e => isEventOngoing(e));",
    "const activeEventsList = events.filter(e => !isEventPast(e));\n    const upcomingEvents = events.filter(e => !isEventPast(e) && !isEventOngoing(e));\n    const ongoingEvents = events.filter(e => isEventOngoing(e));"
)

text = text.replace(
    "return upcomingEvents.reduce((acc, ev) => {",
    "return activeEventsList.reduce((acc, ev) => {"
)
text = text.replace(
    "}, [upcomingEvents]);",
    "}, [activeEventsList]);"
)

text = text.replace(
    "const totalWaitlist = upcomingEvents.reduce((acc, ev) => acc + (ev.waitlistCount || 0), 0);",
    "const totalWaitlist = activeEventsList.reduce((acc, ev) => acc + (ev.waitlistCount || 0), 0);"
)

text = text.replace(
    '<p className="text-3xl font-heading text-white">{upcomingEvents.length}</p>',
    '<p className="text-3xl font-heading text-white">{activeEventsList.length}</p>'
)

with io.open('src/components/admin/OverviewTab.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('KPIs fixed.')
