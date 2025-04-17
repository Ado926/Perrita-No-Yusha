const handler = async (m, { conn, text, command, usedPrefix, args }) => {
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';
  const time = global.db.data.users[m.sender].wait + 10000;

  if (new Date - global.db.data.users[m.sender].wait < 10000) {
    throw `⏳ Espera ${Math.floor((time - new Date()) / 1000)} segundos para volver a jugar.`;
  }

  const choices = ['piedra', 'papel', 'tijera'];
  const userChoice = text.toLowerCase();

  if (!choices.includes(userChoice)) {
    return conn.reply(m.chat, `*PIEDRA 🗿, PAPEL 📄 o TIJERA ✂️*\n\n*Usa uno de estos comandos:*\n${usedPrefix + command} piedra\n${usedPrefix + command} papel\n${usedPrefix + command} tijera\n\n*También puedes retar a alguien con:* ${usedPrefix + command} piedra @usuario`, m);
  }

  let opponent = m.mentionedJid?.[0];
  let botChoice = choices[Math.floor(Math.random() * choices.length)];
  let resultMsg = '';
  let playerName = conn.getName(m.sender);
  let opponentName = opponent ? conn.getName(opponent) : 'El Bot';

  const win = (a, b) =>
    (a === 'piedra' && b === 'tijera') ||
    (a === 'papel' && b === 'piedra') ||
    (a === 'tijera' && b === 'papel');

  if (opponent) {
    if (opponent === m.sender) {
      return m.reply('¿Jugar contigo mismo? ¡Eso está raro!');
    }
    botChoice = choices[Math.floor(Math.random() * choices.length)];
    resultMsg = `*${playerName} vs ${opponentName}*\n\n👉 ${playerName}: ${userChoice}\n👉 ${opponentName}: ${botChoice}\n\n`;

    if (userChoice === botChoice) {
      resultMsg += '🤝 ¡Empate! Ambos son unos genios.';
    } else if (win(userChoice, botChoice)) {
      resultMsg += `🎉 ¡${playerName} gana! ¡Eres el campeón del patio!`;
      global.db.data.users[m.sender].exp += 1000;
    } else {
      resultMsg += `💀 ¡${opponentName} gana! Qué triste, ${playerName}.`;
      global.db.data.users[m.sender].exp -= 300;
    }
  } else {
    resultMsg = `*${playerName} vs Bot*\n\n👉 Tú: ${userChoice}\n👉 Bot: ${botChoice}\n\n`;

    if (userChoice === botChoice) {
      resultMsg += '🤝 ¡Empate!';
      global.db.data.users[m.sender].exp += 500;
    } else if (win(userChoice, botChoice)) {
      resultMsg += '🎉 ¡Tú ganas!';
      global.db.data.users[m.sender].exp += 1000;
    } else {
      resultMsg += '💀 ¡Pierdes!';
      global.db.data.users[m.sender].exp -= 300;
    }
  }

  global.db.data.users[m.sender].wait = new Date * 1;
  await conn.sendMessage(m.chat, { text: resultMsg, contextInfo: { externalAdReply: { title: '¡Piedra, Papel o Tijera!', mediaUrl: '', sourceUrl: '', thumbnailUrl: pp } } }, { quoted: m });
};

handler.help = ['ppt <piedra|papel|tijera> [@usuario]'];
handler.tags = ['games'];
handler.command = ['ppt'];
handler.group = true;
handler.register = true;

export default handler;
