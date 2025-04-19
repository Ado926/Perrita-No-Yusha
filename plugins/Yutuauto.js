import axios from 'axios';

const handler = async (m, { conn, usedPrefix }) => {
    // Obtener el mensaje del usuario y limpiarlo
    const messageContent = m.text.trim();

    // Verificar si el enlace comienza con 'https://youtube.com' o 'https://youtu.be'
    const link = messageContent.match(/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]+(\?[\w=&]+)?/);

    // Si el enlace es válido
    if (link) {
        // Reaccionar al mensaje con un emoji
        await m.react('🎶');

        try {
            // Obtener el título del video usando la API de noembed.com
            const videoInfo = await axios.get(`https://noembed.com/embed?url=${link[0]}`);
            const videoTitle = videoInfo.data.title;

            // Crear botones de descarga para el video
            const buttons = [
                {
                    buttonId: `${usedPrefix}ytmp3 ${link[0]}`,
                    buttonText: { displayText: '🎵 Descargar MP3' },
                    type: 1
                },
                {
                    buttonId: `${usedPrefix}ytmp4 ${link[0]}`,
                    buttonText: { displayText: '🎬 Descargar MP4' },
                    type: 1
                }
            ];

            // Enviar mensaje con el título y botones
            await conn.sendMessage(
                m.chat,
                {
                    text: `📽️ *${videoTitle}*`,
                    buttons: buttons,
                    footer: 'Selecciona una opción:',
                    viewOnce: true
                },
                { quoted: m }
            );
        } catch (e) {
            // En caso de error, enviar un mensaje de error
            return conn.reply(m.chat, '❌ No se pudo obtener el título del video.', m);
        }
    } else {
        // Si no es un enlace válido, no hacer nada
        return;
    }
};

handler.command = new RegExp;  // No usar comandos específicos
handler.group = false;
handler.register = true;

export default handler;
