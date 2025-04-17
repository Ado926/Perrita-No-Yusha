const handler = async (m, { conn, text, command, usedPrefix, args }) => {
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  const emoji = '🎮';
  const emoji2 = '🤝';

  const now = Date.now();
  const waitTime = 10000; // 10 segundos
  const user = global.db.data.users[m.sender];

  const time = user.wait + waitTime;
  if (now - user.wait < waitTime) {
    const seconds = Math.floor((time - now) / 1000);
    throw `${emoji} Tendrás que esperar ${seconds} segundos antes de poder volver a jugar.`;
  }

  if (!args[0]) {
    return conn.reply(m.chat, `*PIEDRA 🗿, PAPEL 📄 o TIJERA ✂️*\n\n*—◉ Usa uno de estos comandos:*\n*◉ ${usedPrefix + command} piedra*\n*◉ ${usedPrefix + command} papel*\n*◉ ${usedPrefix + command} tijera*`, m);
  }

  let astro = Math.random();
  if (astro < 0.34) {
    astro = 'piedra';
  } else if (astro < 0.67) {
    astro = 'tijera';
  } else {
    astro = 'papel';
  }

  const textm = text.toLowerCase();
  let resultado = '';

  if (textm === astro) {
    user.exp += 500;
    resultado = `*${emoji2} ¡Empate!*\n\n*👉🏻 Tú: ${textm}*\n*👉🏻 Bot: ${astro}*\n*🎁 Premio +500 XP*`;
  } else if (
    (textm === 'papel' && astro === 'piedra') ||
    (textm === 'tijera' && astro === 'papel') ||
    (textm === 'piedra' && astro === 'tijera')
  ) {
    user.exp += 1000;
    resultado = `*${emoji} ¡Tú ganas! 🎉*\n\n*👉🏻 Tú: ${textm}*\n*👉🏻 Bot: ${astro}*\n*🎁 Premio +1000 XP*`;
  } else if (['piedra', 'papel', 'tijera'].includes(textm)) {
    user.exp -= 300;
    resultado = `*☠️ ¡Tú pierdes! ❌*\n\n*👉🏻 Tú: ${textm}*\n*👉🏻 Bot: ${astro}*\n*❌ Premio -300 XP*`;
  } else {
    return conn.reply(m.chat, `❗ Opción inválida. Usa: piedra, papel o tijera`, m);
  }

  user.wait = Date.now();
  return m.reply(resultado);
};

handler.help = ['ppt'];
handler.tags = ['games'];
handler.command = ['ppt'];
handler.group = true;
handler.register = true;

export default handler;
