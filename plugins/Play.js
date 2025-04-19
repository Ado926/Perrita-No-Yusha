import fetch from "node-fetch";
import yts from "yt-search";

// API Neoxr
const neoxrApi = "https://api.neoxr.eu/api/youtube?url=";

// Función para obtener el enlace de descarga de la API
const getDownloadUrl = async (videoUrl) => {
  const apiUrl = `${neoxrApi}${encodeURIComponent(videoUrl)}&type=video&quality=480p&apikey=GataDios`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  if (data?.status === "success" && data?.data?.url) {
    return data.data.url; // URL de descarga del video
  }
  throw new Error("No se pudo obtener el enlace de descarga.");
};

let handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, "*Ingresa el nombre de una canción o el enlace de un video*", m);
  }

  // Reacción de inicio
  await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    // Buscar el video en YouTube
    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw "No se encontró el video.";

    // Mensaje de espera (sin decoración)
    await conn.sendMessage(m.chat, {
      text: `🎧 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${video.url}`,
    }, { quoted: m });

    // Obtener URL de descarga usando la API Neoxr
    const audioUrl = await getDownloadUrl(video.url);

    // Enviar audio con las configuraciones previas
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      ptt: true,
      fileName: `${video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: "Descargas Play",
          thumbnailUrl: video.thumbnail,
          mediaType: 2,
          mediaUrl: video.url,
          sourceUrl: video.url,
          showAdAttribution: true,
        },
      },
    }, { quoted: m });

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("Error al procesar:", err);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, "*Error al enviar el audio.*", m);
  }
};

handler.command = ['play'];
export default handler;
