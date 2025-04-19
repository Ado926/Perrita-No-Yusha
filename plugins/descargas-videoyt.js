import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let data = {};
  let link = '';
  let title = '';

  // Intentamos primero con ZenKey API
  try {
    let res = await fetch(`https://zenkey.vercel.app/api/youtube?url=${text}`);
    let json = await res.json();
    link = json.video;
    title = json.title || 'Video de YouTube';
  } catch (e) {
    console.log('[ZenKey Falló]', e);
  }

  // Si ZenKey falla, usamos las otras APIs como respaldo
  if (!link) {
    const urls = [
      `https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`,
      `https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`,
      `https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`,
      `https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`
    ];

    for (let url of urls) {
      try {
        let res = await fetch(url);
        let json = await res.json();
        data = json?.data || json?.result || json;
        link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0];
        title = data?.title || data?.info_do_video?.title || "Video de YouTube";
        if (link) break;
      } catch (error) {
        console.error('[API alternativa falló]', error);
      }
    }
  }

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video.');
  }

  // Mensaje de progreso decorado
  await conn.sendMessage(m.chat, {
    text: `╭─❍ *Descargando Video...*\n├ Título: *${title}*\n╰━━━━━━━━━━━━━⬣`,
    quoted: m
  });

  // Enviar el video directamente desde la URL (super rápido)
  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *Aquí tienes ꉂ(ˊᗜˋ)*\n✨ *${title}*\n🌸 𝘗𝘳𝘰𝘤𝘦𝘴𝘴𝘦𝘥 𝘉𝘺 𝘗𝘦𝘳𝘳𝘪𝘵𝘢 𝘕𝘰 𝘠𝘶𝘴𝘩𝘢`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
