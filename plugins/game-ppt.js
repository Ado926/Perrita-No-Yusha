// Handler for .ppt command (challenge)
const handler = async (m, { conn, text, command, usedPrefix, args }) => {
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  if (!m.isGroup) {
    return conn.reply(m.chat, 'Este comando solo puede ser usado en grupos.', m);
  }

  if (!args[0]) {
    return conn.reply(m.chat, `Debes mencionar al usuario que quieres desafiar.\n\nEjemplo: ${usedPrefix + command} @usuario`, m);
  }

  const challengedUser = m.mentionedJid[0];
  if (!challengedUser) {
    return conn.reply(m.chat, `Menciona a un usuario válido para desafiar.`, m);
  }

  if (challengedUser === m.sender) {
    return conn.reply(m.chat, `No puedes desafiarte a ti mismo.`, m);
  }

  // Initialize challenge state
  global.pptChallenges = global.pptChallenges || {};
  const challengeKey = `ppt_challenge_${m.chat}_${challengedUser}`;

  if (global.pptChallenges[challengeKey]) {
    return conn.reply(m.chat, `Ya hay un desafío pendiente para este usuario en este grupo.`, m);
  }

  global.pptChallenges[challengeKey] = {
    challenger: m.sender,
    challenged: challengedUser,
    groupChat: m.chat,
  };

  const challengerName = conn.getName(m.sender);
  const challengedName = conn.getName(challengedUser);

  const challengeMessage = `Sala creada para ${challengedName} (@${challengedUser.split('@')[0]}).\n${challengerName} (@${m.sender.split('@')[0]}) te ha retado a jugar Piedra, Papel o Tijera.\n\nUsa el comando \`.goppt\` para aceptar el desafío.`;

  await conn.reply(m.chat, challengeMessage, m, { mentions: [challengedUser, m.sender] });
};

handler.help = ['ppt @usuario'];
handler.tags = ['games'];
handler.command = ['ppt'];
handler.group = true;
handler.register = true;

// Handler for .goppt command (accept challenge)
const goppt = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) {
    return conn.reply(m.chat, 'Este comando solo puede ser usado en grupos.', m);
  }

  const challengeKey = Object.keys(global.pptChallenges || {}).find(key =>
    global.pptChallenges[key] && global.pptChallenges[key].challenged === m.sender && global.pptChallenges[key].groupChat === m.chat
  );

  if (!challengeKey) {
    return conn.reply(m.chat, 'No tienes ningún desafío de Piedra, Papel o Tijera pendiente en este grupo.', m);
  }

  const challenge = global.pptChallenges[challengeKey];
  const player1 = challenge.challenger;
  const player2 = challenge.challenged;
  const groupChat = challenge.groupChat;

  // Move game state from challenges to games
  const gameKey = `ppt_${groupChat}`;
  global.pptGames = global.pptGames || {};
  global.pptGames[gameKey] = {
    player1: player1,
    player2: player2,
    choice1: null,
    choice2: null,
    groupChat: groupChat,
  };

  delete global.pptChallenges[challengeKey]; // Remove the challenge

  const choices = ['piedra', 'papel', 'tijera'];

  // Send private message to player 1 (challenger)
  let msg1 = `¡El desafío ha sido aceptado! 🗿📄✂️\n\nElige tu opción respondiendo a este mensaje con:\n\n*${choices.map(c => `◉ ${usedPrefix}ppt ${c}`).join('\n')}*`;
  await conn.sendMessage(player1, { text: msg1 }, { quoted: m });

  // Send private message to player 2 (accepter)
  let msg2 = `¡Has aceptado el desafío! 🗿📄✂️\n\nElige tu opción respondiendo a este mensaje con:\n\n*${choices.map(c => `◉ ${usedPrefix}ppt ${c}`).join('\n')}*`;
  await conn.sendMessage(player2, { text: msg2 }, { quoted: m });

  await conn.reply(groupChat, `@${m.sender.split('@')[0]} ha aceptado el desafío. ¡Ambos jugadores deben elegir en privado!`, m, { mentions: [m.sender] });
};

goppt.help = ['goppt'];
goppt.tags = ['games'];
goppt.command = ['goppt'];
goppt.group = true;
goppt.register = true;

export { goppt }; // Export the goppt function
export default handler; // Export the main handler
