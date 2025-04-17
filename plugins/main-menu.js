let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  let txt = `

🌸 ¡Hola! Soy ${botname} 🎀

╭─═══💖═══╮
│ *Información General* │
╰═💖═════╯
│ 👤 *Cliente*: @${userId.split('@')[0]}
│ ⚙️ *Modo*: Público
│ 🤖 *Bot*: ${(conn.user.jid == global.conn.user.jid ? '```Principal```🍀' : 'Sub-Bot ✨')}
│ ⏳ *Activada*: ${uptime}
│ 🌷 *Usuarios*: ${totalreg}
│ 🌼 *Comandos*: ${totalCommands}
│ 📱 *Baileys*: Multi Device
╰─────────╯

💖 *Crea tu propio Sub-Bot con #qr o #code*

✨ *『 Información de la Bot 』* ✨
❀ Comandos para conocer el estado e información del Bot.
  🌷 #help / #menu → Ver lista de comandos.
  🌼 #uptime / #runtime → Tiempo de actividad.
  🌸 #sc / #script → Repositorio oficial.
  💖 #staff / #colaboradores → Desarrolladores.
  💫 #serbot / #serbot code → Crear Sub-Bot.
  🌻 #bots / #sockets → Sub-Bots activos.
  💚 #creador → Contacto del creador.
  🌷 #status / #estado → Estado del Bot.
  ✨ #links / #grupos → Enlaces oficiales.
  🌸 #infobot → Información completa.
  🌼 #sug / #newcommand → Sugerir comando.
  💖 #p / #ping → Velocidad de respuesta.
  🌻 #reporte / #reportar → Reportar problemas.
  💫 #sistema / #system → Estado del sistema.
  💜 #speed / #speedtest → Estadísticas de velocidad.
  🌸 #views / #usuarios → Usuarios registrados.
  ✨ #funciones / #totalfunciones → Todas las funciones.
  💚 #ds / #fixmsgespera → Eliminar archivos innecesarios.
  🌷 #editautoresponder → Configurar Prompt personalizado.

🌷 *『 Buscadores 』* 🌷
❀ Comandos para buscar en la web.
  🌸 #tiktoksearch / #tiktoks → Videos de TikTok.
  💖 #tweetposts → Posts de Twitter/X.
  💫 #ytsearch / #yts → Videos de YouTube.
  ✨ #githubsearch → Usuarios de GitHub.
  🌷 #cuevana / #cuevanasearch → Películas/series.
  💖 #google → Búsquedas en Google.
  🌸 #pin / #pinterest → Imágenes en Pinterest.
  💚 #imagen / #image → Imágenes en Google.
  🌻 #animesearch / #animess → Animes (tioanime).
  💜 #animei / #animeinfo → Capítulos de anime.
  💫 #infoanime → Información anime/manga.
  🌷 #hentaisearch / #searchhentai → Hentai.
  ✨ #xnxxsearch / #xnxxs → Videos de Xnxx.
  🌸 #xvsearch / #xvideossearch → Videos de Xvideos.
  💖 #pornhubsearch / #phsearch → Videos de Pornhub.
  💚 #npmjs → Paquetes npmjs.

🌸 *『 Descargas 』* 🌸
❀ Comandos para descargar contenido.
  💖 #tiktok / #tt → Videos de TikTok.
  🌷 #mediafire / #mf → Archivos de MediaFire.
  ✨ #pinvid / #pinvideo → Videos de Pinterest.
  💚 #mega / #mg → Archivos de MEGA.
  💖 #play / #play2 → Música/video de YouTube.
  🌸 #ytmp3 / #ytmp4 → Música/video de YouTube (URL).
  💫 #fb / #facebook → Videos de Facebook.
  🌷 #twitter / #x → Videos de Twitter/X.
  ✨ #ig / #instagram → Contenido de Instagram.
  💚 #tts → Videos de TikTok (texto a voz).
  🌷 #terabox / #tb → Archivos por Terabox.
  💖 #gdrive / #drive → Archivos de Google Drive.
  🌸 #ttimg / #ttmp3 → Fotos/audios de TikTok.
  💫 #gitclone → Repositorio de GitHub.

💖 *『 Economía 』* 💖
❀ Comandos para juegos de economía y RPG.
  💖 #w / #work → Trabajar.
  🌷 #slut / #protituirse → Trabajar (adulto).
  ✨ #cf / #suerte → Apuesta de monedas.
  🌸 #crime / #crimen → Robar.
  💫 #ruleta → Apuesta en ruleta.
  💚 #casino / #apostar → Apuesta en casino.
  🌷 #slot → Apuesta en tragamonedas.
  ✨ #cartera / #wallet → Ver monedas.
  🌸 #banco / #bank → Ver monedas en el banco.
  💖 #deposit / #depositar → Depositar monedas.
  🌿 ᰔᩚ #with / #retirar / #withdraw → Retirar del banco.
  🍃 ᰔᩚ #transfer / #pay → Transferir monedas/XP.
  🌱 ᰔᩚ #miming / #minar / #mine → Minar recursos.
  🍀 ᰔᩚ #buyall / #buy → Comprar con XP.
  🌸 ᰔᩚ #daily / #diario → Recompensa diaria.
  🌿 ᰔᩚ #cofre → Cofre diario.
  🍃 ᰔᩚ #weekly / #semanal → Regalo semanal.
  🌱 ᰔᩚ #monthly / #mensual → Recompensa mensual.
  🍀 ᰔᩚ #steal / #robar / #rob → Robar monedas.
  🌸 ᰔᩚ #robarxp / #robxp → Robar XP.
  🌿 ᰔᩚ #eboard / #baltop → Ranking de monedas.
  🍃 ᰔᩚ #aventura / #adventure → Aventurarse.
  🌱 ᰔᩚ #curar / #heal → Curar salud.
  🍀 ᰔᩚ #cazar / #hunt / #berburu → Cazar animales.
  🌸 ᰔᩚ #inv / #inventario → Ver inventario.
  🌿 ᰔᩚ #mazmorra / #explorar → Explorar mazmorras.
  🍃 ᰔᩚ #halloween → Dulce o truco (Halloween).
  🌱 ᰔᩚ #christmas / #navidad → Regalo navideño.

✨ *『 Gacha 』* ✨
❀ Comandos para coleccionar personajes.
  🌿 ᰔᩚ #rollwaifu / #rw / #roll → Waifu/Husbando aleatorio.
  🍃 ᰔᩚ #claim / #c / #reclamar → Reclamar personaje.
  🌱 ᰔᩚ #harem / #waifus / #claims → Ver personajes reclamados.
  🍀 ᰔᩚ #charimage / #waifuimage / #wimage → Imagen de personaje.
  🌸 ᰔᩚ #charinfo / #winfo / #waifuinfo → Información de personaje.
  🌿 ᰔᩚ #givechar / #givewaifu / #regalar → Regalar personaje.
  🍃 ᰔᩚ #vote / #votar → Votar por personaje.
  🌱 ᰔᩚ #waifusboard / #waifustop / #topwaifus → Top de personajes.

✨ *『 Stickers 』* ✨
❀ Comandos para crear y gestionar stickers.
  🌿 ᰔᩚ #sticker / #s → Crear sticker.
  🍃 ᰔᩚ #setmeta → Establecer pack y autor.
  🌱 ᰔᩚ #delmeta → Eliminar pack.
  🍀 ᰔᩚ #pfp / #getpic → Obtener foto de perfil.
  🌸 ᰔᩚ #qc → Sticker con texto/usuario.
  🌿 ᰔᩚ #toimg / #img → Sticker a imagen.
  🍃 ᰔᩚ #brat / #ttp / #attp → Sticker con texto.
  🌱 ᰔᩚ #emojimix → Fusionar emojis.
  🍀 ᰔᩚ #wm → Cambiar nombre de sticker.

✨ *『 Herramientas 』* ✨
❀ Comandos con diversas utilidades.
  🌿 ᰔᩚ #calcular / #cal → Calcular ecuaciones.
  🍃 ᰔᩚ #tiempo / #clima → Clima de un país.
  🌱 ᰔᩚ #horario → Horario global.
  🍀 ᰔᩚ #fake / #fakereply → Mensaje falso.
  🌸 ᰔᩚ #enhance / #remini / #hd → Mejorar imagen.
  🌿 ᰔᩚ #letra → Cambiar fuente.
  🍃 ᰔᩚ #read / #readviewonce / #ver → Ver imágenes de un solo uso.
  🌱 ᰔᩚ #whatmusic / #shazam → Identificar música.
  🍀 ᰔᩚ #spamwa / #spam → Enviar spam.
  🌸 ᰔᩚ #ss / #ssweb → Estado de una web.
  🌿 ᰔᩚ #length / #tamaño → Cambiar tamaño de archivos.
  🍃 ᰔᩚ #say / #decir + [texto] → Repetir mensaje.
  🌱 ᰔᩚ #todoc / #toducument → Crear documentos.
  🍀 ᰔᩚ #translate / #traducir / #trad → Traducir idiomas.

✨ *『 Perfil 』* ✨
❀ Comandos para gestionar tu perfil.
  🌿 ᰔᩚ #reg / #verificar / #register → Registrarse.
  🍃 ᰔᩚ #unreg → Eliminar registro.
  🌱 ᰔᩚ #profile → Mostrar perfil.
  🍀 ᰔᩚ #marry [mención] → Proponer matrimonio.
  🌸 ᰔᩚ #divorce → Divorciarse.
  🌿 ᰔᩚ #setgenre / #setgenero → Establecer género.
  🍃 ᰔᩚ #delgenre / #delgenero → Eliminar género.
  🌱 ᰔᩚ #setbirth / #setnacimiento → Establecer fecha de nacimiento.
  🌸💫 #delbirth / #delnacimiento → Eliminar fecha de nacimiento.
  🌼💬 #setdescription / #setdesc → Establecer descripción.
  🌷❌ #deldescription / #deldesc → Eliminar descripción.
  🌟🏅 #lb / #lboard + <Paginá> → Ranking de nivel.
  🔢🏆 #level / #lvl + <@Mencion> → Ver nivel.
  💎💥 #comprarpremium / #premium → Comprar Premium.
  💌🤫 #confesiones / #confesar → Enviar confesión anónima.

🌺 *『 Grupos 』* 🌺
❀ Comandos para la administración de grupos.
  🌸🛠 #config / #on → Configuración del grupo.
  🌟🌍 #hidetag → Mencionar a todos.
  🌸📊 #gp / #infogrupo → Información del grupo.
  🌷👥 #linea / #listonline → Usuarios en línea.
  🌸👋 #setwelcome → Mensaje de bienvenida.
  💬💔 #setbye → Mensaje de despedida.
  🔗💬 #link → Enlace del grupo.
  🛡️🔑 #admins / #admin → Mencionar admins.
  🔄🖋️ #restablecer / #revoke → Restablecer enlace.
  💬🌐 #grupo / #group [abrir] → Abrir grupo.
  🚫👑 #grupo / #group [cerrar] → Cerrar grupo.
  🚪❌ #kick [mención] → Expulsar usuario.
  ➕👥 #add / #añadir / #agregar [número] → Invitar usuario.
  🎉💼 #promote [mención] → Dar admin.
  📉🔽 #demote [mención] → Quitar admin.
  🖼️🎨 #gpbanner / #groupimg → Cambiar imagen.
  🏷️💬 #gpname / #groupname → Cambiar nombre.
  📄🖊️ #gpdesc / #groupdesc → Cambiar descripción.
  ⚠️👤 #advertir / #warn / #warning → Advertir usuario.
  ❌⚠️ #unwarn / #delwarn → Quitar advertencia.
  📝📋 #advlist / #listadv → Lista de advertencias.
  💡🟢 #bot on → Encender bot en el grupo.
  🟢🔴 #bot off → Apagar bot en el grupo.
  🚫💬 #mute [mención] → Silenciar usuario.
  🔓📣 #unmute [mención] → Desilenciar usuario.
  📊🗳️ #encuesta / #poll → Crear encuesta.
  ❌🗑️ #delete / #del → Eliminar mensaje.
  👻🕵️ #fantasmas → Usuarios inactivos.
  🚪❗ #kickfantasmas → Expulsar inactivos.
  🔖📢 #invocar / #tagall / #todos → Invocar a todos.
  🎭🔄 #setemoji / #setemo → Cambiar emoji de invitación.
  🔢🌍 #listnum / #kicknum → Expulsar por prefijo.

🌸 *『 Anime 』* 🌸
❀ Comandos de reacciones de anime.
  😡💥 #angry / #enojado + <mención> → Estar enojado.
  👾💋 #bite + <mención> → Morder.
  😜👅 #bleh + <mención> → Sacar la lengua.
  😊💖 #blush + <mención> → Sonrojarse.
  😑🔕 #bored / #aburrido + <mención> → Aburrirse.
  😭💔 #cry + <mención> → Llorar.
  🤗❤️ #cuddle + <mención> → Acurrucarse.
  💃🔥 #dance + <mención> → Bailar.
  🍻💫 #drunk + <mención> → Estar borracho.
  🍔🤤 #eat / #comer + <mención> → Comer.
  🤦‍♀️🙄 #facepalm + <mención> → Facepalm.
  🎉😄 #happy / #feliz + <mención> → Estar feliz.
  🤗🌸 #hug + <mención> → Abrazar.
  👶💫 #impregnate / #preg + <mención> → Embarazar.
  🔪💥 #kill + <mención> → Matar.
  💋🌹 #kiss / #besar / #kiss2 + <mención> → Besar.
  😂🎉 #laugh + <mención> → Reír.
  👅😋 #lick + <mención> → Lamer.
  ❤️🔥 #love / #amor + <mención> → Amar.
  🖤🤗 #pat + <mención> → Acariciar.
  👋💥 #poke + <mención> → Picar.
  😤💢 #pout + <mención> → Hacer pucheros.
  👊💥 #punch + <mención> → Golpear.
  🏃💨 #run + <mención> → Correr.
  😢💔 #sad / #triste + <mención> → Estar triste.
  😱💨 #scared + <mención> → Asustarse.
  💋✨ #seduce + <mención> → Seducir.
  🙈💖 #shy / #timido + <mención> → Ser tímido.
  👋😱 #slap + <mención> → Dar una bofetada.
  🌅🌙 #dias / #days → Dar los buenos días.
  🌙💤 #noches / #nights → Dar las buenas noches.
  💤🌙 #sleep + <mención> → Dormir.
  🚬💨 #smoke + <mención> → Fumar.
  🧠🔍 #think + <mención> → Pensar.

🖤 *『 NSFW 』* 🖤
❀ Comandos para adultos (NSFW).
  🚫👀 #anal + <mención> → Hacer un anal.
  🍑💋 #waifu → Buscar waifu.
  🛁🚿 #bath + <mención> → Bañarse.
  💋🔥 #blowjob / #mamada / #bj + <mención> → Dar una mamada.
  🍒💥 #boobjob + <mención> → Hacer una rusa.
  💦💔 #cum + <mención> → Venirse.
  🍑🔥 #fap + <mención> → Masturbarse.
  💕💑 #ppcouple / #ppcp → Generar fotos de pareja.
  👣🔥 #footjob + <mención> → Footjob.
  💣💋 #fuck / #coger / #fuck2 + <mención> → Follar.
  ☕💏 #cafe / #coffe → Tomar café.
  ❌💔 #violar / #perra + <mención> → Violar.
  👀💦 #grabboobs + <mención> → Agarrar tetas.
  🤲🔥 #grop + <mención> → Manosear.
  👅💥 #lickpussy + <mención> → Lamer coño.
  🌐🔞 #rule34 / #r34 + [Tags] → Buscar en Rule34.
  💥💋 #sixnine / #69 + <mención> → Hacer un 69.
  🍑💢 #spank / #nalgada + <mención> → Dar una nalgada.
  🍓👅 #suckboobs + <mención> → Chupar tetas.
  🔓👙 #undress / #encuerar + <mención> → Desnudar.
  💋❤️ #yuri / #tijeras + <mención> → Hacer tijeras.

🎲 *『 Juegos 』* 🎲
❀ Comandos para divertirse jugando.
  🤝🎮 #amistad / #amigorandom → Hacer amigos.
  🧥✋ #chaqueta / #jalamela → Hacerse una chaqueta.
  😂🎤 #chiste → Contar un chiste.
  💡💬 #consejo → Dar un consejo.
  👀💣 #doxeo / #doxear + <mención> → Simular doxeo.
  📊⚡ #facto → Lanzar un dato curioso.
  📝💖 #formarpareja → Formar pareja.
  💏🌟 #formarpareja5 → Formar 5 parejas.
  💬📜 #frase → Dar una frase.
  🥚😜 #huevo → Agarrar el huevo.
  💋👀 #chupalo + <mención> → Chuparlo.
  👏🎉 #aplauso + <mención> → Aplaudir.
  🟤🤪 #marron + <mención> → Burlarse del color de piel.
  💔🔫 #suicidar → Suicidarse.
  🧠🎓 #iq / #iqtest + <mención> → Calcular IQ.
  💥 #meme → Enviar meme aleatorio.
  ⚡ #morse → Convertir a código morse.
  👾 #nombreninja → Buscar nombre ninja.
  💨 #paja / #pajeame → Hacer una paja.
  💬 #personalidad + <mencion> → Buscar personalidad.
  💖 #piropo → Lanzar un piropo.
  ❓ #pregunta → Hacer una pregunta.
  💑 #ship / #pareja → Probabilidad de enamorarse.
  🎉 #sorteo → Empezar sorteo.
  🔥 #top → Empezar top de personas.
  🍑 #formartrio + <mencion> → Formar trío.
  🧠 #ahorcado → Jugar ahorcado.
  🧞‍♂️ #genio → Preguntar al genio.
  📐 #mates / #matematicas → Resolver problemas.
  ✋ #ppt → Jugar piedra, papel o tijeras.
  🔤 #sopa / #buscarpalabra → Jugar sopa de letras.
  ⚔️ #pvp / #suit + <mencion> → Jugar PVP.
  🎮 #ttt → Crear sala de juego.
  `.trim()

  await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
          mentionedJid: [m.sender, userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channelRD.id,
              newsletterName: channelRD.name,
              serverMessageId: -1,
          },
          forwardingScore: 9.,
          externalAdReply: {
              title: botname,
              body: textbot,
              thumbnailUrl: banner,
              sourceUrl: redes,
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

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}
