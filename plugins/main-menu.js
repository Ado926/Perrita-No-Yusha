let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  // Manteniendo la lógica original para obtener el nombre, aunque getName es mejor con await
  // let name = conn.getName(userId) // Original line, might need await depending on conn implementation
  let name = await conn.getName(userId) // Using await for robustness

  let _uptime = process.uptime() * 1000
  // Manteniendo la función clockString original
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  // Variables globales como en el código original (asumimos que están definidas en otro lugar, e.g., global.js)
  // global.botname
  // global.textbot
  // global.banner
  // global.redes
  // global.channelRD

  let txt = `
💖✨🌸🌿 ¡Hola! ¡Soy ${botname}! 🌿🌸✨💖

¡Estoy aquí para hacer tu día más fácil y divertido! ✨ Descubre todas mis funciones con este menú encantador, diseñado especialmente para ti. 🥰 Con un toque de naturaleza y frescura. 🌱

💚═🌷═🌸═🌿═🍀═🍃═💖═✨═💚

*🎀 Un Poquito Sobre Mí 🎀*
🌸 Cliente Encantador: @${userId.split('@')[0]}
🌷 Mi Modo: Público
💖 Mi Identidad: ${(conn.user.jid == global.conn.user.jid ? 'Bot Principal ```👑```' : 'Sub-Bot Brillante ✨')}
⏳ Llevo Activa: ${uptime}
 globales: ${totalreg} personitas
🌟 Comandos Mágicos: ${totalCommands}

🌿 ¿Quieres una amiguita como yo? ¡Crea tu propio Sub-Bot con #serbot o #code! ✨

💚═🌷═🌸═🌿═🍀═🍃═💖═✨═💚

*🎀 Mi Catálogo de Funciones Mágicas 🎀*

*🌷 Exploración de Ensueño* (Buscadores) 🔍🌿
• #tiktoksearch [término] • #tweetposts [término] • #ytsearch / #yts [término]
• #githubsearch [usuario] • #cuevana / #cuevanasearch [término] • #google [término]
• #pin / #pinterest [término] • #imagen / #image [término]
• #animesearch / #animess [término] • #animei / #animeinfo [nombre]
• #infoanime [nombre] • #hentaisearch / #searchhentai [término]
• #xnxxsearch / #xnxxs [término] • #xvsearch / #xvideossearch [término]
• #pornhubsearch / #phsearch [término] • #npmjs [término]
✨ _¡Encuentra todo lo que buscas en la web con un toque de magia y naturaleza!_ ✨🍃

*🌸 Tesoros para Descargar* (Descargas) 💾🌱
• #tiktok / #tt [enlace] • #mediafire / #mf [enlace] • #pinvid / #pinvideo [enlace]
• #mega / #mg [enlace] • #play / #play2 [nombre/enlace]
• #ytmp3 / #ytmp4 [enlace] • #fb / #facebook [enlace] • #twitter / #x [enlace]
• #ig / #instagram [enlace] • #tts [texto] • #terabox / #tb [enlace]
• #gdrive / #drive [enlace] • #ttimg / #ttmp3 [enlace] • #gitclone [enlace]
💖 _¡Descarga tus videos, música y archivos favoritos rapidísimo, como coger una flor fresca!_ 💖🌿

*🌷 Fortuna y Fantasía* (Economía y RPG) 💎🍀
• #w / #work • #slut / #protituirse • #cf / #suerte • #crime / #crimen
• #ruleta • #casino / #apostar • #slot • #cartera / #wallet • #banco / #bank
• #deposit / #depositar • #with / #retirar / #withdraw • #transfer / #pay [mención] [cantidad]
• #miming / #minar / #mine • #buyall / #buy [item] [cantidad] • #daily / #diario
• #cofre • #weekly / #semanal • #monthly / #mensual • #steal / #robar / #rob [mención]
• #robarxp / #robxp [mención] • #eboard / #baltop • #aventura / #adventure
• #curar / #heal • #cazar / #hunt / #berburu • #inv / #inventario
• #mazmorra / #explorar • #halloween • #christmas / #navidad
✨ _¡Acumula riquezas como si brotaran de la tierra, vive aventuras emocionantes y diviértete!_ ✨🍃

*🌸 Coleccionables Encantados* (Gacha) 🃏🌱
• #rollwaifu / #rw / #roll • #claim / #c / #reclamar • #harem / #waifus / #claims
• #charimage / #waifuimage / #wimage [nombre] • #charinfo / #winfo / #waifuinfo [nombre]
• #givechar / #givewaifu / #regalar [mención] [nombre]
• #vote / #votar [nombre] • #waifusboard / #waifustop / #topwaifus
💖 _¡Colecciona personajes adorables, como encontrar tréboles de la suerte!_ 💖🍀

*🌷 Pinceladas Mágicas* (Stickers) ✨🌿
• #sticker / #s [imagen/video/gif] • #setmeta [pack|autor] • #delmeta
• #pfp / #getpic [mención/número] • #qc [texto|respuesta a mensaje]
• #toimg / #img [sticker] • #brat / #ttp / #attp [texto] • #emojimix [emoji1+emoji2]
• #wm [pack|autor] [sticker]
🎨 _¡Convierte tus momentos en stickers súper cuquis y frescos como una hoja!_ 🎨🍃

*🌸 Mi Caja de Secretos* (Herramientas) 🛠️🍀
• #calcular / #cal [ecuación] • #tiempo / #clima [país/ciudad] • #horario
• #fake / #fakereply [texto|@mención] • #enhance / #remini / #hd [imagen]
• #letra [texto] • #read / #readviewonce / #ver [mensaje de ver una vez]
• #whatmusic / #shazam [audio] • #spamwa / #spam [número]|[texto]|[cantidad]
• #ss / #ssweb [enlace] • #length / #tamaño [archivo] • #say / #decir [texto]
• #todoc / #toducument [archivo] • #translate / #traducir / #trad [código]|[texto]
• #fotoperfil [número]
💖 _¡Pequeños trucos y ayudas, cultivados para hacer tu vida online más fácil!_ 💖🌱

*🌷 Mi Diario Personal* (Tu Perfil) 👤🌿
• #reg / #verificar / #register [edad] • #unreg [número de serie]
• #profile [mención opcional] • #marry [mención] • #divorce
• #setgenre / #setgenero [género] • #delgenre / #delgenero
• #setbirth / #setnacimiento [dd/mm/yyyy] • #delbirth / #delnacimiento
• #setdescription / #setdesc [texto] • #deldescription / #deldesc
• #lb / #lboard [página] • #level / #lvl [mención opcional]
• #comprarpremium / #premium • #confesiones / #confesar [texto]
💞 _¡Dale tu toque personal a tu perfil, que florezca tu identidad!_ 💞🌸

*🌸 Nuestro Club Privado* (Grupos) 🏛️🍀
• #config / #on • #hidetag [texto] • #gp / #infogrupo
• #linea / #listonline • #setwelcome [texto] • #setbye [texto]
• #link • #admins / #admin • #restablecer / #revoke
• #grupo / #group [abrir/cerrar] • #kick [mención]
• #add / #añadir / #agregar [número(s)] • #promote [mención] • #demote [mención]
• #gpbanner / #groupimg [imagen] • #gpname [nombre] • #gpdesc [descripción]
• #advertir / #warn / #warning [mención] [motivo] • #unwarn / #delwarn [mención]
• #advlist / #listadv • #bot on/off • #mute [mención] • #unmute [mención]
• #encuesta / #poll [pregunta]|[opción1]|[opción2]... • #delete / #del [respuesta a mensaje]
• #fantasmas • #kickfantasmas • #invocar / #tagall / #todos [texto opcional]
• #setemoji [emoji] • #listnum [prefijo] • #kicknum [prefijo]
👥 _¡Gestiona tu grupo con estilo y facilidad, cultivando una comunidad increíble!_ 👑🌳

*🌷 Reacciones Kawaii* (Anime) 💖🌿
• #angry 😠 • #bite 💋 • #bleh 😛 • #blush 😊
• #bored 🥱 • #cry 😭 • #cuddle 🤗 • #dance 💃
• #drunk 🥴 • #eat 🍔 • #facepalm 🤦‍♀️ • #happy 😄
• #hug 🥰 • #impregnate 🤰 • #kill 🔪 • #kiss / #besar 💋
• #laugh 😂 • #lick 👅 • #love / #amor ❤️ • #pat 👋
• #poke 👉 • #pout 😟 • #punch 👊 • #run 🏃‍♀️
• #sad / #triste 😢 • #scared 😱 • #seduce 😏 • #shy / #timido 😳
• #slap 👋💥 • #dias ☀️ • #noches 🌙 • #sleep 😴 • #smoke 🚬 • #think 🤔
✨ _¡Expresa tus sentimientos con reacciones súper adorables, frescas como la brisa!_ ✨🍃
_(¡Menciona a tu amix para interactuar! Ejemplo: #hug @amiguita)_

*🌸 Zona Secreta (+18)* (NSFW) 🔞💚
• #anal • #waifu • #bath 🛁 • #blowjob / #mamada / #bj 👅
• #boobjob 🍒 • #cum 💦 • #fap 🔥 • #ppcouple / #ppcp 💑
• #footjob 👣 • #fuck / #coger / #fuck2 🔥 • #cafe / #coffe ☕
• #violar / #perra 💔 • #grabboobs 👀 • #grop 🤲 • #lickpussy 👅
• #rule34 / #r34 [Tags] • #sixnine / #69 ☯️ • #spank / #nalgada 🍑
• #suckboobs 🍓 • #undress / #encuerar 👙 • #yuri / #tijeras ✂️
⚠️ _¡Solo para adultos! Entra bajo tu propia responsabilidad, cuidado con las espinas._ ⚠️🌿
_(¡Diviértete con precaución! Algunos comandos necesitan que menciones a alguien)_

*🌷 ¡A Jugar se ha Dicho!* (Juegos) 🎮🍀
• #amistad / #amigorandom 🤗 • #chaqueta / #jalamela 👋 • #chiste 😂 • #consejo 💡
• #doxeo / #doxear [mención] 😈 • #facto 🤓 • #formarpareja 💘 • #formarpareja5 💖
• #frase 📜 • #huevo 🥚 • #chupalo [mención] 😛 • #aplauso [mención] 👏 • #marron [mención] 🌰
• #suicidar 💀 • #iq / #iqtest [mención] 🧠 • #meme 😂 • #morse [texto] .-- • #nombreninja [nombre] 🥷
• #paja / #pajeame 🍆💦 • #personalidad [mencion] 🤔 • #piropo 😍 • #pregunta [pregunta] ❓
• #ship / #pareja [mención1] [mención2] 🚢💞 • #sorteo [duración] [premio] 🎉
• #top [número] [criterio] 🏆 • #formartrio [mención1] [mención2] 🍌🍌🍑
• #ahorcado 绞刑架 • #genio [pregunta] 🧞‍♂️ • #mates / #matematicas [ecuación] ➕➖✖️➗
• #rpg (Juego Beta) 🗺️ • #sopa / #buscarpalabra 🔡 • #pvp / #suit [mención] ⚔️ • #ttt  TIC TAC TOE
🎮 _¡Prepárate para la diversión sin fin con mis juegos, tan variados como un jardín!_ 🎉🌱

💚═🌷═🌸═🌿═🍀═🍃═💖═✨═💚

*🌸 ¿Necesitas Ayuda, Cariño? 🌸*
Comando Mágico Principal: #menu o #help
Mi Creador: Usa #creador para conocerlo ✨

_Hecho con mucho amorts, brillitos y un toque natural para ti._ ✨💖🌿
`.trim()

  await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id, // Asumimos que channelRD está definido globalmente
              newsletterName: channelRD.name, // Asumimos que channelRD está definido globalmente
              serverMessageId: -1,
          },
          forwardingScore: 9., // Manteniendo el valor original
          externalAdReply: {
              title: botname, // Asumimos que botname está definido globalmente
              body: textbot, // Asumimos que textbot está definido globalmente
              thumbnailUrl: banner, // Asumimos que banner está definido globalmente
              sourceUrl: redes, // Asumimos que redes está definido globalmente
              mediaType: 1,
              showAdAttribution: true,
              renderLargerThumbnail: true,
          },
      },
  }, { quoted: m })

}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

// Función clockString original
function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
