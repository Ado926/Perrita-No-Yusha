import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `⚠️ Por favor, ingresa un enlace de Facebook.`, m);
  }

  let res;
  try {
    await m.react('⏳');
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `❌ Error al obtener datos. Verifica el enlace.`, m);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `😿 No se encontraron resultados.`, m);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, `❌ Error al procesar los datos.`, m);
  }

  if (!data) {
    return conn.reply(m.chat, `📉 No se encontró una resolución adecuada.`, m);
  }

  let video = data.url;

  try {
    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: `✅ *Aquí tienes tu video descargado de Facebook!*`,
      fileName: 'facebook.mp4',
      mimetype: 'video/mp4',
      footer: 'Selecciona una opción:',
      buttons: [
        { buttonId: '.menu', buttonText: { displayText: '↪ Menú Principal 🌸' }, type: 1 }
      ],
      headerType: 5
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    return conn.reply(m.chat, `🚫 Error al enviar el video.`, m);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebooktest', 'fbtest'];
handler.group = true;
handler.register = true;
handler.coin = 1;

export default handler;
