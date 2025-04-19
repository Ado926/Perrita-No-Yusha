import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let link = '';
  let title = '';

  const tryFetchJson = async (url) => {
    try {
      const res = await fetch(url, { timeout: 15000 });
      const json = await res.json();
      console.log(`[✅ API OK]: ${url}`);
      console.log(JSON.stringify(json, null, 2));
      return json;
    } catch (e) {
      console.log(`[❌ Error API]: ${url}`, e.message);
      return null;
    }
  };

  // 1. ZenKey
  const zen = await tryFetchJson(`https://zenkey.vercel.app/api/youtube?url=${text}`);
  if (zen?.video?.startsWith('http')) {
    link = zen.video;
    title = zen.title || '';
  }

  // 2. FGMods
  if (!link) {
    const fg = await tryFetchJson(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`);
    const d = fg?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // 3. Alyachan
  if (!link) {
    const alya = await tryFetchJson(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`);
    const d = alya?.data || alya?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // 4. Neoxr
  if (!link) {
    const neo = await tryFetchJson(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`);
    const d = neo?.data || neo?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // Verificación final
  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video. Prueba con otro enlace o espera unos minutos.');
  }

  // Envío rápido del video
  await conn.sendMessage(m.chat, {
    text: `✅ *Video listo!*\n📤 *Enviando...*`,
    quoted: m
  });

  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🎬 *${title || 'Video de YouTube'}*\n⚡ Enviado por Perrita No Yusha`
  }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
