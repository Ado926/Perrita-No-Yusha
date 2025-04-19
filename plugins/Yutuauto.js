import axios from 'axios';

const handler = async (m, { conn, usedPrefix }) => {
    const ytRegex = /https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = m.text.match(ytRegex);
    if (!match) return;

    const url = match[0];
    await m.react('❤️'); // Emoji de reacción

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

handler.customPrefix = /https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+/i;
handler.command = new RegExp;
handler.group = false;
handler.register = true;

export default handler;
