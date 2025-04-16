import fetch from "node-fetch";
import yts from "yt-search";

// API 😎
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
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
    // Reacción inicial
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Mensaje de espera decorado (sin errores)
    const waitMessage = `
╭━━━〔 *Descargando* 〕━━━╮
┃ 🎧 *Título:* ${video.title}
┃ 🏷 *Canal:* ${video.author.name}
┃ 👁 *Vistas:* ${video.views.toLocaleString()}
┃ ⏱ *Duración:* ${video.timestamp}
┃ 📅 *Publicado:* ${video.ago}
┃ 🔗 *Enlace:* ${video.url}
╰━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text: waitMessage.trim() }, { quoted: m });

    // Enviar audio
    const audioMessage = {
      audio: { url: apiData.download.url },
      mimetype: "audio/mpeg",
      ptt: false,
      fileName: `${video.title}.mp3`,
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });

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
