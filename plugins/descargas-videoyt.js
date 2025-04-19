import fetch from 'node-fetch';

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('Ingrese un link de YouTube.');

  m.react("⏳");

  let video, resolution = 'Desconocida';
  try {
    video = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`)).json();
    resolution = '480p';
  } catch (error) {
    try {
      video = await (await fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`)).json();
      resolution = '480p';
    } catch (error) {
      try {
        video = await (await fetch(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`)).json();
        resolution = video?.result?.quality || 'Desconocida';
      } catch (error) {
        video = await (await fetch(`https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`)).json();
        resolution = video?.resolution || 'Desconocida';
      }
    }
  }

  let link = video?.data?.url || video?.download_url || video?.result?.dl_url || video?.downloads?.link?.[0];
  if (!link) return m.reply('《✧》Hubo un error al intentar acceder al link.\n> Si el problema persiste, repórtalo en el grupo de soporte.');

  // Enviar mensaje de espera rápido
  await conn.sendMessage(m.chat, {
    text: `⌛ *Procesando... Espera un momento mientras preparamos tu video...*`,
  }, { quoted: m });

  // Enviar video de forma rápida con caption decorado
  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `🌟 *Tu video está listo* 🌟
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
┃ 🎥 *Descarga exitosa de YouTube*
┃ 🌐 *Resolución*: ${resolution}
┃ 🔥 *¡Todo listo!*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⬣

🎬 *Procesado con cariño por Perrita No Yūsha* 💫
`
  }, { quoted: m });

  m.react("✅");
};

handler.command = ['ytv', 'ytmp4', 'yt'];
handler.register = true;
handler.estrellas = 0;

export default handler;
