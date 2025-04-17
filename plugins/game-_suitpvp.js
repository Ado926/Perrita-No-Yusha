const handler = (m) => m;

handler.before = async function (m) {
  this.suit = this.suit ? this.suit : {};
  if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0;

  if (!m.isGroup && m.text.startsWith('.ppt')) {
    const [, opponentMention] = m.text.split(/\s+/);
    if (!opponentMention) {
      return m.reply('Menciona al usuario con el que quieres jugar usando: .ppt @usuario');
    }
    const opponent = opponentMention.replace('@', '') + '@s.whatsapp.net';
    if (opponent === m.sender) {
      return m.reply('No puedes jugar contigo mismo.');
    }
    if (!db.data.users[opponent]) {
      return m.reply('El usuario mencionado no está registrado.');
    }

    const roomid = 'ppt-' + m.chat;
    if (this.suit[roomid]) {
      return m.reply('Ya hay un juego de PPT en este chat.');
    }

    const suit = {
      id: roomid,
      p: m.sender,
      p2: opponent,
      status: 'wait',
      chat: m.chat,
      waktu: setTimeout(() => {
        if (this.suit[roomid]) {
          const textTimeout = `${emoji2} @${m.sender.split`@`[0]} El tiempo de espera para el PVP ha terminado, el juego se cancela.`;
          this.sendMessage(m.chat, { text: textTimeout, mentions: this.parseMention(textTimeout) }, { quoted: m });
          delete this.suit[roomid];
        }
      }, 60000), // 1 minuto de espera
      poin: 1000, // XP ganador
      poin_lose: -300, // XP perdedor
      poin_bot: 200, // XP adicional al bot (si aplica)
      timeout: 60000, // Tiempo para aceptar
    };

    this.suit[roomid] = suit;
    const textInvite = `${emoji} @${opponent.split`@`[0]} has sido invitado a un juego de Piedra, Papel o Tijera por @${m.sender.split`@`[0]}\n\nResponde con *aceptar* para comenzar.`;
    m.reply(textInvite, null, { mentions: [opponent, m.sender] });
    return !0;
  }

  const room = Object.values(this.suit).find((room) => room.id && room.status && [room.p, room.p2].includes(m.sender));
  if (room) {
    let win = '';
    let tie = false;
    if (m.sender == room.p2 && /^(acc(ept)?|terima|aceptar|gas|aceptare?|nao)/i.test(m.text) && room.status == 'wait' && room.chat == m.chat) {
      room.status = 'play';
      room.asal = m.chat;
      clearTimeout(room.waktu);
      const textplay = `🎮 Games - PVP - Games 🎮\n\n—◉ El juego comienza, las opciones han sido enviadas a los chats privados de @${room.p.split`@`[0]} y @${room.p2.split`@`[0]}\n\n◉ Seleccionen una opción en sus chats privados, respectivamente.\n*◉ Elegir opción en wa.me/${this.user.jid.split`@`[0]}*`;
      this.sendMessage(m.chat, { text: textplay, mentions: this.parseMention(textplay) }, { quoted: m });
      const comienzop = `${emoji} Por favor, seleccione una de las siguientes opciones:
piedra
papel
tijera\nGanador +${room.poin}XP\nPerdedor ${room.poin_lose}XP\n*responda a este mensaje con la opción que desea*
*ejemplo: papel*`;
      const comienzop2 = `${emoji} Por favor, seleccione una de las siguientes opciones:
piedra
papel
tijera\nGanador +${room.poin}XP\nPerdedor ${room.poin_lose}XP\n*responda a este mensaje con la opción que desea*
*ejemplo: papel*`;

      if (!room.pilih) this.sendMessage(room.p, { text: comienzop }, { quoted: m });
      if (!room.pilih2) this.sendMessage(room.p2, { text: comienzop2 }, { quoted: m });
      room.waktu_milih = setTimeout(() => {
        const iniciativa = `${emoji2} Ningún jugador tomó la iniciativa de empezar el juego, el PVP se ha cancelado.`;
        if (!room.pilih && !room.pilih2) this.sendMessage(m.chat, { text: iniciativa }, { quoted: m });
        else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.p2 : room.p;
          const textnull = `${emoji2} @${(room.pilih ? room.p2 : room.p).split`@`[0]} No elegiste ninguna opción, fin del PVP.`;
          this.sendMessage(m.chat, { text: textnull, mentions: this.parseMention(textnull) }, { quoted: m });
          db.data.users[win == room.p ? room.p : room.p2].exp += room.poin;
          db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot;
          db.data.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose;
        }
        delete this.suit[room.id];
        return !0;
      }, room.timeout);
    }
    const jwb = m.sender == room.p;
    const jwb2 = m.sender == room.p2;
    const g = /tijera/i;
    const b = /piedra/i;
    const k = /papel/i;
    const reg = /^(tijera|piedra|papel)/i;
    if (jwb && reg.test(m.text) && !room.pilih && !m.isGroup && m.chat == room.p) {
      room.pilih = reg.exec(m.text.toLowerCase())[0];
      room.text = m.text;
      m.reply(`${emoji} Has elegido ${m.text}, regresa al grupo y ${room.pilih2 ? `Revisa los resultados` : 'Espera los resultados'}`);
      if (!room.pilih2) this.reply(room.p2, `${emoji2} El oponente ha elegido, es tu turno de elegir!!.`, 0);
    }
    if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup && m.chat == room.p2) {
      room.pilih2 = reg.exec(m.text.toLowerCase())[0];
      room.text2 = m.text;
      m.reply(`${emoji} Has elegido ${m.text}, regresa al grupo y ${room.pilih ? `Revisa los resultados` : 'Espera los resultados'}`);
      if (!room.pilih) this.reply(room.p, `${emoji2} El oponente ha elegido, es tu turno de elegir!!.`, 0);
    }
    const stage = room.pilih;
    const stage2 = room.pilih2;
    if (room.pilih && room.pilih2) {
      clearTimeout(room.waktu_milih);
      if (b.test(stage) && g.test(stage2)) win = room.p;
      else if (b.test(stage) && k.test(stage2)) win = room.p2;
      else if (g.test(stage) && k.test(stage2)) win = room.p;
      else if (g.test(stage) && b.test(stage2)) win = room.p2;
      else if (k.test(stage) && b.test(stage2)) win = room.p;
      else if (k.test(stage) && g.test(stage2)) win = room.p2;
      else if (stage == stage2) tie = true;
      this.reply(room.asal, `
*👑 Resultados del PVP 👑*${tie ? '\n*—◉ Empate!!*' : ''}
*@${room.p.split`@`[0]} (${room.text})* ${tie ? '' : room.p == win ? ` *Gano 🥳 +${room.poin}XP*` : ` *Perdio 🤡 ${room.poin_lose}XP*`}
*@${room.p2.split`@`[0]} (${room.text2})* ${tie ? '' : room.p2 == win ? ` *Gano 🥳 +${room.poin}XP*` : ` *Perdio 🤡 ${room.poin_lose}XP*`}
`.trim(), m, { mentions: [room.p, room.p2] });
      if (!tie) {
        db.data.users[win == room.p ? room.p : room.p2].exp += room.poin;
        db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot;
        db.data.users[win == room.p ? room.p2 : room.p].exp += room.poin_lose;
      }
      delete this.suit[room.id];
    }
  }
  return !0;
};

handler.exp = 0;
handler.command = ['ppt']; // Trigger on .ppt command

export default handler;

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
      }
