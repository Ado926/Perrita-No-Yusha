import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('❗ Ingresa un link de YouTube o Shorts');

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  let link = '';
  let title = '';

  const tryFetchJson = async (url) => {
    try {
      const res = await fetch(url, { timeout: 15000 });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      console.log(`[✅ API OK]: ${url}`);
      return json;
    } catch (e) {
      console.log(`[❌ Error API]: ${url} → ${e.message}`);
      return null;
    }
  };

  // 1. ZenKey
  const zen = await tryFetchJson(`https://zenkey.vercel.app/api/youtube?url=${encodeURIComponent(text)}`);
  if (zen?.video?.startsWith('http')) {
    link = zen.video;
    title = zen.title || '';
  }

  // 2. FGMods
  if (!link) {
    const fg = await tryFetchJson(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${encodeURIComponent(text)}&quality=480p&apikey=be9NqGwC`);
    const d = fg?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // 3. Alyachan
  if (!link) {
    const alya = await tryFetchJson(`https://api.alyachan.dev/api/ytv?url=${encodeURIComponent(text)}&apikey=uXxd7d`);
    const d = alya?.data || alya?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // 4. Neoxr
  if (!link) {
    const neo = await tryFetchJson(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(text)}&type=video&quality=480p&apikey=GataDios`);
    const d = neo?.data || neo?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  // 5. GataDios (extra)
  if (!link) {
    const gata = await tryFetchJson(`https://api.gatadios.com/api/download/ytmp4v2?url=${encodeURIComponent(text)}&apikey=GataDios`);
    const d = gata?.result;
    if (d?.url?.startsWith('http')) {
      link = d.url;
      title = d.title || '';
    }
  }

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('⚠️ No se pudo descargar el video. Intenta con otro enlace o espera unos minutos.');
  }

  // Verificar el tamaño del archivo (aproximadamente)
  const res = await fetch(link);
  const size = parseInt(res.headers.get('content-length'), 10);

  // Si el archivo pesa más de 64 MB, lo enviamos como documento
  if (size > 64 * 1024 * 1024) {
    await conn.sendMessage(m.chat, {
      document: { url: link },
      mimetype: "video/mp4",
      fileName: `${title || 'video'}.mp4`
    }, { quoted: m });
  } else {
    // Si es menor o igual a 64 MB, lo enviamos como video
    await conn.sendMessage(m.chat, {
      video: { url: link },
      mimetype: "video/mp4",
      caption: `🎬 *${title || 'Video de YouTube'}*\n⚡ Enviado por Perrita No Yusha`
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.command = ['yt', 'ytmp4', 'ytvx'];
handler.register = true;
handler.estrellas = 0;

export default handler;
