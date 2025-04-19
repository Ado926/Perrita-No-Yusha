let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `√${emoji} ¿Qué comando quieres sugerir?`, m)
    if (text.length < 10) return conn.reply(m.chat, `${emoji2} La sugerencia debe tener más de 10 caracteres.`, m)
    if (text.length > 1000) return conn.reply(m.chat, `${emoji2} El máximo de la sugerencia es de 1000 caracteres.`, m)

    const teks = `${emoji} Sugerencia de un nuevo comando del usuario *${m.pushName || 'Anónimo'}*

☁️ Comando Sugerido:
> ${text}`

    // Números a los que se enviará la sugerencia
    const admins = ['50493732693@s.whatsapp.net', '51921826291@s.whatsapp.net']
    for (let admin of admins) {
        await conn.reply(admin, m.quoted ? teks + '\n\n' + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) })
    }

    m.reply('🍬 La sugerencia se envió a mi propietario.')
}

handler.help = ['newcommand']
handler.tags = ['info']
handler.command = ['newcommand', 'sug']

export default handler
