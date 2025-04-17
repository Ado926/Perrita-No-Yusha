const handler = async (m, { conn, usedPrefix, args }) => {
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

  let text;
  let buttons = [];

  if (/^(verdad)$/i.test(args[0])) {
    text = `🟣 *Verdad:*\n${pickRandom(verdadList)}`;
    buttons = [
      { buttonId: `${usedPrefix}vd verdad`, buttonText: { displayText: '🟣 Otra Verdad' }, type: 1 },
      { buttonId: `${usedPrefix}vd reto`, buttonText: { displayText: '🔴 Ir a Reto' }, type: 1 }
    ];
  } else if (/^(reto)$/i.test(args[0])) {
    text = `🔴 *Reto:*\n${pickRandom(retoList)}`;
    buttons = [
      { buttonId: `${usedPrefix}vd reto`, buttonText: { displayText: '🔴 Otro Reto' }, type: 1 },
      { buttonId: `${usedPrefix}vd verdad`, buttonText: { displayText: '🟣 Ir a Verdad' }, type: 1 }
    ];
  } else {
    text = `🎮 *Verdad o Reto*\n\nElige una opción para comenzar.`;
    buttons = [
      { buttonId: `${usedPrefix}vd verdad`, buttonText: { displayText: '🟣 Verdad' }, type: 1 },
      { buttonId: `${usedPrefix}vd reto`, buttonText: { displayText: '🔴 Reto' }, type: 1 }
    ];
  }

  await conn.sendMessage(m.chat, {
    text,
    footer: 'Perrita No Yusha • Juegos',
    buttons,
    headerType: 1,
    mentions: [m.sender]
  }, { quoted: m });
};

handler.help = ['vd'];
handler.tags = ['juegos'];
handler.command = ['vd'];
handler.register = true;

export default handler;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
