import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let link = '';
  let title = '';

  const tryFetchJson = async (url) => {
    try {
      const res = await fetch(url, { timeout: 15000 });
      return await res.json();
    } catch (e) {
      console.log(`[Error]: ${url}`, e);
      return null;
    }
  };

  // ZenKey primero (más rápido para cortos)
  const zen = await tryFetchJson(`https://zenkey.vercel.app/api/youtube?url=${text}`);
  if (zen?.video?.startsWith('http')) {
    link = zen.video;
    title = zen.title || '';
  }

  // FGMods, rápido y sirve para videos largos
  if (!link) {
    const fg = await tryFetchJson(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`);
    if (fg?.result?.url?.startsWith('http')) {
      link = fg.result.url;
      title = fg.result.title || '';
    }
  }

  // Alyachan como tercer intento
  if (!link) {
    const alya = await tryFetchJson(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`);
    const d = alya?.data || alya?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video. Puede estar restringido o la URL es inválida.');
  }

  // Mensaje rápido antes de enviar
  await conn.sendMessage(m.chat, {
    text: `✅ *Descargado!*\n📤 *Enviando...*`,
    quoted: m
  });

  // Envío rápido del video
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
