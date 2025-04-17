import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  const urls = [
    `https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`,
    `https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`,
    `https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`,
    `https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`
  ];

  let data = {};
  for (let url of urls) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      data = json?.data || json?.result || json;
      if (data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0]) break;
    } catch {}
  }

  let link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0];
  let title = data?.title || data?.info_do_video?.title || "Video de YouTube";

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video.');
  }

  await conn.sendMessage(m.chat, {
    text: `╭━━〔 *Enviando video...* 〕━━╮\n┃ 🎬 *${title}*\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    quoted: m
  });

  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *Aqui tienes ꉂ(ˊᗜˋ)♡*\n🌸 Procesado por *Perrita No Yusha* ✧(｡•̀ᴗ-)✧`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
