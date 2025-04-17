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
    } catch (e) {
      console.log("[ERROR] API fallback:", e.message);
    }
  }

  let link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0];
  let title = data?.title || data?.info_do_video?.title || "Video de YouTube";
  let duration = data?.duration || data?.duration_in_seconds || data?.duracion; // En segundos

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video.');
  }

  await conn.sendMessage(m.chat, {
    text: `╭━━〔 *Enviando video...* 〕━━╮\n┃ 🎬 *${title}*\n╰━━━━━━━━━━━━━━━━━━━━╯`,
    quoted: m
  });

  try {
    // Si el video dura más de 3360 segundos (56 minutos), enviarlo como documento
    if (duration && duration > 3360) {
      await conn.sendMessage(m.chat, {
        document: { url: link },
        fileName: `${title}.mp4`,
        mimetype: 'video/mp4',
        caption: `🎬 *Aquí tienes ꉂ(ˊᗜˋ)♡*\n🌸 Procesado por *Perrita No Yusha* ✧(｡•̀ᴗ-)✧\n\n⏱ Duración: ${Math.floor(duration / 60)} min`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: link },
        mimetype: 'video/mp4',
        caption: `🎬 *Aquí tienes ꉂ(ˊᗜˋ)♡*\n🌸 Procesado por *Perrita No Yusha* ✧(｡•̀ᴗ-)✧\n\n⏱ Duración: ${duration ? Math.floor(duration / 60) + ' min' : 'Desconocida'}`
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (e) {
    console.error("Error enviando el video:", e);
    await conn.sendMessage(m.chat, {
      text: `⚠️ Ocurrió un error enviando el video.\n🎬 *${title}*\n📎 Link directo: ${link}`,
      quoted: m
    });
    await conn.sendMessage(m.chat, { react: { text: "📎", key: m.key } });
  }
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
