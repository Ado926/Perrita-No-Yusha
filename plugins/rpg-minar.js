let cooldowns = {}

let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender];
if (!user) return;

let coin = pickRandom([20, 5, 7, 8, 88, 40, 50, 70, 90, 999, 300]);
let emerald = pickRandom([1, 5, 7, 8]);
let iron = pickRandom([5, 6, 7, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
let gold = pickRandom([20, 5, 7, 8, 88, 40, 50]);
let coal = pickRandom([20, 5, 7, 8, 88, 40, 50, 80, 70, 60, 100, 120, 600, 700, 64]);
let stone = pickRandom([200, 500, 700, 800, 900, 4000, 300]);

let img = 'https://i.postimg.cc/GtBWv17L/file-000000008a9c6230b04b7e1b1327afcb-conversation-id-680121d7-6730-800d-a9f8-4ecc9f1d91de-message-i.png';
let time = user.lastmiming + 600000;

if (new Date() - user.lastmiming < 600000) {
return conn.reply(m.chat, `${emoji3} Debes esperar ${msToTime(time - new Date())} para volver a minar.`, m);
}

let hasil = Math.floor(Math.random() * 1000);
let info = `⛏️ *_Te has adentrando en lo profundo de las cuevas_*\n\n` +
`\`\`\`🌻 Obtuviste estos recursos\`\`\`\n\n` +
`🌸 *Exp*: ${hasil}\n` +
`💸 *${moneda}*: ${coin}\n` +
`♦️ *Esmeralda*: ${emerald}\n` +
`🔩 *Hierro*: ${iron}\n` +
`🪙 *Oro*: ${gold}\n` +
`⚫ *Carbón*: ${coal}\n` +
`🪨 *Piedra*: ${stone}`;

await conn.sendFile(m.chat, img, 'yuki.jpg', info, fkontak);
await m.react('☀️');

user.health -= 50;
user.pickaxedurability -= 30;
user.coin += coin;
user.iron += iron;
user.gold += gold;
user.emerald += emerald;
user.coal += coal;
user.stone += stone;
user.lastmiming = new Date() * 1;
}

handler.help = ['minar'];
handler.tags = ['economy'];
handler.command = ['minar', 'miming', 'miner'];
handler.register = true;
handler.group = true;

export default handler;

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

hours = (hours < 10) ? '0' + hours : hours;
minutes = (minutes < 10) ? '0' + minutes : minutes;
seconds = (seconds < 10) ? '0' + seconds : seconds;

return minutes + ' m y ' + seconds + ' s ';
}
