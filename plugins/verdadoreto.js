const handler = async (m, { conn, usedPrefix, command, text }) => {
  const verdadList = [
    'Es verdad que alguna vez mentiste para salir de un problema grave.',
    'Es verdad que te has enamorado de alguien por internet.',
    'Es verdad que has espiado el teléfono de alguien sin permiso.',
    'Es verdad que te gustaría cambiar algo de tu cuerpo.',
    'Es verdad que alguna vez hablaste mal de un amigo a sus espaldas.',
    'Es verdad que has tenido un amor secreto.',
    'Es verdad que te gustaría besar a alguien de este grupo.',
    'Es verdad que te arrepientes de algo que hiciste esta semana.',
    'Es verdad que alguna vez copiaste en un examen.',
    'Es verdad que tienes una cuenta secreta en redes sociales.'
  ];

  const retoList = [
    'Te reto a enviar un audio diciendo "Soy un burrito tierno y feliz".',
    'Te reto a cambiar tu nombre a "El rey de los retos" por 10 minutos.',
    'Te reto a mandar un sticker ridículo en el grupo.',
    'Te reto a decirle a alguien del grupo "Te amo" sin contexto.',
    'Te reto a enviar tu última foto tomada sin explicar nada.',
    'Te reto a escribir todo en mayúsculas por 1 hora.',
    'Te reto a hacer una confesión pública ahora mismo.',
    'Te reto a enviar 5 emojis al azar sin repetir.',
    'Te reto a contar un chiste muy malo.',
    'Te reto a enviar un mensaje de voz cantando algo.'
  ];

  if (text.toLowerCase() === 'verdad') {
    const verdad = verdadList[Math.floor(Math.random() * verdadList.length)];
    return conn.sendMessage(m.chat, { text: `🟣 *Verdad:*\n${verdad}` }, { quoted: m });
  }

  if (text.toLowerCase() === 'reto') {
    const reto = retoList[Math.floor(Math.random() * retoList.length)];
    return conn.sendMessage(m.chat, { text: `🔴 *Reto:*\n${reto}` }, { quoted: m });
  }

  const name = await conn.getName(m.sender);
  const texto = `*🎮 Verdad o Reto*\n\nHola ${name.split(' ')[0]}, elige una opción tocando un botón:`;
  const buttons = [
    { buttonId: `${usedPrefix}vd verdad`, buttonText: { displayText: '🟣 Verdad' }, type: 1 },
    { buttonId: `${usedPrefix}vd reto`, buttonText: { displayText: '🔴 Reto' }, type: 1 }
  ];

  const buttonMessage = {
    text: texto,
    footer: 'Perrita No Yusha • Juegos',
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = ['vd'];
handler.tags = ['fun'];
handler.help = ['vd'];
handler.register = true;

export default handler;
