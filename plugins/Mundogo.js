import fs from 'fs';
const path = './src/database/database.json';

function loadDB() {
  if (!fs.existsSync(path)) return {};
  return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
  fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

export const handler = async (m, { command, args, usedPrefix }) => {
  const db = loadDB();
  const userId = m.sender;

  // Registrar usuario si no existe
  if (!db[userId]) {
    db[userId] = {
      nombre: m.name || 'Aventurero',
      nivel: 1,
      experiencia: 0,
      monedas: 100,
      personaje: null,
      mascota: null
    };
    saveDB(db);
    m.reply(`🌟 Bienvenido a *Mundo GO*, ${m.name}!\nUsa *.go menu* para comenzar tu aventura.`);
    return;
  }

  const usuario = db[userId];
  const accion = args[0]?.toLowerCase();

  switch (accion) {
    case 'menu':
      m.reply(
`🌍 *MUNDO GO - MENÚ PRINCIPAL* 🌍
👤 Nombre: ${usuario.nombre}
🎮 Nivel: ${usuario.nivel}
✨ Experiencia: ${usuario.experiencia}
💰 Monedas: ${usuario.monedas}
🧙‍♂️ Personaje: ${usuario.personaje || 'Ninguno'}
🐾 Mascota: ${usuario.mascota || 'Ninguna'}

📜 Comandos disponibles:
${usedPrefix}go registrar - Comenzar
${usedPrefix}go aventura - Ir a una misión
${usedPrefix}go tienda - Ver personajes y mascotas
${usedPrefix}go comprar [nombre] - Comprar personaje o mascota
${usedPrefix}go estado - Ver tus datos`
      );
      break;

    case 'aventura':
      const ganado = Math.floor(Math.random() * 50) + 10;
      const exp = Math.floor(Math.random() * 15) + 5;
      usuario.monedas += ganado;
      usuario.experiencia += exp;
      saveDB(db);
      m.reply(
`⚔️ Te aventuraste en una peligrosa misión...
🏆 Ganaste ${ganado} monedas y ${exp} de experiencia.
🎉 ¡Sigue jugando para subir de nivel!`
      );
      break;

    case 'estado':
      m.reply(
`📊 *TU ESTADO EN MUNDO GO* 📊
👤 Nombre: ${usuario.nombre}
🎮 Nivel: ${usuario.nivel}
✨ Experiencia: ${usuario.experiencia}
💰 Monedas: ${usuario.monedas}
🧙‍♂️ Personaje: ${usuario.personaje || 'Ninguno'}
🐾 Mascota: ${usuario.mascota || 'Ninguna'}`
      );
      break;

    case 'tienda':
      m.reply(
`🛒 *TIENDA DE MUNDO GO* 🛒
*Personajes:*
- Mago (300 monedas)
- Guerrero (350 monedas)
- Arquera (320 monedas)

*Mascotas:*
- Dragón (500 monedas)
- Gato Ninja (400 monedas)

Usa: ${usedPrefix}go comprar [nombre]`
      );
      break;

    case 'comprar':
      const item = args.slice(1).join(' ');
      if (!item) return m.reply('❗ Especifica qué quieres comprar');

      const personajes = {
        'mago': 300,
        'guerrero': 350,
        'arquera': 320
      };

      const mascotas = {
        'dragón': 500,
        'gato ninja': 400
      };

      const lower = item.toLowerCase();

      if (personajes[lower]) {
        if (usuario.monedas >= personajes[lower]) {
          usuario.monedas -= personajes[lower];
          usuario.personaje = item;
          saveDB(db);
          m.reply(`✅ Compraste al personaje: *${item}*`);
        } else {
          m.reply('❌ No tienes suficientes monedas.');
        }
      } else if (mascotas[lower]) {
        if (usuario.monedas >= mascotas[lower]) {
          usuario.monedas -= mascotas[lower];
          usuario.mascota = item;
          saveDB(db);
          m.reply(`✅ Compraste la mascota: *${item}*`);
        } else {
          m.reply('❌ No tienes suficientes monedas.');
        }
      } else {
        m.reply('❓ Ese personaje o mascota no existe.');
      }
      break;

    case 'registrar':
      m.reply('✅ Ya estás registrado en Mundo GO.');
      break;

    default:
      m.reply(`⚠️ Comando no válido. Usa *.go menu* para ver opciones.`);
      break;
  }
};

handler.command = ['go'];
handler.help = ['go'];
handler.tags = ['fun'];

export default handler;
