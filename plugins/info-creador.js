import PhoneNumber from 'awesome-phonenumber';

let handler = async (m, { conn }) => {
  m.react('👋');
  
  await sendContactArray(conn, m.chat, [
    [`+50493732693`, `ᰔᩚ Wirk`, `Propietario`, `No Hacer Spam`, ``, `Honduras`, ``, `Masculino`],
    [`+51921826291`, `ᰔᩚ Maycol`, `Propietario`, `No Hacer Spam`, ``, `Perú`, ``, `Masculino`]
  ], m);
}

handler.help = ["creador", "owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data];
  let contacts = [];
  for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5] of data) {
    number = number.replace(/[^0-9]/g, '');
    let njid = number + '@s.whatsapp.net';
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name.replace(/\n/g, '\\n')};;;
FN:${name.replace(/\n/g, '\\n')}
item.ORG:${isi}
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:${isi1}
item3.ADR:;;${isi3};;;;
item3.X-ABADR:ac
item3.X-ABLabel:Región
item5.X-ABLabel:${isi5}
END:VCARD`.trim();
    contacts.push({ vcard, displayName: name });
  }
  return await conn.sendMessage(jid, {
    contacts: {
      displayName: (contacts.length > 1 ? `Contactos` : contacts[0].displayName) || null,
      contacts,
    }
  }, {
    quoted,
    ...options
  });
}
