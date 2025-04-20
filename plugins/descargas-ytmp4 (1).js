import fetch from "node-fetch";
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text) return conn.reply(m.chat, `*🧇 Ingresa la URL del vídeo de YouTube.*`, m);

    if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) {
      return m.reply(`*⚠️ Enlace inválido, por favor coloca un enlace válido de YouTube.*`);
    }

    m.react('🕒');

    let json = await ytdl(args[0]);
    if (!json || !json.url) throw new Error("No se pudo obtener el enlace de descarga.");

    let size = await getSize(json.url);
    let sizeStr = size ? await formatSize(size) : 'Desconocido';

    const cap = `\`\`\`◜YouTube - Video◞\`\`\`\n\n*${json.title}*\n▶ *🌻 \`URL:\`* ${args[0]}\n▶ *⚖️ \`Peso:\`* ${sizeStr}\n\n> ❐ *Sent By 𝘗𝘦𝘳𝘳𝘪𝘵𝘢 𝘕𝘰 𝘠𝘶𝘴𝘩𝘢* 🌺`;

    try {
      await conn.sendMessage(m.chat, {
        video: { url: json.url },
        caption: cap,
        mimetype: 'video/mp4',
        fileName: `${json.title}.mp4`
      }, { quoted: m });
    } catch (e) {
      const buffer = await (await fetch(json.url)).buffer();
      await conn.sendFile(m.chat, buffer, `${json.title}.mp4`, cap, m, null, {
        asDocument: true,
        mimetype: 'video/mp4'
      });
    }

    m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply(`*❌ Ocurrió un error:*\n${e.message}`);
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

  try {
    const initial = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
    const initText = await initial.text();
    const init = JSON.parse(initText || '{}');
    if (!init?.convertURL) throw new Error("Error en el paso inicial");

    const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?/]+)/)?.[1];
    const convertURL = init.convertURL + `&v=${id}&f=mp4&_=${Math.random()}`;

    const converts = await fetch(convertURL, { headers });
    const convertText = await converts.text();
    const convert = JSON.parse(convertText || '{}');
    if (!convert?.progressURL || !convert?.downloadURL) throw new Error("No se pudo obtener los datos de conversión");

    let info = {};
    for (let i = 0; i < 3; i++) {
      const progressRes = await fetch(convert.progressURL, { headers });
      const progressText = await progressRes.text();
      info = JSON.parse(progressText || '{}');
      if (info.progress === 3) break;
    }

    return {
      url: convert.downloadURL,
      title: info.title || 'video'
    };
  } catch (err) {
    console.error("Error en ytdl:", err.message);
    return null;
  }
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
