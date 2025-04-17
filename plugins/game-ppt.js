const handler = async (m, { conn, text, command, usedPrefix, args }) => {
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  if (!m.isGroup) {
    return conn.reply(m.chat, 'Este comando solo puede ser usado en grupos.', m);
  }

  if (!args[0]) {
    return conn.reply(m.chat, `Debes mencionar al usuario con el que quieres jugar.\n\nEjemplo: ${usedPrefix + command} @usuario`, m);
  }

  const opponent = m.mentionedJid[0];
  if (!opponent) {
    return conn.reply(m.chat, `Menciona a un usuario válido para jugar.`, m);
  }

  if (opponent === m.sender) {
    return conn.reply(m.chat, `No puedes jugar contigo mismo.`, m);
  }

  // Initialize game state
  const gameKey = `ppt_${m.chat}`;
  global.pptGames = global.pptGames || {};

  if (global.pptGames[gameKey]) {
    return conn.reply(m.chat, `Ya hay un juego de Piedra, Papel o Tijera en curso en este grupo.`, m);
  }

  global.pptGames[gameKey] = {
    player1: m.sender,
    player2: opponent,
    choice1: null,
    choice2: null,
    groupChat: m.chat,
  };

  const choices = ['piedra', 'papel', 'tijera'];

  // Send private message to player 1
  let msg1 = `¡Juego de Piedra, Papel o Tijera! 🗿📄✂️\n\nHas sido desafiado por @${m.sender.split('@')[0]} para jugar.\n\nElige tu opción respondiendo a este mensaje con:\n\n*${choices.map(c => `◉ ${usedPrefix + command} ${c}`).join('\n')}*`;
  await conn.sendMessage(m.sender, { text: msg1, mentions: [m.sender] }, { quoted: m });

  // Send private message to player 2
  let msg2 = `¡Juego de Piedra, Papel o Tijera! 🗿📄✂️\n\nHas sido desafiado por @${opponent.split('@')[0]} para jugar.\n\nElige tu opción respondiendo a este mensaje con:\n\n*${choices.map(c => `◉ ${usedPrefix + command} ${c}`).join('\n')}*`;
  await conn.sendMessage(opponent, { text: msg2, mentions: [opponent] }, { quoted: m });

  await conn.reply(m.chat, `@${m.sender.split('@')[0]} ha desafiado a @${opponent.split('@')[0]} a jugar Piedra, Papel o Tijera. ¡Ambos jugadores deben elegir en privado!`, m, { mentions: [m.sender, opponent] });
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
handler.command = ['ppt', 'piedrapapeltijera'];
handler.group = true;
handler.register = true;

export default handler;
