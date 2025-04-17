export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363402846939411@newsletter') return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`${emoji} Hola @${m.sender.split`@`[0]}, mis creadores han desactivado los comandos en los chats privados por lo cual serás bloqueado, si quieres usar los comandos del bot te invito a que te unas ᥲ ᥣᥲ ᥴ᥆mᥙᥒіძᥲძ ძᥱ ᥣᥲ bot.\n\nhttps://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY`, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
