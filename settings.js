import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumber = '' //Ejemplo: 573218138672

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['51921826291', '🜲 Propietario1 🜲', true],
  ['50493732693', 'Dueño 2', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['5218211111111'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'Perri-MD'
global.namebot = '✿◟Perrita No Yusha ✿'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '✿❀✧ 𖧷 𝐏𝐞𝐫𝐫𝐢𝐭𝐚 𝐧𝐨 𝐘ū𝐬𝐡𝐚 𖧷 ✧❀✿'
global.botname = '⟦🩷 ᥣᥱ Pᥱrrιtᥲ ᥒ᥆ Yū᥂hᥲ 🩷⟧'
global.wm = '𖦹꙰ꦿᰔᩚ 𝐏𝐞𝐫𝐫𝐢𝐭𝐚_𝐧𝐨_𝐘ū𝐬𝐡𝐚 - 𝐁𝐨𝐭︎︎︎︎ ✿ 𓆩⟡𓆪'

global.author = '🌳🌿 𝘔𝘢𝘥𝘦 𝘉𝘺 𝓜ᥲᥡᥴ᥆ᥣ & ᭙ᥱ𝗂𝗋𝗄 🌿🌳'
global.dev = '🌳✨ 𝖯𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝓜ᥲᥡᥴ᥆ᥣ & ᭙ᥱ𝗂𝗋𝗄 ✨🌳'
global.textbot = '🍀 𝒫𝑒𝓇𝓇𝒾𝓉𝒶 𝓃𝑜 𝒴ū𝓈𝒽𝒶 • 𝒫𝑜𝓌𝑒𝓇𝑒𝒹 𝒷𝓎 🌳 𝓜ᥲᥡᥴ᥆ᥣ & ᭙ᥱ𝗂𝗋𝗄 🌳'
global.etiqueta = '✰ 𝘉𝘺 Wirk & 𝘔𝘢𝘺𝘤𝘰𝘭 ✰'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '¥enes'
global.welcom1 = '❍ Edita Con El Comando setwelcome'
global.welcom2 = '❍ Edita Con El Comando setbye'
global.banner = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742678744381.jpeg'
global.avatar = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1742678797993.jpeg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/CDw7hpI30WjCyKFAVLHNhZ'
global.comunidad1 = 'https://chat.whatsapp.com/KqkJwla1aq1LgaPiuFFtEY'
global.channel = 'https://whatsapp.com/channel/0029Vb6AEZRKGGGJpWWSfo1L'
global.channel2 = 'https://whatsapp.com/channel/0029Vb6AEZRKGGGJpWWSfo1L'
global.md = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot'
global.correo = 'thekingdestroy507@gmail.com'
global.cn ='https://whatsapp.com/channel/0029Vb6AEZRKGGGJpWWSfo1L';

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363399352963944@newsletter',
}
global.multiplier = 70

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
