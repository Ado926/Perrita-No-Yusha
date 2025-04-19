import ytdl from 'ytdl-core';
import axios from 'axios';

const handler = async (m, { conn, usedPrefix }) => {
    const ytRegex = /https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const match = m.text.match(ytRegex);
    if (!match) return;

    const url = match[0];
    let info;

    try {
        info = await ytdl.getInfo(url);
    } catch (e) {
        return conn.reply(m.chat, '❌ Error al obtener información del video.', m);
    }

    const title = info.videoDetails.title;

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
            image: { url: info.videoDetails.thumbnails.pop().url },
            caption: `📽️ *${title}*`,
            buttons: buttons,
            footer: 'Elige una opción:',
            viewOnce: true
        },
        { quoted: m }
    );
};

handler.customPrefix = /https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/i;
handler.command = new RegExp;
handler.group = false;
handler.register = true;

export default handler;
