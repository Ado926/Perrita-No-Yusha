import axios from 'axios';

const handler = async (m, { conn, usedPrefix, isCommand }) => {
    // No responde si es un comando
    if (isCommand) return;

    // Extraer el enlace (sin texto adicional) del mensaje
    const link = m.text.trim();

    // Comprobar que el mensaje sea solo un enlace de YouTube (sin texto adicional)
    const ytRegex = /^(https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11})/;
    if (!ytRegex.test(link)) return;  // Si no es un enlace válido de YouTube, no responde.

    await m.react('🎶'); // Reaccionar al mensaje

    try {
        // Obtener información del video de YouTube
        const info = await axios.get(`https://noembed.com/embed?url=${link}`);
        const title = info.data.title;

        // Crear botones para descargar como MP3 o MP4
        const buttons = [
            {
                buttonId: `${usedPrefix}ytmp3 ${link}`,
                buttonText: { displayText: '🎵 Descargar MP3' },
                type: 1
            },
            {
                buttonId: `${usedPrefix}ytmp4 ${link}`,
                buttonText: { displayText: '🎬 Descargar MP4' },
                type: 1
            }
        ];

        // Enviar mensaje con el título del video y los botones
        await conn.sendMessage(
            m.chat,
            {
                text: `📽️ *${title}*`,
                buttons: buttons,
                footer: 'Selecciona una opción:',
                viewOnce: true
            },
            { quoted: m }
        );
    } catch (e) {
        // Si ocurre algún error, responder con un mensaje de error
        return conn.reply(m.chat, '❌ No se pudo obtener el título del video.', m);
    }
};

handler.command = new RegExp;  // No usar comandos específicos
handler.group = false;
handler.register = true;

export default handler;
