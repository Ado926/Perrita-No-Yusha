import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let link = '';

  // Intentamos primero con ZenKey (rápido)
  try {
    const zen = await fetch(`https://zenkey.vercel.app/api/youtube?url=${text}`);
    const z = await zen.json();

    if (z?.video && z?.video.startsWith('http')) {
      link = z.video;
    }
  } catch (e) {
    console.log('[Error en ZenKey]:', e);
  }

  // Si ZenKey falla, intentamos con los backups
  if (!link) {
    const backups = [
      `https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`,
      `https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`,
      `https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`,
      `https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`
    ];

    for (let url of backups) {
      try {
        let res = await fetch(url);
        let json = await res.json();
        let d = json?.data || json?.result || json;
        link = d?.url || d?.download_url || d?.dl_url || d?.downloads?.link?.[0];
        if (link) break;
      } catch (err) {
        console.log('[Backup API falló]:', err);
      }
    }
  }

  // Si no encontramos el link del video
  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video. Puede estar restringido o la URL es inválida.');
  }

  // Enviar el video sin retraso
  await conn.sendMessage(m.chat, {
    text: `╭───────◇◆◇───────╮\n│ ✅ *Video descargado*\n│ 📤 *Enviando videoo...*\n╰───────◇◆◇───────╯`,
    quoted: m
  });

  // Enviar el video de manera rápida
  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *Aquí tienes ꉂ(ˊᗜˋ)*\n🌸 𝘗𝘳𝘰𝘤𝘦𝘴𝘴𝘦𝘥 𝘉𝘺 𝘗𝘦𝘳𝘳𝘪𝘵𝘢 𝘕𝘰 𝘙𝘦𝘢𝘢`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
