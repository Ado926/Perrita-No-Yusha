import fs from 'fs';

const dbPath = './src/database/database.json';
let db = {};

// Cargar base de datos
if (fs.existsSync(dbPath)) {
  db = JSON.parse(fs.readFileSync(dbPath));
} else {
  fs.writeFileSync(dbPath, JSON.stringify({}));
}

function saveDB() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export const handler = async (m, { command, args, usedPrefix }) => {
  const user = m.sender;
  const action = args[0]?.toLowerCase();

  if (!db[user]) {
    db[user] = {
      coins: 100,
      exp: 0,
      character: null,
      pet: null,
    };
    saveDB();
  }

  const menu = `
🌍 *Mundo GO - Menú RPG* 🌍

👤 *Perfil:* \`${usedPrefix}go perfil\`
🎮 *Jugar:* \`${usedPrefix}go jugar\`
🛍️ *Tienda:* \`${usedPrefix}go tienda\`
🎁 *Comprar:* \`${usedPrefix}go comprar <personaje/mascota>\`
✨ *Mascota:* \`${usedPrefix}go mascota\`

💾 Datos guardados automáticamente.
`;

  function send(text) {
    m.reply(text);
  }

  // Mostrar menú con `.go` o `.go menu`
  if (!action || action === 'menu') return send(menu);

  // Comandos
  switch (action) {
    case 'perfil':
      const { coins, exp, character, pet } = db[user];
      send(`
👤 *Tu Perfil en Mundo GO*

🎖️ Personaje: ${character || 'Ninguno'}
🐾 Mascota: ${pet || 'Ninguna'}
💰 Coins: ${coins}
⭐ Exp: ${exp}
`);
      break;

    case 'jugar':
      const ganado = Math.floor(Math.random() * 50) + 10;
      db[user].coins += ganado;
      db[user].exp += 5;
      saveDB();
      send(`🎮 Jugaste una partida y ganaste ${ganado} coins y 5 EXP.`);
      break;

    case 'tienda':
      send(`
🛍️ *Tienda de Mundo GO*

🎖️ Personajes:
- Guerrero (100 coins)
- Hechicero (120 coins)

🐾 Mascotas:
- Lobo (80 coins)
- Gato (70 coins)

Compra con: \`${usedPrefix}go comprar <nombre>\`
`);
      break;

    case 'comprar':
      const item = args[1]?.toLowerCase();
      if (!item) return send('❌ Especifica qué quieres comprar.');
      const precios = {
        guerrero: 100,
        hechicero: 120,
        lobo: 80,
        gato: 70
      };

      if (!precios[item]) return send('❌ Ese personaje o mascota no existe.');

      const precio = precios[item];
      if (db[user].coins < precio) return send('💸 No tienes suficientes coins.');

      db[user].coins -= precio;
      if (['guerrero', 'hechicero'].includes(item)) {
        db[user].character = item;
      } else {
        db[user].pet = item;
      }

      saveDB();
      send(`✅ Compraste *${item}* por ${precio} coins.`);
      break;

    case 'mascota':
      const mascota = db[user].pet;
      if (!mascota) return send('❌ No tienes ninguna mascota.');
      send(`🐾 Tu mascota actual es: *${mascota}*`);
      break;

    default:
      send('❌ Comando no reconocido. Usa `.go menu` para ver las opciones.');
  }
};

handler.command = ['go'];
handler.help = ['go'];
handler.tags = ['rpg'];
