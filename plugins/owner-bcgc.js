const handler = async (m, { conn, isROwner, text, usedPrefix, command }) => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const allGroups = await conn.groupFetchAllParticipating();
  const groups = Object.values(allGroups);

  const message = m.quoted && m.quoted.text ? m.quoted.text : text;
  if (!message) throw `⚠️ *Te faltó el texto para enviar.*\n\n*Ejemplo:*\n${usedPrefix + command} Hola a todos los grupos`;

  let enviados = [];

  for (const group of groups) {
    try {
      await delay(500);
      await conn.relayMessage(group.id, {
        liveLocationMessage: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          accuracyInMeters: 0,
          degreesClockwiseFromMagneticNorth: 0,
          caption: '⭐️ M E N S A J E ⭐️\n\n' + message + '\n\n🐾 *Perrita no Yūsha*',
          sequenceNumber: 1,
          timeOffset: 0,
          contextInfo: m,
        }
      }, {});
      enviados.push(group.subject);
    } catch (e) {
      console.log(`[Error al enviar a ${group.id} - ${group.subject}]`, e);
    }
  }

  let resumen = `✅ *Mensaje enviado a ${enviados.length} grupo(s):*\n\n`;
  resumen += enviados.map((name, i) => `• ${i + 1}. ${name}`).join('\n');
  resumen += `\n\n✨ *Con cariño, Perrita no Yūsha* ✨`;

  m.reply(resumen);
};

handler.help = ['broadcastgroup', 'bcgc'];
handler.tags = ['owner'];
handler.command = ['bcgc'];
handler.owner = true;

export default handler;
