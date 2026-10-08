import openpyxl

wb = openpyxl.load_workbook('C:/Renas/Antigravity/Dance2Dance_Traducoes_Revisao.xlsx')
ws = wb.active

new_rows = [
    ['actions.ready_to_start', 'Pronto para começar?', 'Klar til å begynne?', 'Ready to start?'],
    ['actions.ready_to_start_sub', 'Inscreva-se em uma das datas abaixo ou entre na lista de interesse para novas turmas.', 'Meld deg på en av datoene nedenfor eller bli med på ønskelisten for nye grupper.', 'Register for one of the dates below or join the wishlist for upcoming cohorts.'],
    ['actions.ready_to_start_has_spots', 'Inscreva-se agora e garanta sua vaga.', 'Meld deg på nå og sikre deg plass.', 'Register now and secure your spot.'],
    ['actions.ready_to_start_waitlist', 'Inscreva-se na lista de espera.', 'Sett deg på venteliste.', 'Join the waitlist.'],
    ['actions.ready_to_start_wishlist', 'Inscreva-se na lista de interesse para novas turmas.', 'Bli med på ønskelisten for nye grupper.', 'Join the wishlist for upcoming cohorts.']
]

for row in new_rows:
    ws.append(row)

wb.save('C:/Renas/Antigravity/Dance2Dance_Traducoes_Revisao.xlsx')
print('Added translations to Excel!')
