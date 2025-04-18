import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'src', 'database', 'database.json')

const loadData = () => {
  try {
    const dbDir = path.dirname(DB_PATH)
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
    if (!fs.existsSync(DB_PATH)) return {}
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    console.error('Error loading DB:', e)
    return {}
  }
}

const saveData = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  } catch (e) {
    console.error('Error saving DB:', e)
  }
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const users = loadData()
  const id = m.sender
  const name = m.pushName || id.split('@')[0]
  const args = text.split(' ')
  const action = args[0]?.toLowerCase()

  const send = (msg) => conn.reply(m.chat, msg.trim(), m)

  const menu = `
┏━━━━━━━🌍 *Mundo GO* 🌍━━━━━━━┓
┃ Usa: ${usedPrefix}${command} [comando]
┃
┃ ⚔️ registro - Crear personaje
┃ 👤 perfil - Ver estadísticas
┃ 🛒 tienda - Comprar objetos
┃ 🧭 explorar - Buscar recursos
┃ 🎒 inventario - Ver mochila
┃ ⚔️ batalla - Pelear enemigo
┃ ⬆️ subirnivel - Mejorar nivel
┃ 🐾 mascota - Adopta mascota
┃ 🎯 misión - Hacer misiones
┗━━━━━━━━━━━━━━━━━━━━━━┛
  `.trim()

  if (!action) return send(menu)

  switch (action) {
    case 'registro':
      if (users[id]) return send(`Ya estás registrado, ${name}. Usa *${usedPrefix}${command} perfil*`)
      users[id] = {
        name, level: 1, exp: 0, health: 100, attack: 10, defense: 5,
        gold: 50, inventory: [], pet: null, mission: null
      }
      saveData(users)
      return send(`¡Bienvenido, ${name}! Te has unido al Mundo GO.`)

    case 'perfil':
      if (!users[id]) return send(`Regístrate con *${usedPrefix}${command} registro*`)
      const u = users[id]
      return send(`
🌟 *Perfil de ${u.name}*
✨ Nivel: ${u.level}
🧪 EXP: ${u.exp}/${u.level * 100}
❤️ Salud: ${u.health}
⚔️ Ataque: ${u.attack}
🛡️ Defensa: ${u.defense}
💰 Oro: ${u.gold}
🐾 Mascota: ${u.pet ? u.pet : 'Ninguna'}
🎒 Inventario: ${u.inventory.length} objetos
`)

    case 'explorar':
      if (!users[id]) return send(`Primero regístrate.`)
      let oro = Math.floor(Math.random() * 20)
      users[id].gold += oro
      users[id].exp += 10
      saveData(users)
      return send(`Exploraste una cueva y ganaste 💰 ${oro} de oro y +10 EXP.`)

    case 'batalla':
      if (!users[id]) return send(`Primero regístrate.`)
      let enemigoHP = Math.floor(Math.random() * 30 + 20)
      let daño = users[id].attack
      let result = ''
      if (daño >= enemigoHP) {
        let exp = 20, gold = 15
        users[id].exp += exp
        users[id].gold += gold
        result = `¡Derrotaste al enemigo!\nGanaste +${exp} EXP y ${gold} oro.`
      } else {
        let dmg = Math.floor(enemigoHP / 10)
        users[id].health -= dmg
        result = `¡El enemigo te atacó!\nPerdiste ${dmg} de salud.`
      }
      saveData(users)
      return send(result)

    case 'subirnivel':
      if (!users[id]) return send(`Primero regístrate.`)
      const user = users[id]
      const reqExp = user.level * 100
      if (user.exp >= reqExp) {
        user.level++
        user.exp -= reqExp
        user.attack += 5
        user.defense += 3
        user.health = 100
        saveData(users)
        return send(`¡Subiste a nivel ${user.level}! Tus estadísticas mejoraron.`)
      } else {
        return send(`Te faltan ${reqExp - user.exp} EXP para subir de nivel.`)
      }

    case 'inventario':
      if (!users[id]) return send(`Primero regístrate.`)
      let inv = users[id].inventory
      if (inv.length === 0) return send(`Tu inventario está vacío.`)
      return send(`🎒 Inventario:\n${inv.map(i => `- ${i}`).join('\n')}`)

    case 'tienda':
      return send(`
🛒 *Tienda del Mundo GO*

1. Espada de Madera - 20 oro
2. Poción de Vida - 15 oro
3. Escudo - 25 oro

Usa: *${usedPrefix}${command} comprar [objeto]*
`)

    case 'comprar':
      if (!users[id]) return send(`Primero regístrate.`)
      const item = args[1]?.toLowerCase()
      if (!item) return send(`Ej: *${usedPrefix}${command} comprar espada*`)
      let costo = 0
      switch (item) {
        case 'espada': costo = 20; break
        case 'pocion': costo = 15; break
        case 'escudo': costo = 25; break
        default: return send(`Objeto no válido.`)
      }
      if (users[id].gold < costo) return send(`No tienes suficiente oro.`)
      users[id].gold -= costo
      users[id].inventory.push(item)
      saveData(users)
      return send(`Compraste *${item}* por ${costo} oro.`)

    case 'mascota':
      if (!users[id]) return send(`Primero regístrate.`)
      const pet = args[1]?.toLowerCase()
      if (!pet) return send(`Ej: *${usedPrefix}${command} mascota gato*`)
      if (users[id].pet) return send(`Ya tienes una mascota.`)
      users[id].pet = pet
      saveData(users)
      return send(`Adoptaste una mascota: ${pet}`)

    case 'misión':
      if (!users[id]) return send(`Primero regístrate.`)
      const recompensa = Math.floor(Math.random() * 30) + 10
      users[id].gold += recompensa
      users[id].exp += 15
      saveData(users)
      return send(`Completaste una misión y ganaste +15 EXP y ${recompensa} oro.`)

    default:
      return send(`Comando inválido. Usa *${usedPrefix}${command}* para ver el menú.`)
  }
}

handler.command = ['go']
handler.tags = ['rpg']
handler.help = ['go']
handler.register = true

export default handler
