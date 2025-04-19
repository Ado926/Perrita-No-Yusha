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
💖✨🌸🌿🍀🍃════════════🍃🍀🌿🌸✨💖
             ${botname}
          _ᴍᴇɴÚ ᴅᴇ ғᴜɴᴄɪᴏɴᴇs_
💖✨🌸🌿🍀🍃════════════🍃🍀🌿🌸✨💖

${''/* Espacio después del título principal */}

🎀 *Ｉｎｆｏｒｍａｃｉóｎ Ｇｅｎｅｒａｌ* 🎀
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
🌸 Cliente: @${userId.split('@')[0]}
🌷 Modo: Público
💖 Bot: ${(conn.user.jid == global.conn.user.jid ? '```Principal 👑```' : 'Sub-Bot ✨')}
⏳ Activa: ${uptime}
🌿 Usuarios: ${totalreg}
🍀 Comandos: ${totalCommands}
━━━━━━━━━━━━━━━━━━━

${''/* Espacio antes y después de la línea de Sub-Bot */}
✨🌱 Crea tu propio asistente: #serbot o #code 🌱✨

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ
${''/* Espacio antes del primer bloque de sección */}

🌐 *Ｅｘｐｌｏｒａｃｉóｎ Ｄｉｇｉｔａｌ* 🔍🌿
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #tiktoksearch [término]
• #tweetposts [término]
• #ytsearch / #yts [término]
• #githubsearch [usuario]
• #cuevana / #cuevanasearch [término]
• #google [término]
• #pin / #pinterest [término]
• #imagen / #image [término]
• #animesearch / #animess [término]
• #animei / #animeinfo [nombre]
• #infoanime [nombre]
• #hentaisearch / #searchhentai [término]
• #xnxxsearch / #xnxxs [término]
• #xvsearch / #xvideossearch [término]
• #pornhubsearch / #phsearch [término]
• #npmjs [término]
━━━━━━━━━━━━━━━━━━━
_✨ Encuentra información y contenido en la web con facilidad._ 🍃

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

💾 *Ａｌｍａｃéｎ ｄｅ Ｃｏｎｔｅｎｉｄｏ* 💾🌱
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #tiktok / #tt [enlace]
• #mediafire / #mf [enlace]
• #pinvid / #pinvideo [enlace]
• #mega / #mg [enlace]
• #play / #play2 [nombre/enlace]
• #ytmp3 / #ytmp4 [enlace]
• #fb / #facebook [enlace]
• #twitter / #x [enlace]
• #ig / #instagram [enlace]
• #tts [texto]
• #terabox / #tb [enlace]
• #gdrive / #drive [enlace]
• #ttimg / #ttmp3 [enlace]
• #gitclone [enlace]
━━━━━━━━━━━━━━━━━━━
_💖 Descarga tu contenido favorito rapidísimo._ 🌿

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

💎 *Ｆｏｒｔｕｎａ ｙ Ｆａｎｔａｓíａ* 💎🍀
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #w / #work
• #slut / #protituirse
• #cf / #suerte
• #crime / #crimen
• #ruleta
• #casino / #apostar
• #slot
• #cartera / #wallet
• #banco / #bank
• #deposit / #depositar
• #with / #retirar / #withdraw
• #transfer / #pay [mención] [cantidad]
• #miming / #minar / #mine
• #buyall / #buy [item] [cantidad]
• #daily / #diario
• #cofre
• #weekly / #semanal
• #monthly / #mensual
• #steal / #robar / #rob [mención]
• #robarxp / #robxp [mención]
• #eboard / #baltop
• #aventura / #adventure
• #curar / #heal
• #cazar / #hunt / #berburu
• #inv / #inventario
• #mazmorra / #explorar
• #halloween
• #christmas / #navidad
━━━━━━━━━━━━━━━━━━━
_✨ Gestiona tus recursos y vive aventuras._ 🍃

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🃏 *Ｃｏｌｅｃｃｉｏｎａｂｌｅｓ Ｅｎｃａｎｔａｄｏｓ* 🃏🌱
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #rollwaifu / #rw / #roll
• #claim / #c / #reclamar
• #harem / #waifus / #claims
• #charimage / #waifuimage / #wimage [nombre]
• #charinfo / #winfo / #waifuinfo [nombre]
• #givechar / #givewaifu / #regalar [mención] [nombre]
• #vote / #votar [nombre]
• #waifusboard / #waifustop / #topwaifus
━━━━━━━━━━━━━━━━━━━
_💖 Colecciona y gestiona personajes únicos._ 🍀

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

✨ *Ｐｉｎｃｅｌａｄａｓ Ｍáｇｉｃａｓ* ✨🌿
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #sticker / #s [imagen/video/gif]
• #setmeta [pack|autor]
• #delmeta
• #pfp / #getpic [mención/número]
• #qc [texto|respuesta a mensaje]
• #toimg / #img [sticker]
• #brat / #ttp / #attp [texto]
• #emojimix [emoji1+emoji2]
• #wm [pack|autor] [sticker]
━━━━━━━━━━━━━━━━━━━
_🎨 Crea stickers personalizados._ 🍃

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🛠️ *Ｍｉ Ｃａｊａ ｄｅ Ｓｅｃｒｅｔｏｓ* 🛠️🍀
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #calcular / #cal [ecuación]
• #tiempo / #clima [país/ciudad]
• #horario
• #fake / #fakereply [texto|@mención]
• #enhance / #remini / #hd [imagen]
• #letra [texto]
• #read / #readviewonce / #ver [mensaje de ver una vez]
• #whatmusic / #shazam [audio]
• #spamwa / #spam [número]|[texto]|[cantidad]
• #ss / #ssweb [enlace]
• #length / #tamaño [archivo]
• #say / #decir [texto]
• #todoc / #toducument [archivo]
• #translate / #traducir / #trad [código]|[texto]
• #fotoperfil [número]
━━━━━━━━━━━━━━━━━━━
_💖 Herramientas útiles para diversas tareas._ 🌱

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

👤 *Ｍｉ Ｄｉａｒｉｏ Ｐｅｒｓｏｎａｌ* 👤🌿
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #reg / #verificar / #register [edad]
• #unreg [número de serie]
• #profile [mención opcional]
• #marry [mención]
• #divorce
• #setgenre / #setgenero [género]
• #delgenre / #delgenero
• #setbirth / #setnacimiento [dd/mm/yyyy]
• #delbirth / #delnacimiento
• #setdescription / #setdesc [texto]
• #deldescription / #deldesc
• #lb / #lboard [página]
• #level / #lvl [mención opcional]
• #comprarpremium / #premium
• #confesiones / #confesar [texto]
━━━━━━━━━━━━━━━━━━━
_💞 Personaliza tu perfil y relaciones._ 🌸

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🏛️ *Ｎｕｅｓｔｒｏ Ｃｌｕｂ Ｐｒｉｖａｄｏ* 🏛️🍀
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #config / #on
• #hidetag [texto]
• #gp / #infogrupo
• #linea / #listonline
• #setwelcome [texto]
• #setbye [texto]
• #link
• #admins / #admin
• #restablecer / #revoke
• #grupo / #group [abrir/cerrar]
• #kick [mención]
• #add / #añadir / #agregar [número(s)]
• #promote [mención]
• #demote [mención]
• #gpbanner / #groupimg [imagen]
• #gpname [nombre]
• #gpdesc [descripción]
• #advertir / #warn / #warning [mención] [motivo]
• #unwarn / #delwarn [mención]
• #advlist / #listadv
• #bot on/off
• #mute [mención]
• #unmute [mención]
• #encuesta / #poll [pregunta]|[opción1]|[opción2]...
• #delete / #del [respuesta a mensaje]
• #fantasmas
• #kickfantasmas
• #invocar / #tagall / #todos [texto opcional]
• #setemoji [emoji]
• #listnum [prefijo]
• #kicknum [prefijo]
━━━━━━━━━━━━━━━━━━━
_👥 Herramientas de administración grupal._ 👑🌳

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🌸 *Ｒｅａｃｃｉｏｎｅｓ Ｋａｗａｉｉ* 💖🌿
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #angry 😠
• #bite 💋
• #bleh 😛
• #blush 😊
• #bored 🥱
• #cry 😭
• #cuddle 🤗
• #dance 💃
• #drunk 🥴
• #eat 🍔
• #facepalm 🤦‍♀️
• #happy 😄
• #hug 🥰
• #impregnate 🤰
• #kill 🔪
• #kiss / #besar 💋
• #laugh 😂
• #lick 👅
• #love / #amor ❤️
• #pat 👋
• #poke 👉
• #pout 😟
• #punch 👊
• #run 🏃‍♀️
• #sad / #triste 😢
• #scared 😱
• #seduce 😏
• #shy / #timido 😳
• #slap 👋💥
• #dias ☀️
• #noches 🌙
• #sleep 😴
• #smoke 🚬
• #think 🤔
━━━━━━━━━━━━━━━━━━━
_✨ Exprésate con reacciones de anime._ 🍃
_(¡Menciona a tu amix para interactuar! Ejemplo: #hug @amiguita)_

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🔞 *Ｚｏｎａ Ｓｅｃｒｅｔａ (+18)* 🔞💚
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #anal
• #waifu
• #bath 🛁
• #blowjob / #mamada / #bj 👅
• #boobjob 🍒
• #cum 💦
• #fap 🔥
• #ppcouple / #ppcp 💑
• #footjob 👣
• #fuck / #coger / #fuck2 🔥
• #cafe / #coffe ☕
• • #violar / #perra 💔
• #grabboobs 👀
• #grop 🤲
• #lickpussy 👅
• #rule34 / #r34 [Tags]
• #sixnine / #69 ☯️
• #spank / #nalgada 🍑
• #suckboobs 🍓
• #undress / #encuerar 👙
• #yuri / #tijeras ✂️
━━━━━━━━━━━━━━━━━━━
_⚠️ ¡Solo para adultos! Bajo tu responsabilidad._ 🌿
_(¡Diviértete con precaución! Algunos comandos necesitan que menciones a alguien)_

${''/* Separador entre bloques */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

🎮 *¡Ａ Ｊｕｇａｒ ｓｅ ｈａ Ｄｉｃｈｏ!* 🎮🍀
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• #amistad / #amigorandom 🤗
• #chaqueta / #jalamela 👋
• #chiste 😂
• #consejo 💡
• #doxeo / #doxear [mención] 😈
• #facto 🤓
• #formarpareja 💘
• #formarpareja5 💖
• #frase 📜
• #huevo 🥚
• #chupalo [mención] 😛
• #aplauso [mención] 👏
• #marron [mención] 🌰
• #suicidar 💀
• #iq / #iqtest [mención] 🧠
• #meme 😂
• #morse [texto] .--
• #nombreninja [nombre] 🥷
• #paja / #pajeame 🍆💦
• • #personalidad [mencion] 🤔
• #piropo 😍
• #pregunta [pregunta] ❓
• #ship / #pareja [mención1] [mención2] 🚢💞
• #sorteo [duración] [premio] 🎉
• #top [número] [criterio] 🏆
• #formartrio [mención1] [mención2] 🍌🍌🍑
• #ahorcado 绞刑架
• #genio [pregunta] 🧞‍♂️
• #mates / #matematicas [ecuación] ➕➖✖️➗
• #rpg (Juego Beta) 🗺️
• #sopa / #buscarpalabra 🔡
• #pvp / #suit [mención] ⚔️
• #ttt  TIC TAC TOE
━━━━━━━━━━━━━━━━━━━
_🎮 Variedad de juegos y actividades._ 🌱

${''/* Separador entre el último bloque de sección y asistencia */}
═ೋ❧💚═ೋ❧🌸═ೋ❧🌿═ೋ

✨ *Ａｓｉｓｔｅｎｃｉａ* ✨
${''/* Separador simple */}
━━━━━━━━━━━━━━━━━━━
• Comando Principal: #menu / #help
• Mi Creador: Usa #creador
━━━━━━━━━━━━━━━━━━━

${''/* Espacio antes de los créditos finales */}

_Desarrollado con dedicación._ ✨💖🌿
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
