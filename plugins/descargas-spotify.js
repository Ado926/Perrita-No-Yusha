import fetch from 'node-fetch';

let MF = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) {
    return m.reply(`🌙 Ingrese el nombre o link de Spotify\n> *Ejemplo:* ${usedPrefix + command} la brujita`);
  }

  let texto = args.join(' ');
  let url = '';

  // Verifica si es un enlace de Spotify
  if (texto.includes('spotify.com/track')) {
    url = texto;
  } else {
    // Búsqueda por nombre
    m.reply('🌙 Buscando en Spotify...');
    let search = await fetch(`https://tanakadomp.onrender.com/spotify/search?query=${encodeURIComponent(texto)}`);
    let json = await search.json();

    if (!json.status || !json.data || !json.data[0]) {
      return m.reply('⚠️ No se encontró la canción. Intenta con otro nombre.');
    }

    url = json.data[0].url;
  }

  // Descarga desde Spotify
  let api = await (await fetch(`https://archive-ui.tanakadomp.biz.id/download/spotify?url=${url}`)).json();
  let force = api.result.data;
  let imagen = force.image;

  let moon = `𝚂𝙿𝙾𝚃𝙸𝙵𝚈 𝑋 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰\n\n`;
  moon += `☪︎ Título: ${force.title}\n`;
  moon += `☪︎ Artista: ${force.artis}\n`;
  moon += `☪︎ Duración: ${force.durasi}\n`;
  moon += `───── ･ ｡ﾟ☆: .☽ . :☆ﾟ. ─────`;

  m.react('🕒');
  await conn.sendFile(m.chat, imagen, 'MoonForce.jpg', moon, m);
  await conn.sendMessage(m.chat, { audio: { url: force.download }, mimetype: 'audio/mpeg' }, { quoted: m });
  m.react('✅');
};

MF.command = ['spotify', 'spotifydl', 'spdl'];

export default MF;
