import fetch from "node-fetch";
import yts from "yt-search";

const zenApi = "https://zenkey.vercel.app/api/youtube";
const axeelApi = "https://api.axeel.repl.co/api/yta"; // respaldo

let handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, "*Ingresa el nombre de una canción*", m);
  }

  await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

  try {
    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw "No se encontró ningún video.";

    await conn.sendMessage(m.chat, {
      text: `🎧 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${video.url}`,
    }, { quoted: m });

    let audioUrl;

    // PRIMER INTENTO: ZenKey
    try {
      const res = await fetch(`${zenApi}?url=${video.url}`);
      const json = await res.json();
      if (json?.music?.url) audioUrl = json.music.url;
    } catch (e) {
      console.warn("ZenKey falló:", e.message);
    }

    // SEGUNDO INTENTO: Axeel API
    if (!audioUrl) {
      try {
        const res = await fetch(`${axeelApi}?url=${video.url}`);
        const json = await res.json();
        if (json?.url_audio) audioUrl = json.url_audio;
      } catch (e) {
        console.warn("Axeel API falló:", e.message);
      }
    }

    if (!audioUrl) throw "No se pudo obtener el audio desde ninguna fuente.";

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

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    conn.reply(m.chat, "*Error al enviar el audio.*", m);
  }
};

handler.command = ['play'];
export default handler;
