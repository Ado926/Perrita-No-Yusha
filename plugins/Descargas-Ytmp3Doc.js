import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal);
    await m.react('🕓');

    try {
        const response = await fetch(`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(args[0])}`);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();

        if (!data.url) throw new Error("No se pudo obtener el enlace de descarga.");

        let txt = '`乂  Y O U T U B E  -  M P 3`\n\n' +
            `    ✩   *Título* : ${data.title}\n` +
            `    ✩   *Calidad* : ${data.quality}\n` +
            `    ✩   *Duración* : ${Math.floor(data.lengthSeconds / 60)} minutos\n\n` +
            '> *- ↻ El audio en documento se está enviando, espera un momento...*';

        await conn.sendFile(m.chat, data.thumbnail, 'thumbnail.jpg', txt, m);
        
        await conn.sendMessage(m.chat, { document: { url: data.url }, fileName: `${data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
        
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, 'Ocurrió un error durante la descarga. Inténtalo de nuevo más tarde.', m);
    }
};

handler.help = ['ytmp3doc *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp3doc', 'ytadoc', 'fgmp3doc'];
handler.register = true;

export default handler;