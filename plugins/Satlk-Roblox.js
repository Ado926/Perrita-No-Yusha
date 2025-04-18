import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🚩 Por favor, ingrese un nombre de usuario para buscar.\n\nEjemplo:\n> *${usedPrefix + command}* ashli2899`, m, rcanal);
  }

  await m.react('🕓');
  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/tools/robloxstalk?username=${encodeURIComponent(text)}&type=name`);
    const json = await res.json();

    if (!json.status || !json.data) {
      await m.react('✖️');
      return await conn.reply(m.chat, '❌ No se encontraron resultados para esta búsqueda.', m);
    }

    const user = json.data;
    let txt = `📌 *R O B L O X  -  U S U A R I O*\n\n`;
    txt += `👤 *Nombre:* ${user.name}\n`;
    txt += `🔖 *Usuario:* ${user.username}\n`;
    txt += `👥 *Amigos:* ${user.friends.toLocaleString()}\n`;
    txt += `🔄 *Siguiendo:* ${user.followings.toLocaleString()}\n`;
    txt += `📅 *Cuenta creada:* ${new Date(user.created).toLocaleDateString('es-ES')}\n`;
    txt += `🌍 *Ubicación:* ${user.extraInfo.country}\n`;
    txt += `🔗 *Perfil:* ${user.url}\n\n`;

    txt += `🎮 *Grupos:* \n\n`;
    user.groups.forEach((group) => {
      txt += `👥 *Grupo:* ${group.groupName}\n`;
      txt += `📝 *Rol:* ${group.role}\n`;
      txt += `👥 *Miembros:* ${group.memberCount.toLocaleString()}\n\n`;
    });

    if (user.gamesCreated.length > 0) {
      txt += `🎮 *Juegos Creado:* \n\n`;
      user.gamesCreated.forEach((game) => {
        txt += `🎮 *Nombre del Juego:* ${game.name}\n`;
        txt += `📅 *Creado:* ${new Date(game.created).toLocaleDateString('es-ES')}\n`;
        txt += `🔗 *Juego ID:* ${game.gameId}\n\n`;
      });
    } else {
      txt += `🎮 *Juegos Creados:* No se encontraron datos.\n\n`;
    }

    await conn.sendMessage(m.chat, { image: { url: user.profile_image }, caption: txt }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, '⚠️ Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
};

handler.help = ['robloxstalk *<nombre>*'];
handler.tags = ['stalk'];
handler.command = ['robloxstalk', 'rbxstalk'];
handler.register = true;

export default handler;
