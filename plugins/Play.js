import fetch from "node-fetch";
import yts from "yt-search";

// API de y2mate
const y2mateApi = "https://www.y2mate.com/mates/en68/analyze/ajax";

// Función para obtener audio
const getAudioFromVideo = async (url) => {
  const data = new URLSearchParams();
  data.append('url', url);

  const res = await fetch(y2mateApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data
  });

  const json = await res.json();
  if (json?.status === "success" && json?.result?.url) {
    return json.result.url; // URL del audio MP3
  }
  throw new Error("No se pudo obtener el audio.");
};

let handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, "*Ingresa el nombre de una canción*", m);
  }

  // Reacción de inicio
  await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    // Buscar el video
    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw "No se encontró el video.";

    // Mensaje de espera
    await conn.sendMessage(m.chat, {
      text: `🎧 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${video.url}`,
    }, { quoted: m });

    // Obtener URL de audio usando y2mate
    const audioUrl = await getAudioFromVideo(video.url);

    // Enviar audio
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
