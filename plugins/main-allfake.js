import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
  try {
    options ? options : {}
    var res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'User-Agent': 'GoogleBot',
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (e) {
    console.log(`Error : ${e}`)
  }
}

global.creador = ['Wa.me/50493732693', 'Wa.me/51921826291'].join(' y ')
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/50493732693'
global.namechannel = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
global.namechannel2 = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
global.namegrupo = 'ᰔᩚ ᥡᥙkі sᥙ᥆ᥙ • ᥆𝖿іᥴіᥲᥣ ❀'
global.namecomu = 'ᰔᩚ ᥡᥙkіᑲ᥆𝗍-mძ • ᥴ᥆mᥙᥒі𝗍ᥡ ❀'
global.listo = '❀ *Aquí tienes ฅ^•ﻌ•^ฅ*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

global.canalIdM = ["120363402846939411@newsletter", "120363399352963944@newsletter"]
global.canalNombreM = ["Abundantes Bots Channel 👻", "❀✰⏤͟͟͞͞𝑷𝒆𝒓𝒓𝒊𝒕𝒂 𝑵𝒐 𝒀𝒖𝒔𝒉𝒂⏤͟͟͞͞✰❀"]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'

global.emoji = 'ꕤ'
global.emoji2 = '☘︎'
global.emoji3 = 'ପ'
global.emoji4 = '❍'
global.emoji5 = '✰'
global.emojis = [emoji, emoji2, emoji3, emoji4].getRandom()

global.wait = '❍ Espera un momento, soy lenta...';
global.waitt = '❍ Espera un momento, soy lenta...';
global.waittt = '❍ Espera un momento, soy lenta...';
global.waitttt = '❍ Espera un momento, soy lenta...';

var canal = 'https://whatsapp.com/channel/0029VapSIvR5EjxsD1B7hU3T'  
var comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
var git = 'https://github.com/The-King-Destroy'
var github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot' 
let correo = 'thekingdestroy507@gmail.com'
global.redes = [canal, comunidad, git, github, correo].getRandom()

let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg

var ase = new Date()
var hour = ase.getHours()
switch(hour){
  case 0: case 1: case 2: case 18: case 19: case 20: case 21: case 22: case 23:
    hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;
  case 3: case 4: case 5: case 6: case 8: case 9:
    hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break;
  case 7:
    hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break;
  case 10: case 11: case 12: case 13:
    hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break;
  case 14: case 15: case 16: case 17:
    hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break;
}
global.saludo = hour;

global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

global.packsticker = `
╭──────⊹꫟⭑꫟⊹──────╮
│ 〢Usuario: ${nombre}
│ 〢Bot: ${botname}
│ 〢Fecha: ${fecha}
│ 〢Hora: ${tiempo}
╰──────⊹꫟⭑꫟⊹──────╯`

global.packsticker2 = `
╭─❍ Sticker generado por:
│ • Wirk (Wa.me/50493732693)
│ • Maycol (Wa.me/51921826291)
╰─────────────⭑`

global.fkontak = {
  key: { participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) },
  message: {
    'contactMessage': {
      'displayName': `${nombre}`,
      'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      'jpegThumbnail': null, thumbnail: null, sendEphemeral: true
    }
  }
}

global.icono = [
  'https://tinyurl.com/285a5ejf',
].getRandom()

global.rcanal = {
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      serverMessageId: 100,
      newsletterName: channelRD.name,
    },
    externalAdReply: {
      showAdAttribution: true,
      title: 'Sticker creado con amor',
      body: 'Creadores: Wirk & Maycol',
      mediaUrl: null,
      description: null,
      previewType: "PHOTO",
      thumbnailUrl: icono,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    },
  }
}

}

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
  let randomIndex = Math.floor(Math.random() * canalIdM.length)
  let id = canalIdM[randomIndex]
  let name = canalNombreM[randomIndex]
  return { id, name }
  }
