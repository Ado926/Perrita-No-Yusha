import fetch from "node-fetch";
import yts from "yt-search";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { promisify } from "util";

const execPromise = promisify(exec);

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

    conn.sendMessage(m.chat, {
      text: `
「✦」Descargando *<${vid.title}>*

> ✦ Canal » *${vid.author.name}*
> ✰ Vistas » *${vid.views.toLocaleString()}*
> ⴵ Duración » *${vid.timestamp}*
> ✐ Publicación » *${vid.ago}*
> 🜸 Link » ${vid.url}`.trim()
    }, { quoted: m });

    const api = `${getApiUrl()}?url=${encodeURIComponent(vid.url)}`;
    const result = await fetchAudio(api);

    // Descargar audio
    const inputPath = path.join(tmpdir(), `original_${Date.now()}.mp3`);
    const outputPath = path.join(tmpdir(), `saturado_${Date.now()}.mp3`);
    const resAudio = await fetch(result.download.url);
    const buffer = await resAudio.buffer();
    fs.writeFileSync(inputPath, buffer);

    // Saturación con FFmpeg (leve boost + compresión suave)
    await execPromise(`ffmpeg -i "${inputPath}" -af "acompressor=threshold=-20dB:ratio=2:attack=20:release=100,volume=3dB" -y "${outputPath}"`);

    // Enviar audio procesado
    await conn.sendMessage(m.chat, {
      audio: { url: outputPath },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${vid.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: vid.title,
          body: "✵ Saturado ✵",
          thumbnailUrl: vid.thumbnail,
          mediaType: 2,
          mediaUrl: vid.url,
          sourceUrl: vid.url,
          showAdAttribution: true
        }
      }
    }, { quoted: m });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

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
