import fetch from 'node-fetch';

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let video, data = {};
  let apis = [
    `https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`,
    `https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`,
    `https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`,
    `https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`
  ];

  for (let api of apis) {
    try {
      let res = await fetch(api);
      let json = await res.json();
      data = json?.data || json?.result || json;
      if (data?.url || data?.download_url || data?.dl_url || (data?.downloads?.link && data.downloads.link[0])) {
        break;
      }
    } catch { continue; }
  }

  let link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0];
  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo obtener el video. Intenta con otro link o repórtalo.');
  }

  const title = data.title || data.info?.title || data.info_do_video?.title || "Desconocido";
  const duration = data.duration || data.timestamp || data.info_do_video?.timestamp || "Desconocida";
  const quality = data.quality || data.download?.quality || "Desconocida";
  const views = data.views || data.info_do_video?.views || "Desconocidas";
  const ago = data.ago || data.info_do_video?.ago || "Desconocido";

  const infoMessage = `
╭━━〔 *Descargando* 〕━━╮
┃ 🎬 *Título:* ${title}
┃ ⏱ *Duración:* ${duration}
┃ 📥 *Calidad:* ${quality}
┃ 👁 *Vistas:* ${views}
┃ 📅 *Publicado:* ${ago}
╰━━━━━━━━━━━━━━━━━━╯`.trim();

  await conn.sendMessage(m.chat, { text: infoMessage, quoted: m });

  await new Promise(r => setTimeout(r, 1000));
  await conn.sendMessage(m.chat, { text: "✅ *Video descargado, enviando...*", quoted: m });

  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *${title}*\n⏱ *Duración:* ${duration}`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['ytvx', 'ytmp4', 'yt'];
handler.register = true;
handler.estrellas = 0;

export default handler;
