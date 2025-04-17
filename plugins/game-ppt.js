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

handler.before = async (m) => {
  if (!m.text.toLowerCase().match(/^(piedra|papel|tijera)$/i)) return;
  if (!m.isGroup && m.sender) {
    const gameKey = Object.keys(global.pptGames || {}).find(key =>
      global.pptGames[key] && (global.pptGames[key].player1 === m.sender || global.pptGames[key].player2 === m.sender)
    );

    if (gameKey) {
      const game = global.pptGames[gameKey];
      const playerChoice = m.text.toLowerCase();

      if (game.player1 === m.sender && !game.choice1) {
        game.choice1 = playerChoice;
        await m.reply('Has elegido. Esperando la elección del otro jugador...');
        await m.reply(game.groupChat, `@${m.sender.split('@')[0]} ya ha elegido.`, null, { mentions: [m.sender] });
      } else if (game.player2 === m.sender && !game.choice2) {
        game.choice2 = playerChoice;
        await m.reply('Has elegido. Esperando la elección del otro jugador...');
        await m.reply(game.groupChat, `@${m.sender.split('@')[0]} ya ha elegido.`, null, { mentions: [m.sender] });
      }

      if (game.choice1 && game.choice2) {
        const choice1 = game.choice1;
        const choice2 = game.choice2;
        let result;

        if (choice1 === choice2) {
          result = '¡Empate! Ambos eligieron ' + choice1;
        } else if (
          (choice1 === 'piedra' && choice2 === 'tijera') ||
          (choice1 === 'papel' && choice2 === 'piedra') ||
          (choice1 === 'tijera' && choice2 === 'papel')
        ) {
          result = `@${game.player1.split('@')[0]} ha ganado! Eligió ${choice1} contra ${choice2} de @${game.player2.split('@')[0]}.`;
        } else {
          result = `@${game.player2.split('@')[0]} ha ganado! Eligió ${choice2} contra ${choice1} de @${game.player1.split('@')[0]}.`;
        }

        await conn.reply(game.groupChat, `\n*Resultados del juego de Piedra, Papel o Tijera:*\n\n@${game.player1.split('@')[0]} eligió: ${choice1}\n@${game.player2.split('@')[0]} eligió: ${choice2}\n\n${result}`, null, { mentions: [game.player1, game.player2] });
        delete global.pptGames[gameKey]; // Clear game state
        return true; // Consume the message
      }
      return true; // Consume the message
    }
  }
  return true;
};

handler.help = ['ppt @usuario'];
handler.tags = ['games'];
handler.command = ['ppt'];
handler.group = true;
handler.register = true;

export const goppt = async (m, { conn, usedPrefix, command }) => {
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

export default handler;
