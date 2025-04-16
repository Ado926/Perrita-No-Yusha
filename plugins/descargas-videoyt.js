import fetch from 'node-fetch';

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube\n');

  await conn.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

  let video;
  try {
    video = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`)).json();
  } catch (error) {
    try {
      video = await (await fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`)).json();
    } catch (error) {
      try {
        video = await (await fetch(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`)).json();
      } catch (error) {
        video = await (await fetch(`https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`)).json();
      }
    }
  }

  let data = video?.data || video?.result || video;
  let link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0];

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('《✧》Hubo un error al intentar acceder al link.\n> Si el problema persiste, repórtalo en el grupo de soporte.');
  }

  // Extrae datos con respaldo múltiple
  const title = data.title || data.info?.title || data.info_do_video?.title || 'Desconocido';
  const duration = data.duration || data.timestamp || data.info_do_video?.timestamp || 'Desconocida';
  const quality = data.quality || data.download?.quality || 'Desconocida';
  const views = data.views || data.info_do_video?.views || 'Desconocidas';
  const ago = data.ago || data.info_do_video?.ago || 'Desconocido';

  const infoMessage = `
╭━〔 *Video Encontrado* 〕━╮
┃ 🎬 *Título:* ${title}
┃ ⏱ *Duración:* ${duration}
┃ 📥 *Calidad:* ${quality}
┃ 👁 *Vistas:* ${views}
┃ 📅 *Publicado:* ${ago}
╰━━━━━━━━━━━━━━━━━━━━╯
🔄 *Procesando descarga...*`;

  await conn.reply(m.chat, infoMessage.trim(), m);

  // Espera corta y mensaje previo al envío
  await new Promise(res => setTimeout(res, 1500));
  await conn.sendMessage(m.chat, { text: "✅ *Video descargado, enviando...*", quoted: m });

  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *${title}*\n⏱ *Duración:* ${duration}`,
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "🚀", key: m.key } });
};

handler.command = ['ytv', 'ytmp4', 'yt'];
handler.register = true;
handler.estrellas = 0;

export default handler;
