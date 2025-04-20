import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
  try {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/)?[\w\-]{11}/;

    if (!ytRegex.test(text)) {
      return conn.reply(m.chat, `✎ Ingresa un enlace válido de YouTube (video o short).`, m);
    }

    const url = text.trim();
    const id = url.match(/(?:v=|\/)([\w\-]{11})/)[1];
    const search = await yts({ videoId: id });
    const videoInfo = search;

    const { title, thumbnail, timestamp, views, ago } = videoInfo;
    const vistas = formatViews(views);
    const infoMessage = `「✦」Descargando *<${title}>*\n\n> ✦ Canal » *${videoInfo.author?.name || 'Desconocido'}*\n> ✰ Vistas » *${vistas}*\n> ⴵ Duración » *${timestamp}*\n> ✐ Publicación » *${ago}*\n> 🜸 Link » ${url}`;

    const thumb = (await conn.getFile(thumbnail))?.data;

    m.react('🌸');

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "Descarga en progreso",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    // Solo usamos YTMP4
    const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`);
    const json = await res.json();
    const downloadUrl = json?.result?.download?.url;

    if (!downloadUrl) {
      return m.reply(`✱ *No se pudo descargar el video:* No se encontró un enlace válido.`);
    }

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      fileName: `${title}.mp4`,
      mimetype: 'video/mp4',
      caption: `「📥」*Video descargado con éxito.*`,
      thumbnail: thumb
    }, { quoted: m });

  } catch (error) {
    return m.reply(`✿ *Error:* ${error.message}`);
  }
};

handler.command = ['ytmp4'];
handler.tags = ['downloader'];
handler.help = ['ytmp4 <link de YouTube>'];

export default handler;

function formatViews(views) {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')';
  } else {
    return views.toString();
  }
}
