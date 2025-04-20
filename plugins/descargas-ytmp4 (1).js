import axios from 'axios';

const downloadHandler = {
  download: async (url) => {
    const apiUrl = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`;
    
    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.status) {
        return response.data.data;
      } else {
        throw new Error('Fallo al obtener los detalles del video.');
      }
    } catch (error) {
      console.error('Error en la descarga:');
      throw error;
    }
  }
};

const handler = async (m, { conn, text }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Ingresa el enlace de YouTube para descargar.`, m);
    }

    // Reacción de reloj para mostrar que está procesando
    if (conn.sendMessage) {
      await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key }});
    }

    // Mensaje de espera decorado
    await conn.reply(m.chat, `*⌛ Descargando tu video...*\nEspera un momento, por favor.`, m);

    const videoInfo = await downloadHandler.download(text);
    const videoTitle = videoInfo.title;
    const videoUrl = videoInfo.dl;

    await conn.sendMessage(m.chat, { video: { url: videoUrl }, mimetype: 'video/mp4', caption: `*Título:* ${videoTitle}` }, { quoted: m });

  } catch (error) {
    return m.reply(`Error: ${error.message}`);
  }
};

handler.command = handler.help = ['ytmp4', 'ytv'];
handler.tags = ['downloader'];

export default handler;
