const handler = async (m, { conn, usedPrefix, text }) => {
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

  const sections = [
    {
      title: "Opciones disponibles",
      rows: [
        { title: "🟣 Verdad", rowId: `${usedPrefix}vd verdad` },
        { title: "🔴 Reto", rowId: `${usedPrefix}vd reto` }
      ]
    }
  ];

  const listMessage = {
    text: '*🎮 Verdad o Reto*\n\nElige una opción:',
    footer: 'Perrita No Yusha • Juegos',
    title: '¿Qué eliges?',
    buttonText: 'Toca aquí para elegir',
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = /^vd$/i;
handler.tags = ['juegos'];
handler.help = ['vd'];
handler.register = true;

export default handler;
