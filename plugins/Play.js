import fetch from "node-fetch";
import yts from "yt-search";

// API principal (vreden)
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

// API secundaria (zenkey)
const zenApi = "https://zenkey.vercel.app/api/youtube";

const fetchWithRetries = async (url, maxRetries = 1) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) return data.result;
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  return null;
};

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(
      m.chat,
      '*[ ℹ️ ] Ingresa el nombre de una rola.*\n\n*[ 💡 ] Ejemplo:* Tren al sur',
      m
    );
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Mensaje de espera decorado con toda la info
    const waitMessage = `
╭━━━〔 *Descargando* 〕━━━╮
┃ 🎧 *Título:* ${video.title}
┃ 🏷 *Canal:* ${video.author.name}
┃ 👁 *Vistas:* ${video.views.toLocaleString()}
┃ ⏱ *Duración:* ${video.timestamp}
┃ 📅 *Publicado:* ${video.ago}
┃ 🔗 *Enlace:* ${video.url}
╰━━━━━━━━━━━━━━━━━━╯`.trim();

    await conn.sendMessage(m.chat, { text: waitMessage }, { quoted: m });

    // Intentar con Vreden
    const vredenUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    let audio = await fetchWithRetries(vredenUrl);

    // Si falla, usar ZenKey
    if (!audio) {
      const res = await fetch(`${zenApi}?url=${video.url}`);
      const json = await res.json();
      if (json?.music?.url) {
        audio = {
          download: {
            url: json.music.url,
          },
        };
      }
    }

    if (!audio || !audio.download?.url) throw new Error("No se pudo obtener el audio.");

    await conn.sendMessage(m.chat, {
      audio: { url: audio.download.url },
      mimetype: "audio/mpeg",
      ptt: false,
      fileName: `audio.mp3`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, "*[ ❌ ] Error al procesar tu solicitud.*", m);
  }
};

handler.command = ['play'];
handler.help = ['play'];
handler.tags = ['play'];

export default handler;
