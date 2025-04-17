import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {

  // RPG-Ultra V3 - Sistema de Juego de Rol Avanzado

  //━━━━━━━━━[ CONSTANTES GLOBALES ]━━━━━━━━━//

  const COOLDOWN_MINING = 5 * 60 * 1000 // 5 minutos
  const COOLDOWN_FARMING = 3 * 60 * 1000 // 3 minutos
  const COOLDOWN_HUNTING = 4 * 60 * 1000 // 4 minutos
  const COOLDOWN_ADVENTURE = 10 * 60 * 1000 // 10 minutos
  const COOLDOWN_DUEL = 30 * 60 * 1000 // 30 minutos
  const COOLDOWN_ROBBERY = 60 * 60 * 1000 // 1 hora
  const COOLDOWN_MARRIAGE = 24 * 60 * 60 * 1000 // 24 horas

  //━━━━━━━━━[ VERIFICACIÓN DE BASES DE DATOS ]━━━━━━━━━//

  // Asegúrese de que la base de datos de usuario exista
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
      // RPG - Mascotas
      pet: 0, petExp: 0, petLevel: 0, petName: '',
    }
  }

  // Asegúrese de que la base de datos de grupos exista
  if (m.isGroup) {
    if (!global.db.data.groups) {
      global.db.data.groups = {}
    }
    if (!global.db.data.groups[m.chat]) {
      global.db.data.groups[m.chat] = {
        // Datos de grupo para RPG
        guild: '', territory: '', resources: {}, wars: 0, alliances: []
      }
    }
  }

  //━━━━━━━━━[ MENSAJES DE AYUDA ]━━━━━━━━━//

  const helpText = `
╔══════════════════════
║ 🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 🌟
╠══════════════════════
║ ⚔️ *COMANDOS DE ACCIÓN* ⚔️
║
║ ➤ ${usedPrefix}rpgprofile
║ ➤ ${usedPrefix}adventure
║ ➤ ${usedPrefix}mine
║ ➤ ${usedPrefix}hunt
║ ➤ ${usedPrefix}farm
║ ➤ ${usedPrefix}fish
║ ➤ ${usedPrefix}craft
║ ➤ ${usedPrefix}sell
║ ➤ ${usedPrefix}buy
║ ➤ ${usedPrefix}shop
║
╠══════════════════════
║ 🏆 *SISTEMA SOCIAL* 🏆
║
║ ➤ ${usedPrefix}duel @usuario
║ ➤ ${usedPrefix}rob @usuario
║ ➤ ${usedPrefix}marry @usuario
║ ➤ ${usedPrefix}divorce
║ ➤ ${usedPrefix}family
║ ➤ ${usedPrefix}adopt @usuario
║ ➤ ${usedPrefix}guild
║ ➤ ${usedPrefix}clan
║
╠══════════════════════
║ 🏠 *PROPIEDADES* 🏠
║
║ ➤ ${usedPrefix}buyhouse
║ ➤ ${usedPrefix}buyfarm
║ ➤ ${usedPrefix}workshop
║ ➤ ${usedPrefix}buildshop
║
╠══════════════════════
║ 🐶 *MASCOTAS* 🐱
║
║ ➤ ${usedPrefix}pet
║ ➤ ${usedPrefix}petadopt
║ ➤ ${usedPrefix}petfeed
║ ➤ ${usedPrefix}petstats
║ ➤ ${usedPrefix}petadventure
║
╠══════════════════════
║ 🌐 *MULTIJUGADOR* 🌐
║
║ ➤ ${usedPrefix}createclan
║ ➤ ${usedPrefix}joinclan
║ ➤ ${usedPrefix}leaveclan
║ ➤ ${usedPrefix}clanwar
║ ➤ ${usedPrefix}territory
║ ➤ ${usedPrefix}alliance
║
╠══════════════════════
║ 📜 *HISTORIA Y MISIONES* 📜
║
║ ➤ ${usedPrefix}quest
║ ➤ ${usedPrefix}daily
║ ➤ ${usedPrefix}weekly
║ ➤ ${usedPrefix}story
║ ➤ ${usedPrefix}dungeon
║
║ Hecho Por SoyMaycol
║ +51 921 826 291
╚══════════════════════`

  //━━━━━━━━━[ PROCESAMIENTO DE COMANDOS ]━━━━━━━━━//

  let user = global.db.data.users[m.sender]
  let time = user.lastclaim + 86400000
  let _uptime = process.uptime() * 1000

  // Comando principal y su procesamiento
  if (!args[0]) {
    try {
      // Creación de la lista interactiva de comandos RPG
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
                        title: "│ dungeon │MAZMORRA",
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
      console.error('Error al generar menu RPG:', error);
      return conn.reply(m.chat, helpText, m); // Fallback al texto de ayuda normal
    }
  }

  let type = (args[0] || '').toLowerCase()

  //━━━━━━━━━[ IMPLEMENTACIÓN DE COMANDOS ]━━━━━━━━━//

  switch(type) {
    // Perfil RPG del jugador
    case 'profile':
    case 'rpgprofile':
      let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png')
      let expText = `
╔═══════════════════
║ 📊 𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄 𝐉𝐔𝐆𝐀𝐃𝐎𝐑 📊
╠═══════════════════
║ 👤 *Nombre:* ${user.name}
║ 🏅 *Nivel:* ${user.level}
║ ✨ *Experiencia:* ${user.exp}
║ ❤️ *Salud:* ${user.health}/100
║ ⚡ *Energía:* ${user.stamina}/100
║ 🔮 *Maná:* ${user.mana}/20
╠═══════════════════
║ 💰 *Oro:* ${user.gold}
║ 💎 *Diamantes:* ${user.diamond}
║ 🟢 *Esmeraldas:* ${user.emerald}
║ ❤️ *Rubíes:* ${user.ruby}
║ ⚙️ *Hierro:* ${user.iron}
║ 🧱 *Piedra:* ${user.stone}
║ 🪵 *Madera:* ${user.wood}
║ 🧶 *Cuerda:* ${user.string}
║ 🌿 *Hierba:* ${user.herb}
║ 🍎 *Comida:* ${user.food}
║ 🧪 *Poción:* ${user.potion}
║ 🌱 *Semillas:* ${user.seeds}
║ 🌾 *Cultivos:* ${user.crops}
║ 🧥 *Cuero:* ${user.leather}
╠═══════════════════
║ ⚔️ *Fuerza:* ${user.strength}
║ 🏃 *Agilidad:* ${user.agility}
║ 🧠 *Inteligencia:* ${user.intelligence}
║ 🗣️ *Carisma:* ${user.charisma}
║ 💪 *Vitalidad:* ${user.vitality}
╠═══════════════════
║ 🏘️ *Casa:* ${user.house ? 'Nivel ' + user.house : 'No tiene'}
║ 🚜 *Granja:* ${user.farm ? 'Nivel ' + user.farm : 'No tiene'}
║ 🏛️ *Gremio:* ${user.guild || 'No pertenece'}
║ 👨‍👩‍👧‍👦 *Familia:* ${user.family || 'No tiene'}
║ 💍 *Matrimonio:* ${user.marriage || 'Soltero/a'}
╠═══════════════════
║ 🐾 *Mascota:* ${user.pet ? user.petName + ' (Nivel ' + user.petLevel + ')' : 'No tiene'}
╚═══════════════════`
      conn.sendFile(m.chat, pp, 'profile.jpg', expText, m)
      break

    // Sistema de aventuras
    case 'adventure':
    case 'aventura':
      if (new Date - user.lastadventure < COOLDOWN_ADVENTURE) {
        let timeLeft = COOLDOWN_ADVENTURE - (new Date - user.lastadventure)
        return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de otra aventura.`, m)
      }

      let rewards = {
        exp: Math.floor(Math.random() * 500) + 100,
        gold: Math.floor(Math.random() * 200) + 50,
        items: []
      }

      // Calcular probabilidades de encuentros
      let encounter = Math.random()
      let encounterText = ''

      if (encounter < 0.1) {
        // Encuentro peligroso - Dragon
        encounterText = `🐉 *¡Te has encontrado con un Dragón Ancestral!*\n\n`
        let success = (user.strength + user.agility + user.intelligence) > 30 || Math.random() < 0.3

        if (success) {
          encounterText += `Con gran valentía y estrategia, has logrado derrotar al Dragón. Entre sus tesoros encuentras:`
          rewards.exp += 1000
          rewards.gold += 800
          rewards.items.push('💎 5 Diamantes')
          rewards.items.push('❤️ 3 Rubíes')
          user.diamond += 5
          user.ruby += 3
        } else {
          encounterText += `El Dragón era demasiado fuerte. Has logrado escapar, pero con graves heridas.`
          user.health -= 50
          if (user.health < 0) user.health = 1
          rewards.exp = Math.floor(rewards.exp / 3)
          rewards.gold = Math.floor(rewards.gold / 4)
        }
      } else if (encounter < 0.3) {
        // Encuentro neutral - Mercader
        encounterText = `🧙‍♂️ *Te encuentras con un mercader místico*\n\n`
        encounterText += `Te ofrece un intercambio justo por tus habilidades. A cambio de ayudarlo a cruzar el bosque peligroso, te recompensa con:`
        rewards.exp += 200
        rewards.items.push('🧪 2 Pociones')
        user.potion += 2
      } else if (encounter < 0.6) {
        // Encuentro beneficioso - Cofre del tesoro
        encounterText = `🏆 *¡Has encontrado un antiguo cofre del tesoro!*\n\n`
        encounterText += `Al abrirlo descubres un botín espléndido:`
        rewards.gold += 300
        rewards.items.push('🟢 2 Esmeraldas')
        rewards.items.push('🧩 Fragmento de mapa') // Ejemplo de un objeto único
        user.emerald += 2
        // Aquí podrías añadir lógica para un objeto único o una misión relacionada
      } else {
        // Encuentro común - Monstruos
        encounterText = `👾 *Te has adentrado en un nido de monstruos*\n\n`
        encounterText += `Después de una ardua batalla, logras salir victorioso. Recolectas:`
        rewards.items.push('🧶 5 Cuerdas')
        rewards.items.push('🧱 3 Piedras')
        rewards.items.push('🥩 2 Comidas')
        user.string += 5
        user.stone += 3
        user.food += 2
      }

      // Actualizar datos de usuario
      user.exp += rewards.exp
      user.gold += rewards.gold
      user.lastadventure = new Date

      // Construir mensaje de recompensa
      let rewardText = `
${encounterText}

*🎁 Recompensas obtenidas:*
✨ ${rewards.exp} EXP
💰 ${rewards.gold} Oro
${rewards.items.map(item => `• ${item}`).join('\n')}

❤️ Salud actual: ${user.health}/100
🔋 Energía: ${user.stamina - 20}/100`

      user.stamina -= 20
      if (user.stamina < 0) user.stamina = 0

      conn.reply(m.chat, rewardText, m)
      break

    // Sistema de minería
    case 'mine':
    case 'minar':
      if (new Date - user.lastmining < COOLDOWN_MINING) {
        let timeLeft = COOLDOWN_MINING - (new Date - user.lastmining)
        return conn.reply(m.chat, `⛏️ Tus herramientas aún se están enfriando. Espera ${Math.ceil(timeLeft / 60000)} minutos antes de volver a minar.`, m)
      }

      if (user.pickaxe < 1) {
        return conn.reply(m.chat, `🛠️ Necesitas un pico para minar. Compra uno en la tienda con ${usedPrefix}shop`, m)
      }

      if (user.stamina < 20) {
        return conn.reply(m.chat, `😫 Estás demasiado cansado para minar. Necesitas recuperar energía.`, m)
      }

      let miningSuccess = Math.random()
      let miningText = `⛏️ *Te adentras en las profundidades de la mina...*\n\n`
      let miningRewards = []

      // Calcular resultados de minería basados en la calidad del pico (se podría mejorar con niveles de pico)
      if (miningSuccess < 0.1) {
        // Hallazgo excepcional
        miningText += `💎 *¡VETA EXCEPCIONAL!* Has encontrado un filón rico en minerales preciosos.`
        let diamonds = Math.floor(Math.random() * 3) + 1
        let emeralds = Math.floor(Math.random() * 2) + 1
        let rubies = Math.floor(Math.random() * 1) + 1

        user.diamond += diamonds
        user.emerald += emeralds
        user.ruby += rubies
        user.exp += 450

        miningRewards.push(`💎 ${diamonds} Diamantes`)
        miningRewards.push(`🟢 ${emeralds} Esmeraldas`)
        miningRewards.push(`❤️ ${rubies} Rubíes`)
        miningRewards.push(`✨ 450 EXP`)
      } else if (miningSuccess < 0.4) {
        // Hallazgo bueno
        miningText += `⚒️ *¡Buen hallazgo!* Has encontrado una veta rica en minerales.`
        let iron = Math.floor(Math.random() * 5) + 3
        let stone = Math.floor(Math.random() * 10) + 5
        let goldNuggets = Math.floor(Math.random() * 2) + 1

        user.iron += iron
        user.stone += stone
        user.gold += goldNuggets
        user.exp += 200

        miningRewards.push(`⚙️ ${iron} Hierro`)
        miningRewards.push(`🧱 ${stone} Piedra`)
        miningRewards.push(`💰 ${goldNuggets} Oro`)
        miningRewards.push(`✨ 200 EXP`)
      } else {
        // Hallazgo común
        miningText += `🪨 Has encontrado algunos minerales comunes.`
        let stone = Math.floor(Math.random() * 8) + 3
        let iron = Math.floor(Math.random() * 3) + 1

        user.stone += stone
        user.iron += iron
        user.exp += 100

        miningRewards.push(`🧱 ${stone} Piedra`)
        miningRewards.push(`⚙️ ${iron} Hierro`)
        miningRewards.push(`✨ 100 EXP`)
      }

      // Probabilidad de desgaste del pico (se podría mejorar con durabilidad)
      if (Math.random() < 0.1) {
        miningText += `\n\n🛠️ ¡Tu pico se ha desgastado un poco durante la minería!`
        // Aquí podrías añadir lógica para reducir la durabilidad del pico si se implementa
      }

      // Consumir energía
      user.stamina -= 20
      if (user.stamina < 0) user.stamina = 0

      user.lastmining = new Date

      let finalMiningText = `
${miningText}

*🎁 Recursos obtenidos:*
${miningRewards.map(item => `• ${item}`).join('\n')}

🔋 Energía restante: ${user.stamina}/100`

      conn.reply(m.chat, finalMiningText, m)
      break

    // Sistema de caza
    case 'hunt':
    case 'cazar':
      if (new Date - user.lasthunting < COOLDOWN_HUNTING) {
        let timeLeft = COOLDOWN_HUNTING - (new Date - user.lasthunting)
        return conn.reply(m.chat, `🏹 Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a cazar.`, m)
      }

      if (user.weapon < 1) {
        return conn.reply(m.chat, `🔪 Necesitas un arma para cazar. Compra una en la tienda con ${usedPrefix}shop`, m)
      }

      if (user.stamina < 15) {
        return conn.reply(m.chat, `😫 Estás demasiado cansado para cazar. Necesitas recuperar energía.`, m)
      }

      let huntSuccess = Math.random()
      let huntText = `🌲 *Te adentras en el bosque en busca de presas...*\n\n`
      let huntRewards = []

      // Calcular resultados de caza basados en la calidad del arma (se podría mejorar con niveles de arma)
      if (huntSuccess < 0.15) {
        // Caza exitosa de animal raro
        huntText += `🦌 *¡Cazador experto!* Has logrado abatir un ciervo majestuoso.`
        let food = Math.floor(Math.random() * 4) + 3
        let leather = Math.floor(Math.random() * 3) + 2
        user.food += food
        user.leather += leather
        user.exp += 300
        huntRewards.push(`🥩 ${food} Comidas`)
        huntRewards.push(`🧥 ${leather} Cueros`)
        huntRewards.push(`✨ 300 EXP`)
      } else if (huntSuccess < 0.5) {
        // Caza exitosa de animal común
        huntText += `🐇 *Buena cacería.* Has atrapado varios conejos.`
        let food = Math.floor(Math.random() * 3) + 2
        let leather = Math.floor(Math.random() * 2) + 1
        user.food += food
        user.leather += leather
        user.exp += 150
        huntRewards.push(`🥩 ${food} Comidas`)
        huntRewards.push(`🧥 ${leather} Cueros`)
        huntRewards.push(`✨ 150 EXP`)
      } else {
        // Caza fallida o encuentro peligroso
        let failChance = Math.random()
        if (failChance < 0.6) {
          huntText += `🐾 No has encontrado ninguna presa esta vez. ¡Mejor suerte la próxima!`
        } else {
          huntText += `🐺 *¡Encuentro peligroso!* Un lobo salvaje te ha atacado. Logras escapar, pero has perdido algo de salud.`
          user.health -= Math.floor(Math.random() * 10) + 5
          if (user.health < 0) user.health = 1
          huntRewards.push(`💔 -${Math.floor(Math.random() * 10) + 5} Salud`)
        }
        user.exp += 50 // Recompensa por el intento
        huntRewards.push(`✨ 50 EXP`)
      }

      // Probabilidad de desgaste del arma (se podría mejorar con durabilidad)
      if (Math.random() < 0.05) {
        huntText += `\n\n🔪 ¡Tu arma se ha desafilado un poco durante la cacería!`
        // Aquí podrías añadir lógica para reducir la durabilidad del arma si se implementa
      }

      // Consumir energía
      user.stamina -= 15
      if (user.stamina < 0) user.stamina = 0

      user.lasthunting = new Date

      let finalHuntText = `
${huntText}

*🎁 Recompensas obtenidas:*
${huntRewards.map(item => `• ${item}`).join('\n')}

❤️ Salud restante: ${user.health}/100
🔋 Energía restante: ${user.stamina}/100`

      conn.reply(m.chat, finalHuntText, m)
      break

    // Sistema de agricultura
    case 'farm':
    case 'cultivar':
      if (new Date - user.lastfarming < COOLDOWN_FARMING) {
        let timeLeft = COOLDOWN_FARMING - (new Date - user.lastfarming)
        return conn.reply(m.chat, `🌾 Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a cultivar.`, m)
      }

      if (user.axe < 1) {
        return conn.reply(m.chat, `🪓 Necesitas un hacha para preparar la tierra. Compra una en la tienda con ${usedPrefix}shop`, m)
      }

      if (user.seeds < 1) {
        return conn.reply(m.chat, `🌱 No tienes semillas para plantar. Compra algunas en la tienda con ${usedPrefix}shop`, m)
      }

      if (user.stamina < 10) {
        return conn.reply(m.chat, `😫 Estás demasiado cansado para cultivar. Necesitas recuperar energía.`, m)
      }

      let farmingSuccess = Math.random()
      let farmingText = `🚜 *Trabajando arduamente en la granja...*\n\n`
      let farmingRewards = []

      if (farmingSuccess < 0.7) {
        let cropsGrown = Math.floor(Math.random() * 5) + 3
        let herbGrown = Math.floor(Math.random() * 3) + 1
        user.crops += cropsGrown
        user.herb += herbGrown
        user.seeds -= 1 // Consume una semilla por intento
        user.exp += 120
        farmingRewards.push(`🍎 ${cropsGrown} Cultivos`)
        farmingRewards.push(`🌿 ${herbGrown} Hierbas`)
        farmingRewards.push(`✨ 120 EXP`)
        farmingText += `🌱 Has cultivado con éxito y recolectado tus cosechas.`
      } else {
        farmingText += `🌧️ La cosecha no fue buena esta vez debido al mal clima.`
        user.seeds -= 1 // También se consume la semilla si falla
        user.exp += 30
        farmingRewards.push(`✨ 30 EXP (por el esfuerzo)`)
      }

      user.stamina -= 10
      if (user.stamina < 0) user.stamina = 0
      user.lastfarming = new Date

      let finalFarmingText = `
${farmingText}

*🎁 Recompensas obtenidas:*
${farmingRewards.map(item => `• ${item}`).join('\n')}

🌱 Semillas restantes: ${user.seeds}
🔋 Energía restante: ${user.stamina}/100`

      conn.reply(m.chat, finalFarmingText, m)
      break

    // Sistema de pesca
    case 'fish':
    case 'pescar':
      if (new Date - user.lastfishingrod < COOLDOWN_FARMING) { // Reutilizando cooldown temporalmente
        let timeLeft = COOLDOWN_FARMING - (new Date - user.lastfishingrod)
        return conn.reply(m.chat, `🎣 Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de volver a pescar.`, m)
      }

      if (user.fishingrod < 1) {
        return conn.reply(m.chat, `🎣 Necesitas una caña de pescar. Compra una en la tienda con ${usedPrefix}shop`, m)
      }

      if (user.stamina < 10) {
        return conn.reply(m.chat, `😫 Estás demasiado cansado para pescar. Necesitas recuperar energía.`, m)
      }

      let fishingSuccess = Math.random()
      let fishingText = `🎣 *Lanzas tu caña al agua...*\n\n`
      let fishingRewards = []

      if (fishingSuccess < 0.6) {
        let fishCaught = Math.floor(Math.random() * 3) + 1
        user.food += fishCaught
        user.exp += 90
        fishingRewards.push(`🐟 ${fishCaught} Pescados`)
        fishingRewards.push(`✨ 90 EXP`)
        fishingText += `🐠 ¡Has pescado algo!`
      } else {
        fishingText += `🌊 No picó nada esta vez. ¡Sigue intentando!`
        user.exp += 20
        fishingRewards.push(`✨ 20 EXP (por el intento)`)
      }

      user.stamina -= 10
      if (user.stamina < 0) user.stamina = 0
      user.lastfishingrod = new Date // Actualizar el tiempo de pesca

      let finalFishingText = `
${fishingText}

*🎁 Recompensas obtenidas:*
${fishingRewards.map(item => `• ${item}`).join('\n')}

🔋 Energía restante: ${user.stamina}/100`

      conn.reply(m.chat, finalFishingText, m)
      break

    // Sistema de crafteo (ejemplo básico)
    case 'craft':
    case 'fabricar':
      if (!args[1]) {
        return conn.reply(m.chat, `⚙️ ¿Qué quieres fabricar? Usa: ${usedPrefix}rpg craft [item]`, m)
      }
      let itemToCraft = args[1].toLowerCase()
      switch (itemToCraft) {
        case 'pico':
          if (user.wood >= 10 && user.stone >= 15) {
            user.wood -= 10
            user.stone -= 15
            user.pickaxe += 1
            conn.reply(m.chat, `🛠️ ¡Has fabricado un pico!`, m)
          } else {
            conn.reply(m.chat, `⚠️ Necesitas 10 de madera y 15 de piedra para fabricar un pico.`, m)
          }
          break;
        case 'arma':
        case 'espada':
          if (user.iron >= 20 && user.wood >= 5) {
            user.iron -= 20
            user.wood -= 5
            user.weapon += 1
            conn.reply(m.chat, `🔪 ¡Has fabricado un arma!`, m)
          } else {
            conn.reply(m.chat, `⚠️ Necesitas 20 de hierro y 5 de madera para fabricar un arma.`, m)
          }
          break;
        // Añadir más recetas de crafteo aquí
        default:
          conn.reply(m.chat, `❓ No conozco ese objeto para fabricar.`, m)
      }
      break;

    // Sistema de venta
    case 'sell':
    case 'vender':
      if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
        return conn.reply(m.chat, `💰 ¿Cuánto quieres vender? Usa: ${usedPrefix}rpg sell [cantidad] [item]`, m)
      }
      if (!args[2]) {
        return conn.reply(m.chat, `💰 ¿Qué quieres vender? Las opciones son: oro, diamante, esmeralda, rubi, hierro, piedra, madera, cuero, cuerda, hierba, comida, pocion, semillas, cultivos.`, m)
      }
      let quantityToSell = parseInt(args[1])
      let itemToSell = args[2].toLowerCase()
      let price = 0;
      switch (itemToSell) {
        case 'oro': price = 1; break;
        case 'diamante': price = 50; break;
        case 'esmeralda': price = 30; break;
        case 'rubi': price = 40; break;
        case 'hierro': price = 5; break;
        case 'piedra': price = 2; break;
        case 'madera': price = 3; break;
        case 'cuero': price = 10; break;
        case 'cuerda': price = 4; break;
        case 'hierba': price = 8; break;
        case 'comida': price = 2; break;
        case 'pocion': price = 25; break;
        case 'semillas': price = 1; break;
        case 'cultivos': price = 6; break;
        default: return conn.reply(m.chat, `❓ No puedes vender ese objeto. Las opciones son: oro, diamante, esmeralda, rubi, hierro, piedra, madera, cuero, cuerda, hierba, comida, pocion, semillas, cultivos.`, m)
      }
      if (user[itemToSell] >= quantityToSell) {
        user[itemToSell] -= quantityToSell
        user.gold += quantityToSell * price
        conn.reply(m.chat, `💰 Vendiste ${quantityToSell} de ${itemToSell} por ${quantityToSell * price} de oro.`, m)
      } else {
        conn.reply(m.chat, `⚠️ No tienes suficiente ${itemToSell} para vender.`, m)
      }
      break;

    // Sistema de compra
    case 'buy':
    case 'comprar':
      if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 0) {
        return conn.reply(m.chat, `🛒 ¿Cuánto quieres comprar? Usa: ${usedPrefix}rpg buy [cantidad] [item]`, m)
      }
      if (!args[2]) {
        return conn.reply(m.chat, `🛒 ¿Qué quieres comprar? Las opciones son: pico, arma, pocion, semillas.`, m)
      }
      let quantityToBuy = parseInt(args[1])
      let itemToBuy = args[2].toLowerCase()
      let cost = 0;
      switch (itemToBuy) {
        case 'pico': cost = 500; break;
        case 'arma': cost = 800; break;
        case 'pocion': cost = 150; break;
        case 'semillas': cost = 20; break;
        default: return conn.reply(m.chat, `❓ No puedes comprar ese objeto. Las opciones son: pico, arma, pocion, semillas.`, m)
      }
      let totalCost = quantityToBuy * cost
      if (user.gold >= totalCost) {
        user.gold -= totalCost
        user[itemToBuy] += quantityToBuy
        conn.reply(m.chat, `🛒 Compraste ${quantityToBuy} de ${itemToBuy} por ${totalCost} de oro.`, m)
      } else {
        conn.reply(m.chat, `⚠️ No tienes suficiente oro para comprar eso.`, m)
      }
      break;

    // Tienda (muestra los objetos disponibles para comprar)
    case 'shop':
    case 'tienda':
      const shopText = `
╔═══════════════════
║ 🛒 𝐓𝐈𝐄𝐍𝐃𝐀 𝐃𝐄 𝐀𝐕𝐄𝐍𝐓𝐔𝐑𝐄𝐑𝐎𝐒 🛒
╠═══════════════════
║ ⛏️ *Pico:* 500 Oro
║ 🔪 *Arma:* 800 Oro
║ 🧪 *Poción:* 150 Oro
║ 🌱 *Semillas:* 20 Oro
║ 🪓 *Hacha:* 400 Oro
║ 🎣 *Caña de Pescar:* 600 Oro
╠═══════════════════
║ Usa *${usedPrefix}rpg buy [cantidad] [item]* para comprar.
╚═══════════════════`
      conn.reply(m.chat, shopText, m)
      break;

    // Aquí irán los demás comandos como duel, rob, marry, etc.
    case 'duel':
    case 'rob':
    case 'marry':
    case 'divorce':
    case 'family':
    case 'adopt':
    case 'guild':
    case 'clan':
    case 'buyhouse':
    case 'buyfarm':
    case 'workshop':
    case 'buildshop':
    case 'pet':
    case 'petadopt':
    case 'petfeed':
    case 'petstats':
    case 'petadventure':
    case 'createclan':
    case 'joinclan':
    case 'leaveclan':
    case 'clanwar':
    case 'territory':
    case 'alliance':
    case 'quest':
    case 'daily':
    case 'weekly':
    case 'story':
    case 'dungeon':
      conn.reply(m.chat, `🚧 Este comando aún no ha sido implementado. ¡Paciencia! 🚧`, m)
      break;

    default:
      if (args[0]) {
        conn.reply(m.chat, `❓ Comando "${type}" no reconocido. Usa ${usedPrefix}rpg para ver la lista de comandos.`, m)
      }
  }
}

handler.help = ['rpg']
handler.tags = ['rpg']
handler.command = ['rpg', 'rpgultra']

export default handler;
