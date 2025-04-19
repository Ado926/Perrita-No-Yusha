import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '🌸✨ *¡Nuevo miembro! Bienvenid@ a nuestro pequeño paraíso* ✨🌸'
  let txt1 = '🌙💖 *Adiós, hasta pronto... Te extrañaremos* 💖🌙'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `🌸✨ *¡Bienvenid@ al hermoso grupo de ${groupMetadata.subject}! 🌟* ✨\n💖 *@${m.messageStubParameters[0].split`@`[0]}* ¡Nos alegra mucho que estés aquí! 😍\n🌼 *Gracias por unirte a nuestra pequeña familia.* Ahora somos ${groupSize} miembros, ¡y tú eres una parte muy especial! 🌸\n💌 *No olvides usar #help para explorar todos nuestros comandos y conocer más.*`
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `🌙💖 *Adiós, pero siempre serás parte de nuestro corazón* 💖🌙\n🌟 *@${m.messageStubParameters[0].split`@`[0]}* ha partido, pero nuestro cariño sigue aquí. 😢💫\n🌸 *Ahora somos ${groupSize} miembros, y siempre te recordaremos con cariño.*\n💌 *Te esperamos con los brazos abiertos, y si quieres regresar, ¡aquí estaremos!*`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }
}
