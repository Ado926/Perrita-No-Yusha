let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`*⚠️ Debes escribir el número del usuario*\n\nEjemplo:\n${usedPrefix}${command} +504 9454-7493`);
    }

    // Limpia el número: quita espacios, +, guiones, etc.
    let rawNumber = text.replace(/[^0-9]/g, '');
    if (rawNumber.length < 8) {
      return m.reply('*❌ Número inválido. Asegúrate de incluir el código de país.*');
    }

    let number = rawNumber + '@s.whatsapp.net';

    // Verificar si existe
    const exists = await conn.onWhatsApp(number);
    if (!exists || !exists[0]?.exists) {
      return m.reply('*❌ El número no está registrado en WhatsApp.*');
    }

    // Obtener foto de perfil
    let pfp = await conn.profilePictureUrl(number, 'image').catch(() => null);
    if (!pfp) return m.reply('*⚠️ No se pudo obtener la foto de perfil.*');

    // Enviar la imagen
    await conn.sendFile(m.chat, pfp, 'perfil.jpg', `✨ Foto de perfil de @${rawNumber}`, m, false, {
      mentions: [number]
    });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al obtener la foto de perfil.');
  }
};

handler.help = ['perfil <número>'];
handler.tags = ['herramientas'];
handler.command = ['fotoperfil'];
handler.register = true;

export default handler;
