import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  console.log('RPG command received:', m.sender); // Log when the command is received
  // Verificar si el comando principal es 'rpg'
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
  const COOLDOWN_RECOVER = 60 * 60 * 1000 // 1 hora para recuperar energía
  const COOLDOWN_DUNGEON = 15 * 60 * 1000 // 15 minutos para entrar a la mazmorra
  const STAMINA_DUNGEON_COST = 30; // Costo de energía para entrar a la mazmorra
  const HUNGER_THRESHOLD = 20; // Umbral de hambre para empezar a perder energía

  //━━━━━━━━━[ VERIFICACIÓN DE BASES DE DATOS ]━━━━━━━━━//

  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      // Datos básicos
      exp: 0, limit: 10, lastclaim: 0, registered: false, name: conn.getName(m.sender),
      // RPG - Recursos
      health: 100, stamina: 100, mana: 20,
      gold: 50, diamond: 0, emerald: 0, ruby: 0, iron: 0, stone: 0, wood: 0, leather: 0, string: 0,
      herb: 0, food: 5, potion: 1, seeds: 0, crops: 0,
      // RPG - Equipamiento
      weapon: 0, armor: 0, pickaxe: 0, axe: 0, fishingrod: 0,
      // RPG - Habilidades
      strength: 5, agility: 5, intelligence: 5, charisma: 5, vitality: 5,
      // RPG - Estadísticas
      level: 0, kills: 0, deaths: 0, wins: 0, losses: 0,
      // RPG - Social
      reputation: 0, guild: '', clan: '', family: '', marriage: '', children: [],
      // RPG - Propiedad
      house: 0, farm: 0, barn: 0, workshop: 0, shop: 0,
      // RPG - Temporizado
      lastadventure: 0, lastmining: 0, lastfarming: 0, lasthunting: 0, lastduel: 0, lastrobbery: 0, lastmarriage: 0,
      lastrecover: 0, lastdungeon: 0,
      // RPG - Mascotas
      pet: 0, petExp: 0, petLevel: 0, petName: '',
      // RPG - Hambre
      hunger: 100,

      // Asegurándonos de que todos los campos del perfil estén inicializados
      ruby: 0,
      wood: 0,
      string: 0,
      herb: 0,
      potion: 0,
      seeds: 0,
      crops: 0,
      leather: 0,
      strength: 5,
      agility: 5,
      intelligence: 5,
      charisma: 5,
      vitality: 5,
      house: 0,
      farm: 0,
      pet: 0,
      petExp: 0,
      petLevel: 0,
      petName: '',
    }
  }

  if (m.isGroup) {
    if (!global.db.data.groups) global.db.data.groups = {}
    if (!global.db.data.groups[m.chat]) global.db.data.groups[m.chat] = { guild: '', territory: '', resources: {}, wars: 0, alliances: [] }
  }

  //━━━━━━━━━[ MENSAJES DE AYUDA ]━━━━━━━━━//

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
║ ℹ️ *INFO RPG* ℹ️
║
║ ➤ INFORMACIÓN
╚══════════════════════`

  //━━━━━━━━━[ PROCESAMIENTO DE COMANDOS ]━━━━━━━━━//

  let user = global.db.data.users[m.sender]
  let time = user.lastclaim + 86400000
  let _uptime = process.uptime() * 1000

  // Comando principal y su procesamiento
  if (!args[0]) {
    try {
      console.log('Generating RPG menu for:', m.sender); // Log before generating the menu
      const interactiveMessage = {
        header: { title: '🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 By 🩷 Lᥱ Pᥱrrιtᥲ ᥒ᥆ Yūshᥲ 🩷' },
        hasMediaAttachment: false,
        body: { text: `꧁♡༺˖°୨ Bienvenid@ al Sistema RPG Rosadito ୧°˖༻♡꧂

¡Guau guau! Soy tu perrita guía y estoy lista para acompañarte en esta aventura rosada.
Selecciona la categoría de comandos que deseas explorar:

✿ Usa los comandos así: ${usedPrefix}rpg [comando]
✿ Ejemplos: ${usedPrefix}rpg adventure | ${usedPrefix}rpg mine | ${usedPrefix}rpg profile

૮₍｡• – •｡₎ა  ¡A mover la colita, aventurer@! Grandes desafíos (y premios kawaii) te esperan.` },
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
                      {
                        title: "│📊│PERFIL RPG",
                        description: "Ver tu perfil con estadísticas, recursos y propiedades",
                        id: `${usedPrefix}rpg profile`
                      },
                      {
                        title: "│🏕️│AVENTURA",
                        description: "Embárcate en una aventura para conseguir EXP y recursos",
                        id: `${usedPrefix}rpg adventure`
                      },
                      {
                        title: "│⛏️│MINAR",
                        description: "Mina en busca de piedras preciosas y minerales",
                        id: `${usedPrefix}rpg mine`
                      },
                      {
                        title: "│🏹│CAZAR",
                        description: "Caza animales para obtener comida y cuero",
                        id: `${usedPrefix}rpg hunt`
                      },
                      {
                        title: "│🌾│CULTIVAR",
                        description: "Trabaja en tu granja para obtener cultivos y hierbas",
                        id: `${usedPrefix}rpg farm`
                      },
                      {
                        title: "│🎣│PESCAR",
                        description: "Pesca una variedad de peces para alimento",
                        id: `${usedPrefix}rpg fish`
                      },
                      {
                        title: "│⚒️│FABRICAR",
                        description: "Convierte recursos básicos en objetos valiosos",
                        id: `${usedPrefix}rpg craft`
                      },
                      {
                        title: "│⚡│RECUPERAR ENERGÍA",
                        description: "Recupera tu energía para seguir aventurándote",
                        id: `${usedPrefix}rpg recover`
                      },
                      {
                        title: "│🍎│COMER",
                        description: "Consume comida para reducir el hambre",
                        id: `${usedPrefix}rpg eat`
                      },
                      {
                        title: "│ dungeon 🏰│MAZMORRA",
                        description: "Explora peligrosas mazmorras en busca de tesoros",
                        id: `${usedPrefix}rpg dungeon`
                      }
                    ]
                  },
                  {
                    title: '🏆 SISTEMA SOCIAL',
                    highlight_label: "Multijugador",
                    rows: [
                      {
                        title: "│⚔️│DUELO",
                        description: "Desafía a otro jugador a un duelo de habilidades",
                        id: `${usedPrefix}rpg duel`
                      },
                      {
                        title: "│💰│ROBAR",
                        description: "Intenta robar recursos de otro jugador",
                        id: `${usedPrefix}rpg rob`
                      },
                      {
                        title: "│💍│MATRIMONIO",
                        description: "Propón matrimonio a otro jugador",
                        id: `${usedPrefix}rpg marry`
                      },
                      {
                        title: "│💔│DIVORCIO",
                        description: "Termina tu matrimonio actual",
                        id: `${usedPrefix}rpg divorce`
                      },
                      {
                        title: "│👨‍👩‍👧‍👦│FAMILIA",
                        description: "Gestiona tu familia o adopta a otros jugadores",
                        id: `${usedPrefix}rpg family`
                      },
                      {
                        title: "│🫂│ADOPTAR",
                        description: "Adopta a otro jugador como tu hijo/a",
                        id: `${usedPrefix}rpg adopt`
                      },
                      {
                        title: "│🛡️│CLAN",
                        description: "Administra o únete a un clan de guerreros",
                        id: `${usedPrefix}rpg clan`
                      }
                    ]
                  },
                  {
                    title: '🏠 PROPIEDADES Y MASCOTAS',
                    highlight_label: "Gestión",
                    rows: [
                      {
                        title: "│🏡│COMPRAR CASA",
                        description: "Adquiere o mejora tu vivienda",
                        id: `${usedPrefix}rpg buyhouse`
                      },
                      {
                        title: "│🌱│COMPRAR GRANJA",
                        description: "Adquiere o mejora tu granja para producir más cultivos",
                        id: `${usedPrefix}rpg buyfarm`
                      },
                      {
                        title: "│🔨│TALLER",
                        description: "Construye un taller para mejorar el crafteo",
                        id: `${usedPrefix}rpg workshop`
                      },
                      {
                        title: "│🏪│CONSTRUIR TIENDA",
                        description: "Establece tu propia tienda para vender artículos",
                        id: `${usedPrefix}rpg buildshop`
                      },
                      {
                        title: "│🐶│MASCOTAS",
                        description: "Gestiona tus mascotas que te ayudan en aventuras",
                        id: `${usedPrefix}rpg pet`
                      },
                      {
                        title: "│🦊│ADOPTAR MASCOTA",
                        description: "Adopta una nueva mascota para tu aventura",
                        id: `${usedPrefix}rpg petadopt`
                      },
                      {
                        title: "│🍖│ALIMENTAR MASCOTA",
                        description: "Alimenta a tu mascota para mantenerla feliz y activa",
                        id: `${usedPrefix}rpg petfeed`
                      },
                      {
                        title: "│🐾│ESTADÍSTICAS DE MASCOTA",
                        description: "Consulta las estadísticas y el nivel de tu mascota",
                        id: `${usedPrefix}rpg petstats`
                      },
                      {
                        title: "│🗺️│AVENTURA DE MASCOTA",
                        description: "Envía a tu mascota en una aventura para obtener recompensas",
                        id: `${usedPrefix}rpg petadventure`
                      }
                    ]
                  },
                  {
                    title: '🌐 MULTIJUGADOR',
                    highlight_label: "Épico",
                    rows: [
                      {
                        title: "│➕│CREAR CLAN",
                        description: "Funda tu propio clan de aventureros",
                        id: `${usedPrefix}rpg createclan`
                      },
                      {
                        title: "│🤝│UNIRSE A CLAN",
                        description: "Solicita unirte a un clan existente",
                        id: `${usedPrefix}rpg joinclan`
                      },
                      {
                        title: "│🚪│DEJAR CLAN",
                        description: "Abandona tu clan actual",
                        id: `${usedPrefix}rpg leaveclan`
                      },
                      {
                        title: "│⚔️│GUERRA DE CLANES",
                        description: "Participa en una guerra contra otro clan",
                        id: `${usedPrefix}rpg clanwar`
                      },
                      {
                        title: "│🗺️│TERRITORIO",
                        description: "Lucha por el control de territorios",
                        id: `${usedPrefix}rpg territory`
                      },
                      {
                        title: "│🤝│ALIANZA",
                        description: "Forma una alianza con otro clan",
                        id: `${usedPrefix}rpg alliance`
                      }
                    ]
                  },
                  {
                    title: '📜 MISIONES Y ECONOMÍA',
                    highlight_label: "Diario",
                    rows: [
                      {
                        title: "│📜│MISIONES",
                        description: "Acepta misiones para ganar recompensas especiales",
                        id: `${usedPrefix}rpg quest`
                      },
                      {
                        title: "│📅│DIARIO",
                        description: "Reclama tu recompensa diaria de recursos",
                        id: `${usedPrefix}rpg daily`
                      },
                      {
                        title: "│🗓️│SEMANAL",
                        description: "Reclama una recompensa mayor cada semana",
                        id: `${usedPrefix}rpg weekly`
                      },
                      {
                        title: "│📖│HISTORIA",
                        description: "Descubre la historia del mundo RPG",
                        id: `${usedPrefix}rpg story`
                      },
                      {
                        title: "│ dungeon 🏰│MAZMORRA",
                        description: "Explora peligrosas mazmorras en busca de tesoros",
                        id: `${usedPrefix}rpg dungeon`
                      },
                      {
                        title: "│🏪│TIENDA",
                        description: "Compra equipamiento, semillas y otros recursos",
                        id: `${usedPrefix}rpg shop`
                      },
                      {
                        title: "│💰│VENDER",
                        description: "Vende tus recursos para obtener oro",
                        id: `${usedPrefix}rpg sell`
                      },
                      {
                        title: "│🛒│COMPRAR",
                        description: "Compra objetos de la tienda",
                        id: `${usedPrefix}rpg buy`
                      }
                    ]
                  },
                  {
                    title: 'ℹ️ INFO RPG',
                    highlight_label: "Acerca del RPG",
                    rows: [
                      {
                        title: "INFORMACIÓN",
                        description: "Información sobre los desarrolladores",
                        id: `rpg_info` // Cambiando el ID temporalmente
                      }
                    ]
                  }
                ]
              })
            }
          ],
          messageParamsJson: ''
        }
      };

      const message = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: interactiveMessage
          }
        }
      }, {
        quoted: m
      });

      await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
      return;
    } catch (error) {
      console.error('Error al generar menu RPG:', error, m); // Log error and m object
      if (m.text === 'rpg_info') { // Cambiando también aquí el ID para la prueba
        console.log('Sending creators info to:', m.sender); // Log before sending creators info
        return conn.reply(m.chat, 'Creadores: Wirk y Maycol 👻 Versión: Beta', m);
      }
      return conn.reply(m.chat, helpText, m); // Fallback al texto de ayuda normal
    }
  }

  let type = (args[0] || '').toLowerCase()

  if (m.text === 'rpg_info') { // Cambiando también aquí el ID para la prueba
    return conn.reply(m.chat, 'Creadores: Wirk y Maycol 👻 Versión: Beta', m);
  }

  //━━━━━━━━━[ IMPLEMENTACIÓN DE COMANDOS ]━━━━━━━━━//

  switch(type) {
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

    // ... (rest of your command implementations) ...

    default:
      if (args[0]) {
        conn.reply(m.chat, `❓ Acción "${type}" no reconocida. Usa ${usedPrefix}rpg para ver la lista de comandos.`, m)
      }
  }
}

handler.help = ['rpg <acción>']
handler.tags = ['fun']
handler.command = ['rpg']

export default handler
