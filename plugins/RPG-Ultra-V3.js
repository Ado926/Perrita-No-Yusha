import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  console.log('RPG command received:', m.sender); // Log when the command is received
  if (command !== 'rpg') return;

  // RPG-Ultra V3 - Sistema de Juego de Rol Avanzado

  //━━━━━━━━━[ CONSTANTES GLOBALES ]━━━━━━━━━//

  const COOLDOWN_MINING = 5 * 60 * 1000 // 5 minutos
  const COOLDOWN_FARMING = 3 * 60 * 1000 // 3 minutos
  const COOLDOWN_HUNTING = 4 * 60 * 1000 // 4 minutos
  const COOLDOWN_ADVENTURE = 10 * 60 * 1000 // 10 minutos
  const COOLDOWN_DUEL = 30 * 60 * 1000 // 30 minutos
  const COOLDOWN_ROBBERY = 60 * 60 * 1000 // 1 hora
  const COOLDOWN_MARRIAGE = 24 * 60 * 60 * 1000 // 24 horas
  const COOLDOWN_RECOVER = 15 * 60 * 1000 // 15 minutos para recuperar energía
  const COOLDOWN_DUNGEON = 15 * 60 * 1000 // 15 minutos para entrar a la mazmorra
  const STAMINA_DUNGEON_COST = 30; // Costo de energía para entrar a la mazmorra
  const HUNGER_THRESHOLD = 20; // Umbral de hambre para empezar a perder energía

  //━━━━━━━━━[ VERIFICACIÓN DE BASES DE DATOS ]━━━━━━━━━//

  if (!global.db || !global.db.data || !global.db.data.users) {
      console.error("Database not initialized. Ensure global.db.data.users is available.");
  } else if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      exp: 0, limit: 10, lastclaim: 0, registered: false, name: conn.getName(m.sender),
      health: 100, stamina: 100, mana: 20,
      gold: 50, diamond: 0, emerald: 0, ruby: 0, iron: 0, stone: 0, wood: 0, leather: 0, string: 0,
      herb: 0, food: 5, potion: 1, seeds: 0, crops: 0,
      weapon: 0, armor: 0, pickaxe: 0, axe: 0, fishingrod: 0,
      strength: 5, agility: 5, intelligence: 5, charisma: 5, vitality: 5,
      level: 0, kills: 0, deaths: 0, wins: 0, losses: 0,
      reputation: 0, guild: '', clan: '', family: '', marriage: '', children: [],
      house: 0, farm: 0, barn: 0, workshop: 0, shop: 0,
      lastadventure: 0, lastmining: 0, lastfarming: 0, lasthunting: 0, lastduel: 0, lastrobbery: 0, lastmarriage: 0,
      lastrecover: 0, lastdungeon: 0, lastfishingrod: 0,
      pet: 0, petExp: 0, petLevel: 0, petName: '',
      hunger: 100,
    }
  }

  if (m.isGroup) {
    if (!global.db || !global.db.data) {
       console.error("Database data not initialized for groups.");
    } else if (!global.db.data.groups) {
        global.db.data.groups = {};
    }
    if (!global.db.data.groups[m.chat]) {
        global.db.data.groups[m.chat] = { guild: '', territory: '', resources: {}, wars: 0, alliances: [] };
    }
  }
    
  let user = global.db.data.users[m.sender];
  if (!user) {
      return conn.reply(m.chat, "No se pudieron cargar tus datos de usuario. Intenta de nuevo más tarde.", m);
  }

  let time = user.lastclaim + 86400000
  let _uptime = process.uptime() * 1000

  const helpText = `
╔══════════════════════
║ 🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 🌟
╠══════════════════════
║ ⚔️ *COMANDOS DE ACCIÓN* ⚔️
║
║ ➤ ${usedPrefix}rpg profile
║ ➤ ${usedPrefix}rpg adventure
║ ➤ ${usedPrefix}rpg mine
║ ➤ ${usedPrefix}rpg hunt
║ ➤ ${usedPrefix}rpg farm
║ ➤ ${usedPrefix}rpg fish
║ ➤ ${usedPrefix}rpg craft
║ ➤ ${usedPrefix}rpg sell
║ ➤ ${usedPrefix}rpg buy
║ ➤ ${usedPrefix}rpg shop
║ ➤ ${usedPrefix}rpg recover
║ ➤ ${usedPrefix}rpg eat
║ ➤ ${usedPrefix}rpg dungeon
║ ➤ ${usedPrefix}rpg heal
║ ➤ ${usedPrefix}rpg daily
║
╠══════════════════════
║ 🏆 *SISTEMA SOCIAL* 🏆
║
║ ➤ ${usedPrefix}rpg duel @usuario
║ ➤ ${usedPrefix}rpg rob @usuario
║ ➤ ${usedPrefix}rpg marry @usuario
║ ➤ ${usedPrefix}rpg divorce
║ ➤ ${usedPrefix}rpg family
║ ➤ ${usedPrefix}rpg adopt @usuario
║ ➤ ${usedPrefix}rpg guild
║ ➤ ${usedPrefix}rpg clan
║
╠══════════════════════
║ 🏠 *PROPIEDADES* 🏠
║
║ ➤ ${usedPrefix}rpg buyhouse
║ ➤ ${usedPrefix}rpg buyfarm
║ ➤ ${usedPrefix}rpg workshop
║ ➤ ${usedPrefix}rpg buildshop
║
╠══════════════════════
║ 🐶 *MASCOTAS* 🐱
║
║ ➤ ${usedPrefix}rpg pet
║ ➤ ${usedPrefix}rpg petadopt
║ ➤ ${usedPrefix}rpg petfeed
║ ➤ ${usedPrefix}rpg petstats
║ ➤ ${usedPrefix}rpg petadventure
║
╠══════════════════════
║ 🌐 *MULTIJUGADOR* 🌐
║
║ ➤ ${usedPrefix}rpg createclan
║ ➤ ${usedPrefix}rpg joinclan
║ ➤ ${usedPrefix}rpg leaveclan
║ ➤ ${usedPrefix}rpg clanwar
║ ➤ ${usedPrefix}rpg territory
║ ➤ ${usedPrefix}rpg alliance
║
╠══════════════════════
║ 📜 *HISTORIA Y MISIONES* 📜
║
║ ➤ ${usedPrefix}rpg quest
║ ➤ ${usedPrefix}rpg daily
║ ➤ ${usedPrefix}rpg weekly
║ ➤ ${usedPrefix}rpg story
║ ➤ ${usedPrefix}rpg dungeon
║
╠══════════════════════
║ ✨ *OTROS COMANDOS ÚTILES* ✨
║
║ ➤ ${usedPrefix}rpg menu
║ ➤ ${usedPrefix}rpg menu2
║ ➤ ${usedPrefix}rpg donate
║ ➤ ${usedPrefix}rpg leaderboard
║ ➤ ${usedPrefix}rpg inventory
║ ➤ ${usedPrefix}rpg stats
║ ➤ ${usedPrefix}rpg upgrades
║ ➤ ${usedPrefix}rpg events
║ ➤ ${usedPrefix}rpg tutorial
║ ➤ ${usedPrefix}rpg credits
║
╠══════════════════════
║ ℹ️ *INFO RPG* ℹ️
║ Version: 1.1.0 [BETA]
║ ➤ INFORMACIÓN
╚══════════════════════`

  const helpTextMenu2 = `
╔══════════════════════
║ 🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 - MENÚ 🌟
╠══════════════════════
║ ✨ *OTROS COMANDOS ÚTILES* ✨
║
║ ➤ ${usedPrefix}rpg menu
║ ➤ ${usedPrefix}rpg donate
║ ➤ ${usedPrefix}rpg leaderboard
║ ➤ ${usedPrefix}rpg inventory
║ ➤ ${usedPrefix}rpg stats
║ ➤ ${usedPrefix}rpg upgrades
║ ║ ➤ ${usedPrefix}rpg events
║ ➤ ${usedPrefix}rpg tutorial
║ ➤ ${usedPrefix}rpg credits
║
╠══════════════════════
║ ℹ️ *INFO RPG* ℹ️
║ Version: 1.1.0 [BETA]
║ ➤ INFORMACIÓN
╚══════════════════════`

  const interactiveMessage = {
      header: { title: '🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 By 🩷 Lᥱ Pᥱrrιtᥲ ᥒ᥆ Yūshᥲ 🩷' },
      hasMediaAttachment: false,
      body: { text: `꧁♡༺˖°୨ Bienvenid@ al Sistema RPG Rosadito ୧°˖༻♡꧂

¡Guau guau! Soy tu perrita guía y estoy lista para acompañarte en esta aventura rosada.

*Creadores:* Wirk 👻 y SoyMaycol 🐻‍❄️ _Versión:_ Beta (Prueba)

Selecciona la categoría de comandos que deseas explorar:

✿ Usa los comandos así: ${usedPrefix}rpg [comando]
✿ Ejemplos: ${usedPrefix}rpg adventure | ${usedPrefix}rpg mine | ${usedPrefix}rpg profile` },
      nativeFlowMessage: {
          buttons: [
              {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                      title: '𝐒𝐞𝐥𝐞𝐜𝐜𝐢𝐨𝐧𝐚 𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫í𝐚',
                      sections: [
                          {
                              title: '⚔️ COMANDOS DE ACCIÓN',
                              highlight_label: "Lo Más Popular",
                              rows: [
                                  { title: "│📊│PERFIL RPG", description: "Ver tu perfil con estadísticas, recursos y propiedades", id: `${usedPrefix}rpg profile` },
                                  { title: "│🏕️│AVENTURA", description: "Embárcate en una aventura para conseguir EXP y recursos", id: `${usedPrefix}rpg adventure` },
                                  { title: "│⛏️│MINAR", description: "Mina en busca de piedras preciosas y minerales", id: `${usedPrefix}rpg mine` },
                                  { title: "│🏹│CAZAR", description: "Caza animales para obtener comida y cuero", id: `${usedPrefix}rpg hunt` },
                                  { title: "│🌾│CULTIVAR", description: "Trabaja en tu granja para obtener cultivos y hierbas", id: `${usedPrefix}rpg farm` },
                                  { title: "│🎣│PESCAR", description: "Pesca una variedad de peces para alimento", id: `${usedPrefix}rpg fish` },
                                  { title: "│⚒️│FABRICAR", description: "Convierte recursos básicos en objetos valiosos", id: `${usedPrefix}rpg craft` },
                                  { title: "│💰│VENDER", description: "Vende tus recursos para obtener oro", id: `${usedPrefix}rpg sell` },
                                  { title: "│🛒│COMPRAR", description: "Compra objetos de la tienda", id: `${usedPrefix}rpg buy` },
                                  { title: "│🏪│TIENDA", description: "Compra equipamiento, semillas y otros recursos", id: `${usedPrefix}rpg shop` },
                                  { title: "│⚡│RECUPERAR ENERGÍA", description: "Recupera tu energía para seguir aventurándote", id: `${usedPrefix}rpg recover` },
                                  { title: "│🍎│COMER", description: "Consume comida para reducir el hambre", id: `${usedPrefix}rpg eat` },
                                  { title: "│ dungeon 🏰│MAZMORRA", description: "Explora peligrosas mazmorras en busca de tesoros", id: `${usedPrefix}rpg dungeon` },
                                  { title: "│❤️‍🩹│CURAR", description: "Cura tus heridas gastando oro", id: `${usedPrefix}rpg heal` },
                                  { title: "│📅│RECOMPENSA DIARIA", description: "Reclama tu recompensa diaria", id: `${usedPrefix}rpg daily` }
                              ]
                          },
                          {
                              title: '🏆 SISTEMA SOCIAL',
                              highlight_label: "Multijugador",
                              rows: [
                                  { title: "│⚔️ │DUELO", description: "Desafía a otro jugador a un duelo de habilidades", id: `${usedPrefix}rpg duel` },
                                  { title: "│💰│ROBAR", description: "Intenta robar recursos de otro jugador", id: `${usedPrefix}rpg rob` },
                                  { title: "│💍│MATRIMONIO", description: "Propón matrimonio a otro jugador", id: `${usedPrefix}rpg marry` },
                                  { title: "│💔│DIVORCIO", description: "Termina tu matrimonio actual", id: `${usedPrefix}rpg divorce` },
                                  { title: "│👨‍👩‍👧‍👦│FAMILIA", description: "Gestiona tu familia o adopta a otros jugadores", id: `${usedPrefix}rpg family` },
                                  { title: "│🫂│ADOPTAR", description: "Adopta a otro jugador como tu hijo/a", id: `${usedPrefix}rpg adopt` },
                                  { title: "│🛡️│CLAN", description: "Administra o únete a un clan de guerreros", id: `${usedPrefix}rpg clan` }
                              ]
                          },
                          {
                              title: '🏠 PROPIEDADES Y MASCOTAS',
                              highlight_label: "Gestión",
                              rows: [
                                  { title: "│🏡│COMPRAR CASA", description: "Adquiere o mejora tu vivienda", id: `${usedPrefix}rpg buyhouse` },
                                  { title: "│🌱│COMPRAR GRANJA", description: "Adquiere o mejora tu granja para producir más cultivos", id: `${usedPrefix}rpg buyfarm` },
                                  { title: "│🔨│TALLER", description: "Construye un taller para mejorar el crafteo", id: `${usedPrefix}rpg workshop` },
                                  { title: "│🏪│CONSTRUIR TIENDA", description: "Establece tu propia tienda para vender artículos", id: `${usedPrefix}rpg buildshop` },
                                  { title: "│🐶│MASCOTAS", description: "Gestiona tus mascotas que te ayudan en aventuras", id: `${usedPrefix}rpg pet` },
                                  { title: "│🦊│ADOPTAR MASCOTA", description: "Adopta una nueva mascota para tu aventura", id: `${usedPrefix}rpg petadopt` },
                                  { title: "│🍖│ALIMENTAR MASCOTA", description: "Alimenta a tu mascota para mantenerla feliz y activa", id: `${usedPrefix}rpg petfeed` },
                                  { title: "│🐾│ESTADÍSTICAS DE MASCOTA", description: "Consulta las estadísticas y el nivel de tu mascota", id: `${usedPrefix}rpg petstats` },
                                  { title: "│🗺️│AVENTURA DE MASCOTA", description: "Envía a tu mascota en una aventura para obtener recompensas", id: `${usedPrefix}rpg petadventure` }
                              ]
                          },
                          {
                              title: '🌐 MULTIJUGADOR',
                              highlight_label: "Épico",
                              rows: [
                                  { title: "│➕│CREAR CLAN", description: "Funda tu propio clan de aventureros", id: `${usedPrefix}rpg createclan` },
                                  { title: "│🤝│UNIRSE A CLAN", description: "Solicita unirte a un clan existente", id: `${usedPrefix}rpg joinclan` },
                                  { title: "│🚪│DEJAR CLAN", description: "Abandona tu clan actual", id: `${usedPrefix}rpg leaveclan` },
                                  { title: "│⚔️│GUERRA DE CLANES", description: "Participa en una guerra contra otro clan", id: `${usedPrefix}rpg clanwar` },
                                  { title: "│🗺️│TERRITORIO", description: "Lucha por el control de territorios", id: `${usedPrefix}rpg territory` },
                                  { title: "│🤝│ALIANZA", description: "Forma una alianza con otro clan", id: `${usedPrefix}rpg alliance` }
                              ]
                          },
                          {
                              title: '📜 MISIONES Y ECONOMÍA',
                              highlight_label: "Diario",
                              rows: [
                                  { title: "│📜│MISIONES", description: "Acepta misiones para ganar recompensas especiales", id: `${usedPrefix}rpg quest` },
                                  { title: "│📅│RECOMPENSA DIARIA", description: "Reclama tu recompensa diaria de recursos", id: `${usedPrefix}rpg daily` },
                                  { title: "│🗓️│SEMANAL", description: "Reclama una recompensa mayor cada semana", id: `${usedPrefix}rpg weekly` },
                                  { title: "│📖│HISTORIA", description: "Descubre la historia del mundo RPG", id: `${usedPrefix}rpg story` },
                                  { title: "│ dungeon 🏰│MAZMORRA", description: "Explora peligrosas mazmorras en busca de tesoros", id: `${usedPrefix}rpg dungeon` },
                                  { title: "│🏪│TIENDA", description: "Compra equipamiento, semillas y otros recursos", id: `${usedPrefix}rpg shop` },
                                  { title: "│💰│VENDER", description: "Vende tus recursos para obtener oro", id: `${usedPrefix}rpg sell` },
                                  { title: "│🛒│COMPRAR", description: "Compra objetos de la tienda", id: `${usedPrefix}rpg buy` }
                              ]
                          },
                          {
                              title: '✨ OTROS COMANDOS ÚTILES',
                              highlight_label: "Extras",
                              rows: [
                                  { title: "│ℹ️│MENÚ PRINCIPAL", description: "Mostrar el menú principal de comandos RPG", id: `${usedPrefix}rpg menu` },
                                  { title: "│ℹ️│MENÚ OTROS", description: "Mostrar otros comandos útiles", id: `${usedPrefix}rpg menu2` },
                                  { title: "│🎁│DONAR", description: "Realiza una donación", id: `${usedPrefix}rpg donate` },
                                  { title: "│🏆│TABLA DE CLASIFICACIÓN", description: "Ver la clasificación de los jugadores", id: `${usedPrefix}rpg leaderboard` },
                                  { title: "│🎒│INVENTARIO", description: "Mostrar tu inventario de objetos", id: `${usedPrefix}rpg inventory` },
                                  { title: "│📊│ESTADÍSTICAS", description: "Ver tus estadísticas detalladas", id: `${usedPrefix}rpg stats` },
                                  { title: "│⬆️│MEJORAS", description: "Ver las opciones de mejora disponibles", id: `${usedPrefix}rpg upgrades` },
                                  { title: "│🎉│EVENTOS", description: "Mostrar los eventos actuales", id: `${usedPrefix}rpg events` },
                                  { title: "│❓│TUTORIAL", description: "Mostrar el tutorial del juego RPG", id: `${usedPrefix}rpg tutorial` },
                                  { title: "│📜│CRÉDITOS", description: "Mostrar los créditos del juego", id: `${usedPrefix}rpg credits` },
                              ]
                          }
                      ]
                  })
              }
          ],
          messageParamsJson: ''
      }
  };

  console.log('m.text after button press:', m.text); // Log m.text after a button is pressed
  console.log('args after button press:', args); // Log args after a button is pressed

  let type = (args[0] || '').toLowerCase()

  //━━━━━━━━━[ PROCESAMIENTO DE COMANDOS ]━━━━━━━━━//

  switch (type) {
    case 'menu':
        try {
            console.log('Generating RPG menu for:', m.sender);
            const message = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                        interactiveMessage: interactiveMessage
                    }
                }
            }, { quoted: m });
            await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
            return;
        } catch (error) {
            console.error('Error al generar menu RPG:', error, m);
            return conn.reply(m.chat, helpText, m); // Fallback
        }
        break;

    case 'menu2':
    case 'menuotros':
        return conn.reply(m.chat, helpTextMenu2, m);
        break;

    case 'heal':
    case 'curar':
        if (user.gold < 12) {
            return conn.reply(m.chat, 'No tienes suficiente oro para curarte. (Cuesta 12 de oro)', m);
        }
        if (user.health >= 100) {
            return conn.reply(m.chat, 'Tu salud ya está al máximo.', m);
        }
        user.gold -= 12;
        user.health = 100;
        conn.reply(m.chat, '¡Te has curado completamente! Tu salud ahora es de 100.', m);
        break;

    case 'daily':
    case 'diario':
 const now = new Date().getTime();
        if (user.lastclaim > now - 86400000) { // 24 horas en milisegundos
            const timeRemaining = 86400000 - (now - user.lastclaim);
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            return conn.reply(m.chat, `⏰ Ya has reclamado tu recompensa diaria. Podrás reclamarla de nuevo en ${hours} horas, ${minutes} minutos y ${seconds} segundos.`, m);
        }

        const dailyRewards = {
            gold: 34,
            exp: Math.floor(Math.random() * 150) + 50,
            stone: Math.floor(Math.random() * 3) + 1,
        };

        user.gold += dailyRewards.gold;
        user.exp += dailyRewards.exp;
        user.stone += dailyRewards.stone;
        user.lastclaim = now;

        let dailyMessage = `
🎁 ¡Has reclamado tu recompensa diaria! 🎁

Has recibido:
💰 ${dailyRewards.gold} de oro
✨ ${dailyRewards.exp} de experiencia
🧱 ${dailyRewards.stone} de piedra
`;
        conn.reply(m.chat, dailyMessage, m);
        break;

    case 'profile':
    case 'rpgprofile':
        let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png')
        let expText = `
╔═══════════════════
║ 📊 𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄 𝐉𝐔𝐆𝐀𝐃𝐎𝐑 📊
╠═══════════════════
║ 👤 *Nombre:* ${user.name || 'Indefinido'}
║ 🏅 *Nivel:* ${user.level || 0}
║ ✨ *Experiencia:* ${user.exp || 0}
║ ❤️ *Salud:* ${user.health || 100}/100
║ ⚡ *Energía:* ${user.stamina || 100}/100
║ 🔮 *Maná:* ${user.mana || 20}/20
╠═══════════════════
║ 💰 *Oro:* ${user.gold || 0}
║ 💎 *Diamantes:* ${user.diamond || 0}
║ 🟢 *Esmeraldas:* ${user.emerald || 0}
║ ❤️ *Rubíes:* ${user.ruby || 0}
║ ⚙️ *Hierro:* ${user.iron || 0}
║ 🧱 *Piedra:* ${user.stone || 0}
║ 🪵 *Madera:* ${user.wood || 0}
║ 🧶 *Cuerda:* ${user.string || 0}
║ 🌿 *Hierba:* ${user.herb || 0}
║ 🍎 *Comida:* ${user.food || 0}
║ 🧪 *Poción:* ${user.potion || 0}
║ 🌱 *Semillas:* ${user.seeds || 0}
║ 🌾 *Cultivos:* ${user.crops || 0}
║ 🧥 *Cuero:* ${user.leather || 0}
╠═══════════════════
║ ⚔️ *Fuerza:* ${user.strength || 5}
║ 🏃 *Agilidad:* ${user.agility || 5}
║ 🧠 *Inteligencia:* ${user.intelligence || 5}
║ 🗣️ *Carisma:* ${user.charisma || 5}
║ 💪 *Vitalidad:* ${user.vitality || 5}
╠═══════════════════
║ 🏘️ *Casa:* ${user.house ? 'Nivel ' + user.house : 'No tiene'}
║ 🚜 *Granja:* ${user.farm ? 'Nivel ' + user.farm : 'No tiene'}
║ 🏛️ *Gremio:* ${user.guild || 'No pertenece'}
║ 👨‍👩‍👧‍👦 *Familia:* ${user.family || 'No tiene'}
║ 💍 *Matrimonio:* ${user.marriage || 'Soltero/a'}
╠═══════════════════
║ 🐾 *Mascota:* ${user.pet ? user.petName + ' (Nivel ' + user.petLevel + ')' : 'No tiene'}
║ 😋 *Hambre:* ${user.hunger || 100}/100
╚═══════════════════`
        conn.sendFile(m.chat, pp, 'profile.jpg', expText, m)
        break

    case 'adventure':
    case 'avent ura':
        if (new Date - user.lastadventure < COOLDOWN_ADVENTURE) {
            let timeLeft = COOLDOWN_ADVENTURE - (new Date - user.lastadventure)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de otra aventura.`, m)
        }
        if (user.stamina < 20) {
            return conn.reply(m.chat, `😫 Estás demasiado cansado para ir de aventura. Necesitas recuperar energía. Recupérate con ${usedPrefix}rpg recover`, m)
        }

        let rewardsAdventure = {
            exp: Math.floor(Math.random() * 500) + 100,
            gold: Math.floor(Math.random() * 30) + 10,
            potion: Math.random() < 0.1 ? 1 : 0,
            food: Math.floor(Math.random() * 3) + 1,
        }

        user.lastadventure = new Date * 1
        user.exp += rewardsAdventure.exp
        user.gold += rewardsAdventure.gold
        user.potion += rewardsAdventure.potion
        user.food += rewardsAdventure.food
        user.stamina -= 20

        let adventureText = `
🏞️ ¡Te has embarcado en una aventura! 🏞️

Has ganado:
✨ ${rewardsAdventure.exp} de experiencia
💰 ${rewardsAdventure.gold} de oro
${rewardsAdventure.potion > 0 ? '🧪 1 poción' : ''}
🍎 ${rewardsAdventure.food} de comida

Tu energía actual: ${user.stamina}/100
`
        conn.reply(m.chat, adventureText, m)
        break

    case 'mine':
    case 'minar':
        if (new Date - user.lastmining < COOLDOWN_MINING) {
            let timeLeft = COOLDOWN_MINING - (new Date - user.lastmining)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de minar de nuevo.`, m)
        }
        if (user.stamina < 15) {
            return conn.reply(m.chat, `😫 Estás demasiado cansado para minar. Necesitas recuperar energía. Recupérate con ${usedPrefix}rpg recover`, m)
        }

        let rewardsMine = {
            exp: Math.floor(Math.random() * 400) + 80,
            gold: Math.floor(Math.random() * 25) + 8,
            stone: Math.floor(Math.random() * 5) + 1,
            iron: Math.random() < 0.2 ? Math.floor(Math.random() * 3) + 1 : 0,
            diamond: Math.random() < 0.05 ? 1 : 0,
        }

        user.lastmining = new Date * 1
        user.exp += rewardsMine.exp
        user.gold += rewardsMine.gold
        user.stone += rewardsMine.stone
        user.iron += rewardsMine.iron
        user.diamond += rewardsMine.diamond
        user.stamina -= 15

        let mineText = `
⛏️ ¡Has estado minando diligentemente! ⛏️

Has encontrado:
✨ ${rewardsMine.exp} de experiencia
💰 ${rewardsMine.gold} de oro
🧱 ${rewardsMine.stone} de piedra
${rewardsMine.iron > 0 ? `⚙️ ${rewardsMine.iron} de hierro` : ''}
${rewardsMine.diamond > 0 ? '💎 1 diamante' : ''}

Tu energía actual: ${user.stamina}/100
`
        conn.reply(m.chat, mineText, m)
        break

    case 'hunt':
    case 'cazar':
        if (new Date - user.lasthunting < COOLDOWN_HUNTING) {
            let timeLeft = COOLDOWN_HUNTING - (new Date - user.lasthunting)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a cazar.`, m)
        }
        if (user.stamina < 18) {
            return conn.reply(m.chat, `😫 Estás demasiado cansado para cazar. Necesitas recuperar energía. Recupérate con ${usedPrefix}rpg recover`, m)
        }

        let rewardsHunt = {
            exp: Math.floor(Math.random() * 450) + 90,
            food: Math.floor(Math.random() * 4) + 1,
            leather: Math.random() < 0.3 ? 1 : 0,
            wood: Math.random() < 0.15 ? Math.floor(Math.random() * 2 ) + 1 : 0,
        }

        user.lasthunting = new Date * 1
        user.exp += rewardsHunt.exp
        user.food += rewardsHunt.food
        user.leather += rewardsHunt.leather
        user.wood += rewardsHunt.wood
        user.stamina -= 18

        let huntText = `
🏹 ¡Has salido de cacería! 🏹

Has obtenido:
✨ ${rewardsHunt.exp} de experiencia
🍎 ${rewardsHunt.food} de comida
${rewardsHunt.leather > 0 ? '🧥 1 de cuero' : ''}
${rewardsHunt.wood > 0 ? `🪵 ${rewardsHunt.wood} de madera` : ''}

Tu energía actual: ${user.stamina}/100
`
        conn.reply(m.chat, huntText, m)
        break

    case 'farm':
    case 'cultivar':
        if (new Date - user.lastfarming < COOLDOWN_FARMING) {
            let timeLeft = COOLDOWN_FARMING - (new Date - user.lastfarming)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a cultivar.`, m)
        }
        if (user.stamina < 12) {
            return conn.reply(m.chat, `😫 Estás demasiado cansado para cultivar. Necesitas recuperar energía. Recupérate con ${usedPrefix}rpg recover`, m)
        }

        let rewardsFarm = {
            exp: Math.floor(Math.random() * 350) + 70,
            food: Math.floor(Math.random() * 5) + 2,
            herb: Math.random() < 0.4 ? 1 : 0,
            seeds: Math.random() < 0.2 ? 1 : 0,
            crops: Math.floor(Math.random() * 3) + 1,
        }

        user.lastfarming = new Date * 1
        user.exp += rewardsFarm.exp
        user.food += rewardsFarm.food
        user.herb += rewardsFarm.herb
        user.seeds += rewardsFarm.seeds
        user.crops += rewardsFarm.crops
        user.stamina -= 12

        let farmText = `
🌾 ¡Has estado trabajando en la granja! 🌾

Has cosechado:
✨ ${rewardsFarm.exp} de experiencia
🍎 ${rewardsFarm.food} de comida
${rewardsFarm.herb > 0 ? '🌿 1 hierba' : ''}
${rewardsFarm.seeds > 0 ? '🌱 1 semilla' : ''}
🌾 ${rewardsFarm.crops} cultivos

Tu energía actual: ${user.stamina}/100
`
        conn.reply(m.chat, farmText, m)
        break

    case 'fish':
    case 'pescar':
        if (new Date - user.lastfishingrod < COOLDOWN_FARMING) {
            let timeLeft = COOLDOWN_FARMING - (new Date - user.lastfishingrod)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a pescar.`, m)
        }
        if (user.stamina < 10) {
            return conn.reply(m.chat, `😫 Estás demasiado cansado para pescar. Necesitas recuperar energía. Recupérate con ${usedPrefix}rpg recover`, m)
        }

        let rewardsFish = {
            exp: Math.floor(Math.random() * 300) + 60,
            food: Math.floor(Math.random() * 4) + 1,
            gold: Math.random() < 0.1 ? Math.floor(Math.random() * 10) + 1 : 0,
        }

        user.lastfishingrod = new Date * 1
        user.exp += rewardsFish.exp
        user.food += rewardsFish.food
        user.gold += rewardsFish.gold
        user.stamina -= 10

        let fishText = `
🎣 ¡Has ido a pescar! 🎣

Has pescado:
✨ ${rewardsFish.exp} de experiencia
🍎 ${rewardsFish.food} de comida
${rewardsFish.gold > 0 ? `💰 ${rewardsFish.gold} de oro` : ''}

Tu energía actual: ${user.stamina}/100
`
        conn.reply(m.chat, fishText, m)
        break

    case 'recover':
    case 'recuperar':
        if (new Date - user.lastrecover < COOLDOWN_RECOVER) {
            let timeLeft = COOLDOWN_RECOVER - (new Date - user.lastrecover)
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de recuperar energía de nuevo.`, m);
        }
        if (user.health >= 100 && user.stamina >= 100) {
            return conn.reply(m.chat, '🧘 Tu salud y energía ya están al máximo.', m);
        }
        if (user.health < 100) {
            user.health = 100;
            conn.reply(m.chat, '❤️ Has recuperado toda tu salud.', m);
        }
        if (user.stamina < 100) {
            user.stamina = 100;
            conn.reply(m.chat, '⚡ Has recuperado toda tu energía.', m);
        }
        user.lastrecover = new Date * 1;
        break;

    case 'eat':
    case 'comer':
        if (user.food <= 0) return conn.reply(m.chat, 'No tienes suficiente comida para comer.', m);
        if (user.hunger >= 100) return conn.reply(m.chat, 'Ya no tienes hambre.', m);

        let eatAmount = Math.min(10, user.food); // Consume hasta 10 de comida
        user.food -= eatAmount;
        user.hunger = Math.min(100, user.hunger + (eatAmount * 15)); // Aumenta el hambre en 15 por cada comida consumida
        conn.reply(m.chat, `Has comido ${eatAmount} de comida. Tu hambre ahora es de ${user.hunger}/100.`, m);
        break;

    case 'dungeon':
    case 'mazmorra':
        if (new Date - user.lastdungeon < COOLDOWN_DUNGEON) {
            let timeLeft = COOLDOWN_DUNGEON - (new Date - user.lastdungeon);
            return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de entrar a otra mazmorra.`, m);
        }
        if (user.stamina < STAMINA_DUNGEON_COST) {
            return conn.reply(m.chat, `😫 No tienes suficiente energía para entrar a la mazmorra. Necesitas ${STAMINA_DUNGEON_COST} de energía, pero tienes ${user.stamina}. Recupérate con ${usedPrefix}rpg recover`, m);
        }

        user.lastdungeon = new Date * 1;
        user.stamina -= STAMINA_DUNGEON_COST;

        let rewardsDungeon = {
            exp: Math.floor(Math.random() * 800) + 200,
            gold: Math.floor(Math.random() * 50) + 20,
            diamond: Math.random() < 0.1 ? 1 : 0,
            potion: Math.random() < 0.2 ? 1 : 0,
            emerald: Math.random() < 0.05 ? 1 : 0,
        };

        user.exp += rewardsDungeon.exp;
        user.gold += rewardsDungeon.gold;
        user.diamond += rewardsDungeon.diamond;
        user.potion += rewardsDungeon.potion;
        user.emerald += rewardsDungeon.emerald;

        let dungeonText = `
🏰 ¡Has entrado en una mazmorra oscura y peligrosa! 🏰

Después de explorar, has encontrado:
✨ ${rewardsDungeon.exp} de experiencia
💰 ${rewardsDungeon.gold} de oro
${rewardsDungeon.diamond > 0 ? '💎 1 diamante' : ''}
${rewardsDungeon.potion > 0 ? '🧪 1 poción' : ''}
${rewardsDungeon.emerald > 0 ? '🟢 1 esmeralda' : ''}

Tu energía actual: ${user.stamina}/100
`;
        conn.reply(m.chat, dungeonText, m);
        break;

    // Comandos de Acción
    case 'craft':
    case 'fabricar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Fabricar) aún no está implementado.`, m);
        break;
    case 'sell':
    case 'vender':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Vender) aún no está implementado.`, m);
        break;
    case 'buy':
    case 'comprar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Comprar) aún no está implementado.`, m);
        break;
    case 'shop':
    case 'tienda':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Tienda) aún no está implementado.`, m);
        break;

    // Sistema Social
    case 'duel':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Duelo) aún no está implement ado.`, m);
        break;
    case 'rob':
    case 'robar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Robar) aún no está implementado.`, m);
        break;
    case 'marry':
    case 'matrimonio':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Matrimonio) aún no está implementado.`, m);
        break;
    case 'divorce':
    case 'divorciar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Divorcio) aún no está implementado.`, m);
        break;
    case 'family':
    case 'familia':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Familia) aún no está implementado.`, m);
        break;
    case 'adopt':
    case 'adoptar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Adoptar) aún no está implementado.`, m);
        break;
    case 'guild':
    case 'clan':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Clan/Gremio) aún no está implementado.`, m);
        break;

    // Propiedades y Mascotas
    case 'buyhouse':
    case 'comprarcasa':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Comprar Casa) aún no está implementado.`, m);
        break;
    case 'buyfarm':
    case 'comprargranja':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Comprar Granja) aún no está implementado.`, m);
        break;
    case 'workshop':
    case 'taller':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Taller) aún no está implementado.`, m);
        break;
    case 'buildshop':
    case 'construirtienda':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Construir Tienda) aún no está implementado.`, m);
        break;
    case 'pet':
    case 'mascota':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Mascotas) aún no está implementado.`, m);
        break;
    case 'petadopt':
    case 'adoptarmascota':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Adoptar Mascota) aún no está implementado.`, m);
        break;
    case 'petfeed':
    case 'alimentarmascota':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Alimentar Mascota) aún no está implementado.`, m);
        break;
    case 'petstats':
    case 'estadisticasmascota':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Estadísticas de Mascota) aún no está implementado.`, m);
        break;
    case 'petadventure':
    case 'aventuramascota':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Aventura de Mascota) aún no está implementado.`, m);
        break;

    // Multijugador
    case 'createclan':
    case 'crearclan':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Crear Clan) aún no está implementado.`, m);
        break;
    case 'joinclan':
    case 'unirseaclan':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Unirse a Clan) aún no está implementado.`, m);
        break;
    case 'leaveclan':
    case 'dejarclan':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Dejar Clan) aún no está implementado.`, m);
        break;
    case 'clanwar':
    case 'guerraclan':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Guerra de Clanes) aún no está implementado.`, m);
        break;
    case 'territory':
    case 'territorio':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Territorio) aún no está implementado.`, m);
        break;
    case 'alliance':
    case 'alianza':
        conn.reply(m.chat, `El comando "${usedPrefix}r pg ${type}" (Alianza) aún no está implementado.`, m);
        break;

    // Misiones y Economía
    case 'quest':
    case 'misiones':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Misiones) aún no está implementado.`, m);
        break;
    case 'weekly':
    case 'semanal':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Recompensa Semanal) aún no está implementado.`, m);
        break;
    case 'story':
    case 'historia':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Historia) aún no está implementado.`, m);
        break;

    // Otros Comandos Útiles
    case 'donate':
    case 'donar':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Donar) aún no está implementado.`, m);
        break;
    case 'leaderboard':
    case 'tablaclasificacion':
    case 'ranking':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Tabla de Clasificación) aún no está implementado.`, m);
        break;
    case 'inventory':
    case 'inventario':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Inventario) aún no está implementado.`, m);
        break;
    case 'stats':
    case 'estadisticas':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Estadísticas) aún no está implementado.`, m);
        break;
    case 'upgrades':
    case 'mejoras':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Mejoras) aún no está implementado.`, m);
        break;
    case 'events':
    case 'eventos':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Eventos) aún no está implementado.`, m);
        break;
    case 'tutorial':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Tutorial) aún no está implementado.`, m);
        break;
    case 'credits':
    case 'creditos':
        conn.reply(m.chat, `El comando "${usedPrefix}rpg ${type}" (Créditos) aún no está implementado.`, m);
        break;

    default:
      if (args[0]) {
        conn.reply(m.chat, `Comando RPG no reconocido: "${usedPrefix}rpg ${args[0]}"\nUsa "${usedPrefix}rpg" para ver el menú de comandos.`, m);
      } else {
         console.log("Reached final default case without args[0], unexpectedly.");
         conn.reply(m.chat, helpText, m); // Fallback to sending help text
      }
  }
}

handler.help = ['rpg', 'rpg <comando>']
handler.tags = ['fun']
handler.command = ['rpg']

export default handler;
