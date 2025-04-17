import fetch from "node-fetch";
import yts from "yt-search";

// API 😎
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

const fetchAudio = async (url) => {
  const res = await fetch(url);
  const json = await res.json();
  if (json?.status === 200 && json.result?.download?.url) return json.result;
  throw new Error("No se pudo obtener el audio.");
};

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, '*[ ℹ️ ] Escribe el nombre de una canción.*', m);

  conn.sendMessage(m.chat, { react: { text: "🔊", key: m.key } });

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) throw new Error("Sin resultados");

    // Enviar mensaje decorado inmediato sin await
    conn.sendMessage(m.chat, {
      text: `
「✦」Descargando *<${vid.title}>*

> ✦ Canal » *${vid.author.name}*
> ✰ Vistas » *${vid.views.toLocaleString()}*
> ⴵ Duración » *${vid.timestamp}*
> ✐ Publicación » *${vid.ago}*
> 🜸 Link » ${vid.url}`.trim()
    }, { quoted: m });

    // Petición rápida a la API
    const api = `${getApiUrl()}?url=${encodeURIComponent(vid.url)}`;
    const result = await fetchAudio(api);

    // Enviar audio como PTT
    await conn.sendMessage(m.chat, {
      audio: { url: result.download.url },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${vid.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: vid.title,
          body: "✵𝙋𝙚𝙧𝙧𝙞𝙩𝙖 𝙉𝙤 𝙔𝙪𝙨𝙝𝙖✵",
          thumbnailUrl: vid.thumbnail,
          mediaType: 2,
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          showAdAttribution: true
        }
      }
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, "*[ ❌ ] Hubo un problema al procesar tu solicitud.*", m);
  }
};

handler.command = ['playaudio'];
handler.help = ['playaudio'];
handler.tags = ['play'];

export default handler;
