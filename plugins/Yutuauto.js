import axios from 'axios';

const handler = async (m, { conn, usedPrefix, isCommand }) => {
    if (isCommand) return; // No responde si es comando

    // Expresión regular para detectar enlaces de YouTube sin texto adicional
    const ytRegex = /^https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/i;
    
    // Verifica si el mensaje es solo un enlace de YouTube
    const isOnlyYouTubeLink = ytRegex.test(m.text.trim());
    if (!isOnlyYouTubeLink) return; // Solo responde si el mensaje es SOLO un enlace

    const url = m.text.trim();
    await m.react('🎶');

    try {
        const info = await axios.get(`https://noembed.com/embed?url=${url}`);
        const title = info.data.title;

        const buttons = [
            {
                buttonId: `${usedPrefix}ytmp3 ${url}`,
                buttonText: { displayText: '🎵 Descargar MP3' },
                type: 1
            },
            {
                buttonId: `${usedPrefix}ytmp4 ${url}`,
                buttonText: { displayText: '🎬 Descargar MP4' },
                type: 1
            }
        ];

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
        return conn.reply(m.chat, '❌ No se pudo obtener el título del video.', m);
    }
};

handler.customPrefix = /^https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/i;
handler.command = new RegExp;
handler.group = false;
handler.register = true;

export default handler;
