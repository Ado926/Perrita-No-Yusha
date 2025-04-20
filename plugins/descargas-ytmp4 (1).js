import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i)) {
    return m.reply(`✿ Ingresa un enlace válido de YouTube o Shorts.`);
  }

  try {
    m.react('⏳');

    // List of multiple APIs to try
    const sources = [
      `https://ytmp4-alpha.vercel.app/api?url=${encodeURIComponent(text)}`,
      `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`,
      `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${encodeURIComponent(text)}`,
      `https://axeel.my.id/api/download/video?url=${encodeURIComponent(text)}`,
      `https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`
    ];

    let success = false;
    let downloadUrl = '';
    let title = '';
    let thumbnail = '';

    for (let api of sources) {
      try {
        const res = await fetch(api);
        const json = await res.json();

        if (json && json.result && json.result.url) {
          downloadUrl = json.result.url;
          title = json.result.title;
          thumbnail = json.result.thumbnail;
          success = true;
          break; // Exit the loop once we find a working API
        }
      } catch (e) {
        console.error(`Error con la API ${api}:`, e.message);
      }
    }

    if (!success || !downloadUrl) {
      throw new Error('No se pudo obtener un enlace de descarga válido.');
    }

    const info = `「✦」Descargando *${title}*\n\n> ✦ Link: ${text}`;
    const thumb = await (await conn.getFile(thumbnail)).data;

    const decor = {
      contextInfo: {
        externalAdReply: {
          title: title,
          body: 'YTMP4 Downloader',
          mediaType: 1,
          previewType: 0,
          mediaUrl: text,
          sourceUrl: text,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, info, m, decor);

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    return m.reply(`✿ Error: ${err.message}`);
  }
};

handler.command = ['ytmp4'];
handler.help = ['tsg'];
handler.tags = ['downloader'];

export default handler;
