import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('❌ Formato no soportado.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    const response = await axios.request(config);
    if (response.data && response.data.success) {
      const { id, title, info } = response.data;
      const { image } = info;
      const downloadUrl = await ddownr.cekProgress(id);

      return { id, image, title, downloadUrl };
    } else {
      throw new Error('⚠️ Fallo al obtener los detalles del video.');
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    while (true) {
      const response = await axios.request(config);
      if (response.data && response.data.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `✏️ *Ingresa el nombre de la música o link de YouTube.*`, m);
    }

    m.react('🔍');

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('🔍 *No se encontraron resultados.*');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, url } = videoInfo;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `╭━━━〔 *⌛ ESPERA ⌛* 〕━━━⬣
┃ 𖥨  *Título:* ${title}
┃ 𖥨  *Duración:* ${timestamp}
┃ 𖥨  *Link:* ${url}
╰━━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m });

    if (command === 'play2' || command === 'ytv' || command === 'mp4') {
      let sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();
          const downloadUrl = json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;

          if (downloadUrl) {
            success = true;
            m.react('✅');

            // Enviar el archivo como documento (audio)
            const documentMessage = {
              document: { url: downloadUrl },
              mimetype: 'audio/mpeg',
              fileName: `${title}.mp3`,
              caption: `╭━━━〔 *🎬 Video DESCARGADO* 〕━━━⬣
┃ 𖥨  *Título:* ${title}
┃ 𖥨  *Formato:* MP4
┃ 𖥨  *Duración:* ${timestamp || 'Desconocida'}
╰━━━━━━━━━━━━━━━━━⬣`
            };

            await conn.sendMessage(m.chat, documentMessage, { quoted: m });

            break;
          }
        } catch (e) {
          console.error(`Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply(`❌ *No se pudo descargar el video.*`);
      }
    }

  } catch (error) {
    return m.reply(`⚠️ *Error:* ${error.message}`);
  }
};

handler.command = ['play22'];
handler.help = ['play2'];
handler.tags = ['downloader'];

export default handler;
