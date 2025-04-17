// clicker.js

import db from '../lib/database.js'

const emoji = '⚡';
const moneda = '💰';

let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender];
    if (!user.clickPower) user.clickPower = 1;
    if (!user.coin) user.coin = 0;
    if (!user.items) user.items = {};

    switch (command) {
        case 'click':
            let ganado = user.clickPower;
            user.coin += ganado;
            return conn.reply(m.chat, `${emoji} ¡Has hecho click y ganaste *${ganado} ${moneda}*!`, m);

        case 'shop':
            return conn.reply(m.chat, `
🛒 *Tienda Clicker* — Usa *.buy <item>* para comprar

1. ➕ *Mejora de click* - Aumenta el oro ganado por click (+1) - 50 ${moneda}
2. ✨ *Doble oro* - Gana el doble por 10 clicks - 100 ${moneda}
3. 🐱 *Mascota gata* - Te acompaña en el juego - 150 ${moneda}
4. 🎨 *Skin rosada* - Solo estética - 80 ${moneda}

Tu dinero actual: *${user.coin} ${moneda}*
`, m);

        case 'buy':
            let item = (args[0] || '').toLowerCase();
            if (!item) return conn.reply(m.chat, 'Especifica qué quieres comprar', m);

            const shopItems = {
                mejora: { cost: 50, effect: () => user.clickPower += 1 },
                doble: { cost: 100, effect: () => user.items['doble'] = 10 },
                gato: { cost: 150, effect: () => user.items['mascota'] = 'Gato' },
                skin: { cost: 80, effect: () => user.items['skin'] = 'Rosada' },
            };

            const chosen = Object.entries(shopItems).find(([key]) => item.includes(key));
            if (!chosen) return conn.reply(m.chat, 'Ese ítem no existe en la tienda.', m);

            let [key, value] = chosen;
            if (user.coin < value.cost) return conn.reply(m.chat, `No tienes suficiente ${moneda}. Necesitas ${value.cost}`, m);

            user.coin -= value.cost;
            value.effect();

            return conn.reply(m.chat, `Compraste *${key}* exitosamente. ¡Disfrútalo!`, m);
    }
};

handler.help = ['click', 'shop', 'buy <item>'];
handler.tags = ['clicker'];
handler.command = ['click', 'shop', 'buy'];
handler.group = true;
handler.register = true;

export default handler;
