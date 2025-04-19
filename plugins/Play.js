import fetch from "node-fetch";
import yts from "yt-search";

const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");
const zenApi = "https://zenkey.vercel.app/api/youtube";

const fetchWithRetries = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data?.status === 200 && data.result?.download?.url) return data.result;
  } catch {}
  return null;
};

let handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: "❓", key: m.key } });
    return conn.reply(m.chat, "*[ ℹ️ ] Ingresa el nombre de una canción.*", m);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

    const searchResults = await yts(text);
    const video = searchResults.videos[0];
    if (!video) throw "No se encontró nada.";

    const waitMsg = `🎧 *Título:* ${video.title}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${video.url}`;
    await conn.sendMessage(m.chat, { text: waitMsg }, { quoted: m });

    const vredenUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    let audio = await fetchWithRetries(vredenUrl);

    if (!audio) {
      const res = await fetch(`${zenApi}?url=${video.url}`);
      const json = await res.json();
      if (json?.music?.url) {
        audio = { download: { url: json.music.url } };
      }
    }

    if (!audio || !audio.download?.url) throw "No se pudo obtener el audio.";

    await conn.sendMessage(m.chat, {
      audio: { url: audio.download.url },
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
          showAdAttribution: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return conn.reply(m.chat, "*[ ❌ ] No se pudo enviar el audio.*", m);
  }
};

handler.command = ['play'];
export default handler;
