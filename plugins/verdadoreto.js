import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, args, usedPrefix, command }) => {
  
  // Listas de preguntas de "Verdad" y "Reto"
  const verdades = [
    '¿Es verdad que alguna vez mentiste para salir de un problema grave?',
    '¿Es verdad que te has enamorado de alguien por internet?',
    '¿Es verdad que alguna vez hablaste mal de un amigo a sus espaldas?',
    '¿Es verdad que te gustaría cambiar algo de tu cuerpo?',
    '¿Es verdad que alguna vez copiaste en un examen?',
    '¿Es verdad que tienes un amor secreto?',
    '¿Es verdad que alguna vez desobedeciste una regla importante?',
    '¿Es verdad que alguna vez te arrepentiste de algo que hiciste esta semana?',
    '¿Es verdad que tienes miedo de algo que los demás no saben?',
    '¿Es verdad que has tenido una cita vergonzosa?'
  ];

  const retos = [
    'Te reto a enviar un audio diciendo "Soy el campeón de los retos".',
    'Te reto a cambiar tu foto de perfil por 1 hora a una foto de un animal.',
    'Te reto a enviar un sticker ridículo en el grupo.',
    'Te reto a escribir "Te amo" a alguien del grupo sin contexto.',
    'Te reto a cantar algo en tu voz y enviarlo.',
    'Te reto a hacer una confesión pública en el grupo.',
    'Te reto a escribir solo en mayúsculas por los próximos 10 minutos.',
    'Te reto a enviar 5 emojis al azar sin ningún orden.',
    'Te reto a contar un chiste malo a todos.',
    'Te reto a enviar una foto sin ningún contexto, solo la foto.'
  ];

  let text = '';
  let buttons = [];

  // Usamos el "switch" para manejar las opciones
  switch ((args[0] || '').toLowerCase()) {
    case 'verdad':
      text = `🟣 *Verdad:*\n${pickRandom(verdades)}`;
      buttons = [
        { buttonId: `${usedPrefix}verdadoreto verdad`, buttonText: { displayText: '🟣 Otra Verdad' }, type: 1 },
        { buttonId: `${usedPrefix}verdadoreto reto`, buttonText: { displayText: '🔴 Ir a Reto' }, type: 1 }
      ];
      break;

    case 'reto':
      text = `🔴 *Reto:*\n${pickRandom(retos)}`;
      buttons = [
        { buttonId: `${usedPrefix}verdadoreto reto`, buttonText: { displayText: '🔴 Otro Reto' }, type: 1 },
        { buttonId: `${usedPrefix}verdadoreto verdad`, buttonText: { displayText: '🟣 Ir a Verdad' }, type: 1 }
      ];
      break;

    default:
      text = `🎮 *Verdad o Reto*\n\nElige una opción para comenzar.`;
      buttons = [
        { buttonId: `${usedPrefix}verdadoreto verdad`, buttonText: { displayText: '🟣 Verdad' }, type: 1 },
        { buttonId: `${usedPrefix}verdadoreto reto`, buttonText: { displayText: '🔴 Reto' }, type: 1 }
      ];
      break;
  }

  const message = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: text,
        hydratedFooterText: 'Perrita No Yusha • Verdad o Reto',
        hydratedButtons: buttons
      }
    }
  }), { quoted: m });

  await conn.relayWAMessage(message);
}

handler.help = ['verdadoreto'];
handler.tags = ['juegos'];
handler.command = ['verdadoreto', 'vd'];

export default handler;

// Función para elegir un valor aleatorio de una lista
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
