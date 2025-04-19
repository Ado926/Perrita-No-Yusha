import fetch from "node-fetch";
import yts from "yt-search";

// API rápida principal (ZenKey)
const zenApi = "https://zenkey.vercel.app/api/youtube";

let handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, "*Ingresa el nombre de una canción*", m);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

    // Buscar el video rápidamente
    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw "No se encontró ningún video.";

    // Enviar mensaje de espera rápido
    await conn.sendMessage(m.chat, {
      text: `🎧 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${video.url}`,
    }, { quoted: m });

    // Descargar desde ZenKey (super rápido)
    const res = await fetch(`${zenApi}?url=${video.url}`);
    const json = await res.json();

    if (!json?.music?.url) throw "No se pudo obtener el audio.";

    // Enviar el audio rápido
    await conn.sendMessage(m.chat, {
      audio: { url: json.music.url },
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

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return conn.reply(m.chat, "*Error al enviar el audio.*", m);
  }
};

handler.command = ['play'];
export default handler;
