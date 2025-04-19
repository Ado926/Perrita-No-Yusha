import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  // Verifica si el enlace de Instagram fue proporcionado
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m);
  }

  try {
    // Reaccionar mientras se obtiene el video
    await m.react(rwait);
    
    // Obtener los datos del enlace de Instagram usando la API
    const res = await igdl(args[0]);
    const data = res.data;

    // Si se encontraron medios
    if (data && data.length > 0) {
      // Enviar el video al chat
      for (let media of data) {
        await conn.sendFile(m.chat, media.url, 'instagram.mp4', '', m);
      }
      // Reacción de éxito
      await m.react(done);
    } else {
      // Si no se encontraron videos en el enlace
      return conn.reply(m.chat, `${msm} No se encontraron videos en este enlace.`, m);
    }
  } catch (e) {
    // Manejo de errores
    return conn.reply(m.chat, `${msm} Ocurrió un error al obtener el video.`, m);
    await m.react(error);
  }
};

// Definir comandos y configuraciones
handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;
