import io

with io.open('src/components/admin/UserDetailModal.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

leftover_junk = """                                {enr.evaluation.instructorName && (
                                  <span className="text-[10px] font-heading text-zinc-400">
                                    ({enr.evaluation.instructorName})
                                  </span>
                                )}
                              </div>
                            </div>
                            {enr.evaluation.notes && (
                              <p className="text-xs font-heading italic text-zinc-300 bg-[#161620] p-2.5 rounded-[2px] border border-[#22222E] whitespace-pre-wrap leading-relaxed">
                                "{enr.evaluation.notes}"
                              </p>
                            )}
                          </div>
                        )}"""

if leftover_junk in text:
    text = text.replace(leftover_junk, '')
    with io.open('src/components/admin/UserDetailModal.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Junk removed.')
else:
    print('Junk not found.')
