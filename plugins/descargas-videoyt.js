import fetch from 'node-fetch';

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply('Ingrese un link de YouTube.');

  m.react("⏱️");

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

  
  await conn.sendMessage(m.chat, {
    text: `╭─── ⊷\n│ ✅ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙘𝙤𝙣 𝙚́𝙭𝙞𝙩𝙤\n│ 📤 𝙀𝙣𝙫𝙞𝙖𝙣𝙙𝙤...\n╰────────────⊷`,
  }, { quoted: m });

  
  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: `╭━━〔 🎥 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 - 𝙈𝙋4 〕━━⬣
┃  📡 𝙏𝙪 𝙫𝙞𝙙𝙚𝙤 𝙚𝙨𝙩𝙖́ 𝙡𝙞𝙨𝙩𝙤.
┃  🧩 𝙍𝙚𝙨𝙤𝙡𝙪𝙘𝙞𝙤́𝙣: ${resolution}
┃  ✅ 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖 𝙘𝙤𝙣 𝙚𝙭𝙞𝙩𝙤.
╰━━━━━━━━━━━━━━━━⬣`,
  }, { quoted: m });

  m.react("🌹");
};

handler.command = ['ytv', 'ytmp4', 'yt'];
handler.register = true;
handler.estrellas = 0;

export default handler;
