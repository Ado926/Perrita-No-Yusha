import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    // Detectar automáticamente el enlace de YouTube en el texto
    const youtubeUrl = text.match(/(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/);
    
    if (!youtubeUrl) {
      return conn.reply(m.chat, `*🧇 Ingresa un enlace válido de YouTube.*`, m);
    }

    const url = youtubeUrl[0];  // Enlace extraído
    m.react('🕒');

    let json = await ytdl(url);
    let size = await getSize(json.url);
    let sizeStr = size ? await formatSize(size) : 'Desconocido';

    const cap = `\`\`\`◜YouTube - Video◞\`\`\`\n\n*${json.title}*\n▶ *🌻 \`URL:\`* ${url}\n▶ *⚖️ \`Peso:\`* ${sizeStr}\n\n> ❐ *Sent By 𝘗𝘦𝘳𝘳𝘪𝘵𝘢 𝘕𝘰 𝘎𝘺𝘶𝘴𝘩𝘢* 🌺`;

    // Intenta enviar como video directo desde URL
    try {
      await conn.sendMessage(m.chat, {
        video: { url: json.url },
        caption: cap,
        mimetype: 'video/mp4',
        fileName: `${json.title}.mp4`
      }, { quoted: m });
    } catch (e) {
      // Si falla, usa buffer como respaldo
      const buffer = await (await fetch(json.url)).buffer();
      await conn.sendFile(m.chat, buffer, `${json.title}.mp4`, cap, m, null, {
        asDocument: true,
        mimetype: 'video/mp4'
      });
    }

    m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply(`Ocurrió un error:\n${e.message}`);
  }
};

handler.help = ['ytmp4'];
handler.command = ['ytv', 'ytmp4', 'ytv'];
handler.tags = ['dl'];
handler.diamond = true;

export default handler;

async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const init = await initial.json();
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
  const convertURL = init.convertURL + `&v=${id}&f=mp4&_=${Math.random()}`;

  const converts = await fetch(convertURL, { headers });
  const convert = await converts.json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progressResponse = await fetch(convert.progressURL, { headers });
    info = await progressResponse.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title || 'video'
  };
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  if (!bytes || isNaN(bytes)) return 'Desconocido';

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(2)} ${units[i]}`;
}

async function getSize(url) {
  try {
    const response = await axios.head(url);
    const contentLength = response.headers['content-length'];
    if (!contentLength) return null;
    return parseInt(contentLength, 10);
  } catch (error) {
    console.error("Error al obtener el tamaño:", error.message);
    return null;
  }
      }
