import axios from 'axios';

const handler = async (m, { conn, usedPrefix, isCommand }) => {
    // Si es un comando, no respondemos
    if (isCommand) return;

    // Obtener el texto del mensaje
    const link = m.text.trim();

    // Verificar si el mensaje es solo un enlace y no contiene texto adicional
    if (link.match(/^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+/)) {
        // Reaccionar al mensaje
        await m.react('🎶');

        try {
            // Obtener el título del video usando noembed.com
            const info = await axios.get(`https://noembed.com/embed?url=${link}`);
            const title = info.data.title;

            // Crear los botones para descargar el video en MP3 o MP4
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
            // Si ocurre un error, enviar un mensaje de error
            return conn.reply(m.chat, '❌ No se pudo obtener el título del video.', m);
        }
    }
};

handler.command = new RegExp;  // No usar comandos específicos
handler.group = false;
handler.register = true;

export default handler;
